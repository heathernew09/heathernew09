(function () {
  const o = document.createElement('link').relList;
  if (o && o.supports && o.supports('modulepreload')) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) n(t);
  new MutationObserver((t) => {
    for (const e of t)
      if (e.type === 'childList')
        for (const i of e.addedNodes) i.tagName === 'LINK' && i.rel === 'modulepreload' && n(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(t) {
    const e = {};
    return (
      t.integrity && (e.integrity = t.integrity),
      t.referrerPolicy && (e.referrerPolicy = t.referrerPolicy),
      t.crossOrigin === 'use-credentials'
        ? (e.credentials = 'include')
        : t.crossOrigin === 'anonymous'
          ? (e.credentials = 'omit')
          : (e.credentials = 'same-origin'),
      e
    );
  }
  function n(t) {
    if (t.ep) return;
    t.ep = !0;
    const e = a(t);
    fetch(t.href, e);
  }
})();
(function () {
  ((window.APP_BASE = window.location.origin),
    (window.resolvePath = (t, e = !0) => {
      const i = t.replace(/^(\/|\.\/|\.\.\/|partials\/)/, '');
      return e ? `${window.APP_BASE}/partials/${i}` : `/${i}`;
    }));
  class u {
    constructor() {
      ((this.activeSection = null), (this.sections = new Map()));
    }
    register(e, i, s) {
      this.sections.set(e, { activate: i, deactivate: s, isActive: !1 });
      const r = document.getElementById(e);
      (r == null ? void 0 : r.getAttribute('data-is-intersecting')) === 'true' && this.activate(e);
    }
    activate(e) {
      if (this.activeSection && this.activeSection !== e) {
        const s = this.sections.get(this.activeSection);
        s != null && s.isActive && (s.deactivate(), (s.isActive = !1));
      }
      const i = this.sections.get(e);
      i && !i.isActive && (i.activate(), (i.isActive = !0), (this.activeSection = e));
    }
    deactivate(e) {
      const i = this.sections.get(e);
      (i != null && i.isActive && (i.deactivate(), (i.isActive = !1)),
        this.activeSection === e && (this.activeSection = null));
    }
  }
  window.sectionManager = new u();
  const o = new IntersectionObserver(
      (t) => {
        t.forEach((e) => {
          const i = e.target.id;
          i &&
            (e.isIntersecting
              ? (e.target.setAttribute('data-is-intersecting', 'true'),
                window.sectionManager.activate(i))
              : (e.target.setAttribute('data-is-intersecting', 'false'),
                window.sectionManager.deactivate(i)));
        });
      },
      { threshold: 0.1 }
    ),
    a = new MutationObserver((t) => {
      t.some((e) => e.addedNodes.length > 0) &&
        (document.querySelectorAll('section[id]').forEach((e) => {
          e.getAttribute('data-observed') !== 'true' &&
            (o.observe(e), e.setAttribute('data-observed', 'true'));
        }),
        document.getElementById('footer-trigger') && !window.footerInitialized && n());
    });
  function n() {
    const t = document.getElementById('mouse-skater'),
      e = document.getElementById('mouse-flipper'),
      i = document.getElementById('footer-trigger');
    if (!t || !e || !i || window.footerInitialized) return;
    window.footerInitialized = !0;
    let s = -110,
      r = -110,
      f = window.scrollY,
      l = 'down',
      g = null,
      m = !1;
    const w = 0.12;
    new IntersectionObserver(
      (c) => {
        m = c[0].isIntersecting;
      },
      { threshold: 0 }
    ).observe(i);
    function d() {
      if (!m) {
        requestAnimationFrame(d);
        return;
      }
      const c = window.scrollY,
        h = window.innerHeight,
        b = i.getBoundingClientRect(),
        p = c - f;
      if (Math.abs(p) > 0.5) {
        const v = p > 0 ? 'down' : 'up';
        (v !== l &&
          ((l = v),
          l === 'up'
            ? (e.classList.add('facing-left'), t.style.setProperty('--direction-scale', '-1'))
            : (e.classList.remove('facing-left'), t.style.setProperty('--direction-scale', '1'))),
          t.classList.remove('paused'),
          clearTimeout(g),
          (g = setTimeout(() => t.classList.add('paused'), 100)));
      }
      ((r = -110 + Math.max(0, Math.min(1, (h - b.top) / 500)) * (window.innerWidth + 110)),
        (s += (r - s) * w),
        (t.style.transform = `translateX(${s}px)`),
        (f = c),
        requestAnimationFrame(d));
    }
    d();
  }
  (a.observe(document.body, { childList: !0, subtree: !0, attributes: !1 }),
    document.getElementById('footer-trigger') && n(),
    document.addEventListener('click', (t) => {
      const e = document.getElementById('pages-overlay');
      (t.target.closest('#nav-hamburger-icon') && (e == null || e.classList.add('open')),
        (t.target.closest('#pages-close-menu') || t.target === e) &&
          (e == null || e.classList.remove('open')));
    }));
})();
