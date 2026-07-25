import {
  raycaster, screenCenter, camera, interactiveObjects, hoveredObject, setHoveredObject, scene
} from './state.js';

let raycastFrameCount = 0;

export function showHUDCard(tag, title, desc) {
  const card = document.getElementById('hud-card');
  if (card) {
    document.getElementById('hud-tag').innerText = tag;
    document.getElementById('hud-title').innerText = title;
    document.getElementById('hud-desc').innerText = desc;
    card.classList.add('active');
  }
}

export function updateRaycaster() {
  // Throttle raycasting to alternate frames for maximum CPU efficiency
  raycastFrameCount++;
  if (raycastFrameCount % 2 !== 0 && hoveredObject) return;

  raycaster.setFromCamera(screenCenter, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);
  const crosshair = document.getElementById('crosshair');

  if (intersects.length > 0) {
    let topObject = intersects[0].object;
    while (topObject.parent && !topObject.userData.isInteractive && topObject.parent !== scene) {
      topObject = topObject.parent;
    }

    if (topObject.userData && topObject.userData.isInteractive) {
      if (hoveredObject !== topObject) {
        if (hoveredObject && hoveredObject.userData.onUnhover) hoveredObject.userData.onUnhover();
        setHoveredObject(topObject);
        if (hoveredObject.userData.onHover) hoveredObject.userData.onHover();
      }
      if (crosshair) crosshair.classList.add('hovered');
      return;
    }
  }

  if (hoveredObject) {
    if (hoveredObject.userData.onUnhover) hoveredObject.userData.onUnhover();
    setHoveredObject(null);
  }
  if (crosshair) crosshair.classList.remove('hovered');
}

export function triggerRaycastClick() {
  if (hoveredObject && hoveredObject.userData) {
    const data = hoveredObject.userData;
    showHUDCard(data.tag || "INFO", data.title || "Objek 3D", data.desc || "");
    if (data.onClick) data.onClick();
    return true;
  }
  return false;
}
