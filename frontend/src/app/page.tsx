"use client"
import React from 'react';
import { Press_Start_2P } from 'next/font/google';
import dynamic from 'next/dynamic';

const Compare = dynamic(() => import('@/components/ui/compare').then(m => ({ default: m.Compare })), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

function CompareDemo() {
  return (
    <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 px-4">
      <Compare
        firstImage="https://assets.aceternity.com/code-problem.png"
        secondImage="https://assets.aceternity.com/code-solution.png"
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
        slideMode="hover"
      />
    </div>
  );
}

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

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

export default function Home() {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className={`min-h-screen bg-black text-[#97FBE4] overflow-hidden flex flex-col ${pixelFont.variable}`}>
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative z-10 px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 pt-12">
              <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-tight">
                <span className="block text-[#97FBE4] ">Seamless. Secure.</span>
                <span className="block text-[#5eead4] ">Multi-chain.</span>
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
                  <p className="text-sm text-[#97FBE4]/60 mb-4 pixel-font">FEATURED</p>
                  <h3 className="text-3xl font-light mb-3 "> No wallet switching. No friction.</h3>
                  <p className="text-[#97FBE4]/80 max-w-lg pixel-font text-sm">
                    Just intent-based interoperability built for the next wave of Web3 users.
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#97FBE4] to-transparent w-full" />
              </div>
              {/* Live Stats */}
              <div className="col-span-12 md:col-span-4 row-span-2 bg-[#97FBE4] rounded-2xl p-8 relative overflow-hidden shadow-xl live-stats-box">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <p className="text-sm mb-2 ">LIVE</p>
                    <p className="text-5xl font-light text-black ">$1.2M+</p>
                    <p className="text-sm mt-1 text-black ">TVL Staked</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black animate-pulse" />
                    <span className="text-xs text-black ">Real-time</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 border border-black/10 -translate-y-1/2 translate-x-1/2" />
              </div>
              {/* Feature Cards */}
              <div className="col-span-6 md:col-span-3 bg-[#00150E] bg-opacity-80 rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center">
                <h4 className="text-lg font-semibold mb-1 text-[#97FBE4] ">Public good</h4>
                <p className="text-xs text-[#97FBE4]/80 pixel-font">builders, traders, and communities goes cross-chain.</p>
              </div>
              <div className="col-span-6 md:col-span-3 bg-[#97FBE4] rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center live-stats-box">
                <h4 className="text-lg font-semibold mb-1 text-black ">Cross-Chain Signatures</h4>
                <p className="text-xs text-black font-light pixel-font">stake on any chain directly from NEAR wallet.</p>
              </div>
              <div className="col-span-12 md:col-span-6 bg-[#00150E] bg-opacity-80 rounded-2xl p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center">
                <h4 className="text-lg font-semibold mb-1 text-[#97FBE4] ">Intents</h4>
                <p className="text-xs text-[#97FBE4]/80 pixel-font">one click to move funds cross chain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="relative z-10 px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-transparent bg-clip-text">
              Architecture
            </h2>
            <div className="bg-[#00150E] bg-opacity-80 p-6 rounded-2xl border border-[#97FBE4]/30 w-full overflow-hidden">
              <div className="relative w-full h-[400px] md:h-[450px] overflow-auto scrollbar-thin scrollbar-thumb-[#97FBE4]/30 scrollbar-track-transparent">
                <img 
                  src="/NeXchangearchitecture.png" 
                  alt="NeXchange Architecture Diagram"
                  className="w-full h-auto object-contain"
                  style={{ 
                    maxWidth: '40%', 
                    margin: '0 auto',
                    backgroundColor: '#000000',
                    padding: '20px',
                    borderRadius: '12px'
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-[#97FBE4]/60 text-sm">
                  Scroll to explore the complete NeXchange cross-chain architecture
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Agents + CompareDemo Section */}
        <section className="relative z-10 px-4 py-20">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Built for Agents */}
            <div>
              <h2 className="text-3xl font-light mb-4">
                Built for Cross-Chain Staking
              </h2>
              <p className="text-[#97FBE4]/80 mb-8">
                Integrate cross-chain staking in minutes, not months. Simple, powerful intents that just work with NEAR wallet.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Cross-Chain Intents", desc: "Stake on any chain directly from NEAR wallet" },
                  { title: "No Wallet Switching", desc: "Seamless cross-chain operations without friction" },
                  { title: "Instant Staking", desc: "Deploy capital across multiple chains in one click" }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="w-6 h-6 border border-[#97FBE4]/30 flex items-center justify-center mt-1 hover:border-[#97FBE4] hover:scale-110 transition-all duration-300">
                      <div className="w-2 h-2 bg-[#97FBE4]/50 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-[#97FBE4]/80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: CompareDemo */}
            <div className="flex justify-center items-center">
              <div className="hover:scale-105 transition-transform duration-300">
                <CompareDemo />
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
      </main>
      
    </div>
  )
}