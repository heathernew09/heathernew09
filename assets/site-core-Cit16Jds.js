(function () {
  ((window.APP_BASE = window.location.origin),
    (window.resolvePath = (s, t = !0) => {
      const e = s.replace(/^(\/|\.\/|\.\.\/|partials\/)/, '');
      return t ? `${window.APP_BASE}/partials/${e}` : `/${e}`;
    }));
  class v {
    constructor() {
      ((this.activeSection = null), (this.sections = new Map()));
    }
    register(t, e, i) {
      this.sections.set(t, { activate: e, deactivate: i, isActive: !1 });
      const n = document.getElementById(t);
      (n == null ? void 0 : n.getAttribute('data-is-intersecting')) === 'true' && this.activate(t);
    }
    activate(t) {
      if (this.activeSection && this.activeSection !== t) {
        const i = this.sections.get(this.activeSection);
        i != null && i.isActive && (i.deactivate(), (i.isActive = !1));
      }
      const e = this.sections.get(t);
      e && !e.isActive && (e.activate(), (e.isActive = !0), (this.activeSection = t));
    }
    deactivate(t) {
      const e = this.sections.get(t);
      (e != null && e.isActive && (e.deactivate(), (e.isActive = !1)),
        this.activeSection === t && (this.activeSection = null));
    }
  }
  window.sectionManager = new v();
  const m = new IntersectionObserver(
      (s) => {
        s.forEach((t) => {
          const e = t.target.id;
          e &&
            (t.isIntersecting
              ? (t.target.setAttribute('data-is-intersecting', 'true'),
                window.sectionManager.activate(e))
              : (t.target.setAttribute('data-is-intersecting', 'false'),
                window.sectionManager.deactivate(e)));
        });
      },
      { threshold: 0.1 }
    ),
    w = new MutationObserver((s) => {
      s.some((t) => t.addedNodes.length > 0) &&
        (document.querySelectorAll('section[id]').forEach((t) => {
          t.getAttribute('data-observed') !== 'true' &&
            (m.observe(t), t.setAttribute('data-observed', 'true'));
        }),
        document.getElementById('footer-trigger') && !window.footerInitialized && a());
    });
  function a() {
    const s = document.getElementById('mouse-skater'),
      t = document.getElementById('mouse-flipper'),
      e = document.getElementById('footer-trigger');
    if (!s || !t || !e || window.footerInitialized) return;
    window.footerInitialized = !0;
    let i = -110,
      n = -110,
      l = window.scrollY,
      r = 'down',
      d = null,
      u = !1;
    const h = 0.12;
    new IntersectionObserver(
      (o) => {
        u = o[0].isIntersecting;
      },
      { threshold: 0 }
    ).observe(e);
    function c() {
      if (!u) {
        requestAnimationFrame(c);
        return;
      }
      const o = window.scrollY,
        p = window.innerHeight,
        b = e.getBoundingClientRect(),
        g = o - l;
      if (Math.abs(g) > 0.5) {
        const f = g > 0 ? 'down' : 'up';
        (f !== r &&
          ((r = f),
          r === 'up'
            ? (t.classList.add('facing-left'), s.style.setProperty('--direction-scale', '-1'))
            : (t.classList.remove('facing-left'), s.style.setProperty('--direction-scale', '1'))),
          s.classList.remove('paused'),
          clearTimeout(d),
          (d = setTimeout(() => s.classList.add('paused'), 100)));
      }
      ((n = -110 + Math.max(0, Math.min(1, (p - b.top) / 500)) * (window.innerWidth + 110)),
        (i += (n - i) * h),
        (s.style.transform = `translateX(${i}px)`),
        (l = o),
        requestAnimationFrame(c));
    }
    c();
  }
  (w.observe(document.body, { childList: !0, subtree: !0, attributes: !1 }),
    document.getElementById('footer-trigger') && a(),
    document.addEventListener('click', (s) => {
      const t = document.getElementById('pages-overlay'),
        e = document.getElementById('nav-block'),
        i = document.getElementById('nav-hamburger-icon');
      if (s.target.closest('#nav-block')) {
        const n = t == null ? void 0 : t.classList.toggle('open');
        (i == null || i.classList.toggle('active'),
          e == null || e.classList.toggle('active'),
          (document.body.style.overflow = n ? 'hidden' : ''));
        return;
      }
      (s.target === t || s.target.closest('.pages-main-nav a')) &&
        (t == null || t.classList.remove('open'),
        i == null || i.classList.remove('active'),
        e == null || e.classList.remove('active'),
        (document.body.style.overflow = ''));
    }));
})();
