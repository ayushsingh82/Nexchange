'use client'

import { useState } from 'react'

export default function JitoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#97FBE4] mb-4">
            Jito Liquid Staking
          </h1>
          <p className="text-xl text-[#97FBE4]/80 max-w-2xl mx-auto mb-8">
            Stake SOL on Jito's liquid staking pool and earn MEV rewards through our cross-chain protocol.
          </p>
          
          {/* CTA Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-[#97FBE4] text-black font-bold text-lg hover:bg-[#5eead4] transition-colors"
          >
            Start Staking Process
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-[#97FBE4]/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="border-b border-[#97FBE4]/30 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#97FBE4]">
                    Jito Staking Process
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-300 mt-2">
                  Follow these 4 steps to stake SOL on Jito through NeXchange
                </p>
              </div>

              {/* Steps */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
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
                        // Handle final step action
                        alert('Starting Jito staking process...')
                        setIsModalOpen(false)
                      }}
                      className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      Start Process
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[#97FBE4] mb-8 text-center">
            Why Choose Jito Through NeXchange?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-[#97FBE4] mb-2">MEV Rewards</h4>
              <p className="text-gray-300">
                Earn additional rewards through MEV (Maximum Extractable Value) opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-[#97FBE4] mb-2">Liquid Staking</h4>
              <p className="text-gray-300">
                Maintain liquidity while earning staking rewards with Jito's liquid staking tokens
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌉</div>
              <h4 className="text-xl font-bold text-[#97FBE4] mb-2">Cross-Chain</h4>
              <p className="text-gray-300">
                Stake SOL from your NEAR wallet without managing multiple chains
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}