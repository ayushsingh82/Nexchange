"use client";

import { useState, useEffect } from "react";
import { contracts } from "chainsig.js";
import { PublicKey, Connection } from "@solana/web3.js";

const SOLANA_RPC = "https://solana.publicnode.com";

const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: "mainnet",
  contractId: "v1.signer",
});

const solanaConnection = new Connection(SOLANA_RPC);

// chainsig.js v1.1.14 changed getDerivedPublicKey to always run through K()
// which converts "ed25519:base58key" → "04{hex}". The Solana adapter then
// tries new PublicKey("04{hex}") which fails because '0' isn't base58.
// Fix: call getDerivedPublicKey directly and decode the 04{hex} to bytes.
async function deriveSOLAddress(accountId: string, path: string): Promise<string> {
  const raw = await MPC_CONTRACT.getDerivedPublicKey({
    path,
    predecessor: accountId,
    IsEd25519: true,
  });
  // raw = "04{64 hex chars}" — strip "04" prefix to get the 32-byte key
  const hexKey = raw.startsWith("04") ? raw.slice(2) : raw;
  const keyBytes = Buffer.from(hexKey, "hex");
  return new PublicKey(keyBytes).toBase58();
}

export function useChainSigSolanaAddress(
  accountId: string | null,
  derivationPath = "solana-1",
  balanceRefreshTrigger = 0
) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);
  const [balError, setBalError] = useState<string | null>(null);

  // Derive address once — only re-runs when accountId or path changes
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

    deriveSOLAddress(accountId, derivationPath)
      .then((solAddress) => {
        if (!cancelled) setAddress(solAddress);
      })
      .catch((err) => {
        if (!cancelled) setAddrError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [accountId, derivationPath]);

  // Fetch balance separately — re-runs whenever address changes OR balanceRefreshTrigger increments
  useEffect(() => {
    if (!address) return;

    let cancelled = false;
    setBalError(null);

    solanaConnection
      .getBalance(new PublicKey(address))
      .then((lamports) => {
        if (!cancelled) setBalance((lamports / 1e9).toFixed(6));
      })
      .catch(() => {
        if (!cancelled) setBalError("balance unavailable");
      });

    return () => { cancelled = true; };
  }, [address, balanceRefreshTrigger]);

  return { address, balance, loading, addrError, balError, MPC_CONTRACT, solanaConnection };
}
