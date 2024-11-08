import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 5);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd1ffff, 1); // Background color
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true; // Enable shadows
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffcc00, 0.8, 10);
pointLight.position.set(-3, 5, 3);
scene.add(pointLight);

// Geometry declaration
const smallBuilding = new THREE.BoxGeometry(1, 2, 1);
const largeBuilding = new THREE.BoxGeometry(1, 4, 2);
const convict = new THREE.BoxGeometry(1, 3, 2.5);
const roadGeometry = new THREE.PlaneGeometry(1, 10);
const road1Geometry = new THREE.PlaneGeometry(1, 7.8);
const plain = new THREE.PlaneGeometry(10, 10);

// Material Declaration (Using MeshStandardMaterial)
const orange = new THREE.MeshStandardMaterial({ color: 0xf2bf18 });
const white = new THREE.MeshStandardMaterial({ color: 0xdae5eb });
const blue = new THREE.MeshStandardMaterial({ color: 0x0c78ad });
const grass = new THREE.MeshStandardMaterial({ color: 0x027812 });
const gray = new THREE.MeshStandardMaterial({ color: 0x5a5e5a });

// Function to create outlines
function addOutline(mesh, color, thickness = 1) {
  const edges = new THREE.EdgesGeometry(mesh.geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: color, linewidth: thickness });
  const line = new THREE.LineSegments(edges, lineMaterial);
  mesh.add(line);
  return line;
}

// Create the campus objects
const terrain = new THREE.Mesh(plain, grass);
terrain.receiveShadow = true; // Enable receiving shadows
addOutline(terrain, 0x000000, 4); // Add black outline for terrain with thicker lines

const road = new THREE.Mesh(roadGeometry, gray);
road.receiveShadow = true;

const road1 = new THREE.Mesh(road1Geometry, gray);
road1.receiveShadow = true;

const buildingLibrary = new THREE.Mesh(largeBuilding, white);
buildingLibrary.castShadow = true;
addOutline(buildingLibrary, 0x404040); // Dark gray outline for buildingLibrary

const building816 = new THREE.Mesh(smallBuilding, blue);
building816.castShadow = true;
addOutline(building816, 0x404040); // Dark gray outline for building816

const buildingConvict = new THREE.Mesh(convict, orange);
buildingConvict.castShadow = true;
addOutline(buildingConvict, 0x404040); // Dark gray outline for buildingConvict

// Rotations
terrain.rotation.x = -Math.PI / 2;
road.rotation.x = -Math.PI / 2;
road1.rotation.x = -Math.PI / 2;
building816.rotation.x = -Math.PI / 2;
buildingLibrary.rotation.x = -Math.PI / 2;
buildingConvict.rotation.x = -Math.PI / 2;

// Positioning
building816.position.set(1.2, 0.5, 3.5);
road.position.set(-0.2, 0.01, 0);
road1.position.set(2.15, 0.01, 0.8);
road1.rotateZ(0.7);
buildingLibrary.position.set(-1.5, 1, 0);
buildingConvict.position.set(3, 1.2, -0.5);
buildingConvict.rotateZ(0.7);

scene.add(terrain, road, road1, buildingLibrary, building816, buildingConvict);

// Create a sphere to move around the campus roads
const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const movingSphere = new THREE.Mesh(sphereGeometry, redMaterial);
movingSphere.castShadow = true;
movingSphere.position.set(-0.2, 0.2, -4);
scene.add(movingSphere);

// Define the GSAP animation to move the sphere around the roads
function animateSphere() {
  gsap.to(movingSphere.position, {
    duration: 3,
    x: -0.2,
    z: 3.5,
    ease: 'power1.inOut',
    onComplete: () => {
      gsap.to(movingSphere.position, {
        duration: 3,
        x: 0,
        z: -2,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.to(movingSphere.position, {
            duration: 3,
            x: 5,
            z: 4,
            ease: 'power1.inOut',
            onComplete: () => {
              gsap.to(movingSphere.position, {
                duration: 3,
                x: 0,
                z: -2,
                ease: 'power1.inOut',
                onComplete: animateSphere // Loop the animation
              });
            }
          });
        }
      });
    }
  });
}

animateSphere();

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2; // Restrict to top-down view
controls.minPolarAngle = Math.PI / 4;

// Animation Loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
