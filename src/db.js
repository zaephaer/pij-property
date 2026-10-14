// SQLite via Node's built-in node:sqlite (no native build step).
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const db = new DatabaseSync(process.env.DB_FILE || path.join(__dirname, '..', 'data.sqlite'));

db.exec(`
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY, slug TEXT UNIQUE, name TEXT, status TEXT, category TEXT, location TEXT,
  units TEXT, gdv TEXT, area TEXT, summary_ms TEXT, summary_en TEXT, image TEXT, gallery TEXT, sort INTEGER DEFAULT 100);
CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY, title_ms TEXT, title_en TEXT, body_ms TEXT, body_en TEXT, image TEXT, published_at TEXT);
CREATE TABLE IF NOT EXISTS tenders (id INTEGER PRIMARY KEY, ref TEXT, title_ms TEXT, title_en TEXT, body_ms TEXT, body_en TEXT,
  closing_date TEXT, file TEXT, result_ms TEXT, result_en TEXT);
CREATE TABLE IF NOT EXISTS downloads (id INTEGER PRIMARY KEY, title_ms TEXT, title_en TEXT, file TEXT);
CREATE TABLE IF NOT EXISTS careers (id INTEGER PRIMARY KEY, title_ms TEXT, title_en TEXT, body_ms TEXT, body_en TEXT, closing_date TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, email TEXT, project TEXT, message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, name TEXT, password_hash TEXT);
CREATE TABLE IF NOT EXISTS certifications (id INTEGER PRIMARY KEY, category TEXT, title_ms TEXT, title_en TEXT, issuer TEXT, cert_no TEXT,
  badge TEXT, tags TEXT, scope_ms TEXT, scope_en TEXT, valid_from TEXT, valid_to TEXT, file TEXT, sort INTEGER DEFAULT 100);
`);

const all = (sql, ...p) => db.prepare(sql).all(...p);
const get = (sql, ...p) => db.prepare(sql).get(...p);
const run = (sql, ...p) => db.prepare(sql).run(...p);

// Idempotent column adds (SQLite can't ADD COLUMN with a non-constant default, so updated_at is set by the app).
for (const [t, c, def] of [
  ['enquiries', 'status', "TEXT DEFAULT 'baharu'"], ['enquiries', 'consent_at', 'TEXT'], ['enquiries', 'anonymised_at', 'TEXT'], ['users', 'pw_changed', 'INTEGER DEFAULT 0'],
  ['news', 'updated_at', 'TEXT'], ['tenders', 'updated_at', 'TEXT'], ['projects', 'updated_at', 'TEXT'],
  ['downloads', 'updated_at', 'TEXT'], ['careers', 'updated_at', 'TEXT'],
]) {
  if (!all('PRAGMA table_info(' + t + ')').some((r) => r.name === c)) db.exec('ALTER TABLE ' + t + ' ADD COLUMN ' + c + ' ' + def);
}

// PDPA settings (filled in admin > Tetapan). INSERT OR IGNORE keeps any value already set.
for (const k of ['pdpa_contact_title', 'pdpa_contact_email', 'pdpa_reviewed_at']) {
  db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run(k, '');
}

function settings() {
  return Object.fromEntries(all('SELECT key, value FROM settings').map((r) => [r.key, r.value]));
}

function seed() {
  // Certifications: CIDB seeded once (flag survives deleting the row). ABMS is entered by the owner from the real certificate.
  if (!get("SELECT 1 x FROM settings WHERE key = 'certs_seeded'")) {
    run(`INSERT INTO certifications (category,title_ms,title_en,issuer,cert_no,badge,tags,scope_ms,scope_en,valid_from,valid_to,file,sort)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      'cidb', 'Perakuan Pendaftaran CIDB', 'CIDB Registration Certificate',
      'Lembaga Pembangunan Industri Pembinaan Malaysia (CIDB)', '0120160620-JH175989', 'G7', 'B04, CE04, CE21, M15',
      'Gred G7: tiada had nilai tender atau kerja. Kategori B (B04), CE (CE04, CE21), ME (M15). Mula berdaftar 20/06/2016.',
      'Grade G7: no limit on tender or works value. Categories B (B04), CE (CE04, CE21), ME (M15). First registered 20/06/2016.',
      '2025-08-30', '2028-08-29', '/files/cidb.jpg', 10);
    run("INSERT OR IGNORE INTO settings VALUES ('certs_seeded','1')");
  }
  const integrity = require('./integrity-content');
  const defaults = { commitment_ms: integrity.defaultCommitment.ms, commitment_en: integrity.defaultCommitment.en, whistle_email: '', whistle_phone: '', facebook_url: 'https://www.facebook.com/PIJPDSB',
    linkedin_url: 'https://www.linkedin.com/company/pij-property-development-sdn-bhd' };
  for (const [k, v] of Object.entries(defaults)) run('INSERT OR IGNORE INTO settings VALUES (?,?)', k, v);

  if (!get("SELECT 1 x FROM settings WHERE key = 'notify_email'")) {
    const s = {
      notify_email: 'salam@pijproperty.com',
      address: 'Aras 1, Bangunan PIJ Holdings\nNo. 8, Jalan Bukit Timbalan\n80000 Johor Bahru\nJohor Darul Takzim',
      phone: '+607-226 6366',
      fax: '+607-226 6368',
      hours_ms: 'Isnin – Jumaat, 8:00 pagi – 5:30 petang. Hujung minggu dengan temujanji.',
      hours_en: 'Monday – Friday, 8:00 am – 5:30 pm. Weekends by appointment.',
      company_no: '199401037712 (323394-D)',
    };
    for (const [k, v] of Object.entries(s)) run('INSERT OR IGNORE INTO settings VALUES (?,?)', k, v);
  }
  if (!get('SELECT 1 x FROM projects LIMIT 1')) {
    const P = (slug, name, status, category, location, units, gdv, area, ms, en, image, sort) =>
      run('INSERT INTO projects (slug,name,status,category,location,units,gdv,area,summary_ms,summary_en,image,gallery,sort) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        slug, name, status, category, location, units, gdv, area, ms, en, image ? '/img/p/' + image : '', '', sort);
    // Facts from Company Profile v6, Taklimat MAIJ v1 and En Azhar deck. No costs / returns / contractor names.
    P('tpi-datin-halimah', 'Taman Perbadanan Islam Datin Halimah', 'siap', 'housing', 'Johor Bahru', '78 unit', 'RM12.7 juta', '2.13 ekar',
      'Pembangunan pangsapuri RMBJ Jenis C siap pada 2019: 71 unit kediaman dan 7 kedai pejabat kos sederhana rendah.',
      'RMBJ Type C apartment development completed in 2019: 71 residential units and 7 medium-low-cost commercial shops.', 'datin-halimah.jpg', 10);
    P('tpi-stulang-baru', 'Taman Perbadanan Islam Stulang Baru', 'siap', 'housing', 'Johor Bahru', '380 unit', 'RM29.41 juta', '8.78 ekar',
      'Pembangunan strata RMBJ Jenis A, B dan C (333 unit) siap 2020, dilengkapi kedai, dewan komuniti, tadika, surau dan 47 unit inkubator perniagaan untuk disewa.',
      'Stratified RMBJ Type A, B and C development (333 units) completed in 2020, with shops, community hall, kindergarten, surau and 47 business incubator units for rent.', 'stulang-baru.jpg', 20);
    P('tpi-larkin', 'Taman Perbadanan Islam Larkin', 'siap', 'housing', 'Johor Bahru', '669 unit', 'RM194.62 juta', '14.27 ekar',
      'Dua fasa: 121 unit RMBJ Jenis C dan 10 kedai pejabat (2020), serta 538 unit pangsapuri perkhidmatan (2022) dengan taman permainan, kelab, dewan serbaguna, gimnasium dan surau.',
      'Two phases: 121 RMBJ Type C units and 10 shop-offices (2020), plus 538 serviced apartments (2022) with playground, clubhouse, multipurpose hall, gym and surau.', 'larkin.jpg', 30);
    P('alif-sejahtera', 'Pangsapuri Perkhidmatan Alif Sejahtera', 'siap', 'housing', 'Tampoi, Johor Bahru', '72 unit', '', '',
      'Pangsapuri perkhidmatan di Tampoi (kuarters Jabatan Imigresen Johor).',
      'Serviced apartments in Tampoi (Johor Immigration Department quarters).', 'alif-sejahtera.jpg', 40);
    P('tpi-rengit', 'Taman Perbadanan Islam Rengit', 'siap', 'housing', 'Rengit, Batu Pahat', '91 unit', 'RM20.1 juta', '7.36 ekar',
      '22 unit RMBJ B, 20 unit RMBJ C, 35 unit RMBJ D dua tingkat dan 14 kedai pejabat sebuah tingkat. Perakuan Siap Kerja (CPC) 31 Mac 2026.',
      '22 RMBJ B, 20 RMBJ C, 35 double-storey RMBJ D units and 14 single-storey shop-offices. Certificate of Practical Completion 31 March 2026.', 'rengit.jpg', 50);
    P('kedai-pejabat-rengit', 'Kedai Pejabat Dua Tingkat Bandar Rengit', 'siap', 'commercial', 'Rengit, Batu Pahat', '16 unit', 'RM10.1 juta', '1.46 ekar',
      '16 unit kedai pejabat dua tingkat (A, B dan C blok). Harga jualan RM580K – RM900K. CCC 21 Januari 2026.',
      '16 double-storey shop-offices (Blocks A, B and C). Sale price RM580K – RM900K. CCC 21 January 2026.', 'kedai-rengit.jpg', 60);
    P('tpi-telok-permata', 'Taman Perbadanan Islam Telok Permata', 'sedang', 'housing', 'Johor Bahru', '4,294 unit', 'RM1.467 bilion', '49 ekar',
      'Pembangunan bercampur: rumah teres dua tingkat, RMBJ C, kedai, pangsapuri perkhidmatan berbilang plot dan tapak cadangan Ibu Pejabat PIJ Holdings. Harga mulai RM374K.',
      'Mixed development: double-storey terraces, RMBJ C, shops, multi-plot serviced apartments and a proposed site for the PIJ Holdings headquarters. Prices from RM374K.', 'telok-permata.jpg', 70);
    P('kg-muafakat-uda', 'Kampung Muafakat UDA', 'sedang', 'housing', 'Johor Bahru', '848 unit', 'RM362 juta', '',
      'Pangsapuri Jenis A, B dan C serta 24 unit RMMJ C. Harga apartmen RM314K – RM485K; RMMJ D RM300K.',
      'Type A, B and C apartments plus 24 RMMJ C units. Apartment prices RM314K – RM485K; RMMJ D RM300K.', 'muafakat-uda.jpg', 80);
    P('residensi-bangsa-johor-pontian', 'Residensi Bangsa Johor @ Pontian', 'sedang', 'housing', 'Pontian', '440 unit', 'RM140.1 juta', '36.12 ekar',
      'Rumah teres RMMJ B (46) dan RMMJ C (102), teres dua tingkat (284), 8 kedai sebuah tingkat, serta surau dan dewan terbuka.',
      'RMMJ B (46) and RMMJ C (102) terraces, 284 double-storey terraces, 8 single-storey shops, plus a surau and open hall.', 'pontian.jpg', 90);
    P('kedai-pejabat-kluang', 'Kedai Pejabat Kluang', 'sedang', 'commercial', 'Taman Pesona Fasa 3, Kluang', '14 unit', 'RM6.25 juta', '2 ekar',
      'Pembangunan komersial 14 unit kedai pejabat.', 'Commercial development of 14 shop-office units.', 'kedai-kluang.jpg', 100);
    P('masjid-taman-tiara-perdana', 'Masjid Taman Tiara Perdana', 'sedang', 'religious', 'Simpang Renggam, Kluang', '', '', '2.50 ekar',
      'Pembinaan masjid di atas PTD 17549, Mukim Ulu Benut, di antara bulatan Taman Tiara Perdana dan jambatan Sungai Berumbung.',
      'Mosque on PTD 17549, Mukim Ulu Benut, between the Taman Tiara Perdana roundabout and Sungai Berumbung bridge.', 'masjid-tiara-perdana.webp', 110);
    P('surau-taman-melawati', 'Surau Taman Melawati', 'sedang', 'religious', 'Skudai, Johor Bahru', '', '', '0.272 ekar',
      'Pembinaan surau di atas Lot PTD 54139, Jalan Melawati 18, berhampiran Stadium Sultan Ibrahim.',
      'Surau on Lot PTD 54139, Jalan Melawati 18, near Sultan Ibrahim Stadium.', 'surau-melawati.jpg', 120);
    P('kedai-simpang-renggam', 'Kedai Simpang Renggam', 'cadangan', 'commercial', 'Simpang Renggam, Kluang', '', '', '',
      'Cadangan pembangunan kedai di atas Lot 2637 (1,978 meter persegi).', 'Proposed shop development on Lot 2637 (1,978 sq m).', 'kedai-simpang-renggam.jpg', 130);
  }
  if (!get('SELECT 1 x FROM users LIMIT 1')) {
    const email = process.env.ADMIN_EMAIL || 'admin@pijproperty.com';
    const pw = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
    run('INSERT INTO users (email,name,password_hash) VALUES (?,?,?)', email, 'Administrator', bcrypt.hashSync(pw, 10));
    if (!process.env.ADMIN_PASSWORD) console.log(`\n[first run] Admin login: ${email}  password: ${pw}\n(change it in /admin > Pengguna)\n`);
  }
}

module.exports = { db, all, get, run, settings, seed };
