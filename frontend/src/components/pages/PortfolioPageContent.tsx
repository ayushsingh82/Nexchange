'use client'

import Link from 'next/link'
import { useNearWallet } from '@/provider/wallet'
import { useStakingApy } from '../../app/stake/hooks/useStakingApy'
import { FALLBACK_PRICES } from '../../app/stake/constant'

const CHAIN_LOGOS = {
  solana: 'https://s3.coinmarketcap.com/static-gravity/image/58ba0011f24d47c4b2e8adaa873bb280.jpg',
  ethereum: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJsxR0KYJtHgBOV1xHFe_HhZCX15J9tEWGLw&s',
  near: 'https://s3.coinmarketcap.com/static-gravity/image/ef3ad80e423a4449ab8e961b0d1edea4.png',
}

const PROTOCOL_LOGOS = {
  jito: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqLFbY5fdeapK9qPbxMCdmhuZS84T5tCo0Nw&s',
  lido: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAgWY6sAzDq67Qo5bZNKCI_-WYssDSiV9odA&s',
  marinade: 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
}

// Deterministic pseudo-address derivation from a NEAR account + derivation path.
// Mirrors the demo MPC derivation used elsewhere in the app (no live RPC here).
function hashHex(input: string, len: number) {
  let h = 0x811c9dc5
  let out = ''
  let i = 0
  while (out.length < len) {
    h ^= (input.charCodeAt(i % input.length) || 1) + i
    h = Math.imul(h, 0x01000193) >>> 0
    out += (h >>> 0).toString(16).padStart(8, '0')
    i++
  }
  return out.slice(0, len)
}

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function deriveEvm(account: string) {
  return '0x' + hashHex(account + ':ethereum-1', 40)
}
function deriveSolana(account: string) {
  const hex = hashHex(account + ':solana-1', 88)
  let out = ''
  for (let i = 0; i < 44; i++) out += B58[parseInt(hex.substr(i * 2, 2), 16) % 58]
  return out
}

function short(addr: string) {
  return addr.length > 16 ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr
}

export default function PortfolioPageContent() {
  const { accountId } = useNearWallet()
  const { data: apyData, loading: apyLoading } = useStakingApy()

  const account = accountId || 'demo.near'
  const solAddr = deriveSolana(account)
  const evmAddr = deriveEvm(account)

  const solApy = apyData?.SOL?.apy ?? 7.2
  const ethApy = apyData?.ETH?.apy ?? 3.0

  const prices = { SOL: FALLBACK_PRICES.SOL, ETH: FALLBACK_PRICES.ETH, NEAR: FALLBACK_PRICES.NEAR }

  // Demo staked positions for the connected account.
  const positions = [
    { chain: 'Solana', chainLogo: CHAIN_LOGOS.solana, protocol: 'Jito', protoLogo: PROTOCOL_LOGOS.jito, token: 'JitoSOL', amount: 12.4, priceSym: 'SOL' as const, apy: solApy, apyLive: apyData?.SOL?.source !== 'estimate', address: solAddr },
    { chain: 'Solana', chainLogo: CHAIN_LOGOS.solana, protocol: 'Marinade', protoLogo: PROTOCOL_LOGOS.marinade, token: 'mSOL', amount: 5.0, priceSym: 'SOL' as const, apy: 7.0, apyLive: false, address: solAddr },
    { chain: 'Ethereum', chainLogo: CHAIN_LOGOS.ethereum, protocol: 'Lido', protoLogo: PROTOCOL_LOGOS.lido, token: 'stETH', amount: 0.8, priceSym: 'ETH' as const, apy: ethApy, apyLive: apyData?.ETH?.source !== 'estimate', address: evmAddr },
  ]

  const valueOf = (p: { amount: number; priceSym: 'SOL' | 'ETH' }) => p.amount * prices[p.priceSym]
  const totalStaked = positions.reduce((s, p) => s + valueOf(p), 0)
  const yearlyRewards = positions.reduce((s, p) => s + valueOf(p) * (p.apy / 100), 0)

  const addresses = [
    { name: 'NEAR', logo: CHAIN_LOGOS.near, path: '—', addr: account, note: 'Your signing account' },
    { name: 'Solana', logo: CHAIN_LOGOS.solana, path: 'solana-1', addr: solAddr, note: 'Chain-signature derived' },
    { name: 'Ethereum', logo: CHAIN_LOGOS.ethereum, path: 'ethereum-1', addr: evmAddr, note: 'Chain-signature derived' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-wider text-[#97FBE4]/50 mb-2">Portfolio</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#97FBE4]">Your Cross-Chain Positions</h1>
          <p className="text-[#97FBE4]/70 mt-2 text-sm sm:text-base">
            {accountId ? (
              <>Signed in as <span className="text-white font-medium">{accountId}</span></>
            ) : (
              <>Connect your NEAR wallet from the navbar to see your own positions — showing demo data for now.</>
            )}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {[
            { label: 'Total Staked', value: `$${totalStaked.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
            { label: 'Est. Yearly Rewards', value: `$${yearlyRewards.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
            { label: 'Active Positions', value: positions.length },
            { label: 'Chains', value: 2 },
          ].map((s) => (
            <div key={s.label} className="border border-[#97FBE4]/25 bg-[#00150E]/60 p-4 sm:p-5">
              <p className="text-2xl sm:text-3xl font-light text-[#97FBE4]">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-[#97FBE4]/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Derived Addresses */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[#97FBE4] mb-4">Derived Addresses</h2>
          <p className="text-sm text-[#97FBE4]/60 mb-4">
            One NEAR account controls a native address on every chain via chain signatures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addresses.map((a) => (
              <div key={a.name} className="border border-[#97FBE4]/20 bg-[#00150E]/60 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img src={a.logo} alt={a.name} className="w-9 h-9 object-cover border border-[#97FBE4]/20" />
                  <div>
                    <p className="text-white font-medium">{a.name}</p>
                    <p className="text-[10px] text-[#97FBE4]/50">path: {a.path}</p>
                  </div>
                </div>
                <p className="font-mono text-xs text-[#97FBE4] break-all bg-black/40 border border-[#97FBE4]/10 px-2 py-2">
                  {short(a.addr)}
                </p>
                <p className="text-[10px] text-gray-500 mt-2">{a.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Staked Positions */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[#97FBE4] mb-4">Staked Positions</h2>
          <div className="overflow-x-auto border border-[#97FBE4]/20">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-[#00150E] text-[#97FBE4]/70 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left p-3">Pool</th>
                  <th className="text-left p-3">Chain</th>
                  <th className="text-right p-3">Amount</th>
                  <th className="text-right p-3">Value</th>
                  <th className="text-right p-3">APY</th>
                  <th className="text-right p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p, i) => (
                  <tr key={i} className="border-t border-[#97FBE4]/10 hover:bg-[#97FBE4]/5">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.protoLogo} alt={p.protocol} className="w-7 h-7 object-cover border border-[#97FBE4]/20" />
                        <div>
                          <p className="text-white font-medium">{p.protocol}</p>
                          <p className="text-[10px] text-[#97FBE4]/50">{p.token}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img src={p.chainLogo} alt={p.chain} className="w-5 h-5 object-cover border border-[#97FBE4]/20" />
                        <span className="text-gray-300">{p.chain}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right text-white">{p.amount} {p.token}</td>
                    <td className="p-3 text-right text-gray-300">
                      ${valueOf(p).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="p-3 text-right font-semibold text-[#97FBE4]">
                      {apyLoading ? '…' : `${p.apy.toFixed(2)}%`}
                      <span className="ml-1 text-[9px] text-gray-500">{p.apyLive ? 'live' : 'est'}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 border border-green-500/50">
                        Staked
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Token Holdings */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-[#97FBE4] mb-4">Token Holdings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions.map((p, i) => (
              <div key={i} className="flex items-center justify-between border border-[#97FBE4]/20 bg-[#00150E]/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.protoLogo} alt={p.token} className="w-8 h-8 object-cover border border-[#97FBE4]/20" />
                  <div>
                    <p className="text-white text-sm font-medium">{p.token}</p>
                    <p className="text-[10px] text-[#97FBE4]/50">{p.protocol} · {p.chain}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{p.amount}</p>
                  <p className="text-[10px] text-gray-500">
                    ${valueOf(p).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <Link
            href="/explore"
            className="inline-block px-6 py-3 bg-[#97FBE4] text-black text-sm font-semibold hover:bg-[#5eead4] transition-colors"
          >
            Stake More
          </Link>
        </div>
      </div>
    </div>
  )
}
