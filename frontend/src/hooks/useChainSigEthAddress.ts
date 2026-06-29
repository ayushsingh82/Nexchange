"use client";

import { useState, useEffect } from "react";
import { contracts } from "chainsig.js";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";

export const ETH_RPC = "https://ethereum.publicnode.com";

export const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: "mainnet",
  contractId: "v1.signer",
});

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_RPC),
});

export function useChainSigEthAddress(
  accountId: string | null,
  derivationPath = "ethereum-1",
  balanceRefreshTrigger = 0
) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);

  // Derive ETH address from NEAR account via MPC
  useEffect(() => {
    if (!accountId) {
      setAddress(null);
      setBalance(null);
      setAddrError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setAddrError(null);

    (async () => {
      try {
        const { chainAdapters } = await import("chainsig.js");
        const EVMAdapter = new chainAdapters.evm.EVM({ publicClient, contract: MPC_CONTRACT });
        const { address: ethAddr } = await EVMAdapter.deriveAddressAndPublicKey(accountId, derivationPath);
        if (!cancelled) setAddress(ethAddr);
      } catch (err) {
        if (!cancelled) setAddrError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [accountId, derivationPath]);

  // Fetch ETH balance
  useEffect(() => {
    if (!address) return;
    let cancelled = false;

    publicClient.getBalance({ address: address as `0x${string}` })
      .then((bal) => {
        if (!cancelled) setBalance(parseFloat(formatEther(bal)).toFixed(6));
      })
      .catch(() => {
        if (!cancelled) setBalance("0");
      });

    return () => { cancelled = true; };
  }, [address, balanceRefreshTrigger]);

  return { address, balance, loading, addrError };
}
