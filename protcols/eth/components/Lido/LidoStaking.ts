// Lido (stETH) standalone deposit / withdraw functions.
//
// Deposit  : ETH -> stETH via Lido `submit`.
// Withdraw : stETH -> ETH via the Withdrawal Queue (request -> wait -> claim).
//            Unstaking is a two-step async process: `requestWithdrawal` mints an
//            unstETH NFT, and after the request is finalized `claimWithdrawal`
//            redeems the ETH. There is no instant unstake on Lido itself.

import Web3 from 'web3'

// --- Mainnet addresses ---
export const LIDO_STETH_ADDRESS = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'
export const LIDO_WITHDRAWAL_QUEUE_ADDRESS =
  '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1'

// stETH `submit` + ERC20 `approve` (minimal)
const STETH_ABI = [
  {
    constant: false,
    inputs: [{ name: '_referral', type: 'address' }],
    name: 'submit',
    outputs: [{ name: '', type: 'uint256' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// Withdrawal Queue (minimal: request / claim / read)
const WITHDRAWAL_QUEUE_ABI = [
  {
    inputs: [
      { name: '_amounts', type: 'uint256[]' },
      { name: '_owner', type: 'address' },
    ],
    name: 'requestWithdrawals',
    outputs: [{ name: 'requestIds', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'getWithdrawalRequests',
    outputs: [{ name: 'requestsIds', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_requestId', type: 'uint256' },
      { name: '_hint', type: 'uint256' },
    ],
    name: 'claimWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_requestIds', type: 'uint256[]' },
      { name: '_firstIndex', type: 'uint256' },
      { name: '_lastIndex', type: 'uint256' },
    ],
    name: 'findCheckpointHints',
    outputs: [{ name: 'hintIds', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLastCheckpointIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Deposit (stake) ETH into Lido and receive stETH.
 *
 * @param web3        Web3 instance connected to a signer.
 * @param userAddress Staker address (tx sender).
 * @param amount      Amount of ETH to stake (decimal string, e.g. "0.5").
 * @param referral    Optional referral address (defaults to zero address).
 * @returns Transaction hash.
 */
export async function depositLido(
  web3: Web3,
  userAddress: string,
  amount: string,
  referral: string = ZERO_ADDRESS
): Promise<string> {
  const steth = new web3.eth.Contract(STETH_ABI as any, LIDO_STETH_ADDRESS)
  const value = web3.utils.toWei(amount, 'ether')

  const tx = await steth.methods
    .submit(referral)
    .send({ from: userAddress, value })

  return tx.transactionHash
}

/**
 * Withdraw step 1: request to unstake stETH. Approves the queue to pull the
 * stETH, then enqueues a withdrawal request (an unstETH NFT is minted).
 *
 * @param amount Amount of stETH to unstake (decimal string). Single request;
 *               Lido caps a single request at 1000 stETH.
 * @returns Transaction hash. Read back request ids via `getLidoWithdrawalRequests`.
 */
export async function requestWithdrawalLido(
  web3: Web3,
  userAddress: string,
  amount: string
): Promise<string> {
  const amountWei = web3.utils.toWei(amount, 'ether')

  // 1) approve the withdrawal queue to spend stETH
  const steth = new web3.eth.Contract(STETH_ABI as any, LIDO_STETH_ADDRESS)
  await steth.methods
    .approve(LIDO_WITHDRAWAL_QUEUE_ADDRESS, amountWei)
    .send({ from: userAddress })

  // 2) enqueue the withdrawal request
  const queue = new web3.eth.Contract(
    WITHDRAWAL_QUEUE_ABI as any,
    LIDO_WITHDRAWAL_QUEUE_ADDRESS
  )
  const tx = await queue.methods
    .requestWithdrawals([amountWei], userAddress)
    .send({ from: userAddress })

  return tx.transactionHash
}

/**
 * Read all pending/claimable withdrawal request ids owned by an address.
 */
export async function getLidoWithdrawalRequests(
  web3: Web3,
  userAddress: string
): Promise<string[]> {
  const queue = new web3.eth.Contract(
    WITHDRAWAL_QUEUE_ABI as any,
    LIDO_WITHDRAWAL_QUEUE_ADDRESS
  )
  const ids: string[] = await queue.methods
    .getWithdrawalRequests(userAddress)
    .call()
  return ids
}

/**
 * Withdraw step 2: claim ETH for a finalized request id. The checkpoint hint is
 * resolved on-chain via `findCheckpointHints` before claiming.
 *
 * @param requestId The unstETH request id (from `getLidoWithdrawalRequests`).
 * @returns Transaction hash.
 */
export async function claimWithdrawalLido(
  web3: Web3,
  userAddress: string,
  requestId: string | number
): Promise<string> {
  const queue = new web3.eth.Contract(
    WITHDRAWAL_QUEUE_ABI as any,
    LIDO_WITHDRAWAL_QUEUE_ADDRESS
  )

  const lastIndex: string = await queue.methods
    .getLastCheckpointIndex()
    .call()
  const hints: string[] = await queue.methods
    .findCheckpointHints([requestId.toString()], '1', lastIndex)
    .call()

  const tx = await queue.methods
    .claimWithdrawal(requestId.toString(), hints[0])
    .send({ from: userAddress })

  return tx.transactionHash
}
