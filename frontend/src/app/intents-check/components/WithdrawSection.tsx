"use client";

import { useState } from "react";
import { useNearWallet } from "@/provider/wallet";
import { getQuote, transferMultiTokenForQuote, waitUntilQuoteExecutionCompletes } from "../utils/intents";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";

const COMMON_TOKENS = [
  { value: "nep141:wrap.near", label: "NEAR (wrap.near)" },
  { value: "nep141:sol.omft.near", label: "SOL" },
  { value: "nep141:eth.omft.near", label: "ETH" },
  { value: "nep141:usdc.omft.near", label: "USDC" },
];

const DESTINATION_CHAINS = [
  { value: "solana", label: "Solana" },
  { value: "ethereum", label: "Ethereum" },
  { value: "base", label: "Base" },
  { value: "arbitrum", label: "Arbitrum" },
];

export default function WithdrawSection() {
  const { accountId, status, callMethod } = useNearWallet();
  const [inputToken, setInputToken] = useState("nep141:sol.omft.near");
  const [outputToken, setOutputToken] = useState("solana");
  const [amount, setAmount] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [slippage, setSlippage] = useState("0.1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [quote, setQuote] = useState<any>(null);

  const isAuthenticated = status === "authenticated" && accountId;

  const handleGetQuote = async () => {
    if (!isAuthenticated || !accountId) {
      setError("Please connect your wallet");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!receiverAddress) {
      setError("Please enter a receiver address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setQuote(null);

    try {
      // Convert amount to smallest unit (assuming 18 decimals for most tokens)
      const amountInSmallestUnit = (BigInt(Math.floor(parseFloat(amount) * 1e18))).toString();

      const deadline = new Date();
      deadline.setMinutes(deadline.getMinutes() + 5);

      // Map output token to destination asset format
      const destinationAsset = outputToken.startsWith("nep141:") 
        ? outputToken 
        : `nep141:${outputToken}.omft.near`;

      const quoteRequest: QuoteRequest = {
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: parseFloat(slippage),
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: inputToken,
        destinationAsset: destinationAsset,
        amount: amountInSmallestUnit,
        refundTo: accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: receiverAddress,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: deadline.toISOString(),
      };

      const quoteResult = await getQuote(quoteRequest);
      setQuote(quoteResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get quote");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!quote || !isAuthenticated || !accountId || !callMethod) {
      setError("Please get a quote first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await transferMultiTokenForQuote(accountId, quote, inputToken, callMethod);
      await waitUntilQuoteExecutionCompletes(quote);
      setSuccess("Withdraw completed successfully!");
      setQuote(null);
      setAmount("");
      setReceiverAddress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute withdraw");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#97FBE4] mb-2">Withdraw Tokens</h2>
        <p className="text-gray-400 text-sm">
          Withdraw tokens from intents contract to destination chain
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Input Token (from intents)
          </label>
          <select
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#97FBE4]"
            disabled={!isAuthenticated || loading}
          >
            {COMMON_TOKENS.map((token) => (
              <option key={token.value} value={token.value}>
                {token.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Output Token / Destination Chain
          </label>
          <input
            type="text"
            value={outputToken}
            onChange={(e) => setOutputToken(e.target.value)}
            placeholder="solana, ethereum, base, or token ID like nep141:sol.omft.near"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#97FBE4]"
            disabled={!isAuthenticated || loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.000000000000000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#97FBE4]"
            disabled={!isAuthenticated || loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Receiver Address (on destination chain)
          </label>
          <input
            type="text"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="0x... or G58AYKiiNy7wwjPAeBAQWTM6S1kJwP3MQ3wRWWhhSJxA"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#97FBE4] font-mono text-sm"
            disabled={!isAuthenticated || loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Slippage Tolerance (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            placeholder="0.1"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#97FBE4]"
            disabled={!isAuthenticated || loading}
          />
        </div>

        {quote && (
          <div className="p-4 bg-[#97FBE4]/10 border border-[#97FBE4] rounded-lg">
            <p className="text-[#97FBE4] font-semibold mb-2">Quote Details:</p>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Input: {quote.amountInFormatted || quote.amountIn} {inputToken}</p>
              <p>Output: {quote.amountOutFormatted || quote.amountOut} {outputToken}</p>
              <p>Deposit Address: {quote.depositAddress}</p>
            </div>
          </div>
        )}

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

        <div className="flex gap-4">
          <button
            onClick={handleGetQuote}
            disabled={!isAuthenticated || loading || !amount || !receiverAddress}
            className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Getting Quote..." : "Get Quote"}
          </button>

          {quote && (
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#97FBE4] text-black font-bold rounded-lg hover:bg-[#5eead4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Executing..." : "Execute Withdraw"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



