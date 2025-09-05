// Unstaking JitoSOL for SOL

import * as solanaStakePool from '@solana/spl-stake-pool'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

// JitoSOL stake pool address (Mainnet)
const JITO_STAKE_POOL_ADDRESS = new PublicKey('Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb')

// JitoSOL mint address
const JITO_MINT_ADDRESS = new PublicKey('J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn')

const connection = new Connection('YOUR_RPC_ENDPOINT')


async function unstakeJitoSOL(amount: number, userWallet: any, useReserve: boolean = false) {
    // Get withdraw instructions from SPL stake pool library
    const { instructions, signers } = await solanaStakePool.withdrawStake(
      connection,
      JITO_STAKE_POOL_ADDRESS,
      userWallet.publicKey,
      amount, // Amount in JitoSOL tokens
      useReserve // false = withdraw to stake account, true = instant SOL via reserve
    )
    
    const transaction = new Transaction()
    transaction.add(...instructions)
    
    const { blockhash } = await connection.getLatestBlockhash('finalized')
    transaction.recentBlockhash = blockhash
    transaction.feePayer = userWallet.publicKey
    
    if (signers.length > 0) {
      transaction.sign(...signers)
    }
    
    const signedTransaction = await userWallet.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())
    
    return signature
  }
  