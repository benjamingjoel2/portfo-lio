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
const EMAIL = 'hi@benjamingjoel.com';
const GITHUB = 'https://github.com/benjamingjoel2';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const lines = (arr) => arr.map((t) => `<span class="line${typeof t === 'object' ? ' ' + t.c : ''}"><span>${typeof t === 'object' ? t.t : t}</span></span>`).join('');

const NAV = [['work', '/work/'], ['at tourground', '/tourground/'], ['about', '/about/'], ['contact', '/contact/']];
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
          <nav aria-label="main"><ul class="plist">${PAGES.filter(([n]) => n !== 'contact').map(([n, href]) => `<li><a href="${href}"${(current || 'home') === n ? ' aria-current="page"' : ''}><span>${n}</span>${(current || 'home') === n ? '<i class="live" aria-hidden="true"></i>' : ''}</a></li>`).join('')}</ul></nav>
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

${footer ? `  <footer class="fx" aria-label="footer">
    <div class="fx-in">
      <div class="fx-top">
        <p class="fx-lbl s">say hello</p>
        <a class="fx-up" href="#top" aria-label="back to top">↑</a>
      </div>
      <p class="fx-ask">have an idea, or just want to talk travel tech?</p>
      <a class="fx-mail" href="mailto:${EMAIL}" data-copy="${EMAIL}"><span>${EMAIL}</span><i aria-hidden="true">→</i></a>
      <div class="fx-cols s">
        <div><p class="fx-h">pages</p><ul>${PAGES.map(([n, href]) => `<li><a href="${href}">${n}</a></li>`).join('')}</ul></div>
        <div><p class="fx-h">elsewhere</p><ul><li><a href="${GITHUB}">github</a></li><li><a href="mailto:${EMAIL}">email</a></li><li><a href="https://tourground.com">tourground</a></li></ul></div>
      </div>
      <div class="fx-name-wrap" aria-hidden="true"><p class="fx-name" data-fit>benjamingjoel</p></div>
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
  description: `benjamin is a designer and developer in travel tech, full time at tourground, building the websites for its travel brands.`,
  jsonld: `\n  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Benjamin","jobTitle":"Designer & Developer, Travel Tech","worksFor":{"@type":"Organization","name":"Tourground","url":"https://tourground.com"},"homeLocation":{"@type":"Place","name":"${LOCATION.country}","geo":{"@type":"GeoCoordinates","latitude":${LOCATION.latitude},"longitude":${LOCATION.longitude}}},"email":"mailto:${EMAIL}","sameAs":["${GITHUB}"]}</script>`,
  body: `    <section class="hero" aria-labelledby="name">
      <div class="hero-low">
        <p class="here" aria-hidden="true">${HERE} ${FLAG} <span data-h>--</span>:<span data-m>--</span>:<span data-s>--</span></p>
        <figure class="now">
          <a href="/about/" aria-label="about benjamin">${Array.from({ length: 12 }, (_, i) => `<img src="/assets/me/${pad(i + 1)}.webp" ${i === 0 ? 'alt="portrait of benjamin" class="on" fetchpriority="high"' : 'alt="" loading="lazy"'} width="640" height="800" />`).join('')}</a>        </figure>
        <div class="state">
          <p class="k">benjamin</p><p class="v">sketches, codes</p>
          <p class="k">&amp;</p><p class="v">ships websites</p>
          <p class="k">for</p><p class="v">places you’d fly to</p>
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
          <p class="fm-text">i spend my days making far-off places look worth the flight. seven of them so far, antarctica to japan, all for <a class="u" href="https://tourground.com">tourground</a>. usually from a laptop, sometimes from wherever the wifi is.</p>
          <p class="fm-more"><a class="s more" href="/about/">more about me</a><a class="s more" href="/tourground/">my work at tourground</a></p>
        </div>
      </div>
    </section>

    <section class="st" aria-label="statement">
      <div class="st-rule" aria-hidden="true"></div>
      <p class="st-big">
        <span class="st-l"><span class="ln"><span>the</span></span></span>
        <span class="st-r"><span class="ln"><span>details</span></span><span class="ln"><span>are the whole</span></span><span class="ln"><span>job.</span></span></span>
      </p>
      <div class="st-foot">
        <p class="s st-c">© ’${String(new Date().getFullYear()).slice(2)}</p>
        <p class="s st-small">i design and build websites for tourground’s travel brands, with a focus on clear layouts, fast pages and type that reads well on a phone.</p>
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
          <div><dt>field</dt><dd>travel tech<span>tour commerce infrastructure</span></dd></div>
          <div><dt>location</dt><dd>remote<span>working from everywhere</span></dd></div>
          <div><dt>about</dt><dd><p>tourground is the modern infrastructure for travel agents, dmcs and tour operators. it gives them the network, the technology and the distribution to run a tour operation: a verified profile, one inbox for every inquiry, quotes and payments in a link, and reach across websites, ai chats and whatsapp.</p><p>for travellers it works the other way round: tourground matches you with a trusted local agent, and your agent plans the trip.</p></dd></div>
          <div><dt>highlights</dt><dd>150+ destinations<span class="ink">thousands of agents and suppliers listed</span><span class="ink">tourground os, ai and pay</span></dd></div>
        </dl>
      </div>
      <div class="tg-pics">
${shots.map(([f, alt, wd, ht, cls]) => `        <figure class="${cls}"><img src="/assets/about/${f}.webp" alt="${alt}" width="${wd}" height="${ht}" loading="lazy" decoding="async" /></figure>`).join('\n').replace('<figure class="">', '<figure class="">').replace(/(<figure class="wide">[\s\S]*?<\/figure>)/, '$1\n        <figure class="logo-tile" aria-hidden="true"><span>tourground</span></figure>')}
      </div>
    </div>`,
});

/* ---------------- about (main) ---------------- */
const mosaic = [
  ['/assets/me/03.webp', 'a late work session, laptops out', 'big'],
  ['/assets/me/07.webp', 'three of us at the bar', ''],
  ['/assets/me/05.webp', 'dressed up for an evening out', 'tall'],
  ['/assets/me/04.webp', 'clouds from a plane window', ''],
  ['/assets/me/09.webp', 'resting between sessions', ''],
  ['/assets/me/12.webp', 'two laptops on the sofa', ''],
  ['/assets/me/08.webp', 'mirror selfie after tennis', ''],
];
const about = page({
  path: '/about/', current: 'about', title: 'about — benjamin',
  description: `benjamin is a designer and developer in travel tech, full time at tourground. working from everywhere.`,
  body: `    <section class="ab-top">
      <div class="ab-l">
        <h1 class="ab-title">pixels, places<br />&amp; travel tech</h1>
        <figure class="ab-big"><img src="/assets/about/table.webp" alt="lunch outdoors with friends, under the trees" width="1200" height="900" decoding="async" /></figure>
      </div>
      <div class="ab-r">
        <figure class="ab-small"><img src="/assets/me/01.webp" alt="portrait of benjamin" width="640" height="800" decoding="async" /></figure>
        <div class="ab-copy">
          <p>hi, i’m benjamin. i’m a designer and developer in travel tech, working full time at <a class="u" href="/tourground/">tourground</a>, where i design, build and ship the websites for its travel brands.</p>
          <p>the part i like most sits right between design and code: drawing a layout, building it properly, then getting it live, fast and easy to read on a phone.</p>
          <p>i work from everywhere${NEXT ? `, and right now i’m ${NEXT.text}` : ''}.</p>
          <p>and travel. that gets its own section.</p>
        </div>
      </div>
    </section>

    <section class="oc" aria-labelledby="oc-h" data-par>
      <h2 class="oc-h" id="oc-h">off the clock</h2>
      <figure class="oc-p p1" data-speed="-.18"><img src="/assets/me/02.webp" alt="long lunch outside with friends" width="640" height="800" loading="lazy" /></figure>
      <figure class="oc-p p2" data-speed=".22"><img src="/assets/me/04.webp" alt="clouds from a plane window" width="640" height="800" loading="lazy" /></figure>
      <figure class="oc-p p3" data-speed="-.08"><img src="/assets/me/07.webp" alt="three of us at the bar" width="640" height="800" loading="lazy" /></figure>
      <figure class="oc-p p4" data-speed=".3"><img src="/assets/me/08.webp" alt="mirror selfie, racket in hand" width="640" height="800" loading="lazy" /></figure>
      <p class="oc-t s">most weekends there’s a long lunch with friends somewhere, a racket if there’s a free court, and a window seat whenever there’s a flight.</p>
    </section>

    <section class="mw" aria-labelledby="mw-h" data-mw>
      <div class="mw-pin">
        <p class="s mw-l">mostly, i work on…</p>
        <div class="mw-stage"><img src="/assets/me/sky.webp" alt="" width="1600" height="900" loading="lazy" data-mw-img /><h2 class="mw-h" id="mw-h"><span>design</span><span>development</span></h2></div>
      </div>
    </section>

    <section class="sv" aria-label="my services" data-sv>
      <article class="sv-c"><a class="sv-go" href="/work/" aria-label="see the work">(→)</a><div class="sv-b"><h3>design<sup>(my services)</sup></h3><img src="/assets/work/seventhcontinent-section.webp" alt="seventh continent, a section of the site" width="1200" height="750" loading="lazy" /><p class="s">making travel websites that are clear, useful and good to look at. photos first, quiet type, and enough room for a place to breathe.</p></div></article>
      <article class="sv-c"><a class="sv-go" href="/tourground/" aria-label="my work at tourground">(→)</a><div class="sv-b"><h3>development<sup>(my services)</sup></h3><img src="/assets/work/komorebi-section.webp" alt="komorebi, a section of the site" width="1200" height="750" loading="lazy" /><p class="s">building them so they load fast, read well on a phone and work for everyone. clean code, small details, and true to the design.</p></div></article>
    </section>
    <script>(()=>{const cs=[...document.querySelectorAll('[data-sv] .sv-c')];const f=()=>{cs.forEach((c,i)=>{const n=cs[i+1];c.classList.toggle('under',!!n&&n.getBoundingClientRect().top<innerHeight*.55)});requestAnimationFrame(f)};f()})()</script>

    <section class="cr" aria-labelledby="cr-h">
      <ul class="cr-tags">${['layout & typography', 'responsive design', 'design systems', 'html', 'css', 'javascript', 'fast static sites', 'accessibility', 'performance', 'seo basics', 'deployment & hosting'].map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="cr-side"><p class="s">a small collection of what i use, from layout and type to getting a site live.</p><h2 class="cr-h" id="cr-h">my craft</h2></div>
    </section>

    <script>(()=>{const red=matchMedia('(prefers-reduced-motion: reduce)').matches;const par=document.querySelector('[data-par]'),ps=[...document.querySelectorAll('[data-speed]')],mw=document.querySelector('[data-mw]'),mi=document.querySelector('[data-mw-img]');const f=()=>{if(!red){const r=par.getBoundingClientRect(),c=(r.top+r.height/2-innerHeight/2);ps.forEach(e=>{e.style.transform='translate3d(0,'+(c*+e.dataset.speed)+'px,0)'});}requestAnimationFrame(f)};f()})()</script>

    <section class="ab-band" aria-labelledby="band-h">
      <img src="/assets/me/sky.webp" alt="" width="1600" height="900" loading="lazy" decoding="async" />
      <p class="ab-band-lbl">travel › places</p>
      <h2 class="ab-band-t" id="band-h">i build websites for trips to antarctica, iceland and japan, usually from wherever the laptop is.${NEXT ? ' next stop: ' + NEXT.text.replace('packing for ', '') + '.' : ''}</h2>
    </section>

    <section class="ab-places" aria-labelledby="pl-h" data-places>
      <h2 class="ab-lbl" id="pl-h">explore by destination</h2>
      <div class="ab-places-in">
        <ol class="pl-list">
${works.map((w, k) => `          <li><a href="/work/${w.slug}/" data-place="${k}"${k === 0 ? ' class="on"' : ''}>${w.country.toLowerCase() === 'united arab emirates' ? 'the uae' : w.country.toLowerCase()}<sup>${w.name.toLowerCase()}</sup></a></li>`).join('\n')}
        </ol>
        <div class="pl-pics">
${works.map((w, k) => `          <div class="pl-set${k === 0 ? ' on' : ''}" data-set="${k}" aria-hidden="true"><img src="/assets/work/${w.slug}.webp" alt="" width="960" height="600" loading="lazy" /><img src="/assets/work/${w.slug}-m1.webp" alt="" width="540" height="919" loading="lazy" /><img src="/assets/work/${w.slug}-m2.webp" alt="" width="540" height="919" loading="lazy" /><img src="/assets/work/${w.slug}-section.webp" alt="" width="1200" height="750" loading="lazy" /></div>`).join('\n')}
        </div>
      </div>
    </section>`,
});

/* ---------------- contact ---------------- */
const contact = page({
  path: '/contact/', current: 'contact', footer: false, title: 'contact — benjamin',
  description: `get in touch with benjamin, designer and developer in travel tech.`,
  body: `    <section class="cx" aria-labelledby="h">
      <figure class="cx-pic fade"><img src="/assets/me/01.webp" alt="portrait of benjamin" width="640" height="800" decoding="async" /></figure>
      <div class="cx-info fade">
        <p class="cx-coffee">in town?<br />the coffee’s on me.</p>
        <p class="s muted cx-lab">write directly to:</p>
        <p class="cx-em"><a class="cx-mail" href="mailto:${EMAIL}" data-copy="${EMAIL}">${EMAIL}</a></p>
      </div>
      <h1 class="cx-big" id="h"><span class="ln a"><span>say</span></span><span class="ln b"><span>hello.</span></span><span class="ln c"><span>coffee’s</span></span><span class="ln d"><span>on me.</span></span></h1>
    </section>`,
});

const notFound = page({
  path: '/404', title: 'not found — benjamin', description: 'page not found.',
  body: `    <section class="g phead" aria-labelledby="h">
      <p class="s count muted">404</p>
      <h1 class="c3w big reveal" id="h">${lines(['nothing', { t: 'here.', c: 'ind' }])}</h1>
    </section>
    <div class="g about-body"><p>try the <a class="u" href="/">home page</a> or <a class="u" href="/work/">my work</a>.</p></div>`,
});

/* ---------------- work page options (temporary, to choose a design) ---------------- */
const optBar = (k) => `<nav class="obar" aria-label="work page options"><a href="/work-options/">all</a>${[1, 2, 3, 4].map((n) => `<a href="/work-options/${n}/"${n === k ? ' aria-current="page"' : ''}>${n}</a>`).join('')}<a href="/work/">current</a></nav>`;
const optHead = (h) => `    <section class="wo-head"><h1 class="wo-h">${h}</h1><p class="s muted">${pad(works.length)} projects · all for tourground</p></section>`;
const opt1 = page({
  path: '/work-options/1/', current: 'work', title: 'work, option 1 — benjamin', description: 'work page option 1',
  body: `${optHead('work')}
    <ol class="wo1">
${works.map((w, i) => `      <li class="fade"><a href="/work/${w.slug}/"><div class="ph"><img src="/assets/work/${w.slug}.webp" alt="${esc(w.name)} homepage" width="960" height="600" loading="${i < 2 ? 'eager' : 'lazy'}" /><span class="go s">view project →</span></div><div class="cap"><span class="s muted">${pad(i + 1)}</span><span class="nm">${esc(w.name)}</span><span class="s muted">${esc(w.country)}</span></div><p class="s ds">${esc(w.desc)}</p></a></li>`).join('\n')}
    </ol>
${optBar(1)}`,
});
const opt2 = page({
  path: '/work-options/2/', current: 'work', title: 'work, option 2 — benjamin', description: 'work page option 2',
  body: `    <section class="st wo2-top" aria-label="work">
      <div class="st-rule" aria-hidden="true"></div>
      <h1 class="st-big"><span class="st-l"><span class="ln"><span>all</span></span></span><span class="st-r"><span class="ln"><span>the</span></span><span class="ln"><span>work.</span></span></span></h1>
      <div class="st-foot"><p class="s st-c">${pad(works.length)} brands</p><p class="s st-small">every site below is a tourground travel brand, designed, built and shipped by me.</p></div>
    </section>
    <ol class="wo2">
${works.map((w, i) => `      <li><a href="/work/${w.slug}/" data-peek="/assets/work/${w.slug}.webp"><span class="n s">’${pad(i + 1)}</span><span class="t">${esc(w.name)}</span><span class="c s">${esc(w.country)}</span><span class="d s">${esc(w.desc)}</span><span class="a">→</span></a></li>`).join('\n')}
    </ol>
    <div class="peek" aria-hidden="true"><img src="/assets/work/${works[0].slug}.webp" alt="" width="960" height="600" /></div>
${optBar(2)}`,
});
const opt3 = page({
  path: '/work-options/3/', current: 'work', title: 'work, option 3 — benjamin', description: 'work page option 3',
  body: `${optHead('work')}
    <div class="wo3">
${works.map((w, i) => `      <a class="wo3-c" href="/work/${w.slug}/" style="top:${84 + i * 10}px;background:${w.sw[0]};color:${w.sw[1]}"><div class="tx"><span class="s">${pad(i + 1)} / ${pad(works.length)} · ${esc(w.country)}</span><h2>${esc(w.name)}</h2><p>${esc(w.desc)}</p><span class="s go">view project →</span></div><img src="/assets/work/${w.slug}.webp" alt="${esc(w.name)} homepage" width="960" height="600" loading="lazy" /></a>`).join('\n')}
    </div>
${optBar(3)}`,
});
const opt4 = page({
  path: '/work-options/4/', current: 'work', title: 'work, option 4 — benjamin', description: 'work page option 4',
  body: `${optHead('work')}
    <section class="wo4" data-reel style="height:${works.length * 60 + 60}vh">
      <div class="wo4-pin"><div class="wo4-in">
        <div class="wo4-hd s"><span>scroll to move sideways</span><span data-rc>01 / ${pad(works.length)}</span></div>
        <div class="wo4-tr" data-tr>${works.map((w, i) => `<a class="wo4-c" href="/work/${w.slug}/"><div class="ph"><img src="/assets/work/${w.slug}.webp" alt="${esc(w.name)} homepage" width="960" height="600" ${i > 1 ? 'loading="lazy"' : ''} /></div><div class="l"><b>${esc(w.name)}</b><span class="s">${pad(i + 1)} · ${esc(w.country)}</span></div></a>`).join('')}</div>
        <div class="wo4-bar"><i data-rb></i></div>
      </div></div>
    </section>
    <script>(()=>{const s=document.querySelector('[data-reel]'),t=document.querySelector('[data-tr]'),b=document.querySelector('[data-rb]'),c=document.querySelector('[data-rc]'),N=${works.length};const f=()=>{const r=s.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight))),m=t.scrollWidth-t.parentElement.clientWidth;t.style.transform='translate3d('+(-p*m)+'px,0,0)';b.style.width=(p*100)+'%';c.textContent=String(Math.min(N,Math.floor(p*N)+1)).padStart(2,'0')+' / '+String(N).padStart(2,'0');requestAnimationFrame(f)};f()})()</script>
${optBar(4)}`,
});
const optIndex = page({
  path: '/work-options/', current: 'work', title: 'work page options — benjamin', description: 'pick a work page design',
  body: `${optHead('pick a work page')}
    <ol class="wo-pick">
${[['1', 'big image grid', 'large screenshot cards, two per row, the right column sits lower. name, country and a line under each.'], ['2', 'hairline table', '“all the work.” on the vertical line like your statement section, then a clean table; a screenshot follows your cursor.'], ['3', 'stacking cards', 'one project per screen in its own brand colours; each card slides up and stacks over the last.'], ['4', 'sideways reel', 'a dark frame where the projects slide sideways as you scroll down, with a progress line.']].map(([k, n, d]) => `      <li><a href="/work-options/${k}/"><span class="s muted">option ${k}</span><b>${n}</b><p class="s">${d}</p></a></li>`).join('\n')}
    </ol>
${optBar(0)}`,
});

const out = [['index.html', home], ['work/index.html', workIndex], ...projectPages, ['tourground/index.html', tgPage], ['about/index.html', about], ['contact/index.html', contact], ['404.html', notFound], ['work-options/index.html', optIndex], ['work-options/1/index.html', opt1], ['work-options/2/index.html', opt2], ['work-options/3/index.html', opt3], ['work-options/4/index.html', opt4]];
for (const [f, html] of out) {
  fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true });
  fs.writeFileSync(path.join(root, f), html);
}
fs.writeFileSync(path.join(root, 'assets/works.js'), WORKS_JS);
console.log(out.map(([f, h]) => `${f} ${h.length}`).join('\n'));
