# Creative Solutions Equipment Trading LLC — Website

Premium static website for **Creative Solutions Equipment Trading LLC** — water & pumping solutions.
Built with hand-crafted HTML, CSS and vanilla JS (no build step, no framework). Deploys as-is
to **Cloudflare Pages**, GitHub Pages, or any static host.

Live domain: **creativesolutionsuae.com**
Contact email: **info@creativesolutionsuae.com**

---

## 📁 Project structure

```
Creative-Solutions-UAE-LLC/
├── index.html                 # Home
├── 404.html                   # Not-found page
├── pages/
│   ├── products.html          # All products
│   ├── services.html          # Services overview
│   ├── catalogue.html         # Downloadable brand catalogues
│   ├── about.html             # About the company
│   ├── contact.html           # Contact form + map
│   ├── irrigation-industrial.html
│   ├── building-service.html
│   ├── storm-sewage.html
│   ├── borehole-pumps.html
│   └── self-priming.html
├── assets/
│   ├── css/styles.css         # Design system
│   ├── js/main.js             # Interactions + contact form
│   ├── img/                   # All product images (from source)
│   ├── img/brands/            # Ebara / Grundfos / Tsurumi logos (extracted from the PDFs)
│   ├── logo-mark.svg          # Logo mark (used in nav/footer/favicon)
│   ├── logo-full.svg          # Full horizontal logo (mark + wordmark)
│   └── favicon.svg
├── catelogue/                 # Brand catalogue PDFs (Ebara, Grundfos, Tsurumi)
├── CNAME                      # creativesolutionsuae.com
├── _headers                   # Cloudflare Pages caching + security headers
├── robots.txt
└── sitemap.xml
```

> The logo (`assets/logo-mark.svg` / `logo-full.svg`) is a scalable vector recreation of the
> Creative Solutions droplet + gear + pump + waves mark. To use an exact raster logo instead, save
> it as `assets/img/logo.png` and point the `<img class="brand-mark">` tags at it.

---

## ▶️ Run locally

You only need a static file server (opening `index.html` directly also works, but a server is
recommended so relative paths and the catalogue downloads behave exactly like production).

**Python (built into most systems):**
```bash
cd Creative-Solutions-UAE-LLC
python -m http.server 5173
# open http://localhost:5173
```

**Node:**
```bash
npx serve -l 5173 .
# or
npx http-server -p 5173 .
```

---

## ☁️ Cloudflare deploy — frontend + backend (one Worker)

This repo deploys as a **Cloudflare Worker with static assets**:
- **Frontend:** all static files, served via the `ASSETS` binding.
- **Backend:** `worker/index.js` handles `POST /api/contact` (the contact form).
- Config lives in **`wrangler.jsonc`**; deploy command is `npx wrangler deploy`.

**Deploy (Git-connected):** Cloudflare dashboard → **Workers & Pages → Create → Import a repository**
→ pick `ecoflowuae/Creative-Solutions-UAE-LLC`. It auto-detects `wrangler.jsonc`; deploy command
`npx wrangler deploy`. Every `git push` redeploys automatically.

**Custom domain:** the Worker → **Settings → Domains & Routes → Add → `creativesolutionsuae.com`**
(and `www`). DNS is wired automatically since the zone is on your Cloudflare account.

> Note: Cloudflare limits any single asset to **25 MiB**. The 46 MB Grundfos general catalogue was
> therefore linked to grundfos.com instead of hosted. To host it yourself, compress it under 25 MB
> or serve it from **Cloudflare R2**.

## ✉️ Enable the contact form (Resend)

The backend delivers enquiries to `info@creativesolutionsuae.com` via **[Resend](https://resend.com)**.
Until a key is set, the form politely tells visitors to email directly.

1. Create a free Resend account → **verify the domain `creativesolutionsuae.com`** (add the DNS
   records it gives you — quick, since DNS is on Cloudflare).
2. Resend → **API Keys → Create** → copy the key.
3. In the Cloudflare dashboard → your Worker → **Settings → Variables and Secrets**, add:
   - `RESEND_API_KEY` — **type: Secret** — the key from step 2
   - `CONTACT_TO` *(optional)* — `info@creativesolutionsuae.com`
   - `CONTACT_FROM` *(optional)* — `Creative Solutions <noreply@creativesolutionsuae.com>` (must be on the verified domain)
4. Redeploy. Submissions now email `info@` with a nice in-page success toast.

Also set up **Cloudflare Email Routing** (Email → Email Routing) so mail **to** `info@creativesolutionsuae.com`
forwards into your real inbox.

## 🔎 SEO built in

- Unique `<title>` + meta description, `robots`, and **canonical URL** on every page
- **Open Graph + Twitter cards** with a branded share image (`assets/img/og-image.png`)
- **JSON-LD structured data** — `Organization` site-wide, plus `LocalBusiness` + `WebSite` on the home page
- `sitemap.xml` + `robots.txt` (update the sitemap if you add pages)

---

## 🎨 Branding

- **Logo:** `assets/img/logo.png` (full lockup, transparent) and `assets/img/logo-icon.png` (icon),
  plus `assets/img/favicon.png`. Swap these files to update the logo everywhere.
- **Colours** live as CSS variables at the top of `assets/css/styles.css`
  (`--brand`, `--aqua`, `--ink`, …) — change them in one place to re-theme the whole site.

---

## 📇 Company details used

| Field | Value |
|---|---|
| Company | Creative Solutions Equipment Trading LLC |
| Address | Al Messaned, Sharjah Media City, Sharjah, UAE |
| Phone | 050 673 9493 |
| Email | info@creativesolutionsuae.com |
| Website | creativesolutionsuae.com |

> Update any of these in the footer/contact sections if the phone number or address changes.
