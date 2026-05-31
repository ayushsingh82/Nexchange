// ether.fi (eETH) standalone deposit / withdraw functions.
//
// Deposit  : ETH -> eETH via LiquidityPool `deposit` (payable).
// Withdraw : eETH -> ETH via the WithdrawRequestNFT (request -> wait -> claim).
//            Like Lido, unstaking is a two-step async process: `requestWithdraw`
//            mints a withdraw-request NFT, and after it is finalized
//            `claimWithdraw` redeems the ETH.

import Web3 from 'web3'

// --- Mainnet addresses ---
export const ETHERFI_LIQUIDITY_POOL_ADDRESS =
  '0x308861A430be4cce5502d0A12724771Fc6DaF216'
export const EETH_ADDRESS = '0x35fA164735182de50811E8e2E824cFb9B6118ac2'
export const ETHERFI_WITHDRAW_NFT_ADDRESS =
  '0x7d5706f6ef3F89B3951E23e557CDFBC3239D4E2c'

const LIQUIDITY_POOL_ABI = [
  {
    inputs: [],
    name: 'deposit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'requestWithdraw',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// eETH ERC20 `approve` (minimal)
const EETH_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// WithdrawRequestNFT (minimal: claim + finalized check)
const WITHDRAW_NFT_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'claimWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'requestId', type: 'uint256' }],
    name: 'isFinalized',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * Deposit (stake) ETH into ether.fi and receive eETH (1:1 with staked ETH).
 *
 * @param web3        Web3 instance connected to a signer.
 * @param userAddress Staker address (tx sender).
 * @param amount      Amount of ETH to stake (decimal string, e.g. "0.5").
 * @returns Transaction hash.
 */
export async function depositEtherFi(
  web3: Web3,
  userAddress: string,
  amount: string
): Promise<string> {
  const pool = new web3.eth.Contract(
    LIQUIDITY_POOL_ABI as any,
    ETHERFI_LIQUIDITY_POOL_ADDRESS
  )
  const value = web3.utils.toWei(amount, 'ether')

  const tx = await pool.methods.deposit().send({ from: userAddress, value })

  return tx.transactionHash
}

/**
 * Withdraw step 1: request to unstake eETH. Approves the liquidity pool to pull
 * the eETH, then enqueues a withdraw request (a WithdrawRequestNFT is minted).
 *
 * @param amount Amount of eETH to unstake (decimal string).
 * @returns Transaction hash. The request id is the minted NFT token id (emitted
 *          in the receipt / readable from the WithdrawRequestNFT contract).
 */
export async function requestWithdrawEtherFi(
  web3: Web3,
  userAddress: string,
  amount: string
): Promise<string> {
  const amountWei = web3.utils.toWei(amount, 'ether')

  // 1) approve the liquidity pool to spend eETH
  const eeth = new web3.eth.Contract(EETH_ABI as any, EETH_ADDRESS)
  await eeth.methods
    .approve(ETHERFI_LIQUIDITY_POOL_ADDRESS, amountWei)
    .send({ from: userAddress })

  // 2) enqueue the withdraw request
  const pool = new web3.eth.Contract(
    LIQUIDITY_POOL_ABI as any,
    ETHERFI_LIQUIDITY_POOL_ADDRESS
  )
  const tx = await pool.methods
    .requestWithdraw(userAddress, amountWei)
    .send({ from: userAddress })

  return tx.transactionHash
}

/**
 * Check whether a withdraw request has been finalized and is claimable.
 */
export async function isEtherFiRequestFinalized(
  web3: Web3,
  requestId: string | number
): Promise<boolean> {
  const nft = new web3.eth.Contract(
    WITHDRAW_NFT_ABI as any,
    ETHERFI_WITHDRAW_NFT_ADDRESS
  )
  return nft.methods.isFinalized(requestId.toString()).call()
}

/**
 * Withdraw step 2: claim ETH for a finalized request id (burns the NFT).
 *
 * @param requestId The WithdrawRequestNFT token id from `requestWithdrawEtherFi`.
 * @returns Transaction hash.
 */
export async function claimWithdrawEtherFi(
  web3: Web3,
  userAddress: string,
  requestId: string | number
): Promise<string> {
  const nft = new web3.eth.Contract(
    WITHDRAW_NFT_ABI as any,
    ETHERFI_WITHDRAW_NFT_ADDRESS
  )

  const tx = await nft.methods
    .claimWithdraw(requestId.toString())
    .send({ from: userAddress })

  return tx.transactionHash
}
