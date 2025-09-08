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
    market_cap: 528000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 570000000000,
    total_volume: 12000000000,
    high_24h: 27500,
    low_24h: 26800,
    price_change_24h: 350,
    price_change_percentage_24h: 1.31,
    market_cap_change_24h: 6800000000,
    market_cap_change_percentage_24h: 1.31,
    circulating_supply: 19450000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69045,
    ath_change_percentage: -60.65,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 39920.83,
    atl_date: "2013-07-06T00:00:00.000Z",
    roi: null,
    last_updated: "2023-06-01T12:00:00.000Z",
    price_change_percentage_24h_in_currency: 1.31
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    current_price: 1680,
    market_cap: 202000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 202000000000,
    total_volume: 6500000000,
    high_24h: 1700,
    low_24h: 1650,
    price_change_24h: -20,
    price_change_percentage_24h: -1.18,
    market_cap_change_24h: -2400000000,
    market_cap_change_percentage_24h: -1.18,
    circulating_supply: 120200000,
    total_supply: 120200000,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -65.57,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 387800,
    atl_date: "2015-10-20T00:00:00.000Z",
    roi: {
      times: 84.05,
      currency: "btc",
      percentage: 8405.06
    },
    last_updated: "2023-06-01T12:00:00.000Z",
    price_change_percentage_24h_in_currency: -1.18
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
    current_price: 0.25,
    market_cap: 8900000000,
    market_cap_rank: 8,
    fully_diluted_valuation: 13500000000,
    total_volume: 250000000,
    high_24h: 0.255,
    low_24h: 0.245,
    price_change_24h: 0.005,
    price_change_percentage_24h: 2.04,
    market_cap_change_24h: 180000000,
    market_cap_change_percentage_24h: 2.04,
    circulating_supply: 35600000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -91.91,
    ath_date: "2021-09-02T06:00:15.325Z",
    atl: 0.01949332,
    atl_change_percentage: 1180.43,
    atl_date: "2020-03-13T02:29:59.003Z",
    roi: null,
    last_updated: "2023-06-01T12:00:00.000Z",
    price_change_percentage_24h_in_currency: 2.04
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
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 429) {
        // Return demo data when rate limit is exceeded
        res.status(200).json(demoCoins);
      } else {
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
      }
    } else {
      // Return demo data when there's a network error
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
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
      }
    } else {
      res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
  }
});

export default router;