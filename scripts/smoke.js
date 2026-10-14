// Smoke test: node scripts/smoke.js  (uses a temp DB, no framework)
const os = require('os'); const path = require('path'); const fs = require('fs'); const assert = require('assert');
const dbFile = path.join(os.tmpdir(), `pij-smoke-${Date.now()}.sqlite`);
process.env.DB_FILE = dbFile; process.env.ADMIN_EMAIL = 'test@example.com'; process.env.ADMIN_PASSWORD = 'smoke-test-password';

const app = require('../src/server');
const server = app.listen(0, async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';
  const req = async (p, opt = {}) => {
    const r = await fetch(base + p, { redirect: 'manual', ...opt, headers: { cookie, ...(opt.headers || {}) } });
    const sc = r.headers.get('set-cookie'); if (sc) cookie = sc.split(';')[0];
    return r;
  };
  const form = (o) => ({ method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(o).toString() });
  try {
    for (const p of ['/ms', '/en', '/ms/projek', '/ms/projek/tpi-larkin', '/ms/perkhidmatan/perumahan-asnaf', '/en/kenali-kami/pensijilan',
      '/ms/berita', '/ms/tender', '/ms/kerjaya', '/ms/muat-turun', '/ms/hubungi', '/ms/projek/skim-rmmj-tpi']) {
      const r = await req(p); assert.strictEqual(r.status, 200, `${p} -> ${r.status}`);
    }
    assert.strictEqual((await req('/ms/tiada')).status, 404);
    const old = await req('/ms/mengenai-kami/profil');
    assert.strictEqual(old.status, 301);
    assert.strictEqual(old.headers.get('location'), '/ms/kenali-kami/profil');

    // dynamic menu: empty DB -> optional items hidden
    const home0 = await (await req('/ms')).text();
    for (const p of ['berita', 'tender', 'kerjaya', 'muat-turun']) assert.ok(!home0.includes(`href="/ms/${p}"`), `${p} should be hidden when empty`);

    // enquiry stored
    // PDPA: no consent -> rejected, nothing stored
    const noConsent = await req('/ms/enquiry', form({ name: 'Tanpa', phone: '0123456789', back: '/ms/hubungi' }));
    assert.strictEqual(noConsent.status, 302);
    assert.ok(noConsent.headers.get('location').includes('err=consent'), 'missing consent must be rejected');
    const dbm = require('../src/db');
    assert.strictEqual(dbm.get("SELECT COUNT(*) n FROM enquiries WHERE name = 'Tanpa'").n, 0);

    const e = await req('/ms/enquiry', form({ name: 'Ali', phone: '0123456789', back: '/ms/hubungi', consent: 'on' }));
    assert.strictEqual(e.status, 302);
    assert.ok(dbm.get("SELECT consent_at c FROM enquiries WHERE name = 'Ali'").c, 'consent timestamp stored');

    // PDPA: notice pages + footer link + self-hosted fonts (no Google)
    for (const p of ['/ms/notis-privasi', '/en/privacy-notice']) assert.strictEqual((await req(p)).status, 200, p);
    const ph = await (await req('/ms/notis-privasi')).text();
    assert.ok(ph.includes('/fonts.css') || ph.includes('/css/fonts.css'), 'fonts.css linked');
    assert.ok(!ph.includes('googleapis'), 'no Google Fonts request');
    assert.ok(ph.includes('href="/ms/notis-privasi"'), 'footer notice link');

    // Certifications + Integriti page
    const ip = await (await req('/ms/kenali-kami/integriti')).text();
    assert.ok(ip.includes('Integriti &amp; Anti-Rasuah'), 'integrity page renders');
    assert.ok(!ip.includes('Saluran aduan'), 'whistleblowing hidden when no contact set');
    assert.ok(!ip.includes('ABMS Ujian'), 'no ABMS claim before a cert exists');
    const cp = await (await req('/ms/kenali-kami/pensijilan')).text();
    assert.ok(cp.includes('0120160620-JH175989'), 'seeded CIDB certificate shown');
    dbm.run("INSERT INTO certifications (category,title_ms,title_en,issuer,cert_no,valid_from,valid_to,sort) VALUES ('abms','ABMS Ujian Sah','ABMS Valid Test','Badan X','ABMS-1','2026-01-01','2099-01-01',20)");
    dbm.run("INSERT INTO certifications (category,title_ms,title_en,issuer,cert_no,valid_from,valid_to,sort) VALUES ('abms','ABMS Ujian Luput','ABMS Expired Test','Badan X','ABMS-0','2020-01-01','2021-01-01',21)");
    const ip2 = await (await req('/ms/kenali-kami/integriti')).text();
    assert.ok(ip2.includes('ABMS Ujian Sah'), 'valid ABMS shown');
    assert.ok(!ip2.includes('ABMS Ujian Luput'), 'expired ABMS auto-hidden');
    dbm.run("UPDATE settings SET value = 'aduan@example.com' WHERE key = 'whistle_email'");
    assert.ok((await (await req('/ms/kenali-kami/integriti')).text()).includes('aduan@example.com'), 'channel appears once filled');

    // PDPA: retention -> anonymise rows older than 12 months, keep date + project
    dbm.run("INSERT INTO enquiries (name,phone,email,project,message,created_at,consent_at) VALUES ('Lama','011','a@b.co','TPI Larkin','hi',datetime('now','-13 months'),'x')");
    const { anonymiseExpired } = require('../src/retention');
    assert.ok(anonymiseExpired() >= 1);
    const expired = dbm.get("SELECT * FROM enquiries WHERE project = 'TPI Larkin' AND anonymised_at IS NOT NULL");
    assert.ok(expired && expired.phone === '' && expired.email === '' && expired.message === '' && expired.name !== 'Lama', 'personal data erased');
    assert.strictEqual(dbm.get("SELECT COUNT(*) n FROM enquiries WHERE name = 'Ali' AND anonymised_at IS NULL").n, 1, 'recent rows untouched');

    // admin gate + login
    assert.strictEqual((await req('/admin')).status, 302);
    const bad = await req('/admin/login', form({ email: 'test@example.com', password: 'wrong' })); assert.strictEqual(bad.status, 401);
    const ok = await req('/admin/login', form({ email: 'test@example.com', password: 'smoke-test-password' })); assert.strictEqual(ok.status, 302);
    const dash = await req('/admin'); assert.strictEqual(dash.status, 200);
    const csrf = /name="_csrf" value="([a-f0-9]+)"/.exec(await dash.text())[1];

    // CSRF enforced
    assert.strictEqual((await req('/admin/berita/baru', form({ title_ms: 'x' }))).status, 403);

    // create news + tender, visible publicly
    const mk = async (p, o) => {
      const fd = new FormData(); fd.append('_csrf', csrf); for (const [k, v] of Object.entries(o)) fd.append(k, v);
      return req(p, { method: 'POST', body: fd });
    };
    assert.strictEqual((await mk('/admin/berita/baru', { title_ms: 'Berita Ujian', title_en: 'Test News', published_at: '2026-10-01' })).status, 302);
    assert.strictEqual((await mk('/admin/tender/baru', { ref: 'T/1', title_ms: 'Tender Lama', closing_date: '2020-01-01' })).status, 302);
    const home1 = await (await req('/ms')).text();
    for (const p of ['berita', 'tender']) assert.ok(home1.includes(`href="/ms/${p}"`), `${p} should appear once a record exists`);
    assert.ok(!home1.includes('href="/ms/kerjaya"'), 'kerjaya still empty -> hidden');
    assert.ok((await (await req('/ms/berita')).text()).includes('Berita Ujian'));
    assert.ok((await (await req('/ms/tender')).text()).includes('Tutup'), 'past tender must show Tutup');
    assert.ok((await (await req('/admin/pertanyaan.csv')).text()).includes('Ali'));
    console.log('SMOKE OK');
  } catch (err) { console.error('SMOKE FAIL:', err.message); process.exitCode = 1; }
  server.close();
  try { fs.rmSync(dbFile, { force: true }); } catch { /* Windows keeps the sqlite file locked until exit; temp dir cleans it */ }
  process.exit(process.exitCode || 0);
});
