import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import { newsAPI } from '@/services/news';
import NewsComments from '@/components/NewsComments';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
  content?: string;
}

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchNewsDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Fetch the specific news item by ID
          const item = await newsAPI.getNewsById(id as string);
          setNewsItem(item);
          setLoading(false);
        } catch (err: any) {
          console.error('Error fetching news detail:', err);
          setError('Haber detayları yüklenirken bir hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
          setLoading(false);
        }
      };

      fetchNewsDetail();
    }
  }, [id]);

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

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{newsItem?.title || 'Haber Detayı'} | CryptoTracker</title>
        <meta name="description" content={newsItem?.description || 'Kripto para haberi'} />
      </Head>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Hata! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : newsItem ? (
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {newsItem.image && (
              <img 
                src={newsItem.image} 
                alt={newsItem.title} 
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{newsItem.title}</h1>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">{newsItem.source}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(newsItem.publishedAt)}</span>
              </div>
              
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: newsItem.content || newsItem.description }}
              />
              
              <NewsComments newsId={newsItem.id} />

            </div>
          </article>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Haber bulunamadı</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Aradığınız haber mevcut değil veya kaldırılmış olabilir.</p>
            <button 
              onClick={() => router.push('/news')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Haberlere Geri Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}