# Vercel Deployment Troubleshooting Guide

Bu rehber, Vercel'de CryptoTracker uygulamanızı dağıtırken karşılaşabileceğiniz yaygın sorunları ve bunların çözümlerini içerir.

## "Sunucuya bağlanılamadı" Hatası

Bu hata genellikle frontend uygulamanızın backend API ile iletişim kuramamasından kaynaklanır. Aşağıdaki adımları izleyerek sorunu çözebilirsiniz:

### 1. Environment Değişkenlerini Kontrol Edin

#### Frontend için:
- [ ] Vercel dashboard'unda frontend projenizi seçin
- [ ] Settings > Environment Variables bölümüne gidin
- [ ] `BACKEND_URL` değişkeninin mevcut ve doğru ayarlandığından emin olun
- [ ] Değerin sonunda `/api` olmaması gerektiğine dikkat edin (API istekleri sırasında otomatik olarak eklenir)

Örnek doğru yapılandırma:
```
BACKEND_URL=https://your-backend-app.vercel.app
```

#### Backend için:
- [ ] Vercel dashboard'unda backend projenizi seçin
- [ ] Settings > Environment Variables bölümüne gidin
- [ ] Aşağıdaki değişkenlerin mevcut ve doğru ayarlandığından emin olun:
  - `DATABASE_URL`: Veritabanı bağlantı dizesi
  - `JWT_SECRET`: JWT gizli anahtarı
  - `FRONTEND_URL`: Frontend Vercel URL'si

### 2. CORS Yapılandırmasını Kontrol Edin

Backend sunucunuzun Vercel frontend uygulamanızdan gelen istekleri kabul etmesi gerekir.

#### Kontrol edilmesi gerekenler:
- [ ] `backend/src/server.ts` dosyasındaki CORS yapılandırmasının doğru olduğundan emin olun
- [ ] `FRONTEND_URL` environment değişkeninin backend projenizde doğru ayarlandığından emin olun
- [ ] Vercel preview URL'lerinin kabul edildiğinden emin olun (`.vercel.app` domain'leri)

### 3. Backend API'nin Erişilebilirliğini Kontrol Edin

#### Health Check:
- [ ] Tarayıcınızda şu URL'yi açın: `https://your-backend-app.vercel.app/health`
- [ ] JSON formatında bir yanıt almalısınız:
  ```json
  {
    "status": "OK",
    "message": "CryptoTracker API is running",
    "timestamp": "2023-..."
  }
  ```

#### API Endpoint'leri:
- [ ] Tarayıcınızda şu URL'yi açın: `https://your-backend-app.vercel.app/api/coins`
- [ ] Kripto para birimi verilerini içeren bir JSON yanıtı almalısınız

### 4. Vercel Deployment Loglarını Kontrol Edin

#### Frontend logları:
- [ ] Vercel dashboard'unda frontend projenizi seçin
- [ ] Deployments sekmesine gidin
- [ ] En son deployment'ı seçin
- [ ] Build ve deployment loglarını inceleyin
- [ ] Herhangi bir hata olup olmadığını kontrol edin

#### Backend logları:
- [ ] Vercel dashboard'unda backend projenizi seçin
- [ ] Deployments sekmesine gidin
- [ ] En son deployment'ı seçin
- [ ] Build ve deployment loglarını inceleyin
- [ ] Herhangi bir hata olup olmadığını kontrol edin

### 5. Uygulamaları Tekrar Dağıtın

Bazı değişikliklerin etkili olması için uygulamaların yeniden dağıtılması gerekebilir:

#### Frontend:
- [ ] Vercel dashboard'unda frontend projenizi seçin
- [ ] Deployments sekmesine gidin
- [ ] "Redeploy" seçeneğini kullanın

#### Backend:
- [ ] Vercel dashboard'unda backend projenizi seçin
- [ ] Deployments sekmesine gidin
- [ ] "Redeploy" seçeneğini kullanın

## Diğer Yaygın Sorunlar

### 1. "Kripto para veri bilgisi alınamadı" Hatası

#### Çözüm adımları:
- [ ] `BACKEND_URL` environment değişkeninin frontend projenizde doğru ayarlandığından emin olun
- [ ] Backend API'nin çalışır durumda olduğundan emin olun
- [ ] CORS yapılandırmasının doğru olduğundan emin olun
- [ ] CoinGecko API anahtarının (varsa) doğru ayarlandığından emin olun

### 2. CORS Hataları

#### Tarayıcı konsolunda CORS hataları görüyorsanız:
- [ ] Backend sunucunuzun CORS yapılandırmasında frontend domain'inizin izin verilenler listesinde olduğundan emin olun
- [ ] `FRONTEND_URL` environment değişkeninin backend projenizde doğru ayarlandığından emin olun
- [ ] Vercel preview URL'lerinin kabul edildiğinden emin olun

### 3. Environment Değişkenleri Güncellenmiyor

#### Sorun:
Environment değişkenlerinde yapılan değişiklikler dağıtımda etkili olmuyor.

#### Çözüm:
- [ ] Değişkenleri güncelledikten sonra projeyi yeniden dağıtın
- [ ] Vercel dashboard'unda "Redeploy" seçeneğini kullanın
- [ ] Değişkenlerin isimlerinin ve değerlerinin doğru olduğundan emin olun

### 4. Build Hataları

#### Sorun:
Dağıtım sırasında build hataları oluşuyor.

#### Çözüm:
- [ ] `package.json` dosyalarında tüm bağımlılıkların doğru listelendiğinden emin olun
- [ ] TypeScript kodunun doğru derlendiğinden emin olun
- [ ] Vercel dashboard'undaki build loglarını inceleyin ve hataları düzeltin

## Yardım ve Destek

Sorununuzu çözemiyorsanız:

1. [Vercel Dokümantasyonu](https://vercel.com/docs) sitesini inceleyin
2. [Vercel Topluluk Forumu](https://github.com/vercel/vercel/discussions) üzerinden yardım isteyin
3. GitHub repositorinizi kontrol edin ve gerekirse issue oluşturun

## İletişim

Sorununuz devam ederse, lütfen aşağıdaki bilgileri sağlayın:
- Vercel deployment URL'leriniz
- Tarayıcı konsolundaki hata mesajları
- Vercel dashboard'undaki deployment logları
- Environment değişkenlerinizin yapılandırması

Bu bilgiler sorununuzun daha hızlı çözülmesine yardımcı olacaktır.