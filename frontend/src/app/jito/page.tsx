'use client'

import { useState } from 'react'

export default function JitoPage() {
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
                // Handle final step action
                alert('Starting Jito staking process...')
              }}
              className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Start Process
            </button>
          )}
        </div>
      </div>
    </div>
  )
}