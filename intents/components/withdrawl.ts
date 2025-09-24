import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";

import {
  getAccount,
  getAccountBalanceOfSolana,
  transferMultiTokenForQuote,
} from "./near";
import { getQuote, waitUntilQuoteExecutionCompletes } from "./intents";

// Loading environment variables
require("dotenv").config({ path: ".env" });

interface WithdrawOptions {
  inputToken: string;
  outputToken: string;
  inputAmount: bigint;
  receiverAddress: string;
  slippageTolerance: number;
}

async function withdraw({
  inputToken,
  outputToken,
  inputAmount,
  slippageTolerance,
  receiverAddress,
}: WithdrawOptions): Promise<void> {
  console.log(
    `You are about to withdraw ${inputToken} tokens to ${outputToken} on Base chain`
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

  console.log(`Withdraw of 0.1 USDC to Base chain was settled successfully!`);

}

withdraw({
  inputToken: "nep141:sol.omft.near", 
  outputToken: "nep141:sol.omft.near", 
  inputAmount: BigInt(100_000), 
  slippageTolerance: 10, // 0.1%
  receiverAddress: "0xB822B51A88E8a03fCe0220B15Cb2C662E42Adec1", // solana derived address
}).catch((error: unknown) => {
  const { styleText } = require("node:util");

  if (error instanceof Error) {
    console.error(styleText("red", error.message));
  } else {
    console.error(styleText("red", JSON.stringify(error)));
  }
});