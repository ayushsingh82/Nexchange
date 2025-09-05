// Debug script to see what the API actually returns
async function debugApiResponse() {
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
    console.log('🔍 Debugging API response...');
    console.log('Request:', JSON.stringify(statsRequest, null, 2));
    
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
    
    console.log('\n📊 Raw API Response:');
    console.log('Type:', typeof data);
    console.log('Is Array:', Array.isArray(data));
    console.log('Length:', Array.isArray(data) ? data.length : 'N/A');
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('\n📋 First item structure:');
      console.log(JSON.stringify(data[0], null, 2));
      
      console.log('\n📋 Last item structure:');
      console.log(JSON.stringify(data[data.length - 1], null, 2));
      
      // Show available keys
      console.log('\n🔑 Available keys in first item:');
      console.log(Object.keys(data[0]));
    } else {
      console.log('\n📋 Response structure:');
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the debug function
debugApiResponse();
