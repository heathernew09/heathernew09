// nav.js
// Injects the global navigation menu into the header and highlights the current page.

document.addEventListener("DOMContentLoaded", () => {
    const navHTML = `
        <div class="header-content">
            <a href="/" class="logo">
                <img src="/assets/heather-new-wordmark.svg" alt="Heather New" style="height: 25px; width: auto;" width="150" height="25">
            </a>
        </div>

        <div class="pages-menu-overlay" id="pages-overlay">
            <div class="pages-menu-content">
                <nav class="pages-main-nav">
                    <a href="/" class="nav-link home-link-nav">Home</a>
                    <a href="/pages/parasite-hunter.html" class="nav-link">Parasite Hunter AR Game</a>
                    <a href="/pages/hotspot.html" class="nav-link">Wall of Flame Interactive</a>
                    <a href="/pages/decision-tree.html" class="nav-link">Interactive Zen Garden</a>
                    <a href="/pages/bone-growth.html" class="nav-link">Bone Growth Learning Game</a>
                    <a href="/pages/built-different.html" class="nav-link">The Modular Brand: MERGE</a>
                    <a href="/pages/generative-portrait-wall.html" class="nav-link">Generative Portrait Wall</a>
                    <div class="nav-bottom-group" style="margin-top: 3rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 2rem; display: flex; flex-direction: column; gap: 1rem;">
                        <a href="/pages/about.html" class="nav-link">About</a>
                        <a href="/pages/contact.html" class="nav-link">Contact</a>
                    </div>
                </nav>
            </div>
        </div>

        <div class="pages-nav-icon" id="nav-block">
            <div id="nav-hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    const header = document.querySelector(".site-header");
    if (header) {
        // Only inject if the header is currently empty or contains the old manual nav
        if (!header.dataset.injected) {
            header.innerHTML = navHTML;
            header.dataset.injected = "true";
        }
    }

    // Set Active State
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    // Re-initialize hamburger menu logic if it exists on the page
    const navIcon = document.getElementById('nav-block');
    const overlay = document.getElementById('pages-overlay');
    if (navIcon && overlay) {
        navIcon.addEventListener('click', () => {
            navIcon.classList.toggle('open');
            overlay.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
});