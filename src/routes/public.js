const express = require('express');
const rateLimit = require('express-rate-limit');
const { all, get, run, settings } = require('../db');
const { S, pick, fmtDate } = require('../i18n');
const content = require('../content');
const { services: SVC, ICON } = require('../services-data');
const { notify } = require('../mail');
const menuFlags = require('../menu');
const PRIVACY = require('../privacy-content');

const r = express.Router();
const today = () => new Date().toISOString().slice(0, 10);

// Locals available to every view.
r.use((req, res, next) => {
  const lang = req.lang;
  res.locals = {
    ...res.locals, lang, S: S[lang], st: settings(), pick: (row, f) => pick(row, f, lang),
    date: (d) => fmtDate(d, lang), path: req.path, base: `/${lang}`,
    nav: { about: content.groups.about.map((k) => ({ slug: k, title: content.about[k].title[lang] })),
      services: content.groups.services.map((k) => ({ slug: k, title: content.services[k].title[lang] })) },
    menu: menuFlags(),
    siteUrl: `${req.protocol}://${req.get('host')}`,
    noindex: Object.keys(req.query).length > 0, // filtered/flash URLs duplicate the clean page
    sent: req.query.sent === '1', formErr: String(req.query.err || ''), flash: null,
  };
  next();
});

const tenderState = (t) => ({ ...t, closed: !!t.closing_date && t.closing_date < today() });

r.get('/', (req, res) => {
  res.render('home', {
    featured: all("SELECT * FROM projects WHERE status IN ('sedang','siap') AND image != '' ORDER BY CASE status WHEN 'sedang' THEN 0 ELSE 1 END, sort LIMIT 6"),
    news: all('SELECT * FROM news ORDER BY published_at DESC, id DESC LIMIT 3'),
    tenders: all('SELECT * FROM tenders ORDER BY closing_date DESC LIMIT 20').map(tenderState).filter((t) => !t.closed).slice(0, 3),
  });
});

r.get('/projek', (req, res) => {
  const status = ['siap', 'sedang', 'cadangan'].includes(req.query.status) ? req.query.status : '';
  const category = ['housing', 'commercial', 'religious'].includes(req.query.category) ? req.query.category : '';
  const where = []; const args = [];
  if (status) { where.push('status = ?'); args.push(status); }
  if (category) { where.push('category = ?'); args.push(category); }
  const projects = all(`SELECT * FROM projects ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY sort`, ...args);
  res.render('projects', { projects, status, category });
});

r.get('/projek/skim-rmmj-tpi', (req, res) => res.render('rmmj'));

r.get('/projek/:slug', (req, res, next) => {
  const p = get('SELECT * FROM projects WHERE slug = ?', req.params.slug);
  if (!p) return next();
  res.render('project', { p, gallery: (p.gallery || '').split(',').filter(Boolean) });
});

const ABOUT_VIEW = { 'visi-misi': 'visimisi', profil: 'about_profil', struktur: 'about_struktur', pensijilan: 'about_pensijilan', integriti: 'about_integriti' };
// Certificates past valid_to are hidden automatically (never advertise an expired certification).
const activeCerts = () => all("SELECT * FROM certifications WHERE COALESCE(valid_to,'') = '' OR valid_to >= ? ORDER BY sort, id", today());
const staticPage = (set, group) => (req, res, next) => {
  const pg = content[set][req.params.slug];
  if (!pg) return next();
  const view = set === 'about' ? (ABOUT_VIEW[req.params.slug] || 'page') : (SVC[req.params.slug] ? 'service' : 'page');
  res.render(view, { pg, group, pageTitle: pg.title[req.lang], svc: SVC[req.params.slug], ICON, certs: set === 'about' ? activeCerts() : [], INTEGRITY: require('../integrity-content') });
};
r.get('/perkhidmatan', (req, res) => res.render('services_index', {
  items: content.groups.services.map((k) => ({ slug: k, image: SVC[k].image, title: content.services[k].title[req.lang], lead: content.services[k].lead[req.lang] })),
}));
r.get('/perkhidmatan/:slug', staticPage('services', 'services'));
r.get('/kenali-kami/:slug', staticPage('about', 'about'));
// old URL kept alive: permanent redirect so bookmarks and links don't break
r.get('/mengenai-kami/:slug', (req, res) => res.redirect(301, `/${req.lang}/kenali-kami/${req.params.slug}`));

r.get('/berita', (req, res) => res.render('news', { items: all('SELECT * FROM news ORDER BY published_at DESC, id DESC') }));
r.get('/berita/:id', (req, res, next) => {
  const n = get('SELECT * FROM news WHERE id = ?', Number(req.params.id));
  return n ? res.render('news_item', { n }) : next();
});

r.get('/tender', (req, res) => res.render('tenders', {
  items: all('SELECT * FROM tenders ORDER BY closing_date DESC, id DESC').map(tenderState),
}));
r.get('/tender/:id', (req, res, next) => {
  const t = get('SELECT * FROM tenders WHERE id = ?', Number(req.params.id));
  return t ? res.render('tender', { t: tenderState(t) }) : next();
});

r.get('/kerjaya', (req, res) => res.render('careers', {
  items: all('SELECT * FROM careers ORDER BY closing_date DESC, id DESC').map((c) => ({ ...c, closed: !!c.closing_date && c.closing_date < today() })),
}));
r.get('/muat-turun', (req, res) => res.render('downloads', { items: all('SELECT * FROM downloads ORDER BY id DESC') }));
r.get(['/notis-privasi', '/privacy-notice'], (req, res) => {
  const st = res.locals.st;
  const contact = st.pdpa_contact_email
    ? (st.pdpa_contact_title ? st.pdpa_contact_title + ' (' + st.pdpa_contact_email + ')' : st.pdpa_contact_email)
    : st.notify_email; // interim until the PDPA contact is set in admin
  const fill = (s) => s.replace('{company_no}', st.company_no).replace('{address}', String(st.address).replace(/\s*\n\s*/g, ', ')).replace('{contact}', contact);
  res.render('privacy', { P: PRIVACY, fill, pageTitle: PRIVACY.title[req.lang] });
});
r.get('/hubungi', (req, res) => res.render('contact', { projects: all('SELECT name FROM projects ORDER BY sort'), selected: req.query.projek || '' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false });
const clean = (v, n) => String(v || '').trim().slice(0, n);
r.post('/enquiry', limiter, async (req, res) => {
  const back = clean(req.body.back, 200);
  const dest = back.startsWith(`/${req.lang}/`) ? back.split('?')[0] : `/${req.lang}/hubungi`;
  if (req.body.website) return res.redirect(`${dest}?sent=1`); // honeypot: pretend success
  if (req.body.consent !== 'on') return res.redirect(`${dest}?err=consent`);
  const name = clean(req.body.name, 120); const phone = clean(req.body.phone, 40);
  const email = clean(req.body.email, 120); const project = clean(req.body.project, 160);
  const message = clean(req.body.message, 2000);
  const emailOk = !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!name || (!phone && !email) || !emailOk) return res.redirect(`${dest}?err=1`);
  run('INSERT INTO enquiries (name,phone,email,project,message,consent_at) VALUES (?,?,?,?,?,?)', name, phone, email, project, message, new Date().toISOString());
  await notify(settings().notify_email, `Pertanyaan baharu: ${name}`,
    `Nama: ${name}\nTelefon: ${phone}\nEmel: ${email}\nProjek: ${project}\n\n${message}`);
  res.redirect(`${dest}?sent=1`);
});

module.exports = r;


