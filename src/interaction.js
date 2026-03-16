export function setupHoverInteraction({ THREE, camera, domElement, tooltipElement, clickTooltipElement }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projection = new THREE.Vector3();

  const baseMeshes = [];
  let hovered = null;
  let selected = null;
  let latestMouseEvent = null;

  function meshTooltipContent(mesh) {
    const data = mesh.userData.baseData;
    return `Base: <b>${data.base}</b><br>Index: <b>${data.index}</b><br>Complement: <b>${data.complement}</b>`;
  }

  function hideHoverTooltip() {
    tooltipElement.classList.add("hidden");
  }

  function hideClickTooltip() {
    clickTooltipElement.classList.add("hidden");
  }

  function refreshMeshVisual(mesh) {
    if (!mesh) {
      return;
    }

    const isSelected = mesh === selected;
    const isHovered = mesh === hovered;
    const scale = isSelected ? 1.34 : isHovered ? 1.22 : 1;
    const emissive = isSelected ? 1.15 : isHovered ? 0.9 : 0.3;

    mesh.scale.set(scale, scale, scale);
    if (mesh.material && typeof mesh.material.emissiveIntensity === "number") {
      mesh.material.emissiveIntensity = emissive;
    }
  }

  function setHovered(nextHovered) {
    if (hovered && hovered !== nextHovered) {
      refreshMeshVisual(hovered);
    }

    hovered = nextHovered;
    if (hovered) {
      refreshMeshVisual(hovered);
    }
  }

  function setSelected(nextSelected) {
    if (selected && selected !== nextSelected) {
      refreshMeshVisual(selected);
    }

    selected = nextSelected;
    if (selected) {
      clickTooltipElement.innerHTML = meshTooltipContent(selected);
      clickTooltipElement.classList.remove("hidden");
      refreshMeshVisual(selected);
    } else {
      hideClickTooltip();
    }
  }

  function updatePointerFromEvent(event) {
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function updateHoverTooltip(event) {
    if (!hovered) {
      hideHoverTooltip();
      return;
    }

    const rect = domElement.getBoundingClientRect();
    tooltipElement.innerHTML = meshTooltipContent(hovered);
    tooltipElement.style.left = `${event.clientX - rect.left + 10}px`;
    tooltipElement.style.top = `${event.clientY - rect.top - 12}px`;
    tooltipElement.classList.remove("hidden");
  }

  function updateSelectedTooltipPosition() {
    if (!selected) {
      return;
    }

    const rect = domElement.getBoundingClientRect();
    selected.getWorldPosition(projection);
    projection.project(camera);
    const isVisible = projection.z > -1 && projection.z < 1;

    if (!isVisible) {
      hideClickTooltip();
      return;
    }

    const x = (projection.x * 0.5 + 0.5) * rect.width;
    const y = (-projection.y * 0.5 + 0.5) * rect.height;

    clickTooltipElement.style.left = `${x + 12}px`;
    clickTooltipElement.style.top = `${y - 14}px`;
    clickTooltipElement.classList.remove("hidden");
  }

  function onPointerMove(event) {
    latestMouseEvent = event;
    updatePointerFromEvent(event);
  }

  function onClick(event) {
    updatePointerFromEvent(event);
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(baseMeshes, false);
    setSelected(intersections[0]?.object || null);
  }

  function updateHover() {
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(baseMeshes, false);
    const hit = intersections[0]?.object || null;

    if (hit !== hovered) {
      setHovered(hit);
    }

    if (hovered && latestMouseEvent) {
      updateHoverTooltip(latestMouseEvent);
    } else {
      hideHoverTooltip();
    }

    updateSelectedTooltipPosition();
  }

  function registerBases(meshes) {
    setHovered(null);
    setSelected(null);
    hideHoverTooltip();

    baseMeshes.length = 0;
    baseMeshes.push(...meshes);
  }

  domElement.addEventListener("pointermove", onPointerMove);
  domElement.addEventListener("click", onClick);
  domElement.addEventListener("pointerleave", () => {
    setHovered(null);
    hideHoverTooltip();
  });

  return {
    registerBases,
    updateHover,
    dispose() {
      domElement.removeEventListener("pointermove", onPointerMove);
      domElement.removeEventListener("click", onClick);
    },
  };
}

