const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { all, get, run, settings } = require('../db');

const r = express.Router();
const WITH_TS = new Set(['news', 'tenders', 'projects', 'downloads', 'careers']);
const ENQ_STATUS = ['baharu', 'dihubungi', 'selesai'];
const UP = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(UP, { recursive: true });

const OK_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf']);
const upload = multer({
  storage: multer.diskStorage({
    destination: UP,
    filename: (req, file, cb) => cb(null, crypto.randomBytes(10).toString('hex') + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 14 },
  fileFilter: (req, file, cb) => cb(null, OK_EXT.has(path.extname(file.originalname).toLowerCase())),
});

// Field helpers: type text | textarea | date | select | image | file | gallery | password
const f = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra });
const STATUS = ['siap', 'sedang', 'cadangan'];
const resources = {
  berita: { table: 'news', label: 'Berita', cols: ['title_ms', 'published_at'], order: 'published_at DESC, id DESC',
    fields: [f('title_ms', 'Tajuk (BM)'), f('title_en', 'Title (EN)'), f('body_ms', 'Kandungan (BM)', 'textarea'), f('body_en', 'Content (EN)', 'textarea'),
      f('image', 'Gambar', 'image'), f('published_at', 'Tarikh siaran', 'date')] },
  tender: { table: 'tenders', label: 'Tender', cols: ['ref', 'title_ms', 'closing_date'], order: 'closing_date DESC, id DESC',
    fields: [f('ref', 'No. rujukan'), f('title_ms', 'Tajuk (BM)'), f('title_en', 'Title (EN)'), f('body_ms', 'Butiran (BM)', 'textarea'), f('body_en', 'Details (EN)', 'textarea'),
      f('closing_date', 'Tarikh tutup', 'date'), f('file', 'Lampiran (PDF)', 'file'), f('result_ms', 'Keputusan (BM)', 'textarea'), f('result_en', 'Result (EN)', 'textarea')] },
  projek: { table: 'projects', label: 'Projek', cols: ['name', 'status', 'location'], order: 'sort, id',
    fields: [f('name', 'Nama projek'), f('slug', 'Slug URL (kosongkan untuk auto)'), f('status', 'Status', 'select', { options: STATUS }),
      f('category', 'Kategori', 'select', { options: ['housing', 'commercial', 'religious'] }), f('location', 'Lokasi'), f('units', 'Unit'), f('gdv', 'GDV'),
      f('area', 'Keluasan'), f('summary_ms', 'Ringkasan (BM)', 'textarea'), f('summary_en', 'Summary (EN)', 'textarea'),
      f('image', 'Gambar utama', 'image'), f('gallery', 'Galeri (pilih beberapa gambar)', 'gallery'), f('sort', 'Susunan (nombor kecil dahulu)', 'number')] },
  pensijilan: { table: 'certifications', label: 'Pensijilan', cols: ['title_ms', 'issuer', 'valid_to'], order: 'sort, id',
    fields: [f('category', 'Kategori', 'select', { options: ['cidb', 'abms', 'lain'] }), f('title_ms', 'Nama sijil (BM)'), f('title_en', 'Certificate name (EN)'),
      f('issuer', 'Badan pensijilan'), f('cert_no', 'No. sijil'), f('badge', 'Lencana ringkas (cth. G7), pilihan'), f('tags', 'Pengkhususan, dipisah koma (pilihan)'),
      f('scope_ms', 'Skop (BM)', 'textarea'), f('scope_en', 'Scope (EN)', 'textarea'), f('valid_from', 'Tarikh berkuat kuasa', 'date'),
      f('valid_to', 'Tarikh tamat (sijil disembunyikan selepas tarikh ini)', 'date'), f('file', 'Fail sijil (PDF/imej)', 'file'), f('sort', 'Susunan (nombor kecil dahulu)', 'number')] },
  'muat-turun': { table: 'downloads', label: 'Muat Turun', cols: ['title_ms'], order: 'id DESC',
    fields: [f('title_ms', 'Tajuk (BM)'), f('title_en', 'Title (EN)'), f('file', 'Fail', 'file')] },
  kerjaya: { table: 'careers', label: 'Kerjaya', cols: ['title_ms', 'closing_date'], order: 'closing_date DESC, id DESC',
    fields: [f('title_ms', 'Jawatan (BM)'), f('title_en', 'Position (EN)'), f('body_ms', 'Butiran (BM)', 'textarea'), f('body_en', 'Details (EN)', 'textarea'), f('closing_date', 'Tarikh tutup', 'date')] },
  pengguna: { table: 'users', label: 'Pengguna', cols: ['name', 'email'], order: 'id',
    fields: [f('name', 'Nama'), f('email', 'Emel', 'email'), f('password_hash', 'Kata laluan (kosongkan jika tidak tukar)', 'password')] },
};

const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const SETTING_LABELS = { notify_email: 'Emel penerima borang', address: 'Alamat', phone: 'Telefon', fax: 'Faks',
  hours_ms: 'Waktu pejabat (BM)', hours_en: 'Office hours (EN)', company_no: 'No. pendaftaran syarikat',
  pdpa_contact_title: 'PDPA: jawatan pihak untuk dihubungi (cth. Pegawai Perlindungan Data)', pdpa_contact_email: 'PDPA: emel pihak untuk dihubungi',
  pdpa_reviewed_at: 'PDPA: tarikh Notis Privasi disemak penasihat undang-undang (YYYY-MM-DD)',
  commitment_ms: 'Integriti: pernyataan komitmen pengurusan (BM)', commitment_en: 'Integrity: management commitment statement (EN)',
  facebook_url: 'Pautan Facebook rasmi (kosong = ikon disembunyikan)',
  linkedin_url: 'Pautan LinkedIn rasmi (kosong = ikon disembunyikan)',
  whistle_email: 'Integriti: emel saluran aduan (kosong = bahagian disembunyikan)', whistle_phone: 'Integriti: telefon saluran aduan (pilihan)' };

r.use((req, res, next) => {
  res.locals.resources = resources; res.locals.me = req.session.user || null; res.locals.flash = null;
  req.session.csrf = req.session.csrf || crypto.randomBytes(16).toString('hex');
  res.locals.csrf = req.session.csrf;
  next();
});

// --- auth ---
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
r.get('/login', (req, res) => res.render('admin/login', { error: null }));
r.post('/login', loginLimiter, (req, res) => {
  const u = get('SELECT * FROM users WHERE email = ?', String(req.body.email || '').trim());
  if (!u || !bcrypt.compareSync(String(req.body.password || ''), u.password_hash)) return res.status(401).render('admin/login', { error: 'Emel atau kata laluan salah.' });
  req.session.regenerate((err) => {
    if (err) throw err;
    req.session.user = { id: u.id, name: u.name, email: u.email };
    req.session.csrf = crypto.randomBytes(16).toString('hex');
    res.redirect('/admin');
  });
});
r.use((req, res, next) => (req.session.user ? next() : res.redirect('/admin/login')));

// multipart bodies must be parsed before the CSRF check reads req.body._csrf
r.use(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }, { name: 'gallery', maxCount: 12 }]));
r.use((req, res, next) => {
  if (req.method === 'POST' && req.body._csrf !== req.session.csrf) return res.status(403).send('Token tidak sah / invalid token');
  next();
});

r.post('/logout', (req, res) => req.session.destroy(() => res.redirect('/admin/login')));

// --- dashboard ---
const dayStr = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
r.get('/', (req, res) => {
  const today = dayStr(0); const in7 = dayStr(7);
  const n = (sql, ...p) => get(sql, ...p).n;
  const attention = [];
  const push = (level, text, href) => attention.push({ level, text, href });

  const newEnq = n("SELECT COUNT(*) n FROM enquiries WHERE status = 'baharu'");
  if (newEnq) push('warn', newEnq + ' pertanyaan baharu belum dibalas', '/admin/pertanyaan');
  all('SELECT id, title_ms, closing_date FROM tenders WHERE closing_date BETWEEN ? AND ? ORDER BY closing_date', today, in7)
    .forEach((t) => push('warn', 'Tender “' + t.title_ms + '” tutup ' + t.closing_date, '/admin/tender/' + t.id));
  all("SELECT id, title_ms FROM tenders WHERE closing_date != '' AND closing_date < ? AND COALESCE(result_ms,'') = '' AND COALESCE(result_en,'') = ''", today)
    .forEach((t) => push('info', 'Tender “' + t.title_ms + '” sudah tutup, keputusan belum disiarkan', '/admin/tender/' + t.id));
  all("SELECT id, title_ms FROM careers WHERE closing_date != '' AND closing_date < ?", today)
    .forEach((c) => push('info', 'Jawatan “' + c.title_ms + '” sudah luput tarikh tutup tetapi masih disiarkan', '/admin/kerjaya/' + c.id));
  all("SELECT id, name FROM projects WHERE COALESCE(image,'') = ''")
    .forEach((p) => push('info', 'Projek “' + p.name + '” belum ada gambar', '/admin/projek/' + p.id));
  const missingEn = n("SELECT (SELECT COUNT(*) FROM news WHERE COALESCE(title_en,'')='') + (SELECT COUNT(*) FROM tenders WHERE COALESCE(title_en,'')='') + (SELECT COUNT(*) FROM projects WHERE COALESCE(summary_en,'')='') + (SELECT COUNT(*) FROM careers WHERE COALESCE(title_en,'')='') AS n");
  if (missingEn) push('info', missingEn + ' kandungan belum ada terjemahan Inggeris', '/admin/berita');

  all("SELECT id, title_ms, valid_to FROM certifications WHERE COALESCE(valid_to,'') != '' ORDER BY valid_to").forEach((c) => {
    if (c.valid_to < today) push('info', 'Sijil \u201C' + c.title_ms + '\u201D sudah luput dan disembunyikan daripada laman', '/admin/pensijilan/' + c.id);
    else if (c.valid_to <= dayStr(60)) push('warn', 'Sijil \u201C' + c.title_ms + '\u201D tamat ' + c.valid_to + ': perbaharui sebelum tarikh itu', '/admin/pensijilan/' + c.id);
  });
  const pst = settings();
  const pdpaGaps = [!pst.pdpa_contact_email && 'pihak untuk dihubungi belum diisi', !pst.pdpa_reviewed_at && 'belum disemak penasihat undang-undang'].filter(Boolean);
  if (pdpaGaps.length) push('warn', 'Notis Privasi belum lengkap: ' + pdpaGaps.join('; '), '/admin/tetapan');
  const soon = n("SELECT COUNT(*) n FROM enquiries WHERE anonymised_at IS NULL AND created_at < datetime('now','-11 months')");
  if (soon) push('info', soon + ' pertanyaan akan dianonimkan dalam 30 hari (tempoh simpanan 12 bulan)', '/admin/pertanyaan');

  // enquiries: last 30 days
  const byDay = Object.fromEntries(all("SELECT substr(created_at,1,10) d, COUNT(*) n FROM enquiries WHERE created_at >= date('now','-29 days') GROUP BY d").map((x) => [x.d, x.n]));
  const days = Array.from({ length: 30 }, (_, i) => { const d = dayStr(i - 29); return { d, n: byDay[d] || 0 }; });

  const statusCount = Object.fromEntries(all('SELECT status, COUNT(*) n FROM projects GROUP BY status').map((x) => [x.status, x.n]));

  const backupDir = path.join(__dirname, '..', '..', 'backups');
  let backupAge = null;
  try { const t = Math.max(0, ...fs.readdirSync(backupDir).map((f) => fs.statSync(path.join(backupDir, f)).mtimeMs)); if (t) backupAge = Math.floor((Date.now() - t) / 864e5); } catch { /* no backups dir */ }
  const st = settings();
  const checklist = [
    { ok: !!process.env.SMTP_HOST, label: 'SMTP dikonfigurasi', hint: 'Tanpa ini, emel notifikasi borang tidak dihantar (pertanyaan masih disimpan).' },
    { ok: /@/.test(st.notify_email || ''), label: 'Emel penerima borang ditetapkan', hint: 'Tetapan → Emel penerima borang' },
    { ok: !!(st.address && st.phone), label: 'Alamat dan telefon diisi', hint: 'Tetapan' },
    { ok: n('SELECT COUNT(*) n FROM users WHERE COALESCE(pw_changed,0) = 0') === 0, label: 'Kata laluan lalai sudah ditukar', hint: 'Pengguna → edit akaun' },
    { ok: backupAge !== null && backupAge <= 7, label: backupAge === null ? 'Tiada sandaran dikesan' : 'Sandaran terakhir ' + backupAge + ' hari lalu', hint: 'Simpan salinan data.sqlite ke folder backups/ (lihat DEPLOY.md)' },
  ];

  checklist.push({ ok: n("SELECT COUNT(*) n FROM certifications WHERE category = 'abms' AND (COALESCE(valid_to,'') = '' OR valid_to >= ?)", today) > 0,
    label: 'Sijil ABMS dimasukkan dan masih sah', hint: 'Admin \u2192 Pensijilan \u2192 + Tambah (kategori abms)' });
  checklist.push({ ok: pdpaGaps.length === 0, label: 'Notis Privasi (PDPA) lengkap', hint: 'Isi pihak untuk dihubungi dan tarikh semakan undang-undang di Tetapan' });

  res.render('admin/dashboard', {
    counts: Object.fromEntries(Object.entries(resources).map(([k, v]) => [k, get('SELECT COUNT(*) n FROM ' + v.table).n])),
    enquiries: n('SELECT COUNT(*) n FROM enquiries'), newEnq, attention: attention.slice(0, 10), attentionTotal: attention.length,
    days, maxDay: Math.max(1, ...days.map((x) => x.n)), total30: days.reduce((s, x) => s + x.n, 0),
    topProjects: all("SELECT project, COUNT(*) n FROM enquiries WHERE project != '' GROUP BY project ORDER BY n DESC LIMIT 5"),
    latestEnq: all('SELECT * FROM enquiries ORDER BY id DESC LIMIT 5'),
    statusCount, projectTotal: Object.values(statusCount).reduce((s, x) => s + x, 0),
    latestNews: all('SELECT id, title_ms, published_at, updated_at FROM news ORDER BY published_at DESC, id DESC LIMIT 3'),
    openTenders: all("SELECT id, title_ms, closing_date, updated_at FROM tenders WHERE closing_date = '' OR closing_date >= ? ORDER BY closing_date LIMIT 3", today),
    checklist,
  });
});

// --- enquiries ---
r.get('/pertanyaan', (req, res) => res.render('admin/enquiries', { rows: all('SELECT * FROM enquiries ORDER BY id DESC') }));
r.get('/pertanyaan.csv', (req, res) => {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`; // neutralise spreadsheet formulas
  const rows = all('SELECT * FROM enquiries ORDER BY id DESC');
  res.type('text/csv').attachment('pertanyaan.csv')
    .send('﻿ID,Tarikh,Nama,Telefon,Emel,Projek,Mesej\n' + rows.map((x) => [x.id, x.created_at, x.name, x.phone, x.email, x.project, x.message].map(q).join(',')).join('\n'));
});
r.post('/pertanyaan/:id/status', (req, res) => {
  if (ENQ_STATUS.includes(req.body.status)) run('UPDATE enquiries SET status = ? WHERE id = ?', req.body.status, Number(req.params.id));
  res.redirect('/admin/pertanyaan');
});
r.post('/pertanyaan/:id/padam', (req, res) => { run('DELETE FROM enquiries WHERE id = ?', Number(req.params.id)); res.redirect('/admin/pertanyaan'); });

// --- settings ---
r.get('/tetapan', (req, res) => res.render('admin/settings', { st: settings(), labels: SETTING_LABELS, saved: req.query.saved === '1' }));
r.post('/tetapan', (req, res) => {
  for (const k of Object.keys(SETTING_LABELS)) {
    if (k in req.body) run('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', k, String(req.body[k]).slice(0, 500));
  }
  res.redirect('/admin/tetapan?saved=1');
});

// --- generic CRUD ---
const resOr404 = (req, res, next) => { req.res_ = resources[req.params.res]; return req.res_ ? next() : res.status(404).send('Tidak dijumpai'); };

r.get('/:res', resOr404, (req, res) => {
  const R = req.res_;
  res.render('admin/list', { key: req.params.res, R, rows: all(`SELECT * FROM ${R.table} ORDER BY ${R.order}`) });
});
r.get('/:res/baru', resOr404, (req, res) => res.render('admin/form', { key: req.params.res, R: req.res_, row: { sort: 100 }, error: null }));
r.get('/:res/:id', resOr404, (req, res, next) => {
  const row = get(`SELECT * FROM ${req.res_.table} WHERE id = ?`, Number(req.params.id));
  return row ? res.render('admin/form', { key: req.params.res, R: req.res_, row, error: null }) : next();
});

function save(req, res) {
  const R = req.res_;
  const id = req.params.id ? Number(req.params.id) : null;
  const old = id ? get(`SELECT * FROM ${R.table} WHERE id = ?`, id) : {};
  if (id && !old) return res.status(404).send('Tidak dijumpai');
  const vals = {};
  for (const fd of R.fields) {
    const files = req.files || {};
    if (fd.type === 'image' || fd.type === 'file') {
      vals[fd.name] = files[fd.name]?.[0] ? '/uploads/' + files[fd.name][0].filename : (old[fd.name] || '');
    } else if (fd.type === 'gallery') {
      const added = (files[fd.name] || []).map((x) => '/uploads/' + x.filename);
      vals[fd.name] = [...(old[fd.name] ? old[fd.name].split(',') : []), ...added].join(',');
    } else if (fd.type === 'password') {
      const pw = String(req.body[fd.name] || '');
      if (pw && pw.length < 10) return res.status(400).render('admin/form', { key: req.params.res, R, row: { ...old, ...req.body }, error: 'Kata laluan minimum 10 aksara.' });
      if (!pw && !id) return res.status(400).render('admin/form', { key: req.params.res, R, row: { ...req.body }, error: 'Kata laluan diperlukan.' });
      vals[fd.name] = pw ? bcrypt.hashSync(pw, 10) : old[fd.name];
    } else {
      vals[fd.name] = String(req.body[fd.name] ?? '').slice(0, 20000);
    }
  }
  if (WITH_TS.has(R.table)) vals.updated_at = new Date().toISOString();
  if (R.table === 'users' && String(req.body.password_hash || '')) vals.pw_changed = 1;
  if (R.table === 'projects') vals.slug = slugify(vals.slug || vals.name) || `projek-${Date.now()}`;
  const cols = Object.keys(vals);
  try {
    if (id) run(`UPDATE ${R.table} SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`, ...cols.map((c) => vals[c]), id);
    else run(`INSERT INTO ${R.table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`, ...cols.map((c) => vals[c]));
  } catch (e) {
    return res.status(400).render('admin/form', { key: req.params.res, R, row: { ...old, ...req.body }, error: 'Gagal simpan (data pendua?): ' + e.message });
  }
  res.redirect('/admin/' + req.params.res);
}
r.post('/:res/baru', resOr404, save);
r.post('/:res/:id', resOr404, save);
r.post('/:res/:id/padam', resOr404, (req, res) => {
  if (req.params.res === 'pengguna' && get('SELECT COUNT(*) n FROM users').n <= 1) return res.status(400).send('Tidak boleh padam pengguna terakhir.');
  run(`DELETE FROM ${req.res_.table} WHERE id = ?`, Number(req.params.id));
  res.redirect('/admin/' + req.params.res);
});

module.exports = r;
