"use client";

import { useState, useEffect } from "react";
import { useNearWallet } from "../provider/wallet";
import { Connection as SolanaConnection } from "@solana/web3.js";
import { createPublicClient, http } from "viem";
import { SIGNET_CONTRACT } from "../lib/config/signet";
import { providers } from "near-api-js";

// Constants from the user's code
const INTENTS_CONTRACT_ID = "intents.near";
const SOL_DEFUSE_ASSET_ID = "nep141:sol.omft.near"; // Default SOL asset ID
const ETH_DEFUSE_ASSET_ID = "nep141:eth.omft.near"; // ETH asset ID
const SOLANA_RPC_URL = "https://api.devnet.solana.com";
const ETHEREUM_RPC_URL = "https://sepolia.drpc.org";
const NEAR_RPC_URL = "https://rpc.mainnet.near.org";

// Dummy addresses for display
const DUMMY_SOL_ADDRESS = "G58AYKiiNy7wwjPAeBAQWTM6S1kJwP3MQ3wRWWhhSJxA";
const DUMMY_ETH_ADDRESS = "0x427F9620Be0fe8Db2d840E2b6145D1CF2975bcaD";

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BalanceModal({ isOpen, onClose }: BalanceModalProps) {
  const { accountId, status, viewMethod } = useNearWallet();
  const [balances, setBalances] = useState({
    sol: "0",
    near: "0",
    eth: "0",
    loading: true,
  });
  const [addresses, setAddresses] = useState({
    sol: "",
    near: "",
    eth: "",
    loading: true,
  });

  useEffect(() => {
    const fetchBalancesAndAddresses = async () => {
      if (!accountId || status !== "authenticated" || !viewMethod) {
        setBalances({ sol: "0", near: "0", eth: "0", loading: false });
        setAddresses({ sol: "", near: "", eth: "", loading: false });
        return;
      }

      setBalances({ sol: "0", near: "0", eth: "0", loading: true });
      setAddresses({ sol: "", near: "", eth: "", loading: true });

      try {
        // Dynamically import chainsig.js to avoid Node.js module issues in browser
        const { chainAdapters } = await import("chainsig.js");
        
        // Initialize chain adapters
        const solanaConnection = new SolanaConnection(SOLANA_RPC_URL);
        const Solana = new chainAdapters.solana.Solana({
          solanaConnection,
          contract: SIGNET_CONTRACT,
        });

        const publicClient = createPublicClient({
          transport: http(ETHEREUM_RPC_URL),
        });
        const Evm = new chainAdapters.evm.EVM({
          publicClient,
          contract: SIGNET_CONTRACT,
        });

        // Derive addresses
        const derivationPathSol = "solana-1";
        const derivationPathEth = "ethereum-1";

        let solAddress = "";
        let ethAddress = "";

        try {
          const { publicKey } = await Solana.deriveAddressAndPublicKey(
            accountId,
            derivationPathSol
          );
          solAddress = publicKey;
        } catch (error) {
          console.error("Error deriving Solana address:", error);
        }

        try {
          const { address } = await Evm.deriveAddressAndPublicKey(
            accountId,
            derivationPathEth
          );
          ethAddress = address;
        } catch (error) {
          console.error("Error deriving Ethereum address:", error);
        }

        // Use derived addresses if available, otherwise use dummy addresses
        setAddresses({
          sol: solAddress || DUMMY_SOL_ADDRESS,
          near: accountId || "",
          eth: ethAddress || DUMMY_ETH_ADDRESS,
          loading: false,
        });

        // Fetch SOL balance (on NEAR intents)
        const solBalance = await viewMethod({
          contractId: INTENTS_CONTRACT_ID,
          method: "mt_balance_of",
          args: {
            account_id: accountId,
            token_id: SOL_DEFUSE_ASSET_ID,
          },
        });

        // Fetch ETH balance (on NEAR intents)
        let ethBalance = "0";
        try {
          const ethBalanceResult = await viewMethod({
            contractId: INTENTS_CONTRACT_ID,
            method: "mt_balance_of",
            args: {
              account_id: accountId,
              token_id: ETH_DEFUSE_ASSET_ID,
            },
          });
          ethBalance = ethBalanceResult ? (ethBalanceResult as string) : "0";
        } catch (ethError) {
          console.log("ETH not found in intents contract:", ethError);
        }

        // Fetch native NEAR balance using RPC provider
        let nearBalance = "0";
        try {
          const provider = new providers.JsonRpcProvider({ url: NEAR_RPC_URL });
          const accountState = await provider.query({
            request_type: "view_account",
            account_id: accountId,
            finality: "optimistic",
          });
          // NEAR balance is in yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
          // Type assertion needed as NEAR API types don't fully expose amount
          const accountData = accountState as unknown as { amount?: string };
          nearBalance = accountData.amount || "0";
        } catch (error) {
          console.error("Error fetching native NEAR balance:", error);
          // Fallback to wrapped NEAR balance
          try {
            const wrappedNearBalance = await viewMethod({
              contractId: INTENTS_CONTRACT_ID,
              method: "mt_balance_of",
              args: {
                account_id: accountId,
                token_id: "nep141:wrap.near",
              },
            });
            nearBalance = wrappedNearBalance as string;
          } catch (fallbackError) {
            console.error("Error fetching wrapped NEAR balance:", fallbackError);
          }
        }

        // Format balances (SOL has 9 decimals, ETH has 18 decimals, NEAR has 24 decimals)
        const formatBalance = (
          balance: string | number | null | undefined,
          decimals: number,
          maxDisplayDecimals?: number
        ): string => {
          if (!balance || balance === null || balance === undefined) {
            return "0";
          }

          try {
            const balanceStr = balance.toString().trim();
            if (!balanceStr || balanceStr === "0" || balanceStr === "") {
              return "0";
            }

            const balanceBigInt = BigInt(balanceStr);
            const divisor = BigInt(10 ** decimals);
            const whole = balanceBigInt / divisor;
            const fractional = balanceBigInt % divisor;

            if (fractional === BigInt(0)) {
              return whole.toString();
            }

            // Preserve trailing zeros by padding and not trimming
            let fractionalStr = fractional.toString().padStart(decimals, "0");

            // If maxDisplayDecimals is specified, limit the display
            if (maxDisplayDecimals !== undefined && maxDisplayDecimals < decimals) {
              // Round to maxDisplayDecimals
              const displayDivisor = BigInt(10 ** (decimals - maxDisplayDecimals));
              const roundedFractional = (fractional + displayDivisor / BigInt(2)) / displayDivisor;
              fractionalStr = roundedFractional.toString().padStart(maxDisplayDecimals, "0");
            }

            return `${whole}.${fractionalStr}`;
          } catch (error) {
            console.error("Error formatting balance:", balance, error);
            return "0";
          }
        };

        setBalances({
          sol: formatBalance(solBalance as string, 9),
          near: formatBalance(nearBalance as string, 24, 2), // Show only 2 decimal places for NEAR
          eth: formatBalance(ethBalance, 18, 6), // ETH has 18 decimals, show 6 decimal places
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching balances:", error);
        console.error("Error details:", {
          accountId,
          error: error instanceof Error ? error.message : String(error),
        });
        setBalances({ sol: "0", near: "0", eth: "0", loading: false });
        setAddresses({ sol: "", near: "", eth: "", loading: false });
      }
    };

    if (isOpen && accountId && status === "authenticated") {
      fetchBalancesAndAddresses();
    }
  }, [accountId, status, viewMethod, isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here if needed
    });
  };

  if (!isOpen) return null;

  const isAuthenticated = status === "authenticated" && accountId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-gray-700 rounded-xl p-6 max-w-md w-full relative">
        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#97FBE4]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#97FBE4]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#97FBE4]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#97FBE4]"></div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Your Balances</h2>
          {isAuthenticated && accountId && (
            <p className="text-sm text-gray-400">
              Account: <span className="font-mono text-[#97FBE4]">{accountId}</span>
            </p>
          )}
          {!isAuthenticated && (
            <p className="text-sm text-[#97FBE4]">
              Please connect your wallet to view balances
            </p>
          )}
        </div>

        {isAuthenticated ? (
          <div className="space-y-4">
            {/* SOL Balance */}
            <div className="bg-black border border-gray-700 rounded-lg p-4 relative group">
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#97FBE4]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#97FBE4]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#97FBE4]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#97FBE4]"></div>
              <p className="text-xs text-gray-400 mb-1">SOL (on Solana)</p>
              <p className="text-lg font-bold text-white mb-2">
                {balances.loading ? "Loading..." : balances.sol}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-400 font-mono flex-1 truncate">
                  {addresses.sol || DUMMY_SOL_ADDRESS}
                </p>
                <button
                  onClick={() => copyToClipboard(addresses.sol || DUMMY_SOL_ADDRESS)}
                  className="text-[#97FBE4] hover:text-[#5eead4] transition-colors"
                  title="Copy address"
                >
                  📋
                </button>
              </div>
            </div>

            {/* ETH Balance */}
            <div className="bg-black border border-gray-700 rounded-lg p-4 relative group">
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#97FBE4]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#97FBE4]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#97FBE4]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#97FBE4]"></div>
              <p className="text-xs text-gray-400 mb-1">ETH (on Ethereum)</p>
              <p className="text-lg font-bold text-white mb-2">
                {balances.loading ? "Loading..." : balances.eth}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-400 font-mono flex-1 truncate">
                  {addresses.eth || DUMMY_ETH_ADDRESS}
                </p>
                <button
                  onClick={() => copyToClipboard(addresses.eth || DUMMY_ETH_ADDRESS)}
                  className="text-[#97FBE4] hover:text-[#5eead4] transition-colors"
                  title="Copy address"
                >
                  📋
                </button>
              </div>
            </div>

            {/* NEAR Balance */}
            <div className="bg-black border border-gray-700 rounded-lg p-4 relative group">
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#97FBE4]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#97FBE4]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#97FBE4]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#97FBE4]"></div>
              <p className="text-xs text-gray-400 mb-1">NEAR (on NEAR)</p>
              <p className="text-lg font-bold text-white mb-2">
                {balances.loading ? "Loading..." : balances.near}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-gray-400 font-mono flex-1 truncate">
                  {addresses.near || accountId || "Loading..."}
                </p>
                <button
                  onClick={() => copyToClipboard(addresses.near || accountId || "")}
                  className="text-[#97FBE4] hover:text-[#5eead4] transition-colors"
                  title="Copy address"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black border border-[#97FBE4] rounded-lg p-4 text-center">
            <p className="text-[#97FBE4]">
              Please connect your NEAR wallet to view balances
            </p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#97FBE4] text-black font-bold rounded-lg hover:bg-[#5eead4] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

