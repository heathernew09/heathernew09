(function() {
    // --- SMART PATH CONFIGURATION ---
    let pathPrefix = './'; 
    const pathname = window.location.pathname;

    if (pathname.includes('/pages/') || pathname.includes('/partials/')) {
        pathPrefix = '../';
    } else {
        pathPrefix = './';
    }

    console.log(`[Tree Partial] Path prefix set to: "${pathPrefix}"`);

    const container = document.getElementById('tree-partial-container');
    const iframe = document.getElementById('tree-iframe');

    // 1. SET IFRAME SOURCE
    const gameUrl = 'https://decisiontree.builtmerge.com/'; 
    if(iframe) {
        iframe.src = gameUrl;
    }

    // 2. FIX LINKS & IMAGES
    if (container) {
        // Fix standard Links
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            const rawHref = link.getAttribute('href');
            if (rawHref && !rawHref.startsWith('http') && !rawHref.startsWith('#')) {
                const cleanHref = rawHref.replace(/^(\.\/|\/)/, '');
                link.href = pathPrefix + cleanHref;
            }
        });

        // Fix Images (The Frame PNG)
        const images = container.querySelectorAll('img');
        images.forEach(img => {
            const rawSrc = img.getAttribute('src');
            if (rawSrc && !rawSrc.startsWith('http')) {
                const cleanSrc = rawSrc.replace(/^(\.\/|\/)/, ''); 
                img.src = pathPrefix + cleanSrc;
            }
        });
    }
})();