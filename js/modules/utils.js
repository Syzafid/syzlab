// utils.js – common helper utilities for the metaverse-gallery project

// Math helpers
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Performance helpers
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Three.js shortcuts
export function createMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function applyMaterial(object, material) {
  if (object.isMesh) {
    object.material = material;
  } else if (object.children) {
    object.children.forEach((ch) => applyMaterial(ch, material));
  }
}

export function setScale(object, x, y, z) {
  object.scale.set(x, y, z);
}

// Event management helpers
export function on(target, type, listener, options) {
  target.addEventListener(type, listener, options);
}

export function off(target, type, listener, options) {
  target.removeEventListener(type, listener, options);
}

export function once(target, type, listener, options) {
  const wrapper = function (e) {
    listener(e);
    off(target, type, wrapper, options);
  };
  on(target, type, wrapper, options);
}
