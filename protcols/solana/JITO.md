# Jito Liquid Staking — Methods & Integration Reference

## Contract Addresses (Solana Mainnet)

| Name | Address |
|------|---------|
| Jito Stake Pool | `Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb` |
| Jito Stake Pool Program | `SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy` |
| jitoSOL Mint | `J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn` |
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Associated Token Program | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` |
| NEAR MPC Signer | `v1.signer` (NEAR Mainnet) |
| Intents Contract | `intents.near` (NEAR Mainnet) |
| Derivation Path | `solana-1` |

---

## NEAR Intents Methods

### 1. `depositNearAsMultiToken`
Wraps NEAR and deposits into `intents.near` via `ft_transfer_call` on `wrap.near`.

```ts
depositNearAsMultiToken(accountId, amount, callMethod)
```

- **amount**: in yoctoNEAR (24 decimals)
- **result**: wNEAR balance appears in intents

---

### 2. `getQuote` (1Click API)
Fetches a swap or withdrawal quote from the 1Click solver network.

```ts
const quote = await getQuote({
  originAsset: "nep141:wrap.near",         // or "nep141:sol.omft.near"
  destinationAsset: "nep141:sol.omft.near", // or "solana:So111..."
  amount: toSmallestUnit(amount, decimals),
  recipient: derivedSolanaAddress,          // only for withdrawals
  recipientType: "DESTINATION_CHAIN",       // only for withdrawals
})
```

Used in:
- **Step 2**: swap wNEAR → SOL inside intents
- **Step 3**: withdraw SOL from intents → derived Solana address

---

### 3. `transferMultiTokenForQuote`
Executes a quote — transfers the intent asset to the solver.

```ts
transferMultiTokenForQuote(accountId, quote, "nep141:wrap.near", callMethod)
```

---

### 4. `waitUntilQuoteExecutionCompletes`
Polls until the 1Click solver has settled the quote on-chain.

```ts
await waitUntilQuoteExecutionCompletes(quote)
```

---

## NEAR Chain Signatures Methods

### 5. `getDerivedPublicKey` (v1.signer)
Derives a deterministic Solana public key from a NEAR account using MPC.

```ts
const raw = await MPC_CONTRACT.getDerivedPublicKey({
  path: "solana-1",
  predecessor: accountId,
  IsEd25519: true,
})
// raw = "04{64 hex chars}" — strip "04" prefix to get 32-byte Ed25519 key
const keyBytes = Buffer.from(raw.slice(2), "hex")
const solanaAddress = new PublicKey(keyBytes).toBase58()
```

---

### 6. `MPC_CONTRACT.sign` (v1.signer)
Signs a Solana transaction via NEAR MPC without needing a Solana private key.

```ts
const rsvSignatures = await MPC_CONTRACT.sign({
  payloads: [transaction.serializeMessage()],
  path: "solana-1",
  keyType: "Eddsa",
  signerAccount: {
    accountId,
    signAndSendTransactions: (params) => callMethods(mapChainSigTxs(params.transactions)),
  },
})
```

---

## Solana Methods

### 7. `getStakePoolAccount` (@solana/spl-stake-pool)
Fetches live Jito stake pool state — pool mint, reserve stake, manager fee account, etc.

```ts
const stakePoolAccount = await getStakePoolAccount(connection, JITO_STAKE_POOL_ADDRESS)
const sp = stakePoolAccount.account.data
// sp.poolMint, sp.reserveStake, sp.managerFeeAccount, sp.solDepositAuthority
```

---

### 8. `PublicKey.findProgramAddress` — Withdraw Authority PDA
Derives the stake pool's withdraw authority PDA using Jito's program ID.

```ts
const [withdrawAuthority] = await PublicKey.findProgramAddress(
  [JITO_STAKE_POOL_ADDRESS.toBuffer(), Buffer.from("withdraw")],
  JITO_PROGRAM_ID,
)
```

---

### 9. `getAssociatedTokenAddressSync` — jitoSOL ATA
Derives the Associated Token Account (ATA) address for jitoSOL at the derived Solana address.

```ts
const jitoSolAta = getAssociatedTokenAddressSync(sp.poolMint, fromPubkey)
```

The ATA is a deterministic address: seeds = `[wallet, TOKEN_PROGRAM, mint]` under `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bRS`.

---

### 10. `createAssociatedTokenAccountIdempotentInstruction`
Creates the jitoSOL ATA if it doesn't exist yet (no-op if already created). Costs ~0.002 SOL rent one time.

```ts
createAssociatedTokenAccountIdempotentInstruction(
  fromPubkey,  // payer
  jitoSolAta,  // ATA address
  fromPubkey,  // owner
  sp.poolMint, // jitoSOL mint
)
```

---

### 11. `depositSol` — Jito Stake Instruction (manual)
Instruction index `14` on Jito's stake pool program. Transfers SOL from the derived address into the pool and mints jitoSOL to the ATA.

```
Account layout (depositSol):
  0. Stake pool account          [writable]
  1. Withdraw authority PDA      []
  2. Reserve stake account       [writable]
  3. Funding account (signer)    [signer, writable]
  4. jitoSOL ATA (destination)   [writable]
  5. Manager fee account         [writable]
  6. Referral token account      [writable]
  7. Pool mint                   [writable]
  8. System Program              []
  9. Token Program               []
 10. (optional) Sol deposit auth [signer]
```

```ts
const depositData = Buffer.alloc(9)
depositData.writeUInt8(14, 0)                          // instruction index
depositData.writeBigUInt64LE(BigInt(lamports), 1)      // amount as u64 LE

new TransactionInstruction({ programId: JITO_PROGRAM_ID, keys: [...], data: depositData })
```

> **Note:** Do NOT include `SYSVAR_CLOCK` or `SYSVAR_STAKE_HISTORY` in `depositSol` — those belong to `depositStake`. Including them shifts `SystemProgram` and `TokenProgram` to wrong positions causing `incorrect program id for instruction`.

---

### 12. `withdrawSol` (@solana/spl-stake-pool)
Burns jitoSOL from the ATA and returns SOL to the derived address instantly from Jito's reserve pool.

```ts
const { instructions, signers } = await solanaStakePool.withdrawSol(
  connection,
  JITO_STAKE_POOL_ADDRESS,
  derivedPubkey,  // tokenOwner
  derivedPubkey,  // solReceiver
  solAmount,
)
```

The ephemeral signer in `signers[0]` is extracted and its public key injected into the transaction before MPC signing.

---

### 13. `connection.getBalance`
Fetches on-chain SOL balance of the derived address (in lamports).

```ts
const lamports = await connection.getBalance(new PublicKey(derivedSolAddress))
const sol = lamports / 1e9
```

---

### 14. `connection.getTokenAccountBalance`
Fetches jitoSOL balance from the ATA. Used in the unstake section and portfolio.

```ts
const info = await connection.getTokenAccountBalance(jitoSolAta)
// info.value.uiAmountString → e.g. "0.003886741"
```

> **RPC Note:** `solana.publicnode.com` supports this method. `getParsedTokenAccountsByOwner` returns `-32601 Method not found` on this RPC — do not use it.

---

### 15. `SolanaAdapter.broadcastTx`
Broadcasts the MPC-signed Solana transaction to mainnet.

```ts
const txHash = await SolanaAdapter.broadcastTx(finalizedTx)
```

---

## Staking Requirements

- Derived Solana address needs **≥ 0.005 SOL** on-chain before staking
- **~0.002 SOL** reserved for jitoSOL ATA creation (one-time rent)
- Minimum stake: **0.001 SOL** + transaction fees (~0.000005 SOL)
- If balance is too low, withdraw more SOL from intents first (Step 3)

---

## Token Decimals

| Token | Decimals | Unit |
|-------|----------|------|
| NEAR / wNEAR | 24 | yoctoNEAR |
| SOL (intents) | 9 | lamports |
| jitoSOL | 9 | lamports |

---

## Live Demo

- **NEAR Account**: `nexchangenear.near`
- **Derived Solana Address**: `GsAdKryuJs7BQDugbuxKn5EzR7PY7Gfd1FsmrKMMQTEc`
- **Derivation Path**: `solana-1`
- **Confirmed Stake Tx**: `4cM874RBuoyJwmr8t28KKDgNtRAntNZCAN7NYMQfTudkyA5aemSaFUhPTpP4LfDNxwh4LXGC4oxmtgNx79L4vuV4`
- **jitoSOL received**: `0.003886741 jitoSOL` at ATA `CZ123dSgCLdCzqhr3NJrWpZXXWXwAgFWCCAZKWC7KAX8`
