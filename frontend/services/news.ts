import axios from 'axios';

// CryptoPanic API base URL (updated to the correct endpoint)
const CRYPTOPANIC_API_URL = 'https://cryptopanic.com/api/developer/v2';

// In a real application, you would store this in an environment variable
const CRYPTOPANIC_API_KEY = process.env.NEXT_PUBLIC_CRYPTOPANIC_API_KEY || 'YOUR_API_KEY_HERE';

// Create axios instance with default config
const api = axios.create({
  baseURL: CRYPTOPANIC_API_URL,
  timeout: 10000,
});

// Add API key to requests
api.interceptors.request.use((config) => {
  if (config.params) {
    config.params.auth_token = CRYPTOPANIC_API_KEY;
  } else {
    config.params = { auth_token: CRYPTOPANIC_API_KEY };
  }
  return config;
});

export const newsAPI = {
  // Fetch crypto news
  getNews: async (filter: string = 'hot', regions: string = 'en') => {
    try {
      console.log('Fetching news with params:', { filter, regions });
      const response = await api.get('/posts/', {
        params: {
          filter,
          regions,
        },
      });
      
      console.log('API response received:', response.status, response.data);
      
      // Check if response has the expected structure
      if (!response.data || !response.data.results) {
        throw new Error('API yanıtı beklenen yapıda değil');
      }
      
      // Process the response to match our interface
      const processedData = response.data.results.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.summary || item.title,
        url: item.url,
        source: item.source?.domain || 'Unknown',
        publishedAt: item.published_at,
        image: item.thumbnail || undefined,
      }));
      
      console.log('Processed data count:', processedData.length);
      return { data: processedData };
    } catch (error: any) {
      console.error('Error fetching news from CryptoPanic:', error);
      
      // Fallback to mock data when API is unavailable
      console.log('Using fallback mock data');
      const mockData = [
        {
          id: '1',
          title: 'Bitcoin 60.000 Doların Üzerine Çıktı',
          description: 'Bitcoin son 24 saatte %5 değer kazandı ve 60.000 doların üzerine çıktı. Uzmanlar bu yükselişin nedenlerini analiz ediyor.',
          url: 'https://example.com/bitcoin-news',
          source: 'CryptoNews',
          publishedAt: '2025-09-08T10:00:00Z',
          image: undefined
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Güncellemesi Yaklaşıyor',
          description: 'Ethereum\'un uzun zamandır beklenen 2.0 sürümü için hazırlıklar tamamlandı. Yeni güncelleme ile işlem ücretlerinin düşmesi bekleniyor.',
          url: 'https://example.com/ethereum-news',
          source: 'BlockchainToday',
          publishedAt: '2025-09-07T15:30:00Z',
          image: undefined
        },
        {
          id: '3',
          title: 'Yeni Regülasyonlar Kripto Piyasasını Etkiliyor',
          description: 'ABD\'de yeni kripto para regülasyonları piyasada tepkiyle karşılandı. Yatırımcılar bu gelişmeleri yakından takip ediyor.',
          url: 'https://example.com/regulation-news',
          source: 'FinanceDaily',
          publishedAt: '2025-09-06T09:15:00Z',
          image: undefined
        },
        {
          id: '4',
          title: 'Cardano Yeni İş Birliği Anlaşması İmzaladı',
          description: 'Cardano, Afrika\'daki bir teknoloji şirketiyle önemli bir iş birliği anlaşması imzaladı. Bu anlaşma ile platformun kullanım alanı genişleyecek.',
          url: 'https://example.com/cardano-news',
          source: 'TechCrypto',
          publishedAt: '2025-09-05T14:20:00Z',
          image: undefined
        },
        {
          id: '5',
          title: 'Solana Ağında Teknik Sorunlar Yaşandı',
          description: 'Solana\'da yaşanan teknik sorunlar nedeniyle ağ kısa süreliğine durdu. Geliştiriciler sorunun çözümü üzerinde çalışıyor.',
          url: 'https://example.com/solana-news',
          source: 'NetworkWatch',
          publishedAt: '2025-09-04T11:45:00Z',
          image: undefined
        },
        {
          id: '6',
          title: 'Ripple Yargı Kararını Bekliyor',
          description: 'Ripple ile SEC arasındaki davada mahkeme kararı yakında açıklanacak. Kararın kripto piyasasına etkisi büyük olabilir.',
          url: 'https://example.com/ripple-news',
          source: 'LegalCrypto',
          publishedAt: '2025-09-03T16:10:00Z',
          image: undefined
        }
      ];
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          return { data: mockData, error: 'API anahtarı geçersiz veya yetkisiz erişim' };
        } else if (error.response.status === 403) {
          return { data: mockData, error: 'API istek sınırı aşıldı' };
        } else if (error.response.status === 429) {
          return { data: mockData, error: 'Çok fazla istek gönderildi, lütfen biraz bekleyin' };
        } else if (error.response.status >= 500) {
          return { data: mockData, error: 'CryptoPanic sunucularında bir hata oluştu' };
        } else {
          return { data: mockData, error: `API hatası: ${error.response.status} - ${error.response.statusText}` };
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        return { data: mockData, error: 'CryptoPanic API\'ye bağlantı kurulamadı' };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        return { data: mockData, error: `İstek hazırlanırken hata oluştu: ${error.message}` };
      }
    }
  },
  
  // Fetch a specific news item by ID
  getNewsById: async (id: string) => {
    try {
      // First, get the news list to find the item
      const newsList = await newsAPI.getNews();
      const newsItem = newsList.data.find((item: any) => item.id === id);
      
      if (!newsItem) {
        throw new Error('Haber bulunamadı');
      }
      
      // Return the news item with extended content
      return {
        ...newsItem,
        content: `
          <p>${newsItem.description}</p>
          <p>Bu haber ${newsItem.source} tarafından ${new Date(newsItem.publishedAt).toLocaleDateString('tr-TR')} tarihinde yayınlandı.</p>
          <p>Haber içeriği burada detaylı olarak gösterilecektir. Gerçek bir uygulamada, bu içerik orijinal haber kaynağında bulunan tam metni içerecektir.</p>
          <p>Kripto para piyasaları sürekli olarak değişen dinamiklere sahiptir ve bu tür haberler yatırımcılar için kritik bilgiler sağlar.</p>
          <p>Yatırımcılar, bu tür haberleri dikkate alırken kendi araştırma ve analizlerini de yapmalıdırlar.</p>
        `
      };
    } catch (error: any) {
      console.error('Error fetching news by ID:', error);
      throw error;
    }
  },
  
  // Mock function for educational articles (would be replaced with actual content management)
  getEducationArticles: async () => {
    return Promise.resolve({
      data: [
        {
          id: '1',
          title: 'Kripto Para Nedir?',
          description: 'Kripto paraların ne olduğunu, nasıl çalıştığını ve neden önemli olduğunu öğrenin.',
          url: '#',
          source: 'CryptoGuide',
          publishedAt: '2023-06-01T08:00:00Z',
          category: 'beginner'
        },
        {
          id: '2',
          title: 'Blockchain Teknolojisi',
          description: 'Blockchain teknolojisinin temellerini ve uygulamalarını keşfedin.',
          url: '#',
          source: 'TechExplained',
          publishedAt: '2023-06-05T12:00:00Z',
          category: 'intermediate'
        },
        {
          id: '3',
          title: 'Güvenli Kripto Yatırımı',
          description: 'Kripto yatırımlarında güvenlik önlemleri ve dolandırıcılıktan korunma yolları.',
          url: '#',
          source: 'InvestSecure',
          publishedAt: '2023-06-10T16:30:00Z',
          category: 'advanced'
        }
      ]
    });
  }
};