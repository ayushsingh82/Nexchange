# Portfolio Backend Plan

How NeXchange will turn the **Portfolio** page from demo data into real, on-chain-backed
positions. This covers: tracking what a user swaps on **NEAR Intents**, which chain they
**deposit/stake** on, and where the **backend system** lives that stitches it all together.

---

## 1. Problem

A NeXchange user holds only NEAR but acts across Solana and Ethereum via:

- **NEAR Intents (1Click / defuse)** — swaps NEAR → SOL/ETH and settles through solvers.
- **Chain Signatures (MPC)** — derives a Solana / EVM address per `derivationPath`, all owned
  by one NEAR account, then stakes into Jito / Marinade / Lido / Ether.fi.

There is no single place that knows "user X has 12.4 JitoSOL on Solana + 0.8 stETH on
Ethereum, all controlled from `alice.near`." The Portfolio page needs that aggregated view.

---

## 2. Data we need to reconstruct a portfolio

| Question | Source of truth |
|----------|-----------------|
| What did the user swap, and into what? | NEAR Intents (`intents.near`) settlement events + 1Click quote/status |
| Which chain did funds land on? | Chain-signature MPC derivation (`derivationPath` → Solana/EVM address) |
| What is staked, and how much? | On-chain LST balances at the derived addresses (JitoSOL, mSOL, stETH, eETH) |
| What is it worth / earning? | Token prices (CoinMarketCap) + protocol APY APIs (Jito, Lido) |

The derived addresses are **deterministic** from `(accountId, derivationPath)`, so given a NEAR
account we can recompute every chain address it controls without storing private keys.

---

## 3. Architecture

```
                         ┌────────────────────────────┐
   NEAR wallet  ───────► │  Frontend (Next.js)        │
   (accountId)          │  /portfolio                 │
                         └─────────────┬──────────────┘
                                       │  GET /api/portfolio?account=alice.near
                                       ▼
                         ┌────────────────────────────┐
                         │  Backend / Indexer service │
                         │  (the new piece)           │
                         └───┬───────────┬───────────┬┘
                             │           │           │
              ┌──────────────▼─┐ ┌───────▼──────┐ ┌──▼──────────────┐
              │ NEAR Intents   │ │ MPC address  │ │ Chain RPC reads │
              │ indexer        │ │ derivation   │ │ Solana / EVM    │
              │ (swap history) │ │ (per path)   │ │ (LST balances)  │
              └────────────────┘ └──────────────┘ └─────────────────┘
                             │           │           │
                             └───────────┴───────────┘
                                       ▼
                         ┌────────────────────────────┐
                         │  Postgres (positions, txs) │
                         │  + Redis cache             │
                         └────────────────────────────┘
```

### Where the backend lives
- A standalone service (Node/TypeScript, same stack as the SDK code in `protcols/`), deployed
  alongside the frontend (Vercel serverless functions for the API layer + a small always-on
  worker for indexing). Start as **Next.js Route Handlers** under `frontend/src/app/api/*`
  (we already added `/api/staking-apy` this way), graduate the indexer to a dedicated worker
  when volume grows.

---

## 4. Backend components

### 4.1 Intents indexer (swap tracking)
- Subscribe to NEAR blocks via **NEAR Lake / a NEAR RPC indexer** and filter for the user's
  `accountId` interacting with `intents.near` / `wrap.near` and the 1Click deposit addresses.
- For each settled intent, record a `swap` row: `{ account, fromToken, toToken, amount, solver,
  destChain, destAddress, txHash, status, ts }`.
- The 1Click SDK status endpoint (`one-click-sdk-typescript`) gives us the authoritative
  `SUCCESS`/`FAILED` + the destination deposit address.

### 4.2 Address-derivation service
- Pure function: `derive(accountId, chain, path) → address`. For production this calls NEAR's
  MPC `public_key` / the chain-signature derivation (secp256k1 for EVM, ed25519 for Solana),
  not the demo hash currently in the UI.
- Cache derived addresses per `(account, path)` in Postgres — they never change.

### 4.3 On-chain balance reader (deposit / stake tracking)
- For each derived address, read LST balances directly from chain:
  - **Solana**: `getTokenAccountsByOwner` for JitoSOL / mSOL mints (RPC).
  - **Ethereum**: `balanceOf` on stETH / eETH contracts (already have ABIs in
    `protcols/eth/components/*`).
- Convert LST → underlying using each protocol's exchange rate (stake-pool state / Lido share
  rate), so we can show "12.4 JitoSOL ≈ 13.1 SOL".

### 4.4 Enrichment
- Prices from CoinMarketCap (`fetchTokenPrice` already exists in `stake/constant.ts`).
- APY from the protocol APIs (`/api/staking-apy` already proxies Jito + Lido).

---

## 5. API surface (consumed by `/portfolio`)

```
GET /api/portfolio?account=alice.near
→ {
    account: "alice.near",
    addresses: [
      { chain: "NEAR",     path: "-",          address: "alice.near" },
      { chain: "Solana",   path: "solana-1",   address: "<base58>"   },
      { chain: "Ethereum", path: "ethereum-1", address: "0x..."      }
    ],
    positions: [
      { chain, protocol, token, amount, underlying, valueUsd, apy, txHash }
    ],
    swaps: [
      { fromToken, toToken, amount, destChain, txHash, status, ts }
    ],
    totals: { stakedUsd, yearlyRewardsUsd }
  }
```

The current `PortfolioPageContent.tsx` already renders exactly this shape with demo values —
swapping in this endpoint is a drop-in replacement (replace the hard-coded `positions` /
`addresses` with a `fetch('/api/portfolio?account=' + accountId)`).

---

## 6. Storage schema (Postgres)

```sql
accounts(account_id PK, created_at)
derived_addresses(account_id, chain, path, address, PRIMARY KEY(account_id, chain, path))
swaps(id, account_id, from_token, to_token, amount, dest_chain, dest_address, tx_hash, status, ts)
positions(id, account_id, chain, protocol, lst_token, lst_amount, underlying, updated_at)
price_cache(symbol, price_usd, updated_at)
```

Redis caches `/api/portfolio` responses (TTL ~30s) and APY/prices (TTL ~5m).

---

## 7. Rollout phases

1. **Phase 1 — read-only aggregation (no indexer).** On request, derive addresses for the
   connected account and read live LST balances from chain RPC on the fly. Slower but zero
   infra. Replaces demo data immediately.
2. **Phase 2 — indexer + cache.** Add the NEAR Intents indexer + Postgres so swap history and
   positions are precomputed; `/api/portfolio` reads from DB. Sub-second loads.
3. **Phase 3 — real-time.** Websocket / SSE push so the Portfolio page updates as swaps settle
   and stakes confirm.

---

## 8. Open items
- Exact MPC derivation parity between frontend display and backend (must match the address that
  actually receives funds).
- Handling multiple derivation paths per chain (user may stake from `solana-1`, `solana-2`, …).
- Pending/unbonding states (Lido withdrawal NFTs, Marinade tickets) as a distinct position type.
