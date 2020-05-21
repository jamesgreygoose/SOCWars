import { subtract, multiply, dot, add, divide } from 'mathjs';

// Event dictionary:

import eventDictionary from '../../connections/eventDictionary';

// Socket connection events:

const { PLAYER_COLLISION, UPDATE_SIZE, PLAYER_MOVED } = eventDictionary;

function normalise(vectorArray) {
  let magnitude = Math.sqrt(
    vectorArray[0] * vectorArray[0] + vectorArray[1] * vectorArray[1]
  );
  if (magnitude === 0) {
    magnitude = 0.001;
  }
  return [vectorArray[0] / magnitude, vectorArray[1] / magnitude];
}

function getCollisionInfo(player) {
  const collisionInfo = {
    m: player.mass,
    x: [player.x, player.y],
    v: [player.vx, player.vy],
  };
  return collisionInfo;
}

function calculatePlayerVelocities(player1, player2, collisionNormal) {
  // Simplified player mass, position and velocity as vectors.

  const c1 = getCollisionInfo(player1);
  const c2 = getCollisionInfo(player2);

  const relativeVelocity = subtract(c1.v, c2.v);

  // Calculate collision energy, based on sum of masses and velocities.

  const j = dot(relativeVelocity, collisionNormal) * (c1.m + c2.m);

  // Affect players velocity along the collision normal, scaling by the collision energy
  // and each player's mass.

  const p1v = add(c1.v, divide(multiply(collisionNormal, -j), c1.m));
  const p2v = add(c2.v, divide(multiply(collisionNormal, j), c2.m));
  return [p1v, p2v];
}

/* The collidePlayers function manages the interaction between to players when they come into contact with each other on the 
canvas. */

function collidePlayers(myPlayer, otherPlayer, connection) {
  // Adjusts players mass according to their current radius, and multiplies the effect so that it is more noticeable.

  console.log(
    `Player ${myPlayer.index} is about to run the collidePlayers function with Player ${otherPlayer.index}.`
  );

  // An emitted event to tell the game server the ids of the two players have collided.

  function calculateMass(playerRadius) {
    const minimumPlayerRadius = 50;
    const maximumPlayerRadius = 150;

    const growthPercentage =
      (playerRadius - minimumPlayerRadius) /
      (maximumPlayerRadius - minimumPlayerRadius);

    const minimumMass = 200;
    const maximumMass = 1000;

    const massRange = maximumMass - minimumMass;
    const massOffset = growthPercentage * massRange;

    return massOffset + minimumMass;
  }

  myPlayer.mass = calculateMass(myPlayer.r);
  otherPlayer.mass = calculateMass(otherPlayer.r);

  const relativeDisplacement = [
    myPlayer.x - otherPlayer.x,
    myPlayer.y - otherPlayer.y,
  ];

  const collisionNormal = normalise(relativeDisplacement);

  // Calculates what the player velocities should be following the collision.

  const [myPlayerVelocity, otherPlayerVelocity] = calculatePlayerVelocities(
    myPlayer,
    otherPlayer,
    collisionNormal
  );

  /*   Changes the colliding players velocities according to the above calculation, and multiplies the effect so that it is more
 noticeable. */

  const VELOCITY_SCALING_FACTOR = 1;

  myPlayer.collisionVelocityX = myPlayerVelocity[0] * VELOCITY_SCALING_FACTOR;
  myPlayer.collisionVelocityY = myPlayerVelocity[1] * VELOCITY_SCALING_FACTOR;
  // otherPlayer.vx = otherPlayerVelocity[0] * VELOCITY_SCALING_FACTOR;
  // otherPlayer.vy = otherPlayerVelocity[1] * VELOCITY_SCALING_FACTOR;

  const distanceX = myPlayer.x - otherPlayer.x;
  const distanceY = myPlayer.y - otherPlayer.y;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  const penetration = distance - (myPlayer.r + otherPlayer.r);

  const totalMass = myPlayer.mass + otherPlayer.mass;

  myPlayer.x -=
    penetration * (otherPlayer.mass / totalMass) * collisionNormal[0];
  myPlayer.y -=
    penetration * (otherPlayer.mass / totalMass) * collisionNormal[1];
  // otherPlayer.x +=
  //   penetration * (myPlayer.mass / totalMass) * collisionNormal[0];
  // otherPlayer.y +=
  //   penetration * (myPlayer.mass / totalMass) * collisionNormal[1];

  // Updates the new position of both players.

  console.log(
    `Player ${myPlayer.index} is about to emit themself and Player ${otherPlayer.index} to the backend after the collidePlayers function has finished its calculation.`
  );
}

export default collidePlayers;
