import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import Link from 'next/link';
import { newsAPI } from '@/services/news';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
  content?: string; // Added missing content property
}

interface EducationArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [educationArticles, setEducationArticles] = useState<EducationArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'education'>('news');
  const [error, setError] = useState<string | null>(null);
  const [newsFilter, setNewsFilter] = useState<'hot' | 'trending' | 'rising' | 'recent'>('hot');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch news
        const newsResponse = await newsAPI.getNews(newsFilter);
        
        // Check if we have an error message with the mock data
        if (newsResponse.error) {
          setError(newsResponse.error);
        }
        
        setNews(newsResponse.data);
        
        // Create mock education articles directly instead of calling non-existent API function
        const mockEducationArticles: EducationArticle[] = [
          {
            id: '1',
            title: 'Kripto Para Nedir?',
            description: 'Kripto paraların ne olduğunu, nasıl çalıştığını ve neden önemli olduğunu öğrenin.',
            url: '/education/cryptocurrency',
            source: 'CryptoGuide',
            publishedAt: '2023-06-01T08:00:00Z',
            category: 'beginner'
          },
          {
            id: '2',
            title: 'Güvenli Yatırım',
            description: 'Kripto yatırımlarında güvenlik önlemleri ve dolandırıcılıktan korunma yolları.',
            url: '/education/investment',
            source: 'InvestSecure',
            publishedAt: '2023-06-10T16:30:00Z',
            category: 'advanced'
          },
          {
            id: '3',
            title: 'Blockchain Teknolojisi',
            description: 'Blockchain teknolojisinin temellerini ve uygulamalarını keşfedin.',
            url: '/education/blockchain',
            source: 'TechExplained',
            publishedAt: '2023-06-05T12:00:00Z',
            category: 'intermediate'
          }
        ];
        setEducationArticles(mockEducationArticles);
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        // More detailed error message
        let errorMessage = 'Veriler yüklenirken bir hata oluştu';
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'API anahtarı geçersiz veya yetkisiz erişim';
          } else if (err.response.status === 403) {
            errorMessage = 'API istek sınırı aşıldı';
          } else if (err.response.status === 429) {
            errorMessage = 'Çok fazla istek gönderildi, lütfen biraz bekleyin';
          } else if (err.response.status >= 500) {
            errorMessage = 'Sunucu hatası, lütfen daha sonra tekrar deneyin';
          } else {
            errorMessage = `API hatası: ${err.response.status} - ${err.response.statusText}`;
          }
        } else if (err.request) {
          errorMessage = 'API\'ye bağlantı kurulamadı, lütfen internet bağlantınızı kontrol edin';
        } else {
          errorMessage = `Hata: ${err.message || 'Bilinmeyen hata'}`;
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, [newsFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (filter: 'hot' | 'trending' | 'rising' | 'recent') => {
    setNewsFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Haberler ve Eğitim | CryptoTracker</title>
        <meta name="description" content="Kripto para haberleri ve eğitim içerikleri" />
      </Head>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Haberler ve Eğitim</h1>
        
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'news'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Kripto Haberleri
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'education'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Eğitim İçerikleri
            </button>
          </nav>
        </div>
        
        {activeTab === 'news' && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('hot')}
              className={`px-3 py-1 rounded-full text-sm ${
                newsFilter === 'hot'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Popüler
            </button>
            <button
              onClick={() => handleFilterChange('trending')}
              className={`px-3 py-1 rounded-full text-sm ${
                newsFilter === 'trending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Trend
            </button>
            <button
              onClick={() => handleFilterChange('rising')}
              className={`px-3 py-1 rounded-full text-sm ${
                newsFilter === 'rising'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Yükselen
            </button>
            <button
              onClick={() => handleFilterChange('recent')}
              className={`px-3 py-1 rounded-full text-sm ${
                newsFilter === 'recent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              En Yeni
            </button>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Hata! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === 'news' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.source}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.publishedAt)}</span>
                  </div>
                  <Link href={`/news/${item.id}`} className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                    Devamını oku
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationArticles.map((article) => (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                    {article.id === '1' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ) : article.id === '2' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{article.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {article.description}
                </p>
                <Link href={article.url} className="text-blue-600 dark:text-blue-400 hover:underline">
                  Okumaya başla
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}