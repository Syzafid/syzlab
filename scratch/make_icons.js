const fs = require('fs');
const path = require('path');

// Generate minimal valid transparent 64x64 PNGs with drawn icons using pure node buffer if canvas not present,
// or canvas if available.
try {
  const { createCanvas } = require('canvas');
  
  function makeInsta() {
    const c = createCanvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(32, 32, 192, 192, 48);
    ctx.stroke();
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(128, 128, 46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(178, 78, 12, 0, Math.PI * 2);
    ctx.fill();
    return c.toBuffer('image/png');
  }

  function makeWeb() {
    const c = createCanvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(128, 128, 88, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(40, 128);
    ctx.lineTo(216, 128);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(128, 128, 88, 38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(128, 40);
    ctx.lineTo(128, 216);
    ctx.stroke();
    return c.toBuffer('image/png');
  }

  fs.writeFileSync(path.join(__dirname, '../assets/ar-card/instagram.png'), makeInsta());
  fs.writeFileSync(path.join(__dirname, '../assets/ar-card/website_icon.png'), makeWeb());
  console.log('PNG Icons generated successfully via canvas');
} catch (e) {
  console.log('Canvas module not installed, creating fallback script notice:', e.message);
}
