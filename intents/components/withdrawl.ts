// near contract call-function as-transaction intents.near ft_withdraw json-args '{ "token": "wrap.near", "receiver_id": "alice.near", "amount": "1000" }' prepaid-gas '100.0 Tgas' attached-deposit '1 yoctoNEAR' sign-as alice.near network-config mainnet sign-with-keychain send

// Example 1: wNEAR withdrawal to NEAR account
const wnearProposal = {
    description: "Transfer wNEAR to recipient",
    kind: {
      FunctionCall: {
        receiver_id: intentsContract.accountId,
        actions: [
          {
            method_name: "ft_withdraw",
            args: Buffer.from(
              JSON.stringify({
                token: "wrap.near",
                receiver_id: recipientAccount.accountId, // Direct transfer to NEAR account
                amount: parseNEAR("25"), // 25 wNEAR
              })
            ).toString("base64"),
            deposit: 1n.toString(),
            gas: 30_000_000_000_000n.toString(),
          },
        ],
      },
    },
  };

// Example 2: SOL withdrawal to Solana chain
const solProposal = {
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
                receiver_id: "5qKow5dTuF22WbTJwxHTJD3iGuqEfc65TyV7ctBF9Cwg", // Solana address
                amount: "1500000000", // 1.5 SOL in lamports (9 decimals)
              })
            ).toString("base64"),
            deposit: 1n.toString(),
            gas: 30_000_000_000_000n.toString(),
          },
        ],
      },
    },
  };