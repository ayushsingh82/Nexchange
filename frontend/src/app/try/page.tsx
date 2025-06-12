"use client"

import { useEffect, useState } from "react";
import { SIGNET_CONTRACT } from "../../utils/config";
import { chainAdapters } from "chainsig.js";
import { Connection as SolanaConnection } from '@solana/web3.js'
import { bigIntToDecimal } from "../../utils/bigIntToDecimal";
import { decimalToBigInt } from "../../utils/DecimalToBigInt";
import { useDebounce } from "../../utils/debounce";
import { useNearWallet } from "../../provider/wallet";
import PropTypes from 'prop-types';

const connection = new SolanaConnection("https://api.devnet.solana.com");

const Solana = new chainAdapters.solana.Solana({
  solanaConnection: connection,
  contract: SIGNET_CONTRACT
});

function SolanaView({ setStatus }: { setStatus: (status: string) => void }) {
  const { accountId, signIn, signOut } = useNearWallet();

  const [receiver, setReceiver] = useState("G58AYKiiNy7wwjPAeBAQWTM6S1kJwP3MQ3wRWWhhSJxA");
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request");
  const [signedTransaction, setSignedTransaction] = useState<string | null>(null);
  const [senderAddress, setSenderAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const [derivation, setDerivation] = useState("solana-1");
  const derivationPath = useDebounce(derivation, 500);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    setSenderAddress("Waiting for you to stop typing...");
  }, [derivation]);

  useEffect(() => {
    if (!accountId) return;
    
    setSolAddress();

    async function setSolAddress() {
      setStatus("Querying your address and balance");
      setSenderAddress(`Deriving address from path ${derivationPath}...`);

      try {
        const { publicKey } = await Solana.deriveAddressAndPublicKey(accountId, derivationPath);
        setSenderAddress(publicKey);

        const balance = await Solana.getBalance(publicKey);
        setStatus(
          `Your Solana address is:${publicKey}, balance: ${bigIntToDecimal(balance.balance, balance.decimals)} sol`
        );
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [accountId, derivationPath, setStatus]);

  async function relayTransaction() {
    if (!signedTransaction) return;
    
    setLoading(true);
    setStatus(
      "🔗 Relaying transaction to the Solana network... this might take a while"
    );

    try {
      const txHash = await Solana.broadcastTx(signedTransaction);

      setStatus(
        <>
          <a
            href={`https://explorer.solana.com/tx/${txHash.hash}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            {" "}
            ✅ Successfully Broadcasted{" "}
          </a>
        </>
      );
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setStep("request");
    setLoading(false);
  }

  const UIChainSignature = async () => {
    if (!accountId) {
      await signIn();
      return;
    }
    // Add your chain signature logic here
  };

  return (
    <div className="bg-green-950/40 backdrop-blur-lg p-8 rounded-xl border border-green-800/50 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-400">Solana Transaction</h2>
        
        {/* Wallet Connection Status */}
        <div className="mb-6 p-4 bg-black/40 rounded-lg border border-green-800/50">
          {accountId ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-green-400">Connected</span>
              </div>
              <div>
                <p className="text-sm text-emerald-100/80 mb-2">NEAR Account</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm break-all text-emerald-100/90 p-3 bg-black/40 rounded-lg border border-green-800/50">
                    {accountId}
                  </p>
                  <button 
                    onClick={() => copyToClipboard(accountId)}
                    className="p-2 hover:bg-green-900/60 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <svg className="w-4 h-4 text-emerald-100/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-white/90 mb-4">Connect your wallet to continue</p>
              <button
                onClick={signIn}
                className="w-full rounded-md bg-gradient-to-r from-green-400 to-lime-300 hover:from-green-300 hover:to-lime-200 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-green-800/50 text-white/90">
          You are working with <strong>DevTest</strong>.
          <br />
          You can get funds from the faucet:
          <a
            href="https://faucet.solana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 ml-1"
          >
            faucet.solana.com/
          </a>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-emerald-100/80 mb-2">
            Path:
          </label>
          <div>
            <input
              type="text"
              className="w-full p-3 bg-black/40 rounded-lg border border-green-800/50 text-white/90 focus:border-green-500 focus:outline-none transition-colors"
              value={derivation}
              onChange={(e) => setDerivation(e.target.value)}
              disabled={loading || !accountId}
            />
            <div className="mt-2 text-sm text-emerald-100/60">
              {senderAddress}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-emerald-100/80 mb-2">To:</label>
          <input
            type="text"
            className="w-full p-3 bg-black/40 rounded-lg border border-green-800/50 text-white/90 focus:border-green-500 focus:outline-none transition-colors"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            disabled={loading || !accountId}
          />
        </div>

        <div>
          <label className="block text-sm text-emerald-100/80 mb-2">
            Amount:
          </label>
          <input
            type="number"
            className="w-full p-3 bg-black/40 rounded-lg border border-green-800/50 text-white/90 focus:border-green-500 focus:outline-none transition-colors"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            step="0.1"
            min="0"
            disabled={loading || !accountId}
          />
          <div className="mt-2 text-sm text-emerald-100/60">solana units</div>
        </div>

        <div className="pt-4">
          {step === "request" && accountId && (
            <button
              className="w-full rounded-md bg-gradient-to-r from-green-400 to-lime-300 hover:from-green-300 hover:to-lime-200 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={UIChainSignature}
              disabled={loading}
            >
              Request Signature
            </button>
          )}
          {step === "relay" && (
            <button
              className="w-full rounded-md bg-gradient-to-r from-green-400 to-lime-300 hover:from-green-300 hover:to-lime-200 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={relayTransaction}
              disabled={loading}
            >
              Relay Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

SolanaView.propTypes = {
  setStatus: PropTypes.func.isRequired,
};

export default function TryPage() {
  const [status, setStatus] = useState("");

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Solana Transaction
          </h1>
          <div className="mb-6 p-4 bg-black/40 rounded-lg border border-green-800/50 text-white/90">
            {status}
          </div>
        </div>
        <SolanaView setStatus={setStatus} />
      </div>
    </div>
  );
}