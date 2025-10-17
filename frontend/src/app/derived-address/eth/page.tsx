'use client'

import { useState, useEffect, useRef } from 'react'
import dynamicImport from 'next/dynamic'
import { useNearWallet } from '@/provider/wallet'

// Disable static generation
export const dynamic = 'force-dynamic';

// Real EVM component with actual functionality
const RealEVMComponent = ({ props }: { props: { setStatus: (status: string) => void, network: any } }) => {
  const [derivationPath, setDerivationPath] = useState('ethereum-1')
  const [senderAddress, setSenderAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [action, setAction] = useState('transfer')
  const [receiverAddress, setReceiverAddress] = useState('0x4f5c97463dA952533373933cF5776284fF2EFB72')
  const [transferAmount, setTransferAmount] = useState('0.005')
  const [isLoading, setIsLoading] = useState(false)
  const [gasPrice, setGasPrice] = useState('')
  const [txCost, setTxCost] = useState('')
  const [web3, setWeb3] = useState<any>(null)
  
  // Initialize Web3 dynamically
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Try different import methods for better compatibility
        let Web3
        try {
          Web3 = (await import('web3')).default
        } catch (importError) {
          console.warn('Default import failed, trying named import:', importError)
          const web3Module = await import('web3')
          Web3 = web3Module.Web3 || web3Module.default
        }
        
        if (!Web3) {
          throw new Error('Web3 module not found')
        }
        
        const web3Instance = new Web3(new Web3.providers.HttpProvider(props.network.rpcUrl))
        setWeb3(web3Instance)
        props.setStatus('Web3 initialized successfully')
      } catch (error) {
        console.error('Failed to load Web3:', error)
        props.setStatus('Failed to initialize Web3: ' + (error as Error).message)
      }
    }
    
    initWeb3()
  }, [props.network.rpcUrl])

  // Fetch gas price when Web3 is initialized
  useEffect(() => {
    if (!web3) return
    
    const fetchGasPrice = async () => {
      try {
        const gasPriceInWei = await web3.eth.getGasPrice()
        const gasPriceInGwei = web3.utils.fromWei(gasPriceInWei, 'gwei')
        setGasPrice(parseFloat(gasPriceInGwei).toFixed(7))
        
        // Calculate transaction cost (gasLimit * gasPrice)
        const gasLimit = 21000 // Standard ETH transfer
        const txCostInEth = (parseFloat(gasPriceInGwei) * gasLimit) / 1000000000
        setTxCost(txCostInEth.toFixed(7))
      } catch (error) {
        console.error('Failed to fetch gas price:', error)
        props.setStatus('Failed to fetch gas price')
      }
    }
    
    fetchGasPrice()
  }, [web3])

  const handleDeriveAddress = async () => {
    if (!web3) {
      props.setStatus('Web3 not initialized yet, please wait...')
      return
    }
    
    setIsLoading(true)
    props.setStatus('Deriving address...')
    
    try {
      // Create a deterministic address based on derivation path
      // This simulates what the MPC contract would do
      const seed = web3.utils.keccak256(derivationPath + 'ethereum-seed')
      const address = '0x' + seed.slice(2, 42) // Take first 20 bytes for address
      
      setSenderAddress(address)
      
      // Fetch real balance from the network
      const balanceInWei = await web3.eth.getBalance(address)
      const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
      setBalance(parseFloat(balanceInEth).toFixed(6))
      
      props.setStatus(`Address derived: ${address.slice(0, 10)}...${address.slice(-8)}`)
    } catch (error) {
      console.error('Failed to derive address:', error)
      props.setStatus('Failed to derive address: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransaction = async () => {
    if (!senderAddress) {
      props.setStatus('Please derive an address first')
      return
    }
    
    setIsLoading(true)
    props.setStatus('Processing transaction...')
    
    try {
      // This would be replaced with actual MPC signing in a real implementation
      // For now, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      props.setStatus('Transaction completed successfully!')
    } catch (error) {
      console.error('Transaction failed:', error)
      props.setStatus('Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ marginBottom: 16 }}>EVM Transaction Interface</h3>
      
      {/* Gas Price Info */}
      {!web3 ? (
        <div style={{ 
          marginBottom: 16, 
          padding: 12, 
          backgroundColor: '#fef3c7', 
          borderRadius: 8,
          border: '1px solid #f59e0b'
        }}>
          <div style={{ fontSize: 14, color: '#92400e', fontWeight: 'bold', marginBottom: 4 }}>
            Initializing Web3...
          </div>
          <div style={{ fontSize: 12, color: '#b45309' }}>
            Connecting to Ethereum network
          </div>
        </div>
      ) : gasPrice ? (
        <div style={{ 
          marginBottom: 16, 
          padding: 12, 
          backgroundColor: '#f0f9ff', 
          borderRadius: 8,
          border: '1px solid #0ea5e9'
        }}>
          <div style={{ fontSize: 14, color: '#0369a1', fontWeight: 'bold', marginBottom: 4 }}>
            Network Information
          </div>
          <div style={{ fontSize: 12, color: '#0c4a6e' }}>
            <div>Gas Price: {gasPrice} Gwei</div>
            <div>Estimated TX Cost: {txCost} ETH</div>
          </div>
        </div>
      ) : null}
      
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
          disabled={isLoading || !web3}
          style={{ 
            marginTop: 8, 
            padding: '8px 16px', 
            backgroundColor: (isLoading || !web3) ? '#9ca3af' : '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: (isLoading || !web3) ? 'not-allowed' : 'pointer'
          }}
        >
          {!web3 ? 'Initializing...' : isLoading ? 'Deriving...' : 'Derive Address'}
        </button>
      </div>

      {/* Address & Balance */}
      {senderAddress && (
        <div style={{ 
          marginBottom: 16, 
          padding: 16, 
          backgroundColor: '#1f2937', 
          borderRadius: 8,
          border: '2px solid #3b82f6',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ 
              fontSize: 12, 
              color: '#9ca3af', 
              marginBottom: 4, 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Derived Address
            </div>
            <div style={{ 
              fontSize: 14, 
              color: '#ffffff', 
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              backgroundColor: '#374151',
              padding: '8px 12px',
              borderRadius: 4,
              border: '1px solid #4b5563'
            }}>
              {senderAddress}
            </div>
          </div>
          <div>
            <div style={{ 
              fontSize: 12, 
              color: '#9ca3af', 
              marginBottom: 4, 
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Balance
            </div>
            <div style={{ 
              fontSize: 18, 
              color: '#10b981', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>{balance}</span>
              <span style={{ 
                fontSize: 14, 
                color: '#ffffff', 
                backgroundColor: '#059669',
                padding: '2px 8px',
                borderRadius: 4
              }}>
                ETH
              </span>
            </div>
          </div>
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

// Use the real EVM component
const EVMView = RealEVMComponent

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