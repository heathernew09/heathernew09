// Design x Derby hero: a roller derby jam drawn with the site's circles and
// squares. Two teams of five skate counter-clockwise. Each has three blockers,
// a pivot (stripe) and a jammer (star). A jammer scores one point for every
// opposing blocker passed, but not on the first trip through the pack.
// Jammers can be dragged, or moved with the arrow keys.
import '../css/derby-jam.css';

const NS = 'http://www.w3.org/2000/svg';

// Track geometry, in SVG units. A stadium: two straights joined by half circles.
const STRAIGHT = 260;
const MID_R = 120; // radius of the middle of the lane on the curves
const LANE = 70; // lane width
const LAP = 2 * STRAIGHT + 2 * Math.PI * MID_R;
const EDGE = LANE / 2 - 13; // how far a skater may drift from the lane's middle

const PACK_SPEED = 70; // units per second
const SPRINT = 128;
const JAM_SECONDS = 120; // a jam lasts up to two minutes

const TEAMS = [
  { name: 'Orange', color: '#f66c0f', square: false },
  { name: 'Teal', color: '#247b82', square: true },
];

// Where a skater at distance `p` along the lap, `lane` off its middle, stands.
// Distance 0 is the right end of the top straight; travel is counter-clockwise.
function place(p, lane) {
  const s = ((p % LAP) + LAP) % LAP;
  const r = MID_R + lane;
  const half = STRAIGHT / 2;
  const curve = Math.PI * MID_R;
  if (s < STRAIGHT) return [half - s, -r];
  if (s < STRAIGHT + curve) {
    const a = (s - STRAIGHT) / MID_R;
    return [-half - r * Math.sin(a), -r * Math.cos(a)];
  }
  if (s < 2 * STRAIGHT + curve) return [-half + (s - STRAIGHT - curve), r];
  const a = (s - 2 * STRAIGHT - curve) / MID_R;
  return [half + r * Math.sin(a), r * Math.cos(a)];
}

// The reverse: the lap distance and lane for a point on or near the track.
function locate(x, y) {
  const half = STRAIGHT / 2;
  const curve = Math.PI * MID_R;
  if (x < -half) {
    const a = Math.atan2(-(x + half), -y);
    return [STRAIGHT + (a < 0 ? a + 2 * Math.PI : a) * MID_R, Math.hypot(x + half, y) - MID_R];
  }
  if (x > half) {
    const a = Math.atan2(x - half, y);
    return [
      2 * STRAIGHT + curve + (a < 0 ? a + 2 * Math.PI : a) * MID_R,
      Math.hypot(x - half, y) - MID_R,
    ];
  }
  return y < 0 ? [half - x, -y - MID_R] : [STRAIGHT + curve + x + half, y - MID_R];
}

// Shortest signed distance from a to b around the lap.
function ahead(a, b) {
  const d = (((b - a) % LAP) + LAP) % LAP;
  return d > LAP / 2 ? d - LAP : d;
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function svg(tag, attrs, parent) {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(el);
  return el;
}

function stadium(r) {
  const h = STRAIGHT / 2;
  return `M${h} ${-r}H${-h}A${r} ${r} 0 0 0 ${-h} ${r}H${h}A${r} ${r} 0 0 0 ${h} ${-r}Z`;
}

function star(r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.42 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i ? 'L' : 'M'}${(rad * Math.cos(a)).toFixed(1)} ${(rad * Math.sin(a)).toFixed(1)}`;
  }
  return d + 'Z';
}

function drawSkater(parent, team, role) {
  const size = role === 'jammer' ? 12 : 9.5;
  const g = svg('g', { class: role }, parent);
  if (role === 'jammer') svg('circle', { class: 'halo', r: 22 }, g);
  if (team.square) {
    svg(
      'rect',
      {
        class: 'skater-body',
        x: -size,
        y: -size,
        width: size * 2,
        height: size * 2,
        fill: team.color,
      },
      g
    );
  } else {
    svg('circle', { class: 'skater-body', r: size + 1, fill: team.color }, g);
  }
  // Helmet covers: a star for the jammer, a stripe for the pivot.
  if (role === 'jammer') svg('path', { class: 'mark', d: star(8) }, g);
  if (role === 'pivot')
    svg('rect', { class: 'mark', x: -size + 1, y: -2.5, width: size * 2 - 2, height: 5 }, g);
  return g;
}

function init(root) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const art = svg('svg', {
    viewBox: '0 0 640 400',
    role: 'group',
    'aria-label':
      'Roller derby jam. Two jammers, marked with stars, skate laps through a pack of eight blockers.',
  });
  // Tilted a little, the way a track is usually drawn.
  const track = svg('g', { transform: 'translate(320 200) rotate(-7)' }, art);
  svg('path', { class: 'track-line', d: stadium(MID_R + LANE / 2) }, track);
  svg('path', { class: 'track-line', d: stadium(MID_R - LANE / 2) }, track);
  // Jammer line (behind) and pivot line (ahead) on the top straight.
  for (const p of [50, 150]) {
    const x = STRAIGHT / 2 - p;
    svg(
      'line',
      { class: 'start-line', x1: x, x2: x, y1: -MID_R - LANE / 2, y2: -MID_R + LANE / 2 },
      track
    );
  }

  // Scoreboard in the infield.
  const board = svg('g', {}, track);
  const scoreText = TEAMS.map((team, i) => {
    const x = i ? 38 : -92;
    if (team.square)
      svg(
        'rect',
        {
          x: x - 9,
          y: -27,
          width: 18,
          height: 18,
          fill: team.color,
          stroke: '#111',
          'stroke-width': 2,
        },
        board
      );
    else
      svg(
        'circle',
        { cx: x, cy: -18, r: 10, fill: team.color, stroke: '#111', 'stroke-width': 2 },
        board
      );
    const t = svg('text', { class: 'score', x: x + 20, y: -2 }, board);
    t.textContent = '0';
    return t;
  });
  const clock = svg('text', { class: 'clock', x: 0, y: 34, 'text-anchor': 'middle' }, board);

  // The pack: four per team between the lines, pivots at the front.
  const slots = [
    [-42, -14],
    [-36, 12],
    [-16, -4],
    [-10, 20],
    [10, -18],
    [16, 6],
    [36, -8],
    [42, 14],
  ];
  const skaters = [];
  TEAMS.forEach((team, t) => {
    for (let i = 0; i < 4; i++) {
      const n = i * 2 + ((i + t) % 2);
      const role = i === 3 ? 'pivot' : 'blocker';
      skaters.push({
        team: t,
        role,
        slot: slots[n],
        el: drawSkater(track, team, role),
        phase: n * 1.7,
        shove: 0,
        shoveDir: 0,
      });
    }
  });
  const blockers = skaters.slice();
  const jammers = TEAMS.map((team, t) => {
    const el = drawSkater(track, team, 'jammer');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', `${team.name} jammer. Arrow keys move along the track.`);
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');
    const j = { team: t, role: 'jammer', el, startLane: t ? 14 : -14, pace: t ? 0.94 : 1 };
    skaters.push(j);
    return j;
  });
  root.appendChild(art);

  const bar = document.createElement('div');
  bar.className = 'derby-jam__bar';
  const note = document.createElement('p');
  note.textContent =
    'Stars are jammers. Drag one through the pack: after the first pass, every opposing blocker passed scores a point.';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  bar.append(note, toggle);
  root.appendChild(bar);

  let packP, timeLeft, over, clockShown;
  let running = !reduced;
  let called = false; // the jam was called off with the End jam button
  let onScreen = true;
  let tabShown = true;
  let last = 0;
  let t = 0;

  function lineUp() {
    packP = 100;
    timeLeft = JAM_SECONDS;
    over = 0;
    for (const b of blockers) {
      b.p = packP + b.slot[0];
      b.lane = b.slot[1];
      b.shove = 0;
    }
    for (const j of jammers) {
      j.p = 32;
      j.lane = j.startLane;
      j.v = PACK_SPEED;
      j.stuck = 0;
      j.free = 0;
      j.held = false;
      j.passes = [0, 0, 0, 0];
      j.points = 0;
    }
  }

  function step(dt) {
    t += dt;
    packP += PACK_SPEED * dt;
    timeLeft -= dt;

    for (const b of blockers) {
      b.p = packP + b.slot[0] + 7 * Math.sin(t * 0.9 + b.phase);
      let want = b.slot[1] + 6 * Math.sin(t * 0.6 + b.phase * 2);
      // Blockers slide across to get in front of the other team's jammer.
      const j = jammers[1 - b.team];
      const gap = ahead(j.p, b.p);
      if (gap > 0 && gap < 95) want = want * 0.3 + j.lane * 0.7;
      if (b.shove > 0) {
        b.shove -= dt;
        want += b.shoveDir * 24;
      }
      b.lane += (clamp(want, -EDGE, EDGE) - b.lane) * Math.min(1, dt * 3);
    }

    for (const j of jammers) {
      if (j.held) continue;
      j.free -= dt;
      // Who is in the way: the nearest opposing blocker just ahead, in my lane.
      let wall = null;
      let wallGap = 46;
      if (j.free <= 0) {
        for (const b of blockers) {
          if (b.team === j.team) continue;
          const gap = ahead(j.p, b.p);
          if (gap > 2 && gap < wallGap && Math.abs(b.lane - j.lane) < 21) {
            wall = b;
            wallGap = gap;
          }
        }
      }
      let speed = SPRINT * j.pace;
      if (wall) {
        speed = PACK_SPEED * 0.96;
        j.stuck += dt;
        // Look for the gap on whichever side has more room.
        const side = wall.lane > j.lane ? -1 : 1;
        j.lane = clamp(j.lane + side * 55 * dt, -EDGE, EDGE);
        if (j.stuck > 1.1 + j.team * 0.5) {
          // Push through.
          j.free = 0.9;
          j.stuck = 0;
          wall.shove = 0.8;
          wall.shoveDir = wall.lane > j.lane ? 1 : -1;
        }
      } else {
        j.stuck = Math.max(0, j.stuck - dt);
        j.lane += (j.startLane * 0.6 - j.lane) * Math.min(1, dt * 0.8);
      }
      j.v += (speed - j.v) * Math.min(1, dt * 4);
      j.p += j.v * dt;
    }

    // Keep skaters from standing on top of each other. A jammer who is
    // pushing through, or being dragged, moves others out of the way.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < skaters.length; i++) {
        for (let k = i + 1; k < skaters.length; k++) {
          const a = skaters[i];
          const b = skaters[k];
          const along = ahead(a.p, b.p);
          if (Math.abs(along) > 23) continue;
          const across = b.lane - a.lane || (k % 2 ? 0.5 : -0.5);
          const overlap = 23 - Math.hypot(along, across);
          if (overlap <= 0) continue;
          const push = (overlap / 2) * Math.sign(across);
          const aFixed = a.role === 'jammer' && (a.held || a.free > 0);
          const bFixed = b.role === 'jammer' && (b.held || b.free > 0);
          if (!aFixed) a.lane = clamp(a.lane - push * (bFixed ? 2 : 1), -EDGE, EDGE);
          if (!bFixed) b.lane = clamp(b.lane + push * (aFixed ? 2 : 1), -EDGE, EDGE);
        }
      }
    }

    if (timeLeft <= 0) {
      over = 3; // hold the final score for a moment, then line up again
      clockShown = -1;
    }
  }

  function score() {
    for (const j of jammers) {
      let points = 0;
      let n = 0;
      for (const b of blockers) {
        if (b.team === j.team) continue;
        // Whole laps gained on this blocker. The first pass (lap 0) is free.
        j.passes[n] = Math.max(j.passes[n], Math.floor((j.p - b.p) / LAP + 1e-6));
        points += Math.max(0, j.passes[n]);
        n++;
      }
      if (points !== j.points) {
        j.points = points;
        scoreText[j.team].textContent = points;
      }
    }
  }

  function render() {
    for (const s of skaters) {
      const [x, y] = place(s.p, s.lane);
      const [fx, fy] = place(s.p + 2, s.lane);
      const turn = (Math.atan2(fy - y, fx - x) * 180) / Math.PI;
      s.el.setAttribute(
        'transform',
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${turn.toFixed(0)})`
      );
    }
    const secs = Math.max(0, Math.ceil(timeLeft));
    if (secs !== clockShown) {
      clockShown = secs;
      clock.textContent =
        over || called
          ? 'Jam over'
          : `Jam ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      for (const j of jammers) {
        const lap = (((j.p % LAP) + LAP) % LAP) / LAP;
        j.el.setAttribute('aria-valuenow', Math.round(lap * 100));
        j.el.setAttribute(
          'aria-valuetext',
          `${Math.round(lap * 100)} percent of the lap, ${j.points} points`
        );
      }
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (running && onScreen && tabShown) {
      if (over > 0) {
        over -= dt;
        if (over <= 0) {
          lineUp();
          scoreText.forEach((el) => (el.textContent = '0'));
          clockShown = -1;
        }
      } else {
        step(dt);
      }
    }
    score();
    render();
    requestAnimationFrame(frame);
  }

  function label() {
    toggle.textContent = running ? 'End jam' : 'Start jam';
  }
  // Ending a jam stops play and leaves the score up, the way calling it off
  // does. Starting again lines everyone up for a fresh jam.
  toggle.addEventListener('click', () => {
    if (running) {
      called = true;
    } else if (called) {
      called = false;
      lineUp();
      scoreText.forEach((el) => (el.textContent = '0'));
    }
    running = !running;
    clockShown = -1;
    label();
  });

  // Dragging a jammer. The pointer is mapped back onto the track, and the lap
  // count follows the drag, so pulling a jammer round the pack scores.
  for (const j of jammers) {
    const moveTo = (e) => {
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(track.getScreenCTM().inverse());
      const [s, lane] = locate(pt.x, pt.y);
      j.p += ahead(j.p, s);
      j.lane = clamp(lane, -EDGE, EDGE);
    };
    j.el.addEventListener('pointerdown', (e) => {
      j.held = true;
      j.el.classList.add('is-held');
      j.el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    j.el.addEventListener('pointermove', (e) => j.held && moveTo(e));
    const drop = () => {
      j.held = false;
      j.v = PACK_SPEED;
      j.free = 0.4;
      j.el.classList.remove('is-held');
    };
    j.el.addEventListener('pointerup', drop);
    j.el.addEventListener('pointercancel', drop);
    j.el.addEventListener('keydown', (e) => {
      const stepBy = { ArrowRight: 24, ArrowUp: 24, ArrowLeft: -24, ArrowDown: -24 }[e.key];
      if (!stepBy) return;
      e.preventDefault();
      j.p += stepBy;
      j.free = 0.4;
      clockShown = -1;
    });
  }

  new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting)).observe(root);
  document.addEventListener('visibilitychange', () => (tabShown = !document.hidden));

  lineUp();
  label();
  requestAnimationFrame((now) => {
    last = now;
    frame(now);
  });
}

document.querySelectorAll('.derby-jam').forEach(init);
