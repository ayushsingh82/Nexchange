// Staking SOL for JitoSOL (Jito SPL stake pool)

import * as solanaStakePool from '@solana/spl-stake-pool'
import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
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

/**
 * Deposit (stake) SOL into the Jito stake pool and receive JitoSOL.
 *
 * @param amount     Amount of SOL to stake (in SOL, not lamports).
 * @param userWallet Wallet adapter exposing `publicKey` and `signTransaction`.
 * @param connection Optional Solana connection (defaults to mainnet-beta).
 * @returns Transaction signature.
 */
export async function stakeSOL(
  amount: number,
  userWallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> },
  connection: Connection = new Connection(DEFAULT_RPC, 'confirmed')
): Promise<string> {
  if (amount <= 0) throw new Error('Stake amount must be greater than 0')

  // Convert SOL to lamports
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL)

  // Get deposit instructions from the SPL stake pool library
  const { instructions, signers } = await solanaStakePool.depositSol(
    connection,
    JITO_STAKE_POOL_ADDRESS,
    userWallet.publicKey,
    lamports
  )

  // Assemble the transaction
  const transaction = new Transaction()
  transaction.add(...instructions)

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash('finalized')
  transaction.recentBlockhash = blockhash
  transaction.lastValidBlockHeight = lastValidBlockHeight
  transaction.feePayer = userWallet.publicKey

  // Sign with any ephemeral signers the instruction set requires
  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }

  // Wallet signs, then broadcast
  const signedTransaction = await userWallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  )

  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    'confirmed'
  )

  return signature
}
