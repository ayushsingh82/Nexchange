export default async function handler(req, res) {
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
  
        res.status(200).json(camelCaseData)
      } else {
        res.status(200).json(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      res.status(500).json({ message: `Error fetching data: ${error.message}` })
    }
  }
  