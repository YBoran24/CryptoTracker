import express, { Request, Response, Router } from 'express';
import { getTopCoins, getCoinById, getCoinMarketChart } from '../services/coingecko';

const router: Router = express.Router();

// Fallback demo data for when CoinGecko API is not available
const demoCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    current_price: 27150,
    price_change_percentage_24h: 1.31,
    market_cap: 528000000000,
    total_volume: 12000000000
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    current_price: 1680,
    price_change_percentage_24h: -1.18,
    market_cap: 202000000000,
    total_volume: 6500000000
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
    current_price: 0.25,
    price_change_percentage_24h: 2.04,
    market_cap: 8900000000,
    total_volume: 250000000
  }
];

// Get all coins
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 100;
    
    const coins = await getTopCoins(page, perPage);
    
    res.status(200).json(coins);
  } catch (error: any) {
    console.error('Error in /coins route:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Stack trace:', error.stack);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 429) {
        // Return demo data when rate limit is exceeded
        res.status(200).json(demoCoins);
      } else {
        res.status(500).json({ 
          message: 'Sunucu hatası oluştu',
          error: error.message || 'Unknown error',
          status: error.response.status
        });
      }
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      // Network error - return demo data as fallback
      console.error('Network error, returning demo data');
      res.status(200).json(demoCoins);
    } else {
      // Other errors - return demo data as fallback
      console.error('Other error, returning demo data');
      res.status(200).json(demoCoins);
    }
  }
});

// Get coin by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get coin data
    const coinData = await getCoinById(id);
    
    // Get market chart data for the last 7 days
    const chartData = await getCoinMarketChart(id, 7);
    
    res.status(200).json({
      ...coinData,
      market_chart: chartData
    });
  } catch (error: any) {
    console.error(`Error in /coins/${req.params.id} route:`);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Stack trace:', error.stack);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 404) {
        res.status(404).json({ message: 'Kripto para bulunamadı' });
      } else if (error.response.status === 429) {
        res.status(429).json({ 
          message: 'API rate limit aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.',
          retryAfter: error.response.headers['retry-after']
        });
      } else {
        res.status(500).json({ 
          message: 'Sunucu hatası oluştu',
          error: error.message || 'Unknown error',
          status: error.response.status
        });
      }
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
      // Network error
      res.status(503).json({ 
        message: 'Harici API şu anda erişilemiyor. Lütfen daha sonra tekrar deneyin.',
        error: error.message || 'Network error'
      });
    } else {
      res.status(500).json({ 
        message: 'Sunucu hatası oluştu',
        error: error.message || 'Unknown error'
      });
    }
  }
});

export default router;