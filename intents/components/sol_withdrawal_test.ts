/**
 * Test file demonstrating SOL withdrawal from intents contract to Solana chain
 */

import { expect } from "@playwright/test";
import { test } from "../../util/test.js";
import { Account, parseNEAR, Worker } from "near-workspaces";
import { 
  withdrawSolToChain, 
  formatSolAmount,
  createSolWithdrawalProposal,
  executeSolWithdrawalProposal 
} from "./sol_withdrawal.js";
import {
  PROPOSAL_BOND,
  SPUTNIK_DAO_FACTORY_ID,
} from "../../util/sandboxrpc.js";

test("withdraw SOL from intents contract to Solana chain", async () => {
  test.setTimeout(120_000);
  const daoName = "testdao";

  const worker = await Worker.init();

  // Set up intents contract
  const intentsContract = await worker.rootAccount.importContract({
    mainnetContract: "intents.near",
  });
  await intentsContract.call(intentsContract.accountId, "new", {
    config: {
      wnear_id: "wrap.near",
      fees: {
        fee: 100,
        fee_collector: "intents.near",
      },
      roles: {
        super_admins: ["intents.near"],
        admins: {},
        grantees: {},
      },
    },
  });

  // Import factory
  const factoryContract = await worker.rootAccount.importContract({
    mainnetContract: SPUTNIK_DAO_FACTORY_ID,
  });

  await factoryContract.call(
    SPUTNIK_DAO_FACTORY_ID,
    "new",
    {},
    { gas: 300_000_000_000_000 }
  );

  // Create creator account and fund it
  const creatorAccount = await worker.rootAccount.createSubAccount(
    "testcreator"
  );

  // Fund the creator account
  await worker.rootAccount.transfer(creatorAccount.accountId, parseNEAR("150"));

  // Create DAO
  const create_testdao_args = {
    name: daoName,
    args: Buffer.from(
      JSON.stringify({
        config: {
          name: daoName,
          purpose: "creating dao treasury",
          metadata: "",
        },
        policy: {
          roles: [
            {
              kind: {
                Group: [creatorAccount.accountId],
              },
              name: "Create Requests",
              permissions: [
                "call:AddProposal",
                "transfer:AddProposal",
                "config:Finalize",
              ],
              vote_policy: {},
            },
            {
              kind: {
                Group: [creatorAccount.accountId],
              },
              name: "Manage Members",
              permissions: [
                "config:*",
                "policy:*",
                "add_member_to_role:*",
                "remove_member_from_role:*",
              ],
              vote_policy: {},
            },
            {
              kind: {
                Group: [creatorAccount.accountId],
              },
              name: "Vote",
              permissions: ["*:VoteReject", "*:VoteApprove", "*:VoteRemove"],
              vote_policy: {},
            },
          ],
          default_vote_policy: {
            weight_kind: "RoleWeight",
            quorum: "0",
            threshold: [1, 2],
          },
          proposal_bond: PROPOSAL_BOND,
          proposal_period: "604800000000000",
          bounty_bond: "100000000000000000000000",
          bounty_forgiveness_period: "604800000000000",
        },
      })
    ).toString("base64"),
  };

  await creatorAccount.call(
    SPUTNIK_DAO_FACTORY_ID,
    "create",
    create_testdao_args,
    {
      gas: 300_000_000_000_000,
      attachedDeposit: parseNEAR("6"),
    }
  );

  const daoAccount = new Account(`${daoName}.${SPUTNIK_DAO_FACTORY_ID}`);

  // Simulate having SOL in the intents contract (in real scenario, this would come from swaps)
  // For testing, we'll assume the DAO already has SOL balance
  console.log("Setting up test scenario with SOL balance...");

  // Test SOL withdrawal
  const recipientSolanaAddress = "5qKow5dTuF22WbTJwxHTJD3iGuqEfc65TyV7ctBF9Cwg";
  const solAmount = formatSolAmount(1.5); // 1.5 SOL

  console.log(`Withdrawing ${solAmount} lamports (1.5 SOL) to ${recipientSolanaAddress}`);

  const result = await withdrawSolToChain({
    intentsContract,
    daoAccount,
    creatorAccount,
    recipientSolanaAddress,
    amount: solAmount,
    proposalBond: PROPOSAL_BOND,
  });

  console.log("Withdrawal result:", result);

  // Verify the withdrawal was successful
  expect(result.success).toBe(true);
  expect(result.proposalId).toBeDefined();

  await worker.tearDown();
});

test("create SOL withdrawal proposal only", async () => {
  test.setTimeout(60_000);

  const worker = await Worker.init();

  // Set up intents contract
  const intentsContract = await worker.rootAccount.importContract({
    mainnetContract: "intents.near",
  });
  await intentsContract.call(intentsContract.accountId, "new", {
    config: {
      wnear_id: "wrap.near",
      fees: {
        fee: 100,
        fee_collector: "intents.near",
      },
      roles: {
        super_admins: ["intents.near"],
        admins: {},
        grantees: {},
      },
    },
  });

  // Create creator account
  const creatorAccount = await worker.rootAccount.createSubAccount("creator");
  await worker.rootAccount.transfer(creatorAccount.accountId, parseNEAR("10"));

  // Create a mock DAO account
  const daoAccount = await worker.rootAccount.createSubAccount("testdao");

  const recipientSolanaAddress = "5qKow5dTuF22WbTJwxHTJD3iGuqEfc65TyV7ctBF9Cwg";
  const solAmount = formatSolAmount(2.0); // 2.0 SOL

  // Test just creating the proposal
  const { proposalId, proposal } = await createSolWithdrawalProposal({
    intentsContract,
    daoAccount,
    creatorAccount,
    recipientSolanaAddress,
    amount: solAmount,
    proposalBond: PROPOSAL_BOND,
  });

  console.log("Created proposal:", proposalId);
  console.log("Proposal details:", proposal);

  expect(proposalId).toBeDefined();
  expect(proposal.kind.FunctionCall.receiver_id).toBe(intentsContract.accountId);
  expect(proposal.kind.FunctionCall.actions[0].method_name).toBe("ft_withdraw");

  await worker.tearDown();
});
