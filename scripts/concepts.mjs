// four home-page concepts, each led by one of the portfolio references.
// run: node scripts/concepts.mjs  -> writes concepts/{index,a,b,c,d}/index.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const works = JSON.parse(fs.readFileSync(path.join(root, 'scripts/works.json'), 'utf8'));
const lc = (s) => s.toLowerCase();
const pad = (n) => String(n).padStart(2, '0');
const EMAIL = 'hello@benjamin.design';
const GH = 'https://github.com/benjamingjoel2';
const YEAR = new Date().getFullYear();
const NAVL = [['work', '/work/'], ['at tourground', '/tourground/'], ['gallery', '/gallery/'], ['about', '/about/'], ['contact', '/contact/']];
const CONCEPTS = [
  ['a', 'swiss rule', 'after bleibtgleich. white, one hairline down the page, big staggered type, a rotating ring of work.'],
  ['b', 'card stack', 'after huyml. grey, a fanned 3d stack of your screens, then a work viewer with meta on the left and the list on the right.'],
  ['c', 'chip grid', 'after fmportfolio. chip header, the name full width, labelled rows, a featured-project grid, giant name footer.'],
  ['d', 'dark showcase', 'black, a custom cursor, a pinned sideways reel of projects and a word-by-word reveal.'],
];

const head = (title, css) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap" rel="stylesheet" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23111'/%3E%3Ctext x='16' y='24' text-anchor='middle' font-family='Arial' font-weight='700' font-size='24' fill='%23fff'%3Eb%3C/text%3E%3C/svg%3E" />
<style>
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:'Bricolage Grotesque','Helvetica Neue',Arial,sans-serif;text-transform:lowercase;-webkit-font-smoothing:antialiased;font-optical-sizing:auto}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%;height:auto}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.cbar{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:999;display:flex;gap:2px;padding:4px;border-radius:99px;background:rgba(20,20,20,.9);color:#fff;font-size:13px;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);backdrop-filter:blur(8px)}
.cbar a{padding:7px 12px;border-radius:99px}
.cbar a[aria-current]{background:#fff;color:#111}
.rv{opacity:0;transform:translateY(24px);transition:opacity 1s cubic-bezier(.19,1,.22,1),transform 1.2s cubic-bezier(.19,1,.22,1)}
.rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}}
${css}
</style>
</head>`;
const cbar = (cur) => `<nav class="cbar" aria-label="design concepts"><a href="/concepts/">all</a>${CONCEPTS.map(([k]) => `<a href="/concepts/${k}/"${k === cur ? ' aria-current="page"' : ''}>${k}</a>`).join('')}</nav>`;
const common = `<script>(()=>{const f=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});const t=()=>document.querySelectorAll('[data-clock]').forEach(e=>e.textContent=f.format(new Date()));t();setInterval(t,1000);const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.rv').forEach(el=>io.observe(el));document.querySelectorAll('[data-fit]').forEach(el=>{const fit=()=>{el.style.fontSize='100px';const w=el.parentElement.clientWidth-parseFloat(getComputedStyle(el.parentElement).paddingLeft)-parseFloat(getComputedStyle(el.parentElement).paddingRight);for(let i=0;i<4;i++){el.style.fontSize=(parseFloat(el.style.fontSize)*w/el.scrollWidth)+'px'}};fit();document.fonts&&document.fonts.ready.then(fit);addEventListener('resize',fit)})})()</script>`;
const write = (rel, html) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };

/* =========================================================
   a — swiss rule (bleibtgleich)
   ========================================================= */
const ringCards = works.flatMap((w) => [`/assets/work/${w.slug}.webp`, `/assets/work/${w.slug}-m1.webp`]);
write('concepts/a/index.html', `${head('concept a — swiss rule', `
html,body{overflow-x:clip}
body{background:#fff;color:#0d0d0d}
.ghost{position:fixed;bottom:-.12em;left:0;right:0;display:flex;justify-content:space-between;padding:0 14px;font-size:9vw;font-weight:600;letter-spacing:-.05em;color:#ebebeb;pointer-events:none;z-index:0;line-height:1}
.sq{position:fixed;top:16px;left:16px;width:12px;height:12px;background:#e3e3e3;z-index:5}
.menu{position:fixed;top:14px;right:16px;z-index:20;background:#0d0d0d;color:#fff;border-radius:99px;padding:5px 12px;font-size:12px;font-weight:600}
.panel{position:fixed;inset:0;background:#0d0d0d;color:#fff;z-index:15;display:grid;place-items:center;clip-path:circle(0 at calc(100% - 40px) 26px);transition:clip-path .9s cubic-bezier(.77,0,.18,1)}
.panel.open{clip-path:circle(150% at calc(100% - 40px) 26px)}
.panel ul{list-style:none;margin:0;padding:0;text-align:center}
.panel a{display:block;font-size:clamp(40px,7vw,110px);font-weight:600;letter-spacing:-.05em;line-height:1.02}
.panel a:hover{color:#777}
main{position:relative;z-index:1}
.rule{position:absolute;top:0;bottom:0;left:37%;width:1px;background:#bdbdbd}
.blk{position:relative;padding-left:calc(37% + 10px)}
.hero{min-height:100svh;padding-top:12px}
.hero .mk{position:absolute;left:calc(37% - 96px);top:10px;width:76px;height:76px;background:#0d0d0d;color:#fff;display:grid;place-items:center;font-weight:700;font-size:58px;border-radius:44% 56% 52% 48%/58% 44% 56% 42%;padding-bottom:8px}
.hero .meta{font-size:11px;font-weight:600;line-height:1.3}
.hero .who{position:absolute;bottom:22vh;left:calc(37% + 10px)}
.hero .who h1{margin:0;font-size:clamp(34px,3.6vw,58px);font-weight:600;letter-spacing:-.045em;line-height:.98}
.hero .role{position:absolute;bottom:22vh;left:calc(37% - 110px);font-size:10px;font-weight:600;line-height:1.25}
.big{font-weight:600;letter-spacing:-.05em;line-height:.96;font-size:clamp(40px,4.4vw,72px);margin:0}
.big span{display:block}
.big .l{margin-left:calc(-37vw + 18vw)}
.big .r1{padding-left:0}
.big .r2{padding-left:1.4em}
.stack{padding-bottom:14vh}
.stack p.small{max-width:21em;font-size:12px;font-weight:600;line-height:1.35;margin:6vh 0 0}
.tiles{display:flex;gap:10px;margin:8vh 0 0 calc(-37vw + 0px);padding-left:16px;overflow:hidden}
.tiles div{flex:none;width:112px;height:112px;background:#f0f0f0;display:grid;place-items:center}
.tiles i{width:14px;height:14px;border-radius:50%;border:1.5px solid}
.quote{padding-top:18vh;padding-bottom:18vh}
.quote .big .l{margin-left:calc(-37vw + 7vw)}
.quote .c{font-size:10px;font-weight:600;margin-top:16vh}
.work{position:relative;height:300vh}
.work .pin{position:sticky;top:0;height:100svh;overflow:hidden;display:grid;place-items:center}
.work h2{position:absolute;top:30vh;left:0;right:0;display:flex;justify-content:center;gap:16vw;margin:0;font-size:clamp(40px,4.4vw,72px);font-weight:600;letter-spacing:-.05em;z-index:2;pointer-events:none}
.scene{position:absolute;top:56%;left:50%;width:0;height:0;perspective:1400px}
.ring{position:absolute;transform-style:preserve-3d;transform:rotateX(-12deg) rotateY(0deg)}
.ring a{position:absolute;left:-60px;top:-45px;width:120px;height:90px;transform-style:preserve-3d;backface-visibility:visible}
.ring img{width:100%;height:100%;object-fit:cover;object-position:top;border:5px solid #0d0d0d;background:#0d0d0d}
.ring a:nth-child(even){width:70px;height:110px;left:-35px;top:-55px}
.ring a:hover img{border-color:#888}
.list{padding-top:10vh;padding-bottom:22vh}
.list h2{margin:0 0 6vh}
.list table{width:min(980px,92vw);margin-left:calc(-37vw + 18vw);border-collapse:collapse;font-size:12px;font-weight:600}
.list td{padding:7px 10px 7px 0;border-bottom:1px solid #e6e6e6;vertical-align:top}
.list tr:hover td{color:#888}
.list td:first-child{width:10%}
.end{padding-top:8vh;padding-bottom:24vh}
.end a.mail{font-size:clamp(34px,4.4vw,72px);font-weight:600;letter-spacing:-.05em;border-bottom:3px solid}
.end p{font-size:11px;font-weight:600;margin-top:20px}
@media(max-width:800px){
 .rule{left:24px}.blk{padding-left:36px;padding-right:16px}
 .hero .mk{position:relative;left:auto;top:auto;margin:40px 0 20px}.hero .who,.hero .role{left:36px}.hero .role{bottom:calc(22vh + 70px)}
 .big .l,.quote .big .l,.tiles,.list table{margin-left:0}
 .work h2{gap:20vw}.list table{width:100%}.ghost{font-size:14vw}.list td:nth-child(4),.list td:nth-child(5){display:none}
}
`)}
<body>
<div class="ghost" aria-hidden="true"><span>benjamin</span><span>gjoel</span></div>
<span class="sq" aria-hidden="true"></span>
<button class="menu" type="button" aria-expanded="false" data-menu>menu</button>
<div class="panel" data-panel><ul>${NAVL.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul></div>
<main>
<div class="rule" aria-hidden="true"></div>
<section class="blk hero">
<div class="mk" aria-hidden="true">b</div>
<p class="meta">based in kaduna<br />working w/ tourground<br /><span data-clock>--:--:--</span></p>
<p class="role">designer<br />&amp; developer</p>
<div class="who"><h1>benjamin<br />gjoel</h1></div>
</section>
<section class="blk stack">
<p class="big rv"><span class="l">sketches,</span><span>codes</span><span>&amp; ships</span><span class="r2">websites</span><span class="l">for places</span><span>you’d fly to.</span></p>
<p class="small rv">designs and builds websites for tourground’s travel brands, with a focus on clear layouts, fast pages and type that reads well on a phone.</p>
<div class="tiles rv" aria-hidden="true"><div><i style="color:#bbb"></i></div><div></div><div><i style="color:#b69c4c"></i></div><div><i style="color:#e2603b"></i></div><div></div><div><i style="color:#111;background:#111"></i></div><div><i style="color:#e2603b"></i></div></div>
</section>
<section class="blk quote">
<p class="big rv"><span class="l" style="display:inline">the</span> <span style="display:inline;margin-left:8vw">details</span><span>are the whole</span><span>job.</span></p>
<p class="c">© ’${String(YEAR).slice(2)}</p>
</section>
</main>
<section class="work" data-work aria-label="work">
<div class="pin"><h2><span>work</span><span>24–26</span></h2>
<div class="scene"><div class="ring" data-ring>${ringCards.map((src, i) => `<a href="/work/${works[Math.floor(i / 2)].slug}/" aria-label="${lc(works[Math.floor(i / 2)].name)}"><img src="${src}" alt="" loading="lazy" /></a>`).join('')}</div></div></div>
</section>
<main>
<div class="rule" aria-hidden="true"></div>
<section class="blk list">
<h2 class="big rv"><span class="l" style="display:inline">&amp;</span> <span style="display:inline">the</span><span>brands</span></h2>
<table class="rv">${works.map((w, i) => `<tr><td>’${pad(i + 1)}</td><td><a href="/work/${w.slug}/">${lc(w.name)}</a></td><td>${lc(w.country)}</td><td>design, build, deploy</td><td><a href="${w.url}">${w.host}</a></td></tr>`).join('')}</table>
</section>
<section class="blk end"><a class="mail rv" href="mailto:${EMAIL}">${EMAIL}</a><p>© ${YEAR} benjamingjoel · <a href="${GH}">github</a></p></section>
</main>
${cbar('a')}${common}
<script>(()=>{const b=document.querySelector('[data-menu]'),p=document.querySelector('[data-panel]');b.onclick=()=>{const o=p.classList.toggle('open');b.textContent=o?'close':'menu';b.setAttribute('aria-expanded',o)};
const ring=document.querySelector('[data-ring]'),cards=[...ring.children],N=cards.length,R=Math.min(innerWidth*.34,420);cards.forEach((c,i)=>{const a=i/N*360,y=((i%3)-1)*70;c.style.transform='rotateY('+a+'deg) translateZ('+R+'px) translateY('+y+'px)'});
const sec=document.querySelector('[data-work]');let rot=0,auto=0;const tick=()=>{const r=sec.getBoundingClientRect(),pr=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));auto+=.08;rot=pr*360+auto;ring.style.transform='rotateX(-10deg) rotateY('+rot+'deg)';requestAnimationFrame(tick)};tick()})()</script>
</body></html>`);

/* =========================================================
   b — card stack (huyml)
   ========================================================= */
const stackImgs = [...works.map((w) => `/assets/work/${w.slug}.webp`), ...works.map((w) => `/assets/work/${w.slug}-section.webp`), '/assets/me/03.webp', '/assets/me/10.webp'];
write('concepts/b/index.html', `${head('concept b — card stack', `
body{background:#ebebeb;color:#111}
.side{position:fixed;left:16px;top:16px;bottom:16px;width:40px;z-index:6;display:flex;flex-direction:column;align-items:center;gap:14px}
.side .logo{writing-mode:vertical-rl;transform:rotate(180deg);font-size:30px;font-weight:700;letter-spacing:-.04em;line-height:1}
.side .logo sup{font-size:.35em}
.side small{writing-mode:vertical-rl;transform:rotate(180deg);font-size:9px;font-weight:600;line-height:1.2}
.side .mk{width:34px;height:34px;border:1.5px solid #111;display:grid;place-items:center;font-weight:700;font-size:20px}
.bar{position:absolute;top:14px;left:96px;right:16px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;font-size:10px;z-index:6;font-weight:500}
.bar b{font-weight:600}
.bar span:last-child{text-align:right}
.nav{position:absolute;top:44px;left:96px;z-index:6;list-style:none;margin:0;padding:0;font-size:19px;font-weight:600;line-height:1.02;letter-spacing:-.01em}
.nav a{display:inline-block;transition:transform .35s}
.nav li:first-child a::before{content:'→ ';font-weight:400}
.nav a:hover{transform:translateX(6px)}
.hero{height:220vh;position:relative}
.hero .pin{position:sticky;top:0;height:100svh;overflow:hidden;perspective:1600px}
.deck{position:absolute;left:46%;top:48%;transform-style:preserve-3d}
.deck figure{position:absolute;margin:0;width:340px;height:210px;left:-170px;top:-105px;transform-origin:50% 100%;box-shadow:0 30px 60px -30px rgba(0,0,0,.4);background:#ddd;border-radius:2px;overflow:hidden;transition:transform 1.4s cubic-bezier(.19,1,.22,1)}
.deck img{width:100%;height:100%;object-fit:cover;object-position:top}
.hero .cap{position:absolute;right:28px;bottom:26px;font-size:10px;font-weight:500;text-align:right}
.hero .cap b{display:block;font-size:clamp(40px,6vw,96px);font-weight:500;letter-spacing:-.05em;line-height:.9;margin-top:6px}
.scroll{position:absolute;left:96px;bottom:22px;font-size:10px}
.view{min-height:100svh;display:grid;grid-template-columns:96px 1fr 1.2fr 1fr;gap:20px;align-items:center;padding:12vh 24px 12vh 0}
.view dl{grid-column:2;margin:0;display:grid;grid-template-columns:auto 1fr;gap:16px 26px;font-size:10px}
.view dt{color:#777}
.view dd{margin:0;font-weight:500}
.view dd a{text-decoration:underline;text-underline-offset:2px}
.view .stage{grid-column:3;position:relative;aspect-ratio:4/5;perspective:1200px}
.view .stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;opacity:0;transform:rotateY(-14deg) rotateX(6deg) scale(.94);transition:opacity .6s,transform 1s cubic-bezier(.19,1,.22,1);box-shadow:0 40px 80px -40px rgba(0,0,0,.5)}
.view .stage img.on{opacity:1;transform:rotateY(-6deg) rotateX(2deg)}
.view .num{position:absolute;left:-36%;bottom:-6%;font-size:clamp(90px,13vw,210px);font-weight:400;letter-spacing:-.06em;line-height:.8;mix-blend-mode:difference;color:#fff;z-index:3;pointer-events:none}
.view .num small{font-size:10px;letter-spacing:0;vertical-align:top;margin-left:6px;color:#fff}
.view ol{grid-column:4;list-style:none;margin:0;padding:0;text-align:center}
.view li button{display:block;width:100%;padding:16px 0;border-bottom:1px solid rgba(0,0,0,.06);opacity:.25;transition:opacity .4s}
.view li button.on,.view li button:hover{opacity:1}
.view li .c{display:block;font-size:10px;color:#666}
.view li .n{display:block;font-size:17px;letter-spacing:.01em;margin:4px 0}
.view li .d{display:block;font-size:10px;max-width:210px;margin:0 auto;line-height:1.3}
.end{padding:12vh 24px 90px 96px;display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap}
.end > a{font-size:clamp(34px,5vw,84px);font-weight:500;letter-spacing:-.05em;line-height:.95}
.end p{font-size:10px}
@media(max-width:800px){.bar{grid-template-columns:1fr 1fr;left:70px}.bar span:nth-child(2),.bar span:nth-child(3){display:none}.nav{left:70px;font-size:16px}.side{width:30px}.side .logo{font-size:22px}.deck figure{width:220px;height:136px;left:-110px;top:-68px}.deck{left:55%}
 .view{grid-template-columns:1fr;padding:10vh 16px 10vh 64px}.view dl,.view .stage,.view ol{grid-column:1}.view .num{left:0}.end{padding-left:64px}.scroll{left:70px}}
`)}
<body>
<aside class="side"><span class="logo">benjamingjoel<sup>®</sup></span><small>©${YEAR} kaduna, ng</small><span class="mk">b</span></aside>
<header class="bar"><span>menu</span><span>audio <b>off</b> —</span><span>working globally<br /><b>kaduna, <span data-clock>--:--:--</span></b></span><span>for inquiries <a href="mailto:${EMAIL}" style="text-decoration:underline">${EMAIL}</a></span></header>
<ul class="nav">${NAVL.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul>
<section class="hero" data-hero><div class="pin"><div class="deck" data-deck>${stackImgs.map((s) => `<figure><img src="${s}" alt="" /></figure>`).join('')}</div>
<p class="cap">designer &amp; developer · travel tech<b>sketches, codes<br />&amp; ships websites</b></p><span class="scroll">scroll</span></div></section>
<section class="view" data-view aria-label="selected work">
<dl><dt>role</dt><dd>design<br />development<br />deployment</dd><dt>destination</dt><dd data-f="c">${lc(works[0].country)}</dd><dt>live at</dt><dd><a data-f="u" href="${works[0].url}">${works[0].host}</a></dd><dt>case</dt><dd><a data-f="p" href="/work/${works[0].slug}/">view project →</a></dd></dl>
<div class="stage">${works.map((w, i) => `<img src="/assets/work/${w.slug}-m1.webp" alt="${lc(w.name)}"${i === 0 ? ' class="on"' : ''} />`).join('')}<span class="num" data-f="n">01<small>/${pad(works.length)}</small></span></div>
<ol>${works.map((w, i) => `<li><button type="button" data-i="${i}"${i === 0 ? ' class="on"' : ''}><span class="c">${lc(w.country)}</span><span class="n">${lc(w.name)}</span><span class="d">${lc(w.desc)}</span></button></li>`).join('')}</ol>
</section>
<footer class="end"><a href="mailto:${EMAIL}">let’s make<br />something good.</a><p>© ${YEAR} benjamingjoel · <a href="${GH}">github</a> · <a href="/about/">about</a></p></footer>
${cbar('b')}${common}
<script>(()=>{const W=${JSON.stringify(works.map((w) => ({ c: lc(w.country), u: w.url, h: w.host, s: w.slug })))};
const figs=[...document.querySelectorAll('[data-deck] figure')],hero=document.querySelector('[data-hero]');const lay=p=>figs.forEach((f,i)=>{const k=i-figs.length/2,curl=40+p*25;f.style.transform='translate3d('+(k*(34+p*30))+'px,'+(k*(-30-p*20))+'px,'+(k*-14)+'px) rotateX('+curl+'deg) rotateZ('+(-28+p*14)+'deg) skewY('+(-6)+'deg)'});lay(0);
addEventListener('scroll',()=>{const r=hero.getBoundingClientRect();lay(Math.min(1,Math.max(0,-r.top/(r.height-innerHeight))))},{passive:true});
const imgs=[...document.querySelectorAll('.stage img')],btns=[...document.querySelectorAll('[data-i]')];const set=i=>{imgs.forEach((m,j)=>m.classList.toggle('on',j===i));btns.forEach((b,j)=>b.classList.toggle('on',j===i));const w=W[i];document.querySelector('[data-f=c]').textContent=w.c;const u=document.querySelector('[data-f=u]');u.href=w.u;u.textContent=w.h;document.querySelector('[data-f=p]').href='/work/'+w.s+'/';document.querySelector('[data-f=n]').firstChild.textContent=String(i+1).padStart(2,'0')};
btns.forEach(b=>{b.addEventListener('mouseenter',()=>set(+b.dataset.i));b.addEventListener('click',()=>set(+b.dataset.i))})})()</script>
</body></html>`);

/* =========================================================
   c — chip grid (fmportfolio)
   ========================================================= */
const feat = [[0, 'w'], [1, 'w'], [2, ''], [3, ''], [4, ''], [5, 'w'], [6, 'w']];
write('concepts/c/index.html', `${head('concept c — chip grid', `
body{background:#f7f7f7;color:#0f0f0f}
.hdr{position:fixed;top:12px;left:12px;right:12px;display:flex;gap:6px;z-index:20;align-items:flex-start}
.chip{height:34px;display:inline-flex;align-items:center;gap:10px;padding:0 12px;border-radius:6px;background:rgba(228,228,228,.8);backdrop-filter:blur(12px);font-size:13px;font-weight:600}
.chip.logo{font-weight:800;letter-spacing:-.02em}
.pages{width:220px;display:block;height:auto;padding:0;overflow:hidden}
.pages > button{display:flex;justify-content:space-between;align-items:center;width:100%;height:34px;padding:0 12px}
.pages ul{list-style:none;margin:0;padding:0 12px;max-height:0;overflow:hidden;transition:max-height .5s cubic-bezier(.19,1,.22,1),padding .5s}
.pages.open ul{max-height:260px;padding:10px 12px 14px}
.pages li a{display:block;padding:5px 0;font-size:15px}
.r{margin-left:auto;display:flex;gap:6px}
.top{padding:58px 12px 0}
.name{margin:0;white-space:nowrap;font-weight:700;letter-spacing:-.055em;line-height:.9;width:max-content}
.rows{margin-top:6vh}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 12px 34px}
.row .k{font-size:11px;font-weight:600;letter-spacing:.04em}
.row .v{font-size:11px;font-weight:500;letter-spacing:.04em;line-height:1.6;max-width:44em}
.row .v .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;margin-right:6px}
.row .v a{text-decoration:underline;text-underline-offset:2px;margin-right:14px}
.lbl{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:600;letter-spacing:.04em;padding:22px 12px;border-top:1px solid #dcdcdc;margin:0}
.lbl::before{content:'';width:6px;height:6px;border-radius:50%;background:#0f0f0f}
.feat{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;padding:0 12px}
.feat a{grid-column:span 2}
.feat a.w{grid-column:span 3}
.feat .ph{overflow:hidden;background:#e6e6e6;aspect-ratio:4/3}
.feat a.w .ph{aspect-ratio:16/10}
.feat img{width:100%;height:100%;object-fit:cover;object-position:top;transition:transform 1.2s cubic-bezier(.19,1,.22,1),filter .6s;filter:grayscale(1)}
.feat a:hover img{transform:scale(1.04);filter:none}
.feat .cp{display:flex;justify-content:space-between;font-size:11px;font-weight:600;letter-spacing:.04em;padding:8px 0 30px}
.ix{list-style:none;margin:0;padding:0 12px}
.ix li{display:grid;grid-template-columns:1fr 1fr 40px;align-items:center;border-bottom:1px solid #dcdcdc;padding:18px 0}
.ix .n{font-size:11px;font-weight:600}
.ix .t{font-size:clamp(28px,3.4vw,54px);font-weight:700;letter-spacing:-.045em;line-height:1;transition:transform .5s cubic-bezier(.19,1,.22,1)}
.ix li:hover .t{transform:translateX(10px)}
.ix .ar{justify-self:end;transition:transform .4s}
.ix li:hover .ar{transform:rotate(-45deg)}
.mq{overflow:hidden;padding:26px 0;border-top:1px solid #dcdcdc;border-bottom:1px solid #dcdcdc;margin-top:8vh}
.mq-t{display:flex;width:max-content;gap:28px;animation:mq 34s linear infinite}
.mq img{width:150px;height:110px;object-fit:cover;filter:grayscale(1)}
@keyframes mq{to{transform:translateX(-50%)}}
.ftr{padding:8vh 12px 14px}
.ftr .row{padding:0 0 10vh}
.ftr .big{margin:0;white-space:nowrap;font-weight:700;letter-spacing:-.055em;line-height:.9;width:max-content}
.base{display:flex;justify-content:space-between;font-size:11px;font-weight:600;letter-spacing:.04em;padding-top:10px}
@media(max-width:800px){.row{grid-template-columns:1fr}.feat{grid-template-columns:1fr 1fr}.feat a,.feat a.w{grid-column:span 2}.ix li{grid-template-columns:40px 1fr 30px}.pages{width:auto;flex:1}.r .chip:not(.cta){display:none}}
`)}
<body>
<header class="hdr"><a class="chip logo" href="/">b_j</a><div class="chip pages" data-pages><button type="button" aria-expanded="false">home <span>≡</span></button><ul>${NAVL.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul></div><div class="r"><span class="chip">kaduna <span data-clock>--:--:--</span></span><a class="chip cta" href="/contact/">contact me ›</a></div></header>
<section class="top"><h1 class="name" data-fit>benjamingjoel</h1></section>
<section class="rows">
<div class="row"><p class="k">you’ll like it:</p><p class="v">a designer and developer in travel tech. i sketch, code and ship the websites for tourground’s brands, so the idea in the first layout survives all the way to the live site.<br /><br /><span class="dot"></span>at tourground, full time</p></div>
<div class="row"><p class="k">elsewhere:</p><p class="v"><a href="${GH}">github</a><a href="mailto:${EMAIL}">email</a><a href="/tourground/">at tourground</a></p></div>
</section>
<p class="lbl">featured projects:</p>
<section class="feat">${feat.map(([i, cls]) => { const w = works[i]; return `<a class="${cls} rv" href="/work/${w.slug}/"><div class="ph"><img src="/assets/work/${w.slug}${cls ? '' : '-section'}.webp" alt="${lc(w.name)}" loading="lazy" /></div><div class="cp"><span>${lc(w.name)}</span><span>/ ${lc(w.country)}</span></div></a>`; }).join('')}</section>
<p class="lbl" style="margin-top:6vh">index:</p>
<ol class="ix">${works.map((w, i) => `<li><span class="n">${pad(i + 1)}.</span><a class="t" href="/work/${w.slug}/">${lc(w.name)}</a><span class="ar">↘</span></li>`).join('')}</ol>
<div class="mq" aria-hidden="true"><div class="mq-t">${[0, 1].map(() => ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((n) => `<img src="/assets/me/${n}.webp" alt="" />`).join('')).join('')}</div></div>
<footer class="ftr"><div class="row"><p class="v">now that you got here, why not say hello? whether it’s travel tech, a site you love or a question about mine, my inbox is open.</p><p class="v" style="text-align:right"><a href="${GH}">github</a><a href="mailto:${EMAIL}">email</a></p></div><p class="big" data-fit>benjamingjoel</p><div class="base"><span>© ${YEAR} benjamingjoel</span><a href="#">↑ back to top</a><a href="mailto:${EMAIL}">→ ${EMAIL}</a></div></footer>
${cbar('c')}${common}
<script>(()=>{const p=document.querySelector('[data-pages]'),b=p.querySelector('button');b.onclick=()=>b.setAttribute('aria-expanded',p.classList.toggle('open'))})()</script>
</body></html>`);

/* =========================================================
   d — dark showcase
   ========================================================= */
const aboutWords = 'i spend my days making far-off places look worth the flight. seven brands so far, antarctica to japan, designed, coded and shipped by me, usually from a laptop in kaduna.'.split(' ');
write('concepts/d/index.html', `${head('concept d — dark showcase', `
html{background:#0a0a0a}
body{background:#0a0a0a;color:#ececec;cursor:none}
a,button{cursor:none}
.cur{position:fixed;left:0;top:0;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#ececec;z-index:1000;pointer-events:none;mix-blend-mode:difference;transition:width .35s,height .35s,margin .35s;display:grid;place-items:center;font-size:12px;color:#0a0a0a;font-weight:600}
.cur.big{width:92px;height:92px;margin:-46px 0 0 -46px;mix-blend-mode:normal}
.cur span{opacity:0;transition:opacity .2s}
.cur.big span{opacity:1}
@media(hover:none){body,a,button{cursor:auto}.cur{display:none}}
.meta{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:20px 28px;font-size:12px;color:#8a8a8a;position:relative;z-index:2}
.meta b{display:block;color:#ececec;font-weight:500}
.meta a:hover b{text-decoration:underline}
.hero{min-height:calc(100svh - 70px);display:flex;flex-direction:column;justify-content:center;padding:0 28px;position:relative;overflow:hidden}
.hero h1{margin:0;font-size:clamp(54px,10.5vw,190px);font-weight:500;letter-spacing:-.06em;line-height:.88}
.hero h1 .ln{display:block;overflow:hidden}
.hero h1 .ln > span{display:inline-block;transform:translateY(105%);animation:up 1.2s cubic-bezier(.19,1,.22,1) forwards}
.hero h1 .ln:nth-child(2) > span{animation-delay:.12s}
.hero h1 .ln:nth-child(3) > span{animation-delay:.24s}
@keyframes up{to{transform:none}}
.hero .pill{display:inline-block;width:1.8em;height:.78em;border-radius:99px;overflow:hidden;vertical-align:middle;margin:0 .12em;transform:translateY(-.05em)}
.hero .pill img{width:100%;height:100%;object-fit:cover;object-position:50% 25%}
.hero h1 .dim{color:#5a5a5a}
.hero .foot{display:flex;justify-content:space-between;align-items:end;margin-top:8vh;font-size:12px;color:#8a8a8a}
.hero .foot b{color:#ececec;font-weight:500}
.reel{height:${works.length * 70 + 60}vh;position:relative}
.reel .pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center}
.reel .hd{display:flex;justify-content:space-between;padding:0 28px 4vh;font-size:12px;color:#8a8a8a}
.track{display:flex;gap:3vw;padding-left:28px;will-change:transform}
.card{flex:none;width:min(62vw,980px);display:block}
.card .ph{overflow:hidden;border-radius:6px;aspect-ratio:16/10;background:#161616}
.card img{width:100%;height:100%;object-fit:cover;object-position:top;transform:scale(1.12);transition:transform 1.4s cubic-bezier(.19,1,.22,1)}
.card:hover img{transform:scale(1.04)}
.card .l{display:flex;justify-content:space-between;align-items:baseline;padding-top:16px}
.card .l b{font-size:clamp(26px,3vw,50px);font-weight:500;letter-spacing:-.045em}
.card .l span{font-size:12px;color:#8a8a8a}
.prog{position:absolute;left:28px;right:28px;bottom:28px;height:1px;background:#262626}
.prog i{display:block;height:100%;width:0;background:#ececec}
.about{padding:22vh 28px;max-width:1300px}
.about p{margin:0;font-size:clamp(30px,4.2vw,72px);line-height:1.04;letter-spacing:-.045em;font-weight:500}
.about p span{color:#2e2e2e;transition:color .4s}
.about p span.on{color:#ececec}
.pics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:0 28px}
.pics img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;filter:grayscale(1) brightness(.85);transition:filter .6s}
.pics img:hover{filter:none}
.pics img:nth-child(even){margin-top:10vh}
.end{padding:24vh 28px 90px;text-align:left}
.end small{font-size:12px;color:#8a8a8a}
.end a.mail{display:block;font-size:clamp(50px,11vw,200px);font-weight:500;letter-spacing:-.06em;line-height:.9;margin:20px 0 60px}
.end a.mail:hover{color:#8a8a8a}
.end .row{display:flex;justify-content:space-between;font-size:12px;color:#8a8a8a;border-top:1px solid #262626;padding-top:16px;flex-wrap:wrap;gap:10px}
@media(max-width:800px){.hero .foot nav{display:none}.meta{grid-template-columns:1fr 1fr}.meta div:nth-child(3){display:none}.card{width:80vw}.pics{grid-template-columns:1fr 1fr}.reel{height:${works.length * 60 + 60}vh}}
`)}
<body>
<div class="cur" aria-hidden="true"><span>view</span></div>
<header class="meta"><div><b>benjamingjoel</b>designer &amp; developer</div><div><b>at tourground</b>travel tech</div><div><b>kaduna, ng</b><span data-clock>--:--:--</span></div><div style="text-align:right"><a href="mailto:${EMAIL}"><b>contact</b>${EMAIL}</a></div></header>
<section class="hero"><h1><span class="ln"><span>sketches,</span></span><span class="ln"><span>codes <span class="pill"><img src="/assets/me/01.webp" alt="benjamin" /></span> &amp; ships</span></span><span class="ln"><span><span class="dim">websites.</span></span></span></h1>
<div class="foot"><span>for places you’d fly to,<br /><b>seven so far.</b></span><span>scroll ↓</span><nav style="display:flex;gap:18px">${NAVL.slice(0, 4).map(([n, h]) => `<a href="${h}">${n}</a>`).join('')}</nav></div></section>
<section class="reel" data-reel><div class="pin"><div class="hd"><span>selected work</span><span data-count>01 / ${pad(works.length)}</span></div><div class="track" data-track>${works.map((w, i) => `<a class="card" data-view href="/work/${w.slug}/"><div class="ph"><img src="/assets/work/${w.slug}.webp" alt="${lc(w.name)}" ${i > 1 ? 'loading="lazy"' : ''} /></div><div class="l"><b>${lc(w.name)}</b><span>${pad(i + 1)} · ${lc(w.country)}</span></div></a>`).join('')}</div><div class="prog"><i data-prog></i></div></div></section>
<section class="about" data-words><p>${aboutWords.map((w) => `<span>${w}</span>`).join(' ')}</p></section>
<section class="pics">${['02', '03', '07', '12'].map((n) => `<img class="rv" src="/assets/me/${n}.webp" alt="" loading="lazy" />`).join('')}</section>
<footer class="end"><small>have something in mind?</small><a class="mail" data-view href="mailto:${EMAIL}">say hello</a><div class="row"><span>© ${YEAR} benjamingjoel</span><a href="${GH}">github</a><a href="/tourground/">at tourground</a><a href="#">back to top ↑</a></div></footer>
${cbar('d')}${common}
<script>(()=>{const cur=document.querySelector('.cur');let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});document.querySelectorAll('[data-view]').forEach(a=>{a.addEventListener('mouseenter',()=>cur.classList.add('big'));a.addEventListener('mouseleave',()=>cur.classList.remove('big'))});
const reel=document.querySelector('[data-reel]'),track=document.querySelector('[data-track]'),prog=document.querySelector('[data-prog]'),cnt=document.querySelector('[data-count]'),N=${works.length};
const words=[...document.querySelectorAll('[data-words] span')],ab=document.querySelector('[data-words]');
const loop=()=>{cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cur.style.transform='translate('+cx+'px,'+cy+'px)';
const r=reel.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));const max=track.scrollWidth-innerWidth+56;track.style.transform='translate3d('+(-p*max)+'px,0,0)';prog.style.width=(p*100)+'%';cnt.textContent=String(Math.min(N,Math.floor(p*N)+1)).padStart(2,'0')+' / '+String(N).padStart(2,'0');
const a=ab.getBoundingClientRect(),q=Math.min(1,Math.max(0,(innerHeight*.85-a.top)/(a.height+innerHeight*.3)));const k=Math.floor(q*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<k));
requestAnimationFrame(loop)};loop()})()</script>
</body></html>`);

/* ---------------- picker ---------------- */
write('concepts/index.html', `${head('design concepts — benjamin', `
body{background:#0e0e0e;color:#eee;padding:6vh 24px 100px}
h1{margin:0 0 6px;font-size:clamp(40px,6vw,96px);letter-spacing:-.05em;font-weight:500}
.sub{color:#999;margin:0 0 6vh;max-width:40em;line-height:1.4}
.list{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.list a{display:block;background:#181818;border-radius:16px;padding:26px;transition:background .3s}
.list a:hover{background:#232323}
.list b{display:block;font-size:clamp(30px,3.4vw,56px);letter-spacing:-.04em;font-weight:500;margin:6px 0 10px}
.list span{color:#888;font-size:13px}
.list p{margin:0;font-size:15px;line-height:1.45;color:#bbb}
@media(max-width:800px){.list{grid-template-columns:1fr}}
`)}
<body>
<h1>four directions</h1><p class="sub">each one is led by a portfolio you sent at the start. same content, same font. open each and tell me the letter, or what to mix.</p>
<div class="list">${CONCEPTS.map(([k, n, d]) => `<a href="/concepts/${k}/"><span>concept ${k}</span><b>${n}</b><p>${d}</p></a>`).join('')}</div>
<p class="sub" style="margin-top:6vh"><a href="/" style="border-bottom:1px solid">← the current site</a></p>
</body></html>`);
console.log('concepts written');
