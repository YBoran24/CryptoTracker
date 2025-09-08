import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Head from 'next/head';

export default function BlockchainEducation() {
  const [darkMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Blockchain Teknolojisi | CryptoTracker</title>
        <meta name="description" content="Blockchain teknolojisinin temellerini ve uygulamalarını keşfedin." />
      </Head>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Blockchain Teknolojisi</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p className="mb-4">
                Blockchain, kripto paraların temelini oluşturan devrim niteliğinde bir teknolojidir. Bu teknoloji sadece finans sektöründe değil, birçok farklı alanda da uygulama bulmuştur. Blockchain'in ne olduğunu, nasıl çalıştığını ve potansiyel uygulama alanlarını inceleyelim.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain Nedir?</h2>
              
              <p className="mb-4">
                Blockchain, dijital bilgilerin saklandığı ve dağıtıldığı, merkezi olmayan bir dijital defter teknolojisidir. Bu teknoloji sayesinde işlemler şeffaf, güvenli ve değiştirilemez bir şekilde kaydedilir.
              </p>
              
              <p className="mb-4">
                "Blockchain" terimi, bu teknolojinin yapısını tanımlar: "Block" (blok) ve "chain" (zincir) kelimelerinin birleşiminden oluşur. Her blok, bir dizi işlemi içerir ve bu bloklar kronolojik sırayla birbirine bağlanır, böylece bir zincir oluşturur.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain Nasıl Çalışır?</h2>
              
              <ol className="list-decimal pl-6 mb-4">
                <li className="mb-2"><strong>İşlem Oluşturma:</strong> Bir işlem başlatılır (örneğin, A kişisi B kişisine kripto para gönderir).</li>
                <li className="mb-2"><strong>İşlem Doğrulama:</strong> Ağdaki düğümler tarafından işlemin geçerliliği kontrol edilir.</li>
                <li className="mb-2"><strong>Blok Oluşturma:</strong> Onaylanan işlemler yeni bir blok içinde toplanır.</li>
                <li className="mb-2"><strong>Blok Doğrulama:</strong> Yeni blok, kriptografik bir işlemle önceki blokla bağlanarak ağa gönderilir.</li>
                <li className="mb-2"><strong>Blok Kabulü:</strong> Ağdaki diğer düğümler yeni bloğu doğrular ve blok zincire eklenir.</li>
                <li className="mb-2"><strong>İşlem Tamamlandı:</strong> İşlem artık değiştirilemez ve herkese açık olarak kaydedilir.</li>
              </ol>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain Türleri</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Genel (Public) Blockchain:</strong> Herkesin erişebileceği ve katılımı açık olan blokzincirlerdir. Bitcoin ve Ethereum bu türdendir.</li>
                <li className="mb-2"><strong>Özel (Private) Blockchain:</strong> Katılımın kısıtlandığı ve genellikle kurum içi kullanım için tasarlanan blokzincirlerdir.</li>
                <li className="mb-2"><strong>Konsorsiyum (Consortium) Blockchain:</strong> Belirli bir kuruluş grubunun ortaklaşa yönettiği blokzincirlerdir.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain'in Temel Özellikleri</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Merkezi Olmama:</strong> Tek bir otorite tarafından kontrol edilmez, dağıtık yapıdadır.</li>
                <li className="mb-2"><strong>Şeffaflık:</strong> Tüm işlemler kamuya açıktır ve herkes tarafından görüntülenebilir.</li>
                <li className="mb-2"><strong>Değiştirilemezlik (Immutability):</strong> Kaydedilen veriler değiştirilemez veya silinemez.</li>
                <li className="mb-2"><strong>Güvenlik:</strong> Kriptografik tekniklerle korunur ve saldırıya karşı dirençlidir.</li>
                <li className="mb-2"><strong>Konsensus Mekanizması:</strong> Ağdaki tüm katılımcıların aynı gerçeği kabul etmesini sağlar.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain Uygulama Alanları</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Kripto Paralar:</strong> Bitcoin, Ethereum gibi dijital para birimleri blockchain üzerine kuruludur.</li>
                <li className="mb-2"><strong>Tedarik Zinciri Yönetimi:</strong> Ürünlerin üretimden tüketiciye kadar olan sürecinin şeffaf izlenmesi.</li>
                <li className="mb-2"><strong>Sağlık Hizmetleri:</strong> Hastaların tıbbi kayıtlarının güvenli ve erişilebilir saklanması.</li>
                <li className="mb-2"><strong>Oy Verme Sistemleri:</strong> Şeffaf ve manipülasyona karşı dirençli seçim sistemleri.</li>
                <li className="mb-2"><strong>Mülkiyet Kayıtları:</strong> Gayrimenkul ve diğer varlık sahipliklerinin dijital kaydı.</li>
                <li className="mb-2"><strong>Akıllı Sözleşmeler:</strong> Otomatik olarak icra edilen dijital sözleşmeler.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain'in Avantajları</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Güvenilirlik:</strong> Merkezi otoriteye gerek kalmadan güvenilir işlemler.</li>
                <li className="mb-2"><strong>Maliyet Azaltımı:</strong> Ara kuruluşların ortadan kaldırılmasıyla maliyetler azalır.</li>
                <li className="mb-2"><strong>Hız:</strong> Geleneksel sistemlere göre daha hızlı işlemler.</li>
                <li className="mb-2"><strong>Şeffaflık:</strong> Tüm işlemler kamuya açıktır ve denetlenebilir.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Blockchain'in Zorlukları</h2>
              
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Ölçeklenebilirlik:</strong> Büyük işlem hacimlerini işlemekte zorlanabilir.</li>
                <li className="mb-2"><strong>Enerji Tüketimi:</strong> Bazı konsensus mekanizmaları çok fazla enerji tüketir.</li>
                <li className="mb-2"><strong>Düzenleyici Belirsizlik:</strong> Hükümetlerin yaklaşımı hâlâ belirsizdir.</li>
                <li className="mb-2"><strong>Teknik Karmaşıklık:</strong> Geliştirme ve kullanım için teknik bilgi gerektirir.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Sonuç</h2>
              
              <p className="mb-4">
                Blockchain teknolojisi, dijital dünyada güven ve şeffaflık sağlamada önemli bir adım olmuştur. Bu teknolojinin potansiyeli hâlâ tam olarak keşfedilmemiştir ve gelecekte birçok yeni uygulama alanı ortaya çıkabilir. Ancak teknolojinin zorlukları da göz ardı edilmemelidir.
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