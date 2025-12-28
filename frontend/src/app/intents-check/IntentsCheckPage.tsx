"use client";

import { useState } from "react";
import { useNearWallet } from "@/provider/wallet";
import DepositSection from "./components/DepositSection";
import SwapSection from "./components/SwapSection";
import WithdrawSection from "./components/WithdrawSection";

export default function IntentsCheckPage() {
  const { accountId, status } = useNearWallet();
  const [activeTab, setActiveTab] = useState<"deposit" | "swap" | "withdraw">("deposit");

  const isAuthenticated = status === "authenticated" && accountId;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#97FBE4] mb-2">Intents Check</h1>
          <p className="text-gray-400">
            Test deposit, swap, and withdraw functions from the intents contract
          </p>
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
              <p className="text-yellow-200">
                Please connect your NEAR wallet to use these functions
              </p>
            </div>
          )}
          {isAuthenticated && (
            <div className="mt-4 p-4 bg-[#97FBE4]/10 border border-[#97FBE4] rounded-lg">
              <p className="text-[#97FBE4]">
                Connected: <span className="font-mono">{accountId}</span>
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("deposit")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "deposit"
                ? "text-[#97FBE4] border-b-2 border-[#97FBE4]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("swap")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "swap"
                ? "text-[#97FBE4] border-b-2 border-[#97FBE4]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Swap
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "withdraw"
                ? "text-[#97FBE4] border-b-2 border-[#97FBE4]"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#141414] border border-gray-700 rounded-xl p-6">
          {activeTab === "deposit" && <DepositSection />}
          {activeTab === "swap" && <SwapSection />}
          {activeTab === "withdraw" && <WithdrawSection />}
        </div>
      </div>
    </div>
  );
}



