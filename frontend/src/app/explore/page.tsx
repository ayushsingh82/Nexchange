'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      title: "Cross-Chain Swaps",
      description: "Swap NEAR ↔ SOL ↔ ETH ↔ USDC seamlessly",
      icon: "🔄",
      status: "Live",
      link: "/derived-address/solana"
    },
    {
      title: "Multi-Chain Staking",
      description: "Stake on Solana, NEAR, and EVM chains from one wallet",
      icon: "🎯",
      status: "Live",
      link: "/stake"
    },
    {
      title: "Derived Addresses",
      description: "Generate cross-chain addresses using your NEAR wallet",
      icon: "🔑",
      status: "Live",
      link: "/derived-address/solana"
    },
    {
      title: "Intent-Based Execution",
      description: "Express what you want, AI handles the complexity",
      icon: "🤖",
      status: "Beta",
      link: "#"
    },
    {
      title: "Cross-Chain Signatures",
      description: "Sign transactions on any chain with your NEAR wallet",
      icon: "✍️",
      status: "Live",
      link: "/derived-address/solana"
    },
    {
      title: "Asset Management",
      description: "Track and manage assets across all supported chains",
      icon: "💎",
      status: "Coming Soon",
      link: "#"
    }
  ]

  const chains = [
    {
      name: "NEAR",
      logo: "🌐",
      status: "Fully Integrated",
      features: ["Native Wallet", "Staking Pools", "DeFi Protocols"]
    },
    {
      name: "Solana",
      logo: "☀️",
      status: "Live",
      features: ["Address Derivation", "Transaction Signing", "Staking Integration"]
    },
    {
      name: "Ethereum",
      logo: "⟠",
      status: "Beta",
      features: ["Cross-Chain Swaps", "DeFi Integration", "Gas Optimization"]
    },
    {
      name: "EVM Chains",
      logo: "⚡",
      status: "Planned",
      features: ["Base", "Arbitrum", "Polygon", "Avalanche"]
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'chains', label: 'Supported Chains' },
    { id: 'getting-started', label: 'Getting Started' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-900/20 to-black py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#97FBE4] to-[#5eead4] bg-clip-text text-transparent">
              Explore NeXchange
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover the power of cross-chain DeFi with intent-based execution. 
            One wallet, infinite possibilities across multiple blockchains.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#97FBE4]">4+</div>
              <div className="text-gray-300">Supported Chains</div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#97FBE4]">6+</div>
              <div className="text-gray-300">Core Features</div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#97FBE4]">1</div>
              <div className="text-gray-300">Wallet Needed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#97FBE4] text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">What is NeXchange?</h2>
                <p className="text-lg text-gray-300 max-w-4xl mx-auto">
                  NeXchange is a revolutionary cross-chain DeFi protocol that eliminates the complexity 
                  of managing multiple wallets and chains. Built on NEAR's infrastructure, it enables 
                  seamless asset management across Solana, Ethereum, and other major blockchains using 
                  a single NEAR wallet.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#97FBE4]">🎯 The Problem</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Multiple wallets for different chains</li>
                    <li>• Complex private key management</li>
                    <li>• High gas fees and slow transactions</li>
                    <li>• Fragmented user experience</li>
                  </ul>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#97FBE4]">✨ Our Solution</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Single NEAR wallet for all chains</li>
                    <li>• Intent-based execution</li>
                    <li>• Cross-chain signatures</li>
                    <li>• Unified DeFi experience</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        feature.status === 'Live' ? 'bg-green-900 text-green-300' :
                        feature.status === 'Beta' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-300 mb-4">{feature.description}</p>
                    {feature.link !== '#' && (
                      <Link 
                        href={feature.link}
                        className="inline-flex items-center text-[#97FBE4] hover:text-[#5eead4] transition-colors"
                      >
                        Try it now →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chains' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">Supported Blockchains</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {chains.map((chain, index) => (
                  <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{chain.logo}</div>
                      <div>
                        <h3 className="text-2xl font-bold">{chain.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          chain.status === 'Fully Integrated' ? 'bg-green-900 text-green-300' :
                          chain.status === 'Live' ? 'bg-blue-900 text-blue-300' :
                          chain.status === 'Beta' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {chain.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {chain.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-gray-300">
                          <span className="text-green-500">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'getting-started' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Getting Started</h2>
              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#97FBE4]">Step 1: Connect Your NEAR Wallet</h3>
                  <p className="text-gray-300 mb-4">
                    Start by connecting your NEAR wallet using the "Connect Wallet" button in the top-right corner.
                  </p>
                  <Link 
                    href="/"
                    className="inline-flex items-center bg-[#97FBE4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#5eead4] transition-colors"
                  >
                    Go to Home →
                  </Link>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#97FBE4]">Step 2: Explore Cross-Chain Features</h3>
                  <p className="text-gray-300 mb-4">
                    Try out our cross-chain address derivation and transaction signing features.
                  </p>
                  <Link 
                    href="/derived-address/solana"
                    className="inline-flex items-center bg-[#97FBE4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#5eead4] transition-colors"
                  >
                    Derive Solana Address →
                  </Link>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#97FBE4]">Step 3: Start Staking</h3>
                  <p className="text-gray-300 mb-4">
                    Explore multi-chain staking opportunities directly from your NEAR wallet.
                  </p>
                  <Link 
                    href="/stake"
                    className="inline-flex items-center bg-[#97FBE4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#5eead4] transition-colors"
                  >
                    Start Staking →
                  </Link>
                </div>
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
                <p className="text-gray-300 mb-6">
                  Check out our documentation or join our community for support.
                </p>
                <div className="flex justify-center gap-4">
                  <a 
                    href="https://github.com/ayushsingh82/Nexchange" 
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  <a 
                    href="https://twitter.com/nexchange_near" 
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
