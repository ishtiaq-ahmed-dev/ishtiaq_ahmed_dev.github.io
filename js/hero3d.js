import * as THREE from "three";

/* -------- shared helpers -------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const dpr = Math.min(window.devicePixelRatio || 1, 2);

/* =========================================================
   Hero scene — distorted metallic sphere with fresnel rim,
   floating dust, subtle parallax
   ========================================================= */
function initHero() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0f1e, 6, 14);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x0a0f1e, 1);

  /* ---- Distorted sphere: custom shader on IcosahedronGeometry ---- */
  const geo = new THREE.IcosahedronGeometry(1.4, 64);

  const uniforms = {
    uTime: { value: 0 },
    uDistort: { value: 0.35 },
    uSpeed: { value: prefersReducedMotion ? 0.05 : 0.28 },
    uColorA: { value: new THREE.Color(0xe8b662) }, // gold
    uColorB: { value: new THREE.Color(0xff6a3d) }, // orange
    uColorC: { value: new THREE.Color(0x0a0f1e) }, // deep base
    uMouse: { value: new THREE.Vector2(0, 0) },
  };

  const vertexShader = /* glsl */`
    uniform float uTime;
    uniform float uDistort;
    uniform float uSpeed;
    varying vec3 vNormal;
    varying vec3 vViewPos;
    varying float vNoise;

    /* 3D simplex noise — Ashima Arts / Ian McEwan */
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      float t = uTime * uSpeed;
      float n = snoise(normal * 1.6 + vec3(t, t*0.7, t*0.3));
      float n2 = snoise(normal * 3.4 + vec3(-t*0.5, t*0.2, t*0.4));
      float displacement = uDistort * (n * 0.7 + n2 * 0.3);
      vNoise = displacement;
      vec3 newPos = position + normal * displacement;
      vec4 mvPos = modelViewMatrix * vec4(newPos, 1.0);
      vViewPos = -mvPos.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * mvPos;
    }
  `;

  const fragmentShader = /* glsl */`
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewPos;
    varying float vNoise;

    void main() {
      vec3 V = normalize(vViewPos);
      float fresnel = pow(1.0 - max(dot(normalize(vNormal), V), 0.0), 2.4);

      /* base gradient from bottom-dark to top-light using vNoise */
      float mixT = smoothstep(-0.4, 0.4, vNoise);
      vec3 base = mix(uColorC, mix(uColorB, uColorA, mixT), 0.55);

      /* rim glow */
      vec3 rim = mix(uColorA, uColorB, 0.4) * fresnel * 1.6;

      /* subtle iridescent shimmer along view */
      float shimmer = sin(vNoise * 12.0 + uTime * 0.6) * 0.05;

      vec3 color = base + rim + shimmer;
      /* keep body dark, let rim carry the light */
      color = mix(uColorC * 0.4, color, 0.55 + fresnel * 0.7);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const mat = new THREE.ShaderMaterial({
    uniforms, vertexShader, fragmentShader,
    transparent: false,
  });

  const blob = new THREE.Mesh(geo, mat);
  blob.position.x = 1.2;
  scene.add(blob);

  /* ---- Particles ---- */
  const particleCount = prefersReducedMotion ? 200 : 900;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 4 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i * 3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

  const pMat = new THREE.PointsMaterial({
    color: 0xe8b662,
    size: 0.012,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  /* ---- Resize ---- */
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    /* pull blob further right on wide screens, center on mobile */
    blob.position.x = w > 900 ? 1.4 : 0;
    blob.position.y = w > 900 ? 0 : -0.6;
    blob.scale.setScalar(w > 900 ? 1 : 0.85);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ---- Mouse parallax ---- */
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener("touchmove", (e) => {
    if (!e.touches[0]) return;
    target.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ---- Animate ---- */
  const clock = new THREE.Clock();
  let running = true;

  const io = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
  }, { threshold: 0.02 });
  io.observe(canvas);

  function tick() {
    if (running) {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      blob.rotation.y = t * 0.12 + current.x * 0.25;
      blob.rotation.x = current.y * 0.15;

      points.rotation.y = t * 0.02;
      points.rotation.x = t * 0.01;

      camera.position.x = current.x * 0.15;
      camera.position.y = -current.y * 0.15;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* =========================================================
   Footer scene — gentle gold particle field
   ========================================================= */
function initFooter() {
  const canvas = document.getElementById("footer-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const count = prefersReducedMotion ? 150 : 600;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    speed[i] = 0.2 + Math.random() * 0.8;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xe8b662,
    size: 0.02,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || 600;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let running = false;
  const io = new IntersectionObserver((entries) => {
    running = entries[0].isIntersecting;
  }, { threshold: 0.05 });
  io.observe(canvas);

  const clock = new THREE.Clock();
  function tick() {
    if (running) {
      const t = clock.getElapsedTime();
      const arr = geo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const iy = i * 3 + 1;
        arr[iy] += Math.sin(t * speed[i] + i) * 0.001;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.03;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* -------- boot -------- */
try {
  initHero();
  initFooter();
} catch (err) {
  /* WebGL unavailable — leave the dark hero backgrounds in place. */
  console.warn("3D disabled:", err);
}
