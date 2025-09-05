import { getStakePoolStats } from './components/apy_calculation';

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
      console.log(`💰 APY: ${stats.apy}%`);
      console.log(`🏦 TVL: ${stats.tvl}`);
      console.log(`🪙 Supply: ${stats.supply}`);
      console.log(`⚡ Validators: ${stats.numValidators}`);
      console.log(`🎯 MEV Rewards: ${stats.mevRewards}`);
      console.log(`📈 Aggregated MEV Rewards: ${stats.aggregatedMevRewards}`);
      
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
