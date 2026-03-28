// Hero page interactions
document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.hero-section');
  const background = document.querySelector('.background-container');
  const phoneIcon = document.getElementById('phone-icon');
  const shapes = document.querySelectorAll('.organic-shape');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const menuOverlay = document.querySelector('.menu-overlay');
  const menuCloseIcon = document.querySelector('.menu-overlay .close-icon');
  const searchIcon = document.getElementById('search-icon');
  const spotlightOverlay = document.getElementById('spotlight-overlay');
  const skillWords = document.querySelectorAll('.skill-word');
  const spotlightInstructions = document.getElementById('spotlight-instructions');
  const mapIcon = document.getElementById('map-icon');
  const constellationOverlay = document.getElementById('constellation-overlay');
  const canvas = document.getElementById('constellation-canvas');
  const constellationClose = document.querySelector('#constellation-overlay .close-icon');
  const ctx = canvas.getContext('2d');

  let isAnyOverlayActive = false;
  let animationFrameId;

  // Generic icon effects
  document.querySelectorAll('.icon:not(#phone-icon)').forEach((icon) => {
    icon.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.1) rotate(5deg)';
    });

    icon.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1) rotate(0deg)';
    });

    icon.addEventListener('click', function () {
      if (this.id === 'search-icon' || this.id === 'map-icon' || this.id === 'hamburger-icon')
        return;
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1.1)';
      }, 100);
    });
  });

  // Consistent animation timing for smooth rendering
  shapes.forEach((shape, index) => {
    const delay = index * 2; // Predictable delays
    const duration = 10; // Consistent duration
    shape.style.animationDelay = `-${delay}s`;
    shape.style.animationDuration = `${duration}s`;
  });

  // Combined mousemove handler
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    // Background parallax - reduced intensity
    const intensity = 20;
    requestAnimationFrame(() => {
      background.style.transform = `translate(${mouseX * intensity}px, ${mouseY * intensity}px)`;
    });

    // Runaway phone logic
    if (phoneIcon && !isAnyOverlayActive) {
      const phoneMouseX = e.clientX;
      const phoneMouseY = e.clientY;
      const iconRect = phoneIcon.getBoundingClientRect();
      const iconX = iconRect.left + iconRect.width / 2;
      const iconY = iconRect.top + iconRect.height / 2;
      const dx = phoneMouseX - iconX;
      const dy = phoneMouseY - iconY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 120;

      if (distance < repelRadius) {
        const angle = Math.atan2(dy, dx);
        const moveDistance = repelRadius - distance;
        const newX = iconRect.left - Math.cos(angle) * moveDistance;
        const newY = iconRect.top - Math.sin(angle) * moveDistance;
        const buffer = 20;
        const boundedX = Math.max(
          buffer,
          Math.min(window.innerWidth - iconRect.width - buffer, newX)
        );
        const boundedY = Math.max(
          buffer,
          Math.min(window.innerHeight - iconRect.height - buffer, newY)
        );
        phoneIcon.style.left = `${boundedX}px`;
        phoneIcon.style.top = `${boundedY}px`;
      }
    }
  });

  // Spotlight mousemove
  document.addEventListener('mousemove', (e) => {
    if (spotlightOverlay.classList.contains('active')) {
      spotlightOverlay.style.setProperty('--x', `${e.clientX}px`);
      spotlightOverlay.style.setProperty('--y', `${e.clientY}px`);

      skillWords.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const wordX = rect.left + rect.width / 2;
        const wordY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(wordX - e.clientX, 2) + Math.pow(wordY - e.clientY, 2));
        if (distance < 150) {
          word.classList.add('visible');
        } else {
          word.classList.remove('visible');
        }
      });
    }
  });

  // Menu functionality
  hamburgerIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOverlay.classList.add('open');
  });

  menuCloseIcon.addEventListener('click', () => {
    menuOverlay.classList.remove('open');
  });

  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
      menuOverlay.classList.remove('open');
    }
  });

  // Runaway phone setup
  window.addEventListener('load', () => {
    if (!phoneIcon) return;
    const rect = phoneIcon.getBoundingClientRect();
    phoneIcon.style.left = `${rect.left}px`;
    phoneIcon.style.top = `${rect.top}px`;
    phoneIcon.style.right = 'auto';
    phoneIcon.style.bottom = 'auto';
    phoneIcon.style.transition = 'left 0.5s ease-out, top 0.5s ease-out';
  });

  // Spotlight search
  searchIcon.addEventListener('click', () => {
    const isActive = spotlightOverlay.classList.toggle('active');
    isAnyOverlayActive = isActive;

    if (isActive) {
      spotlightInstructions.style.opacity = '1';
      setTimeout(() => {
        spotlightInstructions.style.opacity = '0';
      }, 4000);
    } else {
      spotlightInstructions.style.opacity = '0';
    }
  });

  // Close spotlight with its close icon
  document.querySelector('#spotlight-overlay .close-icon').addEventListener('click', () => {
    spotlightOverlay.classList.remove('active');
    isAnyOverlayActive = false;
  });

  // Constellation
  let iconsData = [];
  const constellations = [
    ['search', 'plus', 'hamburger'],
    ['phone', 'speech', 'mail'],
    ['arrows-down', 'arrow', 'expand'],
    ['cart', 'quote', 'sound'],
    ['map', 'plus', 'sound'],
    ['hamburger', 'search', 'map'],
    ['arrows-up', 'phone', 'mail'],
    ['expand', 'cart', 'arrows-down'],
  ];

  mapIcon.addEventListener('click', () => {
    document.body.classList.add('galaxy-mode-active');
    constellationOverlay.classList.add('active');
    isAnyOverlayActive = true;
    setupConstellation();
    animateConstellation();
  });

  constellationClose.addEventListener('click', () => {
    document.body.classList.remove('galaxy-mode-active');
    constellationOverlay.classList.remove('active');
    isAnyOverlayActive = false;
    cancelAnimationFrame(animationFrameId);
  });

  function setupConstellation() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    iconsData = [];
    document.querySelectorAll('.icon').forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      iconsData.push({
        id: icon.dataset.id,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        size: 4,
        color: 'rgba(255, 255, 255, 0.5)',
      });
    });
  }

  let mouse = { x: null, y: null };
  constellationOverlay.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animateConstellation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let hoveredStar = null;

    iconsData.forEach((star) => {
      const dist = Math.hypot(mouse.x - star.x, mouse.y - star.y);
      if (dist < 20) {
        star.size = 8;
        star.color = 'rgba(191, 255, 0, 1)';
        hoveredStar = star;
      } else {
        star.size = 4;
        star.color = 'rgba(255, 255, 255, 0.5)';
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
    });

    if (hoveredStar) {
      const belongingConstellations = constellations.filter((c) => c.includes(hoveredStar.id));
      belongingConstellations.forEach((constellation) => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(191, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        const firstStar = iconsData.find((s) => s.id === constellation[0]);
        ctx.moveTo(firstStar.x, firstStar.y);

        for (let i = 1; i < constellation.length; i++) {
          const nextStar = iconsData.find((s) => s.id === constellation[i]);
          ctx.lineTo(nextStar.x, nextStar.y);
        }
        if (constellation.length > 2) ctx.closePath();
        ctx.stroke();
      });
    }

    animationFrameId = requestAnimationFrame(animateConstellation);
  }

  window.addEventListener('resize', () => {
    if (constellationOverlay.classList.contains('active')) {
      setupConstellation();
    }
  });
});
