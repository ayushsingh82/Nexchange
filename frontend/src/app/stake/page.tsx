"use client";
import React, { useState } from "react";
import { TokenSelector } from "./components/TokenSelector";
import { SUPPORTED_TOKENS, TokenInfo } from "./constant";

const StakePage = () => {
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(SUPPORTED_TOKENS[0]);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("stake"); // toggle state

  return (
    <main className="min-h-screen bg-black text-[#97FBE4] font-sans">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-transparent bg-clip-text pixel-font">
            Staking
          </h1>
          <p className="text-xl text-[#97FBE4]/80 max-w-2xl mx-auto">
            Earn rewards by staking your assets across multiple chains
          </p>
        </div>

        {/* Main Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#00150E] bg-opacity-80 backdrop-blur-lg p-10 rounded-2xl border border-[#97FBE4]/30 shadow-2xl">
            
            {/* Token Selection */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-6 text-[#97FBE4] pixel-font">
                Select Asset to {mode === "stake" ? "Stake" : "Unstake"}
              </h2>
              
              <div className="flex items-center justify-center">
                <TokenSelector
                  selectedToken={selectedToken}
                  onTokenSelect={setSelectedToken}
                  className="min-w-[300px]"
                />
              </div>
            </div>

            {/* Toggle Stake/Unstake */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#00150E] border border-[#97FBE4]/30 rounded-full flex p-1">
                <button
                  onClick={() => setMode("stake")}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors pixel-font ${mode === "stake" ? "bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-black" : "text-[#97FBE4]"}`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setMode("unstake")}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors pixel-font ${mode === "unstake" ? "bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-black" : "text-[#97FBE4]"}`}
                >
                  Unstake
                </button>
              </div>
            </div>

            {/* Action Box */}
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-[#97FBE4] font-semibold mb-2 pixel-font">
                  Amount to {mode === "stake" ? "Stake" : "Unstake"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#00150E] border border-[#97FBE4]/30 text-[#97FBE4] px-4 py-3 rounded-lg focus:outline-none focus:border-[#5eead4] transition-colors pixel-font"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5eead4] font-semibold pixel-font">
                    {selectedToken?.symbol || 'Select Token'}
                  </div>
                </div>
              </div>

              <button
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all shadow-lg pixel-font ${mode === "stake" || mode === "unstake" ? "bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-black hover:from-[#5eead4] hover:to-[#97FBE4] hover:shadow-[#97FBE4]/30" : ""}`}
              >
                {mode === "stake" ? `Stake ${selectedToken?.symbol || 'Token'}` : `Unstake ${selectedToken?.symbol || 'Token'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StakePage;