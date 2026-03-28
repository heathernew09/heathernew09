// Global Path Resolver - Forces Absolute Root Resolution
(function() {
    // We treat everything from the root of the domain
    window.APP_BASE = '/'; 
    
    window.resolvePath = function(relativePath) {
        // Remove leading ./ or ../ to normalize the string
        const cleanPath = relativePath.replace(/^(\.\/|\.\.\/)/, '');
        // Return absolute path from root
        return window.APP_BASE + cleanPath;
    };
    
    console.log('Path Resolver: Absolute root mode active.');
})();