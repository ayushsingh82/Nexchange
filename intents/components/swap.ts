// Using 1 click api to swap NEAR ON NEAR TO SOL ON SOLANA

interface SwapQuoteRequest {
  dry: boolean;
  depositMode: "SIMPLE" | "MEMO";
  swapType: "EXACT_INPUT" | "EXACT_OUTPUT" | "FLEX_INPUT";
  slippageTolerance: number;
  originAsset: string;
  depositType: "ORIGIN_CHAIN" | "INTENTS";
  destinationAsset: string;
  amount: string;
  refundTo: string;
  refundType: "ORIGIN_CHAIN" | "INTENTS";
  recipient: string;
  virtualChainRecipient?: string;
  virtualChainRefundRecipient?: string;
  customRecipientMsg?: string;
  recipientType: "DESTINATION_CHAIN" | "INTENTS";
  deadline: string;
  referral: string;
  quoteWaitingTimeMs: number;
  appFees: Array<{
    recipient: string;
    fee: number;
  }>;
}

// Test scenarios for different swap types
interface SwapScenario {
  name: string;
  description: string;
  request: Omit<SwapQuoteRequest, 'dry' | 'deadline' | 'quoteWaitingTimeMs'>;
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
    virtualChainRecipient?: string;
    virtualChainRefundRecipient?: string;
    customRecipientMsg?: string;
  };
}

// Test scenarios for different swap configurations
const testScenarios: SwapScenario[] = [
  {
    name: "NEAR to SOL (Basic)",
    description: "Simple NEAR to SOL swap using exact input",
    request: {
      depositMode: "SIMPLE",
      swapType: "EXACT_INPUT",
      slippageTolerance: 100, // 1%
      originAsset: "nep141:wrap.near",
      depositType: "ORIGIN_CHAIN",
      destinationAsset: "nep141:sol.omft.near",
      amount: "1000000000000000000000000", // 1 NEAR
      refundTo: "test.near",
      refundType: "ORIGIN_CHAIN",
      recipient: "13QkxhNMrTPxoCkRdYdJ65tFuwXPhL5gLS2Z5Nr6gjRK",
      recipientType: "DESTINATION_CHAIN",
      referral: "test-referral",
      appFees: []
    }
  }
];

// Function to request a swap quote
export async function requestSwapQuote(
  scenario: SwapScenario, 
  jwtToken?: string
): Promise<SwapQuoteResponse> {
  const requestBody: SwapQuoteRequest = {
    ...scenario.request,
    dry: true,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    quoteWaitingTimeMs: 3000
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

// Function to test a single scenario
async function testScenario(scenario: SwapScenario, jwtToken?: string) {
  try {
    console.log(`\n🔄 Testing: ${scenario.name}`);
    console.log(`📝 Description: ${scenario.description}`);
    console.log('─'.repeat(50));
    
    const quote = await requestSwapQuote(scenario, jwtToken);
    
    console.log('✅ Success! Quote Details:');
    console.log(`   💰 Amount In: ${quote.quote.amountInFormatted} ($${quote.quote.amountInUsd})`);
    console.log(`   💸 Amount Out: ${quote.quote.amountOutFormatted} ($${quote.quote.amountOutUsd})`);
    console.log(`   ⏱️  Time Estimate: ${quote.quote.timeEstimate} seconds`);
    console.log(`   📅 Deadline: ${quote.quote.deadline}`);
    
    if (quote.quote.depositAddress) {
      console.log(`   🏦 Deposit Address: ${quote.quote.depositAddress}`);
    }
    
    return { success: true, scenario: scenario.name };
    
  } catch (error) {
    console.log('❌ Failed!');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, scenario: scenario.name, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Main function to run all swap quote tests
async function main() {
  console.log('🚀 1Click API Swap Quote Dry Run Tests');
  console.log('=======================================');
  console.log('⚠️  Note: All requests are dry runs (dry: true)');
  console.log('⚠️  Note: No JWT token required for dry runs');
  console.log(`📊 Testing ${testScenarios.length} different scenarios...\n`);
  
  const results = [];
  
  for (const scenario of testScenarios) {
    const result = await testScenario(scenario);
    results.push(result);
    
    // Add a small delay between requests to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Scenarios:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.scenario}: ${r.error}`);
    });
  }
  
  if (successful > 0) {
    console.log('\n✨ Dry run tests completed! Some scenarios may fail due to:');
    console.log('   • Invalid asset IDs (test data)');
    console.log('   • Network connectivity issues');
    console.log('   • API rate limiting');
    console.log('   • Authentication requirements for certain assets');
  }
}

// Run the main function
main();