import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Use the correct endpoint based on API key type
// For demo/normal API keys, use api.coingecko.com
// For Pro API keys, use pro-api.coingecko.com
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

// In-memory cache
const cache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 60000; // 1 minute cache

// Create axios instance with default config
const api = axios.create({
  baseURL: COINGECKO_API_URL,
  timeout: 15000, // Increased timeout
});

// Add API key to requests if available
api.interceptors.request.use((config) => {
  if (COINGECKO_API_KEY) {
    config.headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
  }
  return config;
});

// Check cache before making request
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Set data in cache
const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Helper function to extract image URL from image object
const extractImageUrl = (image: any): string => {
  if (typeof image === 'string') {
    return image;
  }
  if (image && typeof image === 'object') {
    return image.large || image.small || image.thumb || '';
  }
  return '';
};

// Helper function to safely extract numeric values
const extractNumericValue = (value: any): number | undefined => {
  // Check if value is null or undefined
  if (value === null || value === undefined) {
    return undefined;
  }
  
  // Check if value is NaN
  if (isNaN(value)) {
    return undefined;
  }
  
  // Convert to number if it's not already
  const numValue = typeof value === 'number' ? value : Number(value);
  
  // Check if the converted value is NaN
  if (isNaN(numValue)) {
    return undefined;
  }
  
  return numValue;
};

// Get top 100 cryptocurrencies
export const getTopCoins = async (page: number = 1, perPage: number = 100) => {
  try {
    const cacheKey = `coins_${page}_${perPage}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    
    // Process the response to ensure image is a string and numeric values are properly handled
    const processedData = response.data.map((coin: any) => ({
      id: coin.id || '',
      symbol: coin.symbol || '',
      name: coin.name || '',
      image: extractImageUrl(coin.image),
      current_price: extractNumericValue(coin.current_price),
      price_change_percentage_24h: extractNumericValue(coin.price_change_percentage_24h),
      market_cap: extractNumericValue(coin.market_cap),
      total_volume: extractNumericValue(coin.total_volume)
    }));
    
    // Cache the processed response
    setCachedData(cacheKey, processedData);
    
    return processedData;
  } catch (error: any) {
    console.error('Error fetching coins from CoinGecko:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Headers:', error.response?.headers);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Stack trace:', error.stack);
    
    // Throw a more descriptive error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      throw new Error('CoinGecko API is not accessible. Network error occurred.');
    }
    
    // For other errors, provide a generic message
    throw new Error('Failed to fetch cryptocurrency data from CoinGecko API.');
  }
};

// Get coin by ID
export const getCoinById = async (id: string) => {
  try {
    const cacheKey = `coin_${id}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    });
    
    // Extract market data safely
    const marketData = response.data.market_data || {};
    
    // Process the response to ensure image is a string and numeric values are properly handled
    const processedData = {
      id: response.data.id || id,
      symbol: response.data.symbol || '',
      name: response.data.name || '',
      image: extractImageUrl(response.data.image),
      current_price: extractNumericValue(marketData.current_price?.usd),
      price_change_percentage_24h: extractNumericValue(marketData.price_change_percentage_24h),
      market_cap: extractNumericValue(marketData.market_cap?.usd),
      total_volume: extractNumericValue(marketData.total_volume?.usd)
    };
    
    // Cache the processed response
    setCachedData(cacheKey, processedData);
    
    return processedData;
  } catch (error: any) {
    console.error(`Error fetching coin ${id} from CoinGecko:`);
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Headers:', error.response?.headers);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    // Throw a more descriptive error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      throw new Error(`CoinGecko API is not accessible for coin ${id}. Network error occurred.`);
    }
    
    // Re-throw the error so it can be handled by the calling function
    throw error;
  }
};

// Get coin market chart data
export const getCoinMarketChart = async (id: string, days: number = 7) => {
  try {
    const cacheKey = `chart_${id}_${days}`;
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days
      }
    });
    
    // Cache the response
    setCachedData(cacheKey, response.data);
    
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching market chart for ${id} from CoinGecko:`);
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Headers:', error.response?.headers);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    // Throw a more descriptive error
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      throw new Error(`CoinGecko API is not accessible for chart data of ${id}. Network error occurred.`);
    }
    
    // Re-throw the error so it can be handled by the calling function
    throw error;
  }
};

export default {
  getTopCoins,
  getCoinById,
  getCoinMarketChart
};