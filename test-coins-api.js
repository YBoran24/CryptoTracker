const axios = require('axios');

// Test the coins API endpoint
async function testCoinsAPI() {
  try {
    console.log('Testing coins API endpoint...');
    
    // Replace with your actual backend URL when deployed
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5003';
    const url = `${backendUrl}/api/coins`;
    
    console.log(`Making request to: ${url}`);
    
    const response = await axios.get(url);
    
    console.log('Response status:', response.status);
    console.log('Response data length:', response.data.length);
    console.log('First coin:', response.data[0]);
    
    if (response.status === 200) {
      console.log('✅ SUCCESS: Coins API is working correctly');
    } else {
      console.log('❌ ERROR: Unexpected status code', response.status);
    }
  } catch (error) {
    console.error('❌ ERROR: Failed to fetch coins data');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCoinsAPI();