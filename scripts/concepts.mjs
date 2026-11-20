// four design concepts for the home page, built from the same content.
// run: node scripts/concepts.mjs  -> writes concepts/{index,a,b,c,d}/index.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const works = JSON.parse(fs.readFileSync(path.join(root, 'scripts/works.json'), 'utf8'));
const lc = (s) => s.toLowerCase();
const pad = (n) => String(n).padStart(2, '0');
const EMAIL = 'hello@benjamin.design';
const STATEMENT = ['sketches, codes', 'ships websites', 'places you’d fly to'];
const CONCEPTS = [
  ['a', 'the index', 'swiss and light. your projects are the hero, as a big list with a floating preview.'],
  ['b', 'cinema', 'dark and full-screen. your sites play like film stills, one after another.'],
  ['c', 'the magazine', 'warm paper, a cover, and each project laid out as a spread.'],
  ['d', 'colour cards', 'each brand in its own colours, cards that stack as you scroll.'],
];

const head = (title, extra = '') => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&display=swap" rel="stylesheet" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23111'/%3E%3Ctext x='16' y='24' text-anchor='middle' font-family='Arial' font-weight='700' font-size='24' fill='%23fff'%3Eb%3C/text%3E%3C/svg%3E" />
<style>
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:'Bricolage Grotesque','Helvetica Neue',Arial,sans-serif;text-transform:lowercase;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%;height:auto}
.cbar{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:99;display:flex;gap:4px;padding:4px;border-radius:99px;background:rgba(17,17,17,.92);color:#fff;font-size:13px;box-shadow:0 10px 30px -10px rgba(0,0,0,.5)}
.cbar a{padding:7px 12px;border-radius:99px}
.cbar a[aria-current]{background:#fff;color:#111}
${extra}
</style>
</head>`;
const cbar = (cur) => `<nav class="cbar" aria-label="design concepts"><a href="/concepts/">all</a>${CONCEPTS.map(([k]) => `<a href="/concepts/${k}/"${k === cur ? ' aria-current="page"' : ''}>${k}</a>`).join('')}</nav>`;
const clock = `<script>(()=>{const f=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});const t=()=>document.querySelectorAll('[data-clock]').forEach(e=>e.textContent=f.format(new Date()));t();setInterval(t,1000)})()</script>`;
const write = (rel, html) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };

/* ---------------- a: the index ---------------- */
write('concepts/a/index.html', `${head('concept a — the index', `
body{background:#f4f4f2;color:#111}
.top{display:grid;grid-template-columns:1fr auto auto;gap:24px;align-items:center;padding:18px 24px;font-size:14px;position:sticky;top:0;background:rgba(244,244,242,.9);backdrop-filter:blur(10px);z-index:5}
.top .logo{display:grid;place-items:center;width:28px;height:28px;background:#111;color:#f4f4f2;font-weight:700;font-size:20px;padding-bottom:3px}
.top nav{display:flex;gap:22px}
.top nav a:hover{text-decoration:underline;text-underline-offset:3px}
.hero{display:grid;grid-template-columns:repeat(12,1fr);gap:0 24px;padding:10vh 24px 6vh;align-items:end}
.hero h1{grid-column:1/span 8;margin:0;font-size:clamp(44px,7vw,120px);line-height:.92;letter-spacing:-.055em;font-weight:500}
.hero h1 span{display:block}
.hero h1 span:nth-child(2){padding-left:1.2em}
.hero .side{grid-column:10/span 3;font-size:14px;line-height:1.45;color:#555}
.hero .side img{width:110px;aspect-ratio:4/5;object-fit:cover;margin-bottom:14px;filter:grayscale(1)}
.lbl{display:flex;justify-content:space-between;padding:0 24px 10px;font-size:13px;color:#666;border-bottom:1px solid #111;margin:0 24px;padding-left:0;padding-right:0}
.idx{list-style:none;margin:0 24px;padding:0}
.idx a{display:grid;grid-template-columns:60px 1fr 220px 40px;align-items:baseline;gap:16px;padding:14px 0 10px;border-bottom:1px solid #d6d6d2;transition:padding .4s cubic-bezier(.2,.8,.2,1),color .3s}
.idx .n{font-size:13px;color:#888}
.idx .t{font-size:clamp(34px,5.6vw,96px);letter-spacing:-.05em;line-height:.95;font-weight:500}
.idx .c{font-size:14px;color:#666}
.idx .ar{justify-self:end;font-size:22px;transition:transform .4s}
.idx:hover a{color:#b5b5b0}
.idx a:hover{color:#111;padding-left:18px}
.idx a:hover .ar{transform:rotate(-45deg)}
.peek{position:fixed;left:0;top:0;width:340px;aspect-ratio:16/10;pointer-events:none;z-index:4;opacity:0;transition:opacity .25s;box-shadow:0 30px 60px -30px rgba(0,0,0,.45)}
.peek img{width:100%;height:100%;object-fit:cover;object-position:top}
.peek.on{opacity:1}
.about{display:grid;grid-template-columns:repeat(12,1fr);gap:24px;padding:18vh 24px}
.about p{grid-column:4/span 7;margin:0;font-size:clamp(22px,2.6vw,42px);line-height:1.15;letter-spacing:-.03em}
.about small{grid-column:1/span 3;font-size:13px;color:#666}
.end{padding:0 24px 80px;border-top:1px solid #111;margin:0 24px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:18px 0 90px;font-size:14px}
.end .mail{font-size:clamp(28px,5vw,80px);letter-spacing:-.05em;flex-basis:100%;margin-bottom:30px}
@media(max-width:800px){.top nav{display:none}.hero{display:block}.hero .side{margin-top:30px}.idx a{grid-template-columns:30px 1fr 24px}.idx .c{display:none}.peek{display:none}.about{display:block}.about small{display:block;margin-bottom:16px}}
`)}
<body>
<header class="top"><a class="logo" href="/">b</a><nav><a href="/work/">work</a><a href="/tourground/">at tourground</a><a href="/about/">about</a><a href="/contact/">contact</a></nav><span>kaduna, ng · <span data-clock>--:--:--</span></span></header>
<section class="hero"><h1>${STATEMENT.map((l) => `<span>${l}</span>`).join('')}</h1><div class="side"><img src="/assets/me/01.webp" alt="portrait of benjamin" width="640" height="800" />benjamin, designer &amp; developer in travel tech. working at tourground, currently in kaduna, packing for indonesia.</div></section>
<p class="lbl"><span>index of work</span><span>${pad(works.length)} brands</span></p>
<ol class="idx">${works.map((w, i) => `<li><a href="/work/${w.slug}/" data-img="/assets/work/${w.slug}.webp"><span class="n">${pad(i + 1)}</span><span class="t">${lc(w.name)}</span><span class="c">${lc(w.country)}</span><span class="ar">→</span></a></li>`).join('')}</ol>
<div class="peek" aria-hidden="true"><img alt="" src="/assets/work/${works[0].slug}.webp" /></div>
<section class="about"><small>about</small><p>i spend my days making far-off places look worth the flight. seven so far, antarctica to japan, all for tourground.</p></section>
<footer class="end"><a class="mail" href="mailto:${EMAIL}">${EMAIL}</a><span>© ${new Date().getFullYear()} benjamingjoel</span><a href="https://github.com/benjamingjoel2">github</a><a href="#">back to top ↑</a></footer>
${cbar('a')}${clock}
<script>(()=>{const pk=document.querySelector('.peek'),im=pk.querySelector('img');document.querySelectorAll('.idx a').forEach(a=>{a.addEventListener('mouseenter',()=>{im.src=a.dataset.img;pk.classList.add('on')});a.addEventListener('mouseleave',()=>pk.classList.remove('on'))});addEventListener('mousemove',e=>{pk.style.transform='translate('+(e.clientX+24)+'px,'+(e.clientY-110)+'px)'})})()</script>
</body></html>`);

/* ---------------- b: cinema ---------------- */
write('concepts/b/index.html', `${head('concept b — cinema', `
body{background:#0b0b0b;color:#eee}
.top{position:fixed;inset:0 0 auto;display:flex;justify-content:space-between;align-items:center;padding:20px 28px;z-index:5;font-size:14px;mix-blend-mode:difference;color:#fff}
.top nav{display:flex;gap:24px}
.reel{position:relative;height:100svh;overflow:hidden}
.reel img{position:absolute;inset:0;width:100%;height:100% !important;object-fit:cover;opacity:0;transform:scale(1.08);transition:opacity 1.2s,transform 6s linear}
.reel img.on{opacity:1;transform:scale(1)}
.reel::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,0) 35%,rgba(0,0,0,.75))}
.cap{position:absolute;left:28px;right:28px;bottom:28px;z-index:2;display:grid;grid-template-columns:1fr auto;align-items:end;gap:20px}
.cap h1{margin:0;font-size:clamp(56px,12vw,220px);line-height:.85;letter-spacing:-.06em;font-weight:500}
.cap .meta{font-size:14px;line-height:1.5;text-align:right;color:#bbb}
.cap .meta b{display:block;font-size:clamp(28px,3vw,48px);color:#fff;font-weight:500;letter-spacing:-.03em}
.dots{position:absolute;top:50%;right:28px;z-index:2;display:grid;gap:8px;transform:translateY(-50%)}
.dots i{width:6px;height:6px;border-radius:50%;background:#fff;opacity:.3;transition:opacity .3s}
.dots i.on{opacity:1}
.intro{display:grid;grid-template-columns:1fr 2fr;gap:40px;padding:16vh 28px;align-items:start}
.intro img{width:180px;aspect-ratio:4/5;object-fit:cover;border-radius:6px}
.intro p{margin:0;font-size:clamp(26px,3.2vw,54px);line-height:1.08;letter-spacing:-.035em}
.intro p span{color:#777}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:0 28px}
.card{display:block;position:relative;overflow:hidden;border-radius:8px;background:#151515}
.card:nth-child(3n+1){grid-column:1/-1}
.card img{width:100%;aspect-ratio:16/9;object-fit:cover;object-position:top;transition:transform 1s cubic-bezier(.2,.8,.2,1),filter .6s;filter:brightness(.8)}
.card:hover img{transform:scale(1.04);filter:none}
.card .l{position:absolute;left:20px;bottom:18px;right:20px;display:flex;justify-content:space-between;align-items:end}
.card .l b{font-size:clamp(24px,2.6vw,44px);font-weight:500;letter-spacing:-.04em}
.card .l span{font-size:13px;color:#ccc}
.end{padding:20vh 28px 90px;text-align:center}
.end a{font-size:clamp(34px,7vw,120px);letter-spacing:-.05em;border-bottom:2px solid #333}
.end p{color:#777;font-size:14px;margin-top:40px}
@media(max-width:800px){.top nav{display:none}.cap{grid-template-columns:1fr}.cap .meta{text-align:left}.intro{grid-template-columns:1fr}.grid{grid-template-columns:1fr}}
`)}
<body>
<header class="top"><a href="/">benjamingjoel</a><nav><a href="/work/">work</a><a href="/tourground/">at tourground</a><a href="/about/">about</a><a href="/contact/">contact</a></nav><span data-clock>--:--:--</span></header>
<section class="reel" aria-label="projects">
${works.map((w, i) => `<img src="/assets/work/${w.slug}${i % 2 ? '-section' : ''}.webp" alt="${lc(w.name)}"${i === 0 ? ' class="on"' : ''} />`).join('\n')}
<div class="cap"><h1>benjamin<br />gjoel</h1><div class="meta">now showing <b data-name>${lc(works[0].name)}</b><span data-n>01</span> / ${pad(works.length)} · <span data-c>${lc(works[0].country)}</span></div></div>
<div class="dots" aria-hidden="true">${works.map((_, i) => `<i${i === 0 ? ' class="on"' : ''}></i>`).join('')}</div>
</section>
<section class="intro"><img src="/assets/me/01.webp" alt="portrait of benjamin" width="640" height="800" /><p>benjamin ${STATEMENT.join(' ')}. <span>seven brands for tourground, from antarctica to japan, mostly from a laptop in kaduna.</span></p></section>
<section class="grid">${works.map((w) => `<a class="card" href="/work/${w.slug}/"><img src="/assets/work/${w.slug}.webp" alt="" loading="lazy" /><span class="l"><b>${lc(w.name)}</b><span>${lc(w.country)}</span></span></a>`).join('')}</section>
<footer class="end"><a href="mailto:${EMAIL}">say hello</a><p>${EMAIL} · kaduna, ng · © ${new Date().getFullYear()}</p></footer>
${cbar('b')}${clock}
<script>(()=>{const W=${JSON.stringify(works.map((w) => [lc(w.name), lc(w.country)]))};const im=[...document.querySelectorAll('.reel img')],d=[...document.querySelectorAll('.dots i')];let i=0;setInterval(()=>{im[i].classList.remove('on');d[i].classList.remove('on');i=(i+1)%im.length;im[i].classList.add('on');d[i].classList.add('on');document.querySelector('[data-name]').textContent=W[i][0];document.querySelector('[data-c]').textContent=W[i][1];document.querySelector('[data-n]').textContent=String(i+1).padStart(2,'0')},3800)})()</script>
</body></html>`);

/* ---------------- c: the magazine ---------------- */
write('concepts/c/index.html', `${head('concept c — the magazine', `
body{background:#f1ece2;color:#1d1a16}
.mast{display:flex;justify-content:space-between;padding:16px 26px;font-size:13px;border-bottom:1px solid #1d1a16}
.mast nav{display:flex;gap:20px}
.cover{padding:16px 26px 0;position:relative}
.cover h1{margin:0;font-size:22vw;line-height:.8;letter-spacing:-.07em;font-weight:700;text-align:center;color:#c2410c}
.cover .issue{display:flex;justify-content:space-between;font-size:13px;padding:12px 0;border-bottom:1px solid #1d1a16}
.spread{display:grid;grid-template-columns:1fr 1.1fr 1fr;gap:26px;padding:26px 0 0;align-items:start}
.spread img{width:100%;aspect-ratio:4/5;object-fit:cover}
.lines p{margin:0 0 22px;font-size:15px;line-height:1.35}
.lines p b{display:block;font-size:clamp(22px,2.2vw,36px);font-weight:600;letter-spacing:-.03em;line-height:1.02;margin-bottom:6px}
.lines.r{text-align:right}
.inside{padding:16vh 26px 0}
.inside h2{font-size:13px;font-weight:500;border-bottom:1px solid #1d1a16;padding-bottom:10px;margin:0 0 40px;display:flex;justify-content:space-between}
.art{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding:0 0 14vh}
.art:nth-child(even) .pic{order:2}
.art .pic img{width:100%;aspect-ratio:4/3;object-fit:cover;object-position:top}
.art .no{font-size:clamp(80px,12vw,200px);line-height:.8;letter-spacing:-.06em;color:#c2410c;font-weight:700}
.art h3{margin:12px 0 10px;font-size:clamp(32px,4vw,64px);letter-spacing:-.045em;line-height:.95;font-weight:600}
.art p{margin:0 0 16px;font-size:17px;line-height:1.45;max-width:30em}
.art a.more{font-size:14px;border-bottom:1px solid}
.letter{margin:0 26px;padding:12vh 0;border-top:1px solid #1d1a16;display:grid;grid-template-columns:1fr 2fr;gap:40px}
.letter p{margin:0;font-size:clamp(22px,2.4vw,38px);line-height:1.2;letter-spacing:-.02em}
.letter p::first-letter{font-size:3.2em;float:left;line-height:.8;margin:6px 10px 0 0;color:#c2410c;font-weight:700}
.end{margin:0 26px;padding:20px 0 90px;border-top:1px solid #1d1a16;display:flex;justify-content:space-between;font-size:13px;flex-wrap:wrap;gap:10px}
@media(max-width:800px){.mast nav{display:none}.spread{grid-template-columns:1fr}.lines.r{text-align:left}.art{grid-template-columns:1fr;gap:16px}.art:nth-child(even) .pic{order:0}.letter{grid-template-columns:1fr}}
`)}
<body>
<header class="mast"><span>the benjamin review</span><nav><a href="/work/">work</a><a href="/tourground/">at tourground</a><a href="/about/">about</a><a href="/contact/">contact</a></nav><span data-clock>--:--:--</span></header>
<section class="cover">
<div class="issue"><span>issue no. ${pad(works.length)}</span><span>the travel tech issue</span><span>kaduna, ${new Date().getFullYear()}</span></div>
<h1>benjamin</h1>
<div class="spread">
<div class="lines"><p><b>${STATEMENT[0]}</b>&amp; ${STATEMENT[1]} for ${STATEMENT[2]}.</p><p><b>seven brands</b>antarctica to japan, all built for tourground.</p></div>
<img src="/assets/me/01.webp" alt="portrait of benjamin" width="640" height="800" />
<div class="lines r"><p><b>now in kaduna</b>packing for indonesia, laptop first.</p><p><b>inside →</b>${works.slice(0, 3).map((w) => lc(w.country)).join(', ')} and more.</p></div>
</div>
</section>
<section class="inside"><h2><span>inside this issue</span><span>${pad(works.length)} features</span></h2>
${works.map((w, i) => `<article class="art"><a class="pic" href="/work/${w.slug}/"><img src="/assets/work/${w.slug}.webp" alt="${lc(w.name)} homepage" loading="lazy" /></a><div><div class="no">${pad(i + 1)}</div><h3>${lc(w.name)}</h3><p>${lc(w.about)}</p><a class="more" href="/work/${w.slug}/">read the feature →</a></div></article>`).join('\n')}
</section>
<section class="letter"><span style="font-size:13px">a note from the editor</span><p>i spend my days making far-off places look worth the flight. most of it happens on a laptop in kaduna, and sometimes from wherever the wifi is.</p></section>
<footer class="end"><a href="mailto:${EMAIL}">${EMAIL}</a><span>© ${new Date().getFullYear()} benjamingjoel</span><a href="#">back to the cover ↑</a></footer>
${cbar('c')}${clock}
</body></html>`);

/* ---------------- d: colour cards ---------------- */
write('concepts/d/index.html', `${head('concept d — colour cards', `
body{background:#fafafa;color:#111}
.top{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;font-size:14px}
.top nav{display:flex;gap:6px}
.top nav a{padding:8px 14px;border-radius:99px;background:#ececec}
.top nav a:hover{background:#111;color:#fff}
.hero{padding:8vh 20px 10vh}
.hero h1{margin:0;font-size:clamp(46px,8.4vw,150px);line-height:.95;letter-spacing:-.055em;font-weight:500;max-width:12em}
.hero h1 .pill{display:inline-flex;align-items:center;vertical-align:middle;height:.78em;padding:0 .3em;border-radius:99px;font-size:.55em;margin:0 .08em;letter-spacing:-.02em;transform:translateY(-.08em)}
.hero h1 img{display:inline-block;vertical-align:middle;height:.8em;width:.8em;border-radius:50%;object-fit:cover;transform:translateY(-.06em)}
.hero p{margin:30px 0 0;font-size:15px;color:#666}
.stack{padding:0 20px}
.cardx{position:sticky;top:20px;height:min(86vh,780px);border-radius:28px;padding:30px;display:grid;grid-template-columns:1fr 1.3fr;gap:30px;align-items:end;margin-bottom:24px;overflow:hidden;box-shadow:0 -20px 50px -30px rgba(0,0,0,.35)}
.cardx .txt .n{font-size:14px;opacity:.7}
.cardx h2{margin:10px 0 14px;font-size:clamp(44px,6.4vw,112px);line-height:.88;letter-spacing:-.055em;font-weight:600}
.cardx p{margin:0 0 22px;font-size:17px;line-height:1.4;max-width:24em;opacity:.85}
.cardx .go{display:inline-flex;padding:12px 18px;border-radius:99px;font-size:14px}
.cardx .shot{align-self:center;border-radius:14px;overflow:hidden;box-shadow:0 30px 60px -20px rgba(0,0,0,.45);transform:rotate(2deg)}
.cardx .shot img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top}
.bye{padding:18vh 20px 100px;display:grid;grid-template-columns:auto 1fr;gap:30px;align-items:center}
.bye img{width:120px;height:120px;border-radius:50%;object-fit:cover}
.bye a{font-size:clamp(36px,6vw,100px);letter-spacing:-.05em;font-weight:500}
.bye p{grid-column:1/-1;font-size:14px;color:#777;margin:0}
@media(max-width:800px){.top nav{display:none}.cardx{grid-template-columns:1fr;align-items:start;padding:22px;height:auto;min-height:80vh}.cardx .shot{order:-1}.bye{grid-template-columns:1fr}}
`)}
<body>
<header class="top"><a href="/"><b>benjamingjoel</b></a><nav><a href="/work/">work</a><a href="/tourground/">at tourground</a><a href="/about/">about</a><a href="/contact/">contact</a></nav><span>kaduna · <span data-clock>--:--:--</span></span></header>
<section class="hero"><h1><img src="/assets/me/01.webp" alt="" /> benjamin sketches, codes &amp; ships websites for places like <span class="pill" style="background:${works[0].sw[0]};color:${works[0].sw[1]}">antarctica</span> <span class="pill" style="background:${works[5].sw[0]};color:${works[5].sw[1]}">japan</span> and <span class="pill" style="background:${works[3].sw[0]};color:${works[3].sw[1]}">iceland</span>.</h1><p>designer &amp; developer at tourground · scroll for the seven brands ↓</p></section>
<section class="stack">${works.map((w, i) => `<article class="cardx" style="background:${w.sw[0]};color:${w.sw[1]};top:${20 + i * 14}px"><div class="txt"><span class="n">${pad(i + 1)} / ${pad(works.length)} · ${lc(w.country)}</span><h2>${lc(w.name)}</h2><p>${lc(w.desc)}.</p><a class="go" style="background:${w.sw[1]};color:${w.sw[0]}" href="/work/${w.slug}/">see the project →</a></div><a class="shot" href="/work/${w.slug}/"><img src="/assets/work/${w.slug}.webp" alt="${lc(w.name)} homepage" loading="lazy" /></a></article>`).join('\n')}</section>
<section class="bye"><img src="/assets/me/01.webp" alt="portrait of benjamin" /><a href="mailto:${EMAIL}">say hello →</a><p>${EMAIL} · © ${new Date().getFullYear()} benjamingjoel</p></section>
${cbar('d')}${clock}
</body></html>`);

/* ---------------- picker ---------------- */
write('concepts/index.html', `${head('design concepts — benjamin', `
body{background:#111;color:#eee;padding:6vh 24px 100px}
h1{margin:0 0 6px;font-size:clamp(40px,6vw,96px);letter-spacing:-.05em;font-weight:500}
.sub{color:#999;margin:0 0 6vh}
.list{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.list a{display:block;background:#1b1b1b;border-radius:18px;padding:26px;transition:background .3s}
.list a:hover{background:#262626}
.list b{display:block;font-size:clamp(30px,3.4vw,56px);letter-spacing:-.04em;font-weight:500;margin:6px 0 10px}
.list span{color:#999;font-size:14px}
.list p{margin:0;font-size:16px;line-height:1.4;color:#ccc}
@media(max-width:800px){.list{grid-template-columns:1fr}}
`)}
<body>
<h1>four directions</h1><p class="sub">same content, four different looks. open each, then tell me which letter you want (or what to mix).</p>
<div class="list">${CONCEPTS.map(([k, n, d]) => `<a href="/concepts/${k}/"><span>concept ${k}</span><b>${n}</b><p>${d}</p></a>`).join('')}</div>
<p class="sub" style="margin-top:6vh"><a href="/" style="border-bottom:1px solid">← the current site</a></p>
</body></html>`);
console.log('concepts written');
