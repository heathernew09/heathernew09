/* ============================================
   HOME HERO INTERACTIONS
   ============================================ */

// Wait for both DOM and includes to be ready
function initHeroInteractions() {
  console.log('Home hero script initializing...');

  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) {
    console.warn('Hero section not found');
    return;
  }

  // ============================================
  // AUDIO SYSTEM
  // ============================================
  const soundIcon = document.querySelector('.icon[data-id="sound"]');
  let audioElement = null;
  let isPlaying = false;

  console.log('Sound icon:', soundIcon);

  if (soundIcon) {
    soundIcon.addEventListener('click', function (e) {
      console.log('Sound icon clicked');
      e.preventDefault();
      e.stopPropagation();

      if (!audioElement) {
        audioElement = new Audio('/assets/para/audio/environment1.m4a');
        audioElement.loop = true;
        audioElement.volume = 0.3;

        audioElement.addEventListener('canplay', () => {
          console.log('Audio ready to play');
        });

        audioElement.addEventListener('error', (e) => {
          console.error('Audio error:', e);
        });
      }

      if (isPlaying) {
        audioElement.pause();
        soundIcon.classList.remove('playing');
        soundIcon.classList.add('muted');
        isPlaying = false;
        console.log('Audio paused');
      } else {
        audioElement
          .play()
          .then(() => {
            soundIcon.classList.add('playing');
            soundIcon.classList.remove('muted');
            isPlaying = true;
            console.log('Audio playing');
          })
          .catch((err) => {
            console.error('Audio play failed:', err);
            alert('Audio failed to play. Check console for details.');
          });
      }
    });
  }

  // ============================================
  // PHONE RUNAWAY INTERACTION
  // ============================================
  const phoneIcon = document.querySelector('#phone-icon');
  let phoneRunCount = 0;
  const maxRuns = 5;

  console.log('Phone icon:', phoneIcon);

  if (phoneIcon) {
    document.addEventListener('mousemove', function (e) {
      if (phoneRunCount >= maxRuns) return;

      const phoneRect = phoneIcon.getBoundingClientRect();
      const phoneCenterX = phoneRect.left + phoneRect.width / 2;
      const phoneCenterY = phoneRect.top + phoneRect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distance = Math.sqrt(
        Math.pow(mouseX - phoneCenterX, 2) + Math.pow(mouseY - phoneCenterY, 2)
      );

      // If mouse is within 120px, run away
      if (distance < 120) {
        phoneRunCount++;
        console.log('Phone running away! Count:', phoneRunCount);

        // Calculate direction away from mouse
        const angle = Math.atan2(phoneCenterY - mouseY, phoneCenterX - mouseX);

        // Get current position
        const currentBottom = parseFloat(phoneIcon.style.bottom) || 15;
        const currentRight = parseFloat(phoneIcon.style.right) || 18;

        // Calculate new position (move away from mouse)
        const moveDistance = 15; // percentage points to move
        const newRight = currentRight + Math.cos(angle) * moveDistance;
        const newBottom = currentBottom + Math.sin(angle) * moveDistance;

        // Keep within reasonable bounds (10% to 80%)
        const boundedRight = Math.max(10, Math.min(80, newRight));
        const boundedBottom = Math.max(10, Math.min(80, newBottom));

        phoneIcon.style.right = boundedRight + '%';
        phoneIcon.style.bottom = boundedBottom + '%';

        // After max runs, fade out
        if (phoneRunCount >= maxRuns) {
          setTimeout(() => {
            phoneIcon.style.opacity = '0.2';
            phoneIcon.style.cursor = 'not-allowed';
            phoneIcon.setAttribute('data-disabled', 'true');
          }, 500);
        }
      }
    });

    phoneIcon.addEventListener('click', function (e) {
      if (phoneIcon.getAttribute('data-disabled') === 'true') {
        e.preventDefault();
        showPhoneTooltip(phoneIcon);
      }
    });
  }

  function showPhoneTooltip(target) {
    // Remove existing if any
    const old = document.querySelector('.phone-tooltip');
    if (old) old.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'phone-tooltip';
    tooltip.innerText = "good luck even my dog couldn't get me on the phone.";
    document.body.appendChild(tooltip);

    const rect = target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 10 + 'px';

    setTimeout(() => {
      tooltip.classList.add('fade-out');
      setTimeout(() => tooltip.remove(), 500);
    }, 3000);
  }

  // ============================================
  // TESTIMONIALS OVERLAY
  // ============================================
  const quoteIcon = document.querySelector('.icon[data-id="quote"]');
  const testimonialsOverlay = document.getElementById('testimonials-overlay');
  const closeTestimonials = document.querySelector('.close-testimonials');

  console.log('Quote icon:', quoteIcon);
  console.log('Testimonials overlay:', testimonialsOverlay);

  if (quoteIcon) {
    quoteIcon.addEventListener('click', function (e) {
      console.log('Quote icon clicked');
      e.preventDefault();
      e.stopPropagation();

      if (testimonialsOverlay) {
        testimonialsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        console.error('Testimonials overlay not found in DOM');
      }
    });
  }

  if (closeTestimonials) {
    closeTestimonials.addEventListener('click', function () {
      testimonialsOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (testimonialsOverlay) {
    // Close on overlay background click
    testimonialsOverlay.addEventListener('click', function (e) {
      if (e.target === testimonialsOverlay) {
        testimonialsOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && testimonialsOverlay?.classList.contains('active')) {
      testimonialsOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ============================================
  // ORGANIC SHAPE ANIMATIONS (Performance)
  // ============================================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-is-intersecting', 'true');
        } else {
          entry.target.setAttribute('data-is-intersecting', 'false');
        }
      });
    },
    { threshold: 0.1 }
  );

  if (heroSection) {
    observer.observe(heroSection);
  }

  console.log('Home hero script initialization complete');
}

// Try multiple initialization strategies
document.addEventListener('DOMContentLoaded', function () {
  console.log('Home hero script loaded - DOMContentLoaded');

  // Try immediately
  initHeroInteractions();

  // Also try after a short delay (for includes)
  setTimeout(initHeroInteractions, 100);
  setTimeout(initHeroInteractions, 500);
});

// Listen for custom event from include.js if it dispatches one
window.addEventListener('includesLoaded', function () {
  console.log('Includes loaded event received');
  initHeroInteractions();
});
