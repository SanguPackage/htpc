// Scroll-scrubbed treasure-map voyage for the #course homepage block.
// Sets --p (0..1 scroll progress) and --scale (fits the fixed 1000px "leg" to the
// column) on #course; the SVG reveal masks draw the course + red wrong-way fork as
// the ship advances, and the ship banks toward its horizontal travel.
(function () {
  const course = document.getElementById('course');
  if (!course) return;
  const leg = course.querySelector('.leg');
  const sea = course.querySelector('.chart-sea');
  const ship = course.querySelector('.ship');
  const mask = document.getElementById('maskPath');
  const maskDead = document.getElementById('maskDead');
  if (!leg || !sea || !ship || !mask || !maskDead) return;

  const plen = mask.getTotalLength();
  // red wrong-way fork draws on across this scroll-progress range (junction ≈ .19)
  const DEAD_FROM = 0.19, DEAD_TO = 0.34;
  // stop drawing the course this far (path fraction) behind the ship, so no dot
  // shows through the ship's open line-art — the ship always leads the trail
  const SHIP_GAP = 0.015;

  function setScale() {
    const s = Math.max(0.5, Math.min(1, sea.clientWidth / 1000));
    course.style.setProperty('--scale', s.toFixed(4));
  }
  function frame() {
    const r = leg.getBoundingClientRect();
    let p = (innerHeight * 0.45 - r.top) / (r.height * 0.82);
    p = Math.max(0, Math.min(1, p));
    course.style.setProperty('--p', p.toFixed(4));
    mask.style.strokeDashoffset = (1 - Math.max(0, p - SHIP_GAP)).toFixed(4);
    const dp = Math.max(0, Math.min(1, (p - DEAD_FROM) / (DEAD_TO - DEAD_FROM)));
    maskDead.style.strokeDashoffset = (1 - dp).toFixed(4);
    // bank toward horizontal travel, mast always up — turns through bends but
    // never flips (tilt→0 wherever the course runs vertical)
    const d = p * plen;
    const a = mask.getPointAtLength(Math.max(0, d - 6));
    const b = mask.getPointAtLength(Math.min(plen, d + 6));
    const dx = b.x - a.x, dy = b.y - a.y, h = Math.hypot(dx, dy) || 1;
    ship.style.transform = 'rotate(' + ((dx / h) * 25).toFixed(2) + 'deg)';
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { frame(); ticking = false; }); }
  }, { passive: true });
  addEventListener('resize', () => { setScale(); frame(); });
  setScale(); frame();
})();
