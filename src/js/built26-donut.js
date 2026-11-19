// BUILT 26 hero: 3D donut of the attendee archetype breakdown.
// Data and colors come from the legend markup (data-count / data-color on each <li>),
// so the numbers live in the HTML and the legend doubles as the accessible version.
// Expects the global THREE from the three@0.146.0 CDN script, same as the Parasite page.

const root = document.querySelector('.built26-donut');
const THREE = window.THREE;

if (root && THREE) {
  const canvas = root.querySelector('canvas');
  const items = [...root.querySelectorAll('.donut-legend li')];
  const data = items.map((li) => ({ li, count: Number(li.dataset.count), color: li.dataset.color }));
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fill in each legend row's percentage from the counts.
  data.forEach((d) => {
    const pct = d.li.querySelector('.pct');
    if (pct) pct.textContent = `${((d.count / total) * 100).toFixed(1)}%`;
  });

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding; // so slice colors match the legend hex values
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 3.1, 4.6);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.65);
  key.position.set(2, 5, 3);
  scene.add(key);

  // One extruded ring segment per archetype, with a small gap between slices.
  const OUTER = 1.35;
  const INNER = 0.86;
  const DEPTH = 0.32;
  const GAP = 0.025;
  const ring = new THREE.Group();
  let start = Math.PI / 2;
  const slices = data.map((d) => {
    const sweep = (d.count / total) * Math.PI * 2;
    const a0 = start + GAP;
    const a1 = start + sweep - GAP;
    start += sweep;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, OUTER, a0, a1, false);
    shape.absarc(0, 0, INNER, a1, a0, true);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 48,
    });
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: new THREE.Color(d.color).convertSRGBToLinear(), roughness: 0.6, metalness: 0 }),
    );
    const mid = (a0 + a1) / 2;
    mesh.userData = { li: d.li, dir: new THREE.Vector2(Math.cos(mid), Math.sin(mid)), lift: 0 };
    ring.add(mesh);
    return mesh;
  });
  ring.rotation.x = -Math.PI / 2; // lay the ring flat; the camera looks down at it
  scene.add(ring);

  // Hover a slice or its legend row to pop that slice out.
  let active = null;
  const setActive = (mesh) => {
    active = mesh;
    items.forEach((li) => li.classList.toggle('is-active', mesh && mesh.userData.li === li));
  };
  items.forEach((li, i) => {
    li.addEventListener('mouseenter', () => setActive(slices[i]));
    li.addEventListener('mouseleave', () => setActive(null));
    li.addEventListener('focus', () => setActive(slices[i]));
    li.addEventListener('blur', () => setActive(null));
  });
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(slices)[0];
    setActive(hit ? hit.object : null);
  });
  canvas.addEventListener('pointerleave', () => setActive(null));

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  // Keep the center label pinned to the middle of the hole's top surface.
  const centerLabel = root.querySelector('.donut-center');
  const holeTop = new THREE.Vector3(0, DEPTH, 0);
  const placeLabel = () => {
    if (!centerLabel) return;
    const v = holeTop.clone().project(camera);
    centerLabel.style.left = `${((v.x + 1) / 2) * 100}%`;
    centerLabel.style.top = `${((1 - v.y) / 2) * 100}%`;
  };

  const tick = () => {
    if (!reduceMotion) ring.rotation.z += 0.0025;
    slices.forEach((m) => {
      const target = m === active ? 0.14 : 0;
      m.userData.lift += (target - m.userData.lift) * 0.15;
      m.position.set(m.userData.dir.x * m.userData.lift, m.userData.dir.y * m.userData.lift, m.userData.lift * 0.6);
    });
    placeLabel();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
}
