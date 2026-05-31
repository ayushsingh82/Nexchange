// Staking SOL for mSOL (Marinade liquid staking)

import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import BN from 'bn.js'

// mSOL mint address (Mainnet)
export const MSOL_MINT_ADDRESS = new PublicKey(
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'
)

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
 * Deposit (stake) SOL into Marinade and receive mSOL.
 *
 * @param amount     Amount of SOL to stake (in SOL, not lamports).
 * @param userWallet Wallet adapter exposing `publicKey` and `signTransaction`.
 * @param connection Optional Solana connection (defaults to mainnet-beta).
 * @returns Transaction signature.
 */
export async function stakeSOLMarinade(
  amount: number,
  userWallet: Wallet,
  connection: Connection = new Connection(DEFAULT_RPC, 'confirmed')
): Promise<string> {
  if (amount <= 0) throw new Error('Stake amount must be greater than 0')

  const marinade = getMarinade(connection, userWallet)
  const lamports = new BN(Math.floor(amount * LAMPORTS_PER_SOL))

  const { transaction } = await marinade.deposit(lamports)

  return sendTx(connection, userWallet, transaction)
}
