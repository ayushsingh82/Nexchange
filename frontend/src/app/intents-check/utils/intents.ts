import { MethodParameters } from "@/lib/type/type";
import { QuoteRequest } from "@defuse-protocol/one-click-sdk-typescript";

const INTENTS_CONTRACT_ID = "intents.near";
// NEAR max gas per transaction is 300 TGas
const GAS_NEAR_DEPOSIT   = "30000000000000";   // 30 TGas — simple payable call
const GAS_FT_TRANSFER    = "200000000000000";  // 200 TGas — cross-contract call

// Batch near_deposit + ft_transfer_call in one wallet approval.
// Both go to wrap.near, so NEAR executes them in nonce order (deposit first).
export async function depositNearAsMultiToken(
  accountId: string,
  amount: string,
  callMethods: (params: MethodParameters[]) => Promise<unknown>
): Promise<void> {
  await callMethods([
    {
      contractId: "wrap.near",
      method: "near_deposit",
      args: {},
      gas: GAS_NEAR_DEPOSIT,
      deposit: amount,
    },
    {
      contractId: "wrap.near",
      method: "ft_transfer_call",
      args: {
        receiver_id: INTENTS_CONTRACT_ID,
        amount,
        msg: accountId,
      },
      gas: GAS_FT_TRANSFER,
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

// Proxy through Next.js API to avoid CORS (real base: https://1click.chaindefuser.com)
const ONE_CLICK_PROXY = "/api/1click";

export async function getQuote(requestBody: QuoteRequest): Promise<any> {
  const response = await fetch(`${ONE_CLICK_PROXY}/v0/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Quote failed: ${response.status}`);
  }

  const data = await response.json();
  return data.quote ?? data;
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
        `${ONE_CLICK_PROXY}/v0/status?depositAddress=${quote.depositAddress}`
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



