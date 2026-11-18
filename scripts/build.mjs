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
import { createHash } from 'node:crypto';

// two-letter country code -> flag emoji (e.g. 'ng' -> 🇳🇬)
const flag = (cc) => cc.toUpperCase().replace(/[A-Z]/g, (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));
// flag as a small twemoji image, so it also shows on windows (which has no flag emoji); alt keeps the emoji
const flagImg = (cc) => `<img class="flag" src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${[...flag(cc)].map((c) => c.codePointAt(0).toString(16)).join('-')}.svg" alt="${flag(cc)}" width="16" height="16" />`;
const FLAG = flagImg(LOCATION.countryCode);
const HERE = `${LOCATION.city}, ${LOCATION.countryCode}`;               // "kaduna, ng"
const NEXT_TEXT = NEXT ? `, ${NEXT.text} ${flagImg(NEXT.countryCode)}` : '';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const works = JSON.parse(fs.readFileSync(path.join(root, 'scripts/works.json'), 'utf8'));
const WORKS_JS = `window.WORKS = ${JSON.stringify(works.map(({ slug, name, country, desc, url, host, sw }) => ({ slug, name, country, desc, url, host, sw })))};\n`;
// version tag per file: changes whenever the file changes, so browsers never keep an old copy
const ver = (text) => createHash('sha1').update(text).digest('hex').slice(0, 10);
const V = {
  css: ver(fs.readFileSync(path.join(root, 'assets/site.css'))),
  js: ver(fs.readFileSync(path.join(root, 'assets/site.js'))),
  works: ver(WORKS_JS),
};
const EMAIL = 'hello@benjamin.design';
const GITHUB = 'https://github.com/benjamingjoel2';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const lines = (arr) => arr.map((t) => `<span class="line${typeof t === 'object' ? ' ' + t.c : ''}"><span>${typeof t === 'object' ? t.t : t}</span></span>`).join('');

const NAV = [['work', '/work/'], ['at tourground', '/tourground/'], ['gallery', '/gallery/'], ['about', '/about/'], ['contact', '/contact/']];
const PAGES =[['home', '/'], ...NAV];

function page({ path: p, title, description, body, current = '', jsonld = '', dark = false, footer = true }) {
  return `<!doctype html>
<html lang="en"${dark ? ' data-force="dark"' : ''}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/assets/work/${works[0].slug}.webp" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
  <script>try { var t = localStorage.getItem('theme'); if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t; } catch (e) {}</script>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23111'/%3E%3Ctext x='32' y='47' text-anchor='middle' font-family='Bricolage Grotesque, Helvetica, Arial, sans-serif' font-weight='700' font-size='46' fill='%23fff'%3Eb%3C/text%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/site.css?v=${V.css}" />${jsonld}
</head>
<body class="no-js" data-tz="${LOCATION.timeZone}">
  <script>document.body.classList.remove('no-js');</script>
  <a class="sr" href="#main">skip to content</a>

  <header class="hdr" id="top">
    <a class="chip logo" href="/" aria-label="benjamingjoel, home"><span class="mark" aria-hidden="true">b</span></a>
    <div class="chip pages" data-pages>
      <button class="pages-btn" type="button" aria-expanded="false" aria-controls="pages-panel"><span class="cur">${current || 'home'}</span><span class="sr">, open menu</span><span class="ico" aria-hidden="true"><i></i><i></i><i></i></span></button>
      <div class="pages-panel" id="pages-panel">
        <div class="pages-inner">
          <nav aria-label="main"><ul class="plist">${PAGES.map(([n, href]) => `<li><a href="${href}"${(current || 'home') === n ? ' aria-current="page"' : ''}><span>${n}</span>${(current || 'home') === n ? '<i class="live" aria-hidden="true"></i>' : ''}</a></li>`).join('')}</ul></nav>
          <p class="follow">follow me</p>
          <ul class="frow"><li><a href="${GITHUB}">github</a></li><li><a href="mailto:${EMAIL}">email</a></li><li><a href="https://tourground.com">tourground</a></li></ul>
        </div>
      </div>
    </div>
    <div class="hdr-right">
      <p class="chip here-chip">${HERE} ${FLAG} <span data-h>--</span>:<span data-m>--</span>:<span data-s>--</span></p>
      <button class="chip theme" type="button" data-theme-toggle aria-label="switch between light and dark mode"><span class="half" aria-hidden="true"></span></button>
      <a class="chip cta" href="/contact/">contact me <span aria-hidden="true">›</span></a>
    </div>
  </header>

  <main id="main">
${body}
  </main>

${footer ? `  <footer class="ftr">
    <div class="g ftr-top">
      <p class="ftr-lead">i design and build websites for travel brands, full time at tourground. want to talk travel tech, or just say hello? my inbox is open.</p>
      <ul class="ftr-soc s"><li><a href="${GITHUB}">github</a></li><li><a href="mailto:${EMAIL}">email</a></li><li><a href="https://tourground.com">tourground</a></li></ul>
    </div>
    <div class="ftr-name-wrap"><p class="ftr-name" data-fit aria-hidden="true">benjamingjoel</p></div>
    <div class="g ftr-base s">
      <span>© ${new Date().getFullYear()} benjamingjoel</span>
      <a class="ftr-top-link" href="#top">↑ back to top</a>
      <a class="ftr-m" href="mailto:${EMAIL}" data-copy="${EMAIL}">→ ${EMAIL}</a>
    </div>
  </footer>` : ''}
  <div class="toast" role="status" aria-live="polite"></div>
  <script src="/assets/works.js?v=${V.works}"></script>
  <script src="/assets/site.js?v=${V.js}" defer></script>
</body>
</html>
`;
}

const contactBlock = `    <section class="g contact section" aria-labelledby="contact-h">
      <div class="c3 left">
        <p class="s">travel tech</p><p class="s">at tourground</p>
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
  description: `benjamin is a designer and developer in travel tech, full time at tourground, building the websites for its travel brands. currently in ${LOCATION.city}.`,
  jsonld: `\n  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Benjamin","jobTitle":"Designer & Developer, Travel Tech","worksFor":{"@type":"Organization","name":"Tourground","url":"https://tourground.com"},"homeLocation":{"@type":"Place","name":"${LOCATION.city}, ${LOCATION.country}","geo":{"@type":"GeoCoordinates","latitude":${LOCATION.latitude},"longitude":${LOCATION.longitude}}},"email":"mailto:${EMAIL}","sameAs":["${GITHUB}"]}</script>`,
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

    <section class="fm-sec" aria-labelledby="about-h">
      <div class="g fm-row">
        <h2 class="fm-lbl" id="about-h">about:</h2>
        <div class="fm-body fade">
          <p class="fm-text">i spend my days making far-off places look worth the flight. seven of them so far, antarctica to japan, all for <a class="u" href="https://tourground.com">tourground</a>. usually from a laptop in ${LOCATION.city}, sometimes from wherever the wifi is.</p>
          <p class="fm-more"><a class="s more" href="/about/">more about me</a><a class="s more" href="/tourground/">my work at tourground</a></p>
        </div>
      </div>
    </section>

    <div class="work-head"><h2 id="work-h">selected work</h2><p class="s">${pad(works.length)} projects</p></div>
    <section class="work" id="work" aria-labelledby="work-h" data-work>
      <div class="stage">
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
    </section>`,
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
    <div class="peek" aria-hidden="true"><img src="/assets/work/${works[0].slug}.webp" alt="" width="960" height="600" /></div>`,
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
// my photos and the website screens, mixed so neighbours differ
const views = [['', 'homepage', 960, 600], ['-m1', 'phone', 540, 919], ['-section', 'section', 1200, 750], ['-m2', 'phone, scrolled', 540, 919]];
const screens = [];
views.forEach(([suf, label, wd, ht]) => works.forEach((w) => screens.push({ src: `/assets/work/${w.slug}${suf}.webp`, alt: `${w.name}, ${label}`, wd, ht })));
const photos = Array.from({ length: 12 }, (_, i) => ({ src: `/assets/me/${pad(i + 1)}.webp`, alt: i === 0 ? 'portrait of benjamin' : `photo ${pad(i + 1)} from benjamin’s camera roll`, wd: 640, ht: 800 }));
const archive = [];
for (let i = 0, a = 0, b = 0; a < screens.length || b < photos.length; i++) {
  if (i % 10 === 0 || i % 10 === 4 || i % 10 === 7) { if (b < photos.length) archive.push(photos[b++]); else archive.push(screens[a++]); }
  else if (a < screens.length) archive.push(screens[a++]); else archive.push(photos[b++]);
}
const galleryItems = archive.map((it, k) => `      <figure><button type="button" aria-label="open ${esc(it.alt)}"><img src="${it.src}" alt="${esc(it.alt)}" width="${it.wd}" height="${it.ht}"${k > 13 ? ' loading="lazy"' : ''} decoding="async" /></button><figcaption class="sr">${esc(it.alt)}</figcaption></figure>`).join('\n');
const gallery = page({
  path: '/gallery/', current: 'gallery', dark: true, title: 'gallery — benjamin',
  description: 'photos and screens from websites designed and built by benjamin.',
  body: `    <h1 class="sr">gallery</h1>
    <div class="archive" data-gallery>
${galleryItems}
    </div>
    <p class="archive-note s">${archive.length} images · hover for colour, click to open</p>
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="image viewer">
      <button class="close" type="button">close</button>
      <img src="" alt="" />
      <div class="bar"><span class="s" data-cap></span><div class="ctrl"><button type="button" data-prev>← prev</button><button type="button" data-next>next →</button></div></div>
    </div>`,
});

/* ---------------- about ---------------- */
const shots = [
  ['session', 'late work session with the laptops out', 1200, 800, 'wide'],
  ['setup', 'my desk: code on one screen, a tourground page on the other', 800, 800, ''],
  ['room', 'a conference room, mid-meeting', 1200, 675, 'wide'],
  ['couch', 'working from the sofa', 800, 800, ''],
  ['team', 'three of us, between sessions', 800, 800, ''],
]
const tgPage = page({
  path: '/tourground/', current: 'at tourground', footer: false, title: 'tourground — benjamin',
  description: `benjamin is a designer and developer in travel tech, working full time at tourground on the websites for its travel brands.`,
  body: `    <div class="tg">
      <div class="tg-side">
        <h1 class="tg-title">tourground</h1>
        <dl class="tg-dl">
          <div><dt>role</dt><dd>designer<span>developer</span></dd></div>
          <div><dt>work</dt><dd>full time</dd></div>
          <div><dt>field</dt><dd>travel tech<span>destination brands</span></dd></div>
          <div><dt>location</dt><dd>remote<span>currently ${LOCATION.city} / ${LOCATION.country}</span></dd></div>
          <div><dt>about</dt><dd><p>i design, build and ship the websites for tourground’s travel brands. each brand is one destination, planned by specialists, and each site is mine from the first layout to the live page: the design, the front end, the hosting and the speed.</p></dd></div>
          <div><dt>highlights</dt><dd>${works.length} brand sites live<span class="ink">from antarctica to japan</span></dd></div>
        </dl>
      </div>
      <div class="tg-pics">
${shots.map(([f, alt, wd, ht, cls]) => `        <figure class="${cls}"><img src="/assets/about/${f}.webp" alt="${alt}" width="${wd}" height="${ht}" loading="lazy" decoding="async" /></figure>`).join('\n').replace('<figure class="">', '<figure class="">').replace(/(<figure class="wide">[\s\S]*?<\/figure>)/, '$1\n        <figure class="logo-tile" aria-hidden="true"><span>tourground</span></figure>')}
      </div>
    </div>`,
});

/* ---------------- about (main) ---------------- */
const strip = [
  ['02', 'long lunch outside with friends'], ['03', 'a late session, laptops out'], ['04', 'clouds from a plane window'],
  ['07', 'three of us at the bar'], ['05', 'dressed up for a night out'], ['10', 'a meeting in the glass room'],
  ['12', 'two laptops on the sofa'], ['08', 'mirror selfie after tennis'], ['06', 'photos open on the laptop'],
];
const about = page({
  path: '/about/', current: 'about', title: 'about — benjamin',
  description: `benjamin designs and builds websites for travel brands at tourground. working from everywhere, currently in ${LOCATION.city}.`,
  body: `    <section class="ap-hero g" aria-labelledby="h">
      <p class="fm-lbl ap-lbl">about:</p>
      <h1 class="ap-title" id="h">i make far-off places look worth the flight.</h1>
      <figure class="ap-card"><img src="/assets/me/01.webp" alt="portrait of benjamin" width="640" height="800" decoding="async" /><figcaption class="s">benjamin, ${LOCATION.city}</figcaption></figure>
      <dl class="ap-kv s">
        <div><dt>role</dt><dd>designer &amp; developer</dd></div>
        <div><dt>day job</dt><dd><a class="u" href="/tourground/">tourground</a></dd></div>
        <div><dt>based</dt><dd>everywhere, now ${LOCATION.city}</dd></div>
        ${NEXT ? `<div><dt>next</dt><dd>${NEXT.text.replace('packing for ', '')} ${flagImg(NEXT.countryCode)}</dd></div>` : ''}
      </dl>
    </section>

    <section class="fm-sec ap-rows">
      <div class="g fm-row">
        <h2 class="fm-lbl">the short version:</h2>
        <p class="fm-text fade">i’m benjamin. i design websites and then build them myself, so the idea in the sketch is usually still there on the live site. most days that’s for tourground, where every brand is one destination: antarctica, iceland, japan, benin and a few more.</p>
      </div>
      <div class="g fm-row">
        <h2 class="fm-lbl">how i work:</h2>
        <p class="fm-text fade">paper first, then into the browser early. i keep things plain on purpose: static pages, quick loads, type that reads well on a phone. if a page drags on a bad connection, it isn’t finished yet.</p>
      </div>
      <div class="g fm-row">
        <h2 class="fm-lbl">off the clock:</h2>
        <p class="fm-text fade">tennis when i can find a court, long lunches with friends, and more photos out of plane windows than anyone needs.</p>
      </div>
    </section>

    <section class="ap-strip" aria-labelledby="strip-h">
      <div class="g ap-strip-head"><h2 class="fm-lbl" id="strip-h">camera roll:</h2><p class="s muted">drag or scroll sideways</p></div>
      <ul class="ap-reel" tabindex="0" aria-label="photos, scroll sideways">
${strip.map(([n, alt], k) => `        <li><figure><img src="/assets/me/${n}.webp" alt="${alt}" width="640" height="800" loading="lazy" decoding="async" /><figcaption class="s"><span>${pad(k + 1)}</span>${alt}</figcaption></figure></li>`).join('\n')}
      </ul>
    </section>

    <section class="ap-dark" aria-labelledby="pl-h" data-places>
      <div class="ap-dark-head"><h2 id="pl-h">places i’ve built for</h2><p class="s">${pad(works.length)} destinations</p></div>
      <div class="ab-places-in">
        <ol class="pl-list">
${works.map((w, k) => `          <li><a href="/work/${w.slug}/" data-place="${k}"${k === 0 ? ' class="on"' : ''}>${w.country.toLowerCase() === 'united arab emirates' ? 'the uae' : w.country.toLowerCase()}<sup>${w.name.toLowerCase()}</sup></a></li>`).join('\n')}
        </ol>
        <div class="pl-pics">
${works.map((w, k) => `          <div class="pl-set${k === 0 ? ' on' : ''}" data-set="${k}" aria-hidden="true"><img src="/assets/work/${w.slug}.webp" alt="" width="960" height="600" loading="lazy" /><img src="/assets/work/${w.slug}-m1.webp" alt="" width="540" height="919" loading="lazy" /><img src="/assets/work/${w.slug}-m2.webp" alt="" width="540" height="919" loading="lazy" /><img src="/assets/work/${w.slug}-section.webp" alt="" width="1200" height="750" loading="lazy" /></div>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="fm-sec">
      <div class="g fm-row ap-now">
        <h2 class="fm-lbl">right now:</h2>
        <div class="fade">
          <p class="ap-clock">${HERE} ${FLAG} <span data-h>--</span>:<span data-m>--</span>:<span data-s>--</span></p>
          <p class="fm-text">${NEXT ? `${NEXT.text}. ` : ''}still building for <a class="u" href="/tourground/">tourground</a>, still happy to talk travel tech: <a class="u" href="mailto:${EMAIL}" data-copy="${EMAIL}">${EMAIL}</a>.</p>
        </div>
      </div>
    </section>`,
});

/* ---------------- contact ---------------- */
const contact = page({
  path: '/contact/', current: 'contact', title: 'contact — benjamin',
  description: `get in touch with benjamin, designer and developer, currently in ${LOCATION.city}.`,
  body: `    <section class="g phead" aria-labelledby="h">
      <p class="s count muted">travel tech<br />at tourground</p>
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

const out = [['index.html', home], ['work/index.html', workIndex], ...projectPages, ['gallery/index.html', gallery], ['tourground/index.html', tgPage], ['about/index.html', about], ['contact/index.html', contact], ['404.html', notFound]];
for (const [f, html] of out) {
  fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true });
  fs.writeFileSync(path.join(root, f), html);
}
fs.writeFileSync(path.join(root, 'assets/works.js'), WORKS_JS);
console.log(out.map(([f, h]) => `${f} ${h.length}`).join('\n'));
