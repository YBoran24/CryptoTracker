import { useState } from 'react';
import { PortfolioItem } from '@/types';

interface PortfolioFormProps {
  item?: PortfolioItem;
  onSubmit: (data: Omit<PortfolioItem, 'coinId'>) => void;
  onCancel: () => void;
  coinName: string;
}

export default function PortfolioForm({ item, onSubmit, onCancel, coinName }: PortfolioFormProps) {
  const [amount, setAmount] = useState(item?.amount.toString() || '');
  const [purchasePrice, setPurchasePrice] = useState(item?.purchasePrice.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && purchasePrice) {
      onSubmit({
        amount: parseFloat(amount),
        purchasePrice: parseFloat(purchasePrice)
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {item ? 'Düzenle' : 'Ekle'} {coinName} Portföye
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Miktar
          </label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Miktarı girin"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alış Fiyatı (USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Alış fiyatını girin"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {item ? 'Güncelle' : 'Portföye Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
}