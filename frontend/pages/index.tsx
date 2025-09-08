import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>CryptoTracker - Gerçek Zamanlı Kripto Para Fiyatları</title>
        <meta name="description" content="Gerçek zamanlı kripto para fiyatlarını ve piyasa verilerini takip edin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Kripto Paraları Gerçek Zamanlı Takip Edin
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Fiyatları izleyin, portföyünüzü yönetin ve en son piyasa trendlerinden haberdar olun
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/portfolio">
              <span className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                Portföyü Görüntüle
              </span>
            </Link>
            <Link href="/favorites">
              <span className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                Favorileri Gör
              </span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Portföy Takibi</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Kripto para yatırımlarınızı takip edin ve zaman içindeki performanslarını izleyin.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gerçek Zamanlı Güncellemeler</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bilgilendirilmiş işlem kararları almak için canlı fiyat güncellemeleri ve piyasa verileri alın.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Favoriler</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hızlı erişim ve izleme için favori kripto paralarınızı kaydedin.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Piyasadan Öne Geçin
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                CryptoTracker, kripto para piyasasını etkili bir şekilde izlemek için ihtiyacınız olan tüm araçları sunar. 
                Gerçek zamanlı veriler, portföy takibi ve özelleştirilebilir uyarılarla hiçbir fırsatı kaçırmayacaksınız.
              </p>
              <Link href="/coins">
                <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                  Tüm kripto paraları görüntüle
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/market_trends.png" 
                alt="Piyasa Trendleri" 
                className="rounded-lg shadow-md w-full h-auto max-h-80 object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <p>CryptoTracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}