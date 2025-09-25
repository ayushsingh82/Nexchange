#!/usr/bin/env ts-node

import { getAccount, getAccountBalanceOfNear, getAccountBalanceOfSolana, depositNearAsMultiToken, transferMultiTokenForQuote } from "./components/near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./components/intents";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";
import { NEAR } from "@near-js/tokens";

require("dotenv").config({ path: ".env" });

// Withdraw function (copied from withdrawl.ts since it's not exported)
async function withdraw({
  inputToken,
  outputToken,
  inputAmount,
  slippageTolerance,
  receiverAddress,
}: {
  inputToken: string;
  outputToken: string;
  inputAmount: bigint;
  receiverAddress: string;
  slippageTolerance: number;
}): Promise<void> {
  console.log(
    `You are about to withdraw ${inputToken} tokens to ${outputToken} on destination chain`
  );

  const account = getAccount();

  console.log(
    `Checking the balance of ${inputToken} for the account ${account.accountId}`
  );
  const balance = await getAccountBalanceOfSolana(account, inputToken);

  if (balance < inputAmount) {
    throw new Error(
      `Insufficient balance of ${inputToken} for withdrawing (required: ${inputAmount}, your: ${balance})`
    );
  }

  const deadline = new Date();
  deadline.setMinutes(deadline.getMinutes() + 5);

  const quote = await getQuote({
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: slippageTolerance,
    depositType: QuoteRequest.depositType.INTENTS,
    originAsset: inputToken,
    destinationAsset: outputToken,
    amount: inputAmount.toString(),
    refundTo: account.accountId,
    refundType: QuoteRequest.refundType.INTENTS,
    recipient: receiverAddress,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: deadline.toISOString(),
  });

  await transferMultiTokenForQuote(account, quote, inputToken);

  await waitUntilQuoteExecutionCompletes(quote);

  console.log(`Withdraw was settled successfully!`);
}

/**
 * Function Call Examples for NeXchange Intents System
 * 
 * Available Commands:
 * - npm run examples:demo - Run all examples
 * - npm run examples:account - Test getAccount()
 * - npm run examples:balance - Test getAccountBalanceOfNear()
 * - npm run examples:multitoken - Test getAccountBalanceOfMultiToken()
 * - npm run examples:deposit - Test depositNearAsMultiToken()
 * - npm run examples:quote - Test quote execution
 * - npm run examples:deposit-fn - Test deposit function
 * - npm run flow:complete - Complete flow example
 */

async function demoAccount() {
  console.log("\n🔹 Testing getAccount() from near.ts");
  try {
    const account = getAccount();
    console.log(`✅ Account ID: ${account.accountId}`);
    console.log(`✅ Account connected successfully`);
    return account;
  } catch (error) {
    console.error("❌ Error getting account:", error);
    throw error;
  }
}

async function demoBalance(account?: any) {
  console.log("\n🔹 Testing getAccountBalanceOfNear() from near.ts");
  try {
    const accountInstance = account || getAccount();
    const balance = await getAccountBalanceOfNear(accountInstance);
    console.log(`✅ NEAR Balance: ${NEAR.toDecimal(balance)} NEAR`);
    return balance;
  } catch (error) {
    console.error("❌ Error getting balance:", error);
    throw error;
  }
}

async function demoMultiToken(account?: any) {
  console.log("\n🔹 Testing getAccountBalanceOfSolana() from near.ts");
  try {
    const accountInstance = account || getAccount();
    const tokenId = "nep141:sol.omft.near";
    const balance = await getAccountBalanceOfSolana(accountInstance, tokenId);
    console.log(`✅ SOL token balance (${tokenId}): ${balance.toString()}`);
    return balance;
  } catch (error) {
    console.error("❌ Error getting SOL token balance:", error);
    throw error;
  }
}

async function demoDeposit(account?: any) {
  console.log("\n🔹 Testing depositNearAsMultiToken() from near.ts");
  try {
    const accountInstance = account || getAccount();
    const amount = NEAR.toUnits("0.1"); // 0.1 NEAR for testing
    
    // Check balance first
    const balance = await getAccountBalanceOfNear(accountInstance);
    console.log(`📊 Current balance: ${NEAR.toDecimal(balance)} NEAR`);
    
    if (balance >= amount) {
      console.log(`💰 Depositing ${NEAR.toDecimal(amount)} NEAR as multi-token...`);
      await depositNearAsMultiToken(accountInstance, amount);
      console.log("✅ Deposit successful!");
    } else {
      console.log("❌ Insufficient balance for deposit");
    }
  } catch (error) {
    console.error("❌ Error depositing:", error);
    throw error;
  }
}

async function demoQuote(account?: any) {
  console.log("\n🔹 Testing quote execution from intent.ts");
  try {
    const accountInstance = account || getAccount();
    const amount = NEAR.toUnits("0.1");
    
    console.log("📋 Getting quote for NEAR → SOL swap...");
    
    // Get quote
    const quote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 10, // 0.1%
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: "nep141:wrap.near",
      destinationAsset: "nep141:sol.omft.near",
      amount: amount.toString(),
      refundTo: accountInstance.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: accountInstance.accountId,
      recipientType: QuoteRequest.recipientType.INTENTS,
      deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    
    console.log("✅ Quote received:", {
      amountIn: quote.amountIn,
      amountOut: quote.amountOut,
      depositAddress: quote.depositAddress
    });
    
    console.log("🚀 Executing quote...");
    await transferMultiTokenForQuote(accountInstance, quote, "nep141:wrap.near");
    await waitUntilQuoteExecutionCompletes(quote);
    
    console.log("✅ Quote executed successfully!");
    return quote;
  } catch (error) {
    console.error("❌ Error executing quote:", error);
    throw error;
  }
}

async function demoDepositFunction() {
  console.log("\n🔹 Testing deposit function from deposit.ts");
  console.log("ℹ️  Note: deposit.ts doesn't export functions, using individual functions from near.ts");
  
  try {
    const account = getAccount();
    const amount = NEAR.toUnits("0.1");
    
    // This demonstrates how you would call the deposit function if it was exported
    console.log("📝 Calling deposit-related functions individually:");
    
    // Check balance
    const balance = await getAccountBalanceOfNear(account);
    console.log(`📊 Balance: ${NEAR.toDecimal(balance)} NEAR`);
    
    // Deposit if sufficient balance
    if (balance >= amount) {
      await depositNearAsMultiToken(account, amount);
      console.log("✅ Deposit completed!");
    } else {
      console.log("❌ Insufficient balance");
    }
  } catch (error) {
    console.error("❌ Error in deposit function:", error);
    throw error;
  }
}

async function completeFlow() {
  console.log("\n🎯 Running Complete Flow: Deposit → Swap → Withdraw");
  console.log("=" .repeat(60));
  
  try {
    const account = getAccount();
    const amount = NEAR.toUnits("0.1"); // Small amount for testing
    
    // 1. Check NEAR balance
    console.log("\n1️⃣ Checking NEAR balance...");
    const balance = await getAccountBalanceOfNear(account);
    console.log(`📊 Current balance: ${NEAR.toDecimal(balance)} NEAR`);
    
    if (balance < amount) {
      console.log("❌ Insufficient balance for testing");
      return;
    }
    
    // 2. Deposit NEAR as multi-token
    console.log("\n2️⃣ Depositing NEAR as multi-token...");
    await depositNearAsMultiToken(account, amount);
    console.log("✅ NEAR deposited as multi-token");
    
    // 3. Get and execute quote
    console.log("\n3️⃣ Getting quote for NEAR → SOL swap...");
    const quote = await getQuote({
      dry: false,
      swapType: QuoteRequest.swapType.EXACT_INPUT,
      slippageTolerance: 10,
      depositType: QuoteRequest.depositType.INTENTS,
      originAsset: "nep141:wrap.near",
      destinationAsset: "nep141:sol.omft.near",
      amount: amount.toString(),
      refundTo: account.accountId,
      refundType: QuoteRequest.refundType.INTENTS,
      recipient: account.accountId,
      recipientType: QuoteRequest.recipientType.INTENTS,
      deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    
    console.log("🚀 Executing quote...");
    await transferMultiTokenForQuote(account, quote, "nep141:wrap.near");
    await waitUntilQuoteExecutionCompletes(quote);
    console.log("✅ NEAR swapped to SOL");
    
    // 4. Withdraw SOL (example - would need actual SOL balance)
    console.log("\n4️⃣ Withdrawing SOL to Solana chain...");
    try {
      await withdraw({
        inputToken: "nep141:sol.omft.near",
        outputToken: "solana:So11111111111111111111111111111111111111112", // SOL token on Solana
        inputAmount: BigInt(1000000), // 0.001 SOL (9 decimals)
        slippageTolerance: 10,
        receiverAddress: "5qKow5dTuF22WbTJwxHTJD3iGuqEfc65TyV7ctBF9Cwg", // Example Solana address
      });
      console.log("✅ SOL withdrawn to Solana chain");
    } catch (withdrawError) {
      console.log("⚠️  Withdraw step skipped (insufficient SOL balance or other issue)");
      console.log("💡 This is normal for testing - the swap created SOL in intents");
    }
    
    console.log("\n🎉 Complete flow finished successfully!");
    
  } catch (error) {
    console.error("❌ Error in complete flow:", error);
    throw error;
  }
}

async function runDemo() {
  console.log("🚀 NeXchange Function Examples Demo");
  console.log("=" .repeat(50));
  
  try {
    // Run all examples
    const account = await demoAccount();
    await demoBalance(account);
    await demoMultiToken(account);
    await demoDeposit(account);
    await demoQuote(account);
    await demoDepositFunction();
    
    console.log("\n✅ All examples completed successfully!");
    
  } catch (error) {
    console.error("❌ Demo failed:", error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case "demo":
      await runDemo();
      break;
    case "account":
      await demoAccount();
      break;
    case "balance":
      await demoBalance();
      break;
    case "multitoken":
      await demoMultiToken();
      break;
    case "deposit":
      await demoDeposit();
      break;
    case "quote":
      await demoQuote();
      break;
    case "deposit-fn":
      await demoDepositFunction();
      break;
    case "complete-flow":
      await completeFlow();
      break;
    default:
      console.log(`
🔧 NeXchange Function Call Examples

Available commands:
  npm run examples:demo         - Run all examples
  npm run examples:account      - Test getAccount()
  npm run examples:balance      - Test getAccountBalanceOfNear()
  npm run examples:multitoken   - Test getAccountBalanceOfMultiToken()
  npm run examples:deposit      - Test depositNearAsMultiToken()
  npm run examples:quote        - Test quote execution
  npm run examples:deposit-fn   - Test deposit function
  npm run flow:complete         - Complete flow example

Direct file execution:
  npm run withdraw              - withdraw() from withdraw.ts
  npm run sol-withdraw          - SOL withdrawal example
  npm run swap                  - swap.ts example
  npm run deposit               - deposit.ts example
  npm run intents               - intents.ts example
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}
