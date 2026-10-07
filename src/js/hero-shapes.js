// Shape block for two-column page heroes. Usage:
//   <div class="hero-shapes" data-shapes="flame"></div>
// Each composition is a picture made from the site's grid of circles and
// squares, rather than the random confetti used on other pages:
//   flame: tongues of fire rising from the floor (Wall of Flame)
//   build: stacks of blocks going up (Contact, "Let's Build.")
import '../css/hero-shapes.css';

const SIZE = 28;
const GAP = 14;
const PITCH = SIZE + GAP;
const RADIUS = 150;

// Seeded so the picture is the same on every load and does not reshuffle
// when the window is resized.
function seeded(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each returns { color, scale, circle } for a cell, or null to leave it empty.
// `up` is the row counted from the bottom.
const compositions = {
  flame(cols, rows, rand) {
    const p1 = rand() * 6.28;
    const p2 = rand() * 6.28;
    const heights = Array.from({ length: cols }, (_, c) => {
      const wave = Math.sin(c * 0.55 + p1) * 0.5 + Math.sin(c * 1.35 + p2) * 0.3;
      return rows * (0.52 + wave * 0.34) + (rand() - 0.5) * 1.6;
    });
    return (c, up) => {
      const t = up / Math.max(heights[c], 1);
      if (t >= 1) {
        // Embers above the flame.
        if (rand() > 0.1 || t > 1.9) return null;
        return { color: rand() > 0.5 ? '#ff7500' : '#e3261b', scale: 0.18, circle: true };
      }
      const heat = t + (rand() - 0.5) * 0.22;
      const color =
        heat < 0.22 ? '#ffc600' : heat < 0.5 ? '#ff7500' : heat < 0.8 ? '#e3261b' : '#3b1413';
      return { color, scale: 1.15 - t * 0.8 + (rand() - 0.5) * 0.15, circle: rand() > 0.12 };
    };
  },

  build(cols, rows, rand) {
    const palette = ['#1bb1a5', '#146068', '#f6b352', '#ff7500', '#bfff00', '#111111'];
    const p1 = rand() * 6.28;
    const p2 = rand() * 6.28;
    // A skyline: stacks rise and fall across the block instead of sitting flat.
    const heights = Array.from({ length: cols }, (_, c) => {
      const wave = Math.sin(c * 0.5 + p1) * 0.55 + Math.sin(c * 1.7 + p2) * 0.3;
      const h = Math.round(rows * (0.42 + wave * 0.36) + (rand() - 0.5) * 2);
      return Math.min(rows - 2, Math.max(1, h));
    });
    return (c, up) => {
      const color = palette[Math.floor(rand() * palette.length)];
      if (up < heights[c]) return { color, scale: 1, circle: false };
      // The piece being placed on top of each stack.
      if (up === heights[c]) return { color, scale: 0.7, circle: true };
      if (rand() > 0.06) return null;
      return { color: '#cccccc', scale: 0.2, circle: true };
    };
  },
};

function init(el) {
  const cellFor = compositions[el.dataset.shapes];
  if (!cellFor) return;
  el.setAttribute('aria-hidden', 'true');
  let items = [];

  function draw() {
    const box = el.parentElement.getBoundingClientRect();
    const cols = Math.max(4, Math.floor((box.width - 48 + GAP) / PITCH));
    // Extra room top and bottom so the picture does not touch the tiles below.
    const rows = Math.max(4, Math.floor((box.height - 110 + GAP) / PITCH));
    const rand = seeded(el.dataset.shapes.length * 7919);
    const cell = cellFor(cols, rows, rand);
    el.style.gridTemplateColumns = `repeat(${cols}, ${SIZE}px)`;
    el.textContent = '';
    items = [];
    // Column by column so the seeded sequence does not depend on row count
    // order; placed with explicit grid lines.
    for (let c = 0; c < cols; c++) {
      for (let up = 0; up < rows; up++) {
        const spec = cell(c, up);
        if (!spec) continue;
        const i = document.createElement('i');
        if (spec.circle) i.className = 'circle';
        i.style.background = spec.color;
        i.style.gridColumn = c + 1;
        i.style.gridRow = rows - up;
        i.style.setProperty('--s', spec.scale.toFixed(2));
        el.appendChild(i);
        items.push({ el: i, base: spec.scale });
      }
    }
    // An empty last row or column would collapse; pin the full size.
    el.style.gridTemplateRows = `repeat(${rows}, ${SIZE}px)`;
  }

  draw();
  let resizeTimer;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    // Phones fire resize when the address bar hides; only width matters here.
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 150);
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Shapes swell toward the pointer, as on the other page heroes.
  let frame = 0;
  function react(x, y) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      for (const item of items) {
        const r = item.el.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y);
        const force = d < RADIUS ? (RADIUS - d) / RADIUS : 0;
        const next = (item.base + force * 0.9).toFixed(2);
        if (item.last !== next) {
          item.el.style.setProperty('--s', next);
          item.last = next;
        }
      }
    });
  }
  const block = el.parentElement;
  block.addEventListener('pointermove', (e) => react(e.clientX, e.clientY));
  block.addEventListener('pointerleave', () => react(-9999, -9999));
}

document.querySelectorAll('.hero-shapes').forEach(init);
