'use client'

import Link from 'next/link'

export default function ExplorePage() {
  const protocols = {
    ethereum: {
      name: "Ethereum",
      status: "Coming Soon",
      protocols: [
        { name: "EtherFi", available: false },
        { name: "Lido", available: false }, 
        { name: "Rocket Pool", available: false }
      ]
    },
    solana: {
      name: "Solana", 
      status: "Available",
      protocols: [
        { name: "Jito", available: true },
        { name: "Marinade Finance", available: false },
        { name: "Socean", available: false }
      ]
    },
    near: {
      name: "NEAR Protocol",
      status: "Coming Soon", 
      protocols: [
        { name: "Meta Pool", available: false },
        { name: "LiNEAR Protocol", available: false },
        { name: "Burrow", available: false }
      ]
    },
    ton: {
      name: "TON",
      status: "Coming Soon",
      protocols: [
        { name: "Tonstakers", available: false },
        { name: "Stakee", available: false },
        { name: "Whales", available: false }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#97FBE4] mb-4">
            Explore Protocols for Staking
          </h1>
          <p className="text-xl text-[#97FBE4]/80 max-w-2xl mx-auto">
            Staking made  easy  and all accessible from your NEAR wallet.
          </p>
        </div>

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {Object.entries(protocols).map(([chainKey, chainData]) => (
            <div 
              key={chainKey}
              className="bg-black border border-gray-800 p-8 hover:border-[#97FBE4] transition-colors"
            >
              {/* Chain Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#97FBE4]">
                  {chainData.name}
                </h2>
                <div className={`px-3 py-1 text-sm font-medium ${
                  chainData.status === "Available" 
                    ? "bg-green-900/30 text-green-400 border border-green-500/50" 
                    : "bg-gray-800 text-gray-400 border border-gray-700"
                }`}>
                  {chainData.status}
                </div>
              </div>

              {/* Protocols List */}
              <div className="space-y-4">
                {chainData.protocols.map((protocol, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mt-1 mr-3 flex-shrink-0 ${
                        protocol.available ? 'bg-[#97FBE4]' : 'bg-gray-600'
                      }`}></div>
                      <span className={`leading-relaxed ${
                        protocol.available ? 'text-[#97FBE4] font-medium' : 'text-gray-400'
                      }`}>
                        {protocol.name}
                      </span>
                    </div>
                    {protocol.available && (
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 border border-green-500/50">
                        Live
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {chainData.status === "Available" ? (
                <div className="mt-8">
                  <Link 
                    href="/stake"
                    className="inline-block px-6 py-3 bg-[#97FBE4] text-black font-semibold hover:bg-[#5eead4] transition-colors"
                  >
                    Start Staking
                  </Link>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="inline-block px-6 py-3 bg-gray-800 text-gray-400 font-semibold cursor-not-allowed">
                    Coming Soon
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-[#97FBE4] border border-gray-800 p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-black mb-4">
              How It Works
            </h3>
            <p className="text-slate-900 leading-relaxed">
              Connect your NEAR wallet once and access staking protocols across all supported blockchains. 
              No need to manage multiple wallets or switch between different interfaces. 
              Our cross-chain signature technology makes multi-chain staking as simple as single-chain operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}