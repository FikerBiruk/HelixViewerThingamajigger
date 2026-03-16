const EASE_OUT_CUBIC = (t) => 1 - Math.pow(1 - t, 3);

export function createHelixAnimations({ THREE }) {
  function prepareSnapAnimation(helixGroup) {
    helixGroup.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      child.userData.snapTargetPosition = child.position.clone();
      child.userData.snapTargetScale = child.scale.clone();
      child.userData.snapDelay = Math.random() * 0.35;
      child.userData.snapProgress = 0;

      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 3.4,
        (Math.random() - 0.5) * 1.8
      );
      const startPosition = child.userData.snapTargetPosition.clone().multiplyScalar(0.2).add(offset);
      const startScale = child.userData.snapTargetScale.clone().setScalar(0.01);

      child.userData.snapStartPosition = startPosition;
      child.userData.snapStartScale = startScale;
      child.position.copy(startPosition);
      child.scale.copy(startScale);
    });
  }

  function updateSnapAnimation(helixGroup, dt) {
    if (!helixGroup) {
      return;
    }

    helixGroup.traverse((child) => {
      if (!child.isMesh || !child.userData.snapTargetPosition) {
        return;
      }

      const delay = child.userData.snapDelay;
      const rawProgress = child.userData.snapProgress + dt;
      child.userData.snapProgress = rawProgress;

      const normalized = Math.min(Math.max((rawProgress - delay) / 0.85, 0), 1);
      const t = EASE_OUT_CUBIC(normalized);

      child.position.lerpVectors(child.userData.snapStartPosition, child.userData.snapTargetPosition, t);
      child.scale.lerpVectors(child.userData.snapStartScale, child.userData.snapTargetScale, t);

      if (normalized >= 1) {
        child.position.copy(child.userData.snapTargetPosition);
        child.scale.copy(child.userData.snapTargetScale);
        delete child.userData.snapTargetPosition;
        delete child.userData.snapTargetScale;
        delete child.userData.snapStartPosition;
        delete child.userData.snapStartScale;
        delete child.userData.snapDelay;
        delete child.userData.snapProgress;
      }
    });
  }

  function updateBreathingAnimation(rootGroup, elapsedTime) {
    if (!rootGroup) {
      return;
    }

    const breath = 1 + Math.sin(elapsedTime * 0.72) * 0.018;
    rootGroup.scale.setScalar(breath);
  }

  return {
    prepareSnapAnimation,
    updateSnapAnimation,
    updateBreathingAnimation,
  };
}
