# Caitlin Onie Photography

Editorial photography portfolio site with gradient-driven design. Each section has its own atmospheric gradient (sunset, peach, botanical, twilight) — gradients are the structural element, photos sit inside them.

## Stack

- Static HTML/CSS/JS — no build step
- Content managed via **Decap CMS** (formerly Netlify CMS)
- Deployed via **Netlify** with Git-Gateway + Identity for client access
- Form handled via **Formspree**

## File structure

```
caitlin-onie/
├── index.html              ← Home
├── about.html              ← About
├── portraits.html          ← Category page
├── products.html           ← Category page (with pricing)
├── landscapes.html         ← Category page
├── weddings.html           ← Category page
├── nature.html             ← Category page
├── inquire.html            ← Contact
├── config.json             ← All editable content
├── styles.css              ← Design system + gradients
├── scripts.js              ← Render logic + carousel
├── admin/
│   ├── index.html          ← CMS login
│   └── config.yml          ← CMS schema
└── assets/images/          ← Photos (Caitlin uploads via admin)
```

## Deployment checklist

### 1. GitHub
- [ ] Create repo: `caitlin-onie-photography` under `chevelletaylor-design`
- [ ] Upload all files preserving folder structure
- [ ] Critical: `admin/index.html` and `admin/config.yml` MUST be in `/admin/` folder
- [ ] Verify file tree before moving on

### 2. Netlify
- [ ] Import from GitHub → auto-deploy from `main` branch
- [ ] Site name: `caitlin-onie` (or whatever's available)
- [ ] After first deploy → **Site settings → Identity → Enable**
- [ ] **Identity → Services → Git Gateway → Enable**
- [ ] **Identity → Registration → Invite only**
- [ ] **Identity → Invite users** → invite Chevelle's email FIRST, then Caitlin's

### 3. Formspree
- [ ] Create new Formspree form for Caitlin's email
- [ ] Copy the `formspree.io/f/xxxxxx` URL
- [ ] Paste into `config.json` → `inquire.formAction` (via admin)
- [ ] Update the `<form action="...">` in `inquire.html` to match

### 4. Custom domain (when ready)
- [ ] Point domain to Netlify
- [ ] Netlify → Domain Settings → Add custom domain
- [ ] HTTPS auto-provisions

## Admin panel

URL: `https://[site-name].netlify.app/admin/`

Caitlin logs in with her invited email, sets her own password, and can edit every field across every page from one panel. Changes commit to GitHub → auto-redeploy → live in ~60 seconds.

## Editing tips

- **Italic accent**: wrap a word in `<em>word</em>` to make it italic + mandarin-colored. Works on all titles and headlines.
- **Galleries are unlimited** — click "Add image" as many times as needed per category.
- **Featured toggle** on gallery items gives them a larger placement in the grid.
- **Multi-item fun facts** (Caribbean, Thai, etc.) need to be edited in `config.json` directly via GitHub. Single-string facts work in admin.

## Design system — what makes this site distinct

**Per-section gradients** drive the mood:
- **Hero** — sunset (cream → peach → clementine)
- **Categories** — peach gradient panel
- **About** — botanical (cream → buds → olive)
- **Travel** — twilight (mandarin → palm)
- **Social** — cream with peach glow accents
- **Footer** — deep palm gradient

**Per-category accent colors** (used in titles, hovers, active states):
- Portraits → Clementine + Mandarin
- Products → Mandarin (deeper)
- Landscapes → Clementine + Olive
- Weddings → Mandarin + Clementine
- Nature → Olive + Palm

**Type stack**:
- Display: Cormorant Garamond (light, modern serif)
- Body: DM Sans (clean grotesque)
- Script: Italianno (signature accent)

To adjust gradients, edit the `--grad-*` CSS variables at the top of `styles.css`.

## What's missing / what's needed from Caitlin

Before going live, Caitlin needs to provide her real logo + photos. Site can deploy with placeholders and she fills in via admin as photos arrive. See `ASSET-GUIDE.md`.

---

Designed by **Chevelle Taylor** — bychevelle.com
