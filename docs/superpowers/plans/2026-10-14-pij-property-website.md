# PIJ Property Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Bilingual (BM/EN) corporate site + custom admin CMS per `docs/superpowers/specs/2026-10-14-pij-property-website-design.md`.

**Architecture:** One Express app, SQLite via `better-sqlite3`, EJS server-rendered views, `/ms` & `/en` route prefixes, `/admin` behind session login. No build step.

**Tech Stack:** Node.js, express, better-sqlite3, ejs, express-session, bcryptjs, multer, nodemailer, express-rate-limit.

---

## File map
- `package.json`, `.env.example`
- `src/server.js` — app wiring, middleware, routes mount
- `src/db.js` — schema + seed (settings, projects, services)
- `src/i18n.js` — UI strings ms/en, `t()` helper, lang middleware
- `src/routes/public.js` — all public pages + enquiry form POST
- `src/routes/admin.js` — login/logout, CRUD for news/tenders/projects/downloads/careers/users/settings, enquiries + CSV
- `src/mail.js` — nodemailer wrapper (no-op if SMTP unset)
- `views/` — `layout`, public pages, `admin/` pages, partials
- `public/css/site.css`, `public/css/admin.css`, `public/img/` (logo, extracted images)
- `uploads/` — admin uploads
- `scripts/smoke.js` — smoke test
- `DEPLOY.md` — VPS/Nginx/backup notes

## Tasks
- [ ] **T1 Scaffold:** package.json, install deps, server.js boots, `/` returns 200.
- [ ] **T2 DB + seed:** schema for news, tenders, projects, downloads, careers, enquiries, users, settings; seed launch projects (spec list) and default admin from env.
- [ ] **T3 i18n + layout + design system:** CSS tokens from spec, header with language switch, footer with contact data from settings.
- [ ] **T4 Public pages:** home (two paths + stats), projects list/detail, RMMJ/TPI, 5 service pages, about pages, news, tenders (auto Tutup), careers, downloads, contact.
- [ ] **T5 Enquiry form:** validate, honeypot, rate limit, store, email to settings.notify_email.
- [ ] **T6 Admin:** login (bcrypt, session, attempt limit), generic CRUD with BM/EN fields + uploads, enquiries list + CSV, settings.
- [ ] **T7 Assets:** copy logo, extract PPTX images used by projects/hero.
- [ ] **T8 Smoke test + DEPLOY.md:** run `node scripts/smoke.js`, all checks pass.
