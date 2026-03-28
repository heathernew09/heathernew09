/**
 * GLOBAL UI MANAGER
 * Handles Navigation & Footer Skater Animation
 */
(function() {
    "use strict";

    // --- NAVIGATION LOGIC ---
    document.addEventListener('click', (e) => {
        const overlay = document.getElementById('pages-overlay');
        if (e.target.closest('#nav-hamburger-icon')) {
            overlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        if (e.target.closest('#pages-close-menu') || e.target === overlay || e.target.closest('.pages-main-nav a')) {
            overlay?.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    window.markNavActiveLinks = function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.pages-main-nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const normLink = href.replace(/\/$/, "").replace(".html", "");
            const normCurr = currentPath.replace(/\/$/, "").replace(".html", "");
            if (normCurr === normLink || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // --- FOOTER SKATER LOGIC ---
    let skater, flipper, footerWrapper;
    let currentX = -110, targetX = -110, lastScrollY = window.scrollY;
    let currentDirection = 'down', pauseTimeout = null, isFooterVisible = false, rafActive = false;
    const lerp = 0.12;

    function updateAnimation() {
        if (!isFooterVisible || !skater) { rafActive = false; return; }
        const scrollY = window.scrollY, windowHeight = window.innerHeight, rect = footerWrapper.getBoundingClientRect();
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
            pauseTimeout = setTimeout(() => skater.classList.add('paused'), 100);
        }
        const footerHeight = footerWrapper.offsetHeight || 500;
        let visiblePixels = windowHeight - rect.top;
        let progress = Math.max(0, Math.min(1, visiblePixels / footerHeight));
        targetX = (-110) + (progress * (window.innerWidth + 110));
        currentX += (targetX - currentX) * lerp;
        skater.style.transform = `translateX(${currentX}px)`;
        lastScrollY = scrollY;
        requestAnimationFrame(updateAnimation);
    }

    function initGlobalUI() {
        skater = document.getElementById('mouse-skater');
        flipper = document.getElementById('mouse-flipper');
        footerWrapper = document.getElementById('footer-trigger');
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
        if (skater && footerWrapper) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isFooterVisible = entry.isIntersecting;
                    if (isFooterVisible && !rafActive) { rafActive = true; requestAnimationFrame(updateAnimation); }
                });
            }, { threshold: 0, rootMargin: "100px" });
            observer.observe(footerWrapper);
        }
        window.markNavActiveLinks();
    }

    // Initialize immediately and watch for injected content
    const observer = new MutationObserver(() => {
        if (document.querySelector('.pages-main-nav') || document.getElementById('footer-trigger')) {
            initGlobalUI();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    initGlobalUI();
})();