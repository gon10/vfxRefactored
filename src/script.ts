import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFLoader } from "./GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import geralPoints from "./points/geralPoints";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

import { Vector3 } from "three";

let geralMapa: any = null;
let aguieiraMap: any = null;
let herculesMap: any = null;
let locationLabel: HTMLDivElement = document.querySelector(
  ".centerLocationLabel"
) as HTMLDivElement;

let loadingDiv: HTMLDivElement = document.querySelector(
  "#loading"
) as HTMLDivElement;
loadingDiv.style.background =
  "white url('./img/gif.gif') no-repeat center center";
let loadingBar: HTMLDivElement = document.querySelector(
  "#loading-bar"
) as HTMLDivElement;
let logo: HTMLDivElement = document.querySelector(
  "#logo-logo"
) as HTMLDivElement;
logo.style.display = "none";

let selectedPoint: any = null;
/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
// const gltfLoader = new THREE.GLTFLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("./img/bg2.jpg");

/**
 * Base
 */
// Debug
// const gui = new GUI();
const debugObject: any = {};

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLElement;

// Scene
const scene = new THREE.Scene();
scene.background = bgTexture;

// const axesHelper = new THREE.AxesHelper(1);
// scene.add(axesHelper);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
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
// gui
//   .add(debugObject, "envMapIntensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .onChange(updateAllMaterials);

const pickableObjects: THREE.Mesh[] = [];

/**
 * Models
 */

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
directionalLight.position.set(0.4, 0.5, 0.6);
scene.add(directionalLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper);

const ambientLight = new THREE.AmbientLight("#ffffff", 2.4);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
ambientLight.position.set(0.25, 3, -2.25);
scene.add(ambientLight);

// gui
//   .add(directionalLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name("lightIntensity");
// gui
//   .add(directionalLight.position, "x")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightX");
// gui
//   .add(directionalLight.position, "y")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightY");
// gui
//   .add(directionalLight.position, "z")
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name("lightZ");

// gui
//   .add(ambientLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name("ambientLight");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
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
const cameraInitialPosition: Vector3 = new Vector3(
  5.0748153057487375,
  2.4778398843811997,
  1.6434394040706144
);
const cameraInitialTarget: Vector3 = new Vector3(
  2.1954670540997627,
  0.9490157316060772,
  2.0877998449925674
);
camera.position.set(
  cameraInitialPosition.x,
  cameraInitialPosition.y,
  cameraInitialPosition.z
);

const geral_mapa_group = new THREE.Group();
const GroupCamera = new THREE.Group();
GroupCamera.name = "GroupCamera";
GroupCamera.add(camera);
GroupCamera.position.set(0, 0, 0);

scene.add(GroupCamera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// (controls.rotateSpeed = 0.1),
(controls.minPolarAngle = 0),
  (controls.maxPolarAngle = Math.PI / 2),
  //   (controls.minAzimuthAngle = -Math.PI / 2.5);
  // controls.maxAzimuthAngle = Math.PI / 2.5;
  // (controls.minDistance = 3),
  //   (controls.maxDistance = 9),
  //   (controls.dampingFactor = 0.05);
  (controls.enablePan = true);
controls.target.set(
  cameraInitialTarget.x,
  cameraInitialTarget.y,
  cameraInitialTarget.z
);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// gui
//   .add(renderer, "toneMapping", {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping
//   })
//   .onFinishChange(() => {
//     renderer.toneMapping = Number(renderer.toneMapping);
//     updateAllMaterials();
//   });
// gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

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
  if (event.key === "i") {
    console.log("camera.position", camera.position);
    console.log("camera.rotation", camera.rotation);
    console.log("controls.target", controls.target);
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
        const points: Vector3[] = [];
        points.push(intersects[0].point);
        points.push(intersects[0].point.clone());
        console.log("points", points);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        line = new THREE.LineSegments(
          geometry,
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.75,
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
  }

  intersects = raycaster.intersectObjects(overablebjects, false);
  if (intersects.length > 0) {
    // console.log("intersects", intersects);
    // overablebjectsLabels[intersects[0].object.id].element.className =
    //   "measurementLabel";

    // if (intersects[0].object.name === "Geral") {
    //   console.log("load Geral");
    //   loadGeralMapa();
    // } else if (intersects[0].object.name === "Aguieira") {
    //   console.log("load Aguieira");
    //   loadAguieiraMapa();
    // }
    const obj = intersects[0].object as THREE.Points;
    const point = intersects[0].point;
    // controls.target.set(p.x, p.y, p.z);
    // var tween = new TWEEN.Tween(position).to(target, 2000);

    travelToPoint(point, obj);
  } else {
    if (!locationLabel.classList.contains("d-none")) {
      new TWEEN.Tween(controls.target)
        .to(
          {
            x: cameraInitialTarget.x,
            y: cameraInitialTarget.y,
            z: cameraInitialTarget.z,
          },
          1500
        )
        //.delay (1000)
        .easing(TWEEN.Easing.Cubic.Out)
        //.onUpdate(() => render())
        .onStart(() => locationLabel.removeEventListener("click", openNewTab))
        .start()
        .onComplete(() => controls.update());
      new TWEEN.Tween(camera.position)
        .to(
          {
            x: cameraInitialPosition.x,
            y: cameraInitialPosition.y,
            z: cameraInitialPosition.z,
          },
          1500
        )
        //.delay (1000)
        .easing(TWEEN.Easing.Cubic.Out)
        //.onUpdate(() => render())
        .onStart(() => locationLabel.removeEventListener("click", openNewTab))
        .start()
        .onStart(() => locationLabel.classList.add("d-none"))
        .onComplete(() => controls.update());
    }
    locationLabel.classList.add("d-none");
  }
}
const travelToPoint = (point: THREE.Vector3, obj: THREE.Points) => {
  console.log({ point });
  console.log({ obj });
  const inBetween = new THREE.Vector3();
  inBetween.lerpVectors(cameraInitialPosition, point, 0.5);

  // new TWEEN.Tween(camera.position)
  //   .to(
  //     {
  //       x: cameraInitialPosition.x,
  //       y: cameraInitialPosition.y,
  //       z: cameraInitialPosition.z
  //     },
  //     1500
  //   )
  //   //.delay (1000)
  //   .easing(TWEEN.Easing.Cubic.Out)
  //   //.onUpdate(() => render())
  //   .start()
  //   .onComplete(() => {
  //     new TWEEN.Tween(camera.position)
  //       .to(
  //         {
  //           x: inBetween.x,
  //           y: inBetween.y,
  //           z: inBetween.z
  //         },
  //         1500
  //       )
  //       //.delay (1000)
  //       .easing(TWEEN.Easing.Cubic.Out)
  //       //.onUpdate(() => render())
  //       .start()
  //       .onComplete(() => {
  //         console.log("controls.target to", point);
  //         console.log("completed tween", locationLabel, obj);
  //         locationLabel.innerHTML = `${obj.name} <br> <span>visitar</span>`;
  //         locationLabel.classList.remove("d-none");
  //         controls.update();
  //       });
  //     controls.update();
  //   });
  new TWEEN.Tween(camera.position)
    .to(
      {
        x: inBetween.x,
        y: inBetween.y,
        z: inBetween.z,
      },
      1500
    )
    //.delay (1000)
    .easing(TWEEN.Easing.Cubic.Out)
    //.onUpdate(() => render())
    .start()
    .onStart(() => {
      locationLabel.classList.add("d-none");
      locationLabel.removeEventListener("click", openNewTab);
    })
    .onComplete(() => {
      console.log("controls.target to", point);
      console.log("completed tween camera pos", locationLabel, obj);
      locationLabel.innerHTML = `${obj.name} <br> <span>visitar</span>`;
      locationLabel.classList.remove("d-none");
      selectedPoint = obj;
      locationLabel.addEventListener("click", openNewTab);
      controls.update();
    });

  new TWEEN.Tween(controls.target)
    .to(
      {
        x: point.x,
        y: point.y,
        z: point.z,
      },
      1500
    )
    //.delay (1000)
    .easing(TWEEN.Easing.Cubic.Out)
    //.onUpdate(() => render())
    .start()
    .onComplete(() => {
      console.log("controls.target to", point);
      console.log("completed tween", locationLabel, obj);
      locationLabel.innerHTML = `${obj.name} <br> <span>visitar</span>`;
      locationLabel.classList.remove("d-none");
      controls.update();
    });
};

const openNewTab = function (event) {
  if (selectedPoint?.userData?.url)
    window.open(selectedPoint.userData.url, "_blank");
};

document.addEventListener("mousemove", onDocumentMouseMove, false);
function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  if (raycaster.params.Points) raycaster.params.Points.threshold = 0.1;

  let key: any; // Type is "one" | "two" | "three"
  for (key in overablebjectsLabels) {
    overablebjectsLabels[key].element.className = "measurementLabelNone";
  }

  intersects = raycaster.intersectObjects(overablebjects, false);
  if (intersects.length > 0) {
    console.log("intersects", intersects);
    overablebjectsLabels[intersects[0].object.id].element.className =
      "measurementLabel";
    overablebjectsLabels[intersects[0].object.id].position.set(
      intersects[0].point.x,
      intersects[0].point.y + 0.1,
      intersects[0].point.z
    );
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

const generateGeralPoints = () => {
  geralPoints.forEach((geralPoint) => {
    const particlesGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(3);
    positions[0] = geralPoint.position.x;
    positions[1] = geralPoint.position.y;
    positions[2] = geralPoint.position.z;

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    let point = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        map: new THREE.TextureLoader().load("./img/pontoInteresse.jpg"),
        size: 0.2,
      })
    );
    // let whateverYouWant = new THREE.Vector3();
    // point.getWorldPosition(whateverYouWant);
    // console.log("whateverYouWant", whateverYouWant);
    // console.log("point.position", point.position);
    point.name = geralPoint.name;
    point.userData.url = geralPoint.url;
    scene.add(point);
    overablebjects.push(point);
    const labelDiv = document.createElement("div") as HTMLDivElement;
    labelDiv.className = "measurementLabelNone";
    labelDiv.innerText = geralPoint.name;
    labelDiv.addEventListener("click", function () {
      window.open(geralPoint.url, "_blank");
    });

    const measurementLabel = new CSS2DObject(labelDiv);
    measurementLabel.position.set(
      geralPoint.position.x,
      geralPoint.position.y + 0.1,
      geralPoint.position.z
    );

    overablebjectsLabels[point.id] = measurementLabel;
    scene.add(measurementLabel);
  });
};

const loadGeralMapa = () => {
  scene.remove(aguieiraMap);
  if (!geralMapa) {
    console.log("load");
    gltfLoader.load(
      "./models/3M-AGUIEIRA.glb",
      (gltf) => {
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        console.log(gltf.scene.position);
        gltf.scene.position.set(0, -2.0, 0);
        gltf.scene.rotateX(-Math.PI / 2);
        // gltf.scene.rotateZ(-Math.PI / 2);
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

        // gui
        //   .add(gltf.scene.rotation, "y")
        //   .min(-Math.PI)
        //   .max(Math.PI)
        //   .step(0.001)
        //   .name("rotation y");

        // gui
        //   .add(gltf.scene.rotation, "x")
        //   .min(-Math.PI)
        //   .max(Math.PI)
        //   .step(0.001)
        //   .name("rotation x");

        // gui
        //   .add(gltf.scene.rotation, "z")
        //   .min(-Math.PI)
        //   .max(Math.PI)
        //   .step(0.001)
        //   .name("rotation z");

        geralMapa = gltf.scene;
        geral_mapa_group.add(geralMapa);
        scene.add(geral_mapa_group);
        generateGeralPoints();
        loadingDiv.style.display = "none";
        logo.style.display = "block";

        updateAllMaterials();
        document.getElementById("myInput")?.classList.add("show");
        populateDropdown();
      },
      (xhr) => {
        console.log((xhr.loaded / 97912072) * 100 + "% loaded");
        console.log("xhr", xhr);
        loadingBar.style.width = (xhr.loaded / 97912072) * 100 - 1 + "%";
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    scene.add(geralMapa);
  }
};

const loadAguieiraMapa = () => {
  scene.remove(geralMapa);
  console.log("aguieiraMap", aguieiraMap);
  if (!aguieiraMap) {
    console.log("load");
    gltfLoader.load(
      "/models/AGUIEIRA-FINAL-V2-COMPRESSED.glb",
      (gltf) => {
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        // gltf.scene.traverse(function (child) {
        //   if ((child as THREE.Mesh).isMesh) {
        //     const m = child as THREE.Mesh;
        //     switch (m.name) {
        //       case "Plane":
        //         m.receiveShadow = true;
        //         break;
        //       default:
        //         m.castShadow = true;
        //     }
        //     pickableObjects.push(m);
        //   }
        // });

        aguieiraMap = gltf.scene;
        scene.add(aguieiraMap);
        // gui
        //   .add(gltf.scene.rotation, "y")
        //   .min(-Math.PI)
        //   .max(Math.PI)
        //   .step(0.001)
        //   .name("rotation");

        // updateAllMaterials();
      },
      (xhr) => {
        // console.log(xhr);
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    scene.add(aguieiraMap);
  }
  // generateGeralPoints();
};

loadGeralMapa();

// setTimeout(loadAguieiraMapa, 6000);

// const stats = Stats();
// document.body.appendChild(stats.dom);
/**
 * Animate
 */

// let base = new THREE.Mesh(
//   new THREE.CircleGeometry(25, 50),
//   new THREE.MeshBasicMaterial({
//     map: new THREE.TextureLoader().load("./img/map-texture.jpg"),
//     side: THREE.DoubleSide,
//   })
// );
// (base.rotation.x = -Math.PI / 2),
//   (base.rotation.z = 0),
//   // (base.rotation.y = -Math.PI / 2),
//   (base.position.y = -1.0),
//   (base.position.z = -3.5),
//   (base.position.x = 0),
//   scene.add(base);

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);

  // stats.update();

  TWEEN.update();

  // GroupCamera.rotation.y -= 0.02;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();

const populateDropdown = () => {
  let div = document.getElementById("myDropdown");
  geralPoints.map((point) => {
    const a = document.createElement("a");
    a.addEventListener("click", () => {
      let obj = overablebjects.find((ele) => {
        return ele.name == a.innerHTML;
      }) as THREE.Points;
      travelToPoint(
        new THREE.Vector3(
          point?.position.x,
          point?.position.y,
          point?.position.z
        ),
        obj
      );
      let myInput = document?.getElementById("myInput") as HTMLInputElement;
      myInput.value = a.innerHTML;
      window.myFunction();
    });

    a.innerHTML = point.name;
    div?.appendChild(a);
  });
};

declare global {
  interface Window {
    myFunction: Function;
    filterFunction: Function;
  }
}

window.myFunction = () => {
  document.getElementById("myDropdown")?.classList.toggle("show");
};

window.filterFunction = () => {
  let input, filter, ul, li, a, i, div, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
};
