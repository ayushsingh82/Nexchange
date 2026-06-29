# EtherFi Liquid Staking — Methods & Integration Reference

## Contract Addresses (Ethereum Mainnet)

| Name | Address |
|------|---------|
| EtherFi LiquidityPool | `0x308861A430be4cce5502d0A12724771Fc6DaF216` |
| eETH Token | `0x35fA164735182de50811E8e2E824cFb9B6118ac2` |
| weETH (Wrapped eETH) | `0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee` |
| NEAR MPC Signer | `v1.signer` (NEAR Mainnet) |
| Intents Contract | `intents.near` (NEAR Mainnet) |
| ETH RPC | `https://ethereum.publicnode.com` |
| Derivation Path | `ethereum-1` |
| Key Type | `Ecdsa` (secp256k1) |

---

## Function Selectors

| Function | Selector | Contract |
|----------|----------|---------|
| `deposit()` | `0xd0e30db0` | LiquidityPool |
| `approve(address,uint256)` | `0x095ea7b3` | eETH |
| `requestWithdraw(address,uint256)` | `0x745400c9` | LiquidityPool |
| `balanceOf(address)` | `0x70a08231` | eETH |

---

## Full Flow (Stake ETH on EtherFi from NEAR)

### Step 1 — Deposit NEAR to intents.near

Wrap NEAR and deposit to `intents.near` via batch transaction on `wrap.near`.

```ts
await depositNearAsMultiToken(accountId, amount, callMethodBatch)
// internally: near_deposit + ft_transfer_call in one batch
```

---

### Step 2 — Swap NEAR → ETH inside intents

```ts
const quote = await getQuote({
  originAsset: "nep141:wrap.near",
  destinationAsset: "nep141:eth.omft.near",
  amount: toSmallestUnit(swapAmount, 24), // 24 decimals
  accountId,
})
await transferMultiTokenForQuote(accountId, quote, "nep141:wrap.near", callMethod)
await waitUntilQuoteExecutionCompletes(quote)
```

---

### Step 3 — Withdraw ETH from intents → derived Ethereum address

```ts
const quote = await getQuote({
  originAsset: "nep141:eth.omft.near",
  destinationAsset: "eth:0x0000000000000000000000000000000000000000",
  amount: toSmallestUnit(withdrawAmount, 18), // 18 decimals
  accountId,
  recipient: derivedEthAddress,
  recipientType: "DESTINATION_CHAIN",
})
await transferMultiTokenForQuote(accountId, quote, "nep141:eth.omft.near", callMethod)
await waitUntilQuoteExecutionCompletes(quote)
```

---

### Step 4 — Derive Ethereum Address via NEAR Chain Signatures

Uses `chainsig.js` EVM adapter with `v1.signer` MPC. Key type is **Ecdsa** (secp256k1), not EdDSA.

```ts
import { chainAdapters, contracts } from "chainsig.js"
import { createPublicClient, http } from "viem"
import { mainnet } from "viem/chains"

const publicClient = createPublicClient({ chain: mainnet, transport: http(ETH_RPC) })
const MPC = new contracts.ChainSignatureContract({ networkId: "mainnet", contractId: "v1.signer" })
const EVMAdapter = new chainAdapters.evm.EVM({ publicClient, contract: MPC })

const { address: ethAddress } = await EVMAdapter.deriveAddressAndPublicKey(accountId, "ethereum-1")
// ethAddress = deterministic 0x... address derived from NEAR account + path
```

---

### Step 5 — Sign & Broadcast EtherFi deposit() Transaction

```ts
// Build transaction
const txRequest = {
  from: ethAddress,
  to: "0x308861A430be4cce5502d0A12724771Fc6DaF216", // LiquidityPool
  value: parseEther(stakeAmount),
  data: "0xd0e30db0", // deposit() selector
}

// Prepare for signing — fetches nonce, gas, fee data
const { transaction, hashesToSign } = await EVMAdapter.prepareTransactionForSigning(txRequest)

// Sign via NEAR MPC
const rsvSignatures = await MPC.sign({
  payloads: hashesToSign,
  path: "ethereum-1",
  keyType: "Ecdsa",
  signerAccount: { accountId, signAndSendTransactions: ... },
})

// Assemble + broadcast
const serialized = EVMAdapter.finalizeTransactionSigning({ transaction, rsvSignatures })
const { hash } = await EVMAdapter.broadcastTx(serialized)
// hash = Ethereum tx hash
```

**Result:** eETH minted and sent to the derived Ethereum address.

---

## Staking Requirements

- Derived Ethereum address needs **≥ 0.001 ETH** on-chain
- Gas fees: ~0.001–0.003 ETH (varies with network congestion)
- Minimum stake: **0.001 ETH**

---

## Unstake Flow (eETH → ETH)

Unstaking from EtherFi is a 2-transaction flow — both signed via NEAR chain signatures.

### Transaction 1 — approve(liquidityPool, amount) on eETH

```ts
const amountHex = amount.toString(16).padStart(64, "0")
const spenderHex = ETHERFI_LIQUIDITY_POOL.replace("0x", "").padStart(64, "0")

const approveTxReq = {
  from: ethAddress,
  to: EETH_TOKEN,                                    // eETH contract
  data: "0x095ea7b3" + spenderHex + amountHex,       // approve(address,uint256)
  value: 0n,
}

const { transaction, hashesToSign } = await EVMAdapter.prepareTransactionForSigning(approveTxReq)
const rsvSignatures = await MPC.sign({ payloads: hashesToSign, path: "ethereum-1", keyType: "Ecdsa", ... })
const serialized = EVMAdapter.finalizeTransactionSigning({ transaction, rsvSignatures })
await EVMAdapter.broadcastTx(serialized)
```

### Transaction 2 — requestWithdraw(recipient, amount) on LiquidityPool

```ts
const recipientHex = ethAddress.replace("0x", "").padStart(64, "0")

const withdrawTxReq = {
  from: ethAddress,
  to: ETHERFI_LIQUIDITY_POOL,
  data: "0x745400c9" + recipientHex + amountHex,      // requestWithdraw(address,uint256)
  value: 0n,
}

const { transaction, hashesToSign } = await EVMAdapter.prepareTransactionForSigning(withdrawTxReq)
const rsvSignatures = await MPC.sign({ payloads: hashesToSign, path: "ethereum-1", keyType: "Ecdsa", ... })
const serialized = EVMAdapter.finalizeTransactionSigning({ transaction, rsvSignatures })
const { hash } = await EVMAdapter.broadcastTx(serialized)
```

**Result:** A withdrawal NFT is created. After EtherFi processes the request (~1–2 days), ETH can be claimed via their app or by calling `claimWithdraw(requestId)`.

---

## eETH Balance Check

Raw `eth_call` to avoid RPC method restrictions:

```ts
const data = "0x70a08231" + ethAddress.replace("0x", "").padStart(64, "0") // balanceOf(address)
const res = await fetch(ETH_RPC, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0", id: 1,
    method: "eth_call",
    params: [{ to: EETH_TOKEN, data }, "latest"],
  }),
})
const json = await res.json()
const balance = BigInt(json.result) // in wei (18 decimals)
```

---

## Token Decimals

| Token | Decimals | Unit |
|-------|----------|------|
| NEAR / wNEAR | 24 | yoctoNEAR |
| ETH (intents) | 18 | wei |
| eETH | 18 | wei |

---

## Key Differences vs Jito (Solana)

| | Jito (Solana) | EtherFi (Ethereum) |
|--|--|--|
| Key type | EdDSA (Ed25519) | ECDSA (secp256k1) |
| Derivation path | `solana-1` | `ethereum-1` |
| chainsig.js adapter | `chainAdapters.solana` | `chainAdapters.evm.EVM` |
| Signing lib | `@solana/web3.js` | `viem` + `chainsig.js` |
| Stake function | Manual instruction (index 14) | `deposit()` — simple payable |
| Unstake | Single tx `withdrawSol` | 2 tx: `approve` + `requestWithdraw` |
| Unstake speed | Instant (from reserve) | ~1–2 days processing |
