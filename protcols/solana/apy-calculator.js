// Simple JavaScript version for CLI
async function getStakePoolStats() {
  const apiUrl = 'https://kobe.mainnet.jito.network/api/v1/stake_pool_stats'

  // Set up start and end dates
  const start = new Date('2022-10-31T00:00:00Z') // Launch date
  const end = new Date()

  const statsRequest = {
    bucket_type: 'Daily',
    range_filter: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    sort_by: {
      field: 'BlockTime',
      order: 'Asc',
    },
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statsRequest),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data) {
      const {
        aggregated_mev_rewards: aggregatedMevRewards,
        apy,
        mev_rewards: mevRewards,
        num_validators: numValidators,
        supply,
        tvl,
      } = data

      const camelCaseData = {
        getStakePoolStats: {
          aggregatedMevRewards,
          apy,
          mevRewards,
          numValidators,
          supply,
          tvl,
        },
      }

      return camelCaseData
    } else {
      throw new Error('No data received from API')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw new Error(`Error fetching data: ${error.message}`)
  }
}

async function main() {
  try {
    console.log('🚀 Fetching Solana stake pool APY from Jito...');
    console.log('==============================================');
    
    const data = await getStakePoolStats();
    
    // Display only APY
    if (data.getStakePoolStats) {
      const stats = data.getStakePoolStats;
      console.log(`\n💰 Current APY: ${stats.apy}%`);
      console.log(`🏦 TVL: ${stats.tvl}`);
      console.log(`🪙 Supply: ${stats.supply}`);
      console.log(`⚡ Validators: ${stats.numValidators}`);
      
      console.log('\n✨ APY calculation complete!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
