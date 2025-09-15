/**
 * SOL withdrawal function using intents contract
 * Withdraws SOL from intents contract to Solana chain
 */

import { Account, parseNEAR } from "near-workspaces";

interface SolWithdrawalParams {
  intentsContract: Account;
  daoAccount: Account;
  creatorAccount: Account;
  recipientSolanaAddress: string;
  amount: string; // Amount in SOL (will be converted to proper format)
  proposalBond: string;
}

/**
 * Creates a proposal to withdraw SOL from intents contract to Solana chain
 */
export async function createSolWithdrawalProposal({
  intentsContract,
  daoAccount,
  creatorAccount,
  recipientSolanaAddress,
  amount,
  proposalBond,
}: SolWithdrawalParams) {
  console.log(`Creating SOL withdrawal proposal for ${amount} SOL to ${recipientSolanaAddress}`);

  // Create proposal to withdraw SOL to Solana address
  const proposal = {
    description: "Transfer SOL to Solana recipient",
    kind: {
      FunctionCall: {
        receiver_id: intentsContract.accountId,
        actions: [
          {
            method_name: "ft_withdraw",
            args: Buffer.from(
              JSON.stringify({
                token: "nep141:sol.omft.near", // SOL token on NEAR
                receiver_id: recipientSolanaAddress, // Solana address
                amount: amount, // Amount in smallest unit
              })
            ).toString("base64"),
            deposit: 1n.toString(),
            gas: 30_000_000_000_000n.toString(),
          },
        ],
      },
    },
  };

  // Add the proposal to the DAO
  const proposalId = await creatorAccount.call(
    daoAccount.accountId,
    "add_proposal",
    {
      proposal: proposal,
    },
    {
      attachedDeposit: proposalBond,
    }
  );

  console.log("Created SOL withdrawal proposal ID:", proposalId);

  return { proposalId, proposal };
}

/**
 * Executes the SOL withdrawal proposal by voting and executing it
 */
export async function executeSolWithdrawalProposal({
  daoAccount,
  creatorAccount,
  proposalId,
  proposal,
}: {
  daoAccount: Account;
  creatorAccount: Account;
  proposalId: string;
  proposal: any;
}) {
  console.log(`Executing SOL withdrawal proposal ${proposalId}`);

  // Vote and execute the proposal
  const result = await creatorAccount.callRaw(
    daoAccount.accountId,
    "act_proposal",
    {
      id: proposalId,
      action: "VoteApprove",
      proposal: proposal.kind,
    },
    {
      gas: 300_000_000_000_000n.toString(),
    }
  );

  console.log(
    "SOL withdrawal proposal execution result:",
    result.failed ? "FAILED" : "SUCCESS"
  );
  
  if (result.failed) {
    console.log("Failure reason:", result.receiptFailures);
  }

  return result;
}

/**
 * Complete SOL withdrawal flow: create and execute proposal
 */
export async function withdrawSolToChain({
  intentsContract,
  daoAccount,
  creatorAccount,
  recipientSolanaAddress,
  amount,
  proposalBond,
}: SolWithdrawalParams) {
  try {
    // Check initial SOL balance in intents contract
    const initialBalance = await intentsContract.view("mt_balance_of", {
      account_id: daoAccount.accountId,
      token_id: "nep141:sol.omft.near",
    });
    console.log("Initial SOL balance in intents:", initialBalance);

    // Create the withdrawal proposal
    const { proposalId, proposal } = await createSolWithdrawalProposal({
      intentsContract,
      daoAccount,
      creatorAccount,
      recipientSolanaAddress,
      amount,
      proposalBond,
    });

    // Execute the proposal
    const result = await executeSolWithdrawalProposal({
      daoAccount,
      creatorAccount,
      proposalId,
      proposal,
    });

    if (result.failed) {
      throw new Error(`SOL withdrawal failed: ${JSON.stringify(result.receiptFailures)}`);
    }

    // Check final balance
    const finalBalance = await intentsContract.view("mt_balance_of", {
      account_id: daoAccount.accountId,
      token_id: "nep141:sol.omft.near",
    });
    console.log("Final SOL balance in intents:", finalBalance);

    return {
      success: true,
      proposalId,
      initialBalance,
      finalBalance,
      withdrawnAmount: amount,
    };

  } catch (error) {
    console.error("SOL withdrawal error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Helper function to convert SOL amount to proper format
 * SOL has 9 decimal places
 */
export function formatSolAmount(amount: number): string {
  return (amount * 1_000_000_000).toString(); // Convert to lamports
}

/**
 * Example usage:
 * 
 * const result = await withdrawSolToChain({
 *   intentsContract,
 *   daoAccount,
 *   creatorAccount,
 *   recipientSolanaAddress: "5qKow5dTuF22WbTJwxHTJD3iGuqEfc65TyV7ctBF9Cwg",
 *   amount: formatSolAmount(1.5), // 1.5 SOL
 *   proposalBond: "1000000000000000000000000", // 1 NEAR
 * });
 */
