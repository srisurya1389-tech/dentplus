# Dent Plus: Website, Online Booking & Admin Panel

Multispeciality Dental & Family Clinic, Guntur. A trilingual (English / తెలుగు / हिंदी) website with online booking and a password-protected admin panel for the clinic.

- **No build step and no npm packages.** It's plain HTML/CSS/JS plus 5 small Vercel serverless functions.
- **Free to run** on Vercel Hobby + Upstash Redis free tier (10,000 commands/day, far more than a clinic needs).
- **Works without the database too.** If the database isn't connected, the site still runs and bookings go through WhatsApp.

---

## 1. Deploy (about 10 minutes)

### Step 1: Put it on Vercel
1. Create a GitHub repo and upload the contents of this folder, or use `npx vercel` from this folder.
2. On https://vercel.com/new → import the repo → Framework preset **Other** → leave build settings empty → **Deploy**.
3. Project → Settings → General → rename the project to `dentplus` to get **dentplus.vercel.app** (if taken, try `dentplus-guntur`).

### Step 2: Connect the free database
1. Vercel project → **Storage** → **Create Database** → choose **Upstash → Redis** (free plan) → region **Mumbai (ap-south-1)** if offered.
2. Connect it to this project. Vercel adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.

### Step 3: Set the admin password
Vercel project → **Settings → Environment Variables** → add:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | A strong password, **at least 10 characters** (e.g. 3 random words + numbers) |
| `ADMIN_SECRET` | *(optional)* any long random text. Changing it later signs everyone out. |

Then **Deployments → ⋯ → Redeploy** so the new variables take effect.

### Step 4: First login
Open **https://dentplus.vercel.app/admin**, sign in, then:
1. **Health packages** → *Load starter packages* → add prices → **Save**.
2. **Announcement & settings** → paste the clinic's Google review link (Google Business Profile → *Ask for reviews*) → **Save**.
3. **Review QR poster** → **Print poster** → put it at reception.

---

## 2. What the clinic can do in the admin panel (`/admin`)

| Section | What it does |
|---|---|
| **Dashboard** | Today's schedule, bookings waiting for confirmation, next 7 days, and website activity: visits, call taps, WhatsApp taps, directions, bookings, package clicks, QR scans (30 days) |
| **Appointments** | All bookings by date, with filters and search. Change status (Pending → Confirmed → Completed / Cancelled / No-show). **One-tap WhatsApp "Confirm" and "Remind"** messages, written in the patient's own language. **Add appointment** for phone calls and walk-ins. **Export CSV** for Excel. Checks for new bookings every minute. |
| **Health packages** | Add, edit, hide, reorder and delete packages. Set name and contents in 3 languages, price and optional original price (shows "Save ₹…"). Empty price shows "Ask for price". |
| **Announcement & settings** | Top-of-site announcement bar (on/off, 3 languages, blue/green/amber, optional link) with live preview. Google review link. WhatsApp numbers. |
| **Leave & holidays** | Block a date range for the whole clinic, a department, or one doctor. Those days can't be booked online. Warns if patients are already booked on that day. |
| **QR posters** | Printable A4 posters: "Review us on Google" and "Book online". Download the QR image. |

### How online booking works
1. A patient books on the website. Only free times are shown (it checks live, per doctor).
2. The slot is reserved instantly. Two people can't book the same doctor at the same time. If "Any doctor" is chosen, the system assigns whichever doctor is free.
3. The patient gets a reference number (e.g. `DP-7K3F9Q`) and can also send it on WhatsApp.
4. The booking appears in **Admin → Appointments** as *Pending*. Staff tap **Confirm**, which opens WhatsApp with a ready message to the patient and marks it confirmed.
5. The day before, staff tap **Remind** to send a reminder.
6. Cancelling an appointment frees the slot for others.

---

## 3. Design (v3)

Premium-hospital look with a few signature details so the site doesn't look like a template:
- **Serif-italic accent words** in headings with a mint **"smile arc"** that draws itself in
- **Arch-shaped photo frames** (hero, Why-us, gallery, doctor portraits) and a rotating "Dental · Family · Care" badge
- **Quick-booking bar** in the hero (treatment → doctor → date) that jumps straight to available times
- **Bento services grid** with a large photo tile, plus a navy "Not sure what you need?" tile
- Scrolling **treatment ticker**, **dark booking section**, "Most popular" package card, animated patient-journey line, giant footer wordmark
- Swipeable doctor and gallery carousels on phones; all motion turns off for users who prefer reduced motion

**Replacing photos:** stock photos (free Unsplash licence) are used until the clinic sends its own. Put real photos in `assets/img/` and update:
- `index.html`: hero and Why-us images (search for `images.unsplash.com`)
- `assets/js/main.js`: `FEATURE` (services tiles) and `GALLERY` (Inside Dent Plus). **Replace the gallery before launch**, since it presents the clinic's own premises.
- Doctor photos: add `photo:'/assets/img/dr-phani.jpg'` to a doctor in `DOCTORS` (main.js); the silhouette is replaced automatically.

## 4. Speed

- **Fonts are self-hosted** (`assets/fonts`): about 50 KB for English. Telugu and Hindi fonts download only when those languages are shown.
- No frameworks or libraries on the public site. One CSS file and one JS file, compressed automatically by Vercel.
- Responsive images (`srcset`), lazy-loaded below the fold, hero image preloaded at high priority.
- Off-screen sections use `content-visibility:auto`, so the browser skips rendering them until needed.
- **Google Maps loads only when you scroll near it** (saves about 1 MB on first visit).
- No scroll-event work: header state and active menu use IntersectionObserver; the cursor animation stops when the mouse is still.
- Versioned asset URLs (`?v=3`): bump the number after editing CSS/JS so returning visitors get the new files.

## 5. Security

| Area | Protection |
|---|---|
| Admin login | Password checked in constant time; **8 attempts per 15 min per IP**; session is a signed (HMAC-SHA256) **HttpOnly, Secure, SameSite=Strict** cookie, valid 12 hours |
| Cross-site attacks | All POST requests must come from the site's own origin (CSRF check) plus SameSite cookies; `frame-ancestors 'none'` blocks clickjacking |
| Booking spam | 20 bookings per hour per IP, hidden honeypot field for bots, strict server-side validation (service, doctor, date window, time slot, Indian mobile format, lengths) |
| Double booking | Atomic slot lock in Redis (`SET NX`); a taken slot can't be booked twice |
| Content injection | Everything typed by patients or staff is escaped before display; announcement links only allow `https://`, `/` or `#`; CSV export protects against spreadsheet formula injection |
| Headers (`vercel.json`) | Strict Content-Security-Policy (scripts **and fonts** only from this site; no Google Fonts; `base-uri 'none'`, no workers/media/plugins), HSTS preload, nosniff, X-Frame-Options, Referrer-Policy, a locked-down Permissions-Policy, COOP + CORP same-origin, Origin-Agent-Cluster; admin and API pages are `no-store` and `noindex` |
| Third parties | None at page load except Unsplash images (until real photos are added). Google Maps only after scrolling to it. No trackers or ad scripts. |
| Sign-out | Clears the session cookie and sends `Clear-Site-Data` |
| API abuse | Bookings 20/hour/IP, slot checks 300/hour/IP, login 8 per 15 min/IP |
| Privacy | Analytics are anonymous daily counters only: no cookies, no IP addresses, no personal data. Patient data is visible only to signed-in staff. |
| Secrets | Database token and admin password live only in Vercel environment variables, never in the code |

After deploying, check https://securityheaders.com (expect A).

---

## 6. Project structure

```
├── index.html                 Website
├── review.html                /review: QR target, opens Google review page and counts scans
├── 404.html
├── admin/index.html           Admin panel
├── api/
│   ├── _lib/core.js           Shared logic: database, validation, booking, auth
│   ├── public.js              GET  /api/public: announcement, packages, leave days, links
│   ├── slots.js               GET  /api/slots: booked times for a date/doctor
│   ├── book.js                POST /api/book: create a booking
│   ├── track.js               POST /api/track: anonymous counters
│   └── admin.js               /api/admin?a=…: login, data, settings, packages, leave, status, add booking
├── assets/
│   ├── css/style.css, admin.css
│   ├── fonts/                 Self-hosted fonts + licences (SIL OFL)
│   ├── js/main.js             Website: content, 3 languages, booking flow
│   ├── js/packages-default.js Starter packages (used until the clinic saves its own)
│   ├── js/admin.js            Admin panel
│   ├── js/review.js
│   └── js/vendor/qrcode.js    QR generator (MIT licence, Kazuhiko Arase)
├── vercel.json                Security headers and caching
├── .env.example               Environment variables reference
├── robots.txt, sitemap.xml, site.webmanifest, favicon.svg
```

### Editing website text
All website text is in `assets/js/main.js`: the `T` object (English/Telugu) and `HI` object (Hindi), plus `SERVICES`, `DOCTORS`, `FAQ` and `LOCS`. If you add or change a service or doctor, update the same list in `api/_lib/core.js` and `assets/js/admin.js` (marked "keep in sync").

### Local testing
`npx vercel dev` (after `npx vercel link` and `npx vercel env pull .env.local`).

---

## 7. Still to confirm with the clinic
- Ashok Nagar door number (read as 5-72-31/3 from the pamphlet) and that both locations are active
- Sunday and holiday timings (use **Leave & holidays** to block closed days)
- That both WhatsApp numbers are correct (editable in admin)
- Doctor photos and languages; real patient reviews (add to `REVIEWS` in `main.js`)
- Telugu and Hindi wording: have a fluent speaker read through once
