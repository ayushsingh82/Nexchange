'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useStakingApy } from '../../app/stake/hooks/useStakingApy'

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'why', label: 'Why NeXchange' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'core-concepts', label: 'Core Concepts' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'user-flow', label: 'User Flow' },
  { id: 'chains', label: 'Supported Chains' },
  { id: 'staking', label: 'Staking & Best Returns' },
  { id: 'security', label: 'Security' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'links', label: 'Links' },
]

const WEBSITE_URL = 'https://nexchange-near.vercel.app/'
const X_URL = 'https://x.com/nexchange_near'

// Pools we support. Live APY (Jito/Lido) is fetched; the rest use typical estimates.
const POOLS: {
  name: string
  chain: string
  token: string
  symbol?: string
  fallback: number
}[] = [
  { name: 'Jito', chain: 'Solana', token: 'JitoSOL', symbol: 'SOL', fallback: 7.2 },
  { name: 'Marinade', chain: 'Solana', token: 'mSOL', fallback: 7.0 },
  { name: 'Lido', chain: 'Ethereum', token: 'stETH', symbol: 'ETH', fallback: 3.0 },
  { name: 'Ether.fi', chain: 'Ethereum', token: 'eETH', fallback: 3.1 },
  { name: 'Haedal', chain: 'Sui', token: 'haSUI', fallback: 3.2 },
  { name: 'Volo', chain: 'Sui', token: 'vSUI', fallback: 3.0 },
  { name: 'Tonstakers', chain: 'TON', token: 'tsTON', fallback: 4.1 },
  { name: 'Whales', chain: 'TON', token: 'wsTON', fallback: 3.9 },
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <h2 className="text-3xl font-bold text-[#97FBE4] mb-6 border-b border-green-800/40 pb-3">
        {title}
      </h2>
      <div className="space-y-4 text-gray-300 leading-relaxed">{children}</div>
    </section>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-[#0a0f0d] border border-green-800/40 p-4 overflow-x-auto text-sm text-[#97FBE4] my-4">
      <code>{children}</code>
    </pre>
  )
}

function Pill({ children, tone = 'teal' }: { children: React.ReactNode; tone?: 'teal' | 'gray' }) {
  const cls =
    tone === 'teal'
      ? 'bg-[#97FBE4]/10 text-[#97FBE4] border-[#97FBE4]/30'
      : 'bg-gray-700/30 text-gray-400 border-gray-600/40'
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 border ${cls}`}>
      {children}
    </span>
  )
}

export default function DocsPageContent() {
  const [active, setActive] = useState('introduction')
  const { data: apyData, loading: apyLoading } = useStakingApy()

  // Merge live APY into the pool list and rank by return (highest first).
  const rankedPools = POOLS.map((p) => {
    const live = p.symbol && apyData ? apyData[p.symbol] : undefined
    const isLive = !!live && live.source !== 'estimate'
    return {
      ...p,
      apy: isLive ? live!.apy : p.fallback,
      isLive,
    }
  }).sort((a, b) => b.apy - a.apy)

  const best = rankedPools[0]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                Documentation
              </p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className={`text-sm px-3 py-2 transition-colors ${
                      active === s.id
                        ? 'bg-[#97FBE4]/10 text-[#97FBE4]'
                        : 'text-gray-400 hover:text-[#97FBE4] hover:bg-[#97FBE4]/5'
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>

              {/* Bottom-left links */}
              <div className="mt-8 pt-6 border-t border-green-800/40 flex flex-col gap-2">
                <a
                  href={X_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#97FBE4] transition-colors px-3 py-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Follow on X
                </a>
                <a
                  href={WEBSITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#97FBE4] transition-colors px-3 py-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none" strokeWidth={2} aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
                  </svg>
                  nexchange-near.vercel.app
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 max-w-3xl">
            {/* Hero */}
            <div className="mb-16">
              <Pill>Public Good · NEAR Ecosystem</Pill>
              <h1 className="text-4xl md:text-5xl font-bold text-[#97FBE4] mt-4 mb-4">
                NeXchange Documentation
              </h1>
              <p className="text-lg text-gray-400">
                A decentralized, intent-based cross-chain execution protocol. Swap and stake
                across Solana, Ethereum, and NEAR — all from a single NEAR wallet. No bridging,
                no wallet switching, no friction.
              </p>
            </div>

            <Section id="introduction" title="Introduction">
              <p>
                <strong className="text-white">NeXchange</strong> lets NEAR users execute
                cross-chain actions — swapping and staking on Solana or Ethereum — without ever
                leaving their NEAR wallet. There are no bridges, no wrapped tokens, and no central
                intermediaries.
              </p>
              <p>It is built around two complementary NEAR-native primitives:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-[#97FBE4]">NEAR Intents</strong> — signed messages
                  describing a desired outcome, settled by a network of solvers via the 1Click /
                  defuse protocol.
                </li>
                <li>
                  <strong className="text-[#97FBE4]">Chain Signatures</strong> — NEAR&apos;s MPC
                  service that derives and signs transactions for addresses on Solana and EVM
                  chains, all controlled by your NEAR account.
                </li>
              </ul>
              <p>
                Together they let a user hold only NEAR yet act natively across multiple
                ecosystems.
              </p>
            </Section>

            <Section id="why" title="Why NeXchange">
              <p>NeXchange is a modular, open-source public good that prioritizes:</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {[
                  ['Transparency', 'Fully auditable, on-chain execution.'],
                  ['Interoperability', 'Seamless NEAR ↔ Solana / EVM integration.'],
                  ['Modularity', 'Built to be extended and forked by the community.'],
                  ['User Experience', 'No wallet switching, no cross-chain gas juggling.'],
                ].map(([t, d]) => (
                  <div
                    key={t}
                    className="border border-green-800/40 p-4 bg-[#0a0f0d]"
                  >
                    <h3 className="text-[#97FBE4] font-semibold mb-1">{t}</h3>
                    <p className="text-sm text-gray-400">{d}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="how-it-works" title="How It Works">
              <p>Every action follows the same four-step lifecycle:</p>
              <ol className="list-decimal pl-6 space-y-3 mt-2">
                <li>
                  <strong className="text-white">Intent Creation</strong> — the user signs an
                  intent from their NEAR wallet (e.g. &quot;swap NEAR for SOL and stake it with
                  Jito&quot;).
                </li>
                <li>
                  <strong className="text-white">AI Optimization</strong> — the intent is
                  interpreted, the best route is found, and execution safety is checked.
                </li>
                <li>
                  <strong className="text-white">Broadcast to Solvers</strong> — the request is
                  broadcast to a decentralized network of solver nodes that compete to fill it.
                </li>
                <li>
                  <strong className="text-white">Execution &amp; Verification</strong> — the
                  winning solver executes on the destination chain and provides verifiable proof.
                </li>
              </ol>
            </Section>

            <Section id="core-concepts" title="Core Concepts">
              <h3 className="text-xl font-semibold text-[#97FBE4]">Intents</h3>
              <p>
                An intent is a signed message that states a <em>desired outcome</em> rather than a
                specific transaction. Solvers are free to find the optimal path to satisfy it.
                Intents carry replay protection and deadlines.
              </p>
              <h3 className="text-xl font-semibold text-[#97FBE4] mt-6">Solvers</h3>
              <p>
                Solvers are permissionless nodes that watch for intents and compete to execute
                them at the best price and speed. They post results back on-chain for verification.
              </p>
              <h3 className="text-xl font-semibold text-[#97FBE4] mt-6">Chain Signatures</h3>
              <p>
                Using NEAR&apos;s MPC contract, a single NEAR account can derive a deterministic
                address per <code className="text-[#97FBE4]">derivationPath</code> on Solana or EVM
                and sign transactions for it — no separate private keys, no extra wallets.
              </p>
              <h3 className="text-xl font-semibold text-[#97FBE4] mt-6">Multi-Token Vault</h3>
              <p>
                NEAR is wrapped and deposited into the{' '}
                <code className="text-[#97FBE4]">intents.near</code> contract as a multi-token
                balance, which solvers settle against during cross-chain swaps.
              </p>
            </Section>

            <Section id="architecture" title="Architecture">
              <p>The protocol is organized into four modules:</p>
              <div className="space-y-3 mt-2">
                {[
                  ['Frontend', 'Next.js dApp — wallet connect, staking UI, intents panel, docs.'],
                  ['Intents Engine', 'Wraps the 1Click / defuse SDK: deposit → quote → swap → withdraw.'],
                  ['Chain Signatures', 'chainsig.js adapters to derive and sign Solana / EVM transactions from NEAR.'],
                  ['Staking Protocols', 'Jito & Marinade (Solana), Lido & Ether.fi (Ethereum).'],
                ].map(([t, d]) => (
                  <div key={t} className="flex gap-4 border border-green-800/40 p-4 bg-[#0a0f0d]">
                    <div className="text-[#97FBE4] font-semibold w-40 flex-shrink-0">{t}</div>
                    <div className="text-sm text-gray-400">{d}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="user-flow" title="User Flow">
              <p>A complete cross-chain stake from a NEAR wallet looks like this:</p>
              <Code>{`1. Connect NEAR wallet
2. Deposit NEAR  →  wrap.near  →  intents.near (multi-token)
3. Get quote     →  1Click API (e.g. NEAR → SOL)
4. Swap          →  transfer to solver deposit address
5. Settle        →  poll execution status until SUCCESS
6. Withdraw      →  intents asset → native SOL / ETH address
7. Stake         →  deposit into Jito / Marinade / Lido / Ether.fi`}</Code>
              <p>
                Steps 2–6 are powered by intents; step 7 calls the protocol-specific staking
                functions documented below.
              </p>
            </Section>

            <Section id="chains" title="Supported Chains">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-green-800/40 overflow-hidden">
                  <thead className="bg-[#0a0f0d] text-[#97FBE4]">
                    <tr>
                      <th className="text-left p-3">Chain</th>
                      <th className="text-left p-3">Protocols</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-t border-green-800/30">
                      <td className="p-3 font-medium">Solana</td>
                      <td className="p-3">Jito (JitoSOL), Marinade (mSOL)</td>
                      <td className="p-3"><Pill>Live · Jito</Pill></td>
                    </tr>
                    <tr className="border-t border-green-800/30">
                      <td className="p-3 font-medium">Ethereum</td>
                      <td className="p-3">Lido (stETH), Ether.fi (eETH)</td>
                      <td className="p-3"><Pill tone="gray">Coming Soon</Pill></td>
                    </tr>
                    <tr className="border-t border-green-800/30">
                      <td className="p-3 font-medium">NEAR</td>
                      <td className="p-3">Meta Pool, LiNEAR</td>
                      <td className="p-3"><Pill tone="gray">Coming Soon</Pill></td>
                    </tr>
                    <tr className="border-t border-green-800/30">
                      <td className="p-3 font-medium">Sui</td>
                      <td className="p-3">Haedal (haSUI), Volo (vSUI)</td>
                      <td className="p-3"><Pill tone="gray">Coming Soon</Pill></td>
                    </tr>
                    <tr className="border-t border-green-800/30">
                      <td className="p-3 font-medium">TON</td>
                      <td className="p-3">Tonstakers (tsTON), Whales (wsTON)</td>
                      <td className="p-3"><Pill tone="gray">Coming Soon</Pill></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Staking is live on <span className="text-[#97FBE4]">Jito</span> first; the remaining
                pools are integrated in code and roll out next.
              </p>
            </Section>

            <Section id="staking" title="Staking & Best Returns">
              <p>
                NeXchange integrates the leading liquid-staking pools on each chain. You deposit the
                native asset, receive a liquid staking token (LST) that keeps earning, and can
                redeem it back at any time. Here is every pool we support, ranked by current APY.
              </p>

              {/* Best return callout */}
              {best && (
                <div className="border border-[#97FBE4]/40 bg-[#97FBE4]/10 p-5 my-6 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#97FBE4]/70 mb-1">
                      Highest return right now
                    </p>
                    <p className="text-white text-lg font-semibold">
                      {best.name} <span className="text-gray-400">({best.token} · {best.chain})</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#97FBE4]">
                      {apyLoading ? '…' : `${best.apy.toFixed(2)}%`}
                    </p>
                    <p className="text-xs text-gray-400">{best.isLive ? 'live APY' : 'est. APY'}</p>
                  </div>
                </div>
              )}

              {/* Ranked comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-green-800/40 overflow-hidden">
                  <thead className="bg-[#0a0f0d] text-[#97FBE4]">
                    <tr>
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">Pool</th>
                      <th className="text-left p-3">Chain</th>
                      <th className="text-left p-3">LST</th>
                      <th className="text-right p-3">APY</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {rankedPools.map((p, i) => (
                      <tr
                        key={p.name}
                        className={`border-t border-green-800/30 ${i === 0 ? 'bg-[#97FBE4]/5' : ''}`}
                      >
                        <td className="p-3 text-gray-500">{i + 1}</td>
                        <td className="p-3 font-medium text-white">
                          {p.name}
                          {i === 0 && (
                            <span className="ml-2 align-middle"><Pill>Best APY</Pill></span>
                          )}
                        </td>
                        <td className="p-3">{p.chain}</td>
                        <td className="p-3">{p.token}</td>
                        <td className="p-3 text-right font-semibold text-[#97FBE4]">
                          {apyLoading ? '…' : `${p.apy.toFixed(2)}%`}
                          <span className="ml-1 text-[10px] text-gray-500">
                            {p.isLive ? 'live' : 'est'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Live APY is pulled directly from each protocol&apos;s own API (Jito, Lido); pools
                marked <span className="text-gray-400">est</span> use recent typical yields. As a
                rule, Solana pools (Jito, Marinade) currently pay the highest returns.
              </p>

              <h3 className="text-xl font-semibold text-[#97FBE4] mt-8">The pools at a glance</h3>
              <p>
                <strong className="text-white">Jito (Solana)</strong> — deposit SOL, receive
                JitoSOL. Earns staking rewards <em>plus</em> MEV tips, which is why it usually tops
                the table. Unstake instantly or delayed with no fee.
              </p>
              <p>
                <strong className="text-white">Marinade (Solana)</strong> — deposit SOL, receive
                mSOL. Spreads stake across 100+ validators for resilience. Instant unstake via its
                liquidity pool, or a no-fee delayed ticket.
              </p>
              <p>
                <strong className="text-white">Lido (Ethereum)</strong> — deposit ETH, receive
                stETH, the most liquid LST in DeFi. Lower APY than Solana but on the most battle-
                tested network.
              </p>
              <p>
                <strong className="text-white">Ether.fi (Ethereum)</strong> — deposit ETH, receive
                eETH. Adds restaking rewards on top of base staking yield.
              </p>
            </Section>

            <Section id="security" title="Security">
              <ul className="list-disc pl-6 space-y-2">
                <li>No bridging or wrapped tokens across chains.</li>
                <li>On-chain verification of solver execution.</li>
                <li>Replay protection and deadlines on every intent.</li>
                <li>Non-custodial — keys never leave the user&apos;s control; addresses are MPC-derived.</li>
                <li>Permissionless solver participation with on-chain proofs.</li>
              </ul>
            </Section>

            <Section id="roadmap" title="Roadmap">
              <ul className="space-y-2">
                <li className="flex gap-3"><Pill>Live</Pill><span>Token swaps &amp; staking flows (Solana, Ethereum)</span></li>
                <li className="flex gap-3"><Pill tone="gray">Next</Pill><span>Developer docs &amp; SDKs</span></li>
                <li className="flex gap-3"><Pill tone="gray">Next</Pill><span>Additional chains (Cosmos, Aptos, TON)</span></li>
                <li className="flex gap-3"><Pill tone="gray">Next</Pill><span>DAO registry &amp; governance flows</span></li>
                <li className="flex gap-3"><Pill tone="gray">Next</Pill><span>Cross-chain DeFi (lend, borrow, yield)</span></li>
              </ul>
            </Section>

            <Section id="links" title="Links">
              <div className="flex flex-wrap gap-3">
                <a href={WEBSITE_URL} target="_blank" rel="noreferrer"
                  className="px-4 py-2 border border-[#97FBE4]/30 text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors">
                  Website
                </a>
                <a href={X_URL} target="_blank" rel="noreferrer"
                  className="px-4 py-2 border border-[#97FBE4]/30 text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors">
                  Twitter / X
                </a>
                <a href="https://github.com/ayushsingh82/Nexchange" target="_blank" rel="noreferrer"
                  className="px-4 py-2 border border-[#97FBE4]/30 text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors">
                  GitHub
                </a>
                <Link href="/explore"
                  className="px-4 py-2 border border-[#97FBE4]/30 text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors">
                  Explore App
                </Link>
              </div>
            </Section>
          </main>
        </div>
      </div>
    </div>
  )
}
