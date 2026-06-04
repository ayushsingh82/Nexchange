"use client"
import React from 'react';
import { Press_Start_2P } from 'next/font/google';

// Logos for the supported chains and the staking protocols on each.
const CHAIN_LOGOS = {
  solana: 'https://s3.coinmarketcap.com/static-gravity/image/58ba0011f24d47c4b2e8adaa873bb280.jpg',
  ethereum: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJsxR0KYJtHgBOV1xHFe_HhZCX15J9tEWGLw&s',
  near: 'https://s3.coinmarketcap.com/static-gravity/image/ef3ad80e423a4449ab8e961b0d1edea4.png',
  sui: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png',
  ton: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
};

const PROTOCOL_LOGOS = {
  jito: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqLFbY5fdeapK9qPbxMCdmhuZS84T5tCo0Nw&s',
  lido: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAgWY6sAzDq67Qo5bZNKCI_-WYssDSiV9odA&s',
  etherfi: 'https://s3.coinmarketcap.com/static-gravity/image/d841a331a19e4c86a67aa7996197bea8.jpg',
  marinade: 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
  metapool: 'https://avatars.githubusercontent.com/u/112860635?s=200&v=4',
  linear: 'https://coin-images.coingecko.com/coins/images/25210/large/sUld7aEX_400x400.png',
  haedal: 'https://coin-images.coingecko.com/coins/images/33512/large/hasui.png',
  volo: 'https://coin-images.coingecko.com/coins/images/33243/large/voloSUI_%283%29.png',
  tonstakers: 'https://coin-images.coingecko.com/coins/images/35404/large/icon_%281%29.png',
  ton: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
};

const SUPPORTED_CHAINS = [
  {
    name: 'Solana',
    symbol: 'SOL',
    logo: CHAIN_LOGOS.solana,
    status: 'Live',
    protocols: [
      { name: 'Jito', token: 'JitoSOL', logo: PROTOCOL_LOGOS.jito },
      { name: 'Marinade', token: 'mSOL', logo: PROTOCOL_LOGOS.marinade },
    ],
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: CHAIN_LOGOS.ethereum,
    status: 'Live',
    protocols: [
      { name: 'Lido', token: 'stETH', logo: PROTOCOL_LOGOS.lido },
      { name: 'Ether.fi', token: 'eETH', logo: PROTOCOL_LOGOS.etherfi },
    ],
  },
  {
    name: 'NEAR',
    symbol: 'NEAR',
    logo: CHAIN_LOGOS.near,
    status: 'Soon',
    protocols: [
      { name: 'Meta Pool', token: 'stNEAR', logo: PROTOCOL_LOGOS.metapool },
      { name: 'LiNEAR', token: 'LiNEAR', logo: PROTOCOL_LOGOS.linear },
    ],
  },
  {
    name: 'Sui',
    symbol: 'SUI',
    logo: CHAIN_LOGOS.sui,
    status: 'Soon',
    protocols: [
      { name: 'Haedal', token: 'haSUI', logo: PROTOCOL_LOGOS.haedal },
      { name: 'Volo', token: 'vSUI', logo: PROTOCOL_LOGOS.volo },
    ],
  },
  {
    name: 'TON',
    symbol: 'TON',
    logo: CHAIN_LOGOS.ton,
    status: 'Soon',
    protocols: [
      { name: 'Tonstakers', token: 'tsTON', logo: PROTOCOL_LOGOS.tonstakers },
      { name: 'Whales', token: 'wsTON', logo: CHAIN_LOGOS.ton },
    ],
  },
];

// A code-editor style visual showing the stake / unstake flow.
function StakeCodeEffect() {
  return (
    <div className="w-full max-w-md border border-[#97FBE4]/30 bg-[#00120C] shadow-2xl overflow-x-auto font-mono text-xs sm:text-sm">
      {/* Window bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#97FBE4]/20 bg-[#00150E]">
        <span className="w-3 h-3 bg-[#ff5f56]/80 block" />
        <span className="w-3 h-3 bg-[#ffbd2e]/80 block" />
        <span className="w-3 h-3 bg-[#27c93f]/80 block" />
        <span className="ml-3 text-xs text-[#97FBE4]/50">nexchange.ts</span>
      </div>

      {/* Code body */}
      <div className="p-5 leading-relaxed text-[#97FBE4]/90 space-y-1">
        <p className="text-[#97FBE4]/40">{`// stake straight from your NEAR wallet`}</p>
        <p>
          <span className="text-[#5eead4]">await</span>{' '}
          <span className="text-white">stake</span>({'{'}
        </p>
        <p className="pl-4"><span className="text-[#97FBE4]/60">chain:</span> <span className="text-amber-300">&quot;solana&quot;</span>,</p>
        <p className="pl-4"><span className="text-[#97FBE4]/60">protocol:</span> <span className="text-amber-300">&quot;jito&quot;</span>,</p>
        <p className="pl-4"><span className="text-[#97FBE4]/60">amount:</span> <span className="text-orange-400">10</span>,</p>
        <p>{'}'})</p>
        <p className="flex items-center gap-2 text-[#27c93f]">
          <img src={PROTOCOL_LOGOS.jito} alt="Jito" className="w-4 h-4 object-cover" />
          ✓ 10 SOL → 9.81 JitoSOL
        </p>

        <div className="h-3" />

        <p>
          <span className="text-[#5eead4]">await</span>{' '}
          <span className="text-white">unstake</span>({'{'}
        </p>
        <p className="pl-4"><span className="text-[#97FBE4]/60">protocol:</span> <span className="text-amber-300">&quot;lido&quot;</span>,</p>
        <p className="pl-4"><span className="text-[#97FBE4]/60">amount:</span> <span className="text-orange-400">2</span>,</p>
        <p>{'}'})</p>
        <p className="flex items-center gap-2 text-[#27c93f]">
          <img src={PROTOCOL_LOGOS.lido} alt="Lido" className="w-4 h-4 object-cover" />
          ✓ 2 stETH → 2 ETH
        </p>
        <p className="flex items-center">
          <span className="inline-block w-2 h-4 bg-[#97FBE4] animate-pulse" />
        </p>
      </div>
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

export default function HomePageContent() {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <div className={`min-h-screen bg-black text-[#97FBE4] overflow-hidden flex flex-col ${pixelFont.variable}`}>
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative z-10 px-4 pt-16 pb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-light mb-5 tracking-tight">
              <span className="block text-[#97FBE4]">Seamless. Secure.</span>
              <span className="block text-[#5eead4]">Multi-chain.</span>
            </h1>
            <p className="text-base md:text-lg text-[#97FBE4]/90 max-w-2xl mx-auto pixel-font">
              Cross-chain  staking protocol that allows users to stake on multiple chains  directly from  NEAR wallet. No bridging, no wallet switching, no friction.
            </p>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="relative z-10 px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <p className="text-xs text-[#97FBE4]/50 mb-2 pixel-font">WHY NEXCHANGE</p>
              <h2 className="text-2xl md:text-3xl font-light">Built different from the ground up</h2>
            </div>
            <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[130px] sm:auto-rows-[150px] md:auto-rows-[160px]">
              {/* Main Feature */}
              <div className="col-span-12 md:col-span-8 row-span-2 group relative bg-black p-6 md:p-8 border border-[#97FBE4]/30 shadow-xl overflow-hidden hover:border-[#97FBE4]/70 transition-all duration-300">
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#97FBE4]/60 mb-3 md:mb-4 pixel-font">
                    <span className="w-1.5 h-1.5 bg-[#97FBE4] animate-pulse" /> FEATURED
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light mb-3">No wallet switching. No friction.</h3>
                  <p className="text-[#97FBE4]/80 max-w-lg pixel-font text-xs sm:text-sm">
                    Just intent-based interoperability built for the next wave of Web3 users.
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#97FBE4] to-transparent w-full" />
              </div>
              {/* Live Stats */}
              <div className="col-span-12 md:col-span-4 row-span-2 bg-[#97FBE4] p-6 md:p-8 relative overflow-hidden shadow-xl live-stats-box">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <p className="text-sm mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-black animate-pulse" /> LIVE
                    </p>
                    <p className="text-4xl md:text-5xl font-light text-black">$1.2M+</p>
                    <p className="text-sm mt-1 text-black/70">TVL Staked</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black animate-pulse" />
                    <span className="text-xs text-black">Real-time</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 border border-black/10 -translate-y-1/2 translate-x-1/2" />
              </div>
              {/* Feature Cards */}
              <div className="col-span-6 md:col-span-3 group bg-black p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center hover:border-[#97FBE4]/70 hover:-translate-y-0.5 transition-all duration-300">
                <svg className="w-6 h-6 mb-3 text-[#97FBE4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                </svg>
                <h4 className="text-lg font-semibold mb-1 text-[#97FBE4]">Public good</h4>
                <p className="text-xs text-[#97FBE4]/80 pixel-font">builders, traders, and communities goes cross-chain.</p>
              </div>
              <div className="col-span-6 md:col-span-3 bg-[#97FBE4] p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center live-stats-box">
                <svg className="w-6 h-6 mb-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
                </svg>
                <h4 className="text-lg font-semibold mb-1 text-black">Cross-Chain Signatures</h4>
                <p className="text-xs text-black font-light pixel-font">stake on any chain directly from NEAR wallet.</p>
              </div>
              <div className="col-span-12 md:col-span-6 group bg-black p-6 border border-[#97FBE4]/30 shadow-md flex flex-col justify-center hover:border-[#97FBE4]/70 transition-all duration-300">
                <svg className="w-6 h-6 mb-3 text-[#97FBE4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
                <h4 className="text-lg font-semibold mb-1 text-[#97FBE4]">Intents</h4>
                <p className="text-xs text-[#97FBE4]/80 pixel-font">one click to move funds cross chain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Section — temporarily commented out
        <section className="relative z-10 px-4 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#97FBE4] to-[#5eead4] text-transparent bg-clip-text">
              Architecture
            </h2>
            <div className="bg-[#00150E] bg-opacity-80 p-6 border border-[#97FBE4]/30 w-full overflow-hidden">
              <div className="relative w-full h-[400px] md:h-[450px] overflow-auto scrollbar-thin scrollbar-thumb-[#97FBE4]/30 scrollbar-track-transparent">
                <img
                  src="/NeXchangearchitecture.png"
                  alt="NeXchange Architecture Diagram"
                  className="w-full h-auto object-contain"
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
        */}

        {/* Supported Chains Section */}
        <section className="relative z-10 px-4 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm text-[#97FBE4]/50 mb-3 pixel-font">SUPPORTED CHAINS</p>
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                Stake across every major chain
              </h2>
              <p className="text-[#97FBE4]/70 max-w-2xl mx-auto">
                One NEAR wallet, the best liquid-staking pools on each network. No bridging,
                no wallet switching — just pick a chain and stake.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUPPORTED_CHAINS.map((chain) => (
                <div
                  key={chain.name}
                  className="group bg-black border border-[#97FBE4]/30 p-6 shadow-xl hover:border-[#97FBE4]/70 transition-colors duration-300"
                >
                  {/* Chain header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={chain.logo}
                        alt={chain.name}
                        className="w-12 h-12 object-cover border border-[#97FBE4]/20 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div>
                        <p className="text-lg font-medium text-white">{chain.name}</p>
                        <p className="text-xs text-[#97FBE4]/50">{chain.symbol}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-1 border ${
                        chain.status === 'Live'
                          ? 'text-[#27c93f] border-[#27c93f]/40 bg-[#27c93f]/10'
                          : 'text-amber-300 border-amber-300/40 bg-amber-300/10'
                      }`}
                    >
                      {chain.status === 'Live' ? '● Live' : 'Soon'}
                    </span>
                  </div>

                  {/* Protocols */}
                  <p className="text-xs uppercase tracking-wider text-[#97FBE4]/40 mb-3">
                    Staking Pools
                  </p>
                  <div className="space-y-2">
                    {chain.protocols.map((p) => (
                      <div
                        key={p.name}
                        className="flex items-center gap-3 border border-[#97FBE4]/15 bg-black/30 px-3 py-2 hover:border-[#97FBE4]/40 transition-colors"
                      >
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-7 h-7 object-cover border border-[#97FBE4]/20"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-white">{p.name}</p>
                          <p className="text-[10px] text-[#97FBE4]/50">{p.token}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for Agents + CompareDemo Section */}
        <section className="relative z-10 px-4 py-12 md:py-20">
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
            {/* Right: stake/unstake code effect */}
            <div className="flex justify-center items-center">
              <div className="hover:scale-[1.02] transition-transform duration-300 w-full">
                <StakeCodeEffect />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-[#97FBE4]/30 overflow-hidden">
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
