# Deploy (VPS, Node 22.5+)

```bash
npm ci --omit=dev
cp .env.example .env   # fill values, then export them (or use systemd EnvironmentFile)
NODE_ENV=production node src/server.js
```

Env vars: `PORT`, `SESSION_SECRET` (long random), `ADMIN_EMAIL`, `ADMIN_PASSWORD` (first run only),
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `DB_FILE` (optional path).

- Run under systemd or pm2; put Nginx in front with HTTPS (Let's Encrypt) and `proxy_pass http://127.0.0.1:3000`.
- Set `client_max_body_size 12m;` in Nginx (uploads up to 10 MB).
- Back up `data.sqlite` and `uploads/` nightly into `backups/` (e.g. `sqlite3 data.sqlite ".backup backups/data-$(date +%F).sqlite"`). The admin Dashboard checklist reads the newest file in `backups/`.
- Without `SMTP_HOST`, enquiries are still stored and shown in /admin/pertanyaan; no email is sent.
- Smoke test: `npm test`.
- PDPA: the server anonymises enquiries older than 12 months on start and then every 24 h (see `src/retention.js`). Fill **Admin > Tetapan > PDPA** (contact + legal review date) before go-live; the Privacy Notice text in `src/privacy-content.js` is a draft for legal review.
