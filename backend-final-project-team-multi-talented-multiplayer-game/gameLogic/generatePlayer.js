// The generatePlayer function returns the default player object.

const { canvasWidth, canvasHeight } = require('../config/canvasConfig');

function checkSpawnPoint(x, y, otherPlayer) {
  if (x > otherPlayer.x + otherPlayer.r) {
    return false;
  }
  if (x < otherPlayer.x - otherPlayer.r) {
    return false;
  }
  if (y > otherPlayer.y + otherPlayer.r) {
    return false;
  }
  if (y < otherPlayer.y - otherPlayer.r) {
    return false;
  } else return true;
}

// might be good to have a class of player so that you can then call methods like incrementHealth() directly on the player instance
function generatePlayer(index, players) {
  let x = Math.floor(Math.random() * canvasWidth);
  let y = Math.floor(Math.random() * canvasHeight);

  const spawnCheck = players.filter((player) => checkSpawnPoint(x, y, player));

  if (spawnCheck.length === 0) {
    return {
      index: index,
      active: false,
      name: null,
      character: null,
      x: x,
      y: y,
      r: 50,
      vx: 0,
      vy: 0,
      collisionVelocityX: 0,
      collisionVelocityY: 0,
      width: 50,
      height: 50,
      right: false,
      left: false,
      up: false,
      down: false,
      health: 100,
      growthRate: 1.1,
      mass: 0.01,
    };
  } else generatePlayer(index, players);
}

module.exports = { generatePlayer };
