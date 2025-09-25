'use client'

import { useState } from 'react'

export default function JitoPageContent() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [stakingMode, setStakingMode] = useState<'stake' | 'unstake'>('stake')
  const [solAmount, setSolAmount] = useState('')
  const [solBalance, setSolBalance] = useState('0.05')
  const [isStaking, setIsStaking] = useState(false)
  const [stakingStatus, setStakingStatus] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  const steps = [
    {
      id: 1,
      title: "Deposit",
      description: "Deposit NEAR tokens to your account",
      icon: "💳",
      details: "Transfer your NEAR tokens to the staking pool to begin the process"
    },
    {
      id: 2,
      title: "Swap",
      description: "Swap NEAR to SOL via cross-chain bridge",
      icon: "🔄",
      details: "Convert your NEAR tokens to SOL using our cross-chain swap functionality"
    },
    {
      id: 3,
      title: "Withdraw",
      description: "Withdraw SOL to Solana network",
      icon: "📤",
      details: "Move your SOL tokens to the Solana blockchain for staking"
    },
    {
      id: 4,
      title: "Deposit on Pool",
      description: "Stake SOL on Jito liquid staking pool",
      icon: "🎯",
      details: "Deposit your SOL into Jito's liquid staking pool to earn rewards"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border p-6 cursor-pointer transition-all ${
                currentStep === index
                  ? 'border-[#97FBE4] bg-[#97FBE4]/10'
                  : 'border-gray-800 hover:border-[#97FBE4]/50'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  currentStep === index
                    ? 'bg-[#97FBE4] text-black'
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${
                    currentStep === index ? 'text-[#97FBE4]' : 'text-white'
                  }`}>
                    Step {step.id}: {step.title}
                  </h3>
                  <p className="text-gray-300 mb-3">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-400">
                    {step.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800 max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-[#97FBE4]' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="px-6 py-3 bg-[#97FBE4] text-black hover:bg-[#5eead4] transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => {
                setShowStakingModal(true)
              }}
              className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Start Process
            </button>
          )}
        </div>
      </div>

      {/* Staking Modal */}
      {showStakingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#97FBE4]/30 max-w-md w-full rounded-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-[#97FBE4]">Jito Staking</h2>
              <button
                onClick={() => setShowStakingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Mode Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-900 p-1 rounded-lg flex">
                  <button
                    onClick={() => setStakingMode('stake')}
                    className={`px-6 py-2 rounded-md transition-all ${
                      stakingMode === 'stake'
                        ? 'bg-[#97FBE4] text-black font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Stake SOL
                  </button>
                  <button
                    onClick={() => setStakingMode('unstake')}
                    className={`px-6 py-2 rounded-md transition-all ${
                      stakingMode === 'unstake'
                        ? 'bg-[#97FBE4] text-black font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Unstake SOL
                  </button>
                </div>
              </div>

              {/* SOL Balance */}
              <div className="mb-4 p-4 bg-gray-900/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Available SOL Balance:</span>
                  <span className="text-[#97FBE4] font-semibold">{solBalance} SOL</span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount to {stakingMode === 'stake' ? 'stake' : 'unstake'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={solAmount}
                    onChange={(e) => setSolAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#97FBE4] focus:outline-none"
                  />
                  <button
                    onClick={() => setSolAmount(solBalance)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#97FBE4] text-sm hover:text-[#5eead4] transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>SOL Balance: {solBalance}</span>
                  <span>≈ $0.00</span>
                </div>
              </div>

              {/* Staking Pool Info */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2 text-[#97FBE4]">Jito Staking Pool</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">APY:</span>
                    <span className="ml-2 text-[#97FBE4]">7.2%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Staked:</span>
                    <span className="ml-2">$1.2B</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Min. Stake:</span>
                    <span className="ml-2">0.1 SOL</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Unlock Period:</span>
                    <span className="ml-2">Instant</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowStakingModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-800 text-white hover:bg-gray-700 transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (stakingMode === 'stake') {
                      setIsStaking(true)
                      setStakingStatus('Processing stake...')
                      
                      // Simulate staking process
                      setTimeout(() => {
                        setStakingStatus('Staked successfully!')
                        
                        // Show notification after 1 second
                        setTimeout(() => {
                          setShowNotification(true)
                          setShowStakingModal(false)
                          setIsStaking(false)
                          setStakingStatus('')
                          setSolAmount('')
                        }, 1000)
                      }, 5000)
                    } else {
                      setIsStaking(true)
                      setStakingStatus('Processing unstake...')
                      
                      // Simulate unstaking process
                      setTimeout(() => {
                        setStakingStatus('Unstaked successfully!')
                        
                        setTimeout(() => {
                          setShowStakingModal(false)
                          setIsStaking(false)
                          setStakingStatus('')
                          setSolAmount('')
                        }, 2000)
                      }, 3000)
                    }
                  }}
                  disabled={!solAmount || parseFloat(solAmount) <= 0 || isStaking}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    solAmount && parseFloat(solAmount) > 0 && !isStaking
                      ? "bg-[#97FBE4] text-black hover:bg-[#5eead4]"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isStaking ? stakingStatus : (stakingMode === 'stake' ? 'Stake SOL' : 'Unstake SOL')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-black border border-[#97FBE4] rounded-lg p-4 shadow-2xl max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#97FBE4] font-semibold">Staking Complete!</h3>
              <button
                onClick={() => setShowNotification(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Your SOL has been successfully staked to Jito pool.
            </p>
            <a
              href="https://solana.fm/tx/4SVoZuC18RSmP7STMikKcpbEm2oojnuXdDDncDHQjLJVBJhd3Thmr6MpJi8ne6DW854cohQWg9NpEJWRG1fPLtz?cluster=mainnet-alpha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#97FBE4] text-black font-semibold rounded-lg hover:bg-[#5eead4] transition-colors text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Transaction
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
