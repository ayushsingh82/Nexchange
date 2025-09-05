import { getStakePoolStats } from './components/apy-calculator';

async function main() {
  try {
    console.log('🚀 Fetching Solana stake pool APY from Jito...');
    console.log('==============================================');
    
    const data = await getStakePoolStats();
    
    // Display formatted data
    if (data.getStakePoolStats) {
      const stats = data.getStakePoolStats;
      console.log('\n📊 Stake Pool Statistics:');
      console.log('==========================');
      console.log(`💰 APY: ${stats.apy.toFixed(2)}%`);
      console.log(`🏦 TVL: ${stats.tvl.toLocaleString()} SOL`);
      console.log(`🪙 Supply: ${stats.supply.toLocaleString()} SOL`);
      console.log(`⚡ Validators: ${stats.numValidators.toLocaleString()}`);
      console.log(`🎯 MEV Rewards: ${stats.mevRewards.toLocaleString()} SOL`);
      console.log(`📈 Aggregated MEV Rewards: ${stats.aggregatedMevRewards.toLocaleString()} SOL`);
      
      console.log('\n✨ APY calculation complete!');
    } else {
      console.log('❌ No data received from API');
    }
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Run the main function
main();
