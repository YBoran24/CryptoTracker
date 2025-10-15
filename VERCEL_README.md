# Vercel Deployment Instructions for CryptoTracker

Bu belge, CryptoTracker uygulamanızın Vercel'de doğru şekilde dağıtılması için adım adım talimatları içerir.

## Önemli Not

CryptoTracker uygulaması iki ayrı bileşenden oluşur:
1. **Frontend**: Next.js ile oluşturulmuş kullanıcı arayüzü
2. **Backend**: Node.js/Express ile oluşturulmuş API sunucusu

Bu iki bileşenin Vercel'de ayrı projeler olarak dağıtılması gerekir.

## Dağıtım Süreci

### 1. Backend Uygulamasını Dağıtma

#### Adım 1: Vercel'de Yeni Bir Proje Oluşturun
1. Vercel dashboard'una gidin
2. "New Project" butonuna tıklayın
3. GitHub repositorinizi seçin

#### Adım 2: Proje Ayarlarını Yapılandırın
- **Root Directory**: `backend`
- **Framework Preset**: "Other"

#### Adım 3: Environment Değişkenlerini Ayarlayın
Backend projeniz için aşağıdaki environment değişkenlerini ayarlayın:

| Değişken Adı | Açıklama | Örnek Değer |
|-------------|----------|-------------|
| `DATABASE_URL` | Veritabanı bağlantı dizesi | `sqlite:./cryptotracker.db` |
| `JWT_SECRET` | JWT token'lar için gizli anahtar | `gizli_anahtarınız` |
| `FRONTEND_URL` | Frontend uygulamanızın Vercel URL'si | `https://your-frontend-app.vercel.app` |
| `COINGECKO_API_KEY` | CoinGecko API anahtarı (opsiyonel) | `CG-anahtarınız` |

#### Adım 4: Dağıtımı Gerçekleştirin
1. "Deploy" butonuna tıklayın
2. Dağıtımın tamamlanmasını bekleyin
3. Dağıtılan backend URL'sini not alın (örn. `https://your-backend-app.vercel.app`)

### 2. Frontend Uygulamasını Dağıtma

#### Adım 1: Vercel'de Yeni Bir Proje Oluşturun
1. Vercel dashboard'una gidin
2. "New Project" butonuna tıklayın
3. GitHub repositorinizi seçin

#### Adım 2: Proje Ayarlarını Yapılandırın
- **Root Directory**: `frontend`
- **Framework Preset**: "Next.js"

#### Adım 3: Environment Değişkenlerini Ayarlayın
Frontend projeniz için aşağıdaki environment değişkenini ayarlayın:

| Değişken Adı | Açıklama | Örnek Değer |
|-------------|----------|-------------|
| `BACKEND_URL` | Dağıtılan backend uygulamanızın URL'si | `https://your-backend-app.vercel.app` |

#### Adım 4: Dağıtımı Gerçekleştirin
1. "Deploy" butonuna tıklayın
2. Dağıtımın tamamlanmasını bekleyin
3. Dağıtılan frontend URL'sini not alın (örn. `https://your-frontend-app.vercel.app`)

## Önemli Yapılandırma Detayları

### CORS Yapılandırması
Backend sunucunuz, Vercel frontend uygulamanızdan gelen istekleri kabul edecek şekilde yapılandırılmıştır. Ancak aşağıdaki noktalara dikkat edin:

1. `FRONTEND_URL` environment değişkeni backend projenizde doğru ayarlanmalıdır
2. Vercel preview URL'lerinin (`.vercel.app`) kabul edildiğinden emin olun

### API Bağlantıları
Frontend uygulamanız, backend API ile iletişim kurmak için `BACKEND_URL` environment değişkenini kullanır:

```javascript
// frontend/services/api.ts
const api = axios.create({
  baseURL: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : 'http://localhost:5003/api',
});
```

## Sorun Giderme

"Sunucuya bağlanılamadı" hatası alıyorsanız:

1. **Environment Değişkenlerini Kontrol Edin**
   - `BACKEND_URL` frontend projenizde doğru ayarlanmış mı?
   - `FRONTEND_URL` backend projenizde doğru ayarlanmış mı?

2. **Backend API'nin Erişilebilirliğini Kontrol Edin**
   - `https://your-backend-app.vercel.app/health` adresine tarayıcıdan erişebiliyor musunuz?
   - `https://your-backend-app.vercel.app/api/coins` adresine tarayıcıdan erişebiliyor musunuz?

3. **CORS Yapılandırmasını Kontrol Edin**
   - Tarayıcı konsolunda CORS hataları görüyor musunuz?
   - Backend CORS yapılandırması Vercel domain'lerini kabul ediyor mu?

4. **Uygulamaları Tekrar Dağıtın**
   - Environment değişkenlerini güncelledikten sonra her iki uygulamayı da yeniden dağıtın

## Güncelleme ve Yeniden Dağıtım

### Kod Güncellemeleri
1. Yeni değişiklikleri GitHub repositorinize gönderin
2. Vercel otomatik olarak yeniden dağıtım yapar

### Manuel Yeniden Dağıtım
1. Vercel dashboard'unda ilgili projeyi seçin
2. "Deployments" sekmesine gidin
3. "Redeploy" seçeneğini kullanın

## Ek Kaynaklar

- [Vercel Deployment Checklist](file:///c:/Users/erenc/CryptoTracker/VERCEL_DEPLOYMENT_CHECKLIST.md)
- [Vercel Troubleshooting Guide](file:///c:/Users/erenc/CryptoTracker/VERCEL_TROUBLESHOOTING.md)
- [Vercel Deployment Guide](file:///c:/Users/erenc/CryptoTracker/VERCEL_DEPLOYMENT.md)

Bu talimatları takip ederek CryptoTracker uygulamanızı Vercel'de başarılı bir şekilde dağıtabilirsiniz.