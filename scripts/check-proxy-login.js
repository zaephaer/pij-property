// Regression check: admin login must work behind Cloudflare Tunnel -> Traefik (production mode). Run: node scripts/check-proxy-login.js
const { spawn } = require('child_process');
const fs = require('fs'); const os = require('os'); const path = require('path');
const root = path.join(__dirname, '..');
const t = fs.mkdtempSync(path.join(os.tmpdir(), 'pij-proxy-'));
fs.mkdirSync(path.join(t, 'data'));
const env = { ...process.env, NODE_ENV: 'production', PORT: '3986', DB_FILE: path.join(t, 'data', 'data.sqlite'),
  SESSION_SECRET: 'x'.repeat(48), ADMIN_EMAIL: 'p@example.com', ADMIN_PASSWORD: 'proxy-test-password', TRUST_PROXY: '2' };
const base = 'http://127.0.0.1:3986';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const body = new URLSearchParams({ email: 'p@example.com', password: 'proxy-test-password' }).toString();

async function login(label, extra) {
  const r = await fetch(base + '/admin/login', { method: 'POST', redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...extra }, body });
  const sc = r.headers.get('set-cookie');
  const cookie = sc ? sc.split(';')[0] : '';
  let landed = '(no cookie)';
  if (cookie) { const d = await fetch(base + '/admin', { redirect: 'manual', headers: { cookie, ...extra } }); landed = '/admin -> ' + d.status; }
  console.log(label.padEnd(44), 'login', r.status, '| cookie:', sc ? 'set' : 'MISSING', '|', landed);
}

(async () => {
  const srv = spawn('node', ['src/server.js'], { cwd: root, env, stdio: 'ignore' });
  for (let i = 0; i < 40; i++) { try { if ((await fetch(base + '/healthz')).ok) break; } catch { /* starting */ } await sleep(250); }
  // Traefik: XFP http, but Cloudflare's CF-Visitor still says https
  await login('Cloudflare->Traefik (XFP=http, CF-Visitor=https)', { 'x-forwarded-proto': 'http', 'cf-visitor': '{"scheme":"https"}', 'x-forwarded-for': '203.0.113.5' });
  await login('direct plain http (should NOT get a cookie)', { 'x-forwarded-proto': 'http' });
  await login('proxy that already forwards XFP=https', { 'x-forwarded-proto': 'https' });
  srv.kill(); await sleep(500);
  try { fs.rmSync(t, { recursive: true, force: true }); } catch { /* temp */ }
  process.exit(0);
})();
