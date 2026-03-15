import { createSceneEnvironment } from "./scene.js";
import { BASE_COLORS, buildHelixLayoutData } from "./dna.js";
import { setupHoverInteraction } from "./interaction.js";
import { setupUI } from "./ui.js";

const viewerContainer = document.getElementById("viewer");
const tooltip = document.getElementById("tooltip");

const env = createSceneEnvironment(viewerContainer);
const { THREE, scene, camera, controls, composer } = env;

const rootGroup = new THREE.Group();
scene.add(rootGroup);

const sparkleStars = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ size: 0.05, color: 0x8aa7ff, transparent: true, opacity: 0.55 })
);
{
  const starCount = 350;
  const data = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    data[i * 3] = (Math.random() - 0.5) * 120;
    data[i * 3 + 1] = (Math.random() - 0.5) * 120;
    data[i * 3 + 2] = (Math.random() - 0.5) * 120;
  }
  sparkleStars.geometry.setAttribute("position", new THREE.BufferAttribute(data, 3));
}
scene.add(sparkleStars);

let helixGroup = null;
let baseMeshes = [];

function disposeObject3D(object) {
  object.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

function createBaseMesh(base, position, index, complement) {
  const geometry = new THREE.SphereGeometry(0.45, 18, 18);
  const material = new THREE.MeshStandardMaterial({
    color: BASE_COLORS[base],
    roughness: 0.35,
    metalness: 0.1,
    emissive: BASE_COLORS[base],
    emissiveIntensity: 0.3,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x, position.y, position.z);
  mesh.userData.baseData = { base, index, complement };
  return mesh;
}

function createBond(p1, p2) {
  const points = [
    new THREE.Vector3(p1.x, p1.y, p1.z),
    new THREE.Vector3(p2.x, p2.y, p2.z),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.88 });
  return new THREE.Line(geometry, material);
}

function createBackboneSegment(start, end) {
  const dir = new THREE.Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
  const length = dir.length();
  const mid = new THREE.Vector3((start.x + end.x) * 0.5, (start.y + end.y) * 0.5, (start.z + end.z) * 0.5);

  const geometry = new THREE.CylinderGeometry(0.13, 0.13, length, 12);
  const material = new THREE.MeshStandardMaterial({ color: 0xb8b8d8, roughness: 0.55, metalness: 0.1 });
  const cylinder = new THREE.Mesh(geometry, material);

  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
  cylinder.position.copy(mid);
  cylinder.setRotationFromQuaternion(quat);

  return cylinder;
}

function buildHelix(sequence) {
  if (helixGroup) {
    rootGroup.remove(helixGroup);
    disposeObject3D(helixGroup);
  }

  helixGroup = new THREE.Group();
  baseMeshes = [];

  const data = buildHelixLayoutData(sequence, {
    radius: 4.1,
    risePerBase: 0.95,
    twistPerBase: Math.PI / 5,
  });

  const strand1 = [];
  const strand2 = [];

  data.pairs.forEach((pair) => {
    const base1 = createBaseMesh(pair.forwardBase, pair.p1, pair.index, pair.complementBase);
    const base2 = createBaseMesh(pair.complementBase, pair.p2, pair.index, pair.forwardBase);

    strand1.push(pair.p1);
    strand2.push(pair.p2);

    baseMeshes.push(base1, base2);
    helixGroup.add(base1, base2, createBond(pair.p1, pair.p2));
  });

  for (let i = 0; i < strand1.length - 1; i += 1) {
    helixGroup.add(createBackboneSegment(strand1[i], strand1[i + 1]));
    helixGroup.add(createBackboneSegment(strand2[i], strand2[i + 1]));
  }

  rootGroup.add(helixGroup);
  hover.registerBases(baseMeshes);
}

const hover = setupHoverInteraction({
  THREE,
  camera,
  sceneRoot: rootGroup,
  domElement: env.renderer.domElement,
  tooltipElement: tooltip,
});

setupUI({ onGenerate: buildHelix });

let previousTime = performance.now();
function animate(now) {
  const dt = (now - previousTime) / 1000;
  previousTime = now;

  rootGroup.rotation.y += dt * 0.16;
  controls.update();
  hover.updateHover();
  composer.render();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

