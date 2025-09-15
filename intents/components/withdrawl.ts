// near contract call-function as-transaction intents.near ft_withdraw json-args '{ "token": "wrap.near", "receiver_id": "alice.near", "amount": "1000" }' prepaid-gas '100.0 Tgas' attached-deposit '1 yoctoNEAR' sign-as alice.near network-config mainnet sign-with-keychain send


const proposal = {
    description: "Transfer SOL to recipient",
    kind: {
      FunctionCall: {
        receiver_id: intentsContract.accountId,
        actions: [
          {
            method_name: "ft_withdraw",
            args: Buffer.from(
              JSON.stringify({
                token: "nep141:sol.omft.near",
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