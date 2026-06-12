import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";

const INTENTS_CONTRACT_ID = "intents.near";
const THIRTY_TGAS = "30000000000000";

// Single NEAR transaction with two batch actions — executes in order on-chain:
// 1. near_deposit wraps NEAR → wNEAR
// 2. ft_transfer_call sends wNEAR → intents.near
// Using batch actions (not two separate txs) guarantees sequential execution.
export async function depositNearAsMultiToken(
  accountId: string,
  amount: string,
  callMethodBatch: (contractId: string, actions: Array<{ method: string; args: Record<string, unknown>; gas: string; deposit: string }>) => Promise<unknown>
): Promise<void> {
  await callMethodBatch("wrap.near", [
    {
      method: "near_deposit",
      args: {},
      gas: "10000000000000",   // 10 TGas
      deposit: amount,
    },
    {
      method: "ft_transfer_call",
      args: {
        receiver_id: INTENTS_CONTRACT_ID,
        amount,
        msg: accountId,
      },
      gas: "50000000000000",   // 50 TGas
      deposit: "1",
    },
  ]);
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
  const response = await fetch("/api/1click/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || `Quote failed: ${response.status}`);
  }

  return response.json();
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
        `/api/1click/status?depositAddress=${quote.depositAddress}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.status === "SUCCESS") return;
        console.log(`Quote status: ${result.status}`);
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



