import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coin } from '@/types';
import { userAPI } from '@/services/api';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';

interface CoinTableProps {
  coins: Coin[];
  favorites?: string[]; // Optional favorites list from parent
  onFavoritesChange?: (favorites: string[]) => void; // Callback for favorites change
}

export default function CoinTable({ coins, favorites: externalFavorites, onFavoritesChange }: CoinTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin; direction: 'asc' | 'desc' } | null>(null);
  const [internalFavorites, setInternalFavorites] = useState<string[]>([]);
  const { addNotification } = useNotification();
  const { isAuthenticated } = useAuth();

  // Use external favorites if provided, otherwise use internal state
  const favorites = externalFavorites || internalFavorites;

  // Load favorites from localStorage on component mount (only if not provided externally)
  useEffect(() => {
    if (!externalFavorites) {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          setInternalFavorites(JSON.parse(savedFavorites));
        } catch (e) {
          console.error('Failed to parse favorites from localStorage', e);
        }
      }
    }
  }, [externalFavorites]);

  const handleSort = (key: keyof Coin) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCoins = () => {
    if (!sortConfig) return coins;
    
    return [...coins].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
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
    // Handle zero values specifically
    if (value === 0) {
      return '0.00%';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPercentageColor = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return 'text-gray-500';
    }
    if (value === 0) {
      return 'text-gray-500'; // Neutral color for zero values
    }
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  const toggleFavorite = async (coinId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      addNotification('Favorilere eklemek için giriş yapmalısınız', 'error');
      return;
    }

    try {
      const isFavorite = favorites.includes(coinId);
      
      if (isFavorite) {
        // Remove from favorites
        await userAPI.removeFavorite(coinId);
        
        if (externalFavorites && onFavoritesChange) {
          // Notify parent component
          const newFavorites = externalFavorites.filter(id => id !== coinId);
          onFavoritesChange(newFavorites);
        } else {
          // Update internal state
          const newFavorites = internalFavorites.filter(id => id !== coinId);
          setInternalFavorites(newFavorites);
          localStorage.setItem('favorites', JSON.stringify(newFavorites));
        }
      } else {
        // Add to favorites
        await userAPI.addFavorite(coinId);
        
        if (externalFavorites && onFavoritesChange) {
          // Notify parent component
          const newFavorites = [...externalFavorites, coinId];
          onFavoritesChange(newFavorites);
        } else {
          // Update internal state
          const newFavorites = [...internalFavorites, coinId];
          setInternalFavorites(newFavorites);
          localStorage.setItem('favorites', JSON.stringify(newFavorites));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Fallback to localStorage only for non-authenticated users
      const isFavorite = favorites.includes(coinId);
      let newFavorites;
      
      if (isFavorite) {
        newFavorites = favorites.filter(id => id !== coinId);
      } else {
        newFavorites = [...favorites, coinId];
      }
      
      if (externalFavorites && onFavoritesChange) {
        // Notify parent component
        onFavoritesChange(newFavorites);
      } else {
        // Update internal state
        setInternalFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Kripto Para
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('current_price')}
            >
              Fiyat
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('price_change_percentage_24h')}
            >
              24s %
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('market_cap')}
            >
              Piyasa Değeri
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedCoins().map((coin) => (
            <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(coin.current_price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <span className={getPercentageColor(coin.price_change_percentage_24h)}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(coin.market_cap)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => toggleFavorite(coin.id)}
                    className={`p-1 rounded-full ${favorites.includes(coin.id) ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    aria-label={favorites.includes(coin.id) ? "Favorilerden çıkar" : "Favorilere ekle"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d={favorites.includes(coin.id) 
                        ? "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
                        : "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"} />
                    </svg>
                  </button>
                  <Link href={`/coin/${coin.id}`}>
                    <span className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 cursor-pointer">
                      Detayları Gör
                    </span>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}