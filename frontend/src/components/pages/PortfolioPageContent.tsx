'use client'

import { useState, useEffect } from 'react'
import { useNearWallet } from '@/provider/wallet'
import { useChainSigSolanaAddress } from '@/hooks/useChainSigSolanaAddress'
import { providers } from 'near-api-js'
import { PublicKey } from '@solana/web3.js'
import Link from 'next/link'

const SOLANA_RPC = 'https://solana.publicnode.com'
const DERIVATION_PATH = 'solana-1'
const INTENTS_CONTRACT = 'intents.near'
const JITO_SOL_MINT = 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn'
const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
const ASSOC_TOKEN_PROG = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'

// Token icon components
function NearIcon({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-black border border-[#97FBE4]/40 flex items-center justify-center overflow-hidden flex-shrink-0"
    >
      <img
        src="https://s3.coinmarketcap.com/static-gravity/image/ef3ad80e423a4449ab8e961b0d1edea4.png"
        alt="NEAR"
        style={{ width: size, height: size }}
        className="object-cover"
      />
    </div>
  )
}

function SolIcon({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-black border border-[#97FBE4]/40 flex items-center justify-center overflow-hidden flex-shrink-0"
    >
      <img
        src="https://s3.coinmarketcap.com/static-gravity/image/58ba0011f24d47c4b2e8adaa873bb280.jpg"
        alt="SOL"
        style={{ width: size, height: size }}
        className="object-cover"
      />
    </div>
  )
}

function JitoIcon({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-black border border-[#97FBE4]/40 flex items-center justify-center overflow-hidden flex-shrink-0"
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqLFbY5fdeapK9qPbxMCdmhuZS84T5tCo0Nw&s"
        alt="Jito"
        style={{ width: size, height: size }}
        className="object-cover"
      />
    </div>
  )
}

function IntentsIcon({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-[#97FBE4]/10 border border-[#97FBE4]/30 flex items-center justify-center flex-shrink-0"
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#97FBE4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
      </svg>
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-[#97FBE4]/20 border-t-[#97FBE4] rounded-full animate-spin" />
  )
}

function StatCard({ label, value, sub, loading }: { label: string; value: string; sub?: string; loading?: boolean }) {
  return (
    <div className="border border-gray-800 bg-[#00150E]/40 p-4">
      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      {loading ? (
        <div className="flex items-center h-7"><Spinner /></div>
      ) : (
        <>
          <p className="text-xl font-light text-[#97FBE4] font-mono">{value}</p>
          {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
        </>
      )}
    </div>
  )
}

interface AssetRowProps {
  icon: React.ReactNode
  symbol: string
  name: string
  balance: string
  tag?: string
  tagColor?: string
  loading?: boolean
  action?: { label: string; href: string }
}

function AssetRow({ icon, symbol, name, balance, tag, tagColor = '#97FBE4', loading, action }: AssetRowProps) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-900 last:border-0">
      {icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{symbol}</span>
          {tag && (
            <span
              className="text-[9px] px-1.5 py-0.5 border font-medium tracking-wide"
              style={{ color: tagColor, borderColor: `${tagColor}40` }}
            >
              {tag}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs truncate">{name}</p>
      </div>
      <div className="text-right flex items-center gap-3">
        {loading ? (
          <Spinner />
        ) : (
          <span className="text-white text-sm font-mono tabular-nums">{balance}</span>
        )}
        {action && (
          <Link
            href={action.href}
            className="text-[10px] px-2 py-1 bg-[#97FBE4]/10 border border-[#97FBE4]/30 text-[#97FBE4] hover:bg-[#97FBE4]/20 transition-colors whitespace-nowrap"
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
  badge,
}: {
  title: string
  children: React.ReactNode
  badge?: React.ReactNode
}) {
  return (
    <div className="border border-gray-800 bg-black/60">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">{title}</h2>
        {badge && (typeof badge === 'string'
          ? <span className="text-[9px] px-2 py-0.5 border border-[#97FBE4]/20 text-[#97FBE4]/60">{badge}</span>
          : badge
        )}
      </div>
      <div className="px-5">{children}</div>
    </div>
  )
}

export default function PortfolioPageContent() {
  const { accountId, status, viewMethod, signIn } = useNearWallet()
  const isAuthenticated = status === 'authenticated' && accountId

  const [showPath, setShowPath] = useState(false)
  const [copied, setCopied] = useState(false)

  const { address: solAddress, balance: solBalance, loading: addrLoading, addrError } =
    useChainSigSolanaAddress(accountId, DERIVATION_PATH)

  // NEAR wallet balance
  const [nearBalance, setNearBalance] = useState<string | null>(null)
  const [nearLoading, setNearLoading] = useState(false)
  useEffect(() => {
    if (!accountId) return
    setNearLoading(true)
    const provider = new providers.JsonRpcProvider({ url: 'https://rpc.mainnet.near.org' })
    provider.query({ request_type: 'view_account', account_id: accountId, finality: 'optimistic' })
      .then((res: any) => setNearBalance((Number(BigInt(res.amount)) / 1e24).toFixed(4)))
      .catch(() => setNearBalance(null))
      .finally(() => setNearLoading(false))
  }, [accountId])

  // jitoSOL balance — uses getParsedTokenAccountsByOwner (never throws for missing ATA)
  // polled every 30 s and re-fetchable via refreshJito counter
  const [jitoSolBalance, setJitoSolBalance] = useState<string | null>(null)
  const [jitoLoading, setJitoLoading] = useState(false)
  const [refreshJito, setRefreshJito] = useState(0)

  useEffect(() => {
    if (!solAddress) return

    async function fetchJitoBalance() {
      try {
        // Compute ATA address deterministically
        const derivedPubkey = new PublicKey(solAddress!)
        const [ata] = PublicKey.findProgramAddressSync(
          [
            derivedPubkey.toBuffer(),
            new PublicKey(TOKEN_PROGRAM).toBuffer(),
            new PublicKey(JITO_SOL_MINT).toBuffer(),
          ],
          new PublicKey(ASSOC_TOKEN_PROG),
        )
        // Raw JSON-RPC fetch — avoids any web3.js Connection issues in the browser
        const res = await fetch(SOLANA_RPC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0', id: 1,
            method: 'getTokenAccountBalance',
            params: [ata.toBase58(), { commitment: 'confirmed' }],
          }),
        })
        const json = await res.json()
        const amount = json.result?.value?.uiAmountString
        setJitoSolBalance(amount ?? '0')
      } catch {
        setJitoSolBalance('0')
      } finally {
        setJitoLoading(false)
      }
    }

    setJitoLoading(true)
    fetchJitoBalance()
    const interval = setInterval(fetchJitoBalance, 30_000)
    return () => clearInterval(interval)
  }, [solAddress, refreshJito])

  // Intents balances
  const [intentsNEAR, setIntentsNEAR] = useState<string | null>(null)
  const [intentsSOL, setIntentsSOL] = useState<string | null>(null)
  const [intentsLoading, setIntentsLoading] = useState(false)
  useEffect(() => {
    if (!accountId || !viewMethod) return
    setIntentsLoading(true)
    Promise.all([
      viewMethod({ contractId: INTENTS_CONTRACT, method: 'mt_balance_of', args: { account_id: accountId, token_id: 'nep141:wrap.near' } })
        .then((b: any) => setIntentsNEAR((Number(BigInt(b ?? '0')) / 1e24).toFixed(4)))
        .catch(() => setIntentsNEAR('0')),
      viewMethod({ contractId: INTENTS_CONTRACT, method: 'mt_balance_of', args: { account_id: accountId, token_id: 'nep141:sol.omft.near' } })
        .then((b: any) => setIntentsSOL((Number(BigInt(b ?? '0')) / 1e9).toFixed(6)))
        .catch(() => setIntentsSOL('0')),
    ]).finally(() => setIntentsLoading(false))
  }, [accountId, viewMethod])

  function copyAddress(addr: string) {
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-light text-[#97FBE4] tracking-tight">Portfolio</h1>
          <p className="text-gray-500 text-sm">Connect your NEAR wallet to view your assets</p>
        </div>
        <button
          onClick={signIn}
          className="px-6 py-2.5 border border-[#97FBE4] text-[#97FBE4] text-sm hover:bg-[#97FBE4]/10 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  const hasJitoStake = jitoSolBalance !== null && parseFloat(jitoSolBalance) > 0
  const hasIntentsNEAR = intentsNEAR !== null && parseFloat(intentsNEAR) > 0
  const hasIntentsSOL = intentsSOL !== null && parseFloat(intentsSOL) > 0

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-light text-[#97FBE4] tracking-tight">Portfolio</h1>
            <p className="text-gray-600 text-[11px] font-mono mt-0.5 truncate">{accountId}</p>
          </div>
          <div className="flex-shrink-0">
            <NearIcon size={36} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <StatCard
            label="NEAR"
            value={nearBalance !== null ? `${nearBalance}` : '—'}
            sub="wallet balance"
            loading={nearLoading}
          />
          <StatCard
            label="SOL"
            value={solBalance !== null ? `${solBalance}` : '—'}
            sub="derived address"
            loading={addrLoading}
          />
          <StatCard
            label="jitoSOL"
            value={jitoSolBalance !== null && jitoSolBalance !== '0' ? jitoSolBalance : '—'}
            sub="staked"
            loading={jitoLoading}
          />
        </div>

        {/* Derived Solana Address */}
        <Section title="Derived Solana Address" badge="MPC · v1.signer">
          <div className="py-4 space-y-3">
            {addrLoading ? (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <Spinner />
                <span>Deriving address…</span>
              </div>
            ) : addrError ? (
              <p className="text-red-400 text-sm">{addrError}</p>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <SolIcon size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#97FBE4] font-mono text-xs sm:text-sm break-all leading-relaxed">
                      {solAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => solAddress && copyAddress(solAddress)}
                    className="text-[10px] px-2 py-1 border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {copied ? '✓ Copied' : 'Copy address'}
                  </button>
                  <button
                    onClick={() => setShowPath(p => !p)}
                    className="text-[10px] px-2 py-1 border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
                  >
                    {showPath ? 'Hide path' : 'Show path'}
                  </button>
                  {showPath && (
                    <span className="text-[10px] font-mono text-gray-500">
                      path: <span className="text-[#97FBE4]">{DERIVATION_PATH}</span>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </Section>

        {/* NEAR Wallet */}
        <Section title="NEAR Wallet">
          <AssetRow
            icon={<NearIcon size={32} />}
            symbol="NEAR"
            name="NEAR Protocol"
            balance={nearBalance !== null ? `${nearBalance} NEAR` : '—'}
            loading={nearLoading}
          />
          {hasIntentsNEAR && (
            <AssetRow
              icon={<IntentsIcon size={32} />}
              symbol="wNEAR"
              name="Wrapped NEAR (intents)"
              balance={`${intentsNEAR} NEAR`}
              tag="intents"
              loading={intentsLoading}
            />
          )}
          {!hasIntentsNEAR && intentsNEAR !== null && (
            <div className="py-2 pb-3">
              <p className="text-[10px] text-gray-700">No intents balances.</p>
            </div>
          )}
        </Section>

        {/* Solana (Derived) */}
        <Section title="Solana — Derived Address">
          <AssetRow
            icon={<SolIcon size={32} />}
            symbol="SOL"
            name="Solana (on-chain)"
            balance={addrLoading ? '…' : addrError ? 'error' : solBalance !== null ? `${solBalance} SOL` : '—'}
            loading={addrLoading}
          />
          {hasIntentsSOL && (
            <AssetRow
              icon={<IntentsIcon size={32} />}
              symbol="SOL"
              name="SOL (in intents)"
              balance={`${intentsSOL} SOL`}
              tag="intents"
              loading={intentsLoading}
            />
          )}
        </Section>

        {/* Staking Portfolio */}
        <Section title="Staking Portfolio" badge={
          <button
            onClick={() => { setRefreshJito(n => n + 1) }}
            disabled={jitoLoading}
            className="text-[9px] px-2 py-0.5 border border-[#97FBE4]/20 text-[#97FBE4]/60 hover:border-[#97FBE4]/50 hover:text-[#97FBE4] transition-colors disabled:opacity-40"
          >
            {jitoLoading ? 'refreshing…' : '↻ Refresh'}
          </button>
        }>
          {jitoLoading ? (
            <div className="py-4 flex items-center gap-2">
              <Spinner />
              <span className="text-gray-500 text-xs">Loading staking positions…</span>
            </div>
          ) : hasJitoStake ? (
            <AssetRow
              icon={<JitoIcon size={32} />}
              symbol="jitoSOL"
              name="Jito Liquid Staked SOL"
              balance={`${jitoSolBalance} jitoSOL`}
              tag="staked"
              tagColor="#27c93f"
              action={{ label: 'Manage', href: '/jito' }}
            />
          ) : (
            <div className="py-5 flex flex-col items-center gap-3 text-center">
              <JitoIcon size={40} />
              <div>
                <p className="text-gray-500 text-sm">No staked positions yet</p>
                <p className="text-gray-700 text-xs mt-1">Stake SOL via Jito to earn liquid staking rewards</p>
              </div>
              <Link
                href="/jito"
                className="text-xs px-4 py-2 border border-[#97FBE4]/40 text-[#97FBE4] hover:bg-[#97FBE4]/10 transition-colors"
              >
                Start Staking →
              </Link>
            </div>
          )}
        </Section>

        {/* Quick Actions */}
        <Section title="Quick Actions">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3">
            {[
              { label: 'Stake on Jito', sub: 'NEAR → jitoSOL', href: '/jito', icon: <JitoIcon size={24} /> },
              { label: 'Explore Pools', sub: 'all protocols', href: '/explore', icon: (
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#97FBE4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
              )},
              { label: 'Stake Tokens', sub: 'multi-chain', href: '/stake', icon: (
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#97FBE4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                </div>
              )},
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-2.5 border border-gray-800 bg-[#00150E]/40 p-3 hover:border-[#97FBE4]/40 hover:bg-[#97FBE4]/5 transition-colors group"
              >
                {a.icon}
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium group-hover:text-[#97FBE4] transition-colors truncate">{a.label}</p>
                  <p className="text-gray-600 text-[10px] truncate">{a.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>

      </div>
    </div>
  )
}
