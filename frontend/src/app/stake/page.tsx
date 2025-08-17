"use client";
import React, { useState } from "react";

const StakePage = () => {
  const [selectedToken, setSelectedToken] = useState("NEAR");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("stake"); // toggle state

  const stakingOptions = ["NEAR", "SOL", "ETH"];

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Staking
          </h1>
          <p className="text-xl text-emerald-100/90 max-w-2xl mx-auto">
            Earn rewards by staking your assets across multiple chains
          </p>
        </div>

        {/* Main Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-950/40 backdrop-blur-lg p-10 rounded-2xl border border-green-800/50 shadow-2xl">
            
            {/* Token Selection */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-6 text-green-400">
                Select Asset to {mode === "stake" ? "Stake" : "Unstake"}
              </h2>
              
              <div className="flex items-center justify-center">
                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-green-900/50 border border-green-500/50 text-white px-6 py-4 rounded-xl flex items-center justify-between hover:border-green-400 transition-colors min-w-[220px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                        {selectedToken.charAt(0)}
                      </div>
                      <div className="text-lg font-semibold">{selectedToken}</div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-green-400 transition-transform ${
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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-green-950/90 backdrop-blur-lg border border-green-800/50 rounded-xl shadow-lg z-50 overflow-hidden">
                      {stakingOptions.map((token) => (
                        <button
                          key={token}
                          onClick={() => {
                            setSelectedToken(token);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-green-800/30 transition-colors ${
                            selectedToken === token ? "bg-green-800/20" : ""
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                            {token.charAt(0)}
                          </div>
                          <div className="text-lg font-semibold text-white">
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
              <div className="bg-green-900/30 border border-green-800/50 rounded-full flex p-1">
                <button
                  onClick={() => setMode("stake")}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    mode === "stake"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "text-green-300"
                  }`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setMode("unstake")}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    mode === "unstake"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                      : "text-green-300"
                  }`}
                >
                  Unstake
                </button>
              </div>
            </div>

            {/* Action Box */}
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-green-300 font-semibold mb-2">
                  Amount to {mode === "stake" ? "Stake" : "Unstake"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-green-900/50 border border-green-500/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-green-400 transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-300 font-semibold">
                    {selectedToken}
                  </div>
                </div>
              </div>

              <button
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all shadow-lg ${
                  mode === "stake"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/30"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/30"
                }`}
              >
                {mode === "stake"
                  ? `Stake ${selectedToken}`
                  : `Unstake ${selectedToken}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StakePage;
