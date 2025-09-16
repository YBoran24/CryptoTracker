import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import CoinTable from '@/components/CoinTable';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import { coinsAPI, userAPI } from '@/services/api';
import { Coin } from '@/types';

export default function Coins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isAutoRetrying, setIsAutoRetrying] = useState(false);

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coinsAPI.getAllCoins();
      
      // Check if we got a 429 status
      if (response.status === 429) {
        setError('API rate limit aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
      } else {
        setCoins(response.data || []);
        setFilteredCoins(response.data || []);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching coins:', err);
      
      // More detailed error handling
      if (err.response) {
        if (err.response.status === 429) {
          setError('API rate limit aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
        } else if (err.response.status === 500) {
          setError(`Sunucu hatası oluştu: ${err.response.data?.message || err.response.data?.error || 'Bilinmeyen sunucu hatası'}`);
        } else if (err.response.status === 503) {
          setError(`Hizmet kullanılamıyor: ${err.response.data?.message || 'Harici API şu anda erişilemiyor'}`);
        } else {
          setError(`Kripto paralar verisi alınamadı: ${err.response.data?.message || err.response.data?.error || 'Bilinmeyen hata'}`);
        }
      } else if (err.request) {
        // Network error (no response received)
        setError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.');
      } else {
        setError(`Kripto paralar verisi alınamadı: ${err.message || 'Bilinmeyen hata'}`);
      }
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await userAPI.getFavorites();
      setFavorites(response.data);
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      // If it's a 401 error (unauthorized), it means the user is not logged in
      // In this case, we just set favorites to an empty array
      if (err.response?.status === 401) {
        setFavorites([]);
      } else {
        // For other errors, fallback to localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          try {
            setFavorites(JSON.parse(savedFavorites));
          } catch (e) {
            console.error('Failed to parse favorites from localStorage', e);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchCoins();
    fetchFavorites();
  }, [fetchCoins, fetchFavorites]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Auto retry after 60 seconds if there's a rate limit error
    if (error && error.includes('rate limit') && retryCount < 3 && !isAutoRetrying) {
      setIsAutoRetrying(true);
      timer = setTimeout(() => {
        handleRetry();
      }, 60000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [error, retryCount, isAutoRetrying]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsAutoRetrying(false);
    fetchCoins();
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter(coin => 
        (coin.name && coin.name.toLowerCase().includes(query.toLowerCase())) || 
        (coin.symbol && coin.symbol.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredCoins(filtered);
    }
  };

  const handleFavoritesChange = (newFavorites: string[]) => {
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kripto Paralar</h1>
          <div className="w-full md:w-64">
            <SearchBar onSearch={handleSearch} placeholder="Kripto paraları ara..." />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Piyasa Genel Bakışı</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <p>{error}</p>
                {error.includes('Bilinmeyen hata') && (
                  <p className="text-sm mt-2">Lütfen backend sunucunuzun çalıştığını ve doğru şekilde yapılandırıldığını kontrol edin.</p>
                )}
              </div>
              <div className="flex flex-col items-center">
                <button 
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={isAutoRetrying}
                >
                  {isAutoRetrying ? 'Otomatik Yeniden Deneniyor...' : 'Tekrar Dene'}
                </button>
                {error.includes('rate limit') && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {isAutoRetrying 
                      ? `Otomatik yeniden deneme: ${60} saniye` 
                      : `Otomatik yeniden deneme: ${3 - retryCount} deneme hakkınız kaldı`}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <CoinTable 
              coins={filteredCoins} 
              favorites={favorites}
              onFavoritesChange={handleFavoritesChange}
            />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 dark:text-gray-400">
        <p>CryptoTracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}