import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Head from 'next/head';

export default function CryptocurrencyEducation() {
  const [darkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Kripto Para Nedir? | CryptoTracker</title>
        <meta name="description" content="Kripto paraların ne olduğunu, nasıl çalıştığını ve neden önemli olduğunu öğrenin." />
      </Head>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Kripto Para Nedir?</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                Kripto para, dijital veya sanal bir para birimidir ve geleneksel para birimlerinden farklı olarak merkezi bir otorite tarafından kontrol edilmez. Bunun yerine, kripto paralar blockchain adı verilen dağıtık defter teknolojisi kullanılarak çalışır.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Kripto Paranın Temel Özellikleri</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Merkezi Olmayan Yapı:</strong> Kripto paralar genellikle merkezi olmayan ağlar üzerinde çalışır. Bu, hiçbir hükümetin veya finansal kurumun doğrudan kontrolünde olmadığı anlamına gelir.</li>
                <li className="mb-2"><strong>Şifreleme:</strong> Kripto paraların adını şifreleme tekniklerinden alır. İşlemler şifrelenir ve blockchain üzerinde güvenli bir şekilde saklanır.</li>
                <li className="mb-2"><strong>Sınırlı Arz:</strong> Çoğu kripto paranın arzı sınırlıdır. Örneğin, Bitcoin'in maksimum arzı 21 milyon ile sınırlıdır.</li>
                <li className="mb-2"><strong>Şeffaflık:</strong> Blockchain üzerindeki tüm işlemler kamuya açıktır ve herkes tarafından görüntülenebilir.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Kripto Paralar Nasıl Çalışır?</h2>
              
              <p className="mb-4">
                Kripto paralar, blockchain teknolojisi üzerine inşa edilmiştir. Blockchain, işlemleri kaydeden ve doğrulayan bir dijital defterdir. Bu defter, ağdaki tüm bilgisayarlar arasında dağıtılmıştır ve her işlem tüm ağ tarafından doğrulanır.
              </p>
              
              <p className="mb-4">
                Bir işlem gerçekleştiğinde, ağdaki bilgisayarlar (düğümler) tarafından doğrulanır. Doğrulanan işlemler bloklar halinde zincire eklenir. Bu süreç, kripto paraların güvenli ve değiştirilemez olmasını sağlar.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Popüler Kripto Paralar</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Bitcoin (BTC):</strong> İlk ve en bilinen kripto paradır. 2009 yılında Satoshi Nakamoto tarafından yaratılmıştır.</li>
                <li className="mb-2"><strong>Ethereum (ETH):</strong> Akıllı sözleşmeleri destekleyen bir platformdur. Kendi kripto parası ETH ile birlikte çalışır.</li>
                <li className="mb-2"><strong>Ripple (XRP):</strong> Bankalar ve finansal kurumlar için ödeme çözümleri sunar.</li>
                <li className="mb-2"><strong>Litecoin (LTC):</strong> Bitcoin'in daha hızlı ve daha hafif bir versiyonudur.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Kripto Paraların Avantajları</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Düşük İşlem Ücretleri:</strong> Geleneksel bankacılık sistemlerine kıyasla genellikle daha düşük işlem ücretleri vardır.</li>
                <li className="mb-2"><strong>Hızlı ve Sınır Ötesi İşlemler:</strong> Uluslararası işlemler dakikalar içinde tamamlanabilir.</li>
                <li className="mb-2"><strong>Gizlilik:</strong> Kullanıcılar genellikle kişisel bilgilerini paylaşmadan işlem yapabilirler.</li>
                <li className="mb-2"><strong>Finansal Özgürlük:</strong> Herkes kripto para cüzdanı oluşturabilir ve kullanabilir.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Kripto Paraların Riskleri</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Fiyat Volatilitesi:</strong> Kripto paraların fiyatları çok değişkendir ve büyük kazançlar veya kayıplar olabilir.</li>
                <li className="mb-2"><strong>Düzenleyici Belirsizlik:</strong> Hükümetlerin yaklaşımı zaman içinde değişebilir.</li>
                <li className="mb-2"><strong>Güvenlik Riskleri:</strong> Cüzdanların güvenliği kullanıcıya bağlıdır. Kaybedilen erişim kurtarılamaz.</li>
                <li className="mb-2"><strong>Dolandırıcılık:</strong> Piyasada birçok sahte proje ve dolandırıcılık girişimi vardır.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Sonuç</h2>
              
              <p className="mb-4">
                Kripto paralar finans dünyasında devrim yaratmış ve geleneksel para anlayışını sarsmıştır. Ancak bu teknoloji hem fırsatlar hem de riskler sunar. Yatırım yapmadan önce dikkatli araştırma yapmak ve yalnızca anlayabileceğiniz kadar yatırım yapmak önemlidir.
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