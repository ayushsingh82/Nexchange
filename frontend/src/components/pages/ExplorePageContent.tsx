'use client'

import Link from 'next/link'
import { useStakingApy } from '../../app/stake/hooks/useStakingApy'

const CHAIN_LOGOS = {
  solana: 'https://s3.coinmarketcap.com/static-gravity/image/58ba0011f24d47c4b2e8adaa873bb280.jpg',
  ethereum: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJsxR0KYJtHgBOV1xHFe_HhZCX15J9tEWGLw&s',
  near: 'https://s3.coinmarketcap.com/static-gravity/image/ef3ad80e423a4449ab8e961b0d1edea4.png',
  sui: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png',
  ton: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
}

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
}

interface Protocol {
  name: string
  token: string
  logo: string
  available: boolean
  href?: string // only set when the staking flow is live
  symbol?: 'SOL' | 'ETH' // which live-APY feed to use
  fallbackApy?: number
}

interface Chain {
  key: string
  name: string
  logo: string
  status: 'Available' | 'Coming Soon'
  href?: string
  protocols: Protocol[]
}

const CHAINS: Chain[] = [
  {
    key: 'solana',
    name: 'Solana',
    logo: CHAIN_LOGOS.solana,
    status: 'Available',
    protocols: [
      { name: 'Jito', token: 'JitoSOL', logo: PROTOCOL_LOGOS.jito, available: true, href: '/jito', symbol: 'SOL', fallbackApy: 7.2 },
      { name: 'Marinade', token: 'mSOL', logo: PROTOCOL_LOGOS.marinade, available: false, fallbackApy: 7.0 },
    ],
  },
  {
    key: 'ethereum',
    name: 'Ethereum',
    logo: CHAIN_LOGOS.ethereum,
    status: 'Available',
    protocols: [
      { name: 'Ether.fi', token: 'eETH', logo: PROTOCOL_LOGOS.etherfi, available: true, href: '/etherfi', symbol: 'ETH', fallbackApy: 3.1 },
      { name: 'Lido', token: 'stETH', logo: PROTOCOL_LOGOS.lido, available: false, symbol: 'ETH', fallbackApy: 3.0 },
    ],
  },
  {
    key: 'near',
    name: 'NEAR Protocol',
    logo: CHAIN_LOGOS.near,
    status: 'Coming Soon',
    protocols: [
      { name: 'Meta Pool', token: 'stNEAR', logo: PROTOCOL_LOGOS.metapool, available: false, fallbackApy: 8.5 },
      { name: 'LiNEAR', token: 'LiNEAR', logo: PROTOCOL_LOGOS.linear, available: false, fallbackApy: 8.2 },
    ],
  },
  {
    key: 'sui',
    name: 'Sui',
    logo: CHAIN_LOGOS.sui,
    status: 'Coming Soon',
    protocols: [
      { name: 'Haedal', token: 'haSUI', logo: PROTOCOL_LOGOS.haedal, available: false, fallbackApy: 3.2 },
      { name: 'Volo', token: 'vSUI', logo: PROTOCOL_LOGOS.volo, available: false, fallbackApy: 3.0 },
    ],
  },
  {
    key: 'ton',
    name: 'TON',
    logo: CHAIN_LOGOS.ton,
    status: 'Coming Soon',
    protocols: [
      { name: 'Tonstakers', token: 'tsTON', logo: PROTOCOL_LOGOS.tonstakers, available: false, fallbackApy: 4.1 },
      { name: 'Whales', token: 'wsTON', logo: CHAIN_LOGOS.ton, available: false, fallbackApy: 3.9 },
    ],
  },
]

export default function ExplorePageContent() {
  const { data: apyData, loading: apyLoading } = useStakingApy()

  const apyFor = (p: Protocol) => {
    const live = p.symbol && apyData ? apyData[p.symbol] : undefined
    const isLive = !!live && live.source !== 'estimate'
    return { apy: isLive ? live!.apy : p.fallbackApy, isLive }
  }

  const liveChains = CHAINS.filter((c) => c.status === 'Available').length
  const livePools = CHAINS.reduce(
    (n, c) => n + c.protocols.filter((p) => p.available).length,
    0
  )
  const bestApy = Math.max(
    ...CHAINS.flatMap((c) => c.protocols.map((p) => apyFor(p).apy ?? 0))
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#97FBE4] mb-4">
            Staking Protocols
          </h1>
          <p className="text-base sm:text-xl text-[#97FBE4]/80 max-w-2xl mx-auto">
            The best liquid-staking pools across chains — all accessible from a single NEAR wallet.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-12">
          {[
            { label: 'Chains Live', value: liveChains },
            { label: 'Pools Live', value: livePools },
            { label: 'Best APY', value: apyLoading ? '…' : `${bestApy.toFixed(1)}%` },
          ].map((s) => (
            <div key={s.label} className="border border-[#97FBE4]/25 bg-[#00150E]/60 p-4 text-center">
              <p className="text-2xl sm:text-3xl font-light text-[#97FBE4]">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-[#97FBE4]/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {CHAINS.map((chain) => (
            <div
              key={chain.key}
              className="bg-[#00150E]/60 border border-gray-800 p-6 sm:p-8 hover:border-[#97FBE4]/60 transition-colors"
            >
              {/* Chain Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={chain.logo}
                    alt={chain.name}
                    className="w-11 h-11 object-cover border border-[#97FBE4]/20"
                  />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#97FBE4]">{chain.name}</h2>
                </div>
                <div
                  className={`px-3 py-1 text-xs font-medium ${
                    chain.status === 'Available'
                      ? 'bg-green-900/30 text-green-400 border border-green-500/50'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  {chain.status}
                </div>
              </div>

              {/* Protocols List */}
              <div className="space-y-3">
                {chain.protocols.map((protocol) => {
                  const { apy, isLive } = apyFor(protocol)
                  return (
                    <div
                      key={protocol.name}
                      className="flex items-center justify-between border border-[#97FBE4]/10 bg-black/30 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={protocol.logo}
                          alt={protocol.name}
                          className="w-8 h-8 object-cover border border-[#97FBE4]/20 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p
                            className={`text-sm truncate ${
                              protocol.available ? 'text-white font-medium' : 'text-gray-400'
                            }`}
                          >
                            {protocol.name}
                          </p>
                          <p className="text-[10px] text-[#97FBE4]/50">{protocol.token}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {apy != null && (
                          <span className="text-sm font-semibold text-[#97FBE4]">
                            {apyLoading ? '…' : `${apy.toFixed(2)}%`}
                            <span className="ml-1 text-[9px] text-gray-500">{isLive ? 'live' : 'est'}</span>
                          </span>
                        )}
                        {protocol.href ? (
                          <Link
                            href={protocol.href}
                            className="text-[10px] sm:text-xs bg-[#97FBE4] text-black font-semibold px-3 py-1.5 hover:bg-[#5eead4] transition-colors whitespace-nowrap"
                          >
                            Start Staking
                          </Link>
                        ) : (
                          <span className="text-[10px] sm:text-xs bg-gray-800 text-gray-400 px-3 py-1.5 border border-gray-700 whitespace-nowrap">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-[#97FBE4] p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-black mb-3">How It Works</h3>
            <p className="text-slate-900 leading-relaxed text-sm sm:text-base">
              Connect your NEAR wallet once and access staking protocols across every supported
              chain — no juggling multiple wallets or interfaces. Cross-chain signatures and NEAR
              intents make multi-chain staking as simple as a single-chain transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
