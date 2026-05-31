'use client'

import Link from 'next/link'
import { useState } from 'react'

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'why', label: 'Why NeXchange' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'core-concepts', label: 'Core Concepts' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'user-flow', label: 'User Flow' },
  { id: 'chains', label: 'Supported Chains' },
  { id: 'staking', label: 'Staking Protocols' },
  { id: 'functions', label: 'Function Reference' },
  { id: 'security', label: 'Security' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'links', label: 'Links' },
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
    <pre className="bg-[#0a0f0d] border border-green-800/40 rounded-lg p-4 overflow-x-auto text-sm text-[#97FBE4] my-4">
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
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  )
}

export default function DocsPageContent() {
  const [active, setActive] = useState('introduction')

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
                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                      active === s.id
                        ? 'bg-[#97FBE4]/10 text-[#97FBE4]'
                        : 'text-gray-400 hover:text-[#97FBE4] hover:bg-[#97FBE4]/5'
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
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
                    className="border border-green-800/40 rounded-lg p-4 bg-[#0a0f0d]"
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
                  <div key={t} className="flex gap-4 border border-green-800/40 rounded-lg p-4 bg-[#0a0f0d]">
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
                <table className="w-full text-sm border border-green-800/40 rounded-lg overflow-hidden">
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
                      <td className="p-3"><Pill>Available</Pill></td>
                    </tr>
                    <tr className="border-t border-green-800/30">
                      <td className="p-3 font-medium">Ethereum</td>
                      <td className="p-3">Lido (stETH), Ether.fi (eETH)</td>
                      <td className="p-3"><Pill>Available</Pill></td>
                    </tr>
                    <tr className="border-t border-green-800/30">
                      <td className="p-3 font-medium">NEAR</td>
                      <td className="p-3">Meta Pool, LiNEAR</td>
                      <td className="p-3"><Pill tone="gray">Coming Soon</Pill></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="staking" title="Staking Protocols">
              <p>
                NeXchange integrates liquid-staking protocols on each chain. Deposits mint a liquid
                staking token (LST); withdrawals redeem it back to the native asset.
              </p>

              <h3 className="text-xl font-semibold text-[#97FBE4] mt-6">Jito — Solana</h3>
              <p>
                SPL stake pool. Deposit SOL to receive JitoSOL. Unstake instantly via the pool
                reserve, or delayed into a native stake account (no fee).
              </p>

              <h3 className="text-xl font-semibold text-[#97FBE4] mt-6">Marinade — Solana</h3>
              <p>
                Deposit SOL to receive mSOL. Unstake instantly via Marinade&apos;s liquidity pool
                (small fee), or order a delayed unstake ticket and claim after the cooldown.
              </p>

              <h3 className="text-xl font-semibold text-[#97FBE4] mt-6">Lido — Ethereum</h3>
              <p>
                Deposit ETH to receive stETH. Unstaking is a two-step async flow: request a
                withdrawal (mints an unstETH NFT), then claim ETH once the request is finalized.
              </p>

              <h3 className="text-xl font-semibold text-[#97FBE4] mt-6">Ether.fi — Ethereum</h3>
              <p>
                Deposit ETH to receive eETH (1:1 with staked ETH). Unstaking mirrors Lido: request
                a withdrawal (mints a WithdrawRequestNFT), then claim ETH once finalized.
              </p>
            </Section>

            <Section id="functions" title="Function Reference">
              <p>Standalone deposit / withdraw functions exposed by each integration.</p>

              <h3 className="text-lg font-semibold text-[#97FBE4] mt-4">Solana</h3>
              <Code>{`// Jito
stakeSOL(amount, wallet, connection?)
unstakeJitoSOLInstant(amount, wallet, connection?)
unstakeJitoSOLToStakeAccount(amount, wallet, connection?)

// Marinade
stakeSOLMarinade(amount, wallet, connection?)
liquidUnstakeMarinade(amount, wallet, connection?)
orderUnstakeMarinade(amount, wallet, connection?)  // → { signature, ticketAccount }
claimUnstakeMarinade(ticketAccount, wallet, connection?)`}</Code>

              <h3 className="text-lg font-semibold text-[#97FBE4] mt-4">Ethereum</h3>
              <Code>{`// Lido
depositLido(web3, userAddress, amount, referral?)
requestWithdrawalLido(web3, userAddress, amount)
getLidoWithdrawalRequests(web3, userAddress)
claimWithdrawalLido(web3, userAddress, requestId)

// Ether.fi
depositEtherFi(web3, userAddress, amount)
requestWithdrawEtherFi(web3, userAddress, amount)
isEtherFiRequestFinalized(web3, requestId)
claimWithdrawEtherFi(web3, userAddress, requestId)`}</Code>
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
                <a href="https://x.com/nexchange_near" target="_blank" rel="noreferrer"
                  className="px-4 py-2 border border-[#97FBE4]/30 rounded-lg text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors">
                  Twitter / X
                </a>
                <a href="https://github.com/ayushsingh82/Nexchange" target="_blank" rel="noreferrer"
                  className="px-4 py-2 border border-[#97FBE4]/30 rounded-lg text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors">
                  GitHub
                </a>
                <Link href="/explore"
                  className="px-4 py-2 border border-[#97FBE4]/30 rounded-lg text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors">
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
