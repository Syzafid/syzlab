export function togglePanoramaMode(enable) {
  if (enable) {
    window.location.href = './scene2.html';
  } else {
    window.location.href = './index.html';
  }
}
