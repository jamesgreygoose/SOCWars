// Event dictionary:

import eventDictionary from '../../connections/eventDictionary';

// Socket connection events:

const { PELLET_DELETED } = eventDictionary;

// The eat pellet function manages the interaction between the player and the game pellets.

function eatPellet(player, pellets, connection) {
  // Calls an error in the console and returns from the function if there is no player.
  if (!player) {
    console.error('No player to eat pellets.');
    return;
  }

  // Calculates whether the player comes into contact with a pellet by cross-referencing their coordinates.

  for (let i = 0; i < pellets.length; i++) {
    let distanceX = 0;
    let distanceY = 0;
    let distance = 0;
    distanceX = player.x - pellets[i].x;
    distanceY = player.y - pellets[i].y;
    distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // A conditional statement that runs if a player comes into contact with a pellet.

    if (distance <= player.r * 2) {
      console.log(
        `I am Player ${player.index} and I am about to eat a pellet!`
      );
      // An emitted event to tell the game server that a pellet should be deleted.
      const pelletId = pellets[i].id;
      connection.emit(PELLET_DELETED, { pelletId });
    }
  }
}

export default eatPellet;
