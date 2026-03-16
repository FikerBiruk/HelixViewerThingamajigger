export function setupHoverInteraction({ THREE, camera, sceneRoot, domElement, tooltipElement }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  let latestMouseEvent = null;

  const baseMeshes = [];

  function registerBases(meshes) {
    if (hovered) {
      resetHighlight(hovered);
      hovered = null;
    }
    hideTooltip();
    baseMeshes.length = 0;
    baseMeshes.push(...meshes);
  }

  function resetHighlight(mesh) {
    mesh.scale.set(1, 1, 1);
    if (mesh.material && typeof mesh.material.emissiveIntensity === "number") {
      mesh.material.emissiveIntensity = 0.3;
    }
  }

  function applyHighlight(mesh) {
    mesh.scale.set(1.24, 1.24, 1.24);
    if (mesh.material && typeof mesh.material.emissiveIntensity === "number") {
      mesh.material.emissiveIntensity = 0.95;
    }
  }

  function hideTooltip() {
    tooltipElement.classList.add("hidden");
  }

  function updateTooltip(mesh, event) {
    const data = mesh.userData.baseData;
    const rect = domElement.getBoundingClientRect();
    tooltipElement.innerHTML = `Base: <b>${data.base}</b><br>Index: <b>${data.index}</b><br>Complement: <b>${data.complement}</b>`;
    tooltipElement.style.left = `${event.clientX - rect.left + 10}px`;
    tooltipElement.style.top = `${event.clientY - rect.top - 12}px`;
    tooltipElement.classList.remove("hidden");
  }

  function onPointerMove(event) {
    latestMouseEvent = event;
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function updateHover() {
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(baseMeshes, false);
    const hit = intersections[0]?.object || null;

    if (hovered && hovered !== hit) {
      resetHighlight(hovered);
      hovered = null;
      hideTooltip();
    }

    if (hit && hit !== hovered) {
      hovered = hit;
      applyHighlight(hovered);
    }

    if (hovered && latestMouseEvent) {
      updateTooltip(hovered, latestMouseEvent);
    }
  }

  domElement.addEventListener("pointermove", onPointerMove);
  domElement.addEventListener("pointerleave", () => {
    if (hovered) {
      resetHighlight(hovered);
      hovered = null;
    }
    hideTooltip();
  });

  return {
    registerBases,
    updateHover,
    dispose() {
      domElement.removeEventListener("pointermove", onPointerMove);
    },
  };
}

