(function () {
  ((window.APP_BASE = window.location.origin),
    (window.resolvePath = (i, e = !0) => {
      const t = i.replace(/^(\/|\.\/|\.\.\/|partials\/)/, '');
      return e ? `${window.APP_BASE}/partials/${t}` : `/${t}`;
    }));
  class m {
    constructor() {
      ((this.activeSection = null), (this.sections = new Map()));
    }
    register(e, t, n) {
      this.sections.set(e, { activate: t, deactivate: n, isActive: !1 });
      const s = document.getElementById(e);
      (s == null ? void 0 : s.getAttribute('data-is-intersecting')) === 'true' && this.activate(e);
    }
    activate(e) {
      if (this.activeSection && this.activeSection !== e) {
        const n = this.sections.get(this.activeSection);
        n != null && n.isActive && (n.deactivate(), (n.isActive = !1));
      }
      const t = this.sections.get(e);
      t && !t.isActive && (t.activate(), (t.isActive = !0), (this.activeSection = e));
    }
    deactivate(e) {
      const t = this.sections.get(e);
      (t != null && t.isActive && (t.deactivate(), (t.isActive = !1)),
        this.activeSection === e && (this.activeSection = null));
    }
  }
  window.sectionManager = new m();
  const w = new IntersectionObserver(
      (i) => {
        i.forEach((e) => {
          const t = e.target.id;
          t &&
            (e.isIntersecting
              ? (e.target.setAttribute('data-is-intersecting', 'true'),
                window.sectionManager.activate(t))
              : (e.target.setAttribute('data-is-intersecting', 'false'),
                window.sectionManager.deactivate(t)));
        });
      },
      { threshold: 0.1 }
    ),
    f = new MutationObserver((i) => {
      i.some((e) => e.addedNodes.length > 0) &&
        (document.querySelectorAll('section[id]').forEach((e) => {
          e.getAttribute('data-observed') !== 'true' &&
            (w.observe(e), e.setAttribute('data-observed', 'true'));
        }),
        document.getElementById('footer-trigger') && !window.footerInitialized && r());
    });
  function r() {
    const i = document.getElementById('mouse-skater'),
      e = document.getElementById('mouse-flipper'),
      t = document.getElementById('footer-trigger');
    if (!i || !e || !t || window.footerInitialized) return;
    window.footerInitialized = !0;
    let n = -110,
      s = -110,
      l = window.scrollY,
      a = 'down',
      d = null,
      u = !1;
    const h = 0.12;
    new IntersectionObserver(
      (o) => {
        u = o[0].isIntersecting;
      },
      { threshold: 0 }
    ).observe(t);
    function c() {
      if (!u) {
        requestAnimationFrame(c);
        return;
      }
      const o = window.scrollY,
        b = window.innerHeight,
        y = t.getBoundingClientRect(),
        v = o - l;
      if (Math.abs(v) > 0.5) {
        const g = v > 0 ? 'down' : 'up';
        (g !== a &&
          ((a = g),
          a === 'up'
            ? (e.classList.add('facing-left'), i.style.setProperty('--direction-scale', '-1'))
            : (e.classList.remove('facing-left'), i.style.setProperty('--direction-scale', '1'))),
          i.classList.remove('paused'),
          clearTimeout(d),
          (d = setTimeout(() => i.classList.add('paused'), 100)));
      }
      ((s = -110 + Math.max(0, Math.min(1, (b - y.top) / 500)) * (window.innerWidth + 110)),
        (n += (s - n) * h),
        (i.style.transform = `translateX(${n}px)`),
        (l = o),
        requestAnimationFrame(c));
    }
    c();
  }
  (f.observe(document.body, { childList: !0, subtree: !0, attributes: !1 }),
    document.getElementById('footer-trigger') && r(),
    document.addEventListener('click', (i) => {
      const e = document.getElementById('pages-overlay'),
        t = document.getElementById('nav-block'),
        n = document.getElementById('nav-hamburger-icon');
      if (i.target.closest('#nav-block')) {
        const s = e == null ? void 0 : e.classList.toggle('open');
        (n == null || n.classList.toggle('active'),
          t == null || t.classList.toggle('active'),
          (document.body.style.overflow = s ? 'hidden' : ''));
        return;
      }
      (i.target === e || i.target.closest('.pages-main-nav a')) &&
        (e == null || e.classList.remove('open'),
        n == null || n.classList.remove('active'),
        t == null || t.classList.remove('active'),
        (document.body.style.overflow = ''));
    }));
})();
