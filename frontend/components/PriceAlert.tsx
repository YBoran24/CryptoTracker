import { useState } from 'react';

interface PriceAlertProps {
  coinId: string;
  coinName: string;
  currentPrice: number | undefined;
  onSetAlert: (alert: { coinId: string; targetPrice: number; direction: 'above' | 'below' }) => void;
}

export default function PriceAlert({ coinId, coinName, currentPrice, onSetAlert }: PriceAlertProps) {
  const [showForm, setShowForm] = useState(false);
  const [targetPrice, setTargetPrice] = useState(
    currentPrice !== undefined ? currentPrice.toString() : ''
  );
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (!isNaN(price) && price > 0) {
      onSetAlert({ coinId, targetPrice: price, direction });
      setShowForm(false);
      setTargetPrice(currentPrice !== undefined ? currentPrice.toString() : '');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fiyat Uyarıları</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {showForm ? 'İptal' : 'Uyarı Ayarla'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {coinName} fiyatı şu durumda uyar
            </label>
            <div className="flex space-x-2">
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'above' | 'below')}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="above">Üzerine çıktığında</option>
                <option value="below">Altına düştüğünde</option>
              </select>
              <input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={currentPrice !== undefined ? `Güncel: ${currentPrice}` : "Hedef fiyat"}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={currentPrice === undefined}
            >
              Uyarı Ayarla
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          {currentPrice !== undefined 
            ? `${coinName} belirlediğiniz hedef fiyata ulaştığında bildirim alın. Güncel fiyat: ${currentPrice}`
            : `${coinName} için fiyat bilgisi mevcut değil.`
          }
        </p>
      )}
    </div>
  );
}