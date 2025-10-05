🎮 GameJam Web Platform

GameJam Web Platform, oyun geliştirme maratonları (GameJam etkinlikleri) için hazırlanmış, hem başvuru yönetimini hem de etkinlik tanıtımını tek bir yerde toplayan modern bir web uygulamasıdır.
Proje, Next.js + Prisma mimarisi ile geliştirilmiş olup, Plesk veya Vercel üzerinde çalışacak şekilde yapılandırılmıştır.

🚀 Amaç

Bu platform, GameJam katılımcılarının kolayca:

Etkinlik kurallarını ve takvimini görüntülemesini,

Takım kurmasını veya bireysel olarak başvuru yapmasını,

Duyuru ve sonuçlara ulaşmasını sağlar.

Etkinlik organizatörleri için ise başvuruların, ekiplerin ve proje yüklemelerinin tek panelden yönetilmesine olanak tanır.

🧩 Proje Mimarisi

Proje iki ana bölümden oluşur:

1️⃣ Frontend – Next.js

Framework: Next.js (React tabanlı)

Stil: TailwindCSS / CSS Modules

İşlev: Kullanıcı arayüzü, sayfa yönlendirmeleri, formlar

Deploy: Vercel veya Plesk Node.js modülü ile

2️⃣ Backend – Node.js + Prisma

Sunucu: Express.js veya Next.js API routes

ORM: Prisma

Veritabanı: PostgreSQL / SQLite

İşlev: Kullanıcı verilerini kaydetme, sorgulama, duyuru yönetimi

📁 Klasör Yapısı
GameJam/
├── prisma/
│   ├── schema.prisma        # Veritabanı modeli ve yapılandırması
│   ├── migrations/          # Veritabanı versiyon geçmişi
│
├── src/ veya pages/         # Next.js sayfa dosyaları
│   ├── index.js             # Ana sayfa
│   ├── apply.js             # Başvuru formu
│   └── api/                 # Backend API route’ları
│
├── public/                  # Görseller, logolar, afişler
├── package.json             # Bağımlılıklar ve komutlar
└── .env                     # Ortam değişkenleri (veritabanı, port, gizli anahtarlar)

⚙️ Kullanılan Teknolojiler
Katman	Teknoloji	Açıklama
🖥️ Frontend	Next.js / React	Kullanıcı arayüzü ve sayfa yönlendirmesi
🎨 Tasarım	TailwindCSS	Modern ve responsive tasarım
⚙️ Backend	Node.js + Express.js	API yönetimi ve iş mantığı
🧠 ORM	Prisma	Veritabanı yönetimi (SQL sorgularını kodla yönetme)
🗄️ Database	PostgreSQL / SQLite	Verilerin saklandığı katman
☁️ Hosting	Vercel / Plesk	Uygulamanın dağıtıldığı ortam
🧠 Prisma Yapısı (örnek)

prisma/schema.prisma dosyası veritabanı modelini tanımlar:

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  teamName  String?
  createdAt DateTime @default(now())
}

🧰 Kurulum ve Çalıştırma
🔹 1. Depoyu Klonla
git clone https://github.com/enesckk/GameJam-.git
cd GameJam-

🔹 2. Bağımlılıkları Yükle
npm install

🔹 3. Ortam Değişkenlerini Ayarla

.env dosyası oluştur:

DATABASE_URL="postgresql://user:password@localhost:5432/gamejam"
PORT=4000

🔹 4. Prisma Yapılandırması
npx prisma generate
npx prisma migrate dev --name init

🔹 5. Geliştirme Ortamında Çalıştır
npm run dev


Tarayıcıdan: http://localhost:3000

🌍 Plesk Üzerinde Yayına Alma
🔸 1. Plesk’e Giriş

Yeni bir domain veya subdomain oluştur

“Node.js” sekmesini aktif et

🔸 2. GitHub Bağlantısı

Git sekmesinden Remote Git repository olarak ekle:

https://github.com/enesckk/GameJam-.git


Application root → GameJam-

Document root → build veya .next klasörü

🔸 3. Komutları Belirle

Install command:

npm install && npx prisma generate


Start command:

npm run start

🔸 4. Veritabanı Ayarları

.env dosyasına kendi Plesk veritabanı bağlantını gir

(Örneğin Plesk içindeki “Databases” sekmesinden yeni PostgreSQL oluştur)

🔸 5. SSL ve Domain Ayarları

Let’s Encrypt üzerinden ücretsiz SSL sertifikası ekle

Domain ayarlarını kontrol et

Siteyi yayına al 🎉

🔒 Güvenlik Notları

.env dosyasını asla GitHub’a yükleme

Production ortamında Prisma Studio’yu kapat (npx prisma studio sadece local’de)

Plesk’te HTTPS zorunlu yap

👥 Katkı ve Geliştirme

Proje ekibi veya topluluk katkıda bulunmak isterse:

git checkout -b feature/yeni-ozellik
# değişiklikleri yap
git commit -m "Yeni özellik eklendi"
git push origin feature/yeni-ozellik


Pull request oluştur ve değişiklikleri açıklayan kısa bir not ekle.
