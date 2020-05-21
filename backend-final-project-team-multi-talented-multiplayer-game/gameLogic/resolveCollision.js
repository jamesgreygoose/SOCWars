const { generatePelletArray } = require('./generatePelletArray');

const { eventDictionary } = require('../config/eventDictionary');

const { resetGame } = require('../gameLogic/resetGame');

const { PLAYER_KILLED, GAME_OVER, UPDATE_HEALTH } = eventDictionary;

function resolveCollision(
  myPlayer,
  otherPlayer,
  activePlayers,
  game,
  roomId,
  rooms
) {
  // console.log(
  //   `Player ${myPlayer.index} is resolving their collision with ${otherPlayer.index} in the resolveCollision function on the backend`
  // );

  if (myPlayer.health === 0) {
    // Sets the player's active property to false when their health reaches zero.

    myPlayer.active = false;

    // Emits the above information to all players.

    game.to(roomId).emit(PLAYER_KILLED, {
      losingPlayer: myPlayer,
      winningPlayer: otherPlayer,
    });

    // A array containing all of the remaining active players in the game. If there is only one remaining active player, they win!

    const remainingPlayers = activePlayers.filter(
      (player) => player.active === true
    );
    if (remainingPlayers.length === 1) {
      activePlayers[remainingPlayers[0].index].active = false;
      game
        .to(roomId)
        .emit(GAME_OVER, { victoriousPlayer: remainingPlayers[0] });

      // Should probably have a resetGame function that handles this sort of thing:

      rooms[roomId] = resetGame();
      console.log(rooms[roomId]);
    }
  }

  if (myPlayer.health > 0) {
    game.to(roomId).emit(UPDATE_HEALTH, {
      player: myPlayer,
    });
  }
}

module.exports = {
  resolveCollision,
};
