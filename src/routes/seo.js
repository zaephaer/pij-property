// robots.txt and sitemap.xml. Host comes from the request, so every hostname the site is served on
// (pijproperty.com / www.pijproperty.com) gets a sitemap with its own absolute URLs.
const express = require('express');
const { all } = require('../db');
const content = require('../content');
const menuFlags = require('../menu');

const r = express.Router();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const origin = (req) => `${req.protocol}://${req.get('host')}`;
const day = (s) => (s ? String(s).slice(0, 10) : '');

r.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /*?', '', `Sitemap: ${origin(req)}/sitemap.xml`, ''].join('\n'),
  );
});

r.get('/sitemap.xml', (req, res) => {
  const base = origin(req);
  const m = menuFlags();
  const items = []; // { rel: path after /{lang}, lastmod, slug?: {ms,en} }
  const add = (rel, lastmod, slug) => items.push({ rel, lastmod: day(lastmod), slug });

  add('', null);
  add('/projek');
  add('/projek/skim-rmmj-tpi');
  add('/perkhidmatan');
  content.groups.services.forEach((k) => add(`/perkhidmatan/${k}`));
  content.groups.about.forEach((k) => add(`/kenali-kami/${k}`));
  add('/hubungi');
  add('/notis-privasi', null, { ms: '/notis-privasi', en: '/privacy-notice' });
  if (m.news) add('/berita');
  if (m.tenders) add('/tender');
  if (m.careers) add('/kerjaya');
  if (m.downloads) add('/muat-turun');

  all('SELECT slug, updated_at FROM projects ORDER BY sort').forEach((p) => add(`/projek/${p.slug}`, p.updated_at));
  all('SELECT id, published_at, updated_at FROM news ORDER BY id').forEach((n) => add(`/berita/${n.id}`, n.updated_at || n.published_at));
  all('SELECT id, updated_at FROM tenders ORDER BY id').forEach((t) => add(`/tender/${t.id}`, t.updated_at));

  const loc = (it, l) => `${base}/${l}${it.slug ? it.slug[l] : it.rel}`;
  const urls = [];
  for (const it of items) {
    const alt = ['ms', 'en'].map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(loc(it, l))}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(loc(it, 'ms'))}"/>`).join('\n');
    for (const l of ['ms', 'en']) {
      urls.push(`  <url>\n    <loc>${esc(loc(it, l))}</loc>\n${it.lastmod ? `    <lastmod>${it.lastmod}</lastmod>\n` : ''}${alt}\n  </url>`);
    }
  }
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
  );
});

module.exports = r;
