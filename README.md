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

## ✉️ Enable the contact form (IMPORTANT — 2 minutes)

The contact form uses **[Web3Forms](https://web3forms.com)** (free) to deliver enquiries to
`info@creativesolutionsuae.com`. It is **not active until you add an access key.**

1. Go to <https://web3forms.com> → enter **info@creativesolutionsuae.com** → you'll receive an
   **Access Key** by email (verify it).
2. Open **`index.html`**, find this line (inside `#contactForm`):
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
   Replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key you received.
3. Save & redeploy. Submissions now arrive at `info@creativesolutionsuae.com` (with a nice
   in-page success toast — no page reload).

> Prefer a Cloudflare-native option instead of Web3Forms? You can swap the `fetch()` target in
> `assets/js/main.js` for a Cloudflare Pages Function using Resend/MailChannels. Web3Forms is the
> quickest path and needs no server code.

Also make sure email **receiving** works for the domain — set up **Cloudflare Email Routing**
(Email → Email Routing) so `info@creativesolutionsuae.com` forwards to your real inbox.

---

## ☁️ Deploy to Cloudflare Pages

1. Push this folder to the GitHub repo (e.g. `ecoflowuae/Creative-Solutions-UAE-LLC`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`  (the repo root — files are already static)
4. Deploy. Then **Custom domains → Set up a custom domain → `creativesolutionsuae.com`**
   (Cloudflare adds the DNS records automatically since the zone is on your account).

The included `CNAME` file also makes this repo work on **GitHub Pages** if you ever need a fallback.

---

## 🎨 Branding

- **Logo:** `assets/logo-mark.svg` (icon) and `assets/logo-full.svg` (horizontal lockup). Both are
  scalable vectors — swap them any time. To use your own logo, replace these files (keep the names)
  or update the `<img class="brand-mark">` references.
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
