import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { PortfolioItem, Coin } from '@/types';
import Navbar from '@/components/Navbar';
import { userAPI, coinsAPI } from '@/services/api';

export default function Portfolio() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    coinId: '',
    amount: '',
    purchasePrice: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false);
  const [removingCoinId, setRemovingCoinId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCoinDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchPortfolio();
    fetchCoins();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPortfolio();
      setPortfolio(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching portfolio:', error);
      
      // Redirect to login if unauthorized
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      
      setLoading(false);
    }
  };

  const fetchCoins = async () => {
    try {
      // Get top coins to have real data for display
      const response = await coinsAPI.getAllCoins();
      // Tüm coinleri göstermek için filtrelemeyi kaldırıyoruz
      setCoins(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching coins:', error);
      // Hata durumunda demo verileri göster
      const demoCoins: Coin[] = [
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
        },
        {
          id: "solana",
          symbol: "sol",
          name: "Solana",
          image: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
          current_price: 22.50,
          price_change_percentage_24h: 3.25,
          market_cap: 9500000000,
          total_volume: 1200000000
        },
        {
          id: "ripple",
          symbol: "xrp",
          name: "Ripple",
          image: "https://assets.coingecko.com/coins/images/44/large/xrp.png?1606030663",
          current_price: 0.50,
          price_change_percentage_24h: 0.75,
          market_cap: 27000000000,
          total_volume: 450000000
        }
      ];
      setCoins(demoCoins);
      setError('Kripto para verileri şu anda alınamıyor. Demo veriler gösteriliyor.');
    } finally {
      setLoading(false);
    }
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

  const getCoinById = (id: string) => {
    return coins.find(coin => coin.id === id);
  };

  const calculateCurrentValue = (item: PortfolioItem) => {
    const coin = getCoinById(item.coinId);
    return coin && coin.current_price !== undefined ? item.amount * coin.current_price : 0;
  };

  const calculateProfitLoss = (item: PortfolioItem) => {
    const currentValue = calculateCurrentValue(item);
    const purchaseValue = item.amount * item.purchasePrice;
    return currentValue - purchaseValue;
  };

  const calculateProfitLossPercentage = (item: PortfolioItem) => {
    const profitLoss = calculateProfitLoss(item);
    const purchaseValue = item.amount * item.purchasePrice;
    
    // Prevent division by zero
    if (purchaseValue === 0) {
      return 0;
    }
    
    return (profitLoss / purchaseValue) * 100;
  };

  const getTotalPortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      return total + calculateCurrentValue(item);
    }, 0);
  };

  const getTotalProfitLoss = () => {
    return portfolio.reduce((total, item) => {
      return total + calculateProfitLoss(item);
    }, 0);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = {
        coinId: newItem.coinId,
        amount: parseFloat(newItem.amount),
        purchasePrice: parseFloat(newItem.purchasePrice)
      };
      
      await userAPI.addToPortfolio(itemData);
      await fetchPortfolio(); // Refresh portfolio
      setShowAddForm(false);
      setNewItem({ coinId: '', amount: '', purchasePrice: '' });
    } catch (error) {
      console.error('Error adding to portfolio:', error);
    }
  };

  // Add this function to handle removing items from portfolio
  const handleRemoveItem = async (coinId: string) => {
    try {
      setRemovingCoinId(coinId); // Set loading state
      await userAPI.removeFromPortfolio(coinId);
      await fetchPortfolio(); // Refresh portfolio
    } catch (error) {
      console.error('Error removing from portfolio:', error);
    } finally {
      setRemovingCoinId(null); // Reset loading state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Coin arama fonksiyonu
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Portföyüm</h1>
        
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Portföy Özeti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Toplam Değer</h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(getTotalPortfolioValue())}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Toplam Kar/Zarar</h2>
            <p className={`text-2xl font-bold ${getTotalProfitLoss() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(getTotalProfitLoss())}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Kar/Zarar %</h2>
            <p className={`text-2xl font-bold ${getTotalProfitLoss() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {getTotalPortfolioValue() > 0 
                ? `${((getTotalProfitLoss() / (getTotalPortfolioValue() - getTotalProfitLoss())) * 100).toFixed(2)}%` 
                : '0.00%'}
            </p>
          </div>
        </div>

        {/* Portföy Ekleme Formu */}
        <div className="mb-6">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showAddForm ? 'İptal' : 'Varlık Ekle'}
          </button>
          
          {showAddForm && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Yeni Varlık Ekle</h2>
              
              {/* Arama kutusu */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kripto Para Ara
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Kripto para adı veya sembolü girin..."
                />
              </div>
              
              <form onSubmit={handleAddItem}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kripto Para
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <div 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-800 cursor-pointer flex justify-between items-center"
                        onClick={() => setIsCoinDropdownOpen(!isCoinDropdownOpen)}
                      >
                        <span className="truncate">
                          {newItem.coinId ? 
                            (() => {
                              const selectedCoin = coins.find(coin => coin.id === newItem.coinId);
                              return selectedCoin ? `${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()})` : 'Seçiniz';
                            })() : 
                            'Seçiniz'
                          }
                        </span>
                        <svg className={`transform transition-transform ${isCoinDropdownOpen ? 'rotate-180' : ''} fill-current h-4 w-4 text-gray-700 dark:text-gray-300`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                      
                      {isCoinDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Kripto para ara..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-2"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {filteredCoins.length > 0 ? (
                              filteredCoins.map(coin => (
                                <div
                                  key={coin.id}
                                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                                    newItem.coinId === coin.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewItem({...newItem, coinId: coin.id});
                                    setIsCoinDropdownOpen(false);
                                  }}
                                >
                                  <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
                                  <span className="truncate">{coin.name} ({coin.symbol.toUpperCase()})</span>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                Kripto para bulunamadı
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Miktar
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newItem.amount}
                      onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alış Fiyatı (USD)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newItem.purchasePrice}
                      onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Portföy Kalemleri */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Varlıklarım</h2>
          </div>
          
          {portfolio.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Portföyünüz boş</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                İlk Varlığınızı Ekleyin
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Varlık
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Varlık Miktarı
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ort. Alış Fiyatı
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Güncel Fiyat
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Değer
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kar/Zarar
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {portfolio.map((item, index) => {
                    const coin = getCoinById(item.coinId);
                    if (!coin) return null;
                    
                    const currentValue = calculateCurrentValue(item);
                    const profitLoss = calculateProfitLoss(item);
                    const profitLossPercentage = calculateProfitLossPercentage(item);
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={coin.image} alt={coin.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{coin.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {item.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatCurrency(item.purchasePrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatCurrency(coin.current_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(currentValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className={profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {formatCurrency(profitLoss)} ({!isNaN(profitLossPercentage) ? profitLossPercentage.toFixed(2) : 'N/A'}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleRemoveItem(item.coinId)}
                            disabled={removingCoinId === item.coinId}
                            className={`px-3 py-1 rounded text-white text-sm ${
                              removingCoinId === item.coinId 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                          >
                            {removingCoinId === item.coinId ? 'Kaldırılıyor...' : 'Kaldır'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}