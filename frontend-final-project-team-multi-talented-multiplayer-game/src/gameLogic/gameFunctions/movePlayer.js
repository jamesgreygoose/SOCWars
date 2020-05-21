// Game functions:

import collidePlayers from './collidePlayers';
import checkCollision from './checkCollision';

// Event dictionary:

import eventDictionary from '../../connections/eventDictionary';

// Canvas properties:

import canvasProperties from '../../components/Canvas/canvasConfig';

const { canvasWidth, canvasHeight } = canvasProperties;

// Socket connection events:

const { PLAYER_MOVED } = eventDictionary;

// The move player function moves a player accross the canvas according to the buttons they press on their keyboard.

function movePlayer(players, myPlayer, myPlayerIndex, connection) {
  // Calls an error in the console and returns from the function if there is no player.
  if (!myPlayer) {
    console.error("Asked to move a player that doesn't exist.");
    return;
  }

  // Checks whether the player has entered into a collision with another player, and resolves the collision if they have.

  if (players.length > 1) {
    const otherPlayer = checkCollision(
      myPlayer,
      players,
      myPlayerIndex,
      connection
    );

    if (otherPlayer) {
      console.log(
        `Player ${myPlayer.index} is about to collide with Player ${otherPlayer.index} in the movePlayer function.`
      );
      collidePlayers(myPlayer, otherPlayer, connection);
    }
  }

  // Takes into account the player's collision velocity, then sets it to zero.

  if (myPlayer.collisionVelocityX || myPlayer.collisionVelocityY) {
    myPlayer.vx += myPlayer.collisionVelocityX;
    myPlayer.vy += myPlayer.collisionVelocityY;
    myPlayer.collisionVelocityX = 0;
    myPlayer.collisionVelocityY = 0;
  }

  // Scrolls the client's window to follow the player when they move.

  window.scrollTo(
    myPlayer.x - window.innerWidth / 2,
    myPlayer.y - window.innerHeight / 2
  );

  // Prevents the player from travelling outside of the canvas.

  if (myPlayer.x <= myPlayer.r) {
    myPlayer.x = myPlayer.r;
  }
  if (myPlayer.x >= canvasWidth - myPlayer.r) {
    myPlayer.x = canvasWidth - myPlayer.r;
  }
  if (myPlayer.y <= myPlayer.r) {
    myPlayer.y = myPlayer.r;
  }
  if (myPlayer.y >= canvasHeight - myPlayer.r) {
    myPlayer.y = canvasHeight - myPlayer.r;
  }

  // Key DOWN event listeners. Allows the myPlayer to travel in the desired direction using the W, A, S, D keys.

  document.onkeydown = function (event) {
    if (event.keyCode === 68) {
      myPlayer.right = true;
    }
    if (event.keyCode === 65) {
      myPlayer.left = true;
    }
    if (event.keyCode === 87) {
      myPlayer.up = true;
    }
    if (event.keyCode === 83) {
      myPlayer.down = true;
    }
  };

  // Key UP event listeners. Prevents the myPlayer from travelling when the W, A, S, D keys are not pressed.

  document.onkeyup = function (event) {
    if (event.keyCode === 68) {
      myPlayer.right = false;
    }
    if (event.keyCode === 65) {
      myPlayer.left = false;
    }
    if (event.keyCode === 87) {
      myPlayer.up = false;
    }
    if (event.keyCode === 83) {
      myPlayer.down = false;
    }
  };

  // If the directional condition is met, sets myPlayer's acceleration to one.

  let ACCELERATION = { x: 0, y: 0 };

  if (myPlayer.right === true) {
    ACCELERATION.x = 1;
  }
  if (myPlayer.left === true) {
    ACCELERATION.x = -1;
  }
  if (myPlayer.up === true) {
    ACCELERATION.y = -1;
  }
  if (myPlayer.down === true) {
    ACCELERATION.y = 1;
  }

  // Normalises the myPlayer's vector so that they move an equal length in any direction: both sideways and diagonally.

  const magnitude = Math.sqrt(
    ACCELERATION.x * ACCELERATION.x + ACCELERATION.y * ACCELERATION.y
  );

  /* Magnitude with be greater than zero when the myPlayer is moving, and they will move as fast accross the canvas according to the 
  throttle variable. */

  const minimumPlayerRadius = 50;
  const maximumPlayerRadius = 150;

  const growthPercentage =
    (myPlayer.r - minimumPlayerRadius) /
    (maximumPlayerRadius - minimumPlayerRadius);

  const minimumFC = 0.1;
  const maximumFC = 0.2;

  const FCRange = maximumFC - minimumFC;
  const FCOffset = growthPercentage * FCRange;

  // The frictional coefficient is calculated according to the player's size. The bigger they are, the slower they move.

  const FRICTIONAL_COEFFICIENT = FCOffset + minimumFC;

  const friction = {
    x: myPlayer.vx * FRICTIONAL_COEFFICIENT,
    y: myPlayer.vy * FRICTIONAL_COEFFICIENT,
  };

  if (magnitude > 0) {
    ACCELERATION.x = ACCELERATION.x / magnitude;
    ACCELERATION.y = ACCELERATION.y / magnitude;

    const THROTTLE = 3;

    ACCELERATION.x *= THROTTLE;
    ACCELERATION.y *= THROTTLE;
  }

  myPlayer.vx += ACCELERATION.x - friction.x;
  myPlayer.vy += ACCELERATION.y - friction.y;

  myPlayer.x += myPlayer.vx;
  myPlayer.y += myPlayer.vy;

  // An emitted event that tells the game server that a myPlayer has moved.
  connection.emit(PLAYER_MOVED, { player: myPlayer });
}

export default movePlayer;
