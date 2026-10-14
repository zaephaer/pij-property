// Minimal express-session store on the app's SQLite file.
// Why: MemoryStore leaks and logs every admin out on each deploy; this lives on the persistent data volume.
const session = require('express-session');
const { db } = require('./db');

db.exec('CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, sess TEXT NOT NULL, expires INTEGER NOT NULL)');

const DEFAULT_TTL = 8 * 3600 * 1000;
const expiresAt = (sess) => {
  const e = sess && sess.cookie && sess.cookie.expires;
  const t = e ? new Date(e).getTime() : NaN;
  return Number.isFinite(t) ? t : Date.now() + DEFAULT_TTL;
};

class SqliteStore extends session.Store {
  get(sid, cb) {
    try {
      const row = db.prepare('SELECT sess, expires FROM sessions WHERE sid = ?').get(sid);
      if (!row || row.expires < Date.now()) return cb(null, null);
      cb(null, JSON.parse(row.sess));
    } catch (e) { cb(e); }
  }

  set(sid, sess, cb) {
    try {
      db.prepare('INSERT INTO sessions (sid, sess, expires) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expires = excluded.expires')
        .run(sid, JSON.stringify(sess), expiresAt(sess));
      if (cb) cb(null);
    } catch (e) { if (cb) cb(e); }
  }

  touch(sid, sess, cb) { this.set(sid, sess, cb); }

  destroy(sid, cb) {
    try { db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid); if (cb) cb(null); } catch (e) { if (cb) cb(e); }
  }
}

const prune = () => { try { db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now()); } catch (e) { console.error('[sessions] prune failed', e); } };
prune();
setInterval(prune, 6 * 3600 * 1000).unref();

module.exports = SqliteStore;
