/**
 * Home Page Project Renderer
 */
async function loadProjects() {
    const projectContainer = document.getElementById('main-content');
    if (!projectContainer) return;

    try {
        const response = await fetch('/data/projects.json');
        const projects = await response.json();

        // Clear hardcoded projects (except the ones we haven't data-fied yet if any)
        // For now, we will replace the content of main-content with dynamic tiles
        projectContainer.innerHTML = projects.map((project, index) => renderProjectTile(project, index)).join('');

        // Re-initialize any 3D effects or specific listeners
        initMergeTilt();

    } catch (e) {
        console.error("Failed to load projects:", e);
    }
}

function renderProjectTile(project, index) {
    const isMerge = project.id === 'merge';
    const isHotspot = project.id === 'hotspot';
    const isEven = index % 2 === 1;
    
    // Tech tags HTML
    const techTags = project.tech.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
    
    // Content Column
    const contentHtml = `
        <div class="project-content">
            <span class="project-category design">${project.category}</span>
            <p class="project-subtitle">${project.subtitle}</p>
            <h2 class="project-title">${project.title}</h2>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">${techTags}</div>
            <div class="project-cta">
                <a href="${project.cta.link}" class="project-link">${project.cta.text}</a>
            </div>
        </div>
    `;

    // Visual Column
    let visualHtml = `
        <div class="project-visual">
            <img src="${project.visual.src}" 
                 alt="${project.visual.alt}" 
                 id="${project.visual.id || ''}" 
                 loading="lazy"
                 decodings="async">
        </div>
    `;

    // Special layout for Hotspot placeholder or others if needed
    if (isHotspot) {
        visualHtml = `
            <div class="project-visual hotspot-preview">
                <img src="${project.visual.src}" alt="${project.visual.alt}">
            </div>
        `;
    }

    // Alternating Logic: Evens are reversed
    const layoutClass = isEven ? 'project-tile reverse' : 'project-tile';
    const innerHtml = isEven ? (contentHtml + visualHtml) : (visualHtml + contentHtml);

    return `
        <section id="tile-${project.id}" class="content-section">
            <div class="container">
                <article class="${layoutClass}">
                    ${innerHtml}
                </article>
            </div>
        </section>
    `;
}

function initMergeTilt() {
    const logo = document.getElementById('merge-logo');
    const container = document.querySelector('.merge-preview');

    if (!logo || !container) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        logo.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            scale3d(1.05, 1.05, 1.05)
        `;
    });

    container.addEventListener('mouseleave', () => {
        logo.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
}

document.addEventListener('DOMContentLoaded', loadProjects);
