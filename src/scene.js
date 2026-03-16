import * as THREE from "https://unpkg.com/three@0.162.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://unpkg.com/three@0.162.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://unpkg.com/three@0.162.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://unpkg.com/three@0.162.0/examples/jsm/postprocessing/UnrealBloomPass.js";

export function createSceneEnvironment(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x081318);
  scene.fog = new THREE.Fog(0x081318, 18, 90);

  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200);
  camera.position.set(0, 4, 22);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 8;
  controls.maxDistance = 55;

  const ambient = new THREE.AmbientLight(0xb7fff1, 0.52);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xfff8e8, 1.05);
  directional.position.set(7, 12, 10);
  scene.add(directional);

  const rim = new THREE.DirectionalLight(0x8fd9ff, 0.45);
  rim.position.set(-10, 5, -8);
  scene.add(rim);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.52,
    0.7,
    0.82
  );
  composer.addPass(bloomPass);

  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", onResize);

  return {
    THREE,
    scene,
    camera,
    renderer,
    controls,
    composer,
    dispose() {
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
    },
  };
}

