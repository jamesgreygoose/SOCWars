// Require and initialise express:

const express = require('express');
const app = express();

// Require and initialise cors and json.

const cors = require('cors');
app.use(
  cors({
    origin: 'https://soc-wars-working-dev.netlify.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.use(express.json());

// Create a server using express.

const server = require('http').createServer(app);

// Initialise socket.io with the express server.

const io = require('socket.io')(server, { origins: '*:*' });

// Set the PORT tos be assigned through environment variables (heroku) or localhost 5000.

const PORT = process.env.PORT || 5000;

// Game logic:

const { generatePlayer } = require('./gameLogic/generatePlayer');
const { generatePelletArray } = require('./gameLogic/generatePelletArray');
const { generateNewPellet } = require('./gameLogic/generateNewPellet');
const { handleCollision } = require('./gameLogic/handleCollision');
const { resolveCollision } = require('./gameLogic/resolveCollision');
const { setTimer } = require('./gameLogic/setTimer');
const { resetGame } = require('./gameLogic/resetGame');

// Event dictionary containing socket connection events:

const { eventDictionary } = require('./config/eventDictionary');

const {
  CONNECTION,
  ENTER_GAME,
  READY_TO_START,
  PLAYER_CONNECTED,
  GET_PLAYERS,
  GET_PELLETS,
  PLAYER_MOVED,
  PELLET_DELETED,
  PLAYER_COLLISION,
  UPDATE_HEALTH,
  UPDATE_SIZE,
  START_TIMER,
  PLAYER_JOINED,
  UPDATE_GAME_OVER,
  UPDATE_SCOREBOARD,
} = eventDictionary;

// Hello world to test whether the server is running:

app.get('/', (request, response) => {
  response.send('Hello World');
});

// The namespace '/game' created using socket.io.

const game = io.of('/game');

// The number of pellets in the game.

const numberOfPellets = 100;

/* The three rooms that the game can be played in. Each room contains an array of players, a pellet array, a set timer, a pellet
 regeneration speed and the scoreboard for that room. */

let rooms = {
  room1: {
    players: [],
    pelletRegenerationSpeed: 1000,
    pellets: generatePelletArray(numberOfPellets),
    timer: 120,
    scoreBoard: [],
    isRunning: false,
  },
  room2: {
    players: [],
    pelletRegenerationSpeed: 1000,
    pellets: generatePelletArray(numberOfPellets),
    timer: 120,
    scoreBoard: [],
    isRunning: false,
  },
  room3: {
    players: [],
    pelletRegenerationSpeed: 1000,
    pellets: generatePelletArray(numberOfPellets),
    timer: 120,
    scoreBoard: [],
    isRunning: false,
  },
};

/* The start of the game connection. The below code will resolve when a client connects, and listen for emitted events as long
 as they are connected. */

game.on(CONNECTION, (socket) => {
  // room 1
  setInterval(() => {
    let pellets = rooms.room1.pellets;
    if (pellets.length < numberOfPellets) {
      generateNewPellet(pellets, socket, socket.room);
    }
  }, rooms.room1.pelletRegenerationSpeed);
  // room 2
  setInterval(() => {
    let pellets = rooms.room2.pellets;

    if (pellets.length < numberOfPellets) {
      generateNewPellet(pellets, socket, socket.room);
    }
  }, rooms.room2.pelletRegenerationSpeed);
  // room 3
  setInterval(() => {
    let pellets = rooms.room3.pellets;

    if (pellets.length < numberOfPellets) {
      generateNewPellet(pellets, socket, socket.room);
    }
  }, rooms.room3.pelletRegenerationSpeed);

  /* Assigns the client a place in the connections array by checking for an empty space. Their index can then be used to identify
  them both on the backend and the frontend. Could refactor as a function? */

  let playerIndex = null;

  console.log(`I am ${socket.id} and my player index is ${playerIndex}`);

  socket.on('join_room', ({ roomId }) => {
    console.log(`${socket.id} has joined ${roomId}`);

    console.log(
      `I am ${socket.id} and my player index is ${playerIndex} in JOIN_ROOM`
    );
    socket.room = roomId;
    socket.join(roomId);

    game.emit('UPDATE_ROOMS', {
      room1: rooms.room1.players.length,
      room2: rooms.room2.players.length,
      room3: rooms.room3.players.length,
    });
  });

  /*   Listens for the client to enter a name a chose a character, and assigns their player the properties they have chosen once they
have done so. */

  socket.on(ENTER_GAME, ({ name, character }) => {
    const roomId = socket.room;

    rooms[roomId].isRunning = true;

    playerIndex = rooms[roomId].players.length;

    console.log(
      `I am ${socket.id} and my player index is ${playerIndex} in ENTER_GAME. I am generating my player here:`,
      rooms[roomId].players
    );

    rooms[roomId].players.push(
      generatePlayer(playerIndex, rooms[roomId].players)
    );

    console.log(
      `I am ${socket.id} and my player index is ${playerIndex} after generating my player in the players array:`,
      rooms[roomId].players
    );

    rooms[roomId].players[playerIndex].active = true;
    rooms[roomId].players[playerIndex].name = name;
    rooms[roomId].players[playerIndex].character = character;

    rooms[roomId].pelletRegenerationSpeed = 1000 / rooms[roomId].players.length;

    socket.to(roomId).emit(PLAYER_JOINED, {
      success: true,
      payload: { newPlayer: rooms[roomId].players[playerIndex] },
    });
  });

  /* Listens for when the client is ready to start the game, and emits the game variables required to play alongside their unique 
player index.  */

  socket.on(READY_TO_START, () => {
    const roomId = socket.room;

    game.to(socket.id).emit(PLAYER_CONNECTED, {
      success: true,
      payload: {
        message: 'You have joined the game.',
        playerIndex,
        activePlayers: rooms[roomId].players,
        pellets: rooms[roomId].pellets,
      },
    });
  });

  socket.on(START_TIMER, () => {
    const roomId = socket.room;
    setTimer(rooms[roomId].timer, game, roomId, rooms);
  });

  // Listens for when a player has moved, updates their location on the server, and updates their location for all other players.

  socket.on(PLAYER_MOVED, ({ player }) => {
    const roomId = socket.room;
    // console.log(
    //   `Here is the players array that Player ${playerIndex} will update:`,
    //   rooms[roomId].players
    // );
    // console.log(
    //   `Player ${playerIndex} has sent their movement, they are going to update:`,
    //   rooms[roomId].players[playerIndex]
    // );

    if (rooms[roomId].isRunning) {
      rooms[roomId].players[playerIndex].x = player.x;
      rooms[roomId].players[playerIndex].y = player.y;
      rooms[roomId].players[playerIndex].vx = player.vx;
      rooms[roomId].players[playerIndex].vy = player.vy;
      socket.to(roomId).emit(GET_PLAYERS, {
        player: rooms[roomId].players[playerIndex],
      });
    }
  });

  // Listens for when a pellet has been eaten by a player, removes the pellet from the game, and updates the pellets for all players.

  socket.on(PELLET_DELETED, ({ pelletId }) => {
    const roomId = socket.room;

    rooms[roomId].pellets.find((pellet, index) => {
      if (pellet) {
        if (pellet.id === pelletId) {
          rooms[roomId].pellets.splice(index, 1);
        }
      }
    });

    // The desired change to the player's properties after they have eaten a pellet.
    if (rooms[roomId].players[playerIndex].r < 150) {
      rooms[roomId].players[playerIndex].r +=
        rooms[roomId].players[playerIndex].growthRate;
    }

    rooms[roomId].players[playerIndex].health += 1;

    game.to(roomId).emit(GET_PELLETS, {
      success: true,
      payload: { pellets: rooms[roomId].pellets },
    });
    game
      .to(roomId)
      .emit(UPDATE_HEALTH, { player: rooms[roomId].players[playerIndex] });
    game
      .to(roomId)
      .emit(UPDATE_SIZE, { player: rooms[roomId].players[playerIndex] });
  });

  socket.on(UPDATE_SIZE, ({ playerIndex }) => {
    const roomId = socket.room;
    game
      .to(roomId)
      .emit(UPDATE_SIZE, { player: rooms[roomId].players[playerIndex] });
  });

  // Listens for when two players have collided, and resolves the collision.

  socket.on(PLAYER_COLLISION, ({ collisionIndexes }) => {
    const roomId = socket.room;

    if (rooms[roomId].isRunning) {
      const { playerIndex, otherPlayerIndex } = collisionIndexes;

      // console.log(
      //   `Player ${playerIndex} is colliding with ${otherPlayerIndex} in the PLAYER_COLLISION listener on the backend`
      // );

      // const { myPlayer, otherPlayer } =

      handleCollision(
        rooms[roomId].players[playerIndex],
        rooms[roomId].players[otherPlayerIndex]
      );

      resolveCollision(
        rooms[roomId].players[playerIndex],
        rooms[roomId].players[otherPlayerIndex],
        rooms[roomId].players,
        game,
        roomId,
        rooms
      );
    }
  });

  // The update scoreboard event emits the current player ranking to all clients every second, so that players can see who is winning.
  const scoreInterval = setInterval(() => {
    // clearInterval(scoreInterval) - NEEDS TO BE CLEARED WHEN THE GAME IS OVER!

    function sortPlayerScore(player1, player2) {
      if (player1.health < player2.health) {
        return 1;
      }
      if (player1.health > player2.health) {
        return -1;
      } else {
        return 0;
      }
    }

    const roomId = socket.room;

    if (roomId) {
      rooms[roomId].scoreBoard = [
        ...rooms[roomId].players,
      ].sort((player1, player2) => sortPlayerScore(player1, player2));
      game.to(roomId).emit(UPDATE_SCOREBOARD, {
        payload: { scoreBoard: rooms[roomId].scoreBoard },
      });
    }
  }, 1000);

  // Listens for when a player enters a room. If the room is at max capacity, they are sent to the waiting page.

  socket.on('UPDATE_MAX_CAPACITY', () => {
    const roomId = socket.room;
    if (rooms[roomId].players.length >= 5) {
      socket.emit('UPDATE_MAX_CAPACITY', {});
    }
  });

  // Listens for one player has killed another player in the game, and emits the information to be displayed on screen.

  socket.on(UPDATE_GAME_OVER, ({ losingPlayer, winningPlayer }) => {
    const roomId = socket.room;
    socket.to(roomId).emit(UPDATE_GAME_OVER, { losingPlayer, winningPlayer });
  });

  // Listens for the final scoreboard after the game has ended, and emits the final scores to the TimeUp component.

  socket.on('UPDATE_TIME_UP', ({ scoreBoard }) => {
    const roomId = socket.room;
    if (rooms[roomId].players) {
      rooms[roomId] = resetGame();
    }

    game.to(roomId).emit('UPDATE_TIME_UP', { scoreBoard });
  });

  // Listens for a player disconnecting from the game, and emits this information for remaining players.

  socket.on('disconnect', () => {
    const roomId = socket.room;
    if (socket.room && rooms[roomId].players[playerIndex]) {
      rooms[roomId].players[playerIndex].active = false;
    }
    game.to(roomId).emit('playerDisconnected', {
      // TODO: Update frontend code to handle this.
      success: true,
      payload: { playerIndex },
    });
  });

  socket.on('leaveRoom', () => {
    const roomId = socket.room;
    socket.leave(roomId);
  });
});

// Sets the server the listen on the specified port.

server.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
