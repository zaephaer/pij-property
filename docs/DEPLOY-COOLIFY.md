# Deploy dengan Coolify (Ubuntu) + Cloudflare Tunnel

Status: **disediakan, belum dilaksanakan.** Langkah Cloudflare menunggu pemindahan domain selesai.

## 1. Sumber
- Resource baharu → **Private Repository** (GitHub) → `zaephaer/pij-property`, cabang `main`.
- **Build pack: Dockerfile** (fail `Dockerfile` di akar repo).
- **Port:** `3000`.
- **Health check path:** `/healthz` (jawapan `ok`).

## 2. Volume berterusan (WAJIB)
Kontena dibina semula setiap deploy. Tanpa volume, pangkalan data dan fail muat naik **hilang**.

| Laluan dalam kontena | Isi |
|---|---|
| `/app/data` | `data.sqlite` (pangkalan data) |
| `/app/uploads` | gambar/PDF yang dimuat naik melalui admin |
| `/app/backups` | sandaran harian pangkalan data |

Guna **named volume** (lalai Coolify) supaya pemilikan fail betul untuk pengguna `node`. Jika memilih bind mount, jalankan `chown -R 1000:1000` pada folder hos.

## 3. Pemboleh ubah persekitaran
| Nama | Nilai |
|---|---|
| `NODE_ENV` | `production` (sudah ditetapkan dalam imej) |
| `SESSION_SECRET` | rentetan rawak panjang (`openssl rand -hex 32`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | akaun admin pertama (run pertama sahaja; kemudian padam daripada env) |
| `SMTP_HOST` | `smtp-relay.brevo.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` / `SMTP_PASS` | kelayakan SMTP Brevo |
| `MAIL_FROM` | `salam@pijproperty.com` (domain mesti disahkan di Brevo) |
| `TRUST_PROXY` | **`2`** di belakang Cloudflare Tunnel + Traefik (lihat nota 6) |

## 4. Sandaran
- **Tugas berjadual Coolify** (harian): `node scripts/backup.js`. Ia mencipta `/app/backups/data-YYYY-MM-DD.sqlite` dan membuang yang lebih 30 hari.
- **Salinan luar server:** `rclone` (atau `rsync`) pada hos Ubuntu menyalin `backups/` dan `uploads/` (tokokan, bukan salinan penuh harian) ke destinasi yang dipilih. Skrip ini disediakan selepas destinasi diputuskan.
- Dashboard admin menyemak fail terbaru dalam `/app/backups` (amaran jika lebih 7 hari).

## 5. Cloudflare (BELUM, tunggu domain)
1. Domain di Cloudflare (nameserver ditukar).
2. **Tunnel**: Coolify → Server → Cloudflare Tunnel (atau `cloudflared` manual). Hostname awam `pijproperty.com` dan `www.pijproperty.com` menuju ke servis Coolify (HTTP, port 80 Traefik).
3. **Cloudflare Access**: aplikasi "Self-hosted" pada laluan `pijproperty.com/admin*` (dan `www`), polisi hanya emel kakitangan yang dibenarkan.
4. **Email Routing**: `salam@pijproperty.com` → 2–3 peti mel kakitangan (setiap alamat disahkan sekali).
5. **Brevo**: sahkan domain; masukkan rekod SPF/DKIM/DMARC dalam Cloudflare DNS.
6. Putuskan sambungan domain daripada Canva sebelum menukar DNS; laman Canva dimatikan.

## 6. Nota
- **Sesi admin** disimpan dalam SQLite (`sessions`, pada volume `/app/data`), jadi deploy semula **tidak** melog keluar admin, **dengan syarat `SESSION_SECRET` tetap** (jika tidak ditetapkan, log amaran dipaparkan semasa mula).
- **Alamat IP pelawat:** had kadar borang menggunakan `req.ip`. Jika `TRUST_PROXY` salah, semua pelawat kelihatan sebagai satu IP dan had 8 borang/15 minit terpakai kepada **semua** pelawat. Uji selepas deploy: hantar borang dari dua rangkaian berbeza.
- **Kemas kini:** `git push` ke `main` → Coolify membina dan menggantikan kontena (data kekal pada volume).
- **Pemulihan:** salin `data-YYYY-MM-DD.sqlite` ke `/app/data/data.sqlite` (hentikan aplikasi dahulu), dan `uploads/` ke `/app/uploads`.
