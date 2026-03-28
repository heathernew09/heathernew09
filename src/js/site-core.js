/**
 * SITE CORE: Unified Logic
 */
(function () {
  'use strict';

  // --- 1. PATH RESOLVER (Minimalist) ---
  window.APP_BASE = window.location.origin;

  // Only prefixes /partials/ for HTML fragments.
  // Otherwise, returns the path as-is from the root.
  window.resolvePath = (path, isPartial = true) => {
    const cleanPath = path.replace(/^(\/|\.\/|\.\.\/|partials\/)/, '');
    if (isPartial) {
      return `${window.APP_BASE}/partials/${cleanPath}`;
    }
    return `/${cleanPath}`;
  };

  // --- 2. SECTION MANAGER ---
  class SectionManager {
    constructor() {
      this.activeSection = null;
      this.sections = new Map();
    }
    register(id, activate, deactivate) {
      this.sections.set(id, { activate, deactivate, isActive: false });
      const el = document.getElementById(id);
      if (el?.getAttribute('data-is-intersecting') === 'true') this.activate(id);
    }
    activate(id) {
      if (this.activeSection && this.activeSection !== id) {
        const curr = this.sections.get(this.activeSection);
        if (curr?.isActive) {
          curr.deactivate();
          curr.isActive = false;
        }
      }
      const sec = this.sections.get(id);
      if (sec && !sec.isActive) {
        sec.activate();
        sec.isActive = true;
        this.activeSection = id;
      }
    }
    deactivate(id) {
      const sec = this.sections.get(id);
      if (sec?.isActive) {
        sec.deactivate();
        sec.isActive = false;
      }
      if (this.activeSection === id) this.activeSection = null;
    }
  }
  window.sectionManager = new SectionManager();

  // --- 3. DYNAMIC OBSERVERS (No Recursion) ---
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (!id) return;
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-is-intersecting', 'true');
          window.sectionManager.activate(id);
        } else {
          entry.target.setAttribute('data-is-intersecting', 'false');
          window.sectionManager.deactivate(id);
        }
      });
    },
    { threshold: 0.1 }
  );

  const domWatcher = new MutationObserver((mutations) => {
    if (!mutations.some((m) => m.addedNodes.length > 0)) return;

    document.querySelectorAll('section[id]').forEach((sec) => {
      if (sec.getAttribute('data-observed') !== 'true') {
        sectionObserver.observe(sec);
        sec.setAttribute('data-observed', 'true');
      }
    });

    if (document.getElementById('footer-trigger') && !window.footerInitialized) {
      initFooterSkater();
    }
  });

  // --- 4. FOOTER SKATER LOGIC (Restored & Reliable) ---
  function initFooterSkater() {
    const skater = document.getElementById('mouse-skater');
    const flipper = document.getElementById('mouse-flipper');
    const footerWrapper = document.getElementById('footer-trigger');

    if (!skater || !flipper || !footerWrapper || window.footerInitialized) return;
    window.footerInitialized = true;

    let currentX = -110,
      targetX = -110,
      lastScrollY = window.scrollY;
    let currentDirection = 'down',
      pauseTimeout = null,
      isVisible = false;
    const lerp = 0.12;

    const observer = new IntersectionObserver(
      (e) => {
        isVisible = e[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(footerWrapper);

    function updateAnimation() {
      if (!isVisible) {
        requestAnimationFrame(updateAnimation);
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const rect = footerWrapper.getBoundingClientRect();

      const delta = scrollY - lastScrollY;
      if (Math.abs(delta) > 0.5) {
        const newDirection = delta > 0 ? 'down' : 'up';
        if (newDirection !== currentDirection) {
          currentDirection = newDirection;
          if (currentDirection === 'up') {
            flipper.classList.add('facing-left');
            skater.style.setProperty('--direction-scale', '-1');
          } else {
            flipper.classList.remove('facing-left');
            skater.style.setProperty('--direction-scale', '1');
          }
        }
        skater.classList.remove('paused');
        clearTimeout(pauseTimeout);
        pauseTimeout = setTimeout(() => skater.classList.add('paused'), 100);
      }

      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / 500));
      targetX = -110 + progress * (window.innerWidth + 110);
      currentX += (targetX - currentX) * lerp;
      skater.style.transform = `translateX(${currentX}px)`;

      lastScrollY = scrollY;
      requestAnimationFrame(updateAnimation);
    }
    updateAnimation();
  }

  // --- 5. INITIALIZE ---
  domWatcher.observe(document.body, { childList: true, subtree: true, attributes: false });
  if (document.getElementById('footer-trigger')) initFooterSkater();

  // Nav Logic
  document.addEventListener('click', (e) => {
    const overlay = document.getElementById('pages-overlay');
    const navBlock = document.getElementById('nav-block');
    const hamburger = document.getElementById('nav-hamburger-icon');

    // Toggle menu when clicking hamburger block
    if (e.target.closest('#nav-block')) {
      const isOpen = overlay?.classList.toggle('open');
      hamburger?.classList.toggle('active');
      navBlock?.classList.toggle('active');

      // Toggle body scroll
      document.body.style.overflow = isOpen ? 'hidden' : '';
      return;
    }

    // Close menu when clicking outside (on the overlay backdrop)
    // OR when clicking a navigation link
    if (e.target === overlay || e.target.closest('.pages-main-nav a')) {
      overlay?.classList.remove('open');
      hamburger?.classList.remove('active');
      navBlock?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();
