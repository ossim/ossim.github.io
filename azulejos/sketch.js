// noprotect
const windowW = window.innerWidth;
const windowH = window.innerHeight;

const tileW = 100;
const tileH = 100;

const tileX = Math.min(Math.floor(windowW / tileW), 4);
const tileY = Math.min(Math.floor(windowH / tileH), 4);

const tIndex = [...Array(tileX * tileY)];
const xIter = [...Array(tileW / 2)];
// fit however many tiles we can into the canvas
const canvasX = tileX * tileW;
const canvasY = tileY * tileH;

function setup() {
  createCanvas(canvasX, canvasY);
  noStroke();
  frameRate(24);
}

function draw() {
  tIndex.forEach((v, tI) => {
    const xI = tI % tileX;
    const yI = Math.floor(tI / tileX);
    const xO = (xI + 0.5) * tileW;
    const yO = (yI + 0.5) * tileH;

    xIter.forEach((w, x) => {
      [...Array(x + 1)].forEach((q, y) => {
        if (
          // we don't have to update every px per frame!
          x % 3 === (frameCount * 7) % 3 &&
          y % 4 === (frameCount * 7) % 4
        ) {
          let color1 =
            255 *
            pow(noise(0.03 * (x + xO), 0.03 * (y + yO), 0.001 * frameCount), 2);
          let color2 =
            255 *
            pow(noise(0.04 * (x + xO), 0.04 * (y + yO), 0.002 * frameCount), 4);

          if (55 <= color2 && color2 < 57) {
            // amber 500
            fill(245, 158, 11);
          } else if (50 <= color2 && color2 < 55) {
            // amber 600
            fill(251, 191, 36);
          } else if (40 <= color2 && color2 < 50) {
            // amber 500
            fill(245, 158, 11);
          } else if (color1 > 90) {
            // blue 400
            fill(56, 189, 248);
          } else if (color1 > 88) {
            // blue 500
            fill(14, 165, 233);
          } else if (color1 > 65) {
            // blue 600
            fill(2, 132, 199);
          } else if (color1 > 55) {
            // blue 700
            fill(3, 105, 161);
          } else if (color1 > 54) {
            // blue 400
            fill(56, 189, 248);
          } else {
            fill(245, 245, 244);
          }

          // color 8 rects at once since they're all identical
          rect(xO + x, yO + y, 1, 1);
          rect(xO + y, yO + x, 1, 1);
          rect(xO - x, yO - y, 1, 1);
          rect(xO - y, yO - x, 1, 1);
          rect(xO + x, yO - y, 1, 1);
          rect(xO + y, yO - x, 1, 1);
          rect(xO - x, yO + y, 1, 1);
          rect(xO - y, yO + x, 1, 1);
        }
      });
    });
  });
}
