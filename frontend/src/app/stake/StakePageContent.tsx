"use client";
import React, { useState } from "react";
import dynamicImport from "next/dynamic";
import { SUPPORTED_TOKENS, TokenInfo } from "./constant";

const TokenSelector = dynamicImport(() => import("./components/TokenSelector").then(m => ({ default: m.TokenSelector })), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function StakePageContent() {
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(SUPPORTED_TOKENS[0]);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("stake"); // toggle state

  return (
    <main className="min-h-screen bg-black text-[#97FBE4] font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Stake Tokens
          </h1>
          <p className="text-xl text-[#97FBE4]/80 max-w-2xl mx-auto">
            Earn rewards by staking your tokens across multiple chains from your NEAR wallet
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 p-1 rounded-lg">
            <button
              onClick={() => setMode("stake")}
              className={`px-6 py-3 rounded-md transition-all ${
                mode === "stake"
                  ? "bg-[#97FBE4] text-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Stake
            </button>
            <button
              onClick={() => setMode("unstake")}
              className={`px-6 py-3 rounded-md transition-all ${
                mode === "unstake"
                  ? "bg-[#97FBE4] text-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Unstake
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Token Selection */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Select Token</h2>
                <TokenSelector
                  selectedToken={selectedToken}
                  onTokenSelect={setSelectedToken}
                />
              </div>
            </div>

            {/* Staking Interface */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                  {mode === "stake" ? "Stake" : "Unstake"} {selectedToken?.symbol}
                </h2>
                
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#97FBE4] focus:outline-none"
                    />
                    <button
                      onClick={() => setAmount("0")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#97FBE4] text-sm hover:text-[#5eead4] transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>Balance: 0.00 {selectedToken?.symbol}</span>
                    <span>≈ $0.00</span>
                  </div>
                </div>

                {/* Staking Pool Info */}
                {selectedToken && (
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Staking Pool Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">APY:</span>
                        <span className="ml-2 text-[#97FBE4]">5.2%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Staked:</span>
                        <span className="ml-2">$2.4M</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Min. Stake:</span>
                        <span className="ml-2">1 {selectedToken.symbol}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Unlock Period:</span>
                        <span className="ml-2">24 hours</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                    amount && parseFloat(amount) > 0
                      ? "bg-[#97FBE4] text-black hover:bg-[#5eead4]"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  {mode === "stake" ? "Stake" : "Unstake"} {selectedToken?.symbol}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
