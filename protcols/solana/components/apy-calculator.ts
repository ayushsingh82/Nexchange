// Clean APY Calculator Component
interface DataPoint {
  data: number;
  date: string;
}

interface StakePoolStats {
  aggregated_mev_rewards: DataPoint[];
  apy: DataPoint[];
  mev_rewards: DataPoint[];
  num_validators: DataPoint[];
  supply: DataPoint[];
  tvl: DataPoint[];
}

interface ApiResponse {
  getStakePoolStats: {
    aggregatedMevRewards: number;
    apy: number;
    mevRewards: number;
    numValidators: number;
    supply: number;
    tvl: number;
  };
}

// Function to fetch stake pool stats from Jito API
export async function getStakePoolStats(): Promise<ApiResponse> {
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

    const data = await response.json() as StakePoolStats

    if (data) {
      // The API returns an object with arrays for each metric
      // We need to get the latest values (last item in each array)
      const apyData = data.apy || [];
      const tvlData = data.tvl || [];
      const supplyData = data.supply || [];
      const numValidatorsData = data.num_validators || [];
      const mevRewardsData = data.mev_rewards || [];
      const aggregatedMevRewardsData = data.aggregated_mev_rewards || [];

      // Get the latest values (most recent data points)
      // APY comes as decimal (e.g., 0.07184861225308525 = ~7.18%), so convert to percentage
      const latestApy = apyData.length > 0 ? apyData[apyData.length - 1].data * 100 : 0;
      const latestTvl = tvlData.length > 0 ? tvlData[tvlData.length - 1].data : 0;
      const latestSupply = supplyData.length > 0 ? supplyData[supplyData.length - 1].data : 0;
      const latestValidators = numValidatorsData.length > 0 ? numValidatorsData[numValidatorsData.length - 1].data : 0;
      const latestMevRewards = mevRewardsData.length > 0 ? mevRewardsData[mevRewardsData.length - 1].data : 0;
      const latestAggregatedMevRewards = aggregatedMevRewardsData.length > 0 ? aggregatedMevRewardsData[aggregatedMevRewardsData.length - 1].data : 0;

      const result: ApiResponse = {
        getStakePoolStats: {
          apy: latestApy,
          tvl: latestTvl,
          supply: latestSupply,
          numValidators: latestValidators,
          mevRewards: latestMevRewards,
          aggregatedMevRewards: latestAggregatedMevRewards,
        },
      }

      return result
    } else {
      throw new Error('No data received from API')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw new Error(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Handler function for API routes (if needed)
export default async function handler(req: any, res: any) {
  try {
    const data = await getStakePoolStats()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' })
  }
}
