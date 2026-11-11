# Hadıra kısa reklam (taslak)

Yayınlanmadı, hiçbir platforma yüklenmedi.

## Dosyalar

| Dosya | Ne |
|---|---|
| `hadira-reklam.mp4` | 13 sn, 1080×1920 (9:16), 30 fps, H.264, sessiz, ~3 MB |
| `hadira-reklam-kapak.jpg` | Kapanış kartından bir kare (12,5. saniye), kapak görseli olarak kullanılabilir |
| `index.html` | Animasyonun kaynağı: canvas üzerinde çizim. `http://localhost:8100/reklam/` adresinde açılır, kaydırıcıyla saniye saniye gezilir |

## Nasıl yapıldı

- Yapay zekâ video üretimi **kullanılmadı**. Higgsfield hesabında kredi yoktu (ücretsiz plan, 0 kredi; 10 sn'lik bir klip 70 kredi); hiçbir şey satın alınmadı.
- Görüntü tamamen kodla çizildi: renkler uygulamanın temalarından (Seher → Gün batımı → Kadir gecesi), yazılar uygulamanın kendi yazı tipleri (Fraunces, DM Sans; SIL OFL lisanslı). Dışarıdan görsel, video, ses ya da müzik yok. Bu yüzden lisans sorunu taşımaz.
- Kareler tarayıcıda tek tek çizildi (391 kare), `imageio_ffmpeg` içindeki ffmpeg ile birleştirildi.

## Akış

| Saniye | Sahne |
|---|---|
| 0–2,5 | Kemerli taş pencere, dışarıda seher; güneş yükseliyor, pervazda kandil |
| 2,6–7 | Gökyüzü gün batımına dönerken telefon yükseliyor: kilit ekranında saat, "Akşam 17:57 · 47 dk" widget'ı, 12 günlük seri halkası, "Sübhânallâhi ve bihamdihî" zikir bildirimi |
| 7–10 | Telefon iniyor, gece ve yıldızlar; "Kalbin her an Allah’ı ansın." |
| 10–13 | Kapanış: Hadıra işareti ve adı, "Ayet · hadis · dua · zikir · namaz vakitleri", "iPhone için · App Store’da yakında" |

## Yayından önce

- **Ses yok.** Müzik eklenecekse lisansı net bir parça seçilmeli (veya sessiz bırakılmalı).
- Ekrandaki vakit ve tarih örnektir (Salı 10 Kasım, İstanbul).
- Zikir metni ve slogan ilim ehli onayından geçmeli (sitedeki içerik onayıyla aynı liste).
- "App Store’da yakında" ibaresi uygulama yayına girince değiştirilmeli.
- Video yeniden üretmek için: `index.html`'i önizlemede aç, `sendFrames` mantığıyla kareleri al veya ekran kaydı yerine aynı kare kare yöntemi kullan (gerçek zamanlı kayıt, gizli sekmede kare atlıyor).
