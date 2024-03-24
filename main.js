import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
scene.background = spaceTexture;

// Avatar

const jeffTexture = new THREE.TextureLoader().load('cat.png');

const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));

scene.add(jeff);

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);

// Mars (Add only once)
const marsTexture = new THREE.TextureLoader().load('mars.jpeg');
const normal2Texture = new THREE.TextureLoader().load('normal2.jpeg');
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: normal2Texture,
  })
);
scene.add(mars);
mars.position.z = 47;
mars.position.setX(-20);


// Jupiter
const JupiterTexture = new THREE.TextureLoader().load('jupiter.jpeg');
const normal3Texture = new THREE.TextureLoader().load('normal3.jpeg');

const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 40),
  new THREE.MeshStandardMaterial({
    map: JupiterTexture,
    normalMap: normal3Texture,
  })
);
scene.add(jupiter);
jupiter.position.z = 35;
jupiter.position.setX(-20);


// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  mars.rotation.x += 0.05;
  jupiter.rotation.x += 0.05;
  jeff.rotation.y += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;
  mars.rotation.x += 0.005;
  jupiter.rotation.x += 0.005;

  // Uncomment if you want to use OrbitControls
  // controls.update();

  renderer.render(scene, camera);
}

//mouseclick on moon and mars
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', onClick, false);
window.addEventListener('mousemove', onMouseMove, false);

function onClick(event) {
  // Convert the mouse click position to normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Detect objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object === moon) {
      // Redirect to the Moon page
      window.location.href = 'uxdesign.html';
    } else if (intersects[i].object === mars) {
      // Redirect to the Mars page
      window.location.href = 'path/to/mars-page.html';
    }
  }
}

//lighting up the moon, mars, and jupiter
function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects([moon, mars, jupiter]);

  // Reset emissive color for all objects
  moon.material.emissive.setHex(0x000000);
  mars.material.emissive.setHex(0x000000);
  jupiter.material.emissive.setHex(0x000000);

  // Check intersections and apply hover effect
  intersects.forEach((intersect) => {
    intersect.object.material.emissive.setHex(0x555555);
  });
}

animate();

