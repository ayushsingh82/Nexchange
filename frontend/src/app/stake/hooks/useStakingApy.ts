"use client";
import { useEffect, useState } from "react";

export interface ApyInfo {
  apy: number;
  tvl: number | null;
  source: string;
}

export type ApyMap = Record<string, ApyInfo>;

// Fetches live staking APYs (Jito for SOL, Lido for ETH) from our server route.
export function useStakingApy() {
  const [data, setData] = useState<ApyMap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/staking-apy")
      .then((r) => r.json())
      .then((json) => {
        if (active) setData(json);
      })
      .catch((e) => console.error("Failed to load staking APY", e))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
