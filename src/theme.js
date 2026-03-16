export const THEME_PRESETS = {
  cyberpunk: {
    sceneBackground: 0x090516,
    sceneFog: 0x090516,
    bloom: { strength: 0.95, radius: 0.78, threshold: 0.75 },
    ambient: { color: 0x7f7fff, intensity: 0.44 },
    directional: { color: 0x6dfcff, intensity: 1.15 },
    rim: { color: 0xff4fd6, intensity: 0.75 },
    exposure: 1.14,
  },
  lab: {
    sceneBackground: 0xf2f8ff,
    sceneFog: 0xe8f3ff,
    bloom: { strength: 0.26, radius: 0.45, threshold: 0.82 },
    ambient: { color: 0xd2e8ff, intensity: 0.66 },
    directional: { color: 0xffffff, intensity: 0.98 },
    rim: { color: 0x8dbdff, intensity: 0.34 },
    exposure: 1.02,
  },
  "dark-matter": {
    sceneBackground: 0x040208,
    sceneFog: 0x040208,
    bloom: { strength: 0.5, radius: 0.66, threshold: 0.83 },
    ambient: { color: 0x6e5ca8, intensity: 0.38 },
    directional: { color: 0xb3d0ff, intensity: 0.94 },
    rim: { color: 0x8e3cff, intensity: 0.44 },
    exposure: 1.05,
  },
};

export function applyTheme(themeName, env) {
  const resolvedTheme = THEME_PRESETS[themeName] ? themeName : "cyberpunk";
  const preset = THEME_PRESETS[resolvedTheme];
  const { scene, renderer, ambientLight, directionalLight, rimLight, bloomPass, THREE } = env;

  document.documentElement.setAttribute("data-theme", resolvedTheme);

  scene.background = new THREE.Color(preset.sceneBackground);
  scene.fog = new THREE.Fog(preset.sceneFog, 18, 90);

  ambientLight.color.setHex(preset.ambient.color);
  ambientLight.intensity = preset.ambient.intensity;

  directionalLight.color.setHex(preset.directional.color);
  directionalLight.intensity = preset.directional.intensity;

  rimLight.color.setHex(preset.rim.color);
  rimLight.intensity = preset.rim.intensity;

  bloomPass.strength = preset.bloom.strength;
  bloomPass.radius = preset.bloom.radius;
  bloomPass.threshold = preset.bloom.threshold;

  renderer.toneMappingExposure = preset.exposure;
}

export function setupThemeManager({ env }) {
  const select = document.getElementById("themeSelect");
  const defaultTheme = "cyberpunk";

  applyTheme(defaultTheme, env);
  if (!select) {
    return;
  }

  select.value = defaultTheme;
  select.addEventListener("change", () => {
    applyTheme(select.value, env);
  });
}
