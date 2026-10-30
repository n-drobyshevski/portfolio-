/* The shop tags on strings (Work, Prices): pull one down like a cord to open its page.
   The string stretches under the hand and the tag swings with it; pulled far enough, it opens its page on release.
   Let go, and the string springs back up and the tag sways to rest. A tap (or Enter) gives it a quick tug,
   and a passing mouse sets it swinging a little. Calm mode keeps the pull but drops the springs. */

const d = document.documentElement;
const calm = () => d.classList.contains('calm');
const OPEN = 48; // px of pull on the hand that opens the page
const DEG = 180 / Math.PI;
const clamp = (a: number, b: number, v: number) => Math.min(b, Math.max(a, v));

interface Spring { x: number; v: number }

function cord(a: HTMLAnchorElement) {
  const pull: Spring = { x: 0, v: 0 }, swing: Spring = { x: 0, v: 0 };
  let raf = 0, last = 0, swallow = false, sending = false;
  let held: { id: number; x0: number; y0: number; moved: boolean; t: number } | null = null;

  const paint = () => {
    a.style.setProperty('--pull', pull.x.toFixed(2) + 'px');
    a.style.setProperty('--swing', swing.x.toFixed(3) + 'deg');
  };
  const rest = () => {
    pull.x = pull.v = swing.x = swing.v = 0;
    a.style.removeProperty('--pull'); a.style.removeProperty('--swing');
  };
  // a stiff, lightly damped string, and a slower pendulum under it
  const step = (now: number) => {
    const dt = Math.min(.032, (now - last) / 1000 || .016); last = now;
    pull.v += (-320 * pull.x - 16 * pull.v) * dt; pull.x += pull.v * dt;
    swing.v += (-90 * swing.x - 5 * swing.v) * dt; swing.x += swing.v * dt;
    if (Math.abs(pull.x) + Math.abs(swing.x) + (Math.abs(pull.v) + Math.abs(swing.v)) / 30 < .05) { raf = 0; rest(); return; }
    paint();
    raf = requestAnimationFrame(step);
  };
  const run = () => {
    if (calm()) { cancelAnimationFrame(raf); raf = 0; rest(); return; }
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
  };
  const tug = () => { if (calm()) return; pull.v += 700; swing.v += (Math.random() < .5 ? -1 : 1) * 40; run(); };

  a.draggable = false;
  a.addEventListener('dragstart', e => e.preventDefault());
  a.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault(); // no text selection, no focus ring from a mouse
    try { a.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    cancelAnimationFrame(raf); raf = 0;
    held = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, t: e.timeStamp };
    a.classList.add('tag--held');
  });
  a.addEventListener('pointermove', e => {
    if (!held || e.pointerId !== held.id) return;
    const dx = e.clientX - held.x0, dy = e.clientY - held.y0;
    if (!held.moved && Math.hypot(dx, dy) < 6) return;
    held.moved = true;
    const dt = Math.max(.008, (e.timeStamp - held.t) / 1000); held.t = e.timeStamp;
    const px = pull.x, sx = swing.x;
    // the string gives more slowly the further it is pulled, and hardly at all upwards
    pull.x = dy > 0 ? 120 * (1 - 1 / (1 + dy / 120)) : -8 * (1 - 1 / (1 - dy / 40));
    const len = (parseFloat(getComputedStyle(a).getPropertyValue('--str')) || 46) + pull.x + 46;
    swing.x = clamp(-28, 28, Math.atan2(dx, len) * DEG * .7);
    pull.v = (pull.x - px) / dt; swing.v = (swing.x - sx) / dt;
    a.classList.toggle('tag--ready', dy >= OPEN);
    paint();
  });
  const end = (e: PointerEvent) => {
    if (!held || e.pointerId !== held.id) return;
    const h = held; held = null;
    const ready = a.classList.contains('tag--ready') && e.type === 'pointerup';
    a.classList.remove('tag--held', 'tag--ready');
    if (!h.moved) return; // a plain tap: its click tugs and opens the page
    // after a pull the browser's own click is not the one that counts
    swallow = true; setTimeout(() => { swallow = false; }, 0);
    run(); // spring back from where the hand let go, at the hand's speed
    if (ready) { sending = true; a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, view: window })); sending = false; }
  };
  a.addEventListener('pointerup', end);
  a.addEventListener('pointercancel', end);
  a.addEventListener('click', e => {
    if (swallow && e.isTrusted) { e.preventDefault(); e.stopPropagation(); return; }
    if (!sending) tug(); // a tap or Enter
  });
  a.addEventListener('mouseenter', () => {
    if (held || raf || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    swing.v += (Math.random() < .5 ? -1 : 1) * 26; run();
  });
}

document.querySelectorAll<HTMLAnchorElement>('.tag').forEach(cord);
