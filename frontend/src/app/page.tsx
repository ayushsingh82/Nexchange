"use client"
import { Inter } from 'next/font/google'
import Link from 'next/link'
import React from 'react';

const inter = Inter({ subsets: ['latin'] })

const features = [
  {
    title: 'Optimal Swaps',
    description: 'Get the best rates and lowest slippage with LiquidSwap route-finding.',
  },
  {
    title: 'Cross-Chain',
    description: 'Bridge and swap across chains in one seamless flow.',
  },
  {
    title: 'Integrated Yield',
    description: 'Stake, lend, and farm directly from your wallet.',
  },
];

const faqs = [
  {
    q: 'What is NeXchange?',
    a: 'NeXchange is a decentralized exchange protocol that allows you stake on different chains in one seamless flow.',
  },
  {
    q: 'Which wallet is needed?',
    a: 'You can use any wallet from NEAR ecosystem.',
  },
  {
    q: 'What\'s the tech behind NeXchange?',
    a: 'NeXchange is built on top of NEAR intents and cross chain signatures.',
  },
];

export default function Home() {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <main className="min-h-screen bg-black text-[#97FBE4] font-sans overflow-hidden flex flex-col">
      <div className="container mx-auto px-4 py-20">
        {/* FEATURED Top Section */}
        <section className="relative z-10 px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 pt-12">
              <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-tight">
                <span className="block text-[#97FBE4]">Seamless. Secure.</span>
                <span className="block text-[#5eead4]">Multi-chain.</span>
              </h1>
              <p className="text-base md:text-lg text-[#97FBE4]/80 max-w-2xl pixel-font">
        Cross-chain  staking protocol that allows users to stake on multiple chains  directly from  NEAR wallet. No bridging, no wallet switching, no friction.
              </p>
            </div>
            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-4 auto-rows-[160px]">
              {/* Main Feature */}
              <div className="col-span-12 md:col-span-8 row-span-2 group relative bg-[#00150E] bg-opacity-80 rounded-2xl p-8 border border-[#97FBE4]/30 shadow-xl overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sm text-[#97FBE4]/60 mb-4">FEATURED</p>
                  <h3 className="text-3xl font-light mb-3"> No wallet switching. No friction.</h3>
                  <p className="text-[#97FBE4]/80 max-w-lg pixel-font">
                  Just intent-based interoperability built for the next wave of Web3 users.
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#97FBE4] to-transparent w-full" />
              </div>
              {/* Live Stats */}
              <div className="col-span-12 md:col-span-4 row-span-2 bg-[#97FBE4] rounded-2xl p-8 relative overflow-hidden shadow-xl live-stats-box">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <p className="text-sm mb-2">LIVE</p>
                    <p className="text-5xl font-light text-black">$1.2M+</p>
                    <p className="text-sm mt-1 text-black">TVL Staked</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black animate-pulse" />
                    <span className="text-xs text-black">Real-time</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 border border-black/10 -translate-y-1/2 translate-x-1/2" />
              </div>
              {/* Feature Cards */}
              <div className="col-span-6 md:col-span-3 bg-[#00150E] bg-opacity-80 rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center">
                <h4 className="text-lg font-semibold mb-1 text-[#97FBE4]">Public good</h4>
                <p className="text-xs text-[#97FBE4]/80">builders, traders, and communities goes cross-chain.</p>
              </div>
              <div className="col-span-6 md:col-span-3 bg-[#97FBE4] rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center live-stats-box">
                <h4 className="text-lg font-semibold mb-1 text-black">Cross-Chain Signatures</h4>
                <p className="text-xs text-black font-light pixel-font">stake on any chain directly from NEAR wallet.</p>
              </div>
              <div className="col-span-12 md:col-span-6 bg-[#00150E] bg-opacity-80 rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center">
                <h4 className="text-lg font-semibold mb-1 text-[#97FBE4]">Intents</h4>
                <p className="text-xs text-[#97FBE4]/80">one click to move funds cross chain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="relative z-10 px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-transparent bg-clip-text">
              Architecture
            </h2>
            <div className="bg-[#00150E] bg-opacity-80 p-8 rounded-2xl border border-[#97FBE4]/30 w-full h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[#97FBE4] text-lg mb-2">📊</div>
                <p className="text-[#97FBE4] text-lg">Architecture Diagram</p>
                <p className="text-[#5eead4]/70 text-sm mt-2">Image placeholder - Add your architecture diagram here</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 px-4 py-20 border-t border-[#97FBE4]/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-[#97FBE4]/30 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-[#00150E]/30 transition-all duration-300"
                  >
                    <span className="font-medium">{faq.q}</span>
                    <span className="text-2xl">{expandedFaq === index ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-[#97FBE4]/80">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      
    </main>
  )
}