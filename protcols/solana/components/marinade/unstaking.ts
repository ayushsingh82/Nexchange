// Unstaking mSOL back to SOL (Marinade liquid staking)

import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import BN from 'bn.js'

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com'

type Wallet = {
  publicKey: PublicKey
  signTransaction: (tx: Transaction) => Promise<Transaction>
}

function getMarinade(connection: Connection, wallet: Wallet): Marinade {
  const config = new MarinadeConfig({
    connection,
    publicKey: wallet.publicKey,
  })
  return new Marinade(config)
}

async function sendTx(
  connection: Connection,
  wallet: Wallet,
  transaction: Transaction
): Promise<string> {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash('finalized')
  transaction.recentBlockhash = blockhash
  transaction.lastValidBlockHeight = lastValidBlockHeight
  transaction.feePayer = wallet.publicKey

  const signed = await wallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())

  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    'confirmed'
  )

  return signature
}

/**
 * Instant unstake: swap mSOL for SOL via Marinade's liquidity pool (small fee).
 * Immediate, no cooldown.
 *
 * @param amount     Amount of mSOL to unstake (in mSOL, UI units).
 * @param userWallet Wallet adapter exposing `publicKey` and `signTransaction`.
 * @param connection Optional Solana connection (defaults to mainnet-beta).
 * @returns Transaction signature.
 */
export async function liquidUnstakeMarinade(
  amount: number,
  userWallet: Wallet,
  connection: Connection = new Connection(DEFAULT_RPC, 'confirmed')
): Promise<string> {
  if (amount <= 0) throw new Error('Unstake amount must be greater than 0')

  const marinade = getMarinade(connection, userWallet)
  const msolLamports = new BN(Math.floor(amount * LAMPORTS_PER_SOL))

  const { transaction } = await marinade.liquidUnstake(msolLamports)

  return sendTx(connection, userWallet, transaction)
}

/**
 * Delayed unstake step 1: order an unstake ticket (no liquidity-pool fee).
 * The SOL becomes claimable after the cooldown (~1-2 epochs).
 *
 * IMPORTANT: the returned `ticketAccount` (base58) must be persisted — it is
 * required to claim the SOL later via `claimUnstakeMarinade`.
 *
 * @returns { signature, ticketAccount }
 */
export async function orderUnstakeMarinade(
  amount: number,
  userWallet: Wallet,
  connection: Connection = new Connection(DEFAULT_RPC, 'confirmed')
): Promise<{ signature: string; ticketAccount: string }> {
  if (amount <= 0) throw new Error('Unstake amount must be greater than 0')

  const marinade = getMarinade(connection, userWallet)
  const msolLamports = new BN(Math.floor(amount * LAMPORTS_PER_SOL))

  const { transaction, ticketAccountKeypair } =
    await marinade.orderUnstake(msolLamports)

  // The freshly created ticket account must sign its own creation
  transaction.partialSign(ticketAccountKeypair)

  const signature = await sendTx(connection, userWallet, transaction)

  return {
    signature,
    ticketAccount: ticketAccountKeypair.publicKey.toBase58(),
  }
}

/**
 * Delayed unstake step 2: claim the SOL once the ticket has matured.
 *
 * @param ticketAccount Base58 ticket account returned by `orderUnstakeMarinade`.
 */
export async function claimUnstakeMarinade(
  ticketAccount: string,
  userWallet: Wallet,
  connection: Connection = new Connection(DEFAULT_RPC, 'confirmed')
): Promise<string> {
  const marinade = getMarinade(connection, userWallet)

  const { transaction } = await marinade.claim(new PublicKey(ticketAccount))

  return sendTx(connection, userWallet, transaction)
}
