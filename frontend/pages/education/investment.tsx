import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Head from 'next/head';

export default function InvestmentEducation() {
  const [darkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Güvenli Kripto Yatırımı | CryptoTracker</title>
        <meta name="description" content="Kripto yatırımlarında güvenlik önlemleri ve dolandırıcılıktan korunma yolları." />
      </Head>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Güvenli Kripto Yatırımı</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                Kripto para yatırımları büyük kazançlar sağlarken aynı zamanda önemli riskler de taşıyabilir. Güvenli yatırım yapmak için bazı temel prensipleri ve güvenlik önlemlerini bilmek çok önemlidir.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Temel Güvenlik Önlemleri</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Güvenilir Cüzdanlar Kullanın:</strong> Varlıklarınızı saklamak için güvenilir donanım cüzdanları (Ledger, Trezor) veya iyi bilinen yazılım cüzdanlarını tercih edin.</li>
                <li className="mb-2"><strong>İki Faktörlü Kimlik Doğrulama (2FA):</strong> Hesaplarınıza 2FA ekleyerek ekstra güvenlik katmanı oluşturun.</li>
                <li className="mb-2"><strong>Gizli Anahtarlarınızı Güvende Tutun:</strong> Gizli anahtarlarınızı ve kurtarma ifadelerinizi kimseyle paylaşmayın ve çevrimdışı güvenli bir yerde saklayın.</li>
                <li className="mb-2"><strong>Dikkatli Borsa Seçimi:</strong> Düzenlenmiş ve iyi bilinen borsaları tercih edin. Borsanın güvenlik geçmişini araştırın.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Dolandırıcılıktan Korunma Yolları</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Çok Güzel Görünen Fırsatlara Dikkat:</strong> "Garanti kazanç" vaat eden yatırım fırsatlarından uzak durun. Hatırlatma: Çok yüksek kazanç vaat eden yatırımlar genellikle dolandırıcılıktır.</li>
                <li className="mb-2"><strong>Resmi Kaynakları Kontrol Edin:</strong> Yatırım yapmadan önce projenin resmi web sitesini, whitepaper'ını ve sosyal medya hesaplarını kontrol edin.</li>
                <li className="mb-2"><strong>Kimlik Doğrulama:</strong> İletişim kurduğunuz kişinin gerçekten ilgili kişi/proje temsilcisi olduğundan emin olun.</li>
                <li className="mb-2"><strong>Phishing Bağlantılardan Sakının:</strong> E-posta veya mesajlarla gönderilen şüpheli bağlantıları açmayın. Doğrudan resmi sitelere gidin.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Yatırım Stratejileri</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Dolar Maliyet Ortalaması (DCA):</strong> Büyük miktarları tek seferde değil, zamanla yatırım yaparak ortalama maliyeti düşürün.</li>
                <li className="mb-2"><strong>Portföy Dağılımı:</strong> Tüm paranızı tek bir kripto paraya yatırmayın. Farklı projelere ve varlık sınıflarına dağıtın.</li>
                <li className="mb-2"><strong>Uzun Vadeli Yaklaşım:</strong> Kripto para piyasaları çok volatil olduğu için uzun vadeli yatırım yapmak genellikle daha az risklidir.</li>
                <li className="mb-2"><strong>Düzenli Takip:</strong> Yatırımlarınızı düzenli olarak takip edin ama duygusal tepkilere göre yatırım yapmayın.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Risk Yönetimi</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Sadece Kaybedebileceğiniz Parayla Yatırım Yapın:</strong> Kripto para yatırımlarında kaybetmeyi göze alamayacağınız paralarla yatırım yapmayın.</li>
                <li className="mb-2"><strong>Stop-Loss Emirleri:</strong> Büyük düşüşlerde otomatik satış emirleri kullanarak kayıplarınızı sınırlayın.</li>
                <li className="mb-2"><strong>Düzenli Kar Alma:</strong> Kazançlarınızdan bir kısmını düzenli olarak realizasyon yaparak kar edin.</li>
                <li className="mb-2"><strong>Emotional Trading'den Kaçının:</strong> Panik satım veya açgözlü alım satımlardan kaçının. Planlı ve disiplinli yatırım yapın.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Eğitim ve Araştırma</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Sürekli Öğrenin:</strong> Kripto para dünyası hızla değişiyor. Yeni teknolojileri ve trendleri takip edin.</li>
                <li className="mb-2"><strong>Teknik ve Temel Analiz:</strong> Yatırım kararlarınızı vermeden önce hem teknik hem de temel analiz yapın.</li>
                <li className="mb-2"><strong>Topluluklara Katılın:</strong> Güvenilir kripto para forumları ve topluluklarına katılarak bilgi alışverişinde bulunun.</li>
                <li className="mb-2"><strong>Uzman Görüşlerini Takip Edin:</strong> Alanında uzman kişilerin analiz ve görüşlerini takip edin ama kendi araştırmanızı yapın.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Sonuç</h2>
              
              <p className="mb-4">
                Kripto para yatırımları, doğru bilgi ve güvenlik önlemleriyle daha güvenli hale getirilebilir. Ancak unutmayın ki hiçbir yatırım %100 risksiz değildir. Yatırım yapmadan önce kendi risk toleransınızı değerlendirin ve sadece anlayabileceğiniz yatırım araçlarıyla çalışın.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Geri Dön
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}