// Event dictionary containing socket connection events:

const { eventDictionary } = require('../config/eventDictionary');

const { canvasWidth, canvasHeight } = require('../config/canvasConfig');

const { GET_PELLETS } = eventDictionary;

// A default pellet object. It's cordinates are randomly generated.

function generatePellet() {
  return (pellet = {
    x: Math.floor(Math.random() * canvasWidth),
    y: Math.floor(Math.random() * canvasHeight),
    r: 10,
    id: Math.random(),
  });
}

// The generateNewPellet function pushes a new pellet into the pellets array, and emits the updated array to all players.

function generateNewPellet(pellets, socket, roomId) {
  if (!roomId) {
    console.log('no room');
    return;
  }
  pellets.push(generatePellet());
  socket
    .to(roomId)
    .emit(GET_PELLETS, { success: true, payload: { pellets, roomId } });
}

module.exports = { generateNewPellet };
