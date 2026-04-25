/* ==========================================================================
   Caitlin Onie Photography — Scripts (v3)
   ========================================================================== */

(function() {
  'use strict';

  function safe(s) { return s == null ? '' : String(s).replace(/<script/gi, '&lt;script'); }
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else if (c) e.appendChild(c);
    });
    return e;
  }

  async function loadConfig() {
    try {
      const res = await fetch('config.json?t=' + Date.now());
      if (!res.ok) throw new Error('config not found');
      return await res.json();
    } catch (err) {
      console.error('Config load failed:', err);
      return null;
    }
  }

  function initNav() {
    const nav = document.querySelector('nav.site-nav');
    if (!nav) return;
    const toggle = nav.querySelector('.mobile-toggle');
    const drawer = nav.querySelector('.nav-links');

    if (toggle && drawer) {
      toggle.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      // Close on link click
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          drawer.classList.remove('open');
          toggle.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  function injectLogos(cfg) {
    const logoUrl = cfg?.brand?.logo || 'assets/images/logo-placeholder.svg';
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) heroLogo.src = logoUrl;
    const navLogo = document.querySelector('.nav-logo-center');
    if (navLogo) navLogo.src = logoUrl;
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) footerLogo.src = logoUrl;
  }

  function initHeroCarousel(images) {
    const track = document.querySelector('.hero-carousel');
    const dotsWrap = document.querySelector('.hero-dots');
    if (!track || !images || !images.length) return;

    track.innerHTML = '';
    if (dotsWrap) dotsWrap.innerHTML = '';

    images.forEach((src, i) => {
      const slide = el('div', { class: 'hero-carousel-slide' });
      slide.style.backgroundImage = `url('${safe(src)}')`;
      if (i === 0) slide.classList.add('active');
      track.appendChild(slide);

      if (dotsWrap) {
        const dot = el('button', {
          class: 'hero-dot' + (i === 0 ? ' active' : ''),
          'aria-label': `Slide ${i + 1}`,
          onclick: () => goTo(i)
        });
        dotsWrap.appendChild(dot);
      }
    });

    const slides = track.querySelectorAll('.hero-carousel-slide');
    const dots = dotsWrap ? dotsWrap.querySelectorAll('.hero-dot') : [];
    let idx = 0;
    let timer;

    function goTo(n) {
      slides[idx].classList.remove('active');
      if (dots[idx]) dots[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
      restart();
    }
    function next() { goTo(idx + 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 5500); }
    if (slides.length > 1) restart();
  }

  function initReveals() {
    const targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(t => obs.observe(t));
  }

  function renderFooter(cfg) {
    const f = document.querySelector('footer.site-footer');
    if (!f || !cfg) return;
    const c = cfg.contact || {};
    const fb = cfg.brand || {};
    const logoUrl = fb.logo || 'assets/images/logo-placeholder.svg';

    f.innerHTML = `
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="footer-logo" src="${safe(logoUrl)}" alt="${safe(fb.shortName || 'Caitlin Onie')}">
          <p>${safe(fb.footerTagline || '')}</p>
        </div>
        <div class="footer-col">
          <h4>Photography</h4>
          <ul>
            <li><a href="portraits.html">Portraits</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="landscapes.html">Landscapes</a></li>
            <li><a href="weddings.html">Weddings</a></li>
            <li><a href="nature.html">Nature</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Locations</h4>
          <ul>${(c.locations || []).map(l => `<li>${safe(l)}</li>`).join('')}</ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:${safe(c.email)}">${safe(c.email)}</a></li>
            <li>${safe(c.hours || '')}</li>
            <li><a href="${safe(c.instagramUrl)}" target="_blank" rel="noopener">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Caitlin Onie Photography. All rights reserved.</span>
        <span>Designed by <a href="https://bychevelle.com" target="_blank" rel="noopener">By Chevelle</a></span>
      </div>
    `;
  }

  function renderHome(cfg) {
    if (!cfg) return;
    const h = cfg.hero || {};
    const a = cfg.aboutHome || {};

    const eyeYear = document.querySelector('.hero-eyebrow .year');
    if (eyeYear) eyeYear.textContent = h.year || '';
    const tag = document.querySelector('.hero-tagline');
    if (tag) tag.textContent = h.tagline || '';
    const headline = document.querySelector('.hero-headline');
    if (headline) headline.innerHTML = h.headline || '';
    const cta = document.querySelector('.hero-cta');
    if (cta) {
      cta.textContent = h.ctaLabel || 'Book a session';
      cta.setAttribute('href', h.ctaHref || 'inquire.html');
    }

    initHeroCarousel(h.carouselImages || []);

    // Categories
    const cats = cfg.categories || [];
    const grid = document.querySelector('.categories-grid');
    if (grid && cats.length) {
      grid.innerHTML = '';
      cats.forEach((cat, idx) => {
        const card = el('a', { class: 'category-card reveal', href: cat.href || '#' });
        card.innerHTML = `
          <div class="category-card-img" style="background-image:url('${safe(cat.coverImage)}')"></div>
          <div class="category-card-overlay"></div>
          <div class="category-card-meta">
            <span class="category-card-num">0${idx + 1}</span>
            <div class="category-card-bottom">
              <h3 class="category-card-name">${safe(cat.name)}</h3>
              <span class="category-card-arrow">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </span>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }
    const catEye = document.querySelector('.categories-eyebrow');
    if (catEye) catEye.textContent = cfg.categoriesSection?.eyebrow || 'Collections';
    const catTitle = document.querySelector('.categories-title');
    if (catTitle) catTitle.innerHTML = cfg.categoriesSection?.title || 'Stories told through <em>light.</em>';
    const catBlurb = document.querySelector('.categories-blurb');
    if (catBlurb) catBlurb.textContent = cfg.categoriesSection?.blurb || '';

    // About home
    const imgMain = document.querySelector('.about-home-img-main');
    if (imgMain) imgMain.style.backgroundImage = `url('${safe(a.imageMain)}')`;
    const imgAccent = document.querySelector('.about-home-img-accent');
    if (imgAccent) imgAccent.style.backgroundImage = `url('${safe(a.imageAccent)}')`;
    const aScript = document.querySelector('.about-home-script');
    if (aScript) aScript.textContent = a.script || 'Hello,';
    const aTitle = document.querySelector('.about-home-title');
    if (aTitle) aTitle.innerHTML = a.title || "I'm <em>Caitlin.</em>";
    const aBody = document.querySelector('.about-home-body');
    if (aBody && a.paragraphs) {
      aBody.innerHTML = a.paragraphs.map(p => `<p>${safe(p)}</p>`).join('');
    }
    const aStats = document.querySelector('.about-home-stats');
    if (aStats && a.stats) {
      aStats.innerHTML = a.stats.map(s => `
        <div>
          <div class="about-home-stat-num">${safe(s.number)}</div>
          <div class="about-home-stat-label">${safe(s.label)}</div>
        </div>
      `).join('');
    }

    // Travel strip
    const t = cfg.travel || {};
    const tEye = document.querySelector('.travel-strip-eyebrow');
    if (tEye) tEye.textContent = t.eyebrow || 'On the road';
    const tTitle = document.querySelector('.travel-strip-title');
    if (tTitle) tTitle.innerHTML = t.title || '';
    const tBody = document.querySelector('.travel-strip-body');
    if (tBody) tBody.textContent = t.body || '';
    const tPlaces = document.querySelector('.travel-strip-places');
    if (tPlaces && t.places) {
      tPlaces.innerHTML = t.places.map(p => `<span class="travel-strip-place">${safe(p)}</span>`).join('');
    }

    // Social
    const social = document.querySelector('.social-grid');
    if (social && cfg.social?.posts) {
      social.innerHTML = '';
      cfg.social.posts.forEach(p => {
        const tile = el('a', {
          class: 'social-tile reveal',
          href: p.url || cfg.social.profileUrl || '#',
          target: '_blank',
          rel: 'noopener'
        });
        tile.innerHTML = `
          <div class="social-tile-img" style="background-image:url('${safe(p.thumbnail)}')"></div>
          <div class="social-tile-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
          </div>
        `;
        social.appendChild(tile);
      });
    }
    const socialHandle = document.querySelector('.social-handle');
    if (socialHandle && cfg.social) {
      socialHandle.innerHTML = `<a href="${safe(cfg.social.profileUrl)}" target="_blank" rel="noopener">${safe(cfg.social.handle)}</a>`;
    }
    const socialTitle = document.querySelector('.social-title');
    if (socialTitle) socialTitle.innerHTML = cfg.social?.title || '';
  }

  function getGallerySize(idx, isFeatured) {
    if (isFeatured) return 'size-large';
    const pattern = ['size-tall', 'size-wide', 'size-small', 'size-medium', 'size-medium', 'size-medium', 'size-half-wide', 'size-square'];
    return pattern[idx % pattern.length];
  }

  function renderCategory(cfg, slug) {
    if (!cfg) return;
    const cat = (cfg.categoryPages || {})[slug];
    if (!cat) return;

    document.title = `${cat.name} — Caitlin Onie Photography`;

    const heroImg = document.querySelector('.cat-hero-frame');
    if (heroImg) heroImg.style.backgroundImage = `url('${safe(cat.heroImage)}')`;
    const heroEye = document.querySelector('.cat-hero-eyebrow');
    if (heroEye) heroEye.textContent = cat.eyebrow || 'Photography';
    const heroTitle = document.querySelector('.cat-hero-title');
    if (heroTitle) heroTitle.innerHTML = cat.heroTitle || cat.name;
    const heroMeta = document.querySelector('.cat-hero-meta');
    if (heroMeta) heroMeta.innerHTML = (cat.heroMeta || []).map(m => `<span>${safe(m)}</span>`).join('');

    const introP = document.querySelector('.cat-intro p');
    if (introP) introP.innerHTML = cat.intro || '';

    const grid = document.querySelector('.gallery-grid');
    if (grid && cat.gallery) {
      grid.innerHTML = '';
      cat.gallery.forEach((g, i) => {
        const size = getGallerySize(i, !!g.featured);
        const item = el('div', { class: `gallery-item ${size} reveal` });
        item.innerHTML = `
          <img class="gallery-item-img" src="${safe(g.image)}" alt="${safe(g.alt || cat.name)}" loading="lazy">
          ${g.caption ? `<div class="gallery-item-caption">${safe(g.caption)}</div>` : ''}
        `;
        grid.appendChild(item);
      });
    }

    if (cat.pricing && cat.pricing.length) {
      const pricingGrid = document.querySelector('.pricing-grid');
      if (pricingGrid) {
        pricingGrid.innerHTML = '';
        cat.pricing.forEach((p, i) => {
          const card = el('div', { class: 'pricing-card reveal' + (i === 1 ? ' featured' : '') });
          card.innerHTML = `
            <span class="label">${safe(p.tier)}</span>
            <h3>${safe(p.name)}</h3>
            <div class="price">$${safe(p.price)}<span class="price-suffix"> / package</span></div>
            <ul>${(p.features || []).map(f => `<li>${safe(f)}</li>`).join('')}</ul>
            <a class="pricing-cta" href="inquire.html?package=${encodeURIComponent(p.name)}">${safe(p.ctaLabel || 'Inquire')}</a>
          `;
          pricingGrid.appendChild(card);
        });
      }
      const pTitle = document.querySelector('.pricing-title');
      if (pTitle) pTitle.innerHTML = cat.pricingTitle || 'Choose your <em>package.</em>';
      const pBlurb = document.querySelector('.pricing-blurb');
      if (pBlurb) pBlurb.textContent = cat.pricingBlurb || '';
    }

    const next = cat.next || {};
    const nextImg = document.querySelector('.next-cat-img');
    if (nextImg) nextImg.style.backgroundImage = `url('${safe(next.image)}')`;
    const nextLabel = document.querySelector('.next-cat-content .label');
    if (nextLabel) nextLabel.textContent = next.eyebrow || 'Next';
    const nextTitle = document.querySelector('.next-cat-content .display');
    if (nextTitle) nextTitle.innerHTML = next.title || '';
    const nextLink = document.querySelector('.next-cat');
    if (nextLink && next.href) nextLink.setAttribute('href', next.href);
  }

  function renderAbout(cfg) {
    if (!cfg?.about) return;
    const a = cfg.about;

    const heroImg = document.querySelector('.about-hero-img');
    if (heroImg) heroImg.style.backgroundImage = `url('${safe(a.heroImage)}')`;
    const heroScript = document.querySelector('.about-hero-content .script');
    if (heroScript) heroScript.textContent = a.heroScript || 'Hello,';
    const heroH1 = document.querySelector('.about-hero-content h1');
    if (heroH1) heroH1.innerHTML = a.heroTitle || "I'm <em>Caitlin</em>";
    const heroBody = document.querySelector('.about-hero-content .body');
    if (heroBody) heroBody.innerHTML = (a.intro || []).map(p => `<p>${safe(p)}</p>`).join('');

    const storyGrid = document.querySelector('.about-story-grid');
    if (storyGrid && a.story) {
      storyGrid.innerHTML = a.story.map(p => `<p>${safe(p)}</p>`).join('');
    }

    const travelGrid = document.querySelector('.about-travel-grid');
    if (travelGrid && a.travelImages) {
      travelGrid.innerHTML = '';
      a.travelImages.slice(0, 4).forEach(img => {
        const d = el('div', { class: 'about-travel-img reveal' });
        d.style.backgroundImage = `url('${safe(img)}')`;
        travelGrid.appendChild(d);
      });
    }

    const factsGrid = document.querySelector('.about-facts-grid');
    if (factsGrid && a.facts) {
      factsGrid.innerHTML = '';
      a.facts.forEach((f, i) => {
        const card = el('div', { class: 'about-fact reveal' });
        const num = String(i + 1).padStart(2, '0');
        const body = Array.isArray(f.value)
          ? `<ul>${f.value.map(v => `<li>${safe(v)}</li>`).join('')}</ul>`
          : `<p>${safe(f.value)}</p>`;
        card.innerHTML = `
          <div class="about-fact-num">${num}</div>
          <h3>${safe(f.title)}</h3>
          ${body}
        `;
        factsGrid.appendChild(card);
      });
    }
  }

  function renderInquire(cfg) {
    if (!cfg) return;
    const c = cfg.contact || {};
    const i = cfg.inquire || {};

    const title = document.querySelector('.inquire-info h1');
    if (title) title.innerHTML = i.title || "Let's <em>create</em> together.";
    const blurb = document.querySelector('.inquire-info .blurb');
    if (blurb) blurb.textContent = i.blurb || '';

    const meta = document.querySelector('.inquire-meta');
    if (meta) {
      meta.innerHTML = `
        <div class="inquire-meta-block">
          <h4>Email</h4>
          <a href="mailto:${safe(c.email)}">${safe(c.email)}</a>
        </div>
        <div class="inquire-meta-block">
          <h4>Locations</h4>
          <ul>${(c.locations || []).map(l => `<li>${safe(l)}</li>`).join('')}</ul>
        </div>
        <div class="inquire-meta-block">
          <h4>Hours</h4>
          <p>${safe(c.hours || '')}</p>
        </div>
        <div class="inquire-meta-block">
          <h4>Social</h4>
          <a href="${safe(c.instagramUrl)}" target="_blank" rel="noopener">${safe(c.instagramHandle)}</a>
        </div>
      `;
    }

    const form = document.querySelector('.inquire-form form');
    if (form && i.formAction) form.setAttribute('action', i.formAction);

    const params = new URLSearchParams(window.location.search);
    const pkg = params.get('package');
    if (pkg) {
      const subj = document.querySelector('.inquire-form [name="subject"]');
      if (subj) subj.value = `Inquiry — ${pkg}`;
    }
  }

  async function init() {
    const cfg = await loadConfig();
    initNav();
    if (cfg) {
      injectLogos(cfg);
      renderFooter(cfg);

      const body = document.body;
      if (body.classList.contains('page-home')) renderHome(cfg);
      else if (body.classList.contains('page-about')) renderAbout(cfg);
      else if (body.classList.contains('page-inquire')) renderInquire(cfg);
      else {
        const slug = ['portraits', 'products', 'landscapes', 'weddings', 'nature']
          .find(s => body.classList.contains('cat-' + s));
        if (slug) renderCategory(cfg, slug);
      }
    }
    setTimeout(initReveals, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
