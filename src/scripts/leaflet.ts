/*
 * The Leaflet: scroll-driven 3D roll-fold on wide screens, a flat strip on phones and short laptops,
 * and a calm mode for reduced motion. Ported from the approved prototype
 * (design/mockups/round2/leaflet-made-properly.html). Copy comes from the page's JSON block
 * (#leaflet-data), which Leaflet.astro fills from the i18n dictionary: no runtime language swapping.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, CustomEase, DrawSVGPlugin);

declare global {
  interface Window {
    __leafReady?: boolean;
    __leafHash?: string | null;
    __leaf?: unknown;
  }
}

type LabelName = 'cover' | 'hello' | 'work' | 'menu' | 'poster' | 'reply';
type FolioName = LabelName | 'why' | 'how' | 'services';

interface WorkData {
  slot: string;
  meta: string;
  name: string;
  text: string;
  quote: { text: string; by: string } | null;
  url: string;
  image: string;
  stack: string;
  shots: ShotData[];
}
interface ShotData { full: string; thumb: string; w: number; h: number; fit: string; cap: string }
interface Config {
  lang: string;
  email: string;
  ui: { motionOn: string; motionOff: string; motionReduced: string; marksOn: string; marksOff: string };
  folio: Record<FolioName, string>;
  works: WorkData[];
  dialog: { count: string; caseStudyNote: string; shotLabel: string };
  contact: {
    copy: string; copied: string; selected: string; copiedLive: string; selectedLive: string;
    errName: string; errEmail: string; errEmailBad: string; errSend: string; mailtoStatus: string;
    sending: string; sentLive: string; subject: string; needs: string; months: string[];
  };
}

function readConfig(): Config | null {
  const el = document.getElementById('leaflet-data');
  if (!el || !el.textContent) return null;
  try { return JSON.parse(el.textContent) as Config; } catch { return null; }
}

function init(CFG: Config) {
  const d = document.documentElement;
  window.__leafReady = true;
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* house curves: paper for folds, turn for the flip, ui for interface */
  CustomEase.create('paper', 'M0,0 C0.42,0 0.18,1 1,1');
  CustomEase.create('turn', 'M0,0 C0.5,0 0.2,1 1,1');
  CustomEase.create('ui', 'M0,0 C0.22,1 0.36,1 1,1');
  CustomEase.create('undraw', 'M0,0 C0.55,0 0.75,0.2 1,1');

  const $ = <T extends HTMLElement = HTMLElement>(s: string, r?: ParentNode): T => (r || document).querySelector(s) as T;
  const $$ = <T extends Element = HTMLElement>(s: string, r?: ParentNode): T[] => Array.from((r || document).querySelectorAll(s)) as T[];
  const DEG = Math.PI / 180;
  const clamp = (a: number, b: number, v: number) => Math.min(b, Math.max(a, v));
  const fill = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
  const mmReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mmBig = matchMedia('(min-width: 1100px) and (min-height: 740px)');
  const mmFine = matchMedia('(hover: hover) and (pointer: fine)');
  // tablets: the strip lies open in two-page spreads (the same query as in responsive.css)
  const mmSpread = matchMedia('(min-width: 744px) and (max-width: 1099px) and (min-height: 600px)');
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if ((nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) || (nav.deviceMemory && nav.deviceMemory <= 2) || (nav.connection && nav.connection.saveData)) d.classList.add('lite');

  /* ---------- elements ---------- */
  const wrap = $('.wrap'), stage = $('.stage'), camera = $('.camera');
  const hint = $('.scroll-hint'), edge = $('.edge');
  const dSharp = $('.dsh--sharp'), dSoft = $('.dsh--soft');

  interface FaceRec {
    id: string; k: number; o: number; el: HTMLElement; shade: HTMLElement; cast: HTMLElement | null;
    tf?: string | null; op?: number | null; sh?: number | null; ck?: number | null;
  }
  const FACE_DEFS = [
    { id: 'cover', k: 1, o: 1 }, { id: 'about', k: 0, o: 0 }, { id: 'why', k: 2, o: 1 }, { id: 'work', k: 1, o: 0 },
    { id: 'how', k: 3, o: 1 }, { id: 'services', k: 2, o: 0 }, { id: 'prices', k: 3, o: 0 }, { id: 'contact', k: 0, o: 1 },
  ];
  const FACES: FaceRec[] = FACE_DEFS.map(f => {
    const el = document.getElementById(f.id) as HTMLElement;
    return { ...f, el, shade: $('.shade', el), cast: el.querySelector<HTMLElement>('.cast') };
  });
  const face: Record<string, FaceRec> = {};
  FACES.forEach(f => { face[f.id] = f; });
  const panels = FACES.map(f => f.el);
  const tags = $$('.tag'), quoteSlip = $('.quote-slip');
  const cropPaths = $$<SVGPathElement>('.crops path');
  const coverMarks = $$<SVGPathElement>('.pencil[data-g="cover"] .pm');
  const perf = $('.perf'), perfLine = $('.perf__line'), scissors = $('.scissors');
  const odo = $('.odo'), folioName = $('.folio__name'), folioPg = $('.folio__pg'), folioHere = $('.furn__here');
  const live = $('#live'), openTab = $('.open-tab');

  /* ---------- the leaflet model ---------- */
  const T = 580; // timeline length in vh of scroll
  const LABELS: Record<LabelName, number> = { cover: 0, hello: 120, work: 245, menu: 350, poster: 450, reply: 580 };
  const ORDER: LabelName[] = ['cover', 'hello', 'work', 'menu', 'poster', 'reply'];
  const HOLDS: Record<string, [number, number]> = { hello: [100, 140], work: [225, 265], menu: [330, 370], poster: [415, 485], reply: [560, 580] };
  const READING: Record<string, string[]> = { hello: ['about', 'why'], work: ['about', 'work', 'how'], menu: ['about', 'work', 'services', 'prices'], reply: ['how', 'why', 'cover', 'contact'] };
  const REST_VALUES: Record<string, number[]> = { hello: [0, 179.5, 179.8, 0], work: [0, 0, 179.8, 0], menu: [0, 0, 0, 0], reply: [0, 0, 0, 180] };
  const FACE_LABEL: Record<string, LabelName> = { cover: 'cover', about: 'hello', why: 'hello', work: 'work', how: 'work', services: 'menu', prices: 'menu', contact: 'reply' };
  const ID_LABEL: Record<string, LabelName> = Object.assign({ top: 'cover', 'work-1': 'work', 'work-2': 'work', 'work-3': 'work' } as Record<string, LabelName>, FACE_LABEL);
  const LABEL_ID: Record<LabelName, string> = { cover: 'cover', hello: 'about', work: 'work', menu: 'prices', poster: 'about', reply: 'contact' };
  const FOLIO_NUM: Record<FolioName, number> = { cover: 1, hello: 2, work: 4, menu: 7, poster: 0, reply: 8, why: 3, how: 5, services: 6 };
  const FOLIO_ORDER: FolioName[] = ['cover', 'hello', 'why', 'work', 'how', 'services', 'menu', 'poster', 'reply'];
  const PANEL_FOLIO: Record<string, FolioName> = { cover: 'cover', about: 'hello', why: 'why', work: 'work', how: 'how', services: 'services', prices: 'menu', contact: 'reply' };
  const RIGHT_PAGES = new Set(['why', 'how', 'prices']); // the right-hand page of each tablet spread

  interface State {
    mode: 'leaf' | 'strip' | 'calm' | null; W: number; H: number; Ws: number[]; C: number; sheetW: number; vh: number;
    coverS: number; posterS: number; ct: string; fitFail: string;
    // render caches
    eo: any; ho: any; tab: any; ap: any;
  }
  const S: State = { mode: null, W: 0, H: 0, Ws: [0, 0, 0, 0], C: 0, sheetW: 0, vh: innerHeight / 100, coverS: 1, posterS: .66, ct: '', fitFail: '', eo: null, ho: null, tab: null, ap: null };
  const fold = { a12: 176, a23: 179.5, a34: 179.8, flip: 0 };
  const cam = { x: 0, y: 0, s: 1, rx: 0, ry: 0, rz: -1.2, pk: 0 };
  const intro = { dy: 0, s: 1, rx: 0, rz: 0, dx: 0, puff: 0, lift: 0 };
  const peek = { v: 0 };
  const bend = { h: 0, v: 0 }; // a hand on the paper: extra degrees on one hinge (1-3 the folds, 4 the turn-over), towards the next page
  let master: gsap.core.Timeline | null = null;
  let st: ScrollTrigger | null = null;
  let introTl: gsap.core.Timeline | null = null;
  let introDone = true, peekOn = false;
  let scrollTw: gsap.core.Tween | null = null;
  let scrollTarget: string | null = null;
  let restCache: Record<string, Record<string, string>> = {};
  let fontsReady = false;
  const drawn: Record<string, boolean> = {};

  /* ---------- pencil helpers ---------- */
  const marks: Record<string, SVGPathElement[]> = {};
  $$<SVGElement>('.pencil[data-g]').forEach(svg => { const g = svg.dataset.g as string; (marks[g] = marks[g] || []).push(...$$<SVGPathElement>('.pm', svg)); });
  const hidePaths = (p?: Element[]) => { if (p && p.length) gsap.set(p, { drawSVG: '0%' }); };
  const showPaths = (p?: Element[]) => { if (p && p.length) gsap.set(p, { drawSVG: '100%' }); };
  const drawPaths = (p: Element[] | undefined, delay?: number, dur?: number) => (p && p.length) ? gsap.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur || .7, ease: 'power2.inOut', stagger: .15, delay: delay || 0 }) : null;
  function setDrawn(g: string) { drawn[g] = true; showPaths(marks[g]); }
  function drawGroup(g: string, delay?: number, dur?: number) { if (drawn[g]) return; drawn[g] = true; drawPaths(marks[g], delay, dur); }

  function replyPrep() {
    if (drawn.reply) return;
    gsap.set(perfLine, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(scissors, { x: 0, rotation: 0 });
    hidePaths(marks.reply);
  }
  function replySet() {
    drawn.reply = true;
    gsap.set(perfLine, { clipPath: 'inset(0 0% 0 0)' });
    gsap.set(scissors, { x: Math.max(0, perf.clientWidth - 40), rotation: 8 });
    showPaths(marks.reply);
  }
  function replyLanding() {
    if (drawn.reply) return;
    drawn.reply = true;
    const w = Math.max(0, perf.clientWidth - 40);
    gsap.timeline()
      .to(perfLine, { clipPath: 'inset(0 0% 0 0)', duration: .6, ease: 'power2.inOut' }, 0)
      .to(scissors, { x: w, duration: .9, ease: 'power2.inOut' }, 0)
      .to(scissors, { rotation: 8, duration: .3, ease: 'power2.out' }, .7)
      .add(() => { drawPaths(marks.reply, 0, .7); }, .75);
  }

  /* ---------- geometry ---------- */
  function geometry() {
    const vw = innerWidth, vh = innerHeight;
    const H = Math.round(Math.min(vh - 80, 860));
    const W = Math.min(Math.round(.62 * H), Math.floor((vw - 176) / 2));
    S.H = H; S.W = W; S.Ws = [W, W, W - 3, W - 6]; S.sheetW = 4 * W - 9; S.C = S.sheetW / 2; S.vh = vh / 100;
    S.coverS = Math.min(1.08, (vh - 70) / H);
    S.posterS = Math.min(1, (vw - 250) / S.sheetW);
    d.style.setProperty('--W', W + 'px');
    d.style.setProperty('--H', H + 'px');
    d.style.setProperty('--sheetW', S.sheetW + 'px');
    d.style.setProperty('--opfs', (Math.round(.92 * S.sheetW / 9.79 * 10) / 10) + 'px');
    restCache = {};
  }
  const geoKey = () => innerWidth + 'x' + innerHeight + CFG.lang;

  /* layout bottom of a face's copy (transforms and pencil marks do not count) */
  function contentBottom(fc: HTMLElement) {
    let m = 0;
    for (const c of Array.from(fc.children) as HTMLElement[]) {
      const cs = getComputedStyle(c);
      if (cs.position === 'absolute' || cs.display === 'none') continue;
      m = Math.max(m, c.offsetTop + c.offsetHeight + parseFloat(cs.marginBottom || '0'));
    }
    return m;
  }
  /* every face must hold its copy at 16px body or more, or we fall back to the strip */
  function fitCheck() {
    for (const ts of [1, .97, .942]) {
      d.style.setProperty('--ts', String(ts));
      if (FACES.every(f => { const fc = $('.fc', f.el); return contentBottom(fc) <= fc.clientHeight + 1; })) return true;
    }
    d.style.removeProperty('--ts');
    return false;
  }

  /* forward kinematics: one transform list per panel, hinge after hinge */
  function chains(a12: number, a23: number, a34: number, flip: number) {
    const Ws = S.Ws;
    let pre = '';
    if (flip > .0005) {
      const r = flip * DEG;
      pre = `translateX(${S.C}px) translateZ(${(S.W * .55 * Math.sin(r)).toFixed(2)}px) rotateY(${(-flip).toFixed(3)}deg) rotateZ(${(1.4 * Math.sin(2 * r)).toFixed(3)}deg) translateX(${-S.C}px) `;
    }
    const p2 = pre + `translateX(${Ws[0]}px) rotateY(${(-a12).toFixed(3)}deg) `;
    const p3 = p2 + `translateX(${Ws[1]}px) rotateY(${(-a23).toFixed(3)}deg) `;
    const p4 = p3 + `translateX(${Ws[2]}px) rotateY(${(-a34).toFixed(3)}deg) `;
    return [pre, p2, p3, p4];
  }
  const osuf = (k: number) => `translateZ(-.5px) translateX(${S.Ws[k] / 2}px) rotateY(180deg) translateX(${-S.Ws[k] / 2}px)`;
  const faceTf = (f: FaceRec, P: string[]) => (P[f.k] + (f.o ? osuf(f.k) : '')).trim() || 'none';

  /* at a reading rest every visible face is flat: write plain integer 2D transforms so text is crisp */
  function restLayout(name: string) {
    if (restCache[name]) return restCache[name];
    const v = REST_VALUES[name], P = chains(v[0], v[1], v[2], v[3]), out: Record<string, string> = {};
    FACES.forEach(f => {
      if (!READING[name].includes(f.id)) return;
      const m = new DOMMatrix(faceTf(f, P));
      out[f.id] = `translate(${Math.round(m.m41)}px, ${Math.round(m.m42)}px)`;
    });
    return (restCache[name] = out);
  }

  function restAt(t: number) {
    for (const n in HOLDS) { const h = HOLDS[n]; if (t >= h[0] - .001 && t <= h[1] + .001) return n; }
    return null;
  }
  function labelAt(t: number): FolioName { return t < 60 ? 'cover' : t < 182 ? 'hello' : t < 297 ? 'work' : t < 392 ? 'menu' : t < 522 ? 'poster' : 'reply'; }

  /* ---------- render: one frame of paper ---------- */
  function render() {
    if (S.mode !== 'leaf') return;
    const t = master ? master.time() : 0;
    const W = S.W, Ws = S.Ws, C = S.C, H = S.H;
    const bh = bend.h, bv = bend.v;
    const a12 = clamp(0, 180, fold.a12 + intro.puff - peek.v - (bh === 1 ? bv : 0)), a23 = clamp(0, 180, fold.a23 - (bh === 2 ? bv : 0));
    const a34 = clamp(0, 180, fold.a34 - (bh === 3 ? bv : 0)), flip = clamp(0, 180, fold.flip + (bh === 4 ? bv : 0));
    const rest = (introDone && !peek.v && !bv) ? restAt(t) : null;
    const reading = rest && READING[rest] ? rest : null;
    if (peekOn && t > 1) setPeek(false);

    // camera
    const s = cam.s * intro.s, rx = cam.rx + intro.rx, rz = cam.rz + intro.rz, ry = cam.ry;
    const dx = intro.dx, dy = (cam.y + intro.dy) * S.vh;
    const ct = reading
      ? `translate(${Math.round(dx - cam.x)}px, ${Math.round(dy - H / 2)}px)`
      : `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${s.toFixed(4)}) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) translate3d(${(-cam.x).toFixed(2)}px, ${-H / 2}px, 0)`;
    if (ct !== S.ct) { camera.style.transform = ct; S.ct = ct; }

    // faces
    const P = chains(a12, a23, a34, flip);
    const RL = reading ? restLayout(reading) : null;
    const A = flip > .01 ? .32 : .24;
    const th = [0, -a12, -a12 - a23, -a12 - a23 - a34];
    for (const f of FACES) {
      let tf: string, op = 1, sh = 0;
      if (RL) {
        if (RL[f.id]) tf = RL[f.id]; else { tf = f.tf || 'none'; op = 0; }
      } else {
        tf = faceTf(f, P);
        if (flip < .01) {
          /* About lies right under the closed cover: hide it until the cover lifts, so a browser that sorts the 3D
             layers differently cannot draw it over the cover (the open-tab peek lifts the cover to 163) */
          if (f.k === 0 && !f.o && a12 > 165) op = 0;
          if (f.k === 2 && a12 > 150) op = 0;
          if (f.k === 3 && (a12 > 150 || a23 > 150)) op = 0;
        }
        sh = A * Math.abs(Math.sin((th[f.k] - flip) * DEG));
      }
      if (tf !== f.tf) { f.el.style.transform = tf; f.tf = tf; }
      if (op !== f.op) { f.el.style.opacity = String(op); f.el.style.pointerEvents = op ? '' : 'none'; f.op = op; }
      sh = Math.round(sh * 1000) / 1000;
      if (sh !== f.sh) { f.shade.style.opacity = String(sh); f.sh = sh; }
    }

    // cast shadows on the inside faces, beside each crease
    ([[face.about, a12], [face.work, a23], [face.services, a34]] as [FaceRec, number][]).forEach(([f, a]) => {
      if (!f.cast) return;
      const k = (reading || flip > .01) ? 0 : Math.max(0, Math.sin(a * DEG));
      const v = Math.round(k * 1000) / 1000;
      if (v !== f.ck) { f.cast.style.opacity = (.2 * v).toFixed(3); f.cast.style.transform = `translateX(${(-.36 * W * v).toFixed(1)}px)`; f.ck = v; }
    });

    // desk shadows: a sharp contact shadow under what lies flat, a soft one under what is in the air
    let x0: number, x1: number, so: number, g0: number, g1: number, go: number;
    if (flip > .01) {
      const k = Math.sin(flip * DEG), c = Math.abs(Math.cos(flip * DEG));
      x0 = C - C * c; x1 = C + C * c; so = .2 * (1 - k);
      const sc = Math.max(.3, c * .96); g0 = C - C * sc; g1 = C + C * sc; go = .04 + .07 * k;
    } else {
      const pts: [number, number][] = [[0, 0], [Ws[0], 0]];
      let ang = a12 * DEG, x = Ws[0], z = 0;
      x += Ws[1] * Math.cos(ang); z += Ws[1] * Math.sin(ang); pts.push([x, z]);
      ang += a23 * DEG; x += Ws[2] * Math.cos(ang); z += Ws[2] * Math.sin(ang); pts.push([x, z]);
      ang += a34 * DEG; x += Ws[3] * Math.cos(ang); z += Ws[3] * Math.sin(ang); pts.push([x, z]);
      const flat = pts.filter(p => p[1] < 3).map(p => p[0]);
      x0 = Math.min(...flat); x1 = Math.max(...flat);
      const proj = pts.map(p => p[0] + Math.max(0, p[1]) * .22);
      g0 = Math.min(...proj); g1 = Math.max(...proj);
      const lifted = Math.max(Math.sin(a12 * DEG), Math.sin(a23 * DEG), Math.sin(a34 * DEG));
      so = .16 + .04 * cam.pk; go = .12 * lifted * lifted + .03 * cam.pk;
      if (cam.pk) { const m = (g0 + g1) / 2, hw = (g1 - g0) / 2 * (1 + .04 * cam.pk); g0 = m - hw; g1 = m + hw; }
    }
    if (intro.lift) {
      so *= 1 - .7 * intro.lift; go *= 1 - .5 * intro.lift;
      const m = (x0 + x1) / 2, hw = (x1 - x0) / 2 * (1 + .18 * intro.lift); x0 = m - hw; x1 = m + hw;
    }
    writeShadow(dSharp, x0, x1, so, -2);
    writeShadow(dSoft, g0, g1, go, -3);

    // the paper edge that stays visible when the sheet is edge-on
    const eo = flip > .01 ? clamp(0, 1, 1 - Math.abs(Math.cos(flip * DEG)) / .22) : 0;
    if (eo !== S.eo) { edge.style.opacity = String(eo); S.eo = eo; }
    if (eo > 0) edge.style.transform = P[0] + `translateX(${C}px) rotateY(90deg) translateX(-1.5px)`;

    const atPoster = rest === 'poster';
    if (atPoster !== S.ap) { d.classList.toggle('at-poster', atPoster); S.ap = atPoster; }
    const tabOn = t < 2 && flip < .01 ? '' : 'hidden';
    if (tabOn !== S.tab) { openTab.style.visibility = tabOn; S.tab = tabOn; }
    const ho = clamp(0, 1, 1 - t / 12);
    if (ho !== S.ho) { hint.style.opacity = String(ho); S.ho = ho; }
    // the folio follows the paper: once the cover has turned past halfway, the reader is on About
    const lab = labelAt(t);
    setFolio(lab === 'cover' && a12 < 90 ? 'hello' : lab);
  }
  type ShadowEl = HTMLElement & { __tf?: string | null; __w?: string | null; __o?: string | null };
  function writeShadow(el: ShadowEl, a: number, b: number, o: number, z: number) {
    const tf = `translate3d(${a.toFixed(1)}px, 0, ${z}px)`, w = Math.max(0, b - a).toFixed(1) + 'px', op = o.toFixed(3);
    if (el.__tf !== tf) { el.style.transform = tf; el.__tf = tf; }
    if (el.__w !== w) { el.style.width = w; el.__w = w; }
    if (el.__o !== op) { el.style.opacity = op; el.__o = op; }
  }

  /* ---------- folio with odometer digits ---------- */
  let folioCur: FolioName | null = null;
  function setFolio(name: FolioName) {
    if (name === folioCur) return;
    const prev = folioCur; folioCur = name;
    folioName.textContent = CFG.folio[name];
    const num = FOLIO_NUM[name];
    folioHere.textContent = num ? `${num} · ${CFG.folio[name]}` : CFG.folio[name];
    folioPg.style.display = num ? '' : 'none';
    if (!num) return;
    const dir = prev ? (FOLIO_ORDER.indexOf(name) > FOLIO_ORDER.indexOf(prev) ? 1 : -1) : 0;
    rollDigit(String(num), dir);
  }
  function rollDigit(txt: string, dir: number) {
    const ds = $$('.odo__d', odo);
    gsap.killTweensOf(ds);
    ds.slice(0, -1).forEach(n => n.remove());
    const old = ds[ds.length - 1];
    gsap.set(old, { clearProps: 'all' });
    if (old.textContent === txt) return;
    if (!dir || S.mode === 'calm') { old.textContent = txt; return; }
    const nu = old.cloneNode() as HTMLElement; nu.textContent = txt; odo.appendChild(nu);
    gsap.set(old, { position: 'absolute', left: 0, top: 0 });
    gsap.to(old, { yPercent: -100 * dir, duration: .45, ease: 'expo.out', onComplete: () => old.remove() });
    gsap.fromTo(nu, { yPercent: 100 * dir }, { yPercent: 0, duration: .45, ease: 'expo.out' });
  }

  /* ---------- scrolling: native, with a few guided jumps ---------- */
  function killScroll() { if (scrollTw) { scrollTw.kill(); scrollTw = null; scrollTarget = null; } stopGlide(); }
  addEventListener('wheel', killScroll, { passive: true });
  addEventListener('touchstart', killScroll, { passive: true });
  addEventListener('keydown', e => { if (!['Tab', 'Enter', ' ', 'Shift'].includes(e.key)) killScroll(); });
  function scrollToY(y: number, dur?: number, label?: string) {
    killScroll();
    const from = scrollY, dist = Math.abs(y - from);
    if (dur === 0 || dist < 2) { window.scrollTo(0, y); return; }
    const o = { y: from };
    scrollTarget = label || null;
    scrollTw = gsap.to(o, { y, duration: dur || clamp(.7, 1.8, dist / 2400), ease: 'power3.inOut', onUpdate: () => window.scrollTo(0, Math.round(o.y)), onComplete: () => { scrollTw = null; scrollTarget = null; } });
  }
  const labelY = (name: LabelName) => Math.round(st!.start + (st!.end - st!.start) * LABELS[name] / T);
  function jumpInstant(name: LabelName) {
    killScroll();
    window.scrollTo(0, labelY(name));
    ScrollTrigger.update();
    const tw = st!.getTween && st!.getTween();
    if (tw) tw.progress(1);
    master!.progress(LABELS[name] / T);
    render();
  }
  function currentLabel(): LabelName {
    if (S.mode === 'leaf' && st) {
      if (scrollTarget) return scrollTarget as LabelName;
      const t = (scrollY - st.start) / (st.end - st.start) * T;
      let best: LabelName = 'cover', bd = 1e9;
      ORDER.forEach(n => { const dd = Math.abs(LABELS[n] - t); if (dd < bd) { bd = dd; best = n; } });
      return best;
    }
    return (FACE_LABEL[currentPanel().id] || 'cover');
  }
  let unfolding = false; // the phone intro scales the sheet down, so positions would point past the cover
  function currentPanel() {
    let cur = panels[0];
    if (unfolding) return cur;
    // a tablet spread goes by its left-hand page, as the desktop folio names it
    const spread = mmSpread.matches;
    panels.forEach(p => { if (!(spread && RIGHT_PAGES.has(p.id)) && p.getBoundingClientRect().top < innerHeight * .4) cur = p; });
    return cur;
  }
  function scrollToEl(el: HTMLElement | null, instant?: boolean) {
    if (!el) return;
    el.scrollIntoView({ behavior: (instant || S.mode === 'calm') ? 'auto' : 'smooth', block: 'start' });
  }
  interface GoOpts { instant?: boolean; dur?: number; id?: string }
  function goTo(label: LabelName, opts?: GoOpts) {
    const o = opts || {};
    if (S.mode === 'leaf' && st) {
      if (o.instant) return jumpInstant(label);
      scrollToY(labelY(label), o.dur, label);
      return;
    }
    scrollToEl(document.getElementById(o.id || LABEL_ID[label]), o.instant);
  }
  function step(dir: number) {
    if (S.mode === 'leaf') { const i = clamp(0, ORDER.length - 1, ORDER.indexOf(currentLabel()) + dir); goTo(ORDER[i]); return; }
    const i = clamp(0, panels.length - 1, panels.indexOf(currentPanel()) + dir);
    scrollToEl(panels[i]);
  }
  $('.folio__prev').addEventListener('click', () => step(-1));
  $('.folio__next').addEventListener('click', () => step(1));

  /* in-page links become jumps through the folds */
  document.addEventListener('click', e => {
    const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    if (a.dataset.work !== undefined) { e.preventDefault(); openLoose(+a.dataset.work, a); return; }
    const id = a.getAttribute('href')!.slice(1);
    const label = ID_LABEL[id];
    if (!label) return;
    e.preventDefault();
    closeContents(true);
    if (dlg.open) closeLoose(true);
    if (S.mode === 'leaf') goTo(label); else goTo(label, { id });
    if (e.detail === 0) { // keyboard: carry focus to where we land
      const target = document.getElementById(id === 'contact' ? 'contact-h' : id);
      const t0 = S.mode === 'leaf' ? 1900 : 600;
      setTimeout(() => { if (!target) return; if (!target.hasAttribute('tabindex') && !target.matches('a,button,input,textarea')) target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }, t0);
    }
  });

  /* on the open poster every panel is a target: a click zooms back into its fold */
  document.addEventListener('click', e => {
    if (S.mode !== 'leaf' || !master || restAt(master.time()) !== 'poster') return;
    const el = e.target as Element;
    if (el.closest('a, button, input, textarea, label, summary')) return;
    const f = el.closest('.face');
    if (f) goTo(FACE_LABEL[f.id], { dur: 1.2 });
  });

  /* focus follows the paper: tabbing into a face turns the leaflet to where that face is visible */
  document.addEventListener('focusin', e => {
    if (S.mode !== 'leaf' || !st) return;
    const fEl = (e.target as Element).closest?.('.face');
    if (!fEl) return;
    const want = FACE_LABEL[fEl.id];
    if (!want) return;
    if (scrollTw && scrollTarget === want) return;
    const cur = restAt(master!.time());
    if (cur && READING[cur] && READING[cur].includes(fEl.id) && !scrollTw) return;
    if (!scrollTw && currentLabel() === want && cur) return;
    goTo(want, { dur: .9 });
  });

  /* ---------- gestures: pull the paper sideways to turn the leaflet ----------
     A sideways swipe on a trackpad moves through the same scroll as the wheel and settles through its snap.
     A drag with the mouse or a finger is a hand on the paper: press, and the page that turns next lifts its free edge;
     drag, and the paper follows the hand a breath behind (pulling to the right opens it, the way the cover swings over);
     let go, and it glides on at the hand's speed to the next page that way (or back, after a nudge), slowing as it
     arrives, and lands with a small settle.
     Past the first and last page it gives like rubber. */
  const pxPerDx = () => innerHeight * 1.15 / (S.W || 500); // a pull across one panel is about one turn
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  addEventListener('wheel', e => {
    if (S.mode !== 'leaf' || !st || e.ctrlKey) return; // ctrl: a pinch
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerWidth : 1;
    const dx = e.deltaX * unit;
    if (Math.abs(dx) <= Math.abs(e.deltaY * unit)) return;
    e.preventDefault(); // and so no sideways overscroll or browser back-swipe either
    window.scrollTo(0, clamp(0, maxY(), scrollY - dx * pxPerDx()));
  }, { passive: false });

  /* the paper is where the scroll says, now: the scrub's own easing would leave it trailing far behind the hand */
  function follow() {
    ScrollTrigger.update();
    const tw = st && st.getTween && st.getTween();
    if (tw) tw.progress(1);
  }
  // which hinge lifts when the paper is pressed at each rest (degrees towards the next page; on the reply, back)
  const LIFT: Partial<Record<LabelName, [number, number]>> = { cover: [1, 14], hello: [2, 12], work: [3, 12], poster: [4, 8], reply: [4, -8] };
  // which hinge turns between two neighbouring rests
  const TURN: Record<string, number> = { 'cover>hello': 1, 'hello>work': 2, 'work>menu': 3, 'poster>reply': 4 };
  function bendTo(v: number, dur: number, ease: string) {
    gsap.killTweensOf(bend);
    return gsap.to(bend, { v, duration: dur, ease, onUpdate: render, onComplete: render });
  }

  interface Drag { id: number; x: number; y: number; y0: number; on: boolean; lx: number; lt: number; vx: number }
  let drag: Drag | null = null, dragClick = false;
  const NO_DRAG = 'a, button, input, textarea, select, label, summary, [contenteditable], .open-tab';
  stage.addEventListener('pointerdown', e => {
    if (S.mode !== 'leaf' || !st || !master || !introDone || e.button !== 0 || (e.target as Element).closest(NO_DRAG)) return;
    killScroll();
    gsap.killTweensOf(intro);
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, y0: scrollY, on: false, lx: e.clientX, lt: e.timeStamp, vx: 0 };
    d.classList.add('page-hold');
    // the page that turns next lifts its free edge (on the cover it takes over from the corner peek)
    const t = master.time(), at = (t < 1 ? 'cover' : restAt(t)) as LabelName | null, lift = at && LIFT[at];
    if (!lift) return;
    if (bend.h !== lift[0]) { gsap.killTweensOf(bend); bend.v = 0; bend.h = lift[0]; }
    if (lift[0] === 1 && peek.v) { gsap.killTweensOf(peek); bend.v = peek.v; peek.v = 0; peekOn = false; }
    bendTo(lift[1], .4, 'power2.out');
  });
  function letGo() {
    drag = null;
    d.classList.remove('page-hold', 'page-drag');
    if (intro.dx) gsap.to(intro, { dx: 0, duration: .7, ease: 'elastic.out(1, .55)', onUpdate: render, onComplete: render });
  }
  addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.on) {
      // up and down stays a selection or a scroll: the page is put down
      if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) { letGo(); if (bend.v) bendTo(0, .35, 'sine.inOut'); return; }
      if (Math.abs(dx) < 10) return;
      drag.on = true;
      try { stage.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      d.classList.add('page-drag');
      if (dx < 0 && bend.v) bendTo(0, .35, 'sine.inOut'); // pulled back: the lifted page lies down again
      startGlide();
    }
    getSelection()?.removeAllRanges();
    const dt = e.timeStamp - drag.lt;
    if (dt > 0) drag.vx = .7 * drag.vx + .3 * (e.clientX - drag.lx) / dt;
    drag.lx = e.clientX; drag.lt = e.timeStamp;
    const k = pxPerDx(), y = drag.y0 + dx * k, top = maxY();
    const over = y < 0 ? y / k : y > top ? (y - top) / k : 0;
    intro.dx = over ? Math.sign(over) * 56 * (1 - 1 / (1 + Math.abs(over) / 150)) : 0;
    glide.hand = clamp(0, top, y);
    if (over) render();
  });
  function endDrag(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const g = drag;
    letGo();
    if (!g.on || !st) { if (bend.v) bendTo(0, .35, 'sine.inOut'); return; }
    // the click that ends a drag is not a click (on the poster it would zoom in)
    dragClick = true; setTimeout(() => { dragClick = false; }, 0);
    const dx = e.clientX - g.x, flick = e.timeStamp - g.lt < 80 && Math.abs(g.vx) > .45;
    const dir = flick ? Math.sign(g.vx) : Math.abs(dx) > 40 ? Math.sign(dx) : 0;
    const t = (scrollY - st.start) / (st.end - st.start) * T;
    let to: LabelName = currentLabel();
    if (dir > 0) to = ORDER.find(n => LABELS[n] > t + 1) || 'reply';
    if (dir < 0) to = [...ORDER].reverse().find(n => LABELS[n] < t - 1) || 'cover';
    dropOn(to, dir);
  }
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  addEventListener('click', e => { if (dragClick) { e.preventDefault(); e.stopPropagation(); } }, true);

  /* the paper's own motion under a hand. While held it chases the hand a tenth of a second behind, so the folds run
     smooth instead of taking every jitter of the mouse; let go, it leaves at exactly the speed it had and eases into
     the next rest along one smooth curve (a Hermite curve: no stall at the release, no kick, no overshoot past the page) */
  const glide = { on: false, y: 0, v: 0, hand: 0, goal: -1, h: 0, dir: 0, t: 0, dur: 0, y0: 0, m0: 0 };
  function startGlide() {
    if (!glide.on) { glide.y = scrollY; glide.v = 0; glide.on = true; gsap.ticker.add(glideTick); }
    glide.hand = glide.y; glide.goal = -1;
  }
  function stopGlide() {
    if (!glide.on || (drag && drag.on)) return;
    glide.on = false; glide.goal = -1; gsap.ticker.remove(glideTick);
    if (scrollTarget && !scrollTw) scrollTarget = null;
  }
  function glideTick(_t: number, ms: number) {
    const dt = Math.min(.05, ms / 1000) || .016;
    if (drag && drag.on) {
      const gap = glide.hand - glide.y;
      if (Math.abs(gap) < .5) { glide.v = 0; if (!gap) return; glide.y = glide.hand; } // caught up: the paper rests in the hand
      else { const y = glide.y + gap * (1 - Math.exp(-dt / .1)); glide.v = (y - glide.y) / dt; glide.y = y; }
    } else if (glide.goal >= 0) {
      glide.t = Math.min(1, glide.t + dt / glide.dur);
      const u = glide.t, u2 = u * u, u3 = u2 * u;
      glide.y = (2 * u3 - 3 * u2 + 1) * glide.y0 + (u3 - 2 * u2 + u) * glide.m0 + (3 * u2 - 2 * u3) * glide.goal;
      if (u >= 1) { window.scrollTo(0, glide.goal); follow(); landed(); return; }
    } else { stopGlide(); return; }
    window.scrollTo(0, glide.y);
    follow();
  }
  /* letting go: aim the glide at the page, and let the lifted edge down on the way */
  function dropOn(to: LabelName, dir: number) {
    if (!glide.on) startGlide();
    const prev = dir ? ORDER[ORDER.indexOf(to) - dir] : undefined;
    glide.h = prev ? (TURN[dir > 0 ? `${prev}>${to}` : `${to}>${prev}`] || 0) : 0;
    glide.dir = dir; glide.goal = labelY(to); scrollTarget = to;
    // as long as it would take to coast there at the hand's speed, within a calm half to most of a second;
    // the hand's speed carries over, but never so much that the curve would shoot past the page
    const left = glide.goal - glide.y, sp = Math.abs(glide.v);
    glide.dur = clamp(.45, .9, sp > 1 ? 2 * Math.abs(left) / sp : .9);
    glide.m0 = Math.sign(left) === Math.sign(glide.v) ? clamp(-2.5 * Math.abs(left), 2.5 * Math.abs(left), glide.v * glide.dur) : 0;
    glide.y0 = glide.y; glide.t = 0;
    if (bend.v) bendTo(0, glide.dur * .8, 'sine.inOut');
  }
  /* it lies down: a small settle, bouncing up a touch the way it came before it lies flat */
  function landed() {
    const h = glide.h, dir = glide.dir;
    stopGlide();
    if (!h || (h === 3 && dir > 0)) return; // the third fold lands on its own air cushion
    gsap.killTweensOf(bend);
    bend.h = h; bend.v = 0;
    gsap.timeline({ onUpdate: render, onComplete: render })
      .to(bend, { v: -dir * 2.5, duration: .2, ease: 'sine.out' })
      .to(bend, { v: 0, duration: .5, ease: 'sine.inOut' });
  }

  /* ---------- build: the 3D leaflet ---------- */
  function buildMaster() {
    const W = S.W, C = S.C, s0 = S.coverS, sp = S.posterS;
    Object.assign(fold, { a12: 176, a23: 179.5, a34: 179.8, flip: 0 });
    Object.assign(cam, { x: W / 2, y: 0, s: s0, rx: 0, ry: 0, rz: -1.2, pk: 0 });
    const tl = gsap.timeline({ paused: true, onUpdate: render });
    const ft = (tg: object, from: gsap.TweenVars, to: gsap.TweenVars, at: number, dur: number, ease?: string) => tl.fromTo(tg, from, Object.assign({}, to, { duration: dur, ease: ease || 'none', immediateRender: false }), at);
    // fold 1, the heavy lift: the cover swings open and the camera follows the paper
    ft(fold, { a12: 176 }, { a12: 0 }, 0, 100, 'paper');
    ft(cam, { x: W / 2 }, { x: W }, 12, 88, 'power2.inOut');
    ft(cam, { s: s0 }, { s: .93 }, 0, 50, 'sine.inOut');
    ft(cam, { s: .93 }, { s: 1 }, 50, 50, 'sine.inOut');
    ft(cam, { rz: -1.2 }, { rz: 0 }, 0, 100, 'power1.inOut');
    // fold 2, the roll: lighter, the head turns with the paper
    ft(fold, { a23: 179.5 }, { a23: 0 }, 140, 85, 'power2.inOut');
    ft(cam, { x: W }, { x: 2 * W }, 150, 75, 'power3.inOut');
    ft(cam, { ry: 0 }, { ry: -5 }, 140, 40, 'power1.out');
    ft(cam, { ry: -5 }, { ry: 0 }, 180, 45, 'power1.inOut');
    ft(cam, { s: 1, rz: 0 }, { s: .95, rz: -.6 }, 140, 42, 'sine.inOut');
    ft(cam, { s: .95, rz: -.6 }, { s: 1, rz: 0 }, 182, 43, 'sine.inOut');
    // fold 3, the flick: one light sheet, an air cushion as it lands
    ft(fold, { a34: 179.8 }, { a34: 6 }, 265, 45, 'power2.in');
    ft(fold, { a34: 6 }, { a34: 0 }, 310, 10, 'power1.out');
    ft(fold, { a34: 0 }, { a34: 2.5 }, 320, 5, 'sine.inOut');
    ft(fold, { a34: 2.5 }, { a34: 0 }, 325, 5, 'sine.inOut');
    ft(cam, { x: 2 * W }, { x: 3 * W - 3 }, 265, 65, 'power2.inOut');
    ft(cam, { s: 1 }, { s: .96 }, 265, 32, 'sine.inOut');
    ft(cam, { s: .96 }, { s: 1 }, 297, 33, 'sine.inOut');
    // the poster: pull back and lay the open sheet on the desk
    ft(cam, { s: 1, x: 3 * W - 3, rz: 0 }, { s: sp, x: C, rz: -2 }, 370, 45, 'power3.inOut');
    ft(cam, { rx: 0, y: 0, pk: 0 }, { rx: 20, y: 3, pk: 1 }, 375, 40, 'power2.inOut');
    // the turn-over: the whole sheet lifts on its right edge and sweeps over
    ft(fold, { flip: 0 }, { flip: 180 }, 485, 75, 'turn');
    ft(cam, { rx: 20 }, { rx: 9 }, 485, 38, 'power1.out');
    ft(cam, { rx: 9 }, { rx: 0 }, 523, 37, 'power2.inOut');
    ft(cam, { s: sp, x: C, y: 3, pk: 1 }, { s: 1, x: 3 * W - 9, y: 0, pk: 0 }, 520, 40, 'power2.inOut');
    ft(cam, { rz: -2 }, { rz: 0 }, 485, 75, 'power1.inOut');
    tl.set({}, {}, T);
    return tl;
  }

  /* snap only to rest labels, in the direction of travel, after the scroll has stopped */
  function snapTo(v: number, self?: ScrollTrigger) {
    if (drag && drag.on) return v; // a hand holding the paper still is not a stop; letting go decides the page
    for (const n in HOLDS) { const h = HOLDS[n]; if (v >= h[0] / T && v <= h[1] / T) return LABELS[n as LabelName] / T; }
    const ps = ORDER.map(n => LABELS[n] / T);
    if (v < .015) return 0;
    if (self && self.direction > 0) { for (const p of ps) if (p > v) return p; return 1; }
    for (let i = ps.length - 1; i >= 0; i--) if (ps[i] < v) return ps[i];
    return 0;
  }

  interface Land { g: string; t: number; delay: number; dur?: number; pending?: (() => void) | null }
  const LAND: Land[] = [
    { g: 'hello', t: 100, delay: .15 }, { g: 'work', t: 225, delay: .15 }, { g: 'menu', t: 330, delay: .15 },
    { g: 'reply', t: 560, delay: 0 },
  ];
  const LAND_LABEL: Record<string, string> = { hello: 'hello', work: 'work', menu: 'menu', reply: 'reply' };
  function land(L: Land, self: ScrollTrigger) {
    if (drawn[L.g] || L.pending) return;
    const fast = Math.abs(self.getVelocity()) > 3200 || (scrollTw && scrollTarget && scrollTarget !== LAND_LABEL[L.g]);
    if (fast) { if (L.g === 'reply') replySet(); else setDrawn(L.g); return; }
    // wait for the scrubbed paper to actually arrive, then draw (marks never un-draw)
    const check = () => {
      if (!master || S.mode !== 'leaf') { gsap.ticker.remove(check); L.pending = null; return; }
      if (master.time() >= L.t - .01) {
        gsap.ticker.remove(check); L.pending = null;
        if (L.g === 'reply') gsap.delayedCall(.05, replyLanding); else drawGroup(L.g, L.delay, L.dur);
      }
    };
    L.pending = check; gsap.ticker.add(check);
  }
  function unland(L: Land) { if (L.pending) { gsap.ticker.remove(L.pending); L.pending = null; } }

  interface ModeOpts { keep?: LabelName; keepId?: string; first?: boolean }
  function buildLeaf(opts: ModeOpts) {
    wrap.style.height = Math.round(innerHeight * (1 + T / 100)) + 'px';
    camera.style.left = Math.round(innerWidth / 2) + 'px';
    camera.style.top = Math.round(stage.clientHeight / 2) + 'px';
    FACES.forEach(f => { f.tf = null; f.op = null; f.sh = null; f.ck = null; });
    S.ct = ''; S.eo = S.ho = S.tab = S.ap = null;
    master = buildMaster();
    st = ScrollTrigger.create({
      trigger: wrap, start: 'top top', end: 'bottom bottom', animation: master, scrub: .8,
      snap: { snapTo: (v: number, self?: ScrollTrigger) => snapTo(v, self), delay: .3, duration: { min: .35, max: .85 }, ease: 'power2.inOut', inertia: false },
    });
    ['hello', 'work', 'menu'].forEach(g => { if (!drawn[g]) hidePaths(marks[g]); });
    replyPrep();
    LAND.forEach(L => {
      L.pending = null;
      ScrollTrigger.create({ start: () => st!.start + (st!.end - st!.start) * L.t / T, end: () => st!.start + (st!.end - st!.start) * L.t / T + 1, onEnter: self => land(L, self), onLeaveBack: () => unland(L) });
    });

    ScrollTrigger.refresh();
    let keep = opts.keep;
    if (window.__leafHash) {
      keep = ID_LABEL[window.__leafHash.slice(1)] || keep;
      try { history.replaceState(null, '', location.pathname + location.search + window.__leafHash); } catch { /* ignore */ }
      window.__leafHash = null;
    }
    if (keep && keep !== 'cover') {
      d.classList.remove('intro');
      introDone = true;
      jumpInstant(keep);
      LAND.forEach(L => { if (L.t <= LABELS[keep as LabelName]) { if (L.g === 'reply') replySet(); else setDrawn(L.g); } });
      setDrawn('cover');
    } else {
      window.scrollTo(0, 0);
      master.progress(0);
      if (opts.first) introLeaf(); else { setDrawn('cover'); introDone = true; }
    }
    render();
  }

  /* ---------- intro on wide screens: the leaflet is dropped on the desk ---------- */
  function introLeaf() {
    let seen = false;
    try { seen = sessionStorage.getItem('leaflet-intro') === '1'; sessionStorage.setItem('leaflet-intro', '1'); } catch { /* ignore */ }
    const wasIntro = d.classList.contains('intro');
    d.classList.remove('intro');
    if (seen || !wasIntro) {
      introDone = true; render();
      hidePaths(coverMarks); drawn.cover = true;
      drawPaths(coverMarks, .2, .6);
      return;
    }
    introDone = false;
    skipBtn.hidden = false;
    Object.assign(intro, { dy: -4, s: 1.06, rx: 14, rz: -5.3, dx: 18, puff: 0, lift: 1 });
    hidePaths(coverMarks); hidePaths(cropPaths); drawn.cover = true;
    render();
    liftNext = true;
    introTl = gsap.timeline({ onUpdate: render, onComplete: () => { endIntro(); if (liftNext) liftCover(); } });
    introTl
      .to(intro, { dy: 0, s: 1, rx: 0, lift: 0, duration: .52, ease: 'power2.in' }, 0)
      .to(intro, { puff: -6, duration: .14, ease: 'power2.out' }, .52)
      .to(intro, { puff: 0, duration: .32, ease: 'sine.inOut' }, .66)
      .to(intro, { rz: 0, dx: 0, duration: .5, ease: 'expo.out' }, .52)
      .to(cropPaths, { drawSVG: '100%', duration: .4, stagger: .05, ease: 'power2.out' }, .6)
      .fromTo(tags, { rotation: 3 }, { rotation: 0, duration: .8, stagger: .08, ease: 'sine.out' }, .62)
      .add(slipThump(), .9)
      .fromTo(coverMarks, { drawSVG: '0%' }, { drawSVG: '100%', duration: .8, ease: 'power2.inOut' }, 1);
    armSkip();
  }
  function endIntro() {
    introDone = true; introTl = null;
    hideSkip();
    Object.assign(intro, { dy: 0, s: 1, rx: 0, rz: 0, dx: 0, puff: 0, lift: 0 });
    gsap.set(tags.concat(quoteSlip), { clearProps: 'transform' });
    showPaths(cropPaths); showPaths(coverMarks);
    render();
  }
  function slipThump() {
    return gsap.timeline()
      .to(quoteSlip, { scale: 1.07, duration: .08, ease: 'power1.out' })
      .to(quoteSlip, { scale: .95, duration: .16, ease: 'power4.in' })
      .to(quoteSlip, { scale: 1, duration: .14, ease: 'power2.out' });
  }
  function skipIntro() { liftNext = false; if (introTl) introTl.progress(1); }
  function armSkip() {
    const ev = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const fn = (e: Event) => { if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Tab') return; skipIntro(); ev.forEach(n => removeEventListener(n, fn, true)); };
    ev.forEach(n => addEventListener(n, fn, { capture: true, passive: true }));
  }
  /* after the drop, a first hint: the cover lifts its free edge once, About shows under it, and it falls shut with a
     small settle. It only bends the cover (the corner peek's value), never the scroll; any wheel, key, click or touch
     lets the cover down at once and hands over to whatever the reader does. */
  let liftNext = false, liftTl: gsap.core.Timeline | null = null;
  function liftCover() {
    if (S.mode !== 'leaf' || !master || scrollY > 2 || master.time() > 1) return;
    const ev = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const stop = (e?: Event) => {
      if (e && e.type === 'keydown' && (e as KeyboardEvent).key === 'Tab') return;
      ev.forEach(n => removeEventListener(n, stop, true));
      if (!liftTl) return;
      liftTl.kill(); liftTl = null;
      gsap.to(peek, { v: 0, duration: .3, ease: 'power2.out', onUpdate: render, onComplete: render });
    };
    liftTl = gsap.timeline({ delay: .25, onUpdate: render, onComplete: () => { liftTl = null; ev.forEach(n => removeEventListener(n, stop, true)); render(); } })
      .to(peek, { v: 35, duration: .7, ease: 'power2.inOut' })
      .to(peek, { v: 0, duration: .55, ease: 'power2.in' }, '+=.35')
      .to(peek, { v: 3, duration: .15, ease: 'sine.out' })
      .to(peek, { v: 0, duration: .25, ease: 'sine.inOut' });
    ev.forEach(n => addEventListener(n, stop, { capture: true, passive: true }));
  }
  function stopLift() { if (liftTl) { liftTl.kill(); liftTl = null; } peek.v = 0; }

  /* the Skip button exists only while the intro plays; afterwards it would be a dead control */
  const skipBtn = $('.skip');
  function hideSkip() { const had = document.activeElement === skipBtn; skipBtn.hidden = true; if (had) $('.cover__acts .btn').focus({ preventScroll: true }); }
  skipBtn.addEventListener('click', () => { skipIntro(); $('.cover__acts .btn').focus(); });

  /* the corner peek: a hint that the cover lifts */
  function setPeek(on: boolean) {
    if (peekOn === on) return;
    peekOn = on;
    gsap.to(peek, { v: on ? 13 : 0, duration: on ? .45 : .6, ease: on ? 'ui' : 'power2.inOut', overwrite: true, onUpdate: render, onComplete: render });
  }
  const canPeek = () => S.mode === 'leaf' && introDone && !liftTl && master && master.time() < 1 && !scrollTw && !drag;
  face.cover.el.addEventListener('pointermove', e => {
    if (!canPeek() || !mmFine.matches) return;
    const r = face.cover.el.getBoundingClientRect();
    setPeek((e.clientX - r.left) / r.width < .22);
  });
  face.cover.el.addEventListener('pointerleave', () => setPeek(false));
  openTab.addEventListener('focus', () => { if (canPeek()) setPeek(true); });
  openTab.addEventListener('blur', () => setPeek(false));
  openTab.addEventListener('click', () => { setPeek(false); goTo('hello', { dur: 1.1 }); });

  /* after the phone intro: a small note that the leaflet goes on below; it leaves at the first scroll */
  function showScrollCue() {
    const cue = $('.scroll-cue');
    if (!cue || scrollY > 20) return;
    gsap.set(cue, { autoAlpha: 0, y: 8 });
    cue.hidden = false;
    gsap.to(cue, { autoAlpha: .8, y: 0, duration: .4, ease: 'power2.out', delay: .5 });
    const hide = () => {
      if (scrollY < 20) return;
      removeEventListener('scroll', hide);
      gsap.to(cue, { autoAlpha: 0, y: 8, duration: .25, onComplete: () => { cue.hidden = true; gsap.set(cue, { clearProps: 'all' }); } });
    };
    addEventListener('scroll', hide, { passive: true });
  }

  /* ---------- first-visit intro on phones and tablets: the leaflet lands closed on the desk and waits ---------- */
  let finishUnfold: (() => void) | null = null; // lands the intro at once (a mode change, a shortcut)
  /* the wait both intros share: a tap on the desk (or a scroll, or a key) opens it; once it is opening,
     another tap or scroll just lands it; the bar and the controls still work, their shortcut lands it first */
  function waitToOpen(hintY: number, land: gsap.core.Timeline, play: (now: boolean) => gsap.core.Timeline, finish: () => void) {
    const btn = $<HTMLButtonElement>('.unfold'), furn = $('.furn'), controls = $('.controls');
    unfolding = true;
    d.classList.add('unfolding'); // the bar waits until the leaflet is open
    btn.style.setProperty('--hint-y', Math.round(hintY) + 'px');
    gsap.set(btn, { autoAlpha: 0 });
    btn.hidden = false;
    land.to(btn, { autoAlpha: 1, duration: .35 }, .75);

    let tl: gsap.core.Timeline | null = null;
    const block = (e: Event) => { e.preventDefault(); open(); };
    const keys = (e: KeyboardEvent) => { if (['ArrowDown', 'PageDown', ' ', 'Enter', 'End', 'Escape'].includes(e.key) && e.target !== btn) { e.preventDefault(); open(); } };
    const skip = (e: Event) => { if (!btn.contains(e.target as Node)) tl?.progress(1); };
    const now = () => { open(true); tl?.progress(1); };
    function open(instant?: boolean) {
      if (tl) return;
      land.progress(1);
      removeEventListener('wheel', block); removeEventListener('touchmove', block); removeEventListener('keydown', keys);
      gsap.to(btn, { autoAlpha: 0, duration: .2, onComplete: () => { btn.hidden = true; gsap.set(btn, { clearProps: 'opacity,visibility' }); } });
      tl = play(!!instant).eventCallback('onComplete', done);
      setTimeout(() => ['pointerdown', 'wheel', 'keydown'].forEach(t => addEventListener(t, skip, { passive: true })), 0);
    }
    function done() {
      ['pointerdown', 'wheel', 'keydown'].forEach(t => removeEventListener(t, skip));
      furn.removeEventListener('click', now, true); controls.removeEventListener('click', now, true);
      unfolding = false; finishUnfold = null;
      d.classList.remove('unfolding');
      finish();
    }
    btn.addEventListener('click', () => open(), { once: true });
    addEventListener('wheel', block, { passive: false });
    addEventListener('touchmove', block, { passive: false });
    addEventListener('keydown', keys);
    furn.addEventListener('click', now, true); controls.addEventListener('click', now, true);
    finishUnfold = now;
  }

  /* phones: a tap unfolds two panels, then it zooms in to the cover */
  function unfoldIntro(unfolded: Set<HTMLElement>, after: () => void) {
    const sheet = $('.sheet'), cv = face.cover.el, ab = face.about.el, wy = face.why.el;
    const rest = panels.slice(3);
    let top = 0;
    for (let el: HTMLElement | null = sheet; el; el = el.offsetParent as HTMLElement | null) top += el.offsetTop;
    const hc = cv.offsetHeight, ha = ab.offsetHeight, hw = wy.offsetHeight;
    const mid = (innerHeight - 56) / 2;
    // closed: large enough to read as an object, with room for the hint under it; open: three panels fit the screen
    const s0 = clamp(.36, .62, (innerHeight - 250) / hc), s = clamp(.3, .58, (innerHeight - 150) / (hc + ha + hw));
    const y0 = mid - 26 - top - hc * s0 / 2, y1 = mid - top - (hc + ha + hw) * s / 2;
    // the closed leaflet lies on the desk, so the sheet's paper and shadow step aside for the panels' own
    const lift = '0 1px 1px rgb(var(--sh) / .12), 0 26px 44px -22px rgb(var(--sh) / .5)';
    const crease = 'inset 0 1px 0 var(--crease), inset 0 2px 0 var(--paper-hi), ';
    sheet.style.background = 'none'; sheet.style.boxShadow = 'none';
    cv.style.boxShadow = lift; ab.style.boxShadow = crease + lift; wy.style.boxShadow = crease + lift;
    gsap.set(sheet, { transformOrigin: '50% 0%', transformPerspective: 1400, scale: s0, y: y0 });
    gsap.set([ab, wy], { transformOrigin: '50% 0%', transformPerspective: 1300, backfaceVisibility: 'hidden' });
    gsap.set(ab, { rotationX: -180 });
    gsap.set(wy, { rotationX: 180 });
    gsap.set([face.about.shade, face.why.shade], { opacity: .5 });
    gsap.set(rest, { autoAlpha: 0 });
    d.classList.remove('intro');
    hidePaths(coverMarks);
    unfolded.add(ab); unfolded.add(wy);

    // 1. it lands on the desk, then waits for the reader
    const land = gsap.timeline();
    land.fromTo(sheet, { y: y0 - 24, rotationX: 10, rotationZ: -4 }, { y: y0, rotationX: 0, rotationZ: 0, duration: .55, ease: 'power2.in' })
      .to(sheet, { rotationZ: .4, duration: .1, ease: 'power1.out' })
      .to(sheet, { rotationZ: 0, duration: .25, ease: 'expo.out' });

    // 2. opening it: pull back, About swings down from behind, Why from in front, then zoom in
    waitToOpen(top + y0 + hc * s0 + 14, land, () => gsap.timeline()
      .to(sheet, { scale: s, y: y1, duration: .75, ease: 'power2.inOut' }, 0)
      .to(ab, { rotationX: 0, duration: .5, ease: 'paper' }, .2)
      .to(face.about.shade, { opacity: 0, duration: .5, ease: 'power1.out' }, .2)
      .to(wy, { rotationX: 0, duration: .5, ease: 'paper' }, .72)
      .to(face.why.shade, { opacity: 0, duration: .5, ease: 'power1.out' }, .72)
      .to(sheet, { scale: 1, y: 0, duration: .7, ease: 'power3.inOut' }, 1.4)
      .to(rest, { autoAlpha: 1, duration: .3 }, 1.75), () => {
      sheet.style.background = sheet.style.boxShadow = cv.style.boxShadow = ab.style.boxShadow = wy.style.boxShadow = '';
      gsap.set([sheet, ab, wy], { clearProps: 'transform,transformOrigin,transformPerspective,backfaceVisibility' });
      gsap.set([face.about.shade, face.why.shade], { clearProps: 'opacity' });
      gsap.set(rest, { clearProps: 'opacity,visibility' });
      if (scrollY) scrollTo(0, 0);
      drawPaths(coverMarks, .05, .7);
      setFolio(PANEL_FOLIO[currentPanel().id]);
      after();
      showScrollCue();
    });
  }

  /* tablets: the closed cover lands alone; opening it takes the reader down to the first spread, whose right page swings open from the crease */
  function openIntro(unfolded: Set<HTMLElement>, after: () => void, pageTop: (el: HTMLElement) => number) {
    const cv = face.cover.el, ab = face.about.el, wy = face.why.el;
    const rest = panels.slice(1);
    const hintY = Math.min(innerHeight - 40, pageTop(cv) + cv.offsetHeight - scrollY + 14);
    gsap.set(rest, { autoAlpha: 0 });
    gsap.set(wy, { transformOrigin: '0% 50%', transformPerspective: 1600, rotationY: -70 });
    gsap.set(face.why.shade, { opacity: .2 });
    d.classList.remove('intro');
    hidePaths(coverMarks);
    unfolded.add(ab); unfolded.add(wy);

    const land = gsap.timeline();
    land.fromTo(cv, { y: -24, rotationX: 10, rotationZ: -4, transformPerspective: 1400, transformOrigin: '50% 100%' }, { y: 0, rotationX: 0, rotationZ: 0, duration: .55, ease: 'power2.in' })
      .to(cv, { rotationZ: .4, duration: .1, ease: 'power1.out' })
      .to(cv, { rotationZ: 0, duration: .25, ease: 'expo.out' })
      .fromTo(coverMarks, { drawSVG: '0%' }, { drawSVG: '100%', duration: .7, ease: 'power2.inOut', stagger: .15 }, .6);

    waitToOpen(hintY, land, now => {
      if (!now) scrollTo({ top: pageTop(ab) - 24, behavior: 'smooth' });
      return gsap.timeline()
        .to(rest, { autoAlpha: 1, duration: .3 }, 0)
        .to(wy, { rotationY: 0, duration: .6, ease: 'paper' }, .45)
        .to(face.why.shade, { opacity: 0, duration: .6, ease: 'power1.out' }, .45);
    }, () => {
      gsap.set([cv, wy], { clearProps: 'transform,transformOrigin,transformPerspective' });
      gsap.set(face.why.shade, { clearProps: 'opacity' });
      gsap.set(rest, { clearProps: 'opacity,visibility' });
      setFolio(PANEL_FOLIO[currentPanel().id]);
      after();
    });
  }

  /* ---------- build: the strip (phones, tablets, short laptops) ---------- */
  function buildStrip(opts: ModeOpts) {
    const first = opts.first;
    let seen = false;
    try { seen = sessionStorage.getItem('leaflet-intro') === '1'; sessionStorage.setItem('leaflet-intro', '1'); } catch { /* ignore */ }
    const wasIntro = d.classList.contains('intro');
    /* where a panel sits in the page, ignoring transforms (the intro scales the whole sheet) */
    const pageTop = (el: HTMLElement | null) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent as HTMLElement | null; } return y; };
    // during the intro the sheet is scaled, so the panels' scroll triggers are armed once it has landed
    const unfolded = new Set<HTMLElement>(), arm: (() => void)[] = [];
    const armAll = () => { arm.forEach(f => f()); ScrollTrigger.refresh(); };
    const playIntro = first && wasIntro && !seen, spread = mmSpread.matches;
    if (playIntro) { if (spread) openIntro(unfolded, armAll, pageTop); else unfoldIntro(unfolded, armAll); }
    else {
      d.classList.remove('intro');
      if (first) { hidePaths(coverMarks); drawPaths(coverMarks, .2, .6); }
    }
    panels.forEach((p, i) => {
      if (i === 0) return;
      if (pageTop(p) - scrollY < innerHeight * .9) { if (p.id === 'contact') replySet(); return; }
      const paths = $$<SVGPathElement>('.pencil .pm', p), word = p.querySelector<HTMLElement>('.op-word'), shade = $('.shade', p);
      const valley = i % 2 === 1;
      // a one-shot unfold (under half a second), then the panel lies flat and still;
      // panels the intro has just unfolded only reveal their word and pencil marks.
      // In a tablet spread the left page already lies flat and the right one swings open from the crease.
      const right = spread && RIGHT_PAGES.has(p.id);
      const fold = !unfolded.has(p) && (!spread || right || p.id === 'contact');
      if (fold && right) {
        gsap.set(p, { transformPerspective: 1600, transformOrigin: '0% 50%', rotationY: -70 });
        gsap.set(shade, { opacity: .2 });
      } else if (fold) {
        gsap.set(p, { transformPerspective: 1300, transformOrigin: '50% 0%', rotationX: valley ? -34 : 16 });
        gsap.set(shade, { opacity: valley ? .16 : .08 });
      }
      if (word) gsap.set(word, { clipPath: 'inset(-12% 100% -12% 0%)' });
      hidePaths(paths);
      if (p.id === 'contact') replyPrep();
      arm.push(() => ScrollTrigger.create({
        trigger: p, start: 'top 86%', once: true,
        onEnter: self => {
          const tl = gsap.timeline();
          if (fold) {
            const dur = right ? .55 : .45;
            tl.to(p, { rotationX: 0, rotationY: 0, duration: dur, ease: 'paper' }, 0)
              .to(shade, { opacity: 0, duration: dur, ease: 'power1.out' }, 0)
              .set(p, { clearProps: 'transform' }, dur + .01);
          }
          if (word) tl.to(word, { clipPath: 'inset(-12% 0% -12% 0%)', duration: .6, ease: 'power2.inOut' }, .12);
          tl.add(() => {
            if (word) drawPaths($$<SVGPathElement>('.pm', word), 0, .8);
            drawPaths(paths.filter(x => !word || !word.contains(x)), word ? .35 : 0, .7);
            if (p.id === 'contact') replyLanding();
          }, fold ? .45 : .1);
          if (Math.abs(self.getVelocity()) > 3500) tl.progress(1);
        },
      }));
    });
    if (!playIntro) arm.forEach(f => f());
    if (window.__leafHash) { const el = document.getElementById(window.__leafHash.slice(1)); window.__leafHash = null; if (el) scrollToEl(el, true); }
    if (opts.keep) goTo(opts.keep, { instant: true, id: opts.keepId });
  }

  function buildCalm(opts: ModeOpts) {
    d.classList.remove('intro');
    replySet();
    if (opts.keep) goTo(opts.keep, { instant: true, id: opts.keepId });
  }

  /* a jump of more than a screen and a half in one go (Home, End, a link) lands at once instead of flipping through */
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY, dy = Math.abs(y - lastY); lastY = y;
    if (S.mode !== 'leaf' || !st || scrollTw || dy < innerHeight * 1.5) return;
    ScrollTrigger.update();
    const tw = st.getTween && st.getTween();
    if (tw) tw.progress(1);
  }, { passive: true });

  /* strip and calm: keep the folio honest while reading down the page */
  let folioRaf = 0;
  addEventListener('scroll', () => {
    if (S.mode === 'leaf' || folioRaf) return;
    folioRaf = requestAnimationFrame(() => { folioRaf = 0; setFolio(PANEL_FOLIO[currentPanel().id]); });
  }, { passive: true });

  /* ---------- mode switching ---------- */
  function wantMode(): 'leaf' | 'strip' | 'calm' {
    if (d.classList.contains('motion-off') || mmReduce.matches) return 'calm';
    if (mmBig.matches && S.fitFail !== geoKey()) return 'leaf';
    return 'strip';
  }
  /* where the reader is now, so a mode change can put them back */
  function keepOpts(): ModeOpts {
    const keep = currentLabel();
    return { keep, keepId: S.mode === 'leaf' ? LABEL_ID[keep] : currentPanel().id };
  }
  function resetAll() {
    if (finishUnfold) finishUnfold(); // first, so the scroll triggers it arms are cleared just below
    stopLift(); liftNext = false;
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (master) { master.kill(); master = null; }
    st = null;
    if (introTl) { const it = introTl; introTl = null; it.progress(1); it.kill(); }
    killScroll();
    LAND.forEach(unland);
    const els: Element[] = [...panels, ...FACES.map(f => f.shade), ...FACES.filter(f => f.cast).map(f => f.cast as HTMLElement),
      camera, edge, dSharp, dSoft, perfLine, scissors, quoteSlip, wrap, hint, openTab, ...tags, ...cropPaths, ...$$('.pm'), ...$$('.op-word')];
    gsap.killTweensOf(els);
    gsap.killTweensOf([fold, cam, intro, peek, bend]);
    gsap.set(els, { clearProps: 'all' });
    [dSharp, dSoft].forEach(el => { const s = el as ShadowEl; s.__tf = s.__w = s.__o = null; });
    Object.assign(intro, { dy: 0, s: 1, rx: 0, rz: 0, dx: 0, puff: 0, lift: 0 });
    peek.v = 0; peekOn = false; introDone = true;
    for (const k in drawn) delete drawn[k];
    drag = null; d.classList.remove('page-hold', 'page-drag'); bend.h = bend.v = 0; stopGlide();
  }
  function applyMode(opts?: ModeOpts) {
    const o = opts || {};
    resetAll();
    d.classList.remove('at-poster');
    let m = wantMode();
    d.classList.remove('strip', 'calm');
    if (m === 'leaf') {
      d.classList.add('leaf-3d');
      geometry();
      if (fontsReady && !fitCheck()) { S.fitFail = geoKey(); m = 'strip'; }
    }
    if (m !== 'leaf') { d.classList.remove('leaf-3d'); d.style.removeProperty('--ts'); }
    S.mode = m;
    d.classList.toggle('strip', m === 'strip');
    d.classList.toggle('calm', m === 'calm');
    folioCur = null;
    if (m === 'leaf') buildLeaf(o); else if (m === 'strip') buildStrip(o); else buildCalm(o);
    if (m !== 'leaf') setFolio(PANEL_FOLIO[currentPanel().id]);
    ScrollTrigger.refresh();
  }

  let rT = 0, lastW = innerWidth, lastH = innerHeight, lastSpread = mmSpread.matches;
  addEventListener('resize', () => {
    clearTimeout(rT);
    rT = window.setTimeout(() => {
      const wasW = lastW, wasH = lastH, wasSpread = lastSpread; lastW = innerWidth; lastH = innerHeight; lastSpread = mmSpread.matches;
      const want = wantMode();
      // the strip stays the strip, unless a tablet turned between spreads and the single column
      if (want === S.mode && want !== 'leaf' && wasSpread === lastSpread) { if (wasW !== innerWidth) ScrollTrigger.refresh(); return; }
      if (want === 'leaf' && S.mode === 'leaf' && wasW === innerWidth && wasH === innerHeight) return;
      applyMode(keepOpts());
      render();
    }, 250);
  });
  const onPref = () => { motionLabel(); applyMode(keepOpts()); };
  if (mmReduce.addEventListener) mmReduce.addEventListener('change', onPref);

  /* ---------- desk furniture (the tags pull and swing on their own: scripts/tags.ts) ---------- */
  const motionBtn = $('.motion');
  function motionLabel() {
    const on = !d.classList.contains('motion-off') && !mmReduce.matches;
    $('b', motionBtn).textContent = on ? CFG.ui.motionOn : CFG.ui.motionOff;
    motionBtn.setAttribute('aria-pressed', String(on));
  }
  motionBtn.addEventListener('click', () => {
    const keep = keepOpts();
    const off = !d.classList.contains('motion-off');
    if (mmReduce.matches && !off) { live.textContent = CFG.ui.motionReduced; }
    d.classList.toggle('motion-off', off);
    try { localStorage.setItem('leaflet-motion', off ? 'off' : 'on'); } catch { /* ignore */ }
    motionLabel();
    applyMode(keep);
    motionBtn.focus({ preventScroll: true });
  });
  motionLabel();

  const marksBtn = $('.marks-toggle');
  marksBtn.addEventListener('click', () => {
    const off = d.classList.toggle('no-marks');
    marksBtn.setAttribute('aria-pressed', String(!off));
    marksBtn.textContent = off ? CFG.ui.marksOff : CFG.ui.marksOn;
  });

  /* Contents: a folded card that opens up from the folio */
  const details = $<HTMLDetailsElement>('.contents'), summary = $('summary', details), card = $('.contents__card', details);
  /* on phones the card is tall and fixed above the bar: it slides out of the bar instead of folding, which would swing it at the reader */
  const mmBar = matchMedia('(max-width: 1099px)');
  function openContents() {
    details.open = true;
    if (S.mode === 'calm') gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: .18, clearProps: 'opacity' });
    else if (mmBar.matches) gsap.fromTo(card, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: 'power2.out', clearProps: 'transform,opacity' });
    else gsap.fromTo(card, { rotationX: 80, y: 12, opacity: 0, transformPerspective: 900 }, { rotationX: 0, y: 0, opacity: 1, duration: .55, ease: 'paper', clearProps: 'transform,opacity' });
  }
  function closeContents(instant?: boolean) {
    if (!details.open) return;
    gsap.killTweensOf(card);
    if (instant || S.mode === 'calm') { details.open = false; gsap.set(card, { clearProps: 'all' }); return; }
    if (mmBar.matches) { gsap.to(card, { y: 16, opacity: 0, duration: .2, ease: 'power2.in', onComplete: () => { details.open = false; gsap.set(card, { clearProps: 'all' }); } }); return; }
    gsap.to(card, { rotationX: 80, y: 12, opacity: 0, transformPerspective: 900, duration: .32, ease: 'power2.in', onComplete: () => { details.open = false; gsap.set(card, { clearProps: 'all' }); } });
  }
  summary.addEventListener('click', e => { e.preventDefault(); if (details.open) closeContents(); else openContents(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && details.open) { closeContents(); summary.focus(); } });
  document.addEventListener('pointerdown', e => { if (details.open && (!details.contains(e.target as Node) || e.target === details)) closeContents(); });

  /* EN / FR are real links between / and /fr/. They carry the current panel in the hash so the reader lands where they were. */
  $$<HTMLAnchorElement>('[data-lang-link]').forEach(a => {
    const base = a.getAttribute('href') || '';
    a.addEventListener('click', () => {
      if (a.getAttribute('aria-current') === 'true') return;
      const label = currentLabel();
      const id = S.mode === 'leaf' ? LABEL_ID[label] : currentPanel().id;
      a.setAttribute('href', id && id !== 'cover' ? base + '#' + id : base);
    });
  });

  /* ---------- Work: loose prints lift off the leaflet ---------- */
  const WORKS = CFG.works;
  const dlg = $<HTMLDialogElement>('.loose'), lWrap = $('.loose__wrap', dlg), lPrint = $('.loose__print', dlg), lCard = $('.loose__card', dlg);
  let lIdx = 0, lSrc: HTMLElement | null = null, lTl: gsap.core.Timeline | gsap.core.Tween | null = null;
  const lRead = $('#loose-read'), lReadA = $<HTMLAnchorElement>('#loose-read a'), lQuote = $('#loose-quote');
  const lImg = $<HTMLImageElement>('#loose-img'), lSlot = $('#loose-slot'), lStrip = $('#loose-strip'), lCap = $('#loose-cap');
  let lShot = 0;
  /* show screenshot k of the open project: fade in once decoded, mark its thumb, warm up the next one */
  function showShot(k: number, fade = true) {
    const shots = WORKS[lIdx].shots;
    if (!shots.length) return;
    lShot = (k + shots.length) % shots.length;
    const s = shots[lShot];
    lImg.hidden = false; lSlot.hidden = true;
    lImg.classList.toggle('shot--contain', s.fit === 'contain');
    lImg.width = s.w; lImg.height = s.h;
    const calm = S.mode === 'calm' || mmReduce.matches;
    if (fade && !calm) gsap.set(lImg, { opacity: 0 });
    lImg.src = s.full;
    if (fade && !calm) lImg.decode().catch(() => {}).finally(() => gsap.to(lImg, { opacity: 1, duration: .22, ease: 'ui' }));
    lCap.textContent = `${lShot + 1} / ${shots.length} · ${s.cap}`;
    $$<HTMLButtonElement>('.loose__thumb', lStrip).forEach((t, j) => t.setAttribute('aria-pressed', String(j === lShot)));
    const next = shots[(lShot + 1) % shots.length];
    if (next !== s) { const pre = new Image(); pre.src = next.full; }
  }
  function fillLoose(i: number) {
    const w = WORKS[i];
    lSlot.textContent = w.slot;
    $('#loose-meta').textContent = w.meta; $('#loose-h').textContent = w.name;
    $('#loose-text').textContent = w.text;
    $('#loose-stack').textContent = w.stack;
    lQuote.hidden = !w.quote;
    if (w.quote) { $('p', lQuote).textContent = w.quote.text; $('footer', lQuote).textContent = w.quote.by; }
    /* no case study yet: the link stays hidden instead of pointing nowhere */
    lRead.hidden = !w.url;
    if (w.url) { lReadA.href = w.url; lReadA.target = '_blank'; lReadA.rel = 'noopener'; }
    $('#loose-count').textContent = fill(CFG.dialog.count, { i: i + 1, n: WORKS.length });
    /* the strip of screenshots under the print */
    lStrip.textContent = '';
    lStrip.hidden = w.shots.length < 2;
    lPrint.classList.toggle('loose__print--more', w.shots.length > 1);
    w.shots.forEach((s, k) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'loose__thumb' + (s.fit === 'contain' ? ' loose__thumb--contain' : '');
      b.setAttribute('aria-label', fill(CFG.dialog.shotLabel, { i: k + 1, caption: s.cap }));
      b.setAttribute('aria-pressed', 'false');
      const im = document.createElement('img');
      im.src = s.thumb; im.alt = ''; im.decoding = 'async';
      b.append(im);
      b.addEventListener('click', () => showShot(k));
      lStrip.append(b);
    });
    lCap.hidden = !w.shots.length;
    if (w.shots.length) showShot(0, false);
    else {
      lImg.hidden = !w.image; lSlot.hidden = !!w.image; lImg.classList.remove('shot--contain');
      if (w.image) lImg.src = w.image; else lImg.removeAttribute('src');
    }
  }
  function openLoose(i: number, src: HTMLElement | null) {
    lIdx = i; lSrc = src; fillLoose(i);
    gsap.set([lPrint, lCard, lWrap, dlg], { clearProps: 'all' });
    dlg.showModal();
    $('.loose__close').focus({ preventScroll: true });
    const calm = S.mode === 'calm' || mmReduce.matches;
    if (calm) { lTl = gsap.fromTo(dlg, { opacity: 0 }, { opacity: 1, duration: .18 }); return; }
    if (innerWidth < 1100) { lTl = gsap.fromTo(lWrap, { yPercent: 100 }, { yPercent: 0, duration: .5, ease: 'expo.out' }); return; }
    const thumb = (src && src.classList.contains('print')) ? src : $(`.print--btn[data-work="${i}"]`);
    const a = thumb.getBoundingClientRect(), b = lPrint.getBoundingClientRect();
    const tl = gsap.timeline();
    lTl = tl;
    if (a.width > 2 && b.width > 2) tl.fromTo(lPrint, { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, rotation: -.6, transformOrigin: '0 0' }, { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: -.4, duration: .9, ease: 'expo.inOut' }, 0);
    tl.fromTo(lCard, { y: 40, opacity: 0, rotation: .6 }, { y: 0, opacity: 1, rotation: .6, duration: .5, ease: 'ui' }, a.width > 2 ? .35 : 0);
  }
  function closeLoose(instant?: boolean) {
    if (!dlg.open) return;
    const done = () => { if (!dlg.open) return; dlg.close(); gsap.set([lPrint, lCard, lWrap, dlg], { clearProps: 'all' }); if (lSrc && !instant) lSrc.focus({ preventScroll: true }); lTl = null; };
    if (!instant && lTl && S.mode !== 'calm') { lTl.eventCallback('onReverseComplete', done); lTl.timeScale(1.3).reverse(); gsap.delayedCall(1.2, done); }
    else done();
  }
  function switchLoose(dir: number) {
    lIdx = (lIdx + dir + WORKS.length) % WORKS.length;
    if (S.mode === 'calm') { fillLoose(lIdx); return; }
    gsap.timeline().to(lCard, { opacity: 0, x: -8 * dir, duration: .12, ease: 'power1.in' })
      .add(() => fillLoose(lIdx)).fromTo(lCard, { x: 8 * dir }, { opacity: 1, x: 0, duration: .2, ease: 'ui' });
  }
  $$('.print--btn').forEach(b => b.addEventListener('click', () => openLoose(+(b.dataset.work as string), b)));
  $('.loose__close').addEventListener('click', () => closeLoose());
  $('.loose__prev').addEventListener('click', () => switchLoose(-1));
  $('.loose__next').addEventListener('click', () => switchLoose(1));
  dlg.addEventListener('cancel', e => { e.preventDefault(); closeLoose(); });
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target === lWrap) closeLoose(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') switchLoose(-1); if (e.key === 'ArrowRight') switchLoose(1); });
  /* screenshots: the print itself steps to the next one; in the strip, Left/Right move between shots instead of projects */
  lPrint.addEventListener('click', () => { if (WORKS[lIdx].shots.length > 1) showShot(lShot + 1); });
  lStrip.addEventListener('keydown', e => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault(); e.stopPropagation();
    showShot(lShot + step);
    ($$<HTMLButtonElement>('.loose__thumb', lStrip)[lShot])?.focus();
  });

  /* ---------- reply slip ---------- */
  const copyBtn = $('.copy'), addr = $('.mail__addr'), ghost = $('.mail__ghost');
  copyBtn.addEventListener('click', async () => {
    const txt = (addr.textContent || '').trim();
    let ok = false;
    try { await navigator.clipboard.writeText(txt); ok = true; } catch { ok = false; }
    if (ok) {
      copyBtn.textContent = CFG.contact.copied; live.textContent = CFG.contact.copiedLive;
      if (S.mode !== 'calm') gsap.fromTo(ghost, { opacity: .6, x: 0, y: 0 }, { opacity: 0, x: 6, y: 4, duration: .6, ease: 'ui' });
    } else {
      const rg = document.createRange(); rg.selectNodeContents(addr);
      const sel = getSelection(); sel?.removeAllRanges(); sel?.addRange(rg);
      copyBtn.textContent = CFG.contact.selected; live.textContent = CFG.contact.selectedLive;
    }
    setTimeout(() => { copyBtn.textContent = CFG.contact.copy; }, 2000);
  });

  $$<HTMLInputElement>('.tick input').forEach(inp => inp.addEventListener('change', () => {
    if (inp.checked && S.mode !== 'calm') gsap.fromTo($$('path', inp.nextElementSibling as Element), { drawSVG: '0%' }, { drawSVG: '100%', duration: .25, stagger: .08, ease: 'power2.inOut' });
  }));

  const form = $<HTMLFormElement>('.slip-form'), sentEl = $('.sent'), coupon = $('.coupon'), postmark = $<HTMLElement>('.postmark'), sendBtn = $<HTMLButtonElement>('.btn--send');
  const statusEl = $('.send-status', form);
  const web3Key = (form.querySelector<HTMLInputElement>('input[name="access_key"]') || { value: '' }).value;
  form.noValidate = true;
  const sendLabel = sendBtn.textContent || '';

  function setStatus(msg: string, isErr: boolean) {
    statusEl.textContent = msg;
    statusEl.hidden = !msg;
    statusEl.classList.toggle('send-status--err', isErr);
    if (isErr && msg) statusEl.setAttribute('role', 'alert'); else statusEl.setAttribute('role', 'status');
  }
  function formValues() {
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value.trim();
    const needs = $$<HTMLInputElement>('input[name="need"]:checked', form).map(i => (i.parentElement?.textContent || i.value).trim());
    return { name: val('name'), email: val('email'), message: val('message'), needs };
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    let first: HTMLInputElement | null = null;
    $$<HTMLInputElement>('.fld input', form).forEach(inp => {
      const err = $('.fld__err', inp.parentElement as HTMLElement);
      let msg = '';
      if (inp.validity.valueMissing) msg = inp.name === 'name' ? CFG.contact.errName : CFG.contact.errEmail;
      else if (inp.validity.typeMismatch) msg = CFG.contact.errEmailBad;
      err.textContent = msg;
      if (msg) { inp.setAttribute('aria-invalid', 'true'); first = first || inp; } else inp.removeAttribute('aria-invalid');
    });
    form.classList.toggle('has-err', !!first);
    if (first) { (first as HTMLInputElement).focus(); return; }
    setStatus('', false);
    if (web3Key) sendWeb3(); else sendMailto();
  });

  /* with a Web3Forms key: send as JSON and show the slip as sent (or say what went wrong) */
  async function sendWeb3() {
    const v = formValues();
    sendBtn.setAttribute('aria-busy', 'true'); sendBtn.disabled = true; sendBtn.textContent = CFG.contact.sending;
    const hp = form.querySelector<HTMLInputElement>('input[name="botcheck"]');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3Key, subject: CFG.contact.subject, from_name: document.title.split('|')[0].trim(),
          name: v.name, email: v.email, message: v.message, need: v.needs.join(', '), botcheck: hp && hp.checked ? 'on' : '',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error('send failed');
      sent();
    } catch {
      sendBtn.removeAttribute('aria-busy'); sendBtn.disabled = false; sendBtn.textContent = sendLabel;
      setStatus(CFG.contact.errSend, true);
    }
  }
  /* without a key: open the visitor's email app with the message ready, and say so */
  function sendMailto() {
    const v = formValues();
    const lines = [v.message, '', v.needs.length ? CFG.contact.needs + (CFG.lang === 'fr' ? '\u202f: ' : ': ') + v.needs.join(', ') : '', '', v.name + ' <' + v.email + '>'].filter((l, i, a) => l !== '' || (i > 0 && a[i - 1] !== ''));
    const href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(CFG.contact.subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    setStatus(CFG.contact.mailtoStatus, false);
    live.textContent = CFG.contact.mailtoStatus;
    window.location.href = href;
  }

  function torn() {
    const pts: string[] = [];
    for (let i = 0; i <= 27; i++) { const r = Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1; pts.push((i / 27 * 100).toFixed(2) + '% ' + (2.5 + (r * 2 - 1) * 2.5).toFixed(1) + 'px'); }
    return 'polygon(' + pts.join(', ') + ', 100% 100%, 0% 100%)';
  }
  function sent() {
    sendBtn.removeAttribute('aria-busy'); sendBtn.disabled = false; sendBtn.textContent = sendLabel;
    form.hidden = true; sentEl.hidden = false; postmark.removeAttribute('hidden');
    const dt = new Date(), mo = CFG.contact.months[dt.getMonth()];
    $('.pm-date', postmark).textContent = dt.getDate() + ' ' + mo + ' ' + dt.getFullYear();
    coupon.classList.add('is-sent');
    coupon.style.clipPath = torn();
    live.textContent = CFG.contact.sentLive;
    $('.sent__h').focus({ preventScroll: true });
    if (S.mode === 'calm') { gsap.fromTo(postmark, { opacity: 0 }, { opacity: 1, duration: .18 }); return; }
    gsap.fromTo(coupon, { y: 0, rotation: 0 }, { y: 26, rotation: -2.2, transformOrigin: '0% 0%', duration: .55, ease: 'expo.out' });
    gsap.timeline({ delay: .3 })
      .fromTo(postmark, { opacity: 0, scale: 1.45, rotation: -16, transformOrigin: '50% 50%' }, { opacity: 1, duration: .06 }, 0)
      .to(postmark, { scale: 1, rotation: -9, duration: .2, ease: 'power4.in' }, 0)
      .to(postmark, { scale: 1.03, duration: .06, ease: 'power2.out' }, .2)
      .to(postmark, { scale: 1, duration: .06, ease: 'power2.out' }, .26);
  }

  /* small paper and pencil gestures */
  const linkDrawn = $('.link-drawn'), linkPath = $('.link-drawn .pm');
  ['mouseenter', 'focus'].forEach(ev => linkDrawn.addEventListener(ev, () => { if (S.mode !== 'calm') gsap.fromTo(linkPath, { drawSVG: '0%' }, { drawSVG: '100%', duration: .35, ease: 'power2.out', overwrite: true }); }));
  const pto = $('.pto'), ptoPath = $('.pto path');
  ['mouseenter', 'focus'].forEach(ev => pto.addEventListener(ev, () => {
    if (S.mode === 'calm') return;
    gsap.timeline({ overwrite: true } as gsap.TimelineVars).to(ptoPath, { drawSVG: '0%', duration: .25, ease: 'undraw' }).to(ptoPath, { drawSVG: '100%', duration: .5, ease: 'ui' });
  }));

  /* ---------- start ---------- */
  applyMode({ first: true });
  const ready = () => {
    if (fontsReady) return;
    fontsReady = true;
    if (S.mode === 'leaf' && !fitCheck()) { S.fitFail = geoKey(); applyMode(keepOpts()); }
    render();
    ScrollTrigger.refresh();
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else ready();
  setTimeout(ready, 2500);

  /* debug hook, development builds only */
  if (import.meta.env.DEV) {
    window.__leaf = {
      state: () => ({ mode: S.mode, t: master ? +master.time().toFixed(1) : null, label: currentLabel(), W: S.W, H: S.H, ts: getComputedStyle(d).getPropertyValue('--ts'), drawn: Object.keys(drawn) }),
      goTo,
      seek: (t: number) => { if (!master) return; if (st) st.disable(false); master.time(t); render(); },
    };
  }
}

const config = readConfig();
if (config) init(config);
