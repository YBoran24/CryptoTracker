# Vercel Deployment Checklist for CryptoTracker

Bu kontrol listesi, CryptoTracker uygulamanızın Vercel'de doğru şekilde dağıtılmasını sağlamak için gereken adımları özetler.

## 1. Backend Dağıtımı

### 1.1. Backend Hazırlığı
- [ ] Backend kodunun en son sürümünü GitHub'a gönderin
- [ ] `backend/package.json` dosyasının doğru olduğundan emin olun
- [ ] `backend/vercel.json` dosyasının mevcut ve doğru yapılandırılmış olduğundan emin olun

### 1.2. Vercel'de Backend Projesi Oluşturma
- [ ] Vercel dashboard'una gidin
- [ ] "New Project" butonuna tıklayın
- [ ] GitHub repositorinizi seçin
- [ ] Proje ayarlarında:
  - Root Directory: `backend`
  - Framework Preset: "Other"

### 1.3. Backend Environment Değişkenlerini Ayarlama
- [ ] Vercel dashboard'unda backend projenizi seçin
- [ ] Settings > Environment Variables bölümüne gidin
- [ ] Aşağıdaki değişkenleri ekleyin:
  - `DATABASE_URL`: Veritabanı bağlantı dizesi
  - `JWT_SECRET`: JWT gizli anahtarı
  - `FRONTEND_URL`: Frontend Vercel URL'si (örn. `https://your-frontend-app.vercel.app`)
  - `COINGECKO_API_KEY`: CoinGecko API anahtarı (opsiyonel)

### 1.4. Backend Uygulamasını Dağıtma
- [ ] Deploy butonuna tıklayın
- [ ] Dağıtımın tamamlanmasını bekleyin
- [ ] Dağıtılan backend URL'sini not alın (örn. `https://your-backend-app.vercel.app`)

## 2. Frontend Dağıtımı

### 2.1. Frontend Hazırlığı
- [ ] Frontend kodunun en son sürümünü GitHub'a gönderin
- [ ] `frontend/package.json` dosyasının doğru olduğundan emin olun
- [ ] `frontend/next.config.js` dosyasının mevcut ve doğru yapılandırılmış olduğundan emin olun
- [ ] `vercel.json` dosyasının mevcut ve doğru yapılandırılmış olduğundan emin olun

### 2.2. Vercel'de Frontend Projesi Oluşturma
- [ ] Vercel dashboard'una gidin
- [ ] "New Project" butonuna tıklayın
- [ ] GitHub repositorinizi seçin
- [ ] Proje ayarlarında:
  - Root Directory: `frontend`
  - Framework Preset: "Next.js"

### 2.3. Frontend Environment Değişkenlerini Ayarlama
- [ ] Vercel dashboard'unda frontend projenizi seçin
- [ ] Settings > Environment Variables bölümüne gidin
- [ ] Aşağıdaki değişkeni ekleyin:
  - `BACKEND_URL`: Dağıtılan backend URL'si (örn. `https://your-backend-app.vercel.app`)

### 2.4. Frontend Uygulamasını Dağıtma
- [ ] Deploy butonuna tıklayın
- [ ] Dağıtımın tamamlanmasını bekleyin
- [ ] Dağıtılan frontend URL'sini not alın (örn. `https://your-frontend-app.vercel.app`)

## 3. Son Kontroller

### 3.1. CORS Yapılandırması
- [ ] Backend sunucusunun `FRONTEND_URL` değişkenini doğru şekilde kullandığından emin olun
- [ ] Backend sunucusunun Vercel domain'lerini kabul eden CORS yapılandırmasına sahip olduğundan emin olun

### 3.2. API Bağlantı Testi
- [ ] Frontend URL'sine gidin
- [ ] Kripto para birimi verilerinin düzgün şekilde yüklendiğini kontrol edin
- [ ] Herhangi bir CORS hatası olmadığını doğrulayın

### 3.3. Health Check
- [ ] Backend health check endpoint'ine istek gönderin: `https://your-backend-app.vercel.app/health`
- [ ] Başarılı bir yanıt alındığını doğrulayın

## 4. Sorun Giderme

### 4.1. "Sunucuya bağlanılamadı" Hatası
- [ ] `BACKEND_URL` environment değişkeninin frontend projesinde doğru ayarlandığından emin olun
- [ ] Backend sunucusunun çalışır durumda olduğundan emin olun
- [ ] CORS yapılandırmasının doğru olduğundan emin olun
- [ ] Vercel dashboard'unda deployment loglarını kontrol edin

### 4.2. Diğer Yaygın Sorunlar
- [ ] Environment değişkenlerinin tüm projelerde doğru ayarlandığından emin olun
- [ ] Bağlantı dizilerinin doğru olduğundan emin olun
- [ ] API endpoint'lerinin doğru çalıştığından emin olun

## 5. Güncelleme ve Yeniden Dağıtım

### 5.1. Kod Güncellemeleri
- [ ] Yeni değişiklikleri GitHub'a gönderin
- [ ] Vercel otomatik olarak yeniden dağıtım yapar

### 5.2. Manuel Yeniden Dağıtım
- [ ] Vercel dashboard'unda ilgili projeyi seçin
- [ ] Deployments sekmesine gidin
- [ ] "Redeploy" seçeneğini kullanın

Bu kontrol listesini takip ederek CryptoTracker uygulamanızın Vercel'de düzgün çalışmasını sağlayabilirsiniz.