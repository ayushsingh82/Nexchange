'use client'
import React, { useState } from 'react'

const ProtocolPage = () => {
  const [selectedChain, setSelectedChain] = useState<'solana' | 'evm'>('evm')

  const evmProtocols = {
    staking: [
      {
        name: 'Lido Finance',
        description: 'Liquid staking for ETH, MATIC, SOL, etc.',
        status: 'Active'
      },
      {
        name: 'EigenLayer',
        description: 'Restaking protocol for Ethereum',
        status: 'Active'
      }
    ],
    lending: [
      {
        name: 'Aave',
        description: 'Lending/borrowing protocol on most EVMs',
        status: 'Active'
      },
      {
        name: 'Compound v3',
        description: 'Simplified lending protocol',
        status: 'Active'
      }
    ],
    swapping: [
      {
        name: 'Uniswap (v2/v3)',
        description: 'Leading DEX on Ethereum and L2s',
        status: 'Active'
      },
      {
        name: 'SushiSwap',
        description: 'Multi-chain DEX with staking/farming',
        status: 'Active'
      }
    ]
  }

  const solanaProtocols = {
    staking: [
      {
        name: 'Jito',
        description: 'MEV staking protocol with liquid staking (jitoSOL)',
        status: 'Active'
      },
      {
        name: 'BlazeStake',
        description: 'Non-custodial liquid staking for Solana',
        status: 'Active'
      }
    ],
    swapping: [
      {
        name: 'Jupiter Aggregator',
        description: 'Route swaps across Solana DEXes',
        status: 'Active'
      },
      {
        name: 'Orca',
        description: 'User-friendly Solana DEX',
        status: 'Active'
      }
    ]
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Protocol Integration
          </h1>
          <p className="text-emerald-100/90 text-lg">
            Select and interact with protocols across different chains
          </p>
        </div>

        {/* Chain Toggle */}
        <div className="mb-12">
          <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-green-400">Select Chain</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedChain('evm')}
                  className={`px-6 py-2 rounded-lg transition ${
                    selectedChain === 'evm'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  EVM
                </button>
                <button
                  onClick={() => setSelectedChain('solana')}
                  className={`px-6 py-2 rounded-lg transition ${
                    selectedChain === 'solana'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  Solana
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol Categories */}
        <div className="space-y-8">
          {selectedChain === 'evm' ? (
            <>
              {/* EVM Protocols */}
              <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50">
                <h2 className="text-2xl font-semibold mb-6 text-green-400"> EVM-Compatible Protocols</h2>
                <div className="space-y-8">
                  {Object.entries(evmProtocols).map(([category, protocols]) => (
                    <div key={category}>
                      <h3 className="text-xl font-semibold mb-4 text-white capitalize">{category}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {protocols.map((protocol, idx) => (
                          <div
                            key={idx}
                            className="bg-green-900/30 p-4 rounded-lg border border-green-800/50"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium text-white">{protocol.name}</h4>
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                {protocol.status}
                              </span>
                            </div>
                            <p className="text-emerald-100/80 text-sm">{protocol.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Solana Protocols */}
              <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50">
                <h2 className="text-2xl font-semibold mb-6 text-green-400"> Solana Protocols</h2>
                <div className="space-y-8">
                  {Object.entries(solanaProtocols).map(([category, protocols]) => (
                    <div key={category}>
                      <h3 className="text-xl font-semibold mb-4 text-white capitalize">{category}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {protocols.map((protocol, idx) => (
                          <div
                            key={idx}
                            className="bg-green-900/30 p-4 rounded-lg border border-green-800/50"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium text-white">{protocol.name}</h4>
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                {protocol.status}
                              </span>
                            </div>
                            <p className="text-emerald-100/80 text-sm">{protocol.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default ProtocolPage