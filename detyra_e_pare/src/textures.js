import * as THREE from 'three';

function randomSource(seed = 132126) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function canvasTexture(width, height, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext('2d'), randomSource());
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function woodTexture() {
  return canvasTexture(1024, 1024, (ctx, random) => {
    ctx.fillStyle = '#b89161';
    ctx.fillRect(0, 0, 1024, 1024);
    const plankWidth = 128;
    for (let row = 0; row < 8; row++) {
      const lightness = 51 + random() * 10;
      ctx.fillStyle = `hsl(33, 32%, ${lightness}%)`;
      ctx.fillRect(row * plankWidth + 1, 0, plankWidth - 2, 1024);
      for (let grain = 0; grain < 190; grain++) {
        const x = row * plankWidth + random() * plankWidth;
        ctx.strokeStyle = `rgba(${random() > .5 ? '246,224,189' : '72,49,26'},${.025 + random() * .065})`;
        ctx.lineWidth = .3 + random() * 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x + random() * 15, 300, x - random() * 13, 700, x + random() * 8, 1024);
        ctx.stroke();
      }
      const joint = ((row % 3) * 341 + 140) % 1024;
      ctx.fillStyle = '#79614488';
      ctx.fillRect(row * plankWidth, joint, plankWidth, 2);
    }
  });
}
