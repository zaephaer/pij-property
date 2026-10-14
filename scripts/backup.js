// Consistent SQLite snapshot (safe while the site is running) + pruning.
//   node scripts/backup.js
// Env: DB_FILE, BACKUP_DIR (default ../backups), BACKUP_KEEP_DAYS (default 30)
// Off-server copy of backups/ and uploads/ is done separately (rclone/rsync), see docs/DEPLOY-COOLIFY.md.
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const src = process.env.DB_FILE || path.join(__dirname, '..', 'data.sqlite');
const dir = process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups');
const keepDays = Number(process.env.BACKUP_KEEP_DAYS || 30);

if (!fs.existsSync(src)) { console.error('Database not found:', src); process.exit(1); }
fs.mkdirSync(dir, { recursive: true });

const out = path.join(dir, `data-${new Date().toISOString().slice(0, 10)}.sqlite`);
if (fs.existsSync(out)) fs.rmSync(out);

const db = new DatabaseSync(src);
db.exec(`VACUUM INTO '${out.replace(/'/g, "''")}'`);
db.close();

let pruned = 0;
for (const f of fs.readdirSync(dir)) {
  if (!/^data-\d{4}-\d{2}-\d{2}\.sqlite$/.test(f)) continue;
  const p = path.join(dir, f);
  if (Date.now() - fs.statSync(p).mtimeMs > keepDays * 864e5) { fs.rmSync(p); pruned++; }
}
console.log(`backup ok: ${out} (${Math.round(fs.statSync(out).size / 1024)} KB), pruned ${pruned}`);
