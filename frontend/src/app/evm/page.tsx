"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import { getPortfolio } from './okto-apis'
import dummyPortfolio from './dummy-portfolio'

const EVMPage = () => {
  // Placeholder: Replace with actual OktoAuthToken retrieval logic
  // const OktoAuthToken = 'YOUR_OKTO_AUTH_TOKEN';

  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleGetPortfolio = async () => {
    // For demo: use dummyPortfolio instead of API
    setPortfolio(dummyPortfolio);
    setShowPortfolio(true);
    // If you want to use the real API, uncomment below:
    // try {
    //   const data = await getPortfolio(OktoAuthToken);
    //   setPortfolio(data);
    //   setShowPortfolio(true);
    // } catch (error) {
    //   alert('Failed to fetch portfolio');
    // }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            EVM Integration
          </h1>
          <p className="text-emerald-100/90 text-lg">
            Connect and interact with EVM chains through NEAR Protocol
          </p>
        </div>

        {/* Wallet Info Sections */}
        <div className="mb-12 flex flex-col md:flex-row gap-8">
          {/* Okto Tech Wallet Info Box (Left) */}
          <div className="flex-1 bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 flex flex-col">
            <h2 className="text-2xl font-bold mb-2 text-green-400">EVM Wallet (Okto Tech)</h2>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-green-300 font-semibold">Address</span>
              <button
                className="ml-2 px-2 py-1 bg-green-800/60 text-green-200 rounded hover:bg-green-700 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText('0xB7eF8C9dA2F345678901234567890abcdef123456');
                }}
              >
                Copy
              </button>
            </div>
            <div className="bg-green-900/40 text-green-100 font-mono p-2 rounded-lg mt-1 break-all select-all">
              0xB7eF8C9dA2F345678901234567890abcdef123456
            </div>
            <div className="mb-4 text-green-200 text-sm">
              This EVM address is generated using <span className="font-semibold text-green-300">Okto tech</span>.
            </div>
            {/* Wallet Balance Box */}
            <div className="mb-4">
              <span className="text-green-300 font-semibold">Balance</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="bg-green-900/40 text-green-100 text-2xl font-bold p-4 rounded-lg w-fit">
                  $1,800.00
                </div>
                <button
                  className="px-2 py-1 bg-green-800/60 text-green-200 rounded hover:bg-green-700 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText('$1,800.00');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Okto Tech Agent Status Box (Right) */}
          <div className="flex-1 bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 flex flex-col">
            <h2 className="text-2xl font-bold mb-2 text-green-400">AI Agent Status</h2>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
              <span className="text-green-100 font-semibold">Active</span>
            </div>
            <div className="text-green-200 text-sm mb-4">
              Your EVM agent is active and ready to sign transactions. The agent uses Okto's secure tech to manage EVM transactions without managing private keys.
            </div>
            <div className="mb-6">
              <span className="text-green-300 font-semibold">Available Features:</span>
              <ul className="list-disc list-inside text-green-100 mt-2 space-y-1">
                <li>Chain Abstraction</li>
                <li>Intents</li>
                <li>Omni Bridge</li>
              </ul>
            </div>
            <button
              className="mt-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition"
              onClick={() => window.location.href = '/chat'}
            >
              Chat with AI Agent
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="bg-green-950/40 backdrop-blur-lg p-12 rounded-2xl border border-green-800/50 shadow-lg flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-green-400">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
              <button className="bg-green-500/20 text-green-400 px-8 py-6 rounded-xl text-xl font-semibold hover:bg-green-500/30 transition w-full">
                Create Intent
              </button>
              <button className="bg-green-500/20 text-green-400 px-8 py-6 rounded-xl text-xl font-semibold hover:bg-green-500/30 transition w-full">
                View History
              </button>
              <button className="bg-green-500/20 text-green-400 px-8 py-6 rounded-xl text-xl font-semibold hover:bg-green-500/30 transition w-full">
                Bridge Assets
              </button>
              <button
                className="bg-green-500/20 text-green-400 px-8 py-6 rounded-xl text-xl font-semibold hover:bg-green-500/30 transition w-full"
                onClick={handleGetPortfolio}
              >
                Get Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Modal/Section */}
        {showPortfolio && portfolio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-green-950/90 p-8 rounded-2xl border border-green-800/70 max-w-2xl w-full shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-green-400 hover:text-green-200 text-2xl"
                onClick={() => setShowPortfolio(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Portfolio Overview</h3>
              <div className="mb-4">
                <div className="text-green-200 mb-2">Total Holdings: {portfolio.data.aggregated_data.holdings_count}</div>
                <div className="text-green-200 mb-2">Total Value (USDT): {portfolio.data.aggregated_data.total_holding_price_usdt}</div>
                <div className="text-green-200 mb-2">Total Value (INR): {portfolio.data.aggregated_data.total_holding_price_inr}</div>
              </div>
              <div>
                <h4 className="text-green-300 font-semibold mb-2">Tokens</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {portfolio.data.group_tokens.map((token: any, idx: number) => (
                    <div key={idx} className="bg-green-900/40 p-4 rounded-lg flex items-center gap-4">
                      {token.token_image && (
                        <img src={token.token_image} alt={token.symbol} className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <div className="text-green-100 font-bold">{token.name} ({token.symbol})</div>
                        <div className="text-green-200 text-sm">Network: {token.network_name}</div>
                        <div className="text-green-200 text-sm">Balance: {token.balance}</div>
                        <div className="text-green-200 text-sm">Value (USDT): {token.holdings_price_usdt}</div>
                        <div className="text-green-200 text-sm">Value (INR): {token.holdings_price_inr}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Intents */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Recent Intents</h2>
          <div className="bg-green-950/40 backdrop-blur-lg rounded-xl border border-green-800/50 overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-5 gap-4 text-sm text-emerald-100/80 mb-4">
                <div>Intent ID</div>
                <div>Type</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Time</div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: '#12341',
                    type: 'Token Swap',
                    amount: '1.5 ETH → 2,850 USDC',
                    status: 'Completed',
                    time: '2 mins ago'
                  },
                  {
                    id: '#12342',
                    type: 'NFT Mint',
                    amount: '0.1 ETH',
                    status: 'Completed',
                    time: '15 mins ago'
                  },
                  {
                    id: '#12343',
                    type: 'Stake',
                    amount: '50 ETH',
                    status: 'Completed',
                    time: '1 hour ago'
                  },
                  {
                    id: '#12344',
                    type: 'Unstake',
                    amount: '25 ETH',
                    status: 'Processing',
                    time: '2 hours ago'
                  },
                  {
                    id: '#12345',
                    type: 'Token Swap',
                    amount: '500 USDC → 0.25 ETH',
                    status: 'Completed',
                    time: '3 hours ago'
                  }
                ].map((intent, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 text-sm border-t border-green-800/50 pt-4">
                    <div className="text-white">{intent.id}</div>
                    <div className="text-emerald-100/80">{intent.type}</div>
                    <div className="text-emerald-100/80">{intent.amount}</div>
                    <div className={`${intent.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {intent.status}
                    </div>
                    <div className="text-emerald-100/80">{intent.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default EVMPage