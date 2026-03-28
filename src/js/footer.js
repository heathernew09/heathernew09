/**
 * Footer Magic Mouse Animation - Restored
 */
(function () {
  const skater = document.getElementById('mouse-skater');
  const flipper = document.getElementById('mouse-flipper');
  const footerWrapper = document.getElementById('footer-trigger');
  const yearSpan = document.getElementById('current-year');

  // 1. Set the Year immediately
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // 2. Guard clause
  if (!skater || !flipper || !footerWrapper) {
    console.warn('Footer animation: Elements not found.');
    return;
  }

  // 3. Internal State
  let currentX = -110;
  let targetX = -110;
  let lastScrollY = window.scrollY;
  let currentDirection = 'down';
  let pauseTimeout = null;
  let isFooterVisible = false;
  let rafActive = false; // Prevents multiple loops running

  const lerp = 0.12;

  // 4. The Animation Loop
  function updateAnimation() {
    if (!isFooterVisible) {
      rafActive = false;
      return;
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const rect = footerWrapper.getBoundingClientRect();

    // Determine Direction
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

    // Progress Calculation (Sync to footer entry)
    const footerHeight = footerWrapper.offsetHeight || 500;
    let visiblePixels = windowHeight - rect.top;
    let progress = Math.max(0, Math.min(1, visiblePixels / footerHeight));

    const mouseWidth = 110;
    const startX = -mouseWidth;
    const endX = window.innerWidth;

    targetX = startX + progress * (endX - startX);

    // Smooth interpolation
    currentX += (targetX - currentX) * lerp;
    skater.style.transform = `translateX(${currentX}px)`;

    lastScrollY = scrollY;
    requestAnimationFrame(updateAnimation);
  }

  // 5. Improved Intersection Observer
  // This wakes up the mouse as soon as the footer enters the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isFooterVisible = entry.isIntersecting;
        if (isFooterVisible && !rafActive) {
          rafActive = true;
          requestAnimationFrame(updateAnimation);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: '100px', // Start animating slightly before it hits the screen
    }
  );

  observer.observe(footerWrapper);
})();
