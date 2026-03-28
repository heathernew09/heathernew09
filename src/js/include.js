/**
 * INCLUDE ENGINE: Parallelized with Script Execution
 */
async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]:not([data-processed])');
    
    const tasks = Array.from(elements).map(async (el) => {
        el.setAttribute('data-processed', 'true');
        const file = el.getAttribute('data-include');
        
        if (typeof window.resolvePath !== 'function') {
            setTimeout(includeHTML, 50);
            return;
        }

        const resolvedPath = window.resolvePath(file); 
        
        try {
            const response = await fetch(resolvedPath);
            if (response.ok) {
                el.innerHTML = await response.text();
                
                // CRITICAL: Force the browser to execute scripts inside the partial
                executeScripts(el);
                
                el.dispatchEvent(new CustomEvent('partialLoaded', { 
                    bubbles: true, 
                    detail: { id: file } 
                }));
            }
        } catch (e) { console.error("Include failed:", e); }
    });

    await Promise.all(tasks);
}

async function executeScripts(container) {
    const scripts = Array.from(container.querySelectorAll("script"));
    
    for (const oldScript of scripts) {
        await new Promise((resolve) => {
            const newScript = document.createElement("script");
            
            // Copy all attributes
            Array.from(oldScript.attributes).forEach(attr => 
                newScript.setAttribute(attr.name, attr.value)
            );

            if (oldScript.src) {
                // FORCE wait for CDN loading
                newScript.onload = () => {
                    console.log(`✅ Ready: ${oldScript.src.split('/').pop()}`);
                    resolve();
                };
                newScript.onerror = () => {
                    console.error(`❌ Failed: ${oldScript.src}`);
                    resolve(); 
                };
                document.head.appendChild(newScript);
            } else {
                // For inline scripts, we wrap in a try/catch
                // and use a tiny timeout to let the CPU breathe
                try {
                    newScript.textContent = oldScript.textContent;
                    document.head.appendChild(newScript);
                } catch (err) {
                    console.error("Inline script error:", err);
                }
                setTimeout(resolve, 10);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', includeHTML);
window.includeHTML = includeHTML;