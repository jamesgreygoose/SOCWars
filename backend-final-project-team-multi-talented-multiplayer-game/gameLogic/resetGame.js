const { generatePelletArray } = require('./generatePelletArray');

const numberOfPellets = 100;

function resetGame() {
  return {
    players: [],
    pelletRegenerationSpeed: 1000,
    pellets: generatePelletArray(numberOfPellets),
    timer: 120,
    scoreBoard: [],
    isRunning: false,
  };
}

module.exports = { resetGame };
