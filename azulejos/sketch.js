// noprotect
const windowW = window.innerWidth;
const windowH = window.innerHeight;

const tileW = 100;
const tileH = 100;

const tileX = Math.min(Math.floor(windowW / tileW), 12);
const tileY = Math.min(Math.floor(windowH / tileH), 12);

// fit however many tiles we can into the canvas
const canvasX = tileX * tileW;
const canvasY = tileY * tileH;

function setup() {
  createCanvas(canvasX, canvasY);
  noStroke();
  frameRate(2);
}

function draw() {
  const seed = Math.random();
  const updateX = Math.floor(seed * tileX);
  const updateY = Math.floor(Math.random() * tileY);
  const complexityMod = seed / 2 + 1;

  for (let tX = 0; tX < tileX; tX += 1) {
    for (let tY = 0; tY < tileY; tY += 1) {
      for (let x = 0; x < tileW; x += 1) {
        for (let y = 0; y < tileH; y += 1) {
          // initialize the whole board, and then only update one tile per frame after that
          if (
            frameCount % (tileX * tileY) === tX + tileX * tY ||
            frameCount === 1
          ) {
            // mirroring eightfold
            let pabsX = abs(x - tileW / 2);
            let pabsY = abs(y - tileH / 2);
            let absX = Math.max(pabsX, pabsY);
            let absY = Math.min(pabsX, pabsY);

            // using perlin noise to generate some contours.
            // i power it up by 2 or 4 to create blobbier more severe contours.
            // the blue and the gold are two separate noise contours.
            let color1 =
              255 *
              pow(
                noise(
                  0.02 * absX * complexityMod,
                  0.02 * absY * complexityMod,
                  0.02 * frameCount + 12.41 * tX + 13.25 * tY
                ),
                2
              );
            let color2 =
              255 *
              pow(
                noise(
                  0.02 * absX * complexityMod,
                  0.02 * absY * complexityMod,
                  0.03 * frameCount + 20 + 14.42 * tX + 12.7 * tY
                ),
                4
              );

            // colors get defined
            if (x % tileW === 0 || y % tileH === 0) {
              fill(255, 255, 255);
            } else if (50 <= color2 && color2 < 60) {
              fill(251, 191, 36);
            } else if (40 <= color2 && color2 < 50) {
              fill(245, 158, 11);
            } else if (color1 > 90) {
              fill(147, 197, 253);
            } else if (color1 > 65) {
              fill(37, 99, 235);
            } else if (color1 > 55) {
              fill(29, 78, 216);
            } else {
              fill(245, 245, 244);
            }
            if (frameCount === 1) {
              rect(x + tX * tileW, y + tY * tileH, 1, 1);
            } else {
              rect(x + updateX * tileW, y + updateY * tileH, 1, 1);
            }
          }
        }
      }
    }
  }
}
