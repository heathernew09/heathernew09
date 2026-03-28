/**
 * GLOBAL HEADER NAV
 */
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('pages-overlay');
    
    // Open Menu
    if (e.target.closest('#nav-hamburger-icon')) {
        overlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    // Close Menu (X button, clicking outside, or clicking a link)
    if (
        e.target.closest('#pages-close-menu') || 
        e.target === overlay || 
        e.target.closest('.pages-main-nav a')
    ) {
        overlay?.classList.remove('open');
        document.body.style.overflow = ''; 
    }
});

function markActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.pages-main-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Clean paths for comparison
        const normalizedLink = linkPath.endsWith('.html') ? linkPath : linkPath.replace(/\/$/, "");
        const normalizedCurrent = currentPath.endsWith('.html') ? currentPath : currentPath.replace(/\/$/, "");

        if (normalizedCurrent === normalizedLink || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Run on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markActiveLink);
} else {
    markActiveLink();
}