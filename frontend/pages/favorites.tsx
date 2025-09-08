import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Coin } from '@/types';
import CoinTable from '@/components/CoinTable';
import Navbar from '@/components/Navbar';
import { userAPI, coinsAPI } from '@/services/api';

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's favorites
      const favoritesResponse = await userAPI.getFavorites();
      const favoriteIds = favoritesResponse.data;
      setFavorites(favoriteIds);
      
      // If user has favorites, fetch coin details
      if (favoriteIds.length > 0) {
        const coinsResponse = await coinsAPI.getAllCoins();
        const allCoins: Coin[] = coinsResponse.data;
        
        // Filter coins to only include favorites
        const favoriteCoins = allCoins.filter((coin: Coin) => favoriteIds.includes(coin.id));
        setCoins(favoriteCoins);
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      
      // Redirect to login if unauthorized
      if (err.response?.status === 401) {
        router.push('/login');
        return;
      }
      
      setError('Favoriler alınamadı: ' + (err.response?.data?.message || 'Bilinmeyen hata'));
      setLoading(false);
    }
  };

  const handleFavoritesChange = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    
    // Refetch coin data to update the table
    fetchFavorites();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Favoriler</h1>

        {error ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={fetchFavorites}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        ) : coins.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Henüz favori yok</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Burada takip etmek için kripto paraları favorilerinize ekleyin</p>
            <a 
              href="/coins"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Kripto Paraları Keşfet
            </a>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <CoinTable 
              coins={coins} 
              favorites={favorites}
              onFavoritesChange={handleFavoritesChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}