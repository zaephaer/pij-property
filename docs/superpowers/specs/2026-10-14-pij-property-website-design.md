# PIJ Property Website — Design Spec (2026-10-14)

Status: approved by user in chat. Source files: Company Profile v6, Taklimat MAIJ v1, EN AZHAR, CIDB (all in Downloads).

## Goal
Replace pijproperty.com (single page, EN only) with a full bilingual (BM/EN) corporate site and a custom admin CMS.

## Decisions
- Audience: two paths on home — **Beli Rumah** and **Korporat & Perkhidmatan**.
- Languages: BM + EN, `/ms/...` and `/en/...`, switcher in header.
- Public content: project facts + service scope only. No costs, allocations, "pulangan terjamin", contractor names from MAIJ/En Azhar decks.
- Headline figures (En Azhar): 7,862 kediaman, 100 ruang niaga, GDC RM2.16b, GDV RM2.64b.
- Stack: Node.js + Express + SQLite, server-rendered EJS, no build step. VPS + Nginx + HTTPS.
- Admin `/admin`: one role (all admins equal). Modules: Berita, Tender (+keputusan), Projek (+galeri), Pertanyaan (+CSV export), Muat Turun, Kerjaya, Pengguna, Tetapan.
- Enquiry/contact forms: saved in DB + email to `salam@pijproperty.com` (configurable in Tetapan).
- Brand: Primary #106F54, Secondary #F5E03B, Tertiary #E2E8F0, Neutral #F8FAFC; Manrope (headings), Inter (body/labels); logo = green crescent + orange stairs/crane. Logo files: images 1.png / 2.png in session image cache (copy to `assets/`).
- Images: extracted from PPTX + current site now; admin replaces later.
- Contact: Aras 1, Bangunan PIJ Holdings, No. 8, Jalan Bukit Timbalan, 80000 Johor Bahru; +607-226 6366; fax +607-226 6368; Mon–Fri 8:00–17:30, weekends by appointment; company no. 323394-D.
- CIDB: G7 — B04, CE04, CE21, M15; reg 0120160620-JH175989; active until 29/08/2028.

## Sitemap
Home · Projek (list, detail, Skim RMMJ/TPI) · Perkhidmatan (Pembangunan Hartanah, Pengurusan Projek & Penyelenggaraan, Sekolah Agama/Masjid/Surau, Perumahan Asnaf, Wakaf & Baitulmal) · Mengenai Kami (Profil, Visi/Misi/Falsafah, Struktur Kumpulan, Lembaga & Pengurusan, Pensijilan) · Berita · Tender · Kerjaya · Muat Turun · Hubungi.

## Launch projects
- Siap: TPI Datin Halimah, TPI Stulang Baru, TPI Larkin, Alif Sejahtera, TPI Rengit, Kedai Pejabat Rengit.
- Sedang dibangunkan: TPI Telok Permata, Kg Muafakat UDA, Residensi Bangsa Johor @ Pontian, Kedai Pejabat Kluang.
- Cadangan: Masjid Taman Tiara Perdana, Surau Taman Melawati, Kedai Simpang Renggam (labelled "cadangan", not for sale).
- Excluded: TPI Maharani Muar, TPI Bakar Batu.

## Behaviour
- Tender auto-shows "Tutup" after closing date; results published on same page.
- Forms: required fields, honeypot + rate limit; login: bcrypt, session cookie, attempt limit.
- Uploads: type + size limited, stored in `uploads/`.

## Out of scope
Housing application system, supplier accounts, WhatsApp API, multi-level roles.

## Test
One smoke script: public pages 200, form submit stores row, admin login, create news/tender and see it publicly.
