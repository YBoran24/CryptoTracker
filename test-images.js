const axios = require('axios');

async function testCoinImages() {
  try {
    console.log('Testing CoinGecko API response...');
    
    // Test the CoinGecko API directly
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false
      }
    });
    
    console.log('First 5 coins from CoinGecko API:');
    response.data.slice(0, 5).forEach((coin, index) => {
      console.log(`${index + 1}. ${coin.name} (${coin.symbol}): ${typeof coin.image === 'string' ? coin.image : coin.image.large || coin.image.small || coin.image.thumb}`);
    });
    
    console.log('\nTesting backend API response...');
    
    // Test our backend API
    const backendResponse = await axios.get('http://localhost:5003/api/coins', {
      params: {
        per_page: 5
      }
    });
    
    console.log('First 5 coins from backend API:');
    backendResponse.data.slice(0, 5).forEach((coin, index) => {
      console.log(`${index + 1}. ${coin.name} (${coin.symbol}): ${coin.image}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCoinImages();