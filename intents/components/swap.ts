// Using 1 click api to swap NEAR ON NEAR TO SOL ON SOLANA

interface SwapQuoteRequest {
  dry: boolean;
  depositMode: string;
  swapType: string;
  slippageTolerance: number;
  originAsset: string;
  depositType: string;
  destinationAsset: string;
  amount: string;
  refundTo: string;
  refundType: string;
  recipient: string;
  virtualChainRecipient: string;
  virtualChainRefundRecipient: string;
  customRecipientMsg: string;
  recipientType: string;
  deadline: string;
  referral: string;
  quoteWaitingTimeMs: number;
  appFees: Array<{
    recipient: string;
    fee: number;
  }>;
}

interface SwapQuoteResponse {
  timestamp: string;
  signature: string;
  quoteRequest: SwapQuoteRequest;
  quote: {
    depositAddress?: string;
    depositMemo?: string;
    amountIn: string;
    amountInFormatted: string;
    amountInUsd: string;
    minAmountIn: string;
    amountOut: string;
    amountOutFormatted: string;
    amountOutUsd: string;
    minAmountOut: string;
    deadline: string;
    timeWhenInactive?: string;
    timeEstimate: number;
    virtualChainRecipient: string;
    virtualChainRefundRecipient: string;
    customRecipientMsg: string;
  };
}

// Function to request a swap quote
export async function requestSwapQuote(jwtToken?: string): Promise<SwapQuoteResponse> {
  const requestBody: SwapQuoteRequest = {
    dry: true,
    depositMode: "SIMPLE",
    swapType: "EXACT_INPUT",
    slippageTolerance: 100,
    originAsset: "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
    depositType: "ORIGIN_CHAIN",
    destinationAsset: "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near",
    amount: "1000",
    refundTo: "0x2527D02599Ba641c19FEa793cD0F167589a0f10D",
    refundType: "ORIGIN_CHAIN",
    recipient: "13QkxhNMrTPxoCkRdYdJ65tFuwXPhL5gLS2Z5Nr6gjRK",
    virtualChainRecipient: "0xb4c2fbec9d610F9A3a9b843c47b1A8095ceC887C",
    virtualChainRefundRecipient: "0xb4c2fbec9d610F9A3a9b843c47b1A8095ceC887C",
    customRecipientMsg: "smart-contract-recipient.near",
    recipientType: "DESTINATION_CHAIN",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    referral: "referral",
    quoteWaitingTimeMs: 3000,
    appFees: [
      {
        recipient: "recipient.near",
        fee: 100
      }
    ]
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    // Only add Authorization header if JWT token is provided
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }

    const response = await fetch('https://1click.chaindefuser.com/v0/quote', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as SwapQuoteResponse;
    return data;
  } catch (error) {
    console.error('Error fetching swap quote:', error);
    throw new Error(`Error fetching swap quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main function to run the swap quote
async function main() {
  try {
    console.log('🔄 Requesting swap quote from 1Click API...');
    console.log('==========================================');
    console.log('⚠️  Note: This is a dry run request (dry: true)');
    console.log('⚠️  Note: Using placeholder JWT token - replace with real token for production');
    
    const quote = await requestSwapQuote();
    
    console.log('\n📊 Swap Quote Details:');
    console.log('======================');
    console.log(`💰 Amount In: ${quote.quote.amountInFormatted} ($${quote.quote.amountInUsd})`);
    console.log(`💸 Amount Out: ${quote.quote.amountOutFormatted} ($${quote.quote.amountOutUsd})`);
    console.log(`⏱️  Time Estimate: ${quote.quote.timeEstimate} seconds`);
    console.log(`📅 Deadline: ${quote.quote.deadline}`);
    
    if (quote.quote.depositAddress) {
      console.log(`🏦 Deposit Address: ${quote.quote.depositAddress}`);
    }
    
    console.log('\n✨ Swap quote retrieved successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof Error && error.message.includes('401')) {
      console.log('\n💡 Solution: You need a valid JWT token from 1Click API');
      console.log('   1. Get your JWT token from the 1Click API dashboard');
      console.log('   2. Replace "Bearer JWT" in the code with your actual token');
      console.log('   3. Or pass the token as a parameter: requestSwapQuote("your-jwt-token")');
    }
    
    process.exit(1);
  }
}

// Run the main function
main();