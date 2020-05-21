// Event dictionary:

import eventDictionary from '../../connections/eventDictionary';

// Socket connection events:

const { PLAYER_COLLISION, UPDATE_SIZE, PLAYER_MOVED } = eventDictionary;

function checkCollision(myPlayer, players, playerIndex, connection) {
  // An array of all the active players in the game other than the client.

  let otherPlayers = players.filter((player, index) => {
    if (index != playerIndex && player.active) {
      return player;
    }
  });

  // Calculates whether the player has collided with another player by cross-referencing their coordinates.

  for (let index = 0; index < otherPlayers.length; index++) {
    let distanceX = 0;
    let distanceY = 0;
    let distance = 0;
    distanceX = myPlayer.x - otherPlayers[index].x;
    distanceY = myPlayer.y - otherPlayers[index].y;
    distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    /* <<< Alex's advice: Make sure there is a logical realtionship between collision distance and player size. 
   Distance should be <= the sum of the both the collider's radius' >>> */

    // A conditional statement which returns the player they have collided, or false if no collision is detected.

    if (distance < myPlayer.r + otherPlayers[index].r) {
      const collisionIndexes = {
        playerIndex: myPlayer.index,
        otherPlayerIndex: otherPlayers[index].index,
      };

      connection.emit(PLAYER_COLLISION, { collisionIndexes });

      console.log(
        `Player ${myPlayer.index} is colliding with Player ${otherPlayers[index].index}`
      );
      return players[otherPlayers[index].index];
    } else return false;
  }
}

export default checkCollision;
