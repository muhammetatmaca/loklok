# LokLok - QR Menü Sistemi

Bu proje, restoranlar için modern ve hızlı bir QR menü yönetim sistemidir. **React**, **Express**, **MongoDB** ve **Cloudinary** teknolojileri kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Modern UI/UX**: Vite ve React ile hızlı arayüz.
- **Dinamik Menü**: Admin paneli üzerinden yemek ekleme, silme ve düzenleme.
- **Bulut Görüntü Depolama**: Yemek görselleri Cloudinary üzerinde saklanır.
- **Veritabanı**: Veriler MongoDB üzerinde güvenli bir şekilde tutulur.
- **Responsive Tasarım**: Mobil ve tablet uyumlu arayüz.

## 🛠️ Teknolojiler

- **Backend**: Node.js, Express.js, TypeScript.
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion.
- **Veritabanı**: MongoDB (Mongoose ile).
- **Medya**: Cloudinary API.
- **Sunucu Yönetimi**: PM2, Nginx.

## 📦 Kurulum

1. **Projeyi indirin**:
   ```bash
   git clone <repo-url>
   cd loklok
   ```

2. **Bağımlılıkları yükleyin**:
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri Ayarlayın**:
   `.env` dosyası oluşturun ve aşağıdaki bilgileri ekleyin:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

## 🏃 Çalıştırma

### Geliştirme Modu (Development)
Hem sunucuyu hem de istemciyi aynı anda başlatmak için:
```bash
npm run dev
```
Uygulama varsayılan olarak `http://localhost:5000` adresinde çalışacaktır.

### Yayına Hazırlama (Production)
```bash
# Build alma
npm run build

# Başlatma
npm start
```

## 🌐 Dağıtım (Deployment)

Projenizi bir Ubuntu sunucusunda (örneğin Hetzner) yayınlamak için:

1. **Build Alın**: `npm run build`
2. **PM2 ile Başlatın**: `pm2 start dist/index.js --name "loklok"`
3. **Nginx Yapılandırması**: `5000` portuna bir reverse proxy oluşturun.
4. **SSL**: `certbot` ile HTTPS sertifikası alın.

---
© 2025 LokLok QR Menü Sistemi
