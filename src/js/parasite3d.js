(function () {
  'use strict';

  let scene,
    camera,
    renderer,
    controls,
    parasites = [];
  let animationFrameId = null,
    isPaused = true;
  let env = null,
    sprite = null;
  let activeAttack = null,
    hoveredParasite = null;
  let frame = 0,
    interval = null;
  let isMuted = false;
  let squishAudio = null; // Singleton audio object

  // 1. LOAD SAVED DATA IMMEDIATELY
  let squishCount = parseInt(localStorage.getItem('totalSquishes')) || 0;

  const clk = new THREE.Clock();
  const ms = new THREE.Vector2();
  const rc = new THREE.Raycaster();

  const fx = {
    moxi: { columns: 6, totalFrames: 26 },
    prazi: { columns: 5, totalFrames: 22 },
    pyra: { columns: 4, totalFrames: 13 },
  };

  window.parasiteAnim = {
    play: function () {
      if (!isPaused) return;
      if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
        setTimeout(() => window.parasiteAnim.play(), 100);
        return;
      }
      isPaused = false;
      if (!scene) initScene();
      clk.start();
      animate();
    },
    pause: function () {
      isPaused = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (interval) clearInterval(interval);
      clk.stop();
    },
  };

  function initScene() {
    const container = document.getElementById('canvas-container');
    sprite = document.getElementById('attack-sprite');
    if (!container) return;

    // Preload sprites
    ['moxi', 'prazi', 'pyra'].forEach((type) => {
      const img = new Image();
      img.src = `/assets/para/sprite_attacks/sprite-attacks-min/${type}_attack-min.png`;
    });

    // Initialize Audio
    squishAudio = new Audio('/assets/para/audio/Squish.wav');
    squishAudio.load();

    // Audio Warm-up (Unblock Context)
    const unblockAudio = () => {
      const tempAudio = new Audio('/assets/para/audio/Squish.wav');
      tempAudio.volume = 0;
      tempAudio
        .play()
        .then(() => {
          console.log('Trudy: Audio context unblocked.');
          window.removeEventListener('click', unblockAudio);
          window.removeEventListener('touchstart', unblockAudio);
        })
        .catch(() => {});
    };
    window.addEventListener('click', unblockAudio);
    window.addEventListener('touchstart', unblockAudio);

    // --- SCENE INITIALIZATION ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dl = new THREE.DirectionalLight(0xffffff, 1.0);
    dl.position.set(5, 8, 5);
    scene.add(dl);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.enableZoom = false;

    // --- UI INITIALIZATION ---
    const countEl = document.getElementById('squish-count');
    if (countEl) {
      countEl.textContent = squishCount.toString().padStart(3, '0');
    }

    const resetBtn = document.getElementById('parasite-reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset your hunting progress to zero?')) {
          squishCount = 0;
          localStorage.setItem('totalSquishes', 0);
          if (countEl) countEl.textContent = '000';
        }
      });
    }

    const audioBtn = document.getElementById('parasite-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        audioBtn.classList.toggle('muted', isMuted);

        const mutedSVG = `
					<svg width="24" height="24" viewBox="0 0 265 265" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M82.8125 49.6875V215.312H99.375V49.6875H82.8125ZM165.625 49.6875V215.312H182.188V49.6875H165.625Z" fill="white"/>
					</svg>`;

        const unmutedSVG = `
					<svg width="24" height="24" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M36.4639 7.70801L32.7773 11.3276L20.5109 23.594H10.7246V45.0434H20.5109L32.7773 57.3097L36.4639 60.9293V7.70801ZM51.0763 17.5613L48.06 20.5776C55.6092 28.1268 55.6092 40.2424 48.06 47.7916L51.0763 50.8749C60.2593 41.6919 60.2593 26.7443 51.0763 17.5613ZM32.174 18.0976V50.5398L22.991 41.3567L22.3207 40.7535H15.0145V27.8838H22.3207L22.991 27.2806L32.174 18.0976ZM44.8426 23.7951L41.8262 26.8114C45.9234 30.9085 45.9067 37.6953 41.7592 42.027L44.9096 45.0434C50.6238 39.0778 50.6071 29.5596 44.8426 23.7951Z" fill="white"/>
					</svg>`;

        audioBtn.querySelector('.icon').innerHTML = isMuted ? mutedSVG : unmutedSVG;
        audioBtn.querySelector('.label').textContent = isMuted ? 'Sound Off' : 'Sound On';
      });
    }

    window.addEventListener('mousemove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ms.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ms.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    loadModels();
  }

  function playSquish() {
    console.log('Trudy: Parasite squished. Playing audio...');
    squishCount++;
    localStorage.setItem('totalSquishes', squishCount);

    const countEl = document.getElementById('squish-count');
    if (countEl) {
      countEl.textContent = squishCount.toString().padStart(3, '0');

      // Visual Pop on the counter UI itself
      const uiBox = document.getElementById('parasite-counter-ui');
      if (uiBox) {
        uiBox.style.transform = 'scale(1.1)';
        setTimeout(() => {
          uiBox.style.transform = 'scale(1)';
        }, 100);
      }

      countEl.classList.remove('score-pop');
      void countEl.offsetWidth;
      countEl.classList.add('score-pop');
    }

    if (isMuted || !squishAudio) return;
    const sound = squishAudio.cloneNode();
    sound.volume = 0.6;
    sound.playbackRate = 0.9 + Math.random() * 0.4;
    sound.play().catch((e) => {
      console.warn('Trudy: Audio play failed.', e);
    });
  }

  function loadModels() {
    const ldr = new THREE.GLTFLoader();

    ldr.load('/assets/para/3d/heartworm-environment.gltf', (g) => {
      env = g.scene;
      env.position.set(1, 0, -2);
      scene.add(env);
    });

    const data = [
      {
        name: 'Flea',
        file: '/assets/para/3d/flea.gltf',
        pos: [-3, 2, 1],
        attack: 'moxi',
        offset: 0.5,
      },
      {
        name: 'Heartworm',
        file: '/assets/para/3d/heartworm.gltf',
        pos: [2, 3, -1],
        attack: 'moxi',
        offset: 0.5,
      },
      {
        name: 'Hookworm',
        file: '/assets/para/3d/hookworm.gltf',
        pos: [-2, 1, -2],
        attack: 'pyra',
        offset: 0.8,
      },
      {
        name: 'Roundworm',
        file: '/assets/para/3d/roundworm.gltf',
        pos: [3, 1.5, 2],
        attack: 'pyra',
        offset: 0.4,
      },
      {
        name: 'Tapeworm',
        file: '/assets/para/3d/tapeworm.gltf',
        pos: [0, 3.5, 0],
        attack: 'prazi',
        offset: 0.5,
      },
      {
        name: 'Tick',
        file: '/assets/para/3d/tick.gltf',
        pos: [-1, 0.5, 2],
        attack: 'prazi',
        offset: 0.5,
      },
    ];

    data.forEach((d, i) => {
      ldr.load(d.file, (g) => {
        if (d.name === 'Flea') {
          g.scene.traverse((c) => {
            if (c.isMesh) {
              c.material.metalness = 0.5;
              c.material.roughness = 0.4;
            }
          });
        }

        const grp = new THREE.Group();
        g.scene.scale.set(0.5, 0.5, 0.5);
        grp.add(g.scene);
        grp.position.set(...d.pos);
        grp.userData = {
          attack: d.attack,
          baseY: d.pos[1],
          index: i,
          offset: d.offset,
          isCaptured: false, // New state
        };
        scene.add(grp);
        parasites.push(grp);

        if (parasites.length === data.length) {
          const loader = document.getElementById('loading');
          if (loader) loader.style.display = 'none';
        }
      });
    });
  }

  let frameCount = 0;
  function animate() {
    if (isPaused) return;
    animationFrameId = requestAnimationFrame(animate);
    const t = clk.getElapsedTime();
    frameCount++;

    let currentHover = null;

    // Only check intersections every 3rd frame to save CPU
    if (frameCount % 3 === 0) {
      rc.setFromCamera(ms, camera);
      parasites.forEach((p) => {
        // Skip if already captured
        if (p.userData.isCaptured) {
          p.visible = false;
          return;
        }
        p.visible = true;

        if (rc.intersectObject(p, true).length > 0) currentHover = p;
      });

      if (!activeAttack) {
        if (currentHover) {
          if (hoveredParasite !== currentHover) {
            hoveredParasite = currentHover;
            captureParasite(currentHover);
          }
        } else if (hoveredParasite) {
          hoveredParasite = null;
          stopAttack();
        }
      }
    }

    // Always update positions and render
    parasites.forEach((p) => {
      if (!p.userData.isCaptured) {
        p.position.y = p.userData.baseY + Math.sin(t + p.userData.index) * 0.2;
        p.rotation.y += 0.005;
      }
    });

    if (hoveredParasite) updateSpritePos();

    if (controls) controls.update();
    renderer.render(scene, camera);
  }

  function captureParasite(p) {
    p.userData.isCaptured = true;
    playSquish();

    // Pass a callback to playAttack to hide the parasite when animation finishes
    playAttack(p.userData.attack, () => {
      p.visible = false;
      hoveredParasite = null; // Clear hover state so attack stops
    });

    // Respawn after 5 seconds
    setTimeout(() => {
      p.userData.isCaptured = false;
      p.visible = true;
      console.log(`Trudy: Parasite ${p.userData.index} has respawned.`);
    }, 5000);
  }

  function playAttack(type, onComplete) {
    if (activeAttack === type) return;
    activeAttack = type;
    frame = 0;
    const conf = fx[type];
    sprite.style.backgroundImage = `url('/assets/para/sprite_attacks/sprite-attacks-min/${type}_attack-min.png')`;
    const totalRows = Math.ceil(conf.totalFrames / conf.columns);
    sprite.style.backgroundSize = `${conf.columns * 100}% ${totalRows * 100}%`;
    sprite.style.width = '200px';
    sprite.style.height = '200px';
    sprite.classList.add('active');

    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      const col = frame % conf.columns,
        row = Math.floor(frame / conf.columns);
      sprite.style.backgroundPosition = `${(col / (conf.columns - 1)) * 100}% ${(row / (totalRows - 1)) * 100}%`;
      frame++;
      if (frame >= conf.totalFrames) {
        stopAttack();
        if (onComplete) onComplete(); // Trigger hiding of parasite
      }
    }, 45);
  }

  function stopAttack() {
    activeAttack = null;
    if (sprite) sprite.classList.remove('active');
    if (interval) clearInterval(interval);
  }

  function updateSpritePos() {
    if (!hoveredParasite || !sprite || !renderer) return;
    const v = new THREE.Vector3();
    hoveredParasite.getWorldPosition(v);
    v.y += hoveredParasite.userData.offset || 0;
    v.project(camera);

    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const x = (v.x * 0.5 + 0.5) * width;
    const y = (v.y * -0.5 + 0.5) * height;

    sprite.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  }

  window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
