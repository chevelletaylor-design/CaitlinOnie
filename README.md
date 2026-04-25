# Caitlin Onie Photography

A multi-page editorial portfolio site for Caitlin Onie — photographer based in MD/VA/DC/Atlanta.

## Stack

- Static HTML/CSS/JS — no build step
- Content managed via **Decap CMS** (formerly Netlify CMS)
- Deployed via **Netlify** with Git-Gateway + Identity for client access
- Form handled via **Formspree**

## File structure

```
caitlin-onie/
├── index.html              ← Home page
├── about.html              ← About + travel + fun facts
├── portraits.html          ← Category page
├── products.html           ← Category page (with pricing)
├── landscapes.html         ← Category page
├── weddings.html           ← Category page
├── nature.html             ← Category page
├── inquire.html            ← Contact form
├── config.json             ← All editable site content
├── styles.css              ← Shared design system
├── scripts.js              ← Animations + page renderers
├── admin/
│   ├── index.html          ← CMS login
│   └── config.yml          ← CMS field schema
└── assets/images/          ← All photos (Caitlin uploads via admin)
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
- [ ] **Identity → Services → Git Gateway → Enable** (this triggers GitHub auth — accept)
- [ ] **Identity → Registration → Invite only**
- [ ] **Identity → Invite users** → invite Chevelle's email FIRST, then Caitlin's

### 3. Formspree
- [ ] Create new Formspree form for Caitlin's email
- [ ] Copy the `formspree.io/f/xxxxxx` URL
- [ ] Paste into `config.json` → `inquire.formAction` (via admin or directly)
- [ ] Update the `<form action="...">` in `inquire.html` to match

### 4. Custom domain (when ready)
- [ ] Point `caitlinonie.com` to Netlify (Namecheap → Netlify nameservers OR A record)
- [ ] Netlify → Domain Settings → Add custom domain
- [ ] HTTPS auto-provisions via Let's Encrypt

## Admin panel

Once deployed and Identity is set up:

- URL: `https://[site-name].netlify.app/admin/`
- Caitlin logs in with the email you invited her with (sets her own password)
- She can edit every field on every page from one panel
- Changes commit to GitHub → auto-redeploy → live in ~60 seconds

## Editing tips

- **Special markup in fields**: `<em>word</em>` makes a word italic + accent-colored. `<span class="accent">word</span>` does the same on certain fields (intro quote).
- **Galleries are unlimited**: each category page has an "Add image" button. Caitlin can have 5 photos or 50.
- **Featured toggle**: marking a gallery item as "featured" gives it a larger placement in the grid.
- **Fun facts on About page**: simple string values work in admin. For multi-item lists (like "Favorite cuisines"), edit `config.json` directly via GitHub (or contact Chevelle).

## Per-category color system

Each category page has its own accent color, controlled by the `body.cat-[slug]` class in `styles.css`. Currently:

- Portraits → Clementine orange + Mandarin
- Products → Mandarin (deeper orange)
- Landscapes → Olive
- Weddings → Clementine on cream
- Nature → Palm Leaves (deep green)

Same family, distinct moods. To adjust, edit the per-category overrides at the top of `styles.css`.

## What's missing / what's needed from Caitlin

Before going live, Caitlin needs to provide:
- 6 hero carousel images (her best work, mixed categories)
- 5 cover images (one per category)
- 5 category hero images (one per category page)
- Gallery images per category (10–20 each to start)
- 4 travel/personal photos for About page
- 1 main About hero photo
- 1 small About-teaser photo for the home page
- 5 Instagram post screenshots + post URLs

See `ASSET-GUIDE.md` for filenames and dimensions.

---

Designed by **Chevelle Taylor** — bychevelle.com
