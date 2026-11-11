// Yayına çıkacak dosyaları `yayin/` klasörüne toplar. Bu klasör olduğu gibi
// herhangi bir statik barındırmaya (Hostinger Dosya Yöneticisi, Netlify,
// Cloudflare Pages) yüklenebilir.
//
//   node scripts/paketle.cjs
//
// - `reklam/`, README, .git ve bu betik pakete girmez.
// - Yasal sayfalar uygulama deposunun `site/` klasöründen alınır
//   (orada `npm run site:export` ile üretilir). Üzerinde hâlâ "Yayınlamayın"
//   taslak uyarısı olan sayfa pakete KONMAZ; onaylanıp uyarı kalkınca girer.
const fs = require('fs');
const path = require('path');

const KOK = path.resolve(__dirname, '..');
const HEDEF = path.join(KOK, 'yayin');
const YASAL_KAYNAK = path.resolve(KOK, '..', 'islami-uygulama', 'site');
const YASAL = ['gizlilik.html', 'kullanim-kosullari.html', 'kvkk.html', 'destek.html'];
const TASLAK_ISARETI = 'Yayınlamayın';

fs.rmSync(HEDEF, { recursive: true, force: true });
fs.mkdirSync(HEDEF);

for (const ad of ['index.html', 'app.js', 'styles.css']) {
  fs.copyFileSync(path.join(KOK, ad), path.join(HEDEF, ad));
}
fs.cpSync(path.join(KOK, 'assets'), path.join(HEDEF, 'assets'), { recursive: true });

// Netlify ve Cloudflare Pages bu dosyayı okur; diğerleri yok sayar.
fs.writeFileSync(
  path.join(HEDEF, '_headers'),
  [
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
    '  X-Frame-Options: DENY',
    '',
  ].join('\n'),
);

const eklenen = [];
const bekleyen = [];
for (const ad of YASAL) {
  const kaynak = path.join(YASAL_KAYNAK, ad);
  if (!fs.existsSync(kaynak)) {
    bekleyen.push(`${ad} (bulunamadı: önce uygulama deposunda npm run site:export)`);
    continue;
  }
  if (fs.readFileSync(kaynak, 'utf8').includes(TASLAK_ISARETI)) {
    bekleyen.push(`${ad} (taslak uyarısı duruyor)`);
    continue;
  }
  fs.copyFileSync(kaynak, path.join(HEDEF, ad));
  eklenen.push(ad);
}

function say(dizin) {
  return fs.readdirSync(dizin, { withFileTypes: true }).reduce(
    (t, g) => t + (g.isDirectory() ? say(path.join(dizin, g.name)) : 1),
    0,
  );
}

console.log(`yayin/ hazır: ${say(HEDEF)} dosya`);
console.log(`Yasal sayfalar eklendi: ${eklenen.length ? eklenen.join(', ') : 'yok'}`);
if (bekleyen.length) {
  console.log('Pakete girmeyenler (alt bilgideki bağlantıları 404 verir):');
  for (const b of bekleyen) console.log(`  - ${b}`);
}
