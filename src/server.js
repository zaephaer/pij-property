const express = require('express');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const { seed } = require('./db');

seed();

const { anonymiseExpired } = require('./retention');
const sweep = () => {
  try { const n = anonymiseExpired(); if (n) console.log(`[pdpa] anonymised ${n} expired enquiries`); } catch (e) { console.error('[pdpa] sweep failed', e); }
};
sweep();
setInterval(sweep, 24 * 3600 * 1000).unref();

const app = express();
app.use(require('compression')());
const root = path.join(__dirname, '..');
app.set('view engine', 'ejs');
app.set('views', path.join(root, 'views'));
// Hops between the visitor and this app (Cloudflare Tunnel -> Coolify/Traefik is usually 2). Wrong value => every visitor shares one IP for rate limiting.
app.set('trust proxy', process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : 1);
app.get('/healthz', (req, res) => res.type('text').send('ok'));
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
  next();
});
// CSS revalidates on every load (ETag) so style changes show immediately; images stay cached.
// Fonts never change under the same name: cache for a year.
app.use('/fonts', express.static(path.join(root, 'public', 'fonts'), { maxAge: '365d', immutable: true }));
app.use('/admin', (req, res, next) => { res.set('X-Robots-Tag', 'noindex, nofollow'); next(); });
app.use(require('./routes/seo'));
app.use('/css', express.static(path.join(root, 'public', 'css'), { maxAge: 0 }));
app.use(express.static(path.join(root, 'public'), { maxAge: '7d' }));
app.use('/uploads', express.static(path.join(root, 'uploads'), { maxAge: '7d' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// Sessions are stored in SQLite (see session-store.js) so they survive restarts/deploys,
// but only if SESSION_SECRET is stable: a random per-boot secret invalidates every cookie.
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') console.warn('[config] SESSION_SECRET is not set: admins will be logged out on every restart');
const secret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
// Cloudflare Tunnel -> Traefik: Traefik rewrites X-Forwarded-Proto to "http" (it only saw the tunnel's plain-HTTP hop),
// so Express thinks the visitor is on http and refuses to set the Secure session cookie (admin login loops).
// Cloudflare's own CF-Visitor header still carries the visitor's real scheme.
app.use((req, res, next) => {
  try { if (JSON.parse(req.headers['cf-visitor'] || '{}').scheme === 'https') req.headers['x-forwarded-proto'] = 'https'; } catch { /* malformed header: ignore */ }
  next();
});

app.use(session({
  store: new (require('./session-store'))(),
  secret, resave: false, saveUninitialized: false, name: 'pij.sid',
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 3600 * 1000 },
}));

app.use('/admin', require('./routes/admin'));
app.get('/', (req, res) => res.redirect(`/${req.acceptsLanguages('ms', 'en') || 'ms'}`));
for (const l of ['ms', 'en']) app.use('/' + l, (req, res, next) => { req.lang = l; next(); }, require('./routes/public'));

app.use((req, res) => res.status(404).render('404', {
  S: require('./i18n').S.ms, lang: 'ms', base: '/ms', st: require('./db').settings(), path: '', nav: { about: [], services: [] }, menu: require('./menu')(), siteUrl: `${req.protocol}://${req.get('host')}`, noindex: true,
}));
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).send('Ralat pelayan / Server error');
});

const port = process.env.PORT || 3000;
if (require.main === module) app.listen(port, () => console.log(`PIJ Property on http://localhost:${port}`));
module.exports = app;

