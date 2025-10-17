'use client'

import { useState } from 'react'
import dynamicImport from 'next/dynamic'
import { useNearWallet } from '@/provider/wallet'
import { NetworksEVM } from '@signature-derived/config'

// Disable static generation
export const dynamic = 'force-dynamic';

// Import EVMView from the signature folder using alias
const EVMView = dynamicImport(
  () => import('@signature-derived/components/EVM/EVM').then(m => m.EVMView),
  { ssr: false }
)

export default function Page() {
  const [status, setStatus] = useState<string | React.ReactNode>('Ready')
  const { accountId, callMethods } = useNearWallet()

  // Create signer object from the connected wallet
  const signer = accountId && callMethods ? {
    accountId,
    signAndSendTransactions: callMethods
  } : undefined

  // Get the first EVM network configuration (Ethereum Sepolia)
  const networkConfig = NetworksEVM[0]

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Derived Address: Ethereum (Sepolia)</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>Connect your NEAR wallet, derive an Ethereum Sepolia address, sign, and relay a transaction.</p>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <strong>Status:</strong> <span>{typeof status === 'string' ? status : status}</span>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600 }}>Network Configuration</h3>
        <div style={{ fontSize: 14, color: '#666' }}>
          <div><strong>Network:</strong> {networkConfig.network}</div>
          <div><strong>Token:</strong> {networkConfig.token}</div>
          <div><strong>RPC URL:</strong> {networkConfig.rpcUrl}</div>
          <div><strong>Explorer:</strong> {networkConfig.explorerUrl}</div>
          <div><strong>Contract:</strong> {networkConfig.contractAddress}</div>
        </div>
      </div>

      {!accountId ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#ef4444' }}>
          Please connect your NEAR wallet first using the navbar.
        </div>
      ) : (
        <EVMView props={{ setStatus, network: networkConfig }} />
      )}
    </div>
  )
}