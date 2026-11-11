# Hadıra tanıtım sitesi

`https://hadira.app` için tek sayfalık, statik tanıtım sitesi. Alan adı `hadira.app` bize ait, `destek@hadira.app` adresi çalışıyor. Site henüz bir barındırmaya yüklenmedi.

Uygulamanın kaynağı ayrı depoda (`islami-uygulama`); bu depo yalnızca web sitesidir. İlk sürüm oradaki `landing/` klasöründen kopyalandı, bundan sonra burası esastır.

## Önizleme

Depo kökünde:

```bash
python -m http.server 8100 --bind 127.0.0.1
```

Sonra http://localhost:8100 adresini aç.

## Yayın paketi

```bash
node scripts/paketle.cjs
```

Site Cloudflare Workers'ta (`hadira` adlı worker) yayınlanır. Cloudflare panelinde Build command `node scripts/paketle.cjs`, Deploy command `npx wrangler deploy` olmalı; `wrangler.jsonc` yalnızca `yayin/` klasörünü yayınlar. Depo kökü yayınlanırsa `reklam/` ve README de herkese açılır.

Betik yüklenecek her şeyi `yayin/` klasörüne toplar (depoya girmez). `reklam/` ve README pakete girmez. Yasal sayfalar uygulama deposunun `site/` klasöründen alınır; üzerinde "Yayınlamayın" uyarısı duran sayfa pakete konmaz.

## Dosyalar

| Dosya | Ne |
|---|---|
| `index.html` | Sayfa: üç canlı telefon ekranı (kilit ekranı, akış, vakitler), widget'lar, tema seçici, yarışma, Ücretsiz/Premium, veri notu, alt bilgi |
| `app.js` | Ekranları canlandırır: İstanbul saati, sayfada hesaplanan yaklaşık namaz vakitleri ve geri sayım, kendi kendine kayan akış (dokununca favori), çan düğmeleri, tema değiştirici, 3 örnek soruluk yarışma. Ağ isteği, depolama, çerez yok. JS kapalıysa sabit örnek değerler görünür |
| `styles.css` | Tüm stil. Açık tema uygulamanın "Krem", koyu tema uygulamanın kömür/altın renkleri (uygulamadaki `tailwind.config.js`, `src/lib/tokens.ts`, `src/data/themes.ts`) |
| `assets/fonts/` | Fraunces 600 + 400 italik, DM Sans 400 + 500. Uygulamanın kendi yazı tipleri, uygulamadaki `@expo-google-fonts` paketlerinden Türkçe karakterlerle alt kümelendi (.woff). Lisans: SIL OFL, metinleri yanında |
| `assets/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Site simgesi (kemer + altın nokta). Uygulama simgesi değildir |
| `assets/og.png` | 1200×630 paylaşım görseli |

Framework, harici istek, çerez, analitik, izleyici yok. `prefers-reduced-motion` açıksa akış kendi kaymaz, giriş ve paralaks hareketleri kapanır. Google Fonts kullanılmıyor.

## Hâlâ yer tutucu olanlar

- **App Store düğmeleri:** üst bilgi, giriş bölümü ve sayfa sonundaki "İndir" bölümünde. Apple'ın resmî rozeti değil, kendi tasarımımız; uygulama kimliği yokken "App Store’da yakında" der ve sayfa sonuna kayar. Kimlik oluşunca yalnızca `index.html` içindeki `<meta name="hadira-app-store-id" content="">` alanına yaz: düğmelerin hepsi `https://apps.apple.com/tr/app/id<KİMLİK>` bağlantısına döner ve metin "App Store’dan indir" olur. İstenirse o zaman Apple'ın resmî rozetine (Apple'ın rozet kurallarına göre) geçilir. Aynı kimlik uygulamada `src/config/app.ts` → `APP_STORE_ID` alanına da yazılır.
- **Ekran görüntüleri (`assets/ekran/`):** uygulamanın web önizlemesinden (Expo web, 390×844) alındı; gerçek iPhone görüntüsü değil. Mağaza görselleri gerçek cihazdan alınınca bunlar da değiştirilmeli. Kullanıcı hesabı ya da kişisel veri içermez.
- **Tanıtım videosu (`assets/video/`):** `reklam/hadira-reklam.mp4` kopyası; sessiz, yalnızca görünürken oynar, "hareketi azalt" açıksa kendi başlamaz. Videonun sonundaki "App Store’da yakında" yazısı yayından sonra değişmeli.
- **Canlı vakitler yaklaşık:** `app.js` İstanbul için güneş konumundan hesaplıyor (imsak 18°, yatsı 17°, Şafii ikindi, Diyanet'e benzer dakika düzeltmeleri). Diyanet takvimiyle birkaç dakika fark edebilir; sayfada "yaklaşık" diye yazıyor. Uygulamanın kendi hesabıyla (`src/lib/prayer.ts`) karşılaştırılmalı.
- **Örnek içerik:** girişteki akış telefonu uygulamanın kütüphanesinden 8 kısa kart döndürür (ayetten ilham ×2, hadis ×2, zikir, dua, esmâ, Yunus Emre). Meal metni bilerek konmadı (meal lisansı çözülmedi); ilham kartları yalnızca ayeti kaynak gösterir. Hepsi uygulamadaki gibi TASLAK, ilim ehli onayından geçmeli. Widget'taki zikir, seri sayısı (12 gün) ve üç yarışma sorusu da temsilîdir.
- **Telif:** `© 2026 Hadıra` satırı, şirket/şahıs adı netleşince güncellenecek.
- **Alt bilgi bağlantıları:** `gizlilik.html`, `kullanim-kosullari.html`, `kvkk.html`, `destek.html` göreli bağlantılar. Bu sayfalar uygulama deposunda `npm run site:export` ile `site/` klasörüne üretiliyor. Şu anki çıktıların hepsinde "Taslak: yayınlamayın" uyarısı olduğu için bu depoya **konmadı**; onaylanınca kök dizine kopyalanacak. O zamana kadar bu bağlantılar 404 verir.

## Açık işler (yayından önce)

1. **Barındırma:** `hadira.app` alındı; statik barındırma seçilecek (ör. Cloudflare Pages, Netlify, GitHub Pages) ve DNS bağlanacak. `.app` HSTS ön yüklü olduğu için HTTPS zorunlu. `reklam/` klasörü yayına çıkmamalı (yayın ayarında hariç tutulmalı ya da depodan ayrılmalı).
2. **App Store bağlantısı:** uygulama kimliği oluşunca (yukarıya bak).
3. **Yasal metinler TASLAK:** üretilen gizlilik, kullanım koşulları, KVKK ve destek sayfalarında hâlâ "Taslak: bu metin henüz onaylanmadı. Yayınlamayın." yazıyor. Bu sayfadaki "Verilerin telefonunda kalır" bölümü de o metinlerle birlikte gözden geçirilmeli (konum, RevenueCat, cihazda kalan veri).
4. **İçerik onayı:** sayfada meal metni yok (meal lisansı çözülmedi). Sayfadaki zikirler (Sübhânallâhi ve bihamdihî, Elhamdülillâh, Lâ ilâhe illallah, Allâhu ekber, Estağfirullah) ve üç yarışma sorusu ilim ehli onayından geçmeli.
5. **Özellik listesi:** sayfa `docs/release/app-store-metadata.tr.json` ve `src/data/premium.ts` ile uyumlu yazıldı (uygulama deposu) (ücretsiz: 2 hatırlatma, Premium: 10; ücretsiz temalar Altın deniz, Koyu, Krem). Bunlardan biri değişirse sayfa da değişmeli.

## Fiyatlar

Premium kartında aylık ₺89,99 ve yıllık ₺599,99 (ayda ≈ ₺50, aylığa göre %44 daha uygun) yazar. App Store Connect'teki Türkiye fiyatı değişirse `index.html` → `.prices` de aynı gün değişmeli; sayfa "App Store'un ödeme ekranındaki fiyat geçerlidir" der.

## Canlı temalar

Girişteki akış telefonu her kartta uygulamanın bir temasını giyer (çoğu Premium canlı tema); tema seçicide 6 canlı tema var. Efektler (`.fx[data-fx]`: yildiz, nur, yagis, isik, dalga, desen) uygulamadaki `MotionLayer` türlerinin CSS karşılığıdır, renkler `src/data/themes.ts`'ten alındı. "Hareketi azalt" açıkken durur.

## Video temalar (`assets/temalar/`)

Uygulamanın `assets/videos/` klasöründeki video temalardan 7 tanesinin web için küçültülmüş kopyası: 360×640, 24 fps, sessiz, H.264; yanında ilk kareden `.webp` kapak. Yalnızca kartı ya da teması ekranda görünürken yüklenir ve oynar; "hareketi azalt" açıksa kapak resmi durur.

**Kaynakları henüz belgelenmedi.** Uygulamadaki gibi burada da her satıra indirildiği sayfa, yazar, lisans adı ve indirme tarihi yazılmalı (uygulamada aynı liste: `docs/release/MEDIA_LICENSE_INVENTORY.md`).

| Sitedeki dosya | Uygulamadaki dosya | Nerede | İndirildiği sayfa | Yazar | Lisans | Tarih |
|---|---|---|---|---|---|---|
| `minare-gun-batimi` | `free-minare-gün-batımı.mp4` | Akış (zikir kartı) | | | | |
| `yildizli-minare` | `yıldızlı-minare.mp4` | Akış, tema seçici | | | | |
| `cami-sutunlari` | `cami-sütunları.mp4` | Akış (esmâ kartı) | | | | |
| `zumrut-okyanus` | `zümrüt-okyanus.mp4` | Akış (hadis kartı) | | | | |
| `bahar-dali` | `bahar-dalı.mp4` | Akış (Yunus Emre kartı) | | | | |
| `karli-fener` | `karlı-fener.mp4` | Tema seçici | | | | |
| `altin-kandiller` | `altın-kandiller.mp4` | Tema seçici | | | | |

## Bilerek konmayanlar

Deneme süresi (yalnızca mağaza gösterir), yorum/puan/indirme sayısı, basın logoları, e-posta kayıt formu, "reklamsız" vaadi, "yakında" özellikleri, kıble, ezan sesi, uygulama simgeleri, hesap/giriş, insan veya peygamber görseli, `assets/videos` ve `assets/audio` içeriği.
