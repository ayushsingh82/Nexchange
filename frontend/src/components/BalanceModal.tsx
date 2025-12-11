"use client";

import { useState, useEffect } from "react";
import { useNearWallet } from "../provider/wallet";

// Constants from the user's code
const INTENTS_CONTRACT_ID = "intents.near";
const SOL_DEFUSE_ASSET_ID = "nep141:sol.omft.near"; // Default SOL asset ID
const ZEC_NEAR_DEFUSE_ASSET_ID = "nep141:zec.omft.near"; // Default ZEC asset ID

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BalanceModal({ isOpen, onClose }: BalanceModalProps) {
  const { accountId, status, viewMethod } = useNearWallet();
  const [balances, setBalances] = useState({
    sol: "0",
    near: "0",
    zec: "0",
    loading: true,
  });

  useEffect(() => {
    const fetchBalances = async () => {
      if (!accountId || status !== "authenticated" || !viewMethod) {
        setBalances({ sol: "0", near: "0", zec: "0", loading: false });
        return;
      }

      setBalances({ sol: "0", near: "0", zec: "0", loading: true });

      try {
        // Fetch SOL balance (on NEAR intents)
        const solBalance = await viewMethod({
          contractId: INTENTS_CONTRACT_ID,
          method: "mt_balance_of",
          args: {
            account_id: accountId,
            token_id: SOL_DEFUSE_ASSET_ID,
          },
        });

        // Fetch ZEC balance - check both FT contract and intents contract
        let zecBalanceIntents = "0";
        let zecBalanceFT = "0";

        // Check intents contract
        try {
          const intentsResult = await viewMethod({
            contractId: INTENTS_CONTRACT_ID,
            method: "mt_balance_of",
            args: {
              account_id: accountId,
              token_id: ZEC_NEAR_DEFUSE_ASSET_ID,
            },
          });
          zecBalanceIntents = intentsResult ? (intentsResult as string) : "0";
          console.log("ZEC balance from intents:", zecBalanceIntents);
        } catch (intentsError) {
          console.log("ZEC not found in intents contract:", intentsError);
        }

        // Check FT contract
        try {
          const ftResult = await viewMethod({
            contractId: "zec.omft.near",
            method: "ft_balance_of",
            args: {
              account_id: accountId,
            },
          });
          zecBalanceFT = ftResult ? (ftResult as string) : "0";
          console.log("ZEC balance from FT contract:", zecBalanceFT);
        } catch (ftError) {
          console.log("ZEC not found in FT contract:", ftError);
        }

        // Sum both balances
        const totalZecBalance = (BigInt(zecBalanceIntents) + BigInt(zecBalanceFT)).toString();
        console.log("Total ZEC balance (intents + FT):", totalZecBalance);

        // Fetch NEAR balance (wrapped NEAR on NEAR intents)
        const nearBalance = await viewMethod({
          contractId: INTENTS_CONTRACT_ID,
          method: "mt_balance_of",
          args: {
            account_id: accountId,
            token_id: "nep141:wrap.near",
          },
        });

        // Format balances (SOL has 9 decimals, ZEC has 8 decimals, NEAR has 24 decimals)
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
          zec: formatBalance(totalZecBalance, 8),
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching balances:", error);
        console.error("Error details:", {
          accountId,
          error: error instanceof Error ? error.message : String(error),
        });
        setBalances({ sol: "0", near: "0", zec: "0", loading: false });
      }
    };

    if (isOpen && accountId && status === "authenticated") {
      fetchBalances();
    }
  }, [accountId, status, viewMethod, isOpen]);

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
            <p className="text-sm text-yellow-400">
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
              <p className="text-lg font-bold text-white">
                {balances.loading ? "Loading..." : balances.sol}
              </p>
            </div>

            {/* NEAR Balance */}
            <div className="bg-black border border-gray-700 rounded-lg p-4 relative group">
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#97FBE4]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#97FBE4]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#97FBE4]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#97FBE4]"></div>
              <p className="text-xs text-gray-400 mb-1">NEAR (on NEAR)</p>
              <p className="text-lg font-bold text-white">
                {balances.loading ? "Loading..." : balances.near}
              </p>
            </div>

            {/* ZEC Balance */}
            <div className="bg-black border border-gray-700 rounded-lg p-4 relative group">
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#97FBE4]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#97FBE4]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#97FBE4]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#97FBE4]"></div>
              <p className="text-xs text-gray-400 mb-1">ZEC (on NEAR)</p>
              <p className="text-lg font-bold text-white">
                {balances.loading ? "Loading..." : balances.zec}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 text-center">
            <p className="text-yellow-200">
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

