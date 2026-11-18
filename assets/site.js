/* benjamin — portfolio. shared behaviour; each block only runs when its markup is on the page. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, '0');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WORKS = window.WORKS || [];

  /* scroll state */
  const work = $('[data-work]');
  let setActive = null;
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.body.classList.toggle('scrolled', scrollY > 260);
    document.body.classList.toggle('top', scrollY < innerHeight * .6 && !!$('.hero'));
    document.body.classList.toggle('at-end', scrollY > max - innerHeight * .6);
    if (work && setActive) {
      const r = work.getBoundingClientRect();
      document.body.classList.toggle('in-work', r.top < innerHeight * .5 && r.bottom > innerHeight * .5);
      const p = Math.min(.9999, Math.max(0, -r.top / (r.height - innerHeight)));
      setActive(Math.floor(p * WORKS.length));
    }
  }

  /* selected work index (home) */
  if (work && WORKS.length) {
    const N = WORKS.length;
    work.style.height = `${(N - 1) * 62 + 100}vh`;
    $('[data-cards]').innerHTML = WORKS.map((w, i) =>
      `<a class="wcard" href="/work/${w.slug}/" tabindex="-1" aria-hidden="true"><img src="/assets/work/${w.slug}.webp" alt="" width="960" height="600" ${i < 2 ? '' : 'loading="lazy"'} decoding="async" /></a>`).join('');
    $('[data-list]').innerHTML = WORKS.map((w, i) =>
      `<li><button type="button" data-go="${i}"><span class="cat">${w.country}</span><span class="nm">${w.name}</span><span aria-hidden="true">—</span><span class="ds">${w.desc}</span></button></li>`).join('');
    $('[data-f="of"]').textContent = '/' + pad(N);
    const cards = $$('.wcard'), items = $$('[data-list] li'), sw = $$('.sw i');
    let active = -1;
    setActive = (i) => {
      if (i === active) return; active = i;
      const w = WORKS[i];
      cards.forEach((el, j) => {
        const d = j - i;
        el.dataset.d = d < -3 ? 'gone' : d > 2 ? 'far' : String(d);
        el.tabIndex = d === 0 ? 0 : -1;
        el.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        el.setAttribute('aria-label', d === 0 ? `${w.name} project page` : '');
      });
      items.forEach((li, j) => {
        const on = j === i;
        li.classList.toggle('on', on);
        li.setAttribute('aria-hidden', on ? 'false' : 'true');
        li.querySelector('button').tabIndex = on ? 0 : -1;
      });
      $('[data-list]').style.transform = `translateY(${-(i + .5) * items[0].offsetHeight}px)`;
      $('[data-f="num"]').textContent = pad(i + 1);
      $('[data-f="country"]').textContent = w.country;
      const link = $('[data-f="link"]'); link.textContent = w.host; link.href = w.url;
      const page = $('[data-f="page"]'); if (page) page.href = `/work/${w.slug}/`;
      $('[data-f="mcat"]').textContent = w.country; $('[data-f="mname"]').textContent = w.name;
      sw.forEach((s, k) => { s.style.background = w.sw[k]; });
    };
    $$('[data-go]').forEach((b) => b.addEventListener('click', () => {
      const i = +b.dataset.go, top = scrollY + work.getBoundingClientRect().top;
      scrollTo({ top: top + (i + .5) / N * (work.offsetHeight - innerHeight), behavior: reduce ? 'auto' : 'smooth' });
    }));
  }

  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* hero: make the name fill the width exactly */
  $$('[data-fit]').forEach((fit) => {
    const box = fit.parentElement;
    const size = () => {
      fit.style.fontSize = '100px';
      const cs = getComputedStyle(box);
      const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      fit.style.fontSize = (100 * avail / fit.scrollWidth) + 'px';
      // refine: letter widths are not perfectly proportional to size, so settle in a couple of passes
      for (let i = 0; i < 3; i++) {
        const fs = parseFloat(fit.style.fontSize);
        fit.style.fontSize = (fs * avail / fit.scrollWidth) + 'px';
      }
    };
    size();
    if (document.fonts) document.fonts.ready.then(size);
    addEventListener('resize', size);
  });

  /* hero: small image cycles through the projects */
  const now = $('.now');
  if (now && !reduce && $$('img', now).length > 1) {
    const imgs = $$('img', now), label = $('[data-now]', now);
    let k = 0;
    // load the next photo ahead of time so each change is instant
    const preload = (i) => { imgs[i].loading = 'eager'; };
    preload(1);
    setInterval(() => {
      if (document.hidden) return;
      imgs[k].classList.remove('on');
      k = (k + 1) % imgs.length;
      imgs[k].classList.add('on');
      preload((k + 1) % imgs.length);
      if (label && imgs[k].dataset.name) label.textContent = imgs[k].dataset.name;
    }, 2800);
  }

  /* light / dark mode: follows the device until the visitor picks one, then remembers it */
  const toggle = $('[data-theme-toggle]');
  if (toggle) {
    const root = document.documentElement;
    const sys = matchMedia('(prefers-color-scheme: dark)');
    const current = () => root.dataset.theme || (sys.matches ? 'dark' : 'light');
    const paint = () => {
      const t = current();
      $$('[data-mode]', toggle).forEach((el) => el.classList.toggle('on', el.dataset.mode === t));
      toggle.setAttribute('aria-pressed', String(t === 'dark'));
      $$('meta[name="theme-color"]').forEach((m) => { m.content = t === 'dark' ? '#121212' : '#ffffff'; });
    };
    toggle.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode: still switches for this visit */ }
      paint();
    });
    sys.addEventListener('change', paint);
    paint();
  }

  /* page menu chip: expands into a panel with every page */
  const pages = $('[data-pages]');
  if (pages) {
    const pbtn = $('.pages-btn', pages), sr = $('.sr', pbtn);
    const setOpen = (open, focusBack) => {
      pages.classList.toggle('open', open);
      pbtn.setAttribute('aria-expanded', String(open));
      if (sr) sr.textContent = open ? ', close menu' : ', open menu';
      if (open) setTimeout(() => { const a = $('.plist a', pages); if (a) a.focus({ preventScroll: true }); }, 60);
      else if (focusBack) pbtn.focus({ preventScroll: true });
    };
    pbtn.addEventListener('click', () => setOpen(!pages.classList.contains('open')));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && pages.classList.contains('open')) setOpen(false, true); });
    document.addEventListener('click', (e) => { if (pages.classList.contains('open') && !pages.contains(e.target)) setOpen(false); });
    pages.addEventListener('focusout', (e) => { if (pages.classList.contains('open') && e.relatedTarget && !pages.contains(e.relatedTarget)) setOpen(false); });
  }

  /* reveals */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal, .fade').forEach((el) => io.observe(el));

  /* live clock: time zone comes from LOCATION.timeZone in scripts/build.mjs */
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: document.body.dataset.tz || 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => {
    const [h, m, s] = fmt.format(new Date()).split(':');
    $$('[data-h]').forEach((el) => { el.textContent = h; });
    $$('[data-m]').forEach((el) => { el.textContent = m; });
    $$('[data-s]').forEach((el) => { el.textContent = s; });
    $$('[data-time]').forEach((el) => { el.textContent = `${h}:${m}`; });
  };
  tick(); setInterval(tick, 1000);

  /* menu */
  const btn = $('.menu-btn'), menu = $('#menu');
  if (btn && menu) {
    const setMenu = (open) => {
      btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? 'close' : 'menu';
      menu.classList.toggle('open', open); document.body.classList.toggle('menu-open', open);
      if (open) $('a', menu).focus(); else btn.focus({ preventScroll: true });
    };
    btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }

  /* copy email */
  const toast = $('.toast');
  $$('[data-copy]').forEach((a) => a.addEventListener('click', async (e) => {
    if (!navigator.clipboard || !toast) return;
    e.preventDefault();
    try { await navigator.clipboard.writeText(a.dataset.copy); toast.textContent = 'email copied'; }
    catch { location.href = a.href; return; }
    toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800);
  }));

  /* work index: preview that follows the cursor */
  const peek = $('.peek');
  if (peek && matchMedia('(hover: hover)').matches) {
    const img = $('img', peek);
    let x = 0, y = 0, raf = 0;
    const move = () => { peek.style.left = x + 'px'; peek.style.top = y + 'px'; raf = 0; };
    $$('[data-peek]').forEach((row) => {
      row.addEventListener('mouseenter', () => { img.src = row.dataset.peek; peek.classList.add('on'); });
      row.addEventListener('mouseleave', () => peek.classList.remove('on'));
    });
    addEventListener('mousemove', (e) => { x = e.clientX + 30; y = e.clientY; if (!raf) raf = requestAnimationFrame(move); }, { passive: true });
  }

  /* gallery: filters + lightbox */
  const gal = $('[data-gallery]');
  if (gal) {
    const figs = $$('figure', gal);
    $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
      $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.filter;
      figs.forEach((fig) => { fig.hidden = f !== 'all' && fig.dataset.p !== f; });
    }));
    const lb = $('.lightbox'), lbImg = $('img', lb), lbCap = $('[data-cap]', lb);
    let idx = 0, opener = null;
    const visible = () => figs.filter((f) => !f.hidden);
    const show = (fig) => { const im = $('img', fig); lbImg.src = im.dataset.full || im.src; lbImg.alt = im.alt; lbCap.textContent = $('figcaption', fig).textContent; idx = visible().indexOf(fig); };
    const open = (fig, from) => { opener = from; show(fig); lb.classList.add('open'); document.body.classList.add('menu-open'); $('.close', lb).focus(); };
    const close = () => { lb.classList.remove('open'); document.body.classList.remove('menu-open'); if (opener) opener.focus(); };
    const step = (d) => { const v = visible(); show(v[(idx + d + v.length) % v.length]); };
    figs.forEach((fig) => $('button', fig).addEventListener('click', (e) => open(fig, e.currentTarget)));
    $('.close', lb).addEventListener('click', close);
    $('[data-prev]', lb).addEventListener('click', () => step(-1));
    $('[data-next]', lb).addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
    });
  }
})();

/* about: destination list swaps the image set on hover/focus */
(() => {
  const root = document.querySelector('[data-places]');
  if (!root) return;
  const links = root.querySelectorAll('[data-place]'), sets = root.querySelectorAll('[data-set]');
  const show = (i) => { links.forEach((a) => a.classList.toggle('on', a.dataset.place === i)); sets.forEach((s) => s.classList.toggle('on', s.dataset.set === i)); };
  links.forEach((a) => { a.addEventListener('mouseenter', () => show(a.dataset.place)); a.addEventListener('focus', () => show(a.dataset.place)); });
})();
