"use client";

import { useState } from "react";
import { useNearWallet } from "@/provider/wallet";
import { depositNearAsMultiToken } from "../utils/intents";

export default function DepositSection() {
  const { accountId, status, callMethod } = useNearWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated" && accountId;

  const handleDeposit = async () => {
    if (!isAuthenticated || !accountId || !callMethod) {
      setError("Please connect your wallet");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert NEAR to yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
      const amountInYocto = (BigInt(Math.floor(parseFloat(amount) * 1e24))).toString();

      const txHash = await depositNearAsMultiToken(
        accountId,
        amountInYocto,
        callMethod
      );

      setSuccess(`Deposit successful! Transaction: ${txHash}`);
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deposit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Deposit NEAR</h2>
        <p className="text-gray-400 text-sm">
          Deposit NEAR to the intents contract as a multi-token for cross-chain operations
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (NEAR)
          </label>
          <input
            type="number"
            step="0.000000000000000000000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#97FBE4]"
            disabled={!isAuthenticated || loading}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
            <p className="text-green-200">{success}</p>
          </div>
        )}

        <button
          onClick={handleDeposit}
          disabled={!isAuthenticated || loading || !amount}
          className="w-full px-6 py-3 bg-[#97FBE4] text-black font-bold rounded-lg hover:bg-[#5eead4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Deposit NEAR"}
        </button>
      </div>
    </div>
  );
}



