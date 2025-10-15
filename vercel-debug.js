/**
 * Vercel Debug Script for CryptoTracker
 * 
 * Bu betik, Vercel'de dağıtılan CryptoTracker uygulamasında 
 * "Sunucuya bağlanılamadı" hatasını çözmek için yardımcı olur.
 */

const axios = require('axios');

// Environment değişkenlerini kontrol edin
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5003';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('=== Vercel Debug Script for CryptoTracker ===');
console.log('BACKEND_URL:', BACKEND_URL);
console.log('FRONTEND_URL:', FRONTEND_URL);
console.log('');

// Backend sağlık kontrolü
async function checkBackendHealth() {
  try {
    console.log('1. Backend Sağlık Kontrolü:');
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 10000
    });
    console.log('   Durum: BAŞARILI');
    console.log('   Yanıt:', response.data);
    console.log('');
    return true;
  } catch (error) {
    console.log('   Durum: HATALI');
    console.log('   Hata:', error.message);
    if (error.response) {
      console.log('   Yanıt Durumu:', error.response.status);
      console.log('   Yanıt Verisi:', error.response.data);
    }
    console.log('');
    return false;
  }
}

// Backend API erişilebilirlik testi
async function checkBackendAPI() {
  try {
    console.log('2. Backend API Erişilebilirlik Testi:');
    const response = await axios.get(`${BACKEND_URL}/api/coins`, {
      timeout: 15000
    });
    console.log('   Durum: BAŞARILI');
    console.log('   Kripto para birimi sayısı:', response.data.length);
    console.log('');
    return true;
  } catch (error) {
    console.log('   Durum: HATALI');
    console.log('   Hata:', error.message);
    if (error.response) {
      console.log('   Yanıt Durumu:', error.response.status);
      console.log('   Yanıt Verisi:', error.response.data);
    }
    console.log('');
    return false;
  }
}

// CORS yapılandırması kontrolü
async function checkCORS() {
  try {
    console.log('3. CORS Yapılandırması Kontrolü:');
    const response = await axios.get(`${BACKEND_URL}/api/coins`, {
      timeout: 15000,
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    // CORS başlıklarını kontrol edin
    const corsHeader = response.headers['access-control-allow-origin'];
    if (corsHeader) {
      console.log('   Durum: BAŞARILI');
      console.log('   CORS Başlığı:', corsHeader);
    } else {
      console.log('   Uyarı: CORS başlığı bulunamadı');
    }
    console.log('');
    return true;
  } catch (error) {
    console.log('   Durum: HATALI');
    console.log('   Hata:', error.message);
    console.log('');
    return false;
  }
}

// Ana fonksiyon
async function main() {
  console.log('Vercel dağıtım hata ayıklama işlemi başlatılıyor...\n');
  
  const healthCheck = await checkBackendHealth();
  const apiCheck = await checkBackendAPI();
  const corsCheck = await checkCORS();
  
  console.log('=== Özet ===');
  console.log('Backend Sağlık Kontrolü:', healthCheck ? 'BAŞARILI' : 'HATALI');
  console.log('Backend API Erişimi:', apiCheck ? 'BAŞARILI' : 'HATALI');
  console.log('CORS Yapılandırması:', corsCheck ? 'BAŞARILI' : 'HATALI');
  
  if (healthCheck && apiCheck) {
    console.log('\n✅ Temel bağlantılar çalışıyor. "Sunucuya bağlanılamadı" hatası frontend yapılandırmasından kaynaklanıyor olabilir.');
    console.log('\nYapılması gerekenler:');
    console.log('1. Vercel dashboard\'unda frontend projenizin BACKEND_URL environment değişkenini kontrol edin');
    console.log('2. Değerin sonunda "/api" olmaması gerektiğine dikkat edin');
    console.log('3. Frontend uygulamasını yeniden dağıtın');
  } else {
    console.log('\n❌ Backend bağlantısıyla ilgili sorunlar var.');
    console.log('\nYapılması gerekenler:');
    console.log('1. Vercel dashboard\'unda backend projenizin çalışır durumda olduğundan emin olun');
    console.log('2. Environment değişkenlerinin doğru ayarlandığından emin olun');
    console.log('3. Backend uygulamasını yeniden dağıtın');
  }
}

// Betiği çalıştır
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkBackendHealth,
  checkBackendAPI,
  checkCORS
};