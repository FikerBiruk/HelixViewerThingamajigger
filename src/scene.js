import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export function createSceneEnvironment(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090516);
  scene.fog = new THREE.Fog(0x090516, 18, 90);

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

  const ambient = new THREE.AmbientLight(0x7f7fff, 0.44);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0x6dfcff, 1.15);
  directional.position.set(7, 12, 10);
  scene.add(directional);

  const rim = new THREE.DirectionalLight(0xff4fd6, 0.75);
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
    ambientLight: ambient,
    directionalLight: directional,
    rimLight: rim,
    bloomPass,
    dispose() {
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
    },
  };
}

