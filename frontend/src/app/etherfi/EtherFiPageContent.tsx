"use client";

import { useState, useCallback, useEffect } from "react";
import { useNearWallet } from "@/provider/wallet";
import { useChainSigEthAddress, publicClient, MPC_CONTRACT, ETH_RPC } from "@/hooks/useChainSigEthAddress";
import {
  depositNearAsMultiToken,
  getQuote,
  transferMultiTokenForQuote,
  waitUntilQuoteExecutionCompletes,
} from "@/app/intents-check/utils/intents";
import { providers } from "near-api-js";

// ─── Constants ────────────────────────────────────────────────────────────────

// EtherFi Ethereum Mainnet contracts
const ETHERFI_LIQUIDITY_POOL = "0x308861A430be4cce5502d0A12724771Fc6DaF216";
const EETH_TOKEN             = "0x35fA164735182de50811E8e2E824cFb9B6118ac2";

// EtherFi deposit() selector — keccak256("deposit()")[0:4] = 0xd0e30db0
const DEPOSIT_SELECTOR = "0xd0e30db0";

// eETH approve(spender, amount) selector — keccak256("approve(address,uint256)")[0:4] = 0x095ea7b3
const APPROVE_SELECTOR = "0x095ea7b3";

// requestWithdraw(address,uint256) selector — keccak256("requestWithdraw(address,uint256)")[0:4] = 0x745400c9
const REQUEST_WITHDRAW_SELECTOR = "0x745400c9";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSmallestUnit(amount: string, decimals: number): string {
  const [whole, frac = ""] = amount.split(".");
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals);
  return (
    BigInt(whole) * BigInt(10 ** decimals) +
    BigInt(fracPadded || "0")
  ).toString();
}

function mapChainSigTxs(transactions: any[]) {
  return transactions.map((tx: any) => {
    const action = tx.actions[0];
    const fc = action.functionCall ?? action.params ?? action;
    const rawArgs = fc.args;
    const args =
      rawArgs instanceof Uint8Array
        ? JSON.parse(new TextDecoder().decode(rawArgs))
        : rawArgs instanceof Buffer
        ? JSON.parse(rawArgs.toString())
        : rawArgs ?? {};
    return {
      contractId: tx.receiverId,
      method: fc.methodName,
      args,
      gas: fc.gas?.toString() ?? "300000000000000",
      deposit: fc.deposit?.toString() ?? "1",
    };
  });
}

// Pad a hex value to 32 bytes (64 hex chars)
function padHex(hex: string): string {
  return hex.replace("0x", "").padStart(64, "0");
}

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "idle" | "loading" | "done" | "error";
interface StepState { status: StepStatus; message: string; txHash?: string; }
const INIT: StepState = { status: "idle", message: "" };

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({
  index, title, description, state, active, children,
}: {
  index: number; title: string; description: string;
  state: StepState; active: boolean; children?: React.ReactNode;
}) {
  const border =
    state.status === "done" ? "border-[#97FBE4]" :
    state.status === "error" ? "border-red-500" :
    state.status === "loading" ? "border-yellow-400" : "border-gray-700";

  return (
    <div className={`p-5 border-b last:border-b-0 ${border}`}>
      <div className="flex items-center gap-3 mb-1">
        <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border ${
          state.status === "done" ? "border-[#97FBE4] text-[#97FBE4]" :
          state.status === "error" ? "border-red-500 text-red-400" :
          state.status === "loading" ? "border-yellow-400 text-yellow-300" :
          "border-gray-600 text-gray-400"
        }`}>{index}</span>
        <div>
          <div className="font-semibold text-sm text-white">{title}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
        {state.status === "done" && <span className="ml-auto text-[#97FBE4] text-xs">✓ Done</span>}
      </div>

      {state.message && (
        <div className={`mt-2 text-xs px-3 py-2 font-mono break-all ${
          state.status === "error" ? "bg-red-900/20 text-red-300 border border-red-800" :
          state.status === "done" ? "bg-[#97FBE4]/10 text-[#97FBE4] border border-[#97FBE4]/30" :
          "bg-yellow-900/20 text-yellow-300 border border-yellow-800"
        }`}>
          {state.message}
          {state.txHash && (
            <a
              href={`https://etherscan.io/tx/${state.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 underline text-blue-400"
            >
              View on Etherscan ↗
            </a>
          )}
        </div>
      )}

      {active && children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EtherFiPageContent() {
  const { accountId, status, callMethod, callMethods, callMethodBatch, viewMethod } = useNearWallet();
  const isAuthenticated = status === "authenticated" && accountId;

  const [ethRefresh, setEthRefresh] = useState(0);
  const { address: derivedEthAddress, balance: ethBalance, loading: addrLoading, addrError } =
    useChainSigEthAddress(accountId, "ethereum-1", ethRefresh);

  // Step states
  const [step1, setStep1] = useState<StepState>(INIT);
  const [step2, setStep2] = useState<StepState>(INIT);
  const [step3, setStep3] = useState<StepState>(INIT);

  // Inputs
  const [depositAmount, setDepositAmount]   = useState("0.5");
  const [swapAmount, setSwapAmount]         = useState("0.1");
  const [withdrawAmount, setWithdrawAmount] = useState("0.001");

  // Balances
  const [nearBalance, setNearBalance]           = useState<string | null>(null);
  const [intentsNEARBalance, setIntentsNEAR]    = useState<string | null>(null);
  const [intentsETHBalance, setIntentsETH]      = useState<string | null>(null);

  // Fetch NEAR balance
  useEffect(() => {
    if (!accountId) return;
    (async () => {
      try {
        const provider = new providers.JsonRpcProvider({ url: "https://rpc.mainnet.near.org" });
        const account = await provider.query({
          request_type: "view_account",
          account_id: accountId,
          finality: "optimistic",
        }) as unknown as { amount: string };
        setNearBalance((Number(BigInt(account.amount)) / 1e24).toFixed(4));
      } catch { setNearBalance(null); }
    })();
  }, [accountId]);

  // Fetch intents NEAR balance
  useEffect(() => {
    if (!accountId || !viewMethod) return;
    viewMethod({ contractId: "intents.near", method: "mt_balance_of", args: { account_id: accountId, token_id: "nep141:wrap.near" } })
      .then((b: any) => setIntentsNEAR((Number(BigInt(b ?? "0")) / 1e24).toFixed(4)))
      .catch(() => setIntentsNEAR("0"));
  }, [accountId, viewMethod, step1.status]);

  // Fetch intents ETH balance
  useEffect(() => {
    if (!accountId || !viewMethod) return;
    viewMethod({ contractId: "intents.near", method: "mt_balance_of", args: { account_id: accountId, token_id: "nep141:eth.omft.near" } })
      .then((b: any) => setIntentsETH((Number(BigInt(b ?? "0")) / 1e18).toFixed(6)))
      .catch(() => setIntentsETH("0"));
  }, [accountId, viewMethod, step2.status]);

  // ── Step 1: Deposit NEAR → intents ───────────────────────────────────────
  const handleDeposit = useCallback(async () => {
    if (!accountId) return;
    setStep1({ status: "loading", message: "Wrapping NEAR and depositing to intents.near…" });
    try {
      await depositNearAsMultiToken(
        accountId,
        toSmallestUnit(depositAmount, 24),
        (contractId, actions) => callMethodBatch(contractId, actions),
      );
      setStep1({ status: "done", message: `${depositAmount} NEAR deposited to intents.` });
    } catch (err) {
      setStep1({ status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }, [accountId, callMethodBatch, depositAmount]);

  // ── Step 2: Swap NEAR → ETH inside intents ───────────────────────────────
  const handleSwap = useCallback(async () => {
    if (!accountId) return;
    setStep2({ status: "loading", message: "Getting quote for NEAR → ETH swap…" });
    try {
      const quote = await getQuote({
        originAsset: "nep141:wrap.near",
        destinationAsset: "nep141:eth.omft.near",
        amount: toSmallestUnit(swapAmount, 24),
        accountId,
      } as any);
      setStep2({ status: "loading", message: `Swapping ${quote.amountInFormatted ?? swapAmount} NEAR → ETH…` });
      await transferMultiTokenForQuote(accountId, quote, "nep141:wrap.near", callMethod);
      setStep2({ status: "loading", message: "Waiting for solver to settle…" });
      await waitUntilQuoteExecutionCompletes(quote);
      setStep2({ status: "done", message: "Swap complete — ETH is in intents." });
    } catch (err) {
      setStep2({ status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }, [accountId, callMethod, swapAmount]);

  // ── Step 3: Withdraw ETH from intents → derived ETH address ─────────────
  const handleWithdraw = useCallback(async () => {
    if (!accountId || !derivedEthAddress) return;
    setStep3({ status: "loading", message: `Getting quote to withdraw ETH to ${derivedEthAddress.slice(0, 10)}…` });
    try {
      const quote = await getQuote({
        originAsset: "nep141:eth.omft.near",
        destinationAsset: "eth:0x0000000000000000000000000000000000000000",
        amount: toSmallestUnit(withdrawAmount, 18),
        accountId,
        recipient: derivedEthAddress,
        recipientType: "DESTINATION_CHAIN",
      } as any);
      setStep3({ status: "loading", message: `Sending ${quote.amountInFormatted ?? withdrawAmount} ETH to derived address…` });
      await transferMultiTokenForQuote(accountId, quote, "nep141:eth.omft.near", callMethod);
      setStep3({ status: "loading", message: "Waiting for solver to deliver ETH…" });
      await waitUntilQuoteExecutionCompletes(quote);
      setEthRefresh(n => n + 1);
      setStep3({ status: "done", message: `ETH delivered to ${derivedEthAddress.slice(0, 10)}…` });
    } catch (err) {
      setStep3({ status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }, [accountId, callMethod, derivedEthAddress, withdrawAmount]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#97FBE4] mb-1">EtherFi Liquid Staking</h1>
          <p className="text-gray-400 text-sm">
            Deposit NEAR → swap to ETH → withdraw to your chain-sig Ethereum address → stake on EtherFi
          </p>
        </div>

        {/* Account info */}
        {!isAuthenticated ? (
          <div className="p-4 border border-yellow-500 bg-yellow-900/10 text-yellow-200 text-sm">
            Connect your NEAR wallet to begin.
          </div>
        ) : (
          <div className="p-4 border border-gray-700 text-sm space-y-1">
            <div className="text-gray-400">
              NEAR account: <span className="text-white font-mono">{accountId}</span>
            </div>
            <div className="text-gray-400">
              Derived Ethereum address:{" "}
              {addrLoading ? (
                <span className="text-yellow-400">deriving…</span>
              ) : addrError ? (
                <span className="text-red-400">{addrError}</span>
              ) : (
                <span className="text-[#97FBE4] font-mono break-all">{derivedEthAddress}</span>
              )}
            </div>
            {ethBalance && (
              <div className="text-gray-400">
                ETH balance: <span className="text-white font-mono">{ethBalance} ETH</span>
              </div>
            )}
          </div>
        )}

        {/* Steps 1–3 */}
        <div className="border border-gray-700">
          {/* Step 1 */}
          <StepCard index={1} title="Deposit NEAR" description="Wrap NEAR and deposit to intents.near" state={step1} active={!!isAuthenticated}>
            {nearBalance !== null && (
              <div className="text-xs text-gray-400 mt-3 mb-2">
                Wallet balance: <span className="text-[#97FBE4] font-mono">{nearBalance} NEAR</span>
              </div>
            )}
            <div className="flex gap-3 items-center mt-3">
              <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
                step="0.1" min="0.1" placeholder="0.5"
                className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-[#97FBE4]"
              />
              <span className="text-gray-400 text-sm">NEAR</span>
              <button onClick={handleDeposit} disabled={step1.status === "loading"}
                className="px-4 py-2 bg-[#97FBE4] text-black font-bold text-sm hover:bg-[#5eead4] transition-colors disabled:opacity-50">
                {step1.status === "loading" ? "Depositing…" : "Deposit"}
              </button>
            </div>
          </StepCard>

          <div className="border-t border-gray-800" />

          {/* Step 2 */}
          <StepCard index={2} title="Swap NEAR → ETH" description="Swap wrapped NEAR to ETH via 1Click API" state={step2} active={!!isAuthenticated}>
            {intentsNEARBalance !== null && (
              <div className="text-xs text-gray-400 mt-3 mb-2">
                In intents: <span className="text-[#97FBE4] font-mono">{intentsNEARBalance} NEAR</span>
              </div>
            )}
            <div className="flex gap-3 items-center mt-3">
              <input type="number" value={swapAmount} onChange={e => setSwapAmount(e.target.value)}
                step="0.01" min="0.01" placeholder="0.1"
                className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-[#97FBE4]"
              />
              <span className="text-gray-400 text-sm">NEAR → ETH</span>
              <button onClick={handleSwap} disabled={step2.status === "loading"}
                className="px-4 py-2 bg-[#97FBE4] text-black font-bold text-sm hover:bg-[#5eead4] transition-colors disabled:opacity-50">
                {step2.status === "loading" ? "Swapping…" : "Swap"}
              </button>
            </div>
          </StepCard>

          <div className="border-t border-gray-800" />

          {/* Step 3 */}
          <StepCard index={3} title="Withdraw ETH to Derived Address" description="Send ETH from intents to your chain-sig Ethereum address via 1Click" state={step3} active={!!isAuthenticated}>
            {!derivedEthAddress ? (
              <p className="text-yellow-400 text-sm mt-3">Waiting for derived address…</p>
            ) : (
              <div className="space-y-3 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono break-all">To: {derivedEthAddress}</span>
                  {intentsETHBalance !== null && (
                    <span className="text-gray-400 shrink-0 ml-3">
                      In intents: <span className="text-[#97FBE4] font-mono">{intentsETHBalance} ETH</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                    step="0.001" min="0.001" placeholder="0.001"
                    className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-[#97FBE4]"
                  />
                  <span className="text-gray-400 text-sm">ETH</span>
                  <button onClick={handleWithdraw} disabled={step3.status === "loading"}
                    className="px-4 py-2 bg-[#97FBE4] text-black font-bold text-sm hover:bg-[#5eead4] transition-colors disabled:opacity-50">
                    {step3.status === "loading" ? "Withdrawing…" : "Withdraw"}
                  </button>
                </div>
              </div>
            )}
          </StepCard>

          <div className="border-t border-gray-800" />

          {/* Step 4: Stake on EtherFi */}
          <StepCard index={4} title="Stake ETH on EtherFi" description="Sign a deposit() transaction from your derived address via NEAR chain signatures" state={INIT} active={!!isAuthenticated}>
            <div className="mb-4 p-3 border border-yellow-600/40 bg-yellow-900/10 text-yellow-300 text-xs space-y-1 mt-3">
              <div className="font-semibold">Requirements before staking</div>
              <ul className="list-disc list-inside space-y-0.5 text-yellow-400/90">
                <li>Derived Ethereum address needs <span className="font-mono font-bold">≥ 0.001 ETH</span> on-chain</li>
                <li>Gas fees ~0.001–0.003 ETH depending on network congestion</li>
                <li>Minimum stake: <span className="font-mono">0.001 ETH</span></li>
              </ul>
              <div className="text-yellow-500/70 pt-0.5">
                If ETH balance is too low, go back to Step 3 and withdraw more ETH first.
              </div>
            </div>
            <EtherFiStakeStep
              accountId={accountId}
              derivedEthAddress={derivedEthAddress}
              callMethods={callMethods}
              onStakeSuccess={() => setEthRefresh(n => n + 1)}
            />
          </StepCard>
        </div>

        {/* Unstake section */}
        <div className="border border-gray-700 p-5">
          <h2 className="text-lg font-bold text-white mb-1">Unstake eETH → ETH</h2>
          <p className="text-gray-400 text-sm mb-4">
            Request withdrawal of eETH and receive ETH back at your derived address via NEAR chain signatures.
          </p>
          <EtherFiUnstakeSection
            accountId={accountId}
            derivedEthAddress={derivedEthAddress}
            callMethods={callMethods}
          />
        </div>

      </div>
    </div>
  );
}

// ─── Stake Step ───────────────────────────────────────────────────────────────

function EtherFiStakeStep({
  accountId,
  derivedEthAddress,
  callMethods,
  onStakeSuccess,
}: {
  accountId: string | null;
  derivedEthAddress: string | null;
  callMethods: (params: any[]) => Promise<unknown>;
  onStakeSuccess: () => void;
}) {
  const [stakeAmount, setStakeAmount] = useState("0.001");
  const [stakeState, setStakeState] = useState<StepState>(INIT);

  const handleStake = useCallback(async () => {
    if (!accountId || !derivedEthAddress) return;
    setStakeState({ status: "loading", message: "Building EtherFi deposit() transaction…" });

    try {
      const { chainAdapters, contracts } = await import("chainsig.js");
      const { createPublicClient, http, parseEther } = await import("viem");
      const { mainnet } = await import("viem/chains");

      const client = createPublicClient({ chain: mainnet, transport: http(ETH_RPC) });
      const mpc = new contracts.ChainSignatureContract({ networkId: "mainnet", contractId: "v1.signer" });
      const EVMAdapter = new chainAdapters.evm.EVM({ publicClient: client, contract: mpc });

      const from = derivedEthAddress as `0x${string}`;
      const value = parseEther(stakeAmount);

      setStakeState({ status: "loading", message: "Fetching nonce and gas fees…" });

      const txRequest = {
        from,
        to: ETHERFI_LIQUIDITY_POOL as `0x${string}`,
        value,
        data: DEPOSIT_SELECTOR as `0x${string}`,
      };

      const { transaction, hashesToSign } = await EVMAdapter.prepareTransactionForSigning(txRequest);

      setStakeState({ status: "loading", message: "Asking NEAR MPC (v1.signer) to sign transaction…" });

      const rsvSignatures = await mpc.sign({
        payloads: hashesToSign,
        path: "ethereum-1",
        keyType: "Ecdsa",
        signerAccount: {
          accountId: accountId!,
          signAndSendTransactions: ((params: { transactions: any[] }) =>
            callMethods(mapChainSigTxs(params.transactions))) as any,
        },
      });

      if (!rsvSignatures[0]) throw new Error("MPC signing failed — no signature returned");

      setStakeState({ status: "loading", message: "Broadcasting to Ethereum mainnet…" });

      const serialized = EVMAdapter.finalizeTransactionSigning({ transaction, rsvSignatures });
      const { hash } = await EVMAdapter.broadcastTx(serialized);

      setStakeState({
        status: "done",
        message: `EtherFi stake successful! eETH received at ${derivedEthAddress.slice(0, 10)}…`,
        txHash: hash,
      });
      onStakeSuccess();
    } catch (err) {
      setStakeState({ status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }, [accountId, derivedEthAddress, callMethods, stakeAmount, onStakeSuccess]);

  if (!derivedEthAddress) {
    return <p className="text-gray-500 text-sm">Complete steps 1–3 first to activate staking.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-400">
        Contract: <span className="font-mono">{ETHERFI_LIQUIDITY_POOL.slice(0, 10)}…</span> &nbsp;|&nbsp;
        Receive: <span className="font-mono">eETH</span> at your derived address
      </div>

      {stakeState.message && (
        <div className={`text-xs px-3 py-2 font-mono break-all border ${
          stakeState.status === "error" ? "bg-red-900/20 text-red-300 border-red-800" :
          stakeState.status === "done" ? "bg-[#97FBE4]/10 text-[#97FBE4] border-[#97FBE4]/30" :
          "bg-yellow-900/20 text-yellow-300 border-yellow-800"
        }`}>
          {stakeState.message}
          {stakeState.txHash && (
            <a href={`https://etherscan.io/tx/${stakeState.txHash}`} target="_blank" rel="noopener noreferrer"
              className="block mt-1 underline text-blue-400">
              View on Etherscan ↗
            </a>
          )}
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)}
          step="0.001" min="0.001" placeholder="0.001"
          disabled={stakeState.status === "loading"}
          className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-[#97FBE4] disabled:opacity-50"
        />
        <span className="text-gray-400 text-sm">ETH → eETH</span>
        <button onClick={handleStake} disabled={stakeState.status === "loading"}
          className="px-4 py-2 bg-[#97FBE4] text-black font-bold text-sm hover:bg-[#5eead4] transition-colors disabled:opacity-50">
          {stakeState.status === "loading" ? "Staking…" : stakeState.status === "done" ? "Staked ✓" : "Stake on EtherFi"}
        </button>
      </div>
    </div>
  );
}

// ─── Unstake Section ──────────────────────────────────────────────────────────

function EtherFiUnstakeSection({
  accountId,
  derivedEthAddress,
  callMethods,
}: {
  accountId: string | null;
  derivedEthAddress: string | null;
  callMethods: (params: any[]) => Promise<unknown>;
}) {
  const [eEthBalance, setEEthBalance]     = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState("0.001");
  const [unstakeState, setUnstakeState]   = useState<StepState>(INIT);

  // Fetch eETH balance via raw eth_call (balanceOf)
  useEffect(() => {
    if (!derivedEthAddress) return;
    let cancelled = false;
    setBalanceLoading(true);

    (async () => {
      try {
        // balanceOf(address) = 0x70a08231 + padded address
        const data = "0x70a08231" + derivedEthAddress.replace("0x", "").padStart(64, "0");
        const res = await fetch(ETH_RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0", id: 1,
            method: "eth_call",
            params: [{ to: EETH_TOKEN, data }, "latest"],
          }),
        });
        const json = await res.json();
        const raw = json.result as string;
        if (raw && raw !== "0x") {
          const bal = BigInt(raw);
          const formatted = (Number(bal) / 1e18).toFixed(6);
          if (!cancelled) {
            setEEthBalance(formatted);
            setUnstakeAmount(prev => prev === "0.001" ? formatted : prev);
          }
        } else {
          if (!cancelled) setEEthBalance("0");
        }
      } catch {
        if (!cancelled) setEEthBalance("0");
      } finally {
        if (!cancelled) setBalanceLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [derivedEthAddress, unstakeState.status]);

  // Two-step unstake: approve eETH → requestWithdraw on LiquidityPool
  const handleUnstake = useCallback(async () => {
    if (!accountId || !derivedEthAddress) return;
    setUnstakeState({ status: "loading", message: "Building eETH approve transaction…" });

    try {
      const { chainAdapters, contracts } = await import("chainsig.js");
      const { createPublicClient, http, parseEther } = await import("viem");
      const { mainnet } = await import("viem/chains");

      const client = createPublicClient({ chain: mainnet, transport: http(ETH_RPC) });
      const mpc = new contracts.ChainSignatureContract({ networkId: "mainnet", contractId: "v1.signer" });
      const EVMAdapter = new chainAdapters.evm.EVM({ publicClient: client, contract: mpc });

      const from = derivedEthAddress as `0x${string}`;
      const amount = parseEther(unstakeAmount);
      const amountHex = amount.toString(16).padStart(64, "0");
      const spenderHex = ETHERFI_LIQUIDITY_POOL.replace("0x", "").padStart(64, "0");
      const recipientHex = from.replace("0x", "").padStart(64, "0");

      // ── Tx 1: approve(liquidityPool, amount) on eETH ─────────────────────
      const approveTxReq = {
        from,
        to: EETH_TOKEN as `0x${string}`,
        data: (APPROVE_SELECTOR + spenderHex + amountHex) as `0x${string}`,
        value: 0n,
      };

      const { transaction: approveTx, hashesToSign: approveHashes } =
        await EVMAdapter.prepareTransactionForSigning(approveTxReq);

      setUnstakeState({ status: "loading", message: "Signing approve tx via NEAR MPC…" });

      const approveRSV = await mpc.sign({
        payloads: approveHashes,
        path: "ethereum-1",
        keyType: "Ecdsa",
        signerAccount: {
          accountId: accountId!,
          signAndSendTransactions: ((params: { transactions: any[] }) =>
            callMethods(mapChainSigTxs(params.transactions))) as any,
        },
      });

      if (!approveRSV[0]) throw new Error("MPC signing failed for approve");

      setUnstakeState({ status: "loading", message: "Broadcasting approve tx…" });
      const approveSerialized = EVMAdapter.finalizeTransactionSigning({ transaction: approveTx, rsvSignatures: approveRSV });
      await EVMAdapter.broadcastTx(approveSerialized);

      // ── Tx 2: requestWithdraw(recipient, amount) on LiquidityPool ─────────
      setUnstakeState({ status: "loading", message: "Building requestWithdraw transaction…" });

      const withdrawTxReq = {
        from,
        to: ETHERFI_LIQUIDITY_POOL as `0x${string}`,
        data: (REQUEST_WITHDRAW_SELECTOR + recipientHex + amountHex) as `0x${string}`,
        value: 0n,
      };

      const { transaction: withdrawTx, hashesToSign: withdrawHashes } =
        await EVMAdapter.prepareTransactionForSigning(withdrawTxReq);

      setUnstakeState({ status: "loading", message: "Signing requestWithdraw tx via NEAR MPC…" });

      const withdrawRSV = await mpc.sign({
        payloads: withdrawHashes,
        path: "ethereum-1",
        keyType: "Ecdsa",
        signerAccount: {
          accountId: accountId!,
          signAndSendTransactions: ((params: { transactions: any[] }) =>
            callMethods(mapChainSigTxs(params.transactions))) as any,
        },
      });

      if (!withdrawRSV[0]) throw new Error("MPC signing failed for requestWithdraw");

      setUnstakeState({ status: "loading", message: "Broadcasting requestWithdraw tx…" });
      const withdrawSerialized = EVMAdapter.finalizeTransactionSigning({ transaction: withdrawTx, rsvSignatures: withdrawRSV });
      const { hash } = await EVMAdapter.broadcastTx(withdrawSerialized);

      setUnstakeState({
        status: "done",
        message: `Withdrawal requested! ETH will be claimable after EtherFi processes the request.`,
        txHash: hash,
      });
    } catch (err) {
      setUnstakeState({ status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }, [accountId, derivedEthAddress, callMethods, unstakeAmount]);

  if (!derivedEthAddress) {
    return <p className="text-gray-500 text-sm">Connect your NEAR wallet to see eETH balance.</p>;
  }

  const hasBalance = eEthBalance !== null && parseFloat(eEthBalance) > 0;

  return (
    <div className="space-y-4">
      {/* eETH balance */}
      <div className="p-3 bg-gray-900 flex items-center justify-between text-sm">
        <span className="text-gray-400">eETH at derived address</span>
        <span className="font-mono font-bold text-[#97FBE4]">
          {balanceLoading ? "loading…" : `${eEthBalance ?? "—"} eETH`}
        </span>
      </div>

      {!hasBalance && !balanceLoading && (
        <p className="text-yellow-400 text-xs">
          No eETH found at derived address. Complete the stake flow above first.
        </p>
      )}

      <div className="p-3 border border-gray-700 bg-gray-900/50 text-xs text-gray-400 space-y-1">
        <div className="font-semibold text-gray-300">Unstake is a 2-step flow:</div>
        <div>1. <span className="text-white">approve</span> — allows LiquidityPool to spend your eETH</div>
        <div>2. <span className="text-white">requestWithdraw</span> — queues withdrawal, creates a withdrawal NFT</div>
        <div className="text-yellow-400 pt-1">After EtherFi processes the request (~1–2 days), you can claim ETH via their app.</div>
      </div>

      {unstakeState.message && (
        <div className={`text-xs px-3 py-2 font-mono break-all border ${
          unstakeState.status === "error" ? "bg-red-900/20 text-red-300 border-red-800" :
          unstakeState.status === "done" ? "bg-[#97FBE4]/10 text-[#97FBE4] border-[#97FBE4]/30" :
          "bg-yellow-900/20 text-yellow-300 border-yellow-800"
        }`}>
          {unstakeState.message}
          {unstakeState.txHash && (
            <a href={`https://etherscan.io/tx/${unstakeState.txHash}`} target="_blank" rel="noopener noreferrer"
              className="block mt-1 underline text-blue-400">
              View on Etherscan ↗
            </a>
          )}
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input type="number" value={unstakeAmount} onChange={e => setUnstakeAmount(e.target.value)}
          step="0.001" min="0.001"
          disabled={unstakeState.status === "loading" || !hasBalance}
          className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-orange-400 disabled:opacity-50"
          placeholder="ETH amount to receive"
        />
        <span className="text-gray-400 text-sm whitespace-nowrap">eETH → ETH</span>
        <button onClick={handleUnstake} disabled={unstakeState.status === "loading" || !hasBalance}
          className="px-4 py-2 bg-orange-600 text-white font-bold text-sm hover:bg-orange-500 transition-colors disabled:opacity-50">
          {unstakeState.status === "loading" ? "Unstaking…" : "Unstake"}
        </button>
      </div>
    </div>
  );
}
