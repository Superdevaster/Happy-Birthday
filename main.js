// ==========================================
// 1. SILKY DREAMSCAPE (Three.js)
// ==========================================
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xfce3ec, 0.02);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- The Silk/Ocean Plane ---
const planeGeometry = new THREE.PlaneGeometry(120, 120, 64, 64);
const planeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffb6c1,
  emissive: 0x2a0010,
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8
});

const silkPlane = new THREE.Mesh(planeGeometry, planeMaterial);
silkPlane.rotation.x = -Math.PI / 2;
scene.add(silkPlane);

// --- Floating Fairy Dust (Stars) ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 600;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 100; // X, Y, Z spread
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.3,
  color: 0xffffff,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});

const stars = new THREE.Points(particlesGeometry, particlesMaterial);
stars.position.y = 10;
scene.add(stars);

// --- Romantic Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff69b4, 1.5, 100);
pointLight1.position.set(20, 20, 20);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
pointLight2.position.set(-20, 10, -20);
scene.add(pointLight2);

// --- Animation Loop ---
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.015;

  // Animate the vertices of the plane to make it flow like silk
  const positionAttribute = planeGeometry.attributes.position;
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    // Smooth, intersecting sine waves for a soft ocean effect
    const z = Math.sin(x * 0.1 + time) * 2 + Math.cos(y * 0.1 + time) * 2;
    positionAttribute.setZ(i, z);
  }
  positionAttribute.needsUpdate = true;

  // Slowly rotate the stars
  stars.rotation.y = time * 0.05;

  // Gentle camera sway
  camera.position.x = Math.sin(time * 0.5) * 5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================
// 2. UI AND NAVIGATION LOGIC
// ==========================================
const audio = document.getElementById('bg-music');

function startJourney() {
  // Fade in music
  if (audio) {
    audio.volume = 0;
    audio.play().then(() => {
      let fadeAudio = setInterval(() => {
        if (audio.volume < 0.9) audio.volume += 0.1;
        else clearInterval(fadeAudio);
      }, 200);
    }).catch(e => console.log("Audio interaction required"));
  }

  // Fade out intro, fade in gallery
  document.getElementById('screen-intro').classList.remove('active');

  setTimeout(() => {
    document.getElementById('screen-intro').classList.add('hidden');
    document.getElementById('screen-gallery').classList.remove('hidden');

    setTimeout(() => {
      document.getElementById('screen-gallery').classList.add('active');
    }, 50);
  }, 1800);
}

function goToFinal() {
  // Fade out gallery, fade in final wish
  document.getElementById('screen-gallery').classList.remove('active');

  setTimeout(() => {
    document.getElementById('screen-gallery').classList.add('hidden');
    document.getElementById('screen-final').classList.remove('hidden');

    setTimeout(() => {
      document.getElementById('screen-final').classList.add('active');
    }, 50);
  }, 1800);
}