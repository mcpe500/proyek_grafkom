// this is inside game.js

import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

let scene, camera, renderer, controls;
let geometry, material, mesh;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.8; // Set the camera to be 1.8 units high, like a person's eyes

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  // Lock the pointer when clicked
  document.addEventListener(
    "click",
    function () {
      controls.lock();
    },
    false
  );

  // Ground
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("./image/resize/resize_dirt.jpg", function (texture) {
    geometry = new THREE.PlaneGeometry(5, 5, 32, 32);
    material = new THREE.MeshBasicMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });

  // Listen for screen resize and adjust
  window.addEventListener("resize", onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
