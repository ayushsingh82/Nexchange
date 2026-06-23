"use client";

import { useState, useCallback, useEffect } from "react";
import { useNearWallet } from "@/provider/wallet";
import { useChainSigSolanaAddress } from "@/hooks/useChainSigSolanaAddress";
import {
  depositNearAsMultiToken,
  getQuote,
  transferMultiTokenForQuote,
  waitUntilQuoteExecutionCompletes,
} from "@/app/intents-check/utils/intents";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { providers } from "near-api-js";

// ─── Token/amount helpers ────────────────────────────────────────────────────

// chainsig.js passes actions using @near-js/transactions actionCreators format:
//   { functionCall: { methodName, args: Uint8Array, gas: BigInt, deposit: BigInt } }
// Our callMethods expects wallet-selector format: { contractId, method, args, gas, deposit }
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

function toSmallestUnit(amount: string, decimals: number): string {
  const [whole, frac = ""] = amount.split(".");
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals);
  return (
    BigInt(whole) * BigInt(10 ** decimals) +
    BigInt(fracPadded || "0")
  ).toString();
}

// ─── Step types ──────────────────────────────────────────────────────────────

type StepStatus = "idle" | "loading" | "done" | "error";

interface StepState {
  status: StepStatus;
  message: string;
  txHash?: string;
}

const INIT: StepState = { status: "idle", message: "" };

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepCard({
  index,
  title,
  description,
  state,
  active,
  children,
}: {
  index: number;
  title: string;
  description: string;
  state: StepState;
  active: boolean;
  children?: React.ReactNode;
}) {
  const borderColor =
    state.status === "done"
      ? "border-[#97FBE4]"
      : state.status === "error"
      ? "border-red-500"
      : active
      ? "border-gray-400"
      : "border-gray-800";

  const iconBg =
    state.status === "done"
      ? "bg-[#97FBE4] text-black"
      : state.status === "error"
      ? "bg-red-500 text-white"
      : state.status === "loading"
      ? "bg-yellow-500 text-black"
      : "bg-gray-800 text-gray-400";

  const icon =
    state.status === "done"
      ? "✓"
      : state.status === "error"
      ? "✗"
      : state.status === "loading"
      ? "⟳"
      : String(index);

  return (
    <div className={`border-0 p-5 transition-all`}>
      <div className="flex items-start gap-4 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${iconBg} ${state.status === "loading" ? "animate-spin" : ""}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      {state.message && (
        <div
          className={`text-sm px-3 py-2 mb-3 font-mono break-all ${
            state.status === "error"
              ? "bg-red-900/20 text-red-300"
              : "bg-[#97FBE4]/5 text-[#97FBE4]"
          }`}
        >
          {state.message}
          {state.txHash && (
            <div className="mt-1 text-xs text-gray-400">tx: {state.txHash}</div>
          )}
        </div>
      )}

      {active && children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function JitoPageContent() {
  const { accountId, status, callMethod, callMethods, callMethodBatch, viewMethod } = useNearWallet();
  const isAuthenticated = status === "authenticated" && accountId;

  // Increment to force SOL balance refresh after withdraw/stake
  const [solRefresh, setSolRefresh] = useState(0);

  // Increment to force jitoSOL balance re-fetch in unstake section after a stake succeeds
  const [jitoRefresh, setJitoRefresh] = useState(0);

  // Derived Solana address from chain sig — pass solRefresh so balance re-fetches after withdraw/stake
  const { address: derivedSolAddress, balance: solBalance, loading: addrLoading, addrError } =
    useChainSigSolanaAddress(accountId, "solana-1", solRefresh);

  // Step states
  const [step1, setStep1] = useState<StepState>(INIT);
  const [step2, setStep2] = useState<StepState>(INIT);
  const [step3, setStep3] = useState<StepState>(INIT);

  // Inputs
  const [depositAmount, setDepositAmount] = useState("0.5");
  const [swapAmount, setSwapAmount] = useState("0.1");
  const [withdrawAmount, setWithdrawAmount] = useState("0.001");

  // Balances
  const [nearBalance, setNearBalance] = useState<string | null>(null);
  const [intentsNEARBalance, setIntentsNEARBalance] = useState<string | null>(null);
  const [intentsSOLBalance, setIntentsSOLBalance] = useState<string | null>(null);

  // Fetch NEAR balance
  useEffect(() => {
    if (!accountId) return;
    (async () => {
      try {
        const url = "https://rpc.mainnet.near.org";
        const provider = new providers.JsonRpcProvider({ url });
        const account = await provider.query({
          request_type: "view_account",
          account_id: accountId,
          finality: "optimistic",
        }) as { amount: string };
        const yocto = BigInt(account.amount);
        const near = Number(yocto) / 1e24;
        setNearBalance(near.toFixed(4));
      } catch { /* ignore */ }
    })();
  }, [accountId, step1.status]);

  // Fetch intents wNEAR balance
  useEffect(() => {
    if (!accountId || !viewMethod) return;
    (async () => {
      try {
        const bal = await viewMethod({
          contractId: "intents.near",
          method: "mt_balance_of",
          args: { account_id: accountId, token_id: "nep141:wrap.near" },
        }) as string;
        const yocto = BigInt(bal ?? "0");
        const near = Number(yocto) / 1e24;
        setIntentsNEARBalance(near.toFixed(4));
      } catch { /* no balance yet */ }
    })();
  }, [accountId, viewMethod, step1.status, step2.status]);

  // Fetch intents SOL balance (sol.omft.near inside intents.near)
  useEffect(() => {
    if (!accountId || !viewMethod) return;
    (async () => {
      try {
        const bal = await viewMethod({
          contractId: "intents.near",
          method: "mt_balance_of",
          args: { account_id: accountId, token_id: "nep141:sol.omft.near" },
        }) as string;
        const lamports = BigInt(bal ?? "0");
        const sol = Number(lamports) / 1e9;
        setIntentsSOLBalance(sol.toFixed(6));
      } catch { /* no balance yet */ }
    })();
  }, [accountId, viewMethod, step2.status, step3.status]);

  // Active step tracking
  const currentStep =
    step3.status === "done"
      ? 4
      : step2.status === "done"
      ? 3
      : step1.status === "done"
      ? 2
      : 1;

  // ── Step 1: Deposit NEAR to intents ────────────────────────────────────────
  const handleDeposit = useCallback(async () => {
    if (!accountId || !callMethodBatch) return;
    setStep1({ status: "loading", message: "Depositing NEAR to intents contract…" });
    try {
      const amountYocto = toSmallestUnit(depositAmount, 24);
      await depositNearAsMultiToken(accountId, amountYocto, callMethodBatch);
      setStep1({
        status: "done",
        message: `Deposited ${depositAmount} NEAR to intents.near`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // null = wallet redirect after successful broadcast (Meteor Wallet)
      setStep1(
        msg === "null" || msg === "undefined"
          ? { status: "done", message: `Deposit submitted — check wallet for confirmation` }
          : { status: "error", message: msg }
      );
    }
  }, [accountId, callMethodBatch, depositAmount]);

  // ── Step 2: Swap wNEAR → SOL via 1Click ────────────────────────────────────
  const handleSwap = useCallback(async () => {
    if (!accountId || !callMethod) return;
    setStep2({ status: "loading", message: "Getting quote from 1Click API…" });
    try {
      const deadline = new Date();
      deadline.setMinutes(deadline.getMinutes() + 5);

      const quote = await getQuote({
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 50, // 0.5%
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: "nep141:wrap.near",
        destinationAsset: "nep141:sol.omft.near",
        amount: toSmallestUnit(swapAmount, 24),
        refundTo: accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: accountId,
        recipientType: QuoteRequest.recipientType.INTENTS,
        deadline: deadline.toISOString(),
      } as QuoteRequest);

      setStep2({
        status: "loading",
        message: `Quote: ${quote.amountInFormatted ?? swapAmount} NEAR → ${quote.amountOutFormatted ?? "?"} SOL. Sending…`,
      });

      await transferMultiTokenForQuote(accountId, quote, "nep141:wrap.near", callMethod);
      await waitUntilQuoteExecutionCompletes(quote);

      setStep2({
        status: "done",
        message: `Swapped ${swapAmount} NEAR → SOL in intents`,
      });
    } catch (err) {
      setStep2({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }, [accountId, callMethod, swapAmount]);

  // ── Step 3: Withdraw SOL from intents → derived Solana address ─────────────
  const handleWithdraw = useCallback(async () => {
    if (!accountId || !callMethod || !derivedSolAddress) return;
    setStep3({ status: "loading", message: `Getting quote to withdraw SOL to derived address ${derivedSolAddress.slice(0, 8)}…` });
    try {
      const deadline = new Date();
      deadline.setMinutes(deadline.getMinutes() + 5);

      const quote = await getQuote({
        dry: false,
        swapType: QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 50,
        depositType: QuoteRequest.depositType.INTENTS,
        originAsset: "nep141:sol.omft.near",
        destinationAsset: "nep141:sol.omft.near",
        amount: toSmallestUnit(withdrawAmount, 9),
        refundTo: accountId,
        refundType: QuoteRequest.refundType.INTENTS,
        recipient: derivedSolAddress,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: deadline.toISOString(),
      } as QuoteRequest);

      setStep3({
        status: "loading",
        message: `Sending ${quote.amountInFormatted ?? withdrawAmount} SOL to ${derivedSolAddress.slice(0, 12)}…`,
      });

      await transferMultiTokenForQuote(accountId, quote, "nep141:sol.omft.near", callMethod);
      await waitUntilQuoteExecutionCompletes(quote);

      setStep3({
        status: "done",
        message: `SOL delivered to derived address: ${derivedSolAddress}`,
      });
      setSolRefresh((n) => n + 1);
    } catch (err) {
      setStep3({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }, [accountId, callMethod, derivedSolAddress, withdrawAmount]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#97FBE4] mb-1">Jito Liquid Staking</h1>
          <p className="text-gray-400 text-sm">
            Deposit NEAR → swap to SOL → withdraw to your chain-sig Solana address → stake on Jito
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
              Derived Solana address:{" "}
              {addrLoading ? (
                <span className="text-yellow-400">deriving…</span>
              ) : addrError ? (
                <span className="text-red-400">{addrError}</span>
              ) : (
                <span className="text-[#97FBE4] font-mono break-all">{derivedSolAddress}</span>
              )}
            </div>
            {solBalance && (
              <div className="text-gray-400">
                SOL balance: <span className="text-white font-mono">{solBalance} SOL</span>
              </div>
            )}
          </div>
        )}

        {/* ── All 4 steps in one box ── */}
        <div className="border border-gray-700">
          {/* Step 1 */}
          <StepCard
            index={1}
            title="Deposit NEAR"
            description="Wrap NEAR and deposit to intents.near"
            state={step1}
            active={!!isAuthenticated}
          >
            {nearBalance !== null && (
              <div className="text-xs text-gray-400 mb-2">
                Wallet balance: <span className="text-[#97FBE4] font-mono">{nearBalance} NEAR</span>
              </div>
            )}
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                step="0.1"
                min="0.1"
                className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-[#97FBE4]"
                placeholder="0.5"
              />
              <span className="text-gray-400 text-sm">NEAR</span>
              <button
                onClick={handleDeposit}
                disabled={step1.status === "loading"}
                className="px-4 py-2 bg-[#97FBE4] text-black font-bold text-sm hover:bg-[#5eead4] transition-colors disabled:opacity-50"
              >
                {step1.status === "loading" ? "Depositing…" : "Deposit"}
              </button>
            </div>
          </StepCard>

          <div className="border-t border-gray-800" />

          {/* Step 2 */}
          <StepCard
            index={2}
            title="Swap NEAR → SOL"
            description="Swap wrapped NEAR to SOL via 1Click API"
            state={step2}
            active={!!isAuthenticated}
          >
            {intentsNEARBalance !== null && (
              <div className="text-xs text-gray-400 mb-2">
                In intents: <span className="text-[#97FBE4] font-mono">{intentsNEARBalance} NEAR</span>
              </div>
            )}
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                step="0.01"
                min="0.01"
                className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-[#97FBE4]"
                placeholder="0.1"
              />
              <span className="text-gray-400 text-sm">NEAR → SOL</span>
              <button
                onClick={handleSwap}
                disabled={step2.status === "loading"}
                className="px-4 py-2 bg-[#97FBE4] text-black font-bold text-sm hover:bg-[#5eead4] transition-colors disabled:opacity-50"
              >
                {step2.status === "loading" ? "Swapping…" : "Swap"}
              </button>
            </div>
          </StepCard>

          <div className="border-t border-gray-800" />

          {/* Step 3 */}
          <StepCard
            index={3}
            title="Withdraw SOL to Derived Address"
            description="Send SOL from intents to your chain-sig Solana address via 1Click"
            state={step3}
            active={!!isAuthenticated}
          >
            {!derivedSolAddress ? (
              <p className="text-yellow-400 text-sm">Waiting for derived address…</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono break-all">To: {derivedSolAddress}</span>
                  {intentsSOLBalance !== null && (
                    <span className="text-gray-400 shrink-0 ml-3">
                      In intents: <span className="text-[#97FBE4] font-mono">{intentsSOLBalance} SOL</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    step="0.001"
                    min="0.001"
                    className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm focus:outline-none focus:border-[#97FBE4]"
                    placeholder="0.001"
                  />
                  <span className="text-gray-400 text-sm">SOL</span>
                  <button
                    onClick={handleWithdraw}
                    disabled={step3.status === "loading"}
                    className="px-4 py-2 bg-[#97FBE4] text-black font-bold text-sm hover:bg-[#5eead4] transition-colors disabled:opacity-50"
                  >
                    {step3.status === "loading" ? "Withdrawing…" : "Withdraw"}
                  </button>
                </div>
              </div>
            )}
          </StepCard>

          <div className="border-t border-gray-800" />

          {/* Step 4: Jito Stake */}
          <StepCard
            index={4}
            title="Stake SOL on Jito"
            description="Sign a depositSol transaction from your derived address via NEAR chain signatures"
            state={INIT}
            active={!!isAuthenticated}
          >
            <div className="mb-4 p-3 border border-yellow-600/40 bg-yellow-900/10 text-yellow-300 text-xs space-y-1">
              <div className="font-semibold">Requirements before staking</div>
              <ul className="list-disc list-inside space-y-0.5 text-yellow-400/90">
                <li>Derived Solana address needs <span className="font-mono font-bold">≥ 0.005 SOL</span> on-chain</li>
                <li>~0.002 SOL is reserved for jitoSOL token account creation (one-time rent)</li>
                <li>Minimum stake: <span className="font-mono">0.001 SOL</span> + fees</li>
              </ul>
              <div className="text-yellow-500/70 pt-0.5">
                If the balance is too low, go back to Step 3 and withdraw more SOL first.
              </div>
            </div>
            <JitoStakeStep
              accountId={accountId}
              derivedSolAddress={derivedSolAddress}
              callMethods={callMethods}
              onStakeSuccess={() => { setSolRefresh(n => n + 1); setJitoRefresh(n => n + 1); }}
            />
          </StepCard>
        </div>

        {/* ── Unstake section ── */}
        <div className="border border-gray-700 p-5">
          <h2 className="text-lg font-bold text-white mb-1">Unstake jitoSOL → SOL</h2>
          <p className="text-gray-400 text-sm mb-4">
            Burn jitoSOL and receive SOL back at your derived address via NEAR chain signatures.
          </p>
          <JitoUnstakeSection
            accountId={accountId}
            derivedSolAddress={derivedSolAddress}
            callMethods={callMethods}
            jitoRefresh={jitoRefresh}
          />
        </div>

      </div>
    </div>
  );
}

// ─── Jito Stake Step (chain sig) ─────────────────────────────────────────────

function JitoStakeStep({
  accountId,
  derivedSolAddress,
  callMethods,
  onStakeSuccess,
}: {
  accountId: string | null;
  derivedSolAddress: string | null;
  callMethods: (params: any[]) => Promise<unknown>;
  onStakeSuccess: () => void;
}) {
  const [stakeAmount, setStakeAmount] = useState("0.001");
  const [stakeState, setStakeState] = useState<StepState>(INIT);

  const handleStake = useCallback(async () => {
    if (!accountId || !derivedSolAddress) return;
    setStakeState({ status: "loading", message: "Building Jito depositSol transaction…" });

    try {
      // Dynamic imports — keep SSR clean, avoid bundling node-only code on server
      const { PublicKey, Transaction, Connection, LAMPORTS_PER_SOL } =
        await import("@solana/web3.js");
      const solanaStakePool = await import("@solana/spl-stake-pool");
      const { contracts, chainAdapters } = await import("chainsig.js");

      const connection = new Connection("https://solana.publicnode.com", "confirmed");

      // Jito stake pool account and its CUSTOM program (fork of SPL Stake Pool)
      // Library uses SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzf1KbCe6T1NjcX (wrong for Jito)
      // Jito's actual program verified via getAccountInfo on mainnet:
      const JITO_STAKE_POOL_ADDRESS = new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb");
      const JITO_PROGRAM_ID        = new PublicKey("SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy");

      const fromPubkey = new PublicKey(derivedSolAddress);
      const lamports = Math.round(parseFloat(stakeAmount) * LAMPORTS_PER_SOL);

      setStakeState({ status: "loading", message: "Fetching Jito pool state…" });

      // Get pool state (layout-compatible with SPL Stake Pool)
      const { getStakePoolAccount } = solanaStakePool;
      const stakePoolAccount = await getStakePoolAccount(connection, JITO_STAKE_POOL_ADDRESS);
      const sp = stakePoolAccount.account.data;

      // Derive withdraw authority PDA using Jito's actual program ID
      const [withdrawAuthority] = await PublicKey.findProgramAddress(
        [JITO_STAKE_POOL_ADDRESS.toBuffer(), Buffer.from("withdraw")],
        JITO_PROGRAM_ID,
      );

      const { TransactionInstruction, SystemProgram } =
        await import("@solana/web3.js");
      const { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction } =
        await import("@solana/spl-token");

      const jitoSolAta = getAssociatedTokenAddressSync(sp.poolMint, fromPubkey);

      // Balance check: ATA rent ~0.00204 SOL + stake amount + fees
      const solBalLamports = await connection.getBalance(fromPubkey);
      const minNeeded = 2_039_280 + lamports + 10_000; // ATA rent + stake + fees
      if (solBalLamports < minNeeded) {
        throw new Error(
          `Insufficient SOL at derived address. Have ${(solBalLamports / 1e9).toFixed(6)} SOL, ` +
          `need at least ${(minNeeded / 1e9).toFixed(4)} SOL (ATA rent + stake amount + fees). ` +
          `Withdraw more SOL from intents in Step 3.`
        );
      }

      // depositSol instruction data: index=14, lamports as u64 LE (same layout as SPL fork)
      const depositData = Buffer.alloc(9);
      depositData.writeUInt8(14, 0);
      depositData.writeBigUInt64LE(BigInt(lamports), 1);

      // Jito's solDepositAuthority is NONE on mainnet — no extra signer needed
      const depositAuthKeys: { pubkey: typeof fromPubkey; isSigner: boolean; isWritable: boolean }[] = [];
      if (sp.solDepositAuthority) {
        depositAuthKeys.push({ pubkey: sp.solDepositAuthority, isSigner: true, isWritable: false });
      }

      // Instructions: ATA creation FIRST (fromPubkey needs full balance for rent),
      // then depositSol with fromPubkey as direct fundingAccount (no ephemeral needed —
      // Jito has no solDepositAuthority so fromPubkey can fund directly).
      const txInstructions = [
        // 0: Create jitoSOL ATA (idempotent — no-op if it already exists)
        createAssociatedTokenAccountIdempotentInstruction(fromPubkey, jitoSolAta, fromPubkey, sp.poolMint),
        // 1: depositSol — fromPubkey is feePayer AND fundingAccount (single MPC signer)
        new TransactionInstruction({
          programId: JITO_PROGRAM_ID,
          keys: [
            { pubkey: JITO_STAKE_POOL_ADDRESS, isSigner: false, isWritable: true },
            { pubkey: withdrawAuthority,        isSigner: false, isWritable: false },
            { pubkey: sp.reserveStake,          isSigner: false, isWritable: true },
            { pubkey: fromPubkey,              isSigner: true,  isWritable: true },  // fundingAccount
            { pubkey: jitoSolAta,              isSigner: false, isWritable: true },  // destination
            { pubkey: sp.managerFeeAccount,    isSigner: false, isWritable: true },
            { pubkey: jitoSolAta,              isSigner: false, isWritable: true },  // referral
            { pubkey: sp.poolMint,             isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID,        isSigner: false, isWritable: false },
            ...depositAuthKeys,
          ],
          data: depositData,
        }),
      ];

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      const transaction = new Transaction({ feePayer: fromPubkey, recentBlockhash: blockhash });
      transaction.add(...txInstructions);

      // Single signer: fromPubkey via MPC (no ephemeral needed)
      const messageBytes = transaction.serializeMessage();

      // ── Sign via NEAR chain signatures ──
      setStakeState({ status: "loading", message: "Asking NEAR MPC to sign transaction (v1.signer)…" });

      const MPC_CONTRACT = new contracts.ChainSignatureContract({
        networkId: "mainnet",
        contractId: "v1.signer",
      });

      const rsvSignatures = await MPC_CONTRACT.sign({
        payloads: [messageBytes],
        path: "solana-1",
        keyType: "Eddsa",
        signerAccount: {
          accountId: accountId!,
          signAndSendTransactions: (params: { transactions: any[] }) =>
            callMethods(mapChainSigTxs(params.transactions)),
        },
      });

      if (!rsvSignatures[0]) throw new Error("MPC signing failed — no signature returned");

      const SolanaAdapter = new chainAdapters.solana.Solana({
        solanaConnection: connection,
        contract: MPC_CONTRACT,
      });

      const finalizedTx = SolanaAdapter.finalizeTransactionSigning({
        transaction,
        rsvSignatures: rsvSignatures[0] as any,
        senderAddress: derivedSolAddress,
      });

      // ── Broadcast ──
      setStakeState({ status: "loading", message: "Broadcasting to Solana mainnet…" });
      const txHash = await SolanaAdapter.broadcastTx(finalizedTx as any);
      const hashStr = (txHash as any)?.hash ?? String(txHash);

      setStakeState({
        status: "done",
        message: `Jito stake successful! jitoSOL received at ${derivedSolAddress.slice(0, 12)}…`,
        txHash: hashStr,
      });
      onStakeSuccess();
    } catch (err) {
      setStakeState({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }, [accountId, derivedSolAddress, callMethods, stakeAmount, onStakeSuccess]);

  if (!derivedSolAddress) {
    return <p className="text-gray-500 text-sm">Complete steps 1–3 first to activate staking.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-400">
        Stake pool: <span className="font-mono">Jito4APyf…</span> &nbsp;|&nbsp;
        Receive: <span className="font-mono">jitoSOL</span> at your derived address
      </div>

      {stakeState.message && (
        <div
          className={`text-sm rounded-lg px-3 py-2 font-mono break-all ${
            stakeState.status === "error"
              ? "bg-red-900/20 text-red-300"
              : "bg-[#97FBE4]/5 text-[#97FBE4]"
          }`}
        >
          {stakeState.message}
          {stakeState.txHash && (
            <div className="mt-1 text-xs text-gray-400">
              <a
                href={`https://explorer.solana.com/tx/${stakeState.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                View on Solana Explorer
              </a>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          step="0.001"
          min="0.001"
          className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#97FBE4]"
          placeholder="0.001"
          disabled={stakeState.status === "loading"}
        />
        <span className="text-gray-400 text-sm">SOL → jitoSOL</span>
        <button
          onClick={handleStake}
          disabled={stakeState.status === "loading" || stakeState.status === "done"}
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg text-sm hover:bg-green-500 transition-colors disabled:opacity-50"
        >
          {stakeState.status === "loading"
            ? "Staking…"
            : stakeState.status === "done"
            ? "Staked ✓"
            : "Stake on Jito"}
        </button>
      </div>
    </div>
  );
}

// ─── Jito Unstake Section (chain sig withdrawSol) ────────────────────────────

// Verified Jito mainnet addresses
const JITO_STAKE_POOL_ADDR = "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb";
const JITO_SOL_MINT_ADDR   = "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn";
const TOKEN_PROGRAM_ADDR   = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const ASSOC_TOKEN_PROG_ADDR = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bRS";

function JitoUnstakeSection({
  accountId,
  derivedSolAddress,
  callMethods,
  jitoRefresh,
}: {
  accountId: string | null;
  derivedSolAddress: string | null;
  callMethods: (params: any[]) => Promise<unknown>;
  jitoRefresh: number;
}) {
  const [jitoSolBalance, setJitoSolBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState("0.001");
  const [unstakeState, setUnstakeState] = useState<StepState>(INIT);

  // Fetch jitoSOL balance via getTokenAccountBalance on the computed ATA address
  useEffect(() => {
    if (!derivedSolAddress) return;
    let cancelled = false;
    setBalanceLoading(true);

    (async () => {
      try {
        const { PublicKey } = await import("@solana/web3.js");
        const derivedPubkey = new PublicKey(derivedSolAddress);

        const [jitoSolAta] = PublicKey.findProgramAddressSync(
          [
            derivedPubkey.toBuffer(),
            new PublicKey(TOKEN_PROGRAM_ADDR).toBuffer(),
            new PublicKey(JITO_SOL_MINT_ADDR).toBuffer(),
          ],
          new PublicKey(ASSOC_TOKEN_PROG_ADDR),
        );

        // Raw JSON-RPC fetch — avoids any web3.js Connection issues in the browser
        const res = await fetch("https://solana.publicnode.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0", id: 1,
            method: "getTokenAccountBalance",
            params: [jitoSolAta.toBase58(), { commitment: "confirmed" }],
          }),
        });
        const json = await res.json();
        const amount = json.result?.value?.uiAmountString ?? "0";
        if (!cancelled) {
          setJitoSolBalance(amount);
          setUnstakeAmount((prev) => (prev === "0.001" ? amount : prev));
        }
      } catch {
        if (!cancelled) setJitoSolBalance("0");
      } finally {
        if (!cancelled) setBalanceLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [derivedSolAddress, unstakeState.status, jitoRefresh]); // re-fetch after unstake or stake completes

  const handleUnstake = useCallback(async () => {
    if (!accountId || !derivedSolAddress) return;
    setUnstakeState({ status: "loading", message: "Building withdrawSol transaction via spl-stake-pool library…" });

    try {
      const { PublicKey, Transaction, Connection } = await import("@solana/web3.js");
      const solanaStakePool = await import("@solana/spl-stake-pool");
      const { contracts, chainAdapters } = await import("chainsig.js");

      const connection = new Connection("https://solana.publicnode.com", "confirmed");
      const JITO_POOL  = new PublicKey(JITO_STAKE_POOL_ADDR);
      const derivedPubkey = new PublicKey(derivedSolAddress);
      const solAmount = parseFloat(unstakeAmount);

      setUnstakeState({ status: "loading", message: "Fetching pool state and building withdrawSol instructions…" });

      // withdrawSol returns { instructions, signers } where signers[0] is an ephemeral
      // delegate keypair we can sign with normally; MPC signs for our derived address.
      const { instructions, signers } = await solanaStakePool.withdrawSol(
        connection,
        JITO_POOL,
        derivedPubkey,
        derivedPubkey,
        solAmount,
      );

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      const transaction = new Transaction({
        feePayer: derivedPubkey,
        recentBlockhash: blockhash,
      });
      transaction.add(...instructions);

      // Ephemeral delegate signs first (we have the keypair)
      transaction.partialSign(...signers);

      // Message bytes are signature-independent — same before or after partialSign
      const messageBytes = transaction.serializeMessage();

      setUnstakeState({ status: "loading", message: "Asking NEAR MPC (v1.signer) to sign transaction…" });

      const MPC_CONTRACT = new contracts.ChainSignatureContract({
        networkId: "mainnet",
        contractId: "v1.signer",
      });

      const rsvSignatures = await MPC_CONTRACT.sign({
        payloads: [messageBytes],
        path: "solana-1",
        keyType: "Eddsa",
        signerAccount: {
          accountId: accountId!,
          signAndSendTransactions: (params: { transactions: any[] }) =>
            callMethods(mapChainSigTxs(params.transactions)),
        },
      });

      if (!rsvSignatures[0]) throw new Error("MPC signing failed — no signature returned");

      // Add MPC signature for derived address alongside the ephemeral signature
      const mpcSig = (rsvSignatures[0] as any).signature;
      transaction.addSignature(derivedPubkey, Buffer.from(mpcSig));
      const serialized = transaction.serialize().toString("base64");

      const SolanaAdapter = new chainAdapters.solana.Solana({
        solanaConnection: connection,
        contract: MPC_CONTRACT,
      });

      setUnstakeState({ status: "loading", message: "Broadcasting to Solana mainnet…" });
      const txHash = await SolanaAdapter.broadcastTx(serialized as any);
      const hashStr = (txHash as any)?.hash ?? String(txHash);

      setUnstakeState({
        status: "done",
        message: `Unstaked! ~${unstakeAmount} SOL returned to ${derivedSolAddress.slice(0, 12)}…`,
        txHash: hashStr,
      });
    } catch (err) {
      setUnstakeState({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }, [accountId, derivedSolAddress, callMethods, unstakeAmount]);

  if (!derivedSolAddress) {
    return <p className="text-gray-500 text-sm">Connect your NEAR wallet to see jitoSOL balance.</p>;
  }

  const hasBalance = jitoSolBalance && parseFloat(jitoSolBalance) > 0;

  return (
    <div className="space-y-4">
      {/* jitoSOL balance */}
      <div className="p-3 bg-gray-900 rounded-lg flex items-center justify-between text-sm">
        <span className="text-gray-400">jitoSOL at derived address</span>
        <span className="font-mono font-bold text-[#97FBE4]">
          {balanceLoading ? "loading…" : `${jitoSolBalance ?? "—"} jitoSOL`}
        </span>
      </div>

      {!hasBalance && !balanceLoading && (
        <p className="text-yellow-400 text-xs">
          No jitoSOL found at derived address. Complete the stake flow above first.
        </p>
      )}

      {/* Amount input + button */}
      <div className="flex gap-3 items-center">
        <input
          type="number"
          value={unstakeAmount}
          onChange={(e) => setUnstakeAmount(e.target.value)}
          step="0.001"
          min="0.001"
          disabled={unstakeState.status === "loading" || !hasBalance}
          className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-400 disabled:opacity-50"
          placeholder="SOL amount to receive"
        />
        <span className="text-gray-400 text-sm whitespace-nowrap">SOL to receive</span>
        <button
          onClick={handleUnstake}
          disabled={unstakeState.status === "loading" || !hasBalance}
          className="px-4 py-2 bg-orange-600 text-white font-bold rounded-lg text-sm hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          {unstakeState.status === "loading" ? "Unstaking…" : "Unstake"}
        </button>
      </div>

      {/* Status message */}
      {unstakeState.message && (
        <div className={`text-sm rounded-lg px-3 py-2 font-mono break-all ${
          unstakeState.status === "error"
            ? "bg-red-900/20 text-red-300"
            : "bg-orange-900/10 text-orange-300"
        }`}>
          {unstakeState.message}
          {unstakeState.txHash && (
            <div className="mt-1 text-xs text-gray-400">
              <a
                href={`https://explorer.solana.com/tx/${unstakeState.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                View on Solana Explorer
              </a>
            </div>
          )}
        </div>
      )}

      {/* Post-unstake hint */}
      {unstakeState.status === "done" && (
        <div className="p-3 border border-gray-700 rounded-lg text-sm text-gray-400">
          SOL is now at your derived Solana address. To route it back to NEAR:
          use the <strong className="text-white">Withdraw</strong> tab in Intents Check with your derived address as sender, or use 1Click reverse flow.
        </div>
      )}
    </div>
  );
}
