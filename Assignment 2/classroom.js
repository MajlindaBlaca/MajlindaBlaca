// classroomSetup.js - Handles setting up the classroom structure and models
import * as THREE from "https://esm.sh/three";
import { GLTFLoader } from "https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js";

export function createClassroom(scene) {
  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load("/textures/floor.jpg");
  const wallTexture = textureLoader.load("/textures/wall.jpg");
  const ceilingTexture = textureLoader.load("/textures/ceiling.jpg");

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 20),
    new THREE.MeshStandardMaterial({ map: floorTexture })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  scene.add(floor);

  // Walls
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  // Front wall (with window)
  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(16, 3, 0.1),
    wallMaterial
  );
  frontWall.position.set(0, 1.5, -10);
  scene.add(frontWall);

  // Back wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(16, 3, 0.1),
    wallMaterial
  );
  backWall.position.set(0, 1.5, 10);
  scene.add(backWall);

  // Left window
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xacfaed,
    opacity: 0.6,
    transparent: true,
    metalness: 0.6,
    roughness: 0.2,
  });

  const windowMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 0.1),
    windowMaterial
  );
  windowMesh.position.set(-8, 1.5, 0);
  windowMesh.rotation.y = Math.PI / 2;
  scene.add(windowMesh);

  // Left Panel (Covers left side of the wall)
  const leftPanel = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 0.5),
    wallMaterial
  );
  leftPanel.position.set(-8, 1.5, -8.6);
  leftPanel.rotation.y = Math.PI / 2;
  scene.add(leftPanel);

  // Right Panel (Covers right side of the wall)
  const rightPanel = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 0.5),
    wallMaterial
  );
  rightPanel.position.set(-8, 1.5, 8.6);
  rightPanel.rotation.y = Math.PI / 2;
  scene.add(rightPanel);

  // Top Panel (Above the window)
  const topPanel = new THREE.Mesh(
    new THREE.BoxGeometry(15, 1, 0.5),
    wallMaterial
  );
  topPanel.position.set(-8, 2.5, 0);
  topPanel.rotation.y = Math.PI / 2;
  scene.add(topPanel);

  // Bottom Panel (Below the window)
  const bottomPanel = new THREE.Mesh(
    new THREE.BoxGeometry(15, 1, 0.5),
    wallMaterial
  );
  bottomPanel.position.set(-8, 0.5, 0);
  bottomPanel.rotation.y = Math.PI / 2;
  scene.add(bottomPanel);

  // Middle Panel (Separates the two window sections)
  const middlePanel = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 0.5),
    wallMaterial
  );
  middlePanel.position.set(-8, 1.5, 0);
  middlePanel.rotation.y = Math.PI / 2;
  scene.add(middlePanel);

  // Right wall
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 0.1),
    wallMaterial
  );
  rightWall.position.set(8, 1.5, 0);
  rightWall.rotation.y = Math.PI / 2;
  scene.add(rightWall);

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 20),
    new THREE.MeshStandardMaterial({ map: ceilingTexture })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 3;
  scene.add(ceiling);
}

export function loadModels(scene) {
  const loader = new GLTFLoader();

  // Load desks and chairs in a 2x3 grid
  const numRows = 3;
  const numCols = 3;
  const deskSpacingX = 4;
  const deskSpacingZ = 4;

  loader.load("/objects/desk/desk.gltf", (gltf) => {
    const deskModel = gltf.scene;
    deskModel.scale.set(0.5, 0.5, 0.5);

    const deskHeight = 1.0; // Adjust if needed

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const deskClone = deskModel.clone();
        deskClone.position.set(
          -((numCols - 1) * deskSpacingX) / 2 + col * deskSpacingX,
          deskHeight,
          -((numRows - 1) * deskSpacingZ) / 2 + row * deskSpacingZ
        );

        deskClone.rotation.y = Math.PI; // Rotates desk by 180 degrees

        scene.add(deskClone);
      }
    }
  });

  loader.load("/objects/chair/chair.gltf", (gltf) => {
    const chairModel = gltf.scene;
    chairModel.scale.set(0.02, 0.02, 0.02); // Keeping your original scale

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const chairClone = chairModel.clone();
        chairClone.position.set(
          -((numCols - 1) * deskSpacingX) / 2 + col * deskSpacingX - 0.5,
          0.5, // Increased Y position to lift the chair up to desk level
          -((numRows - 1) * deskSpacingZ) / 2 + row * deskSpacingZ - 0.3
        );
        scene.add(chairClone);
      }
    }
  });

  // Second pair of chairs
  loader.load("/objects/chair/chair.gltf", (gltf) => {
    const chairModel = gltf.scene;
    chairModel.scale.set(0.02, 0.02, 0.02); // Keeping your original scale

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const chairClone = chairModel.clone();
        chairClone.position.set(
          -((numCols - 1) * deskSpacingX) / 2 + col * deskSpacingX + 0.5,
          0.5, // Increased Y position to lift the chair up to desk level
          -((numRows - 1) * deskSpacingZ) / 2 + row * deskSpacingZ - 0.3
        );
        scene.add(chairClone);
      }
    }
  });

  // Load additional classroom objects
  const models = [
    {
      file: "whiteboard/whiteboard.gltf",
      pos: [0, 1.1, 9.92],
      scale: 2,
      rotation: [0, -Math.PI, 0],
    },

    {
      file: "door/door.gltf",
      pos: [7.95, 0, 7],
      scale: 0.01,
      rotation: [0, Math.PI / 2, 0],
    },

    // Teacher's desk and chair (same as student models)
    {
      file: "desk/desk.gltf",
      pos: [-2, 1, 7.5],
      scale: 0.5,
      rotation: [0, 0, 0],
    }, // Teacher's desk

    {
      file: "chair/chair.gltf",
      pos: [-2, 0.6, 7.9],
      scale: 0.02,
      rotation: [0, -Math.PI, 0],
    }, // Teacher's chair facing students

    { file: "ceiling_light/ceiling_light.gltf", pos: [0, 2.8, 0], scale: 0.5 },
    { file: "book_shelf/book_shelf.gltf", pos: [5, -0, -9.4], scale: 1 },
  ];

  models.forEach(({ file, pos, scale = 1, rotation = [0, 0, 0] }) => {
    loader.load(`/objects/${file}`, (gltf) => {
      const model = gltf.scene;
      model.position.set(...pos);
      model.scale.set(scale, scale, scale);
      model.rotation.set(...rotation);
      scene.add(model);
    });
  });
}
