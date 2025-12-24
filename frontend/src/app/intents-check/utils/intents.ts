import { MethodParameters } from "@/lib/type/type";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";

const INTENTS_CONTRACT_ID = "intents.near";
const TGas = BigInt(1_000_000_000_000);
const THIRTY_TGAS = "30000000000000";
const NO_DEPOSIT = "0";

export async function depositNearAsMultiToken(
  accountId: string,
  amount: string,
  callMethod: (params: {
    contractId: string;
    method: string;
    args: Record<string, unknown>;
    gas: string;
    deposit: string;
  }) => Promise<unknown>
): Promise<string> {
  // First, deposit NEAR to wrap.near
  await callMethod({
    contractId: "wrap.near",
    method: "near_deposit",
    args: {},
    gas: String(10n * BigInt(THIRTY_TGAS)),
    deposit: amount,
  });

  // Then transfer wrapped NEAR to intents contract
  const result = await callMethod({
    contractId: "wrap.near",
    method: "ft_transfer_call",
    args: {
      receiver_id: INTENTS_CONTRACT_ID,
      amount: amount,
      msg: accountId,
    },
    gas: String(50n * BigInt(THIRTY_TGAS)),
    deposit: "1",
  });

  return JSON.stringify(result);
}

export async function transferMultiTokenForQuote(
  accountId: string,
  quote: { depositAddress?: string; amountIn: string },
  token: string,
  callMethod: (params: {
    contractId: string;
    method: string;
    args: Record<string, unknown>;
    gas: string;
    deposit: string;
  }) => Promise<unknown>
): Promise<string> {
  if (!quote.depositAddress) {
    throw new Error("Missing required field 'depositAddress'");
  }

  const result = await callMethod({
    contractId: INTENTS_CONTRACT_ID,
    method: "mt_transfer",
    args: {
      token_id: token,
      receiver_id: quote.depositAddress,
      amount: quote.amountIn,
    },
    gas: THIRTY_TGAS,
    deposit: "1",
  });

  return result as string;
}

export async function getQuote(requestBody: QuoteRequest): Promise<any> {
  const response = await fetch("https://api.1click.fi/v1/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get quote");
  }

  const data = await response.json();
  return data.quote;
}

export async function waitUntilQuoteExecutionCompletes(
  quote: { depositAddress?: string }
): Promise<void> {
  if (!quote.depositAddress) {
    throw new Error("Missing required field 'depositAddress'");
  }

  let attempts = 20;

  while (attempts > 0) {
    try {
      const response = await fetch(
        `https://api.1click.fi/v1/execution-status/${quote.depositAddress}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.status === "SUCCESS") {
          return;
        }
        console.log(`Current quote status is ${result.status}`);
      }
    } catch (error) {
      console.error("Failed to query execution status:", error);
    } finally {
      await new Promise((res) => setTimeout(res, 3_000));
      attempts -= 1;
    }
  }

  throw new Error("Quote hasn't been settled after 60 seconds");
}
