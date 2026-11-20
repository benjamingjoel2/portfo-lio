// four home-page mixes: the current site + pieces of concept a (the bleibtgleich-style one).
// it reads the built home page (index.html), keeps its hero, about, selected work and footer,
// and adds new sections around them.
// run after the main build:  node scripts/build.mjs && node scripts/concepts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const works = JSON.parse(fs.readFileSync(path.join(root, 'scripts/works.json'), 'utf8'));
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const lc = (s) => s.toLowerCase();
const pad = (n) => String(n).padStart(2, '0');

// cut the current home page into its parts
const cut = (a, b) => { const i = home.indexOf(a); const j = home.indexOf(b, i); if (i < 0 || j < 0) throw new Error('marker not found: ' + a); return home.slice(i, j); };
const PRE = home.slice(0, home.indexOf('    <section class="hero"'));
const HERO = cut('    <section class="hero"', '    <section class="fm-sec"');
const ABOUT = cut('    <section class="fm-sec"', '    <div class="work-head">');
const WORK = cut('    <div class="work-head">', '  </main>');
const POST = home.slice(home.indexOf('  </main>'));

const CONCEPTS = [
  ['1', 'ring first', 'your hero, then the turning ring of work straight after it, then about, selected work and a brands table with a hover preview.'],
  ['2', 'on the line', 'a statement hung on one hairline, selected work, then the turning ring of work.'],
  ['3', 'camera roll', 'the ring after the hero, counters that tick up, and a draggable strip of your photos. pale corner words like concept a.'],
  ['4', 'ring in the hero', 'the ring turns behind your name in the hero itself, then the statement, selected work, brands table and “right now”.'],
];

/* ---------------- new sections ---------------- */
const ringCards = works.flatMap((w) => [[w, `/assets/work/${w.slug}.webp`, 'l'], [w, `/assets/work/${w.slug}-m1.webp`, 'p']]);
const ringHTML = (cls = '') => `<div class="rg-scene ${cls}" aria-hidden="true"><div class="rg-ring" data-ring>${ringCards.map(([w, src, k]) => `<a class="rg-c ${k}" href="/work/${w.slug}/" tabindex="-1"><img src="${src}" alt="" loading="lazy" decoding="async" /></a>`).join('')}</div></div>`;

const RING = `
    <section class="rg" data-ring-sec aria-labelledby="rg-h">
      <div class="rg-pin">
        <h2 class="rg-h" id="rg-h"><span>work</span><span>24–26</span></h2>
        ${ringHTML()}
        <p class="s rg-note">${works.length} brands, all for tourground · <a class="u" href="/work/">see them all</a></p>
      </div>
    </section>
`;

const STATEMENT = `
    <section class="st" aria-label="statement">
      <div class="st-rule" aria-hidden="true"></div>
      <p class="st-big"><span class="ln l"><span>the</span></span><span class="ln"><span>details</span></span><span class="ln"><span>are the whole</span></span><span class="ln"><span>job.</span></span></p>
      <p class="s st-small">i design and build websites for tourground’s travel brands, with a focus on clear layouts, fast pages and type that reads well on a phone.</p>
      <p class="s st-c">© ’${String(new Date().getFullYear()).slice(2)}</p>
    </section>
`;

const TABLE = `
    <section class="tb" aria-labelledby="tb-h">
      <h2 class="tb-h" id="tb-h"><span>&amp; the</span><span>brands</span></h2>
      <ol class="tb-list">
${works.map((w, i) => `        <li><a href="/work/${w.slug}/" data-img="/assets/work/${w.slug}.webp"><span class="n">’${pad(i + 1)}</span><span class="t">${lc(w.name)}</span><span class="c">${lc(w.country)}</span><span class="r">design, build, ship</span><span class="h">${w.host}</span></a></li>`).join('\n')}
      </ol>
      <div class="tb-peek" aria-hidden="true"><img src="/assets/work/${works[0].slug}.webp" alt="" /></div>
    </section>
`;

const NOW = `
    <section class="nw" aria-labelledby="nw-h">
      <h2 class="s nw-lbl" id="nw-h">right now</h2>
      <div class="nw-grid">
        <div><p class="s muted">local time</p><p class="nw-big"><span data-h>--</span>:<span data-m>--</span><span class="nw-s">:<span data-s>--</span></span></p></div>
        <div><p class="s muted">based in</p><p class="nw-big">kaduna</p></div>
        <div><p class="s muted">next</p><p class="nw-big">indonesia</p></div>
        <div><p class="s muted">working at</p><p class="nw-big"><a href="/tourground/">tourground</a></p></div>
      </div>
    </section>
`;

const COUNTERS = `
    <section class="ct" aria-label="in numbers">
      ${[[works.length, 'brands built'], [7, 'destinations'], [5, 'continents'], [1, 'laptop']].map(([n, l]) => `<div class="ct-i"><p class="ct-n" data-count="${n}">00</p><p class="s">${l}</p></div>`).join('\n      ')}
    </section>
`;

const PHOTOS = `
    <section class="ph" aria-labelledby="ph-h">
      <div class="ph-head"><h2 class="ph-h" id="ph-h">camera roll</h2><p class="s muted">drag sideways</p></div>
      <ul class="ph-reel" data-drag tabindex="0" aria-label="photos">
${['02', '03', '04', '07', '05', '10', '12', '08', '06', '09', '11'].map((n, k) => `        <li><img src="/assets/me/${n}.webp" alt="" width="640" height="800" loading="lazy" decoding="async" draggable="false" /><span class="s">${pad(k + 1)}</span></li>`).join('\n')}
      </ul>
    </section>
`;

const GHOST = `<div class="mx-ghost" aria-hidden="true"><span>benjamin</span><span>gjoel</span></div>`;

const HERO_WITH_RING = HERO.replace('<h1 class="name"', `${ringHTML('in-hero')}\n      <h1 class="name"`).replace('<section class="hero"', '<section class="hero has-ring" data-ring-sec');

const CSS = `
<style>
/* ring of work (from concept a) */
.rg { position: relative; height: 260vh; }
.rg-pin { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
.rg-h { position: absolute; top: 22vh; left: 0; right: 0; margin: 0; display: flex; justify-content: center; gap: 16vw; font-size: clamp(40px, 5vw, 84px); font-weight: 600; letter-spacing: -0.05em; z-index: 2; pointer-events: none; }
.rg-note { position: absolute; left: var(--ml); bottom: 22px; margin: 0; color: var(--muted); }
.rg-scene { position: absolute; top: 58%; left: 50%; width: 0; height: 0; perspective: 1400px; }
.rg-ring { position: absolute; transform-style: preserve-3d; }
.rg-c { position: absolute; display: block; transform-style: preserve-3d; }
.rg-c.l { width: 150px; height: 94px; left: -75px; top: -47px; }
.rg-c.p { width: 78px; height: 132px; left: -39px; top: -66px; }
.rg-c img { width: 100%; height: 100%; object-fit: cover; object-position: top; border: 5px solid var(--ink); background: var(--ink); transition: border-color .3s; }
.rg-c:hover img { border-color: var(--muted); }
.hero.has-ring { position: relative; overflow: hidden; }
.rg-scene.in-hero { top: 40%; left: 58%; z-index: 0; }
@media (max-width: 767px) { .rg-scene.in-hero { top: 77%; left: 50%; transform: scale(.62); } }
.hero.has-ring .hero-low, .hero.has-ring .name { position: relative; z-index: 1; }
@media (max-width: 767px) { .rg-c.l { width: 104px; height: 65px; left: -52px; top: -32px; } .rg-c.p { width: 54px; height: 92px; left: -27px; top: -46px; } .rg-h { gap: 18vw; } }

/* statement on a hairline */
.st { position: relative; padding: 20vh var(--m) 18vh calc(37% + 12px); }
.st-rule { position: absolute; left: 37%; top: 0; bottom: 0; width: 1px; background: var(--hair); }
.st-big { margin: 0; font-size: clamp(44px, 5.4vw, 92px); font-weight: 600; letter-spacing: -0.055em; line-height: .96; }
.st-big .ln { display: block; overflow: hidden; }
.st-big .ln > span { display: inline-block; transform: translateY(105%); transition: transform 1.1s var(--ease); }
.st-big .ln:nth-child(2) > span { transition-delay: .08s; } .st-big .ln:nth-child(3) > span { transition-delay: .16s; } .st-big .ln:nth-child(4) > span { transition-delay: .24s; }
.st.in .st-big .ln > span { transform: none; }
.st-big .ln.l { margin-left: calc(-37vw + 14vw); }
.st-small { max-width: 24em; margin: 7vh 0 0; line-height: 1.4; }
.st-c { margin: 12vh 0 0; color: var(--muted); }
@media (max-width: 767px) { .st { padding-left: 34px; } .st-rule { left: 20px; } .st-big .ln.l { margin-left: 0; } }

/* brands table with hover preview */
.tb { padding: 18vh var(--m) 4vh var(--ml); position: relative; }
.tb-h { margin: 0 0 6vh calc(37% - var(--ml)); font-size: clamp(44px, 5.4vw, 92px); font-weight: 600; letter-spacing: -0.055em; line-height: .96; }
.tb-h span { display: block; }
.tb-h span:first-child { margin-left: -14vw; }
.tb-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--ink); }
.tb-list a { display: grid; grid-template-columns: 8% 26% 18% 20% 1fr; align-items: baseline; padding: 14px 0 12px; border-bottom: 1px solid var(--hair); font-size: 15px; transition: padding .4s var(--ease), color .3s; }
.tb-list .t { font-size: clamp(20px, 1.8vw, 28px); letter-spacing: -0.03em; font-weight: 500; }
.tb-list .n, .tb-list .r, .tb-list .h { color: var(--muted); font-size: 13px; }
.tb-list .h { text-align: right; }
.tb-list:hover a { color: var(--muted); }
.tb-list a:hover { color: var(--ink); padding-left: 14px; }
.tb-peek { position: fixed; left: 0; top: 0; width: 300px; aspect-ratio: 16 / 10; pointer-events: none; z-index: 40; opacity: 0; transition: opacity .25s; box-shadow: 0 30px 60px -30px rgba(0,0,0,.5); }
.tb-peek.on { opacity: 1; }
.tb-peek img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
@media (max-width: 767px) { .tb-h { margin-left: 0; } .tb-h span:first-child { margin-left: 0; } .tb-list a { grid-template-columns: 34px 1fr auto; } .tb-list .r, .tb-list .h { display: none; } .tb-peek { display: none; } }

/* right now board */
.nw { padding: 16vh var(--m) 4vh var(--ml); }
.nw-lbl { margin: 0 0 18px; padding-bottom: 12px; border-bottom: 1px solid var(--ink); }
.nw-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.nw-grid p { margin: 0; }
.nw-big { font-size: clamp(30px, 3.6vw, 60px); font-weight: 600; letter-spacing: -0.045em; line-height: 1; margin-top: 10px !important; font-variant-numeric: tabular-nums; }
.nw-big a { text-decoration: underline; text-decoration-thickness: .06em; text-underline-offset: .1em; }
.nw-s { color: var(--muted); }
@media (max-width: 767px) { .nw-grid { grid-template-columns: 1fr 1fr; row-gap: 30px; } }

/* counters */
.ct { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; padding: 18vh var(--m) 4vh var(--ml); }
.ct-i { border-top: 1px solid var(--ink); padding-top: 14px; }
.ct-n { margin: 0 0 8px; font-size: clamp(64px, 9vw, 160px); font-weight: 500; letter-spacing: -0.06em; line-height: .85; font-variant-numeric: tabular-nums; }
@media (max-width: 767px) { .ct { grid-template-columns: 1fr 1fr; row-gap: 40px; } }

/* camera roll */
.ph { padding-top: 16vh; }
.ph-head { display: flex; justify-content: space-between; align-items: baseline; padding: 0 var(--m) 18px var(--ml); }
.ph-h { margin: 0; font-size: clamp(40px, 5vw, 84px); font-weight: 600; letter-spacing: -0.05em; }
.ph-reel { list-style: none; margin: 0; padding: 0 var(--m) 0 var(--ml); display: flex; gap: 14px; overflow-x: auto; scrollbar-width: none; cursor: grab; user-select: none; }
.ph-reel::-webkit-scrollbar { display: none; }
.ph-reel.drag { cursor: grabbing; }
.ph-reel li { flex: 0 0 clamp(200px, 22vw, 330px); }
.ph-reel img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; filter: grayscale(1); transition: filter .6s var(--ease), transform .6s var(--ease); pointer-events: none; }
.ph-reel li:hover img { filter: none; transform: scale(.98); }
.ph-reel span { display: block; margin-top: 8px; color: var(--muted); }
@media (hover: none) { .ph-reel img { filter: none; } }

/* pale corner words (from concept a) */
.mx-ghost { position: fixed; left: 0; right: 0; bottom: -.14em; display: flex; justify-content: space-between; padding: 0 14px; font-size: 8vw; font-weight: 600; letter-spacing: -0.05em; color: var(--ghost); pointer-events: none; z-index: 0; line-height: 1; }
main, .ftr { position: relative; z-index: 1; }

/* concept switcher */
.cbar { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%); z-index: 999; display: flex; gap: 2px; padding: 4px; border-radius: 99px; background: rgba(20,20,20,.92); color: #fff; font-size: 13px; box-shadow: 0 10px 30px -10px rgba(0,0,0,.5); }
.cbar a { padding: 7px 12px; border-radius: 99px; }
.cbar a[aria-current] { background: #fff; color: #111; }
html, body { overflow-x: clip; }
</style>`;

const JS = `
<script>
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* rings: lay the cards round a circle, turn with scroll + a slow drift */
  const rings = [...document.querySelectorAll('[data-ring]')].map((ring) => {
    const cards = [...ring.children], N = cards.length;
    const place = () => { const R = Math.min(innerWidth * .34, 440); cards.forEach((c, i) => { const a = i / N * 360, y = ((i % 3) - 1) * (innerWidth < 768 ? 46 : 74); c.style.transform = 'rotateY(' + a + 'deg) translateZ(' + R + 'px) translateY(' + y + 'px)'; }); };
    place(); addEventListener('resize', place);
    return { ring, sec: ring.closest('[data-ring-sec]') };
  });
  let drift = 0;
  const tick = () => {
    if (!reduce) drift += .06;
    rings.forEach(({ ring, sec }) => {
      const r = sec.getBoundingClientRect();
      const span = Math.max(1, r.height - innerHeight * .4);
      const p = Math.min(1.4, Math.max(-.2, -r.top / span));
      ring.style.transform = 'rotateX(-10deg) rotateY(' + (p * 360 + drift) + 'deg)';
    });
    requestAnimationFrame(tick);
  };
  if (rings.length) tick();

  /* statement lines slide up, counters count up */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.matches('[data-count]')) {
      const end = +e.target.dataset.count, t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 1400); e.target.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3)))).padStart(2, '0'); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  }), { threshold: .3 });
  document.querySelectorAll('.st, [data-count]').forEach((el) => io.observe(el));

  /* brands table: a preview follows the cursor */
  const peek = document.querySelector('.tb-peek');
  if (peek) {
    const im = peek.querySelector('img');
    document.querySelectorAll('.tb-list a').forEach((a) => {
      a.addEventListener('mouseenter', () => { im.src = a.dataset.img; peek.classList.add('on'); });
      a.addEventListener('mouseleave', () => peek.classList.remove('on'));
    });
    addEventListener('mousemove', (e) => { peek.style.transform = 'translate(' + (e.clientX + 24) + 'px,' + (e.clientY - 100) + 'px)'; });
  }

  /* camera roll: drag to scroll */
  document.querySelectorAll('[data-drag]').forEach((el) => {
    let down = false, x0 = 0, s0 = 0;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; x0 = e.clientX; s0 = el.scrollLeft; el.classList.add('drag'); });
    addEventListener('pointerup', () => { down = false; el.classList.remove('drag'); });
    addEventListener('pointermove', (e) => { if (down) el.scrollLeft = s0 - (e.clientX - x0); });
  });
})();
</script>`;

const cbar = (cur) => `<nav class="cbar" aria-label="design concepts"><a href="/concepts/">all</a>${CONCEPTS.map(([k]) => `<a href="/concepts/${k}/"${k === cur ? ' aria-current="page"' : ''}>${k}</a>`).join('')}<a href="/">current</a></nav>`;

const build = (k, sections, extra = '') => {
  let html = PRE.replace('</head>', CSS + '\n</head>').replace('<meta name="viewport"', '<meta name="robots" content="noindex" />\n  <meta name="viewport"')
    + sections.join('\n') + POST.replace('</body>', cbar(k) + JS + '\n</body>');
  html = html.replace('<title>', `<title>mix ${k} · `);
  if (extra) html = html.replace('<main id="main">', extra + '\n  <main id="main">');
  const f = path.join(root, `concepts/${k}/index.html`);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
};

build('1', [HERO, RING, ABOUT, WORK, TABLE]);
build('2', [HERO, ABOUT, STATEMENT, WORK, RING]);
build('3', [HERO, RING, ABOUT, WORK, COUNTERS, PHOTOS], GHOST);
build('4', [HERO_WITH_RING, ABOUT, STATEMENT, WORK, TABLE, NOW]);

// remove the old letter concepts
for (const k of ['a', 'b', 'c', 'd']) fs.rmSync(path.join(root, 'concepts', k), { recursive: true, force: true });

// picker
fs.writeFileSync(path.join(root, 'concepts/index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex" /><title>home page mixes — benjamin</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&display=swap" rel="stylesheet" />
<style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:'Bricolage Grotesque',Arial,sans-serif;text-transform:lowercase;padding:6vh 24px 80px}a{color:inherit;text-decoration:none}
h1{margin:0 0 8px;font-size:clamp(40px,6vw,96px);letter-spacing:-.05em;font-weight:500}.sub{color:#666;max-width:40em;line-height:1.45;margin:0 0 6vh}
.list{display:grid;grid-template-columns:1fr 1fr;gap:14px}.list a{display:block;border:1px solid #e2e2e2;border-radius:16px;padding:24px;transition:background .3s}.list a:hover{background:#f4f4f4}
.list span{font-size:13px;color:#888}.list b{display:block;font-size:clamp(28px,3vw,48px);font-weight:500;letter-spacing:-.04em;margin:6px 0 10px}.list p{margin:0;color:#444;line-height:1.45}
@media(max-width:760px){.list{grid-template-columns:1fr}}</style></head>
<body><h1>four mixes</h1><p class="sub">your current home page plus pieces of concept a: the turning ring of work, the hairline statement, the brands table. each adds two or three new sections. open each and tell me the number.</p>
<div class="list">${CONCEPTS.map(([k, n, d]) => `<a href="/concepts/${k}/"><span>mix ${k}</span><b>${n}</b><p>${d}</p></a>`).join('')}</div>
<p class="sub" style="margin-top:6vh"><a href="/" style="border-bottom:1px solid">← the current site</a></p></body></html>`);
console.log('mixes written');
