// using 1 click api to swap NEAR ON NEAR TO SOL ON SOLANA

const response = await fetch('https://1click.chaindefuser.com/v0/quote', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer JWT",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "dry": true,
      "depositMode": "SIMPLE",
      "swapType": "EXACT_INPUT",
      "slippageTolerance": 100,
      "originAsset": "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
      "depositType": "ORIGIN_CHAIN",
      "destinationAsset": "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
      "amount": "1000",
      "refundTo": "0x2527D02599Ba641c19FEa793cD0F167589a0f10D",
      "refundType": "ORIGIN_CHAIN",
      "recipient": "13QkxhNMrTPxoCkRdYdJ65tFuwXPhL5gLS2Z5Nr6gjRK",
      "virtualChainRecipient": "0xb4c2fbec9d610F9A3a9b843c47b1A8095ceC887C",
      "virtualChainRefundRecipient": "0xb4c2fbec9d610F9A3a9b843c47b1A8095ceC887C",
      "customRecipientMsg": "smart-contract-recipient.near",
      "recipientType": "DESTINATION_CHAIN",
      "deadline": "2019-08-24T14:15:22Z",
      "referral": "referral",
      "quoteWaitingTimeMs": 3000,
      "appFees": [
        {
          "recipient": "recipient.near",
          "fee": 100
        }
      ]
    })
});

const data = await response.json();