"use client";

import { useState, useEffect } from "react";
import { contracts, chainAdapters } from "chainsig.js";
import { Connection } from "@solana/web3.js";

// publicnode.com is a free public RPC — no API key, no rate limit headers
const SOLANA_RPC = "https://solana.publicnode.com";

const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: "mainnet",
  contractId: "v1.signer",
});

const solanaConnection = new Connection(SOLANA_RPC);

const SolanaAdapter = new chainAdapters.solana.Solana({
  solanaConnection,
  contract: MPC_CONTRACT,
});

export function useChainSigSolanaAddress(
  accountId: string | null,
  derivationPath = "solana-1"
) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // separate errors so a balance failure never hides the derived address
  const [addrError, setAddrError] = useState<string | null>(null);
  const [balError, setBalError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setAddress(null);
      setBalance(null);
      setAddrError(null);
      setBalError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setAddrError(null);
    setBalError(null);

    (async () => {
      // Step 1: derive address — this never hits the Solana RPC (pure crypto)
      let publicKey: string;
      try {
        const result = await SolanaAdapter.deriveAddressAndPublicKey(
          accountId,
          derivationPath
        );
        publicKey = result.publicKey;
        if (!cancelled) setAddress(publicKey);
      } catch (err) {
        if (!cancelled) {
          setAddrError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
        return;
      }

      // Step 2: fetch balance — hits Solana RPC, can fail independently
      try {
        const bal = await SolanaAdapter.getBalance(publicKey);
        if (cancelled) return;
        const decimals = bal.decimals ?? 9;
        const solBalance = (Number(bal.balance) / Math.pow(10, decimals)).toFixed(6);
        setBalance(solBalance);
      } catch {
        // balance fetch failed — address is still shown, balance shows as "N/A"
        if (!cancelled) setBalError("balance unavailable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [accountId, derivationPath]);

  return { address, balance, loading, addrError, balError, SolanaAdapter, MPC_CONTRACT };
}
