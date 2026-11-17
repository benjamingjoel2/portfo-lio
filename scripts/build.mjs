// Builds every page of the portfolio from scripts/works.json.
// Usage: node scripts/build.mjs   (no dependencies; writes the HTML files into the repo root)

// ─── where i am right now ─────────────────────────────────────────────
// Change these when you travel, then run `node scripts/build.mjs`.
const LOCATION = {
  city: 'kaduna',
  country: 'nigeria',
  countryCode: 'ng',          // two letters, used for the flag emoji
  latitude: 10.5105,
  longitude: 7.4165,
  timeZone: 'Africa/Lagos',   // IANA time-zone id for the live clock (all of nigeria uses this id)
};
const NEXT = { text: 'packing for indonesia', countryCode: 'id' };  // set to null to hide
// ──────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

// two-letter country code -> flag emoji (e.g. 'ng' -> 🇳🇬)
const flag = (cc) => cc.toUpperCase().replace(/[A-Z]/g, (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));
// flag as a small twemoji image, so it also shows on windows (which has no flag emoji); alt keeps the emoji
const flagImg = (cc) => `<img class="flag" src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${[...flag(cc)].map((c) => c.codePointAt(0).toString(16)).join('-')}.svg" alt="${flag(cc)}" width="16" height="16" />`;
const FLAG = flagImg(LOCATION.countryCode);
const HERE = `${LOCATION.city}, ${LOCATION.countryCode}`;               // "kaduna, ng"
const NEXT_TEXT = NEXT ? `, ${NEXT.text} ${flagImg(NEXT.countryCode)}` : '';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const works = JSON.parse(fs.readFileSync(path.join(root, 'scripts/works.json'), 'utf8'));
const EMAIL = 'hello@benjamin.design';
const GITHUB = 'https://github.com/benjamingjoel2';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const lines = (arr) => arr.map((t) => `<span class="line${typeof t === 'object' ? ' ' + t.c : ''}"><span>${typeof t === 'object' ? t.t : t}</span></span>`).join('');

const NAV = [['work', '/work/'], ['gallery', '/gallery/'], ['about', '/about/'], ['contact', '/contact/']];

function page({ path: p, title, description, body, current = '', jsonld = '' }) {
  const menuLinks = [['index', '/'], ...NAV].map(([n, href], i) => `<a class="big${i % 2 ? ' ind' : ''}" href="${href}"${current === n || (n === 'index' && !current) ? ' aria-current="page"' : ''}>${n}</a>`).join('\n        ');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/assets/work/${works[0].slug}.webp" />
  <meta name="theme-color" content="#ececec" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
  <script>try { var t = localStorage.getItem('theme'); if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t; } catch (e) {}</script>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23111'/%3E%3Ctext x='32' y='47' text-anchor='middle' font-family='Inter Tight, Helvetica, Arial, sans-serif' font-weight='700' font-size='46' fill='%23fff'%3Eb%3C/text%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/site.css" />${jsonld}
</head>
<body class="no-js" data-tz="${LOCATION.timeZone}">
  <script>document.body.classList.remove('no-js');</script>
  <a class="sr" href="#main">skip to content</a>

  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">menu</button>
  <div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="menu">
    <nav class="g" aria-label="main">
      <div class="c3w">
        ${menuLinks}
      </div>
    </nav>
    <div class="meta s"><span>${HERE} ${FLAG} · <span data-time>--:--</span></span><a href="mailto:${EMAIL}">${EMAIL}</a></div>
  </div>
  <div class="ghost" aria-hidden="true">
    <div class="col"><span class="big">benjamin</span><span class="s">scroll</span></div>
    <div class="col"><span class="big">builds</span><span class="s">made w/ care in ${LOCATION.city}</span></div>
  </div>

  <header class="bar">
    <a class="bar-name" href="/" aria-label="benjamingjoel, home"${!current ? ' aria-current="page"' : ''}><span class="mark" aria-hidden="true">b</span></a>
    <nav class="bar-nav" aria-label="sections"><span class="lbl">menu</span>${NAV.map(([n, href], i) => `<span><a href="${href}"${current === n ? ' aria-current="page"' : ''}>${n}</a>${i < NAV.length - 1 ? ',' : ''}</span>`).join('')}</nav>
    <button class="theme" type="button" data-theme-toggle aria-label="switch between light and dark mode"><span data-mode="light">light</span><span class="sep" aria-hidden="true">/</span><span data-mode="dark">dark</span></button>
    <p class="bar-time">${HERE} ${FLAG} <span data-h>--</span>:<span data-m>--</span>:<span data-s>--</span></p>
  </header>

  <main id="main">
${body}
  </main>

  <footer>
    <p class="wordmark">benjamin</p>
    <div class="foot s">
      <span>’26 © all rights reserved</span>
      <nav aria-label="footer"><a href="/work/">work</a><a href="/gallery/">gallery</a><a href="/about/">about</a><a href="/contact/">contact</a></nav>
      <span>designer &amp; developer · ${LOCATION.city}</span>
    </div>
  </footer>
  <div class="toast" role="status" aria-live="polite"></div>
  <script src="/assets/works.js"></script>
  <script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

const contactBlock = `    <section class="g contact section" aria-labelledby="contact-h">
      <div class="c3 left">
        <p class="s">available for</p><p class="s">selected projects</p>
        <div class="gap"></div>
        <p class="s muted">write directly to:</p>
        <a class="s email" href="mailto:${EMAIL}" data-copy="${EMAIL}">${EMAIL}</a>
      </div>
      <h2 class="c5 big reveal" id="contact-h">${lines(['one', { t: 'email', c: 'ind' }, 'is all', { t: 'it takes.', c: 'ind' }])}</h2>
    </section>
    <nav class="social" aria-label="elsewhere">
      <a href="${GITHUB}">github</a>
      <a href="mailto:${EMAIL}">email</a>
    </nav>`;

const clockBlock = (heading) => `    <section aria-label="local time in ${LOCATION.city}">
      <div class="g section">
        <p class="sr">${heading.join(' ')}</p>
        <div class="c3w big reveal" aria-hidden="true">${lines(heading.slice(0, 2))}</div>
        <div class="c4w big reveal" aria-hidden="true" style="margin-top:calc(var(--big)*.3)">${lines(heading.slice(2))}</div>
      </div>
      <div class="g clock big" aria-hidden="true">
        <span class="lp">(</span><span class="h num" data-h>--</span><span class="co1">:</span>
        <span class="face"><span class="lbl">${LOCATION.city}</span><span class="orb"></span><span class="sec" data-s>--</span></span>
        <span class="co2">:</span><span class="m num" data-m>--</span><span class="rp">)</span>
      </div>
      <p class="sr">it is <span data-time>--:--</span> in ${LOCATION.city}.</p>
    </section>`;

/* ---------------- home ---------------- */
const home = page({
  path: '/', title: 'benjamin — designer & developer',
  description: `benjamin is a designer and developer working from everywhere, currently in ${LOCATION.city}, designing and building websites end to end. working at tourground.`,
  jsonld: `\n  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Benjamin","jobTitle":"Designer & Developer","worksFor":{"@type":"Organization","name":"Tourground","url":"https://tourground.com"},"homeLocation":{"@type":"Place","name":"${LOCATION.city}, ${LOCATION.country}","geo":{"@type":"GeoCoordinates","latitude":${LOCATION.latitude},"longitude":${LOCATION.longitude}}},"email":"mailto:${EMAIL}","sameAs":["${GITHUB}"]}</script>`,
  body: `    <section class="hero" aria-labelledby="name">
      <div class="hero-low">
        <p class="here" aria-hidden="true">${HERE} ${FLAG} <span data-h>--</span>:<span data-m>--</span>:<span data-s>--</span></p>
        <figure class="now">
          <a href="/about/" aria-label="about benjamin">${Array.from({ length: 12 }, (_, i) => `<img src="/assets/me/${pad(i + 1)}.webp" ${i === 0 ? 'alt="portrait of benjamin" class="on" fetchpriority="high"' : 'alt="" loading="lazy"'} width="640" height="800" />`).join('')}</a>        </figure>
        <div class="state">
          <p class="k">benjamin</p><p class="v">is a designer</p>
          <p class="k"></p><p class="v">&amp; developer,</p>
          <p class="k">run</p><p class="v">from everywhere</p>
          <dl class="kv">
            <div><dt>location</dt><dd>currently ${LOCATION.city} / ${LOCATION.country}${NEXT ? ',' : ''}</dd></div>
            ${NEXT ? `<div><dt></dt><dd>${NEXT.text} ${flagImg(NEXT.countryCode)}</dd></div>` : ''}
            <div><dt>working at</dt><dd><a class="u" href="https://tourground.com">tourground</a></dd></div>
          </dl>
        </div>
      </div>
      <h1 class="name" id="name" data-fit><span>benjamingjoel</span></h1>
    </section>

    <section class="work" id="work" aria-labelledby="work-h" data-work>
      <div class="stage">
        <h2 class="sr" id="work-h">selected work</h2>
        <dl class="info" aria-live="polite">
          <div class="pair role"><dt class="s">role</dt><dd class="s">design<br />development<br />deployment</dd></div>
          <div class="pair"><dt class="s">destination</dt><dd class="s" data-f="country">—</dd></div>
          <div class="pair"><dt class="s">live at</dt><dd class="s"><a data-f="link" href="#">—</a></dd></div>
          <div class="pair"><dt class="s">case</dt><dd class="s"><a data-f="page" href="/work/">view project →</a></dd></div>
        </dl>
        <div class="cards" data-cards></div>
        <div class="mname" aria-hidden="true"><span class="s muted" data-f="mcat"></span><span class="nm" data-f="mname"></span></div>
        <div class="counter" aria-hidden="true"><span class="s lbl">selected work</span><span class="num" data-f="num">01</span><span class="s of" data-f="of">/${pad(works.length)}</span></div>
        <div class="list"><ol data-list></ol></div>
        <div class="sw" aria-hidden="true"><i></i><i></i><i></i></div>
        <span class="s hint muted" aria-hidden="true">scroll</span>
        <a class="s live" href="/work/">all work</a>
      </div>
    </section>

    <section class="g section statement" aria-labelledby="about-h">
      <span class="rule" aria-hidden="true"></span>
      <h2 class="sr" id="about-h">about</h2>
      <div class="c2 big reveal" aria-hidden="true">${lines(['design,'])}</div>
      <div class="c4 big reveal" aria-hidden="true">${lines(['build,'])}</div>
      <div class="c3w big reveal" aria-hidden="true" style="grid-row:2">${lines(['and ship it', 'well.'])}</div>
      <div class="c4 fade" style="grid-row:3">
        <p class="s intro">i’m benjamin, a designer and developer working from everywhere, currently in ${LOCATION.city}. i design and build websites end to end, from the first sketch to a fast, accessible live site. working at tourground.</p>
        <a class="s more" href="/about/">more about me</a>
      </div>
    </section>

${clockBlock(['good work', 'starts with', 'a simple', 'hello.'])}

${contactBlock}`,
});

/* ---------------- work index ---------------- */
const workIndex = page({
  path: '/work/', current: 'work', title: 'work — benjamin',
  description: 'selected websites designed, built and deployed by benjamin.',
  body: `    <section class="g phead" aria-labelledby="h">
      <p class="s count muted">${pad(works.length)} selected projects<br />’24–’26</p>
      <h1 class="c3w big reveal" id="h">${lines(['selected', { t: 'work', c: 'ind' }])}</h1>
    </section>
    <ol class="g wlist">
${works.map((w, i) => `      <li><a class="wrow" href="/work/${w.slug}/" data-peek="/assets/work/${w.slug}.webp">
        <img class="thumb" src="/assets/work/${w.slug}.webp" alt="" width="960" height="600" loading="lazy" />
        <span class="s no">${pad(i + 1)}</span><span class="nm">${esc(w.name)}</span><span class="s ct">${esc(w.country)}</span><span class="s ro">design, build</span><span class="s go">view →</span>
      </a></li>`).join('\n')}
    </ol>
    <div class="peek" aria-hidden="true"><img src="/assets/work/${works[0].slug}.webp" alt="" width="960" height="600" /></div>

${contactBlock}`,
});

/* ---------------- project pages ---------------- */
const projectPages = works.map((w, i) => {
  const next = works[(i + 1) % works.length];
  return [`work/${w.slug}/index.html`, page({
    path: `/work/${w.slug}/`, current: 'work', title: `${w.name} — benjamin`,
    description: `${w.name}: ${w.desc}. designed, built and deployed by benjamin.`,
    body: `    <section class="g proj-head" aria-labelledby="h">
      <p class="s no muted">${pad(i + 1)} / ${pad(works.length)}<br />${esc(w.country)}</p>
      <h1 class="big reveal" id="h">${lines([esc(w.name)])}</h1>
      <p class="s tag fade">${esc(w.desc)}</p>
    </section>
    <dl class="g proj-meta s fade">
      <div><dt>role</dt><dd>design, development,<br />deployment</dd></div>
      <div><dt>destination</dt><dd>${esc(w.country)}</dd></div>
      <div><dt>live site</dt><dd><a href="${w.url}">${esc(w.host)}</a></dd></div>
    </dl>

    <div class="g shot fade"><figure>
      <div class="frame"><img src="/assets/work/${w.slug}.webp" alt="${esc(w.name)} homepage, first screen" width="960" height="600" /></div>
      <figcaption>homepage, desktop</figcaption>
    </figure></div>

    <section class="g desc" aria-label="about the site">
      <p class="fade">“${esc(w.about)}”</p>
      <span class="s src muted fade">from the ${esc(w.name)} homepage</span>
    </section>

    <div class="g shot fade"><figure>
      <div class="frame scrolly" tabindex="0" aria-label="scrollable full homepage"><img src="/assets/work/${w.slug}-long.webp" alt="${esc(w.name)} homepage, scrolled" width="1200" height="3000" loading="lazy" /></div>
      <figcaption>scroll inside the frame to move down the homepage</figcaption>
    </figure></div>

    <div class="g pair-shots">
      <figure class="wide fade"><div class="frame"><img src="/assets/work/${w.slug}-section.webp" alt="${esc(w.name)}, a section further down the homepage" width="1200" height="750" loading="lazy" /></div><figcaption>further down the page</figcaption></figure>
      <div class="phones fade">
        <figure><div class="phone"><img src="/assets/work/${w.slug}-m1.webp" alt="${esc(w.name)} on a phone, first screen" width="540" height="919" loading="lazy" /></div><figcaption>phone</figcaption></figure>
        <figure><div class="phone"><img src="/assets/work/${w.slug}-m2.webp" alt="${esc(w.name)} on a phone, scrolled" width="540" height="919" loading="lazy" /></div><figcaption>phone, scrolled</figcaption></figure>
      </div>
    </div>

    <nav class="g next" aria-label="next project">
      <a href="/work/${next.slug}/"><span class="s lbl muted">next project</span><span class="nm">${esc(next.name)} →</span></a>
    </nav>
    <div class="g back"><a class="s" href="/work/">all work</a></div>`,
  })];
});

/* ---------------- gallery ---------------- */
const views = [['', 'homepage', 960, 600], ['-section', 'section', 1200, 750], ['-m1', 'phone', 540, 919], ['-m2', 'phone, scrolled', 540, 919]];
const shots = [];
views.forEach(([suf, label, wd, ht]) => works.forEach((w) => shots.push({ w, suf, label, wd, ht })));
// interleave so neighbours differ
const galleryItems = shots.map(({ w, suf, label, wd, ht }, k) => `      <figure data-p="${w.slug}"><button type="button" aria-label="open ${esc(w.name)}, ${label}"><img src="/assets/work/${w.slug}${suf}.webp" alt="${esc(w.name)}, ${label}" width="${wd}" height="${ht}"${k > 5 ? ' loading="lazy"' : ''} /></button><figcaption>${esc(w.name)} · ${label}</figcaption></figure>`).join('\n');
const gallery = page({
  path: '/gallery/', current: 'gallery', title: 'gallery — benjamin',
  description: 'screens from websites designed and built by benjamin, on desktop and phone.',
  body: `    <section class="g phead" aria-labelledby="h">
      <p class="s count muted">${shots.length} screens<br />desktop &amp; phone</p>
      <h1 class="c3w big reveal" id="h">${lines(['gallery'])}</h1>
    </section>
    <div class="g filters" role="group" aria-label="filter by project">
      <div class="full" style="display:flex;flex-wrap:wrap;gap:6px">
        <button type="button" data-filter="all" aria-pressed="true">all</button>
${works.map((w) => `        <button type="button" data-filter="${w.slug}" aria-pressed="false">${esc(w.name)}</button>`).join('\n')}
      </div>
    </div>
    <div class="masonry" data-gallery>
${galleryItems}
    </div>
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="image viewer">
      <button class="close" type="button">close</button>
      <img src="" alt="" />
      <div class="bar"><span class="s" data-cap></span><div class="ctrl"><button type="button" data-prev>← prev</button><button type="button" data-next>next →</button></div></div>
    </div>`,
});

/* ---------------- about ---------------- */
const about = page({
  path: '/about/', current: 'about', title: 'about — benjamin',
  description: `benjamin is a designer and developer working from everywhere, currently in ${LOCATION.city}. working at tourground.`,
  body: `    <section class="g phead" aria-labelledby="h">
      <p class="s count muted">designer &amp; developer<br />${HERE} ${FLAG}</p>
      <h1 class="c3w big reveal" id="h">${lines(['hi, i’m', { t: 'benjamin.', c: 'ind' }])}</h1>
    </section>
    <div class="g about-body">
      <p class="fade">i design and build websites end to end: the layout and type, the code, and getting it live and fast.</p>
      <p class="fade">i work from everywhere, right now from ${LOCATION.city}, and i’m working at tourground, where i design, build and deploy travel websites, like the ones in <a class="u" href="/work/">my work</a>.</p>
      <p class="fade">i care about the quiet details: pages that load quickly, read well on a phone, and work for everyone.</p>
    </div>
    <section class="g caps" aria-labelledby="caps-h">
      <h2 class="s muted" id="caps-h">what i do</h2>
      <div class="col fade"><h3>design</h3><ul class="s"><li>website design</li><li>layout &amp; typography</li><li>responsive design</li></ul></div>
      <div class="col fade"><h3>build</h3><ul class="s"><li>html, css, javascript</li><li>fast static sites</li><li>accessibility</li></ul></div>
      <div class="col fade"><h3>ship</h3><ul class="s"><li>deployment &amp; hosting</li><li>seo basics</li><li>keeping sites running</li></ul></div>
    </section>
    <section class="g facts" aria-label="at a glance">
      <dl class="s fade">
        <div><dt>currently in</dt><dd>${LOCATION.city} / ${LOCATION.country}${NEXT_TEXT}</dd></div>
        <div><dt>working at</dt><dd><a class="u" href="https://tourground.com">tourground</a></dd></div>
        <div><dt>elsewhere</dt><dd><a class="u" href="${GITHUB}">github</a></dd></div>
      </dl>
    </section>

${contactBlock}`,
});

/* ---------------- contact ---------------- */
const contact = page({
  path: '/contact/', current: 'contact', title: 'contact — benjamin',
  description: `get in touch with benjamin, designer and developer, currently in ${LOCATION.city}.`,
  body: `    <section class="g phead" aria-labelledby="h">
      <p class="s count muted">available for<br />selected projects</p>
      <h1 class="c3w big reveal" id="h">${lines(['say', { t: 'hello.', c: 'ind' }])}</h1>
    </section>
${clockBlock(['it’s always', 'a good time', 'to start', 'something.'])}

${contactBlock}`,
});

const notFound = page({
  path: '/404', title: 'not found — benjamin', description: 'page not found.',
  body: `    <section class="g phead" aria-labelledby="h">
      <p class="s count muted">404</p>
      <h1 class="c3w big reveal" id="h">${lines(['nothing', { t: 'here.', c: 'ind' }])}</h1>
    </section>
    <div class="g about-body"><p>try the <a class="u" href="/">home page</a> or <a class="u" href="/work/">my work</a>.</p></div>`,
});

const out = [['index.html', home], ['work/index.html', workIndex], ...projectPages, ['gallery/index.html', gallery], ['about/index.html', about], ['contact/index.html', contact], ['404.html', notFound]];
for (const [f, html] of out) {
  fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true });
  fs.writeFileSync(path.join(root, f), html);
}
fs.writeFileSync(path.join(root, 'assets/works.js'), `window.WORKS = ${JSON.stringify(works.map(({ slug, name, country, desc, url, host, sw }) => ({ slug, name, country, desc, url, host, sw })))};\n`);
console.log(out.map(([f, h]) => `${f} ${h.length}`).join('\n'));
