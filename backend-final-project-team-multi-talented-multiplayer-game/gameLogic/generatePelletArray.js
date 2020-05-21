// The generatePelletArray function returns an array with the specified number of pellets in it.
const { canvasWidth, canvasHeight } = require('../config/canvasConfig');

function generatePelletArray(numberOfPellets) {
  let pellets = [];
  for (let i = 0; i < numberOfPellets; i++) {
    pellets.push(generatePellet());
  }
  return pellets;
}

function generatePellet() {
  return (pellet = {
    x: Math.floor(Math.random() * canvasWidth),
    y: Math.floor(Math.random() * canvasHeight),
    r: 10,
    id: Math.random(),
  });
}

module.exports = { generatePelletArray };
