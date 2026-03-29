/**
 * ERG Interactive Logos - Matter.js
 * Optimized for SiteCore SectionManager Handshake
 */

(function () {
  'use strict';

  // Variables shared between init and sectionManager
  let engine, runner, render, container, walls;

  // 1. Safe Registration Logic
  function registerWithManager() {
    if (window.sectionManager) {
      // Target the parent section ID used in built-different.html
      window.sectionManager.register(
        'section-erg-container',
        () => {
          if (runner && engine) {
            Matter.Runner.run(runner, engine);
          }
        },
        () => {
          if (runner) {
            Matter.Runner.stop(runner);
          }
        }
      );
    } else {
      setTimeout(registerWithManager, 50);
    }
  }

  window.initErgPhysics = function () {
    if (typeof Matter === 'undefined') {
      console.warn('ERG: Matter.js not found, retrying...');
      setTimeout(window.initErgPhysics, 50);
      return;
    }

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Vector } =
      Matter;

    // --- 2. ENGINE CREATION & GLOBAL EXPORT ---
    if (window.matterEngine) {
      // Cleanup existing if any
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(window.matterEngine);
      container.innerHTML = '';
    }

    engine = Engine.create();
    window.matterEngine = engine;

    const world = engine.world;
    engine.gravity.y = 0;

    container = document.getElementById('erg-canvas-container');
    if (!container) {
      console.error('ERG: container #erg-canvas-container not found');
      return;
    }

    const width = container.offsetWidth || 1200;
    const height = container.offsetHeight || 600;

    render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: 1, // Enforce 1 to prevent stretching on high-DPI screens
      },
    });

    const ergData = {
      caregiver: {
        name: 'Caregiver Support',
        desc: 'Compassion-led support for those balancing work and caregiving responsibilities.',
      },
      interfaith: {
        name: 'Interfaith',
        desc: 'Celebrating diverse spiritual paths and fostering shared values across our workforce.',
      },
      generation: {
        name: 'Generation',
        desc: 'Bridging the gap between age groups for a thriving multi-generational workforce.',
      },
      lgbtqia: {
        name: 'LGBTQIA+',
        desc: 'Advocating for authenticity, equity, and inclusion across the entire spectrum.',
      },
      military: {
        name: 'Military',
        desc: 'Supporting veterans and active service members as they navigate their corporate careers.',
      },
      race: {
        name: 'Race',
        desc: 'Promoting racial equity and celebrating the rich cultural heritage of our team.',
      },
      'women-in-tech': {
        name: 'Women in Technology',
        desc: 'Empowering women to lead, innovate, and break barriers in the tech space.',
      },
      remote: {
        name: 'Remote Workforce',
        desc: 'Cultivating connection and community across physical and digital distances.',
      },
      wellness: {
        name: 'Wellness & Ability',
        desc: 'Focusing on holistic health and inclusive accessibility for every individual.',
      },
    };

    const basePath = '/assets/merge/erg/';
    const groups = Object.keys(ergData);
    const coinRadius = 60; // Slightly smaller for better fit

    const coins = groups.map(function (name, i) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const startX = width * 0.3 + col * (width * 0.2);
      const startY = height * 0.3 + row * (height * 0.2);

      return Bodies.circle(startX, startY, coinRadius, {
        label: name,
        restitution: 0.6,
        frictionAir: 0.08,
        render: {
          sprite: {
            texture: basePath + name + '-solid.png',
            xScale: 0.12,
            yScale: 0.12,
          },
        },
      });
    });

    const wallOptions = { isStatic: true, render: { visible: false } };
    walls = [
      Bodies.rectangle(width / 2, -50, width, 100, wallOptions), // Top
      Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // Bottom
      Bodies.rectangle(-50, height / 2, 100, height, wallOptions), // Left
      Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions), // Right
    ];

    Composite.add(world, coins.concat(walls));

    // Input Management
    const mouse = Mouse.create(render.canvas);

    // Remove default touch handlers to prevent scrolling interference
    mouse.element.removeEventListener('touchstart', mouse.touchstart);
    mouse.element.removeEventListener('touchmove', mouse.touchmove);
    mouse.element.removeEventListener('touchend', mouse.touchend);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    Composite.add(world, mouseConstraint);

    // Custom Touch Listeners
    render.canvas.addEventListener(
      'touchstart',
      (e) => {
        const touch = e.touches[0];
        const rect = render.canvas.getBoundingClientRect();
        const mousePosition = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        const hit = Matter.Query.point(coins, mousePosition);
        if (hit.length > 0) {
          e.preventDefault();
          mouse.touchstart(e);
        }
      },
      { passive: false }
    );

    render.canvas.addEventListener(
      'touchmove',
      (e) => {
        if (mouseConstraint.body) {
          e.preventDefault();
          mouse.touchmove(e);
        }
      },
      { passive: false }
    );

    render.canvas.addEventListener(
      'touchend',
      (e) => {
        mouse.touchend(e);
      },
      { passive: false }
    );

    // Popup Management
    let activePopupBody = null;
    let activePopupElement = null;

    Events.on(mouseConstraint, 'mousedown', function (event) {
      const body = event.source.body;
      if (body && ergData[body.label]) {
        createPopup(body);
      } else if (!body && activePopupElement) {
        removePopup();
      }
    });

    function createPopup(sourceBody) {
      if (activePopupElement) removePopup();
      const data = ergData[sourceBody.label];
      activePopupBody = Bodies.rectangle(
        sourceBody.position.x + (sourceBody.position.x > width / 2 ? -180 : 180),
        sourceBody.position.y,
        300,
        160,
        { isStatic: false, frictionAir: 0.12, render: { visible: false } }
      );
      activePopupElement = document.createElement('div');
      activePopupElement.className = 'erg-popup';
      activePopupElement.innerHTML = `<button class="popup-close">&times;</button><h5>${data.name}</h5><p>${data.desc}</p>`;
      container.appendChild(activePopupElement);
      activePopupElement.querySelector('.popup-close').onclick = removePopup;
      Composite.add(world, activePopupBody);
      requestAnimationFrame(() => activePopupElement.classList.add('active'));
    }

    function removePopup() {
      if (activePopupElement) {
        activePopupElement.classList.remove('active');
        const el = activePopupElement;
        setTimeout(() => el.remove(), 300);
        activePopupElement = null;
      }
      if (activePopupBody) {
        Composite.remove(world, activePopupBody);
        activePopupBody = null;
      }
    }

    Events.on(engine, 'afterUpdate', function () {
      if (activePopupBody && activePopupElement) {
        activePopupElement.style.left = activePopupBody.position.x + 'px';
        activePopupElement.style.top = activePopupBody.position.y + 'px';
        activePopupElement.style.transform = `translate(-50%, -50%) rotate(${activePopupBody.angle}rad)`;
      }
      coins.forEach((coin) => {
        const force = Vector.mult(
          Vector.sub({ x: width / 2, y: height / 2 }, coin.position),
          0.00001
        );
        Matter.Body.applyForce(coin, coin.position, force);
      });
    });

    Render.run(render);

    // --- 3. RUNNER CREATION & GLOBAL EXPORT ---
    runner = Runner.create();
    window.matterRunner = runner;

    // Start registration loop
    registerWithManager();

    // Initial state: Sleep if manager exists, but ensure it starts if section is active
    if (window.sectionManager) {
      const el = document.getElementById('section-erg-container');
      if (el && el.getAttribute('data-is-intersecting') === 'true') {
        Runner.run(runner, engine);
      } else {
        // Ensure it's stopped initially if not in view
        setTimeout(() => Runner.stop(runner), 10);
      }
    } else {
      Runner.run(runner, engine);
    }

    // Resize Handler
    window.addEventListener('resize', function () {
      if (render && container && walls) {
        const newWidth = container.offsetWidth;
        const newHeight = container.offsetHeight;
        render.canvas.width = newWidth;
        render.canvas.height = newHeight;
        Matter.Body.setPosition(walls[0], { x: newWidth / 2, y: -50 });
        Matter.Body.setPosition(walls[1], { x: newWidth / 2, y: newHeight + 50 });
        Matter.Body.setPosition(walls[2], { x: -50, y: newHeight / 2 });
        Matter.Body.setPosition(walls[3], { x: newWidth + 50, y: newHeight / 2 });
      }
    });
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initErgPhysics);
  } else {
    window.initErgPhysics();
  }
})();
