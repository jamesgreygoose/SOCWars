// Socket.io module:

import io from 'socket.io-client';

// Event dictionary:

import eventDictionary from '../../connections/eventDictionary';

// Properties of player object and pellet object as string items in an array:

import playerProperties from './playerProperties';
import pelletProperties from './pelletProperties';

// The randomIndex function.

import randomIndex from './randomIndex';

// Socket connection events:

const { READY_TO_START, PLAYER_CONNECTED } = eventDictionary;

// A url to direct the socket connection to backend server.

const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Tests to check whether the client receives the objects it needs to start the game.

describe('Fetching game objects from server.', () => {
  // The game objects begin as empty variables.

  let myPlayerIndex = null;
  let currentPlayers = [];
  let currentPellets = [];

  /* Before each test the client connects to the game namespace on the server, emits the event that tells the server it is ready
to start the game, listens for the server's response, and populates the game objects accordingly.  */

  beforeEach((done) => {
    const connection = io(`${url}/game`);
    connection.emit(READY_TO_START, { message: 'ready to start game' });
    connection.on(PLAYER_CONNECTED, ({ payload }) => {
      const { playerIndex, activePlayers, pellets } = payload;
      myPlayerIndex = playerIndex;
      currentPlayers = activePlayers;
      currentPellets = pellets;
      done();
    });
  });

  // Tests whether myPlayerIndex has been assigned a number by the server.

  test('Client receives a player index from the game server.', () => {
    const actual = typeof myPlayerIndex;
    const expected = 'number';
    expect(actual).toBe(expected);
  });

  /* Tests whether currentPlayers has been populated by checking whether a random item in the array has a 
 random property associated with the player object. */

  test('Client receives an array of players from the game server.', () => {
    const actual = currentPlayers[randomIndex(currentPlayers)];
    const expected = playerProperties[randomIndex(playerProperties)];
    expect(actual).toHaveProperty(expected);
  });

  /* Tests whether currentPellets has been populated by checking whether a random item in the array has a 
 random property associated with the pellet object. */

  test('Client receives an array of pellets from the game server', () => {
    const actual = currentPellets[randomIndex(currentPellets)];
    const expected = pelletProperties[randomIndex(pelletProperties)];
    expect(actual).toHaveProperty(expected);
  });
});
