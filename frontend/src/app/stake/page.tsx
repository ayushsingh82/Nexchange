"use client";
import React, { useState } from "react";

const StakePage = () => {
  const [selectedToken, setSelectedToken] = useState("NEAR");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("stake"); // toggle state

  const stakingOptions = ["NEAR", "SOL", "ETH"];

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
                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-[#00150E] border border-[#97FBE4]/30 text-[#97FBE4] px-6 py-4 rounded-xl flex items-center justify-between hover:border-[#5eead4] transition-colors min-w-[220px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#97FBE4] to-[#5eead4] flex items-center justify-center text-black font-bold text-lg">
                        {selectedToken.charAt(0)}
                      </div>
                      <div className="text-lg font-semibold pixel-font">{selectedToken}</div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-[#97FBE4] transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#00150E] bg-opacity-95 backdrop-blur-lg border border-[#97FBE4]/30 rounded-xl shadow-lg z-50 overflow-hidden">
                      {stakingOptions.map((token) => (
                        <button
                          key={token}
                          onClick={() => {
                            setSelectedToken(token);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-[#5eead4]/10 transition-colors ${
                            selectedToken === token ? "bg-[#97FBE4]/10" : ""
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#97FBE4] to-[#5eead4] flex items-center justify-center text-black font-bold text-lg">
                            {token.charAt(0)}
                          </div>
                          <div className="text-lg font-semibold text-[#97FBE4] pixel-font">
                            {token}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                    {selectedToken}
                  </div>
                </div>
              </div>

              <button
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all shadow-lg pixel-font ${mode === "stake" || mode === "unstake" ? "bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-black hover:from-[#5eead4] hover:to-[#97FBE4] hover:shadow-[#97FBE4]/30" : ""}`}
              >
                {mode === "stake" ? `Stake ${selectedToken}` : `Unstake ${selectedToken}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StakePage;
