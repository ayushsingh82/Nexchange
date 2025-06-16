import React from 'react'
import Link from 'next/link'

const EVMPage = () => {
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

        {/* Network Selector */}
        <div className="mb-12">
          <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-green-400">Select Network</h2>
              <div className="relative">
                <select className="bg-green-900/50 text-white px-4 py-2 rounded-lg border border-green-500/50 focus:outline-none focus:border-green-500 appearance-none pr-10">
                  <option value="ethereum" className="bg-green-900">Ethereum (Active)</option>
                  <option value="polygon" className="bg-green-900" disabled>Polygon (Coming Soon)</option>
                  <option value="arbitrum" className="bg-green-900" disabled>Arbitrum (Coming Soon)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/80">Network Status</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/80">Chain ID</span>
                <span className="text-white">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100/80">RPC URL</span>
                <span className="text-white">https://eth-mainnet.g.alchemy.com/v2/</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg hover:bg-green-500/30 transition">
                Create Intent
              </button>
              <button className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg hover:bg-green-500/30 transition">
                View History
              </button>
              <button className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg hover:bg-green-500/30 transition">
                Bridge Assets
              </button>
              <button className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg hover:bg-green-500/30 transition">
                DeFi Actions
              </button>
            </div>
          </div>

          {/* Upcoming Networks */}
          <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Upcoming Networks</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-white">Polygon</span>
                </div>
                <span className="text-yellow-500 text-sm">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-white">Arbitrum</span>
                </div>
                <span className="text-yellow-500 text-sm">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

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

        {/* Supported Actions */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-green-400">Supported Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Token Swaps',
                desc: 'Swap tokens between NEAR and Ethereum'
              },
              {
                title: 'Asset Bridging',
                desc: 'Bridge assets between NEAR and Ethereum'
              },
              {
                title: 'DeFi Integration',
                desc: 'Interact with Ethereum DeFi protocols'
              }
            ].map((action, idx) => (
              <div
                key={idx}
                className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50"
              >
                <h3 className="text-lg font-semibold mb-2 text-white">{action.title}</h3>
                <p className="text-emerald-100/80 text-sm">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default EVMPage