"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useNearWallet } from "../provider/wallet";


export default function Dashboard() {
  const [solanaAddress, setSolanaAddress] = useState("...");
  const [solanaBalance, setSolanaBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { accountId, signIn, callMethods, viewMethod, status } =
    useNearWallet();



  // Mock data - replace with actual Solana wallet integration
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setSolanaAddress("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
      setSolanaBalance(1.5);
      setIsLoading(false);
    }, 1000);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(solanaAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Dashboard
          </h1>
          <p className="text-xl text-white/90">Make solana wallet and connect</p>

          <button
            type="button"
            onClick={signIn}
            className="w-full rounded-md bg-gradient-to-r from-green-400 to-lime-300 hover:from-green-300 hover:to-lime-200 mt-2 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Connect Wallet 
          </button>
      
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Solana Wallet Box */}
          <div className="bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-green-400">
            
              Solana Wallet
            </h2>
            
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-gray-800 animate-pulse rounded"></div>
                <div className="h-8 bg-gray-800 animate-pulse rounded"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-emerald-100/80 mb-2">Address</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm break-all text-emerald-100/90 p-3 bg-black/40 rounded-lg border border-green-800/50">{solanaAddress}</p>
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-green-900/60 rounded-lg transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <svg className="w-4 h-4 text-emerald-100/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-emerald-100/60 mt-2 italic">This Solana address is generated using NEAR's chain abstraction technology</p>
                </div>
                <div>
                  <p className="text-sm text-emerald-100/80 mb-2">Balance</p>
                  <div className="p-3 bg-black/40 rounded-lg border border-green-800/50">
                    <p className="text-3xl font-bold text-green-400">$150.00</p>
                    <p className="text-sm text-emerald-100/60 mt-1">1.5 SOL</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Agent Box */}
          <div className="bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
            <h2 className="text-2xl font-semibold mb-6 text-green-400">AI Agent Status</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-400 text-lg">Active</span>
              </div>

              <p className="text-white/90 text-sm leading-relaxed">
                Your Solana agent is active and ready to sign transactions. The agent uses NEAR chain signature to manage Solana transactions without managing private keys.
              </p>

              <div className="space-y-3">
                <p className="text-sm text-emerald-100/80">Available Features:</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-green-900/60 rounded-lg text-sm text-emerald-100/90 hover:bg-green-900/80 transition-colors">Chain Abstraction</span>
                  <span className="px-4 py-2 bg-green-900/60 rounded-lg text-sm text-emerald-100/90 hover:bg-green-900/80 transition-colors">Intents</span>
                  <span className="px-4 py-2 bg-green-900/60 rounded-lg text-sm text-emerald-100/90 hover:bg-green-900/80 transition-colors">Omni Bridge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-black/80 backdrop-blur-lg p-6 rounded-xl border border-green-800/50 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Recent Transactions</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-green-800/30">
                  <th className="pb-3 text-sm font-medium text-emerald-100/80">Transaction Hash</th>
                  <th className="pb-3 text-sm font-medium text-emerald-100/80">From</th>
                  <th className="pb-3 text-sm font-medium text-emerald-100/80">To</th>
                  <th className="pb-3 text-sm font-medium text-emerald-100/80 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-800/30">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-black/60 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <p className="font-mono text-sm text-emerald-100/90">0x7d...3f2a</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-mono text-sm text-emerald-100/90">7xKX...AsU</p>
                    </td>
                    <td className="py-3">
                      <p className="font-mono text-sm text-emerald-100/90">8yLm...BvR</p>
                    </td>
                    <td className="py-3 text-right">
                      <p className="font-medium text-green-400 text-sm">+0.5 SOL</p>
                      <p className="text-xs text-emerald-100/60">2 hours ago</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
