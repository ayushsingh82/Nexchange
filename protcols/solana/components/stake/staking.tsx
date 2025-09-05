// Staking SOL for JitoSOL

import * as solanaStakePool from '@solana/spl-stake-pool'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

// JitoSOL stake pool address (Mainnet)
const JITO_STAKE_POOL_ADDRESS = new PublicKey('Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb')

// JitoSOL mint address
const JITO_MINT_ADDRESS = new PublicKey('J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn')

const connection = new Connection('YOUR_RPC_ENDPOINT')


async function stakeSOL(amount: number, userWallet: any) {
    // Convert SOL to lamports
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL)
    
    // Get deposit instructions from SPL stake pool library
    const { instructions, signers } = await solanaStakePool.depositSol(
      connection,
      JITO_STAKE_POOL_ADDRESS,
      userWallet.publicKey,
      lamports
    )
    
    // Create and send transaction
    const transaction = new Transaction()
    transaction.add(...instructions)
    
    const { blockhash } = await connection.getLatestBlockhash('finalized')
    transaction.recentBlockhash = blockhash
    transaction.feePayer = userWallet.publicKey
    
    // Sign with any additional signers
    if (signers.length > 0) {
      transaction.sign(...signers)
    }
    
    const signedTransaction = await userWallet.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())
    
    return signature
  }
  