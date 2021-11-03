import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module";
import {
  CSS2DRenderer,
  CSS2DObject
} from "three/examples/jsm/renderers/CSS2DRenderer";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("/img/bg2.jpg");

/**
 * Base
 */
// Debug
const gui = new GUI();
const debugObject: any = {};

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLElement;

// Scene
const scene = new THREE.Scene();
scene.background = bgTexture;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse(child => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
// const environmentMap = cubeTextureLoader.load([
//   "/textures/environmentMaps/0/px.jpg",
//   "/textures/environmentMaps/0/nx.jpg",
//   "/textures/environmentMaps/0/py.jpg",
//   "/textures/environmentMaps/0/ny.jpg",
//   "/textures/environmentMaps/0/pz.jpg",
//   "/textures/environmentMaps/0/nz.jpg"
// ]);

// environmentMap.encoding = THREE.sRGBEncoding;

// scene.background = environmentMap;
// scene.environment = environmentMap;

debugObject.envMapIntensity = 5;
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

const pickableObjects: THREE.Mesh[] = [];

/**
 * Models
 */
gltfLoader.load(
  "/models/GERAL-MAPA-RECORTADO-V2-COMPRESSED.glb",
  gltf => {
    gltf.scene.scale.set(0.01, 0.01, 0.01);
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        switch (m.name) {
          case "Plane":
            m.receiveShadow = true;
            break;
          default:
            m.castShadow = true;
        }
        pickableObjects.push(m);
      }
    });
    scene.add(gltf.scene);

    // gui
    //   .add(gltf.scene.rotation, "y")
    //   .min(-Math.PI)
    //   .max(Math.PI)
    //   .step(0.001)
    //   .name("rotation");

    updateAllMaterials();
  },
  xhr => {
    console.log(xhr);
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  error => {
    console.log(error);
  }
);

// gltfLoader.load(
//     '/models/hamburger.glb',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(0.3, 0.3, 0.3)
//         gltf.scene.position.set(0, - 1, 0)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight("#ffffff", 5);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.normalBias = 0.05;
ambientLight.position.set(0.25, 3, -2.25);
scene.add(ambientLight);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");
gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");

gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("ambientLight");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  labelRenderer.setSize(sizes.width, sizes.height);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
  });
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

let ctrlDown = false;
let lineId = 0;
let line: THREE.Line;
let drawingLine = false;
const measurementLabels: { [key: number]: CSS2DObject } = {};

window.addEventListener("keydown", function (event) {
  if (event.key === "Control") {
    ctrlDown = true;
    controls.enabled = false;
    renderer.domElement.style.cursor = "crosshair";
  }
});

window.addEventListener("keyup", function (event) {
  if (event.key === "Control") {
    ctrlDown = false;
    controls.enabled = true;
    renderer.domElement.style.cursor = "pointer";
    if (drawingLine) {
      //delete the last line because it wasn't committed
      scene.remove(line);
      scene.remove(measurementLabels[lineId]);
      drawingLine = false;
    }
  }
});

const raycaster = new THREE.Raycaster();
let intersects: THREE.Intersection[];
const mouse = new THREE.Vector2();

const overablebjects: THREE.Points[] = [];
const overablebjectsLabels: { [key: number]: CSS2DObject } = {};

renderer.domElement.addEventListener("pointerdown", onClick, false);
function onClick() {
  if (ctrlDown) {
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(pickableObjects, false);
    if (intersects.length > 0) {
      if (!drawingLine) {
        //start the line
        const points = [];
        points.push(intersects[0].point);
        points.push(intersects[0].point.clone());
        console.log("points", points);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        line = new THREE.LineSegments(
          geometry,
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.75
            // depthTest: false,
            // depthWrite: false
          })
        );
        line.frustumCulled = false;
        scene.add(line);

        const measurementDiv = document.createElement("div") as HTMLDivElement;
        measurementDiv.className = "measurementLabel";
        measurementDiv.innerText = "0.0m";
        const measurementLabel = new CSS2DObject(measurementDiv);
        measurementLabel.position.copy(intersects[0].point);
        measurementLabels[lineId] = measurementLabel;
        scene.add(measurementLabels[lineId]);
        drawingLine = true;
      } else {
        //finish the line
        const positions = line.geometry.attributes.position
          .array as Array<number>;
        positions[3] = intersects[0].point.x;
        positions[4] = intersects[0].point.y;
        positions[5] = intersects[0].point.z;
        line.geometry.attributes.position.needsUpdate = true;
        lineId++;
        drawingLine = false;
      }
    }

    const particlesGeometry = new THREE.BufferGeometry();
    let count = 1;
    const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

    positions[0] = intersects[0].point.x;
    positions[1] = intersects[0].point.y + 0.3;
    positions[2] = intersects[0].point.z;

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    let point = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        map: new THREE.TextureLoader().load("/img/pontoInteresse.jpg"),
        size: 0.1
      })
    );
    let whateverYouWant = new THREE.Vector3();
    point.getWorldPosition(whateverYouWant);
    console.log("whateverYouWant", whateverYouWant);
    console.log("point.position", point.position);
    scene.add(point);
    overablebjects.push(point);
    const labelDiv = document.createElement("div") as HTMLDivElement;
    // labelDiv.className = "measurementLabel";
    labelDiv.innerText = "Ponto de interesse";

    const measurementLabel = new CSS2DObject(labelDiv);
    measurementLabel.position.set(
      intersects[0].point.x,
      intersects[0].point.y + 0.35,
      intersects[0].point.z
    );

    console.log("point.id", point.id);

    overablebjectsLabels[point.id] = measurementLabel;
    scene.add(measurementLabel);
  }
}

document.addEventListener("mousemove", onDocumentMouseMove, false);
function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  if (raycaster.params.Points) raycaster.params.Points.threshold = 0.05;

  let key: any; // Type is "one" | "two" | "three"
  for (key in overablebjectsLabels) {
    overablebjectsLabels[key].element.className = "measurementLabelNone";
  }

  intersects = raycaster.intersectObjects(overablebjects, false);
  if (intersects.length > 0) {
    console.log("intersects", intersects);
    overablebjectsLabels[intersects[0].object.id].element.className =
      "measurementLabel";
  }

  if (drawingLine) {
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(pickableObjects, false);
    if (intersects.length > 0) {
      const positions = line.geometry.attributes.position
        .array as Array<number>;
      const v0 = new THREE.Vector3(positions[0], positions[1], positions[2]);
      const v1 = new THREE.Vector3(
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z
      );
      positions[3] = intersects[0].point.x;
      positions[4] = intersects[0].point.y;
      positions[5] = intersects[0].point.z;
      line.geometry.attributes.position.needsUpdate = true;
      const distance = v0.distanceTo(v1);
      measurementLabels[lineId].element.innerText = distance.toFixed(2) + "m";
      measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5);
    }
  }
}

const stats = Stats();
document.body.appendChild(stats.dom);
/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);

  stats.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
