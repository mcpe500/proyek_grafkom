const world = {
  scene: null,
  renderer: null,
  controls: null,
  camera: null,
  ssrPass: null,
  movement: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    fly: false,
    isJumping: false,
    jumpStartTime: null,
    jumpDuration: 500,
    jumpHeight: 2,
    jumpStartY: null,
  },
  time: {
    currentTime: null,
    elapsedTime: null,
    progress: null,
  },
  positions: {
    previous: new THREE.Vector3(),
    cameraOffset: new THREE.Vector3(-10, 5, 0),
  },
  interaction: {
    objects: [],
    droppedHaybales: [],
    pickedUpHaybales: [],
    placedInBarnHaybales: [],
    interactibleObject: null,
  },
  environment: {
    clouds: [],
    wheats: [],
    raycaster: new THREE.Raycaster(),
    downRay: new THREE.Vector3(0, -1, 0),
    wheatPlacement: {
      geometry: new THREE.BoxGeometry(1, 4, 8),
      mesh: new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.0,
        transparent: true,
      }),
      box: new THREE.Mesh(
        new THREE.BoxGeometry(1, 4, 8),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.0,
          transparent: true,
        })
      ),
    },
    pondShape: (() => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 10);
      shape.quadraticCurveTo(10, 12, 10, 10);
      shape.quadraticCurveTo(12, 15, 10, 0);
      shape.quadraticCurveTo(5, -10, 0, 0);
      shape.quadraticCurveTo(-5, 5, 0, 10);
      return shape;
    })(),
  },
  lighting: {
    pointLight: (() => {
      const light = new THREE.PointLight(0xffffff, 0.5, 100);
      light.position.set(-10, 14, 30);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.radius = 5;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 30;
      return light;
    })(),
    sun: {
      angle: 0,
      maxAngle: Math.PI,
      lightColor: 0xffffcc,
      light: new THREE.DirectionalLight(0xffffff, 0.5),
    },
    moon: {
      lightColor: 0xeeeeee,
      light: new THREE.DirectionalLight(0xffffff, 0.5),
      object: null,
    },
    hemisphereDay: new THREE.HemisphereLight(0xffffff, 0.5),
    lensflare: (() => {
      const lensflare = new THREE.Lensflare();
      const textureLoader = new THREE.TextureLoader();
      const textureFlare0 = textureLoader.load(
        "https://threejs.org/examples/textures/lensflare/lensflare0.png"
      );
      const textureFlare3 = textureLoader.load(
        "https://threejs.org/examples/textures/lensflare/lensflare3.png"
      );
      lensflare.addElement(new THREE.LensflareElement(textureFlare0, 700, 0));
      lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
      lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
      lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
      lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1));
      return lensflare;
    })(),
    spotlight: (() => {
      const spotlight = new THREE.SpotLight(0xffffff, 1);
      spotlight.angle = Math.PI / 6;
      spotlight.penumbra = 0.5;
      spotlight.decay = 2;
      spotlight.distance = 200;
      spotlight.position.copy(new THREE.Vector3(10, 5, 10));
      spotlight.castShadow = true;
      spotlight.intensity = 0;
      const targetObject = new THREE.Object3D();
      targetObject.position.copy(new THREE.Vector3(0, 0, 0));
      spotlight.target = targetObject;
      return spotlight;
    })(),
    ambientLight: new THREE.AmbientLight(0xffffff, 0.5),
  },
  geometry: {
    cylinder: new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32),
  },
  material: {
    cylinder: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  },
  loaders: {
    textureLoader: new THREE.TextureLoader(),
    gltfLoader: new THREE.GLTFLoader(),
  },
  cameraSettings: {
    firstPersonPosition: new THREE.Vector3(),
    firstPersonRotation: new THREE.Euler(),
  },
  modes: {
    harvesterMode: false,
    truckMode: false,
    barnDoorMode: false,
    barnDoorOpenRotate: false,
    barnDoorCloseRotate: false,
    barnDoorOpenCoords: { x: 2, y: 0, z: 32 },
    barnDoorCloseCoords: { x: 2, y: 0, z: 27.4 },
    harvesterPosition: new THREE.Vector3(10, 0.1, 10),
    previousHarvesterPosition: new THREE.Vector3(),
    wheatDestroyed: 0,
    orbitRadius: 150,
    dayNightCycle: 0,
  },
  vehicle: null,
  truck: null,
  harvester: null,
  barnDoorOpen: null,
  barnDoorClose: null,
  leftBarnDoor: null,
  rightBarnDoor: null,
  baling_baling_windmill: null,
  lotus: null,
  goose: null,
  previousPosition: new THREE.Vector3(),
};

function checkCollision() {
  const directions = [
    new THREE.Vector3(0, 0, -1), // forward
    new THREE.Vector3(0, 0, 1), // backward
    new THREE.Vector3(-1, 0, 0), // left
    new THREE.Vector3(1, 0, 0), // right
  ];

  const interactibleObject = world.interaction.interactibleObject;
  const currentPosition = interactibleObject.position.clone();

  let canMove = true;

  directions.forEach((direction) => {
    if (
      (world.movement.forward && direction.z === -1) ||
      (world.movement.backward && direction.z === 1) ||
      (world.movement.left && direction.x === -1) ||
      (world.movement.right && direction.x === 1)
    ) {
      const raycaster = new THREE.Raycaster(
        currentPosition,
        direction,
        0,
        1 // Check collision within 1 unit
      );

      const objectsWithGeometry = world.interaction.objects.filter((object) => {
        return true;
        // console.log(object);
        // return (
        //   object.isMesh ||
        //   object.isLine ||
        //   object.isPoints ||
        //   object.isObject3D
        // );
      });
      const intersects = raycaster.intersectObjects(objectsWithGeometry, true);

      if (intersects.length > 0 && intersects[0].distance < 1) {
        console.log("Can't move");
        canMove = false;
      }
    }
  });

  if (!canMove) {
    // Revert the position to the previous one
    interactibleObject.position.copy(world.positions.previous);
  } else {
    // Update the previous position for the next frame
    world.positions.previous.copy(interactibleObject.position);
  }
}
function rotate(object, { x = 0, y = 0, z = 0 } = {}) {
  if (object === undefined) return;
  const { degToRad } = THREE.MathUtils;
  object.rotation.x += degToRad(x);
  object.rotation.y += degToRad(y);
  object.rotation.z += degToRad(z);
}
function init() {
  world.scene = new THREE.Scene();
  world.renderer = new THREE.WebGLRenderer({ antialias: true });
  world.renderer.shadowMap.enabled = true;
  world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(world.renderer.domElement);
  world.renderer.setSize(window.innerWidth, window.innerHeight);

  // Initialize camera
  world.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  world.camera.position.set(0, 1.6, 3);
  world.scene.add(world.camera);

  world.scene.add(world.lighting.pointLight);

  // Initialize cylinderMesh
  world.cylinderMesh = new THREE.Mesh(
    world.geometry.cylinder,
    world.material.cylinder
  );
  world.cylinderMesh.position.copy(world.lighting.pointLight.position);
  world.cylinderMesh.lookAt(
    new THREE.Vector3()
      .copy(world.lighting.pointLight.position)
      .add(world.lighting.pointLight.position)
  );
  world.scene.add(world.cylinderMesh);

  world.scene.add(world.lighting.hemisphereDay);

  const shadowSize = 10; // Define a shadowSize value
  world.lighting.sun.light.castShadow = true;
  world.lighting.sun.light.shadow.mapSize.width = 2048;
  world.lighting.sun.light.shadow.mapSize.height = 2048;
  world.lighting.sun.light.shadow.camera.top += shadowSize;
  world.lighting.sun.light.shadow.camera.bottom -= shadowSize;
  world.lighting.sun.light.shadow.camera.left -= shadowSize;
  world.lighting.sun.light.shadow.camera.right += shadowSize;
  world.lighting.sun.light.add(world.lighting.lensflare);
  world.scene.add(world.lighting.sun.light);

  world.lighting.moon.light.castShadow = true;
  world.lighting.moon.light.shadow.mapSize.width = 2048;
  world.lighting.moon.light.shadow.mapSize.height = 2048;
  world.lighting.moon.light.shadow.camera.top += shadowSize;
  world.lighting.moon.light.shadow.camera.bottom -= shadowSize;
  world.lighting.moon.light.shadow.camera.left -= shadowSize;
  world.lighting.moon.light.shadow.camera.right += shadowSize;
  world.scene.add(world.lighting.moon.light);

  world.scene.add(world.lighting.spotlight);
  world.scene.add(world.lighting.spotlight.target);

  world.scene.add(world.environment.wheatPlacement.box);

  function addObjectToCheck(object, objectFile, callback = () => {}) {
    const newObject = {
      ...object,
      sName: objectFile,
      callbackCustom: callback,
    };
    world.interaction.objects.push(newObject);
  }

  const loadObject = (
    path,
    x,
    y,
    z,
    scale,
    options = {},
    callback = () => {}
  ) => {
    const hasRotation = options.rotation !== undefined;
    const disableShadow = options.shadow === false;

    world.loaders.gltfLoader.load(path, (gltf) => {
      const object = gltf.scene;
      object.position.set(x, y, z);
      object.scale.set(scale, scale, scale);

      object.traverse((node) => {
        if (node.isMesh) {
          node.receiveShadow = !disableShadow;
          node.castShadow = !disableShadow;
        }
      });

      if (hasRotation) {
        const { rotation } = options;
        object.rotation.set(
          THREE.MathUtils.degToRad(rotation.x || 0),
          THREE.MathUtils.degToRad(rotation.y || 0),
          THREE.MathUtils.degToRad(rotation.z || 0)
        );
      }

      world.scene.add(object);

      if (options.isCheckObject !== false) {
        addObjectToCheck(object, path, callback);
      }
    });
  };

  const windmill_location = { x: -20, y: 0, z: -16 };
  loadObject(
    "./textures/kaki_windmill.glb",
    windmill_location.x,
    windmill_location.y,
    windmill_location.z,
    0.05,
    {
      rotation: { x: 90, y: 0, z: 0 },
    }
  );
  loadObject(
    "./textures/baling_baling_windmill.glb",
    windmill_location.x + 1.2,
    windmill_location.y + 28.5,
    windmill_location.z,
    0.05
  );

  const createPond = (x, y, z, scale) => {
    const geometry = new THREE.ShapeGeometry(world.environment.pondShape);
    const material = new THREE.MeshBasicMaterial({ color: 0x00aaff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    mesh.scale.set(scale, scale, scale);
    world.scene.add(mesh);
  };

  createPond(22, 0.01, -10, 1);

  async function makeWalls(objectFile, startX, startZ, w, h) {
    const width = w + 1;
    const height = h + 1;
    const spacing = 5 * 0.975;
    const positionsAndRotations = [];

    let gltf;
    try {
      gltf = await world.loaders.gltfLoader.loadAsync(objectFile);
    } catch (error) {
      console.error(`Failed to load object: ${error}`);
      return;
    }

    const objectTemplate = gltf.scene;

    for (let i = 1; i < width; i++) {
      positionsAndRotations.push({
        position: [startX + i * spacing, 0.75, startZ],
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
      });
    }
    for (let i = 0; i < width - 1; i++) {
      positionsAndRotations.push({
        position: [startX + i * spacing, 0.75, startZ + (height - 1) * spacing],
        rotation: { x: 0, y: (3 * Math.PI) / 2, z: 0 },
      });
    }
    for (let i = 0; i < height - 1; i++) {
      positionsAndRotations.push({
        position: [startX, 0.75, startZ + i * spacing],
        rotation: { x: 0, y: Math.PI, z: 0 },
      });
    }
    for (let i = 1; i < height; i++) {
      positionsAndRotations.push({
        position: [startX + (width - 1) * spacing, 0.75, startZ + i * spacing],
        rotation: { x: 0, y: 0, z: 0 },
      });
    }

    const group = new THREE.Group();

    positionsAndRotations.forEach(({ position, rotation }) => {
      const object = objectTemplate.clone(true);
      object.position.set(...position);
      object.scale.set(1, 1, 1);
      object.rotation.set(rotation.x, rotation.y, rotation.z);
      object.traverse(function (node) {
        if (node.isMesh) {
          node.receiveShadow = true;
          node.castShadow = true;
        }
      });
      group.add(object);
    });

    world.scene.add(group);
    group.children.forEach((object) => {
      addObjectToCheck(object, objectFile);
    });
  }
  async function makeWheats(objectFile, startX, startZ, w, h) {
    const width = w + 1;
    const height = h + 1;
    const spacing = 1;
    const positionsAndRotations = [];

    const floorWidth = width * spacing;
    const floorHeight = height * spacing;
    const floorGeometry = new THREE.PlaneGeometry(floorWidth, floorHeight);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(
      startX + (floorWidth - 1) / 2,
      0.01,
      startZ + (floorHeight - 1) / 2
    );
    world.scene.add(floor);

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        positionsAndRotations.push({
          position: [startX + j * spacing, 0, startZ + i * spacing],
          rotation: { x: 0, y: 90, z: 0 },
        });
      }
    }

    // Load the GLB file once
    let gltf;
    try {
      gltf = await world.loaders.gltfLoader.loadAsync(objectFile);
    } catch (error) {
      console.error(`Failed to load object: ${error}`);
      return;
    }

    const objectTemplate = gltf.scene.clone(); // Clone the loaded object
    const wheatScale = 5;
    const promises = positionsAndRotations.map(({ position, rotation }) => {
      return new Promise((resolve, reject) => {
        const object = objectTemplate.clone(); // Clone the object for each wheat
        object.position.set(...position);
        object.scale.set(wheatScale, wheatScale, wheatScale);
        object.traverse(function (node) {
          if (node.isMesh) {
            node.receiveShadow = true;
            node.castShadow = true;
          }
        });
        if (rotation) {
          object.rotation.x = THREE.MathUtils.degToRad(rotation.x);
          object.rotation.y = THREE.MathUtils.degToRad(rotation.y);
          object.rotation.z = THREE.MathUtils.degToRad(rotation.z);
        }
        world.scene.add(object);
        world.environment.wheats.push(object);
        resolve(object); // Resolve the promise after setting up the object
      });
    });

    try {
      await Promise.all(promises); // Wait for all objects to finish setting up
    } catch (error) {
      console.error(error);
    }
  }
  function wheatCollision() {
    var harvester = world.harvester;
    const harvesterPosition = harvester.position;
    const harvesterRadius = 1.5;
    var harvesterDirection = new THREE.Vector3();
    harvester.getWorldDirection(harvesterDirection);

    world.environment.wheats.forEach((wheat, index) => {
      const wheatPosition = wheat.position;
      const distance = Math.sqrt(
        Math.pow(wheatPosition.x - harvesterPosition.x, 2) +
          Math.pow(wheatPosition.y - harvesterPosition.y, 2) +
          Math.pow(wheatPosition.z - harvesterPosition.z, 2)
      );
      if (distance <= harvesterRadius) {
        world.scene.remove(wheat);
        world.environment.wheats.splice(index, 1);
        wheatDestroyed++;
      }
    });

    if (wheatDestroyed >= 30) {
      var dropDistance = 1.65;
      var dropLocation = new THREE.Vector3()
        .copy(harvester.position)
        .sub(harvesterDirection.clone().multiplyScalar(dropDistance));
      loadObject(
        "./textures/hay_bale_free.glb",
        dropLocation.x,
        0.7,
        dropLocation.z,
        0.005,
        {
          rotation: {
            x: 90,
            y: 0,
            z: harvesterDirection.z * 90,
          },
          isCheckObject: false,
        },
        wheatPickup,
        true
      );
      wheatDestroyed = 0; // Reset the counter
    }
  }
  function wheatPickup(haybale) {
    haybale.pickedUp = false;
    const haybalePickedUpScale = 0.0075;
    const maxHaybales = 2;
    const pickupDistance = 5;
    const dropoffDistanceLimit = 4;
    world.interaction.droppedHaybales.push(haybale);
    return function () {
      const truck = world.truck;
      if (interactibleObject == truck) {
        const distance = interactibleObject.position.distanceTo(
          haybale.position
        );
        const dropoffDistance = interactibleObject.position.distanceTo(
          wheatPlacementBox.position
        );

        if (
          distance < pickupDistance &&
          !haybale.pickedUp &&
          pickedUpHaybales.length < maxHaybales
        ) {
          haybale.pickedUp = true;
          pickedUpHaybales.push(haybale);
          truck.add(haybale);
          haybale.scale.set(
            haybalePickedUpScale,
            haybalePickedUpScale,
            haybalePickedUpScale
          );
          for (let i = 0; i < pickedUpHaybales.length; i++) {
            const current = pickedUpHaybales[i];
            current.position.set(
              0,
              Math.floor(i / 2 + 1) * 2,
              ((i % 2) + 1) * -2.3 - 0.725
            );
            current.rotation.set(
              THREE.MathUtils.degToRad(0),
              THREE.MathUtils.degToRad(0),
              THREE.MathUtils.degToRad(90)
            );
          }
        } else if (dropoffDistance < dropoffDistanceLimit) {
          if (pickedUpHaybales.length >= 1) {
            const current = pickedUpHaybales[0];
            current.callbackCustom = () => {};
            truck.remove(current);
            world.scene.remove(current);
            pickedUpHaybales.shift();
            const prevLength = pickedUpHaybales.length;
            placedInBarnHaybales.push(current);
            for (let i = prevLength; i < placedInBarnHaybales.length; i++) {
              const placeHaybale = placedInBarnHaybales[i];
              placeHaybale.position.set(
                -22.5,
                1 + Math.floor(i / 6) * 2,
                35 - (i % 6) * 2
              );
              placeHaybale.rotation.set(
                THREE.MathUtils.degToRad(0),
                THREE.MathUtils.degToRad(0),
                THREE.MathUtils.degToRad(90)
              );
            }
            world.scene.add(current);
          }
        }
      }
    };
  }

  makeWalls("./textures/wooden_fence.glb", -28, -24, 13, 13);
  makeWheats("./textures/Wheat2.glb", -25, -9, 30, 30);

  const objectsToLoad = [
    {
      path: "./textures/newBarn_Home.glb",
      x: -10,
      y: 0,
      z: 30,
      scale: 3,
      options: { rotation: { x: 0, y: 270, z: 0 } },
    },
    {
      path: "./textures/PintuBarnKanan.glb",
      x: 5.5,
      y: 0,
      z: 33,
      scale: 3,
      options: { rotation: { x: 0, y: 180, z: 0 } },
    },
    {
      path: "./textures/PintuBarnKiri.glb",
      x: 5.5,
      y: 0,
      z: 27,
      scale: 3,
      options: { rotation: { x: 0, y: 270, z: 0 } },
    },
    {
      path: "./textures/scarecrow.glb",
      x: -10,
      y: 0,
      z: 6,
      scale: 2,
      options: { rotation: { x: 0, y: 90, z: 0 } },
    },
    {
      path: "./textures/moon2.glb",
      x: 10,
      y: 0,
      z: 10,
      scale: 3,
      options: { shadow: false },
    },
    { path: "./textures/cart.glb", x: 30, y: 0, z: 0, scale: 0.2 },
    { path: "./textures/Pohon_2.glb", x: 30, y: 0, z: -3, scale: 1 },
    {
      path: "./textures/low_poly_truck.glb",
      x: 0,
      y: 1.15,
      z: -18,
      scale: 0.5,
      options: { rotation: { x: 0, y: 0, z: 0 } },
    },
    {
      path: "./textures/Pohon_2.glb",
      x: 30,
      y: 0,
      z: 34,
      scale: 1,
      options: { x: 0, y: 180, z: 0 },
    },
    { path: "./textures/logs.glb", x: 30, y: 0.23, z: 30, scale: 3 },
    {
      path: "./textures/water_well.glb",
      x: 20,
      y: 0,
      z: 24,
      scale: 0.03,
    },
  ];

  objectsToLoad.forEach((obj) =>
    loadObject(obj.path, obj.x, obj.y, obj.z, obj.scale, obj.options)
  );

  // Loading Haybale Stacks
  const haybalePositionsStack1 = [
    { x: 30, y: 0, z: 12.5 },
    { x: 29.9, y: 0, z: 11 },
    { x: 30, y: 1.3, z: 10.25 },
    { x: 30, y: 0, z: 9.5 },
    { x: 29.5, y: 0.8, z: 7.95, rotation: { x: 0, y: 0, z: 270 } },
    { x: 31.7, y: 0, z: 12.5 },
    { x: 31.8, y: 0, z: 11 },
    { x: 31.7, y: 1.3, z: 10.25 },
    { x: 30.8, y: 1.3, z: 11.75 },
    { x: 31.7, y: 0, z: 9.5 },
    { x: 31, y: 0.8, z: 7.95, rotation: { x: 0, y: 0, z: 270 } },
  ];

  const haybalePositionsStack2 = [
    { x: 29.9, y: 0, z: 19.5 },
    { x: 30, y: 0, z: 18 },
    { x: 30.1, y: 0, z: 21 },
    { x: 30, y: 0, z: 22.5 },
    { x: 29.9, y: 1.3, z: 20.25 },
    { x: 30, y: 1.3, z: 21.75 },
    { x: 30, y: 0, z: 16.5 },
    { x: 31.7, y: 0, z: 19.5 },
    { x: 31.7, y: 0, z: 18 },
    { x: 31.8, y: 0, z: 21 },
    { x: 31.7, y: 0, z: 22.5 },
    { x: 31.7, y: 1.3, z: 18.75 },
    { x: 31.8, y: 1.3, z: 20.25 },
    { x: 31.8, y: 1.3, z: 21.75 },
    { x: 31.8, y: 2.6, z: 19.75 },
    { x: 31.8, y: 2.6, z: 21.25 },
    { x: 31.7, y: 0, z: 16.5 },
  ];

  const haybaleRotation = { x: 0, y: 0, z: 270 };

  haybalePositionsStack1.forEach((pos) =>
    loadObject("./textures/big_haybale.glb", pos.x, pos.y, pos.z, 1, {
      rotation: pos.rotation,
    })
  );
  haybalePositionsStack2.forEach((pos) =>
    loadObject("./textures/big_haybale.glb", pos.x, pos.y, pos.z, 1, {
      rotation: pos.rotation,
    })
  );

  loadObject("./textures/shovel.glb", 29.5, 1, 15.5, 1.5, {
    rotation: { x: 45, y: 90, z: 90 },
  });
  loadObject("./textures/harvester_noleh_kiri.glb", -5, 0.1, -18, 1, {
    rotation: { x: 0, y: 0, z: 0 },
  });

  // Clouds Loading
  const cloudFiles = [
    "./textures/cloud_1.glb",
    "./textures/cloud_2.glb",
    "./textures/cloud_3.glb",
    "./textures/cloud_4.glb",
  ];

  function loadCloud(cloudFile, x, y, z) {
    world.loaders.gltfLoader.load(cloudFile, function (gltf) {
      var cloud = gltf.scene;
      cloud.receiveShadow = false;
      cloud.position.set(x, y, z);
      cloud.scale.set(5, 5, 5);
      cloud.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
        }
      });
      world.scene.add(cloud);
      world.environment.clouds.push(cloud);
    });
  }

  const numClouds = 30;

  for (let i = 0; i < numClouds; i++) {
    const cloudFile = cloudFiles[i % cloudFiles.length];
    const x = Math.random() * 500 - 200;
    const y = Math.random() * 20 + 30;
    const z = Math.random() * 500 - 200;
    loadCloud(cloudFile, x, y, z);
  }

  world.scene.add(world.lighting.ambientLight);

  // Floor Loading
  const floorGeometry = new THREE.PlaneGeometry(250, 250);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x527e1c,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  world.scene.add(floor);

  // Scene Background and Fog
  world.scene.background = new THREE.Color(0x87ceeb);
  world.scene.fog = new THREE.Fog(0x909090, 50, 150);
  // Window Resize Event
  window.addEventListener("resize", () => {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize(window.innerWidth, window.innerHeight);
  });

  world.camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  world.camera.position.set(20, 20, 0);
  world.truck = world.interaction.objects.find((o) =>
    o.sName.includes("low_poly_truck")
  );
  world.harvester = world.interaction.objects.find((o) =>
    o.sName.includes("harvester")
  );
  world.leftBarnDoor = world.interaction.objects.find((o) =>
    o.sName.includes("BarnKiri")
  );
  world.rightBarnDoor = world.interaction.objects.find((o) =>
    o.sName.includes("BarnKanan")
  );
  world.lighting.moon.object = world.interaction.objects.find((o) =>
    o.sName.includes("moon")
  );
  world.baling_baling_windmill = world.interaction.objects.find((o) =>
    o.sName.includes("baling_baling_windmill")
  );
  world.lotus = world.interaction.objects.find((o) =>
    o.sName.includes("lotus")
  );
  world.goose = world.interaction.objects.find((o) =>
    o.sName.includes("goose")
  );
  const controls = new THREE.PointerLockControls(world.camera, document.body);
  world.controls = controls;
  world.scene.add(controls.getObject());
  world.interaction.interactibleObject = world.camera;
  window.addEventListener("mousedown", () => controls.lock(), false);
  document.addEventListener(
    "pointerlockchange",
    () => {
      controls.enabled = document.pointerLockElement === document.body;
    },
    false
  );

  function enterVehicle(vehicleName, mode, switchMode, position) {
    let vehicle = null;
    if (vehicleName == "low_poly_truck") {
      vehicle = world.truck;
    } else if (vehicleName == "harvester") {
      vehicle = world.harvester;
    }
    const distance = interactibleObject.position.distanceTo(vehicle.position);
    if (!mode && distance < 5) {
      world.interaction.interactibleObject = vehicle;
      mode = true;
      switchMode();
    } else if (mode) {
      world.interaction.interactibleObject = world.camera;
      mode = false;
      switchToFirstPersonMode();
      world.camera.position.copy(position);
    }
  }

  function toggleDoor(doorName, mode, openRotate, closeRotate) {
    const door = world.interaction.objects.find((o) =>
      o.sName.includes(doorName)
    );
    const distance = interactibleObject.position.distanceTo(door.position);
    if (!mode && distance < 10 && !openRotate) {
      mode = true;
      openRotate = true;
    } else if (mode && distance < 10 && !closeRotate) {
      mode = false;
      closeRotate = true;
    }
  }

  window.addEventListener(
    "keydown",
    (event) => {
      switch (event.keyCode) {
        case 87: // W
          world.movement.forward = true;
          break;
        case 65: // A
          world.movement.left = true;
          break;
        case 83: // S
          world.movement.backward = true;
          break;
        case 68: // D
          world.movement.right = true;
          break;
        case 69: // E buat enter tractor/harverset
          if (!world.modes.truckMode) {
            enterVehicle(
              "harvester",
              world.modes.harvesterMode,
              switchToharvesterMode,
              { x: harvester.position.x, y: 7, z: harvester.position.z }
            );
          }
          if (!world.modes.harvesterMode) {
            enterVehicle(
              "low_poly_truck",
              world.modes.truckMode,
              switchTotruckMode,
              {
                x: truck.position.x + 2,
                y: 5,
                z: truck.position.z + 2,
              }
            );
          }
          break;
        case 70: // F buat buka Barn Door
          toggleDoor(
            "Barn",
            world.modes.barnDoorMode,
            world.modes.barnDoorOpenRotate,
            world.modes.barnDoorCloseRotate
          );
          break;
        case 81: // Q  lampu mobil
          if (world.modes.harvesterMode || world.modes.truckMode) {
            spotlight.intensity = spotlight.intensity === 0 ? 1 : 0;
          }
          break;
        case 32: // Tombol Space
          if (!world.movement.isJumping) {
            world.movement.isJumping = true;
            world.movement.jumpStartTime = Date.now();
            world.movement.jumpStartY =
              world.interaction.interactibleObject.position.y;
          }
          break;
        case 51:
          switchToFlyMode();
          world.camera.position.y = 50;
          break;
        case 52:
          switchToFirstPersonMode();
          break;
      }
    },
    false
  );

  window.addEventListener(
    "keyup",
    (event) => {
      switch (event.keyCode) {
        case 87: // W
          world.movement.forward = false;
          break;
        case 65: // A
          world.movement.left = false;
          break;
        case 83: // S
          world.movement.backward = false;
          break;
        case 68: // D
          world.movement.right = false;
          break;
      }
    },
    false
  );
}

function animateJump() {
  currentTime = Date.now();
  elapsedTime = currentTime - world.movement.jumpStartTime;
  if (elapsedTime < world.movement.jumpDuration) {
    progress = elapsedTime / world.movement.jumpDuration;
    jumpHeightOffset = world.movement.jumpHeight * Math.sin(progress * Math.PI);
    world.controls.getObject().position.y =
      world.movement.jumpStartY + jumpHeightOffset;
    requestAnimationFrame(animateJump);
  } else {
    world.controls.getObject().position.y = world.movement.jumpStartY;
    world.movement.isJumping = false;
  }
}

function animate() {
  requestAnimationFrame(animate);

  // // Create a BoxHelper for the mesh and add it to the scene
  world.interaction.objects.forEach((o) =>
    o.callbackCustom ? o.callbackCustom() : ""
  );
  world.interaction.droppedHaybales.forEach((o) =>
    o.callbackCustom ? o.callbackCustom() : ""
  );
  const doorKiri = world.leftBarnDoor;
  const doorKanan = world.rightBarnDoor;
  if (world.barnDoorOpenRotate) {
    world.barnDoorCloseRotate = false;
    const rotateOpen =
      doorKiri.rotation.y > THREE.MathUtils.degToRad(-90) &&
      doorKiri.rotation.y < THREE.MathUtils.degToRad(360);
    if (rotateOpen) {
      rotate(doorKiri, { x: 0, y: 1, z: 0 });
      rotate(doorKanan, { x: 0, y: -1, z: 0 });
    } else {
      world.barnDoorOpenRotate = false;
    }
  }
  if (world.barnDoorCloseRotate) {
    world.barnDoorOpenRotate = false;
    const rotateClose =
      doorKiri.rotation.y > THREE.MathUtils.degToRad(270) &&
      doorKiri.rotation.y < THREE.MathUtils.degToRad(360 + 90);
    if (rotateClose) {
      rotate(doorKiri, { x: 0, y: -1, z: 0 });
      rotate(doorKanan, { x: 0, y: 1, z: 0 });
    } else {
      world.barnDoorCloseRotate = false;
    }
  }
  var baling_baling_windmill = world.baling_baling_windmill;
  rotate(baling_baling_windmill, { x: 1, y: 0, z: 0 });

  var lotus = world.lotus;
  rotate(lotus, { x: 0, y: 0.15, z: 0 });

  var goose = world.goose;
  // rotate(goose, { x: goose.position.x + 1, y: 0, z: 0 });

  if (world.lighting.sun.angle < world.lighting.sun.maxAngle) {
    world.lighting.sun.angle += 0.001;
  } else {
    world.lighting.sun.angle = 0;
    world.modes.dayNightCycle = (world.modes.dayNightCycle + 1) % 2;
  }

  world.lighting.sun.light.position.x =
    Math.cos(world.lighting.sun.angle) * world.modes.orbitRadius;
  world.lighting.sun.light.position.y =
    Math.sin(world.lighting.sun.angle) * world.modes.orbitRadius;
  world.lighting.sun.light.position.z = 0;

  world.lighting.hemisphereDay.position.x =
    Math.cos(world.lighting.sun.angle) * world.modes.orbitRadius;
  world.lighting.hemisphereDay.position.y =
    Math.sin(world.lighting.sun.angle) * world.modes.orbitRadius;
  world.lighting.hemisphereDay.position.z = 0;

  world.lighting.moon.light.position.x =
    Math.cos(world.lighting.sun.angle) * world.modes.orbitRadius;
  world.lighting.moon.light.position.y =
    Math.sin(world.lighting.sun.angle) * world.modes.orbitRadius;
  world.lighting.moon.light.position.z = 0;

  // world.lighting.moon.object.position.x = Math.cos(world.lighting.sun.angle) * world.modes.orbitRadius;
  // world.lighting.moon.object.position.y = Math.sin(world.lighting.sun.angle) * world.modes.orbitRadius;
  // world.lighting.moon.object.position.z = 0;

  moon = world.lighting.moon.object;
  if (moon) {
    moon.position.x =
      Math.cos(world.lighting.sun.angle) * world.modes.orbitRadius;
    moon.position.y =
      Math.sin(world.lighting.sun.angle) * world.modes.orbitRadius;
    moon.position.z = 0;
    if (world.modes.dayNightCycle === 0) {
      moon.visible = false;
    } else {
      moon.visible = true;
    }
  }

  var skyColor;
  var sunriseColor = new THREE.Color(0.8, 0.6, 0.2);
  var morningColor = new THREE.Color(0.2, 0.6, 0.8);
  var noonColor = new THREE.Color(0.4, 0.8, 1.0);
  var eveningColor = new THREE.Color(0.8, 0.4, 0.2);
  var sunsetColor = new THREE.Color(0.6, 0.3, 0.1);
  var nightColor = new THREE.Color(0.05, 0.05, 0.2);

  var transitionProgress =
    world.lighting.sun.angle / world.lighting.sun.maxAngle;
  if (world.modes.dayNightCycle === 0) {
    world.lighting.lensflare.visible = true;
    if (transitionProgress < 0.25) {
      skyColor = sunriseColor.lerp(morningColor, transitionProgress / 0.25);
      world.lighting.sun.light.intensity = (transitionProgress / 0.25) * 0.5;
      world.lighting.moon.light.intensity =
        0.5 - (transitionProgress / 0.25) * 0.5;
      world.lighting.hemisphereDay.intensity =
        (transitionProgress / 0.25) * 0.5;
    } else if (transitionProgress < 0.5) {
      skyColor = morningColor.lerp(
        noonColor,
        (transitionProgress - 0.25) / 0.25
      );
    } else if (transitionProgress < 0.75) {
      skyColor = noonColor.lerp(
        eveningColor,
        (transitionProgress - 0.5) / 0.25
      );
    } else {
      skyColor = eveningColor.lerp(
        sunsetColor,
        (transitionProgress - 0.75) / 0.25
      );
      world.lighting.moon.light.intensity =
        ((transitionProgress - 0.75) / 0.25) * 0.25;
      world.lighting.hemisphereDay.intensity =
        0.5 - ((transitionProgress - 0.75) / 0.25) * 0.5;
    }
  } else {
    world.lighting.lensflare.visible = false;
    if (transitionProgress < 0.1) {
      skyColor = sunsetColor.lerp(nightColor, transitionProgress / 0.1);
      world.lighting.moon.light.intensity = (transitionProgress / 0.1) * 0.25;
      world.lighting.sun.light.intensity =
        0.5 - (transitionProgress / 0.1) * 0.5;
    } else if (transitionProgress < 0.9) {
      skyColor = nightColor;
    } else {
      skyColor = nightColor.lerp(
        sunriseColor,
        (transitionProgress - 0.9) / 0.1
      );
    }
  }
  world.scene.background = skyColor;

  var moveSpeed = 0.2;
  var moveVector = new THREE.Vector3();
  world.controls.getObject().getWorldDirection(moveVector);
  moveVector.y = 0;
  moveVector.normalize();

  if (!world.modes.harvesterMode && !world.movement.fly) {
    world.environment.raycaster.set(
      world.controls.getObject().position,
      world.environment.downRay
    );
    var intersects = world.environment.raycaster.intersectObjects(
      world.scene.children,
      true
    );

    if (intersects.length > 0) {
      if (intersects[0].distance - 1.5 > 0) {
        world.controls.getObject().position.y -= 0.6;
      }
    }
  }

  for (var i = 0; i < world.environment.clouds.length; i++) {
    world.environment.clouds[i].position.x -= 0.1;

    if (world.environment.clouds[i].position.x < -300) {
      world.environment.clouds[i].position.x = 300;
      world.environment.clouds[i].position.y = Math.random() * 20 + 30;
      world.environment.clouds[i].position.z = Math.random() * 500 - 200;
    }
  }
  checkCollision();
  if (world.modes.harvesterMode) {
    wheatCollision();
    harvesterCollision();
    var harvester = world.harvester;
    var harvesterSpeed = moveSpeed;
    var rotationSpeed = 0.01;
    const newPosition = harvester.position.clone();
    if (world.movement.forward) {
      harvester.position.add(moveVector.clone().multiplyScalar(harvesterSpeed));
      if (world.movement.left) {
        harvester.rotateY(rotationSpeed);
      }
      if (world.movement.right) {
        harvester.rotateY(-rotationSpeed);
      }
    }
    if (world.movement.backward) {
      harvester.position.sub(moveVector.clone().multiplyScalar(harvesterSpeed));
      if (world.movement.left) {
        harvester.rotateY(-rotationSpeed);
      }
      if (world.movement.right) {
        harvester.rotateY(rotationSpeed);
      }
    }
    // Check for collision with the new position
    // const intersected = checkCollision(newPosition, harvester);
    // if (intersected) {
    //   harvester.position.copy(newPosition);
    // }

    harvester.position.y = harvester_position.y;
    // harvester.position.y = harvester_position.y + 1;
    var harvesterDirection = new THREE.Vector3();
    harvester.getWorldDirection(harvesterDirection);
    var cameraDistance = 10;
    var cameraPosition = new THREE.Vector3()
      .copy(harvester.position)
      .sub(harvesterDirection.clone().multiplyScalar(cameraDistance));
    cameraPosition.y = 8;
    camera.position.copy(cameraPosition);
    camera.lookAt(harvester.position);

    var lightPosition = new THREE.Vector3()
      .copy(harvester.position)
      .add(harvesterDirection.clone().multiplyScalar(3));
    var lightTarget = new THREE.Vector3()
      .copy(harvester.position)
      .add(harvesterDirection.clone().multiplyScalar(cameraDistance));
    spotlight.position.copy(lightPosition);
    spotlight.target.position.copy(lightTarget.clone());
  } else if (world.modes.truckMode) {
    wheatCollision();
    var truck = objects.find((o) => o.sName.includes("low_poly_truck"));
    var truckSpeed = moveSpeed * 1.5;
    var rotationSpeed = 0.025;
    const newPosition = truck.position.clone();
    if (world.movement.forward) {
      truck.position.add(moveVector.clone().multiplyScalar(truckSpeed));
      if (moveLeft) {
        truck.rotateY(rotationSpeed);
      }
      if (moveRight) {
        truck.rotateY(-rotationSpeed);
      }
    }
    if (moveBackward) {
      truck.position.sub(moveVector.clone().multiplyScalar(truckSpeed));
      if (moveLeft) {
        truck.rotateY(-rotationSpeed);
      }
      if (moveRight) {
        truck.rotateY(rotationSpeed);
      }
    }
    // const intersected = checkCollision(newPosition, truck);

    // if (intersected) {
    //   truck.position.copy(newPosition);
    // }

    truck.position.y = 1.15;
    var truckDirection = new THREE.Vector3();
    truck.getWorldDirection(truckDirection);
    var cameraDistance = 10;
    var cameraPosition = new THREE.Vector3()
      .copy(truck.position)
      .sub(truckDirection.clone().multiplyScalar(cameraDistance));
    cameraPosition.y = 8;
    camera.position.copy(cameraPosition);
    camera.lookAt(truck.position);

    var lightPosition = new THREE.Vector3()
      .copy(truck.position)
      .add(truckDirection.clone().multiplyScalar(3));
    var lightTarget = new THREE.Vector3()
      .copy(truck.position)
      .add(truckDirection.clone().multiplyScalar(cameraDistance));
    spotlight.position.copy(lightPosition);
    spotlight.target.position.copy(lightTarget.clone());
  } else {
    const newPosition = world.controls.getObject().position.clone();
    if (world.movement.isJumping) {
      animateJump();
    }
    if (world.movement.forward)
      world.controls
        .getObject()
        .position.add(moveVector.clone().multiplyScalar(moveSpeed));
    if (world.movement.backward)
      world.controls
        .getObject()
        .position.sub(moveVector.clone().multiplyScalar(moveSpeed));
    if (world.movement.left)
      world.controls
        .getObject()
        .position.add(
          moveVector
            .clone()
            .cross(world.controls.getObject().up)
            .negate()
            .multiplyScalar(moveSpeed)
        );
    if (world.movement.right)
      world.controls
        .getObject()
        .position.add(
          moveVector
            .clone()
            .cross(world.controls.getObject().up)
            .multiplyScalar(moveSpeed)
        );
  }
  world.renderer.render(world.scene, world.camera);
}

init();
animate();
