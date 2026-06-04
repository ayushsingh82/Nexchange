import { NextResponse } from "next/server";

// Server-side proxy for live staking APYs.
// Runs on the server so we avoid browser CORS issues with the protocol APIs.

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Sensible fallbacks so the UI always has something to show if an API is down.
const FALLBACK = {
  NEAR: { apy: 8.5, tvl: null as number | null, source: "estimate" },
  SOL: { apy: 7.2, tvl: null as number | null, source: "estimate" },
  ETH: { apy: 5.2, tvl: null as number | null, source: "estimate" },
};

// Jito (Solana) — JitoSOL liquid staking pool stats
async function getJitoApy() {
  const apiUrl = "https://kobe.mainnet.jito.network/api/v1/stake_pool_stats";
  const start = new Date("2022-10-31T00:00:00Z");
  const end = new Date();

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket_type: "Daily",
      range_filter: { start: start.toISOString(), end: end.toISOString() },
      sort_by: { field: "BlockTime", order: "Asc" },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Jito API ${res.status}`);
  const data = await res.json();
  const apyArr = data?.apy ?? [];
  const tvlArr = data?.tvl ?? [];
  const apy = apyArr.length ? apyArr[apyArr.length - 1].data * 100 : null;
  const tvl = tvlArr.length ? tvlArr[tvlArr.length - 1].data : null;
  if (apy == null) throw new Error("Jito API: no apy data");
  return { apy, tvl, source: "Jito" };
}

// Lido (Ethereum) — stETH simple-moving-average APR
async function getLidoApy() {
  const res = await fetch("https://eth-api.lido.fi/v1/protocol/steth/apr/sma", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Lido API ${res.status}`);
  const data = await res.json();
  // Lido returns { data: { smaApr: number }, meta: {...} }; smaApr is already a percent.
  let apr = data?.data?.smaApr;
  if (apr == null) throw new Error("Lido API: no smaApr");
  if (apr < 1) apr = apr * 100; // guard if it ever comes back as a decimal
  return { apy: apr, tvl: null, source: "Lido" };
}

export async function GET() {
  const result: Record<string, { apy: number; tvl: number | null; source: string }> = {
    NEAR: { ...FALLBACK.NEAR },
    SOL: { ...FALLBACK.SOL },
    ETH: { ...FALLBACK.ETH },
  };

  const [sol, eth] = await Promise.allSettled([getJitoApy(), getLidoApy()]);

  if (sol.status === "fulfilled") result.SOL = sol.value;
  if (eth.status === "fulfilled") result.ETH = eth.value;

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
