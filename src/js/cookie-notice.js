// Cookie notice: a chocolate chip cookie that asks about cookies.
// Self-contained on purpose. It is injected into every page by vite.config.ts,
// and the homepage does not load global.css, so it brings its own styles.
import '../css/cookie-notice.css';

const STORAGE_KEY = 'hn-cookie-choice';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function savedChoice() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

function applyChoice(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Private windows can refuse storage. The choice still holds for this page.
  }
  // gtag only exists in the built site; local dev has no analytics tag.
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: choice });
  }
}

// The chips are Bauhaus primitives, to match the tile grid on the site.
const COOKIE_SVG = `
<svg class="hn-cookie__art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
  <defs>
    <mask id="hn-cookie-bites">
      <rect width="120" height="120" fill="#fff" />
      <circle class="hn-bite" data-r="27" cx="101" cy="20" r="0" />
      <circle class="hn-bite" data-r="19" cx="78" cy="6" r="0" />
      <circle class="hn-bite" data-r="38" cx="104" cy="84" r="0" />
      <circle class="hn-bite" data-r="24" cx="62" cy="112" r="0" />
      <circle class="hn-bite" data-r="52" cx="26" cy="74" r="0" />
      <circle class="hn-bite" data-r="30" cx="40" cy="22" r="0" />
    </mask>
  </defs>
  <g mask="url(#hn-cookie-bites)">
    <circle cx="60" cy="60" r="55" fill="#d9a05b" stroke="#111" stroke-width="3" />
    <circle cx="41" cy="38" r="9" fill="#3a2015" />
    <rect x="68" y="26" width="15" height="15" fill="#3a2015" transform="rotate(18 75.5 33.5)" />
    <path d="M30 66 L46 86 L22 88 Z" fill="#3a2015" />
    <path d="M64 58 a11 11 0 0 1 22 0 Z" fill="#3a2015" transform="rotate(-24 75 58)" />
    <rect x="58" y="80" width="22" height="8" fill="#3a2015" transform="rotate(-12 69 84)" />
    <circle cx="92" cy="72" r="5" fill="#3a2015" />
    <circle cx="52" cy="100" r="4" fill="#3a2015" />
  </g>
</svg>`;

function build() {
  const el = document.createElement('aside');
  el.className = 'hn-cookie';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Cookie choice');
  el.setAttribute('aria-describedby', 'hn-cookie-text');
  el.innerHTML = `
    <div class="hn-cookie__plate">
      ${COOKIE_SVG}
      <span class="hn-cookie__crumbs" aria-hidden="true"><i></i><i></i><i></i></span>
    </div>
    <div class="hn-cookie__card">
      <p id="hn-cookie-text">
        This site uses cookies. Not this kind, sadly. It's Google Analytics, so I can see
        if anyone visits.
        <a href="/pages/privacy.html">Privacy policy</a>
      </p>
      <div class="hn-cookie__actions">
        <button type="button" class="hn-cookie__accept" data-choice="granted">Accept cookies</button>
        <button type="button" class="hn-cookie__decline" data-choice="denied">No thanks</button>
      </div>
    </div>`;

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-choice]');
    if (!btn || el.dataset.leaving) return;
    applyChoice(btn.dataset.choice);
    leave(el, btn.dataset.choice);
  });
  return el;
}

// Accept: the cookie gets eaten, three bites. No thanks: it rolls away.
function leave(el, choice) {
  el.dataset.leaving = choice;
  if (reducedMotion) {
    el.remove();
    return;
  }
  if (choice === 'granted') {
    const bites = [...el.querySelectorAll('.hn-bite')];
    [0, 2, 4].forEach((start, i) => {
      setTimeout(() => {
        bites.slice(start, start + 2).forEach((b) => b.setAttribute('r', b.dataset.r));
      }, i * 280);
    });
    setTimeout(() => el.classList.add('is-gone'), 3 * 280);
    setTimeout(() => el.remove(), 3 * 280 + 320);
  } else {
    el.classList.add('is-rolling');
    setTimeout(() => el.remove(), 1100);
  }
}

function show() {
  if (document.querySelector('.hn-cookie')) return;
  document.body.appendChild(build());
}

function init() {
  if (!savedChoice()) show();
  // Any element marked data-cookie-settings reopens the notice (privacy page).
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cookie-settings]');
    if (!trigger) return;
    e.preventDefault();
    show();
    document.querySelector('.hn-cookie__accept')?.focus();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
