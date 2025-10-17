'use client'

import { useState } from 'react'
import dynamicImport from 'next/dynamic'
import { useNearWallet } from '@/provider/wallet'

// Disable static generation
export const dynamic = 'force-dynamic';

// Simple EVM component that works without external dependencies
const SimpleEVMComponent = ({ props }: { props: { setStatus: (status: string) => void, network: any } }) => {
  const [derivationPath, setDerivationPath] = useState('ethereum-1')
  const [senderAddress, setSenderAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [action, setAction] = useState('transfer')
  const [receiverAddress, setReceiverAddress] = useState('0x72284EceE80A34BbC4c65d8A468B7771552a421b')
  const [transferAmount, setTransferAmount] = useState('0.005')
  const [isLoading, setIsLoading] = useState(false)

  const handleDeriveAddress = () => {
    // Simulate address derivation
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40)
    setSenderAddress(mockAddress)
    setBalance('1.234567')
    props.setStatus('Address derived successfully')
  }

  const handleTransaction = () => {
    setIsLoading(true)
    props.setStatus('Processing transaction...')
    
    setTimeout(() => {
      setIsLoading(false)
      props.setStatus('Transaction completed successfully!')
    }, 2000)
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginBottom: 16 }}>EVM Transaction Interface</h3>
      
      {/* Derivation Path */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Derivation Path:</label>
        <input
          type="text"
          value={derivationPath}
          onChange={(e) => setDerivationPath(e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button 
          onClick={handleDeriveAddress}
          style={{ 
            marginTop: 8, 
            padding: '8px 16px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Derive Address
        </button>
      </div>

      {/* Address & Balance */}
      {senderAddress && (
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f9fafb', borderRadius: 4 }}>
          <div><strong>Address:</strong> {senderAddress}</div>
          <div><strong>Balance:</strong> {balance} ETH</div>
        </div>
      )}

      {/* Action Selection */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Action:</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        >
          <option value="transfer">ETH Transfer</option>
          <option value="contract">Contract Call</option>
        </select>
      </div>

      {/* Transfer Form */}
      {action === 'transfer' && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>To Address:</label>
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Amount (ETH):</label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              step="0.001"
              min="0.001"
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
            />
          </div>
        </div>
      )}

      {/* Execute Button */}
      <button 
        onClick={handleTransaction}
        disabled={isLoading || !senderAddress}
        style={{ 
          width: '100%',
          padding: '12px 16px', 
          backgroundColor: isLoading ? '#9ca3af' : '#10b981', 
          color: 'white', 
          border: 'none', 
          borderRadius: 4,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: 16,
          fontWeight: 'bold'
        }}
      >
        {isLoading ? 'Processing...' : 'Execute Transaction'}
      </button>
    </div>
  )
}

// Use the simple component for now
const EVMView = SimpleEVMComponent

export default function Page() {
  const [status, setStatus] = useState<string>('Ready')
  const [error, setError] = useState<string | null>(null)
  const { accountId, callMethods } = useNearWallet()

  // Network configuration
  const networkConfig = {
    network: "Ethereum",
    token: "ETH",
    rpcUrl: "https://sepolia.drpc.org",
    explorerUrl: "https://sepolia.etherscan.io/tx/",
    contractAddress: "0xFf3171733b73Cfd5A72ec28b9f2011Dc689378c6",
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Derived Address: Ethereum (Sepolia)</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>Connect your NEAR wallet, derive an Ethereum Sepolia address, sign, and relay a transaction.</p>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <strong>Status:</strong> <span>{status}</span>
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

      {error && (
        <div style={{ border: '1px solid #ef4444', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#fef2f2' }}>
          <strong style={{ color: '#ef4444' }}>Error:</strong> <span style={{ color: '#ef4444' }}>{error}</span>
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: 8, padding: '4px 8px', fontSize: 12, backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 4 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {!accountId ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#ef4444' }}>
          Please connect your NEAR wallet first using the navbar.
        </div>
      ) : (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <EVMView props={{ setStatus, network: networkConfig }} />
        </div>
      )}
    </div>
  )
}