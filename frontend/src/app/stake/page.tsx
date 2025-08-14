"use client";
import React, { useState } from 'react';

const StakePage = () => {
  const [selectedToken, setSelectedToken] = useState('NEAR');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const stakingOptions = [
    { token: 'NEAR', apy: '12.5%' },
    { token: 'SOL', apy: '8.8%' },
    { token: 'ETH', apy: '6.2%' }
  ];

  const selectedOption = stakingOptions.find(option => option.token === selectedToken);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Staking
          </h1>
          <p className="text-xl text-emerald-100/90 max-w-2xl mx-auto">
            Earn rewards by staking your assets across multiple chains
          </p>
        </div>

        {/* Staking Options */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-950/40 backdrop-blur-lg p-8 rounded-2xl border border-green-800/50 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-green-400 text-center">
              Select Asset to Stake
            </h2>
            
            {/* Dropdown */}
            <div className="relative mb-8">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-green-900/50 border border-green-500/50 text-white px-6 py-4 rounded-xl text-left flex items-center justify-between hover:border-green-400 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                    {selectedToken.charAt(0)}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div className="text-lg font-semibold">{selectedToken}</div>
                    <div className="text-green-300 text-sm">APY: {selectedOption?.apy}</div>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 text-green-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-green-950/90 backdrop-blur-lg border border-green-800/50 rounded-xl shadow-lg z-50 overflow-hidden">
                  {stakingOptions.map((option) => (
                    <button
                      key={option.token}
                      onClick={() => {
                        setSelectedToken(option.token);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-6 py-4 flex items-center justify-between hover:bg-green-800/30 transition-colors ${
                        selectedToken === option.token ? 'bg-green-800/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                          {option.token.charAt(0)}
                        </div>
                        <div className="text-lg font-semibold text-white">{option.token}</div>
                      </div>
                      <div className="text-green-300 text-sm font-semibold">{option.apy}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Staking Form */}
            <div className="space-y-6">
              {/* Stake Section */}
              <div className="bg-green-900/20 p-6 rounded-xl border border-green-800/50">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Stake {selectedToken}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-green-300 font-semibold mb-2">
                      Amount to Stake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="w-full bg-green-900/50 border border-green-500/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-400 transition-colors"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 font-semibold">
                        {selectedToken}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-900/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-300">Estimated APY:</span>
                      <span className="text-green-100 font-semibold">{selectedOption?.apy}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-green-300">Lock Period:</span>
                      <span className="text-green-100">30 days</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/30">
                    Stake {selectedToken}
                  </button>
                </div>
              </div>

              {/* Unstake Section */}
              <div className="bg-green-900/20 p-6 rounded-xl border border-green-800/50">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Unstake {selectedToken}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-green-300 font-semibold mb-2">
                      Amount to Unstake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        className="w-full bg-green-900/50 border border-green-500/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-400 transition-colors"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 font-semibold">
                        {selectedToken}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-900/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-300">Current Staked:</span>
                      <span className="text-green-100 font-semibold">0.00 {selectedToken}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-green-300">Unlock Time:</span>
                      <span className="text-green-100">Available Now</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/30">
                    Unstake {selectedToken}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50 text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold mb-3 text-green-400">Secure Staking</h3>
              <p className="text-green-100/80 text-sm">
                Your assets are secured by NEAR's chain abstraction technology
              </p>
            </div>
            
            <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50 text-center">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-xl font-semibold mb-3 text-green-400">High APY</h3>
              <p className="text-green-100/80 text-sm">
                Earn competitive returns across multiple blockchain networks
              </p>
            </div>
            
            <div className="bg-green-950/40 backdrop-blur-lg p-6 rounded-xl border border-green-800/50 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-3 text-green-400">Instant Rewards</h3>
              <p className="text-green-100/80 text-sm">
                Receive staking rewards automatically without manual claiming
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StakePage;