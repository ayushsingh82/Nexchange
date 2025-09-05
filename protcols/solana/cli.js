#!/usr/bin/env node

const { getStakePoolStats } = require('./components/apy_calculation');

async function main() {
  try {
    console.log('🚀 Fetching Solana stake pool statistics from Jito...');
    console.log('====================================================');
    
    const data = await getStakePoolStats();
    
    console.log('\n📊 Raw Data:');
    console.log('============');
    console.log(JSON.stringify(data, null, 2));
    
    // Display formatted data
    if (data.getStakePoolStats) {
      const stats = data.getStakePoolStats;
      console.log('\n🎯 Formatted Results:');
      console.log('====================');
      console.log(`💰 APY: ${stats.apy}%`);
      console.log(`🏦 TVL: ${stats.tvl}`);
      console.log(`🪙 Supply: ${stats.supply}`);
      console.log(`⚡ Validators: ${stats.numValidators}`);
      console.log(`🎯 MEV Rewards: ${stats.mevRewards}`);
      console.log(`📈 Aggregated MEV Rewards: ${stats.aggregatedMevRewards}`);
      
      console.log('\n✨ Data fetched successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
