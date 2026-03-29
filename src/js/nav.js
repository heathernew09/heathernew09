/**
 * GLOBAL UI MANAGER
 * Handles Navigation & Footer Skater Animation
 */
(function () {
  'use strict';

  // --- SHARED STATE & CONFIG ---
  let footerObserver, navObserver;
  let skater, flipper, footerWrapper;

  let currentX = -110;
  let targetX = -110;
  let lastScrollY = window.scrollY;
  let currentDirection = 'down';
  let pauseTimeout = null;
  let isFooterVisible = false;
  let rafActive = false;
  const lerp = 0.12;

  // --- 1. NAVIGATION LOGIC ---

  // Delegated Click Handling (Works even if nav is loaded late)
  document.addEventListener('click', (e) => {
    const overlay = document.getElementById('pages-overlay');

    if (e.target.closest('#nav-hamburger-icon')) {
      overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    if (
      e.target.closest('#pages-close-menu') ||
      e.target === overlay ||
      e.target.closest('.pages-main-nav a')
    ) {
      overlay?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  window.markNavActiveLinks = function () {
    // 1. Get current path, lowercased, no extension
    // Example: "/root/pages/parasite-hunter.html" -> "/root/pages/parasite-hunter"
    const currentPath = window.location.pathname
      .replace(/\/$/, '')
      .replace('.html', '')
      .toLowerCase();

    const navLinks = document.querySelectorAll('.pages-main-nav a');

    navLinks.forEach((link) => {
      // 2. Get the link's href
      // Example: "/pages/parasite-hunter.html"
      const href = link.getAttribute('href');

      // 3. Clean the href
      // "/pages/parasite-hunter"
      const normLink = href.replace(/\/$/, '').replace('.html', '').toLowerCase();

      // 4. CHECK: Is this the Home link?
      // If the cleaned link is just empty or "/"
      if (normLink === '' || normLink === '/') {
        // Active if URL ends in nothing (root) or "index"
        // This covers /root/index.html or just /root/
        if (currentPath.endsWith('index') || currentPath === '' || currentPath === '/') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
      // 5. CHECK: All other pages
      // Does "/root/pages/parasite-hunter" end with "/pages/parasite-hunter"? -> YES.
      else if (currentPath.endsWith(normLink)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // --- 2. FOOTER ANIMATION LOGIC ---

  function updateFooterAnimation() {
    if (!isFooterVisible || !skater) {
      rafActive = false;
      return;
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const rect = footerWrapper.getBoundingClientRect();

    const delta = scrollY - lastScrollY;
    if (Math.abs(delta) > 0.1) {
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
      pauseTimeout = setTimeout(() => {
        skater.classList.add('paused');
      }, 100);
    }

    const footerHeight = footerWrapper.offsetHeight || 500;
    let visiblePixels = windowHeight - rect.top;
    let progress = Math.max(0, Math.min(1, visiblePixels / footerHeight));

    const mouseWidth = 110;
    const startX = -mouseWidth;
    const endX = window.innerWidth;

    targetX = startX + progress * (endX - startX);
    currentX += (targetX - currentX) * lerp;

    skater.style.transform = `translateX(${currentX}px)`;

    lastScrollY = scrollY;
    requestAnimationFrame(updateFooterAnimation);
  }

  // Initialize Footer Elements
  function initFooterAnimation() {
    skater = document.getElementById('mouse-skater');
    flipper = document.getElementById('mouse-flipper');
    footerWrapper = document.getElementById('footer-trigger');
    const yearSpan = document.getElementById('current-year');

    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    if (!skater || !footerWrapper) return;

    footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isFooterVisible = entry.isIntersecting;
          if (isFooterVisible && !rafActive) {
            rafActive = true;
            requestAnimationFrame(updateFooterAnimation);
          }
        });
      },
      { threshold: 0, rootMargin: '100px' }
    );

    footerObserver.observe(footerWrapper);
  }

  // --- 3. DOM WATCHER (The "Glue") ---
  // Watches the body for injected partials and initializes them
  const domObserver = new MutationObserver((mutations) => {
    // Check for Nav
    if (document.querySelector('.pages-main-nav')) {
      window.markNavActiveLinks();
    }
    // Check for Footer
    if (document.getElementById('footer-trigger') && !footerWrapper) {
      initFooterAnimation();
    }
  });

  domObserver.observe(document.body, { childList: true, subtree: true });

  // Initial run in case they are already in the HTML
  window.markNavActiveLinks();
  initFooterAnimation();

  // --- 4. CONSOLE LOGS ---
  console.log(
    '%c? Hi! Curious about the code?',
    'color: #ffffff; background: #000000; font-size: 18px; padding: 10px; border-radius: 5px;'
  );
  console.log(
    '%cLet\'s talk! Connect with me here: https://linkedin.com/in/heathernew09',
    'font-size: 14px; color: #333;'
  );
})();
