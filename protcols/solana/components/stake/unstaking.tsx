// Unstaking JitoSOL back to SOL (Jito SPL stake pool)

import * as solanaStakePool from '@solana/spl-stake-pool'
import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js'

// JitoSOL stake pool address (Mainnet)
export const JITO_STAKE_POOL_ADDRESS = new PublicKey(
  'Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb'
)

// JitoSOL mint address
export const JITO_MINT_ADDRESS = new PublicKey(
  'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn'
)

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com'

type Wallet = {
  publicKey: PublicKey
  signTransaction: (tx: Transaction) => Promise<Transaction>
}

async function sendStakePoolTx(
  connection: Connection,
  wallet: Wallet,
  instructions: any[],
  signers: any[]
): Promise<string> {
  const transaction = new Transaction()
  transaction.add(...instructions)

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash('finalized')
  transaction.recentBlockhash = blockhash
  transaction.lastValidBlockHeight = lastValidBlockHeight
  transaction.feePayer = wallet.publicKey

  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }

  const signedTransaction = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  )

  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    'confirmed'
  )

  return signature
}

/**
 * Instant unstake: swap JitoSOL for SOL out of the pool's reserve (small fee).
 * Use this for an immediate withdrawal with no cooldown.
 *
 * @param amount     Amount of JitoSOL to redeem (in JitoSOL tokens, UI units).
 * @param userWallet Wallet adapter exposing `publicKey` and `signTransaction`.
 * @param connection Optional Solana connection (defaults to mainnet-beta).
 * @returns Transaction signature.
 */
export async function unstakeJitoSOLInstant(
  amount: number,
  userWallet: Wallet,
  connection: Connection = new Connection(DEFAULT_RPC, 'confirmed')
): Promise<string> {
  if (amount <= 0) throw new Error('Unstake amount must be greater than 0')

  const { instructions, signers } = await solanaStakePool.withdrawSol(
    connection,
    JITO_STAKE_POOL_ADDRESS,
    userWallet.publicKey, // token owner
    userWallet.publicKey, // SOL receiver
    amount
  )

  return sendStakePoolTx(connection, userWallet, instructions, signers)
}

/**
 * Delayed unstake: redeem JitoSOL into a native stake account that the user
 * then deactivates and withdraws after the cooldown epoch. No reserve fee.
 *
 * @param amount     Amount of JitoSOL to redeem (in JitoSOL tokens, UI units).
 * @param userWallet Wallet adapter exposing `publicKey` and `signTransaction`.
 * @param connection Optional Solana connection (defaults to mainnet-beta).
 * @returns Transaction signature.
 */
export async function unstakeJitoSOLToStakeAccount(
  amount: number,
  userWallet: Wallet,
  connection: Connection = new Connection(DEFAULT_RPC, 'confirmed')
): Promise<string> {
  if (amount <= 0) throw new Error('Unstake amount must be greater than 0')

  const { instructions, signers } = await solanaStakePool.withdrawStake(
    connection,
    JITO_STAKE_POOL_ADDRESS,
    userWallet.publicKey,
    amount
  )

  return sendStakePoolTx(connection, userWallet, instructions, signers)
}
