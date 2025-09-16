import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Coin } from '@/types';
import PriceAlert from '@/components/PriceAlert';
import Navbar from '@/components/Navbar';
import { coinsAPI, userAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface CoinDetailsProps {
  initialCoin: Coin;
  initialChartData?: any[];
}

export default function CoinDetails({ initialCoin, initialChartData }: CoinDetailsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [coin, setCoin] = useState<Coin>(initialCoin);
  const [chartData, setChartData] = useState<any[]>(initialChartData || []);
  const [loading, setLoading] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    amount: 1,
    purchasePrice: initialCoin.current_price || 0
  });
  const coinIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (router.isFallback) {
      return;
    }

    const fetchCoinData = async () => {
      try {
        setLoading(true);
        // Use router.query.id instead of coin.id to get the actual coin ID from the URL
        const response = await coinsAPI.getCoinById(router.query.id as string);
        
        // Map the API response to match our Coin interface
        const mappedCoin: Coin = {
          id: response.data.id,
          symbol: response.data.symbol,
          name: response.data.name,
          image: response.data.image,
          current_price: response.data.current_price,
          price_change_percentage_24h: response.data.price_change_percentage_24h,
          market_cap: response.data.market_cap,
          total_volume: response.data.total_volume
        };
        
        setCoin(mappedCoin);
        
        // Process chart data
        if (response.data.market_chart && response.data.market_chart.prices) {
          const formattedChartData = response.data.market_chart.prices.map((price: any) => ({
            time: new Date(price[0]).toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            price: price[1]
          }));
          setChartData(formattedChartData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coin data:', error);
        setLoading(false);
      }
    };

    // Only fetch data if we have a valid coin ID from router
    if (router.query.id) {
      // Check if coin ID has actually changed
      if (coinIdRef.current !== router.query.id) {
        coinIdRef.current = router.query.id as string;
        fetchCoinData();
      }
    }
  }, [router.query.id, router.isFallback]);

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await userAPI.addFavorite(coin.id);
      window.alert('Favorilere eklendi!');
    } catch (error: any) {
      console.error('Favoriye eklerken hata oluştu:', error);
      window.alert('Favoriye eklenemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleAddToPortfolio = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Set default purchase price to current price if not set
    setPortfolioData({
      amount: 1,
      purchasePrice: coin.current_price || 0
    });
    setShowPortfolioForm(true);
  };

  const handlePortfolioFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await userAPI.addToPortfolio({
        coinId: coin.id,
        amount: portfolioData.amount,
        purchasePrice: portfolioData.purchasePrice
      });
      window.alert('Portföye eklendi!');
      setShowPortfolioForm(false);
    } catch (error: any) {
      console.error('Portföye eklerken hata oluştu:', error);
      window.alert('Portföye eklenemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleSetAlert = (alertData: { coinId: string; targetPrice: number; direction: 'above' | 'below' }) => {
    // In a real implementation, you would send this to your backend
    console.log('Setting alert:', alertData);
    window.alert('Fiyat alarmı başarıyla ayarlandı!');
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return 'N/A';
    }
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return 'N/A';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPercentageColor = (value: number | undefined) => {
    // Return a neutral color for N/A values
    if (value === undefined || value === null) {
      return 'text-gray-500';
    }
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if coin data is available
  if (!coin || !coin.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Kripto Para Bulunamadı</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">İstenen kripto para bilgisi bulunamadı.</p>
          <button 
            onClick={() => router.push('/coins')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tüm Kripto Paralara Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Portfolio Form Modal */}
      {showPortfolioForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Portföye Ekle</h3>
                <button 
                  onClick={() => setShowPortfolioForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handlePortfolioFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kripto Para
                  </label>
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full mr-2" src={coin.image} alt={coin.name} />
                    <span className="text-gray-900 dark:text-white">{coin.name} ({coin.symbol?.toUpperCase()})</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Miktar
                  </label>
                  <input
                    type="number"
                    id="amount"
                    step="any"
                    min="0"
                    value={portfolioData.amount}
                    onChange={(e) => setPortfolioData({...portfolioData, amount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alış Fiyatı (USD)
                  </label>
                  <input
                    type="number"
                    id="purchasePrice"
                    step="any"
                    min="0"
                    value={portfolioData.purchasePrice}
                    onChange={(e) => setPortfolioData({...portfolioData, purchasePrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPortfolioForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Geri
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              {coin.image && (
                <img className="h-16 w-16 rounded-full" src={coin.image} alt={coin.name} />
              )}
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{coin.name || 'N/A'}</h1>
                <p className="text-gray-500 dark:text-gray-400">{coin.symbol?.toUpperCase() || 'N/A'}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(coin.current_price)}
              </p>
              <p className={`text-lg ${getPercentageColor(coin.price_change_percentage_24h)}`}>
                {formatPercentage(coin.price_change_percentage_24h)}
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip coin={coin} />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Piyasa İstatistikleri</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Piyasa Değeri</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(coin.market_cap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Hacim (24s)</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(coin.total_volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Fiyat Değişimi (24s)</span>
                  <span className={`font-medium ${getPercentageColor(coin.price_change_percentage_24h)}`}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">İşlemler</h2>
              <div className="space-y-4">
                <button 
                  onClick={handleAddToFavorites}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Favorilere Ekle
                </button>
                <button 
                  onClick={handleAddToPortfolio}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                >
                  Portföye Ekle
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PriceAlert 
              coinId={coin.id} 
              coinName={coin.name} 
              currentPrice={coin.current_price} 
              onSetAlert={handleSetAlert} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // For demo purposes, we'll pre-render a few popular coins
  const paths = [
    { params: { id: 'bitcoin' } },
    { params: { id: 'ethereum' } },
    { params: { id: 'cardano' } },
    { params: { id: 'solana' } },
    { params: { id: 'ripple' } },
  ];

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } means other routes will be rendered on-demand
  return { paths, fallback: 'blocking' };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    // Get coin data based on the id
    const coinId = params?.id as string;
    
    // Try to fetch real data from the API
    try {
      const response = await coinsAPI.getCoinById(coinId);
      
      // Process the API response
      const coinData: Coin = {
        id: response.data.id || coinId,
        symbol: response.data.symbol || '',
        name: response.data.name || coinId.charAt(0).toUpperCase() + coinId.slice(1),
        image: response.data.image || '',
        current_price: response.data.current_price !== undefined ? response.data.current_price : 0,
        price_change_percentage_24h: response.data.price_change_percentage_24h || 0,
        market_cap: response.data.market_cap || 0,
        total_volume: response.data.total_volume || 0
      };
      
      // Process chart data if available
      let chartData: any[] = [];
      if (response.data.market_chart && response.data.market_chart.prices) {
        chartData = response.data.market_chart.prices.map((price: any) => ({
          time: new Date(price[0]).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: price[1]
        }));
      }
      
      return {
        props: {
          initialCoin: coinData,
          initialChartData: chartData,
        },
        revalidate: 60, // Revalidate at most once every 60 seconds
      };
    } catch (apiError) {
      // If API fails, use fallback mock data
      console.warn('API request failed, using fallback data:', apiError);
      
      const mockCoin: Coin = {
        id: coinId,
        symbol: coinId.slice(0, 3),
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        image: `https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579`,
        current_price: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        total_volume: 0
      };
      
      return {
        props: {
          initialCoin: mockCoin,
          initialChartData: [],
        },
        revalidate: 60,
      };
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, coin }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
        <div className="flex items-center mb-2">
          {coin.image && (
            <img 
              src={coin.image} 
              alt={coin.name} 
              className="w-6 h-6 mr-2 rounded-full"
            />
          )}
          <p className="text-white font-medium">{coin.name || 'N/A'}</p>
        </div>
        <p className="text-gray-300">
          {`${label} : ${new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          }).format(payload[0].value)}`}
        </p>
      </div>
    );
  }

  return null;
};