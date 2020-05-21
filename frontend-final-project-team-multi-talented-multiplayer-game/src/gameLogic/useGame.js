import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
// Backend socket connection:

import connection from '../connections/gameConnection';

// Event dictionary:

import eventDictionary from '../connections/eventDictionary';

// Canvas functions:

import drawPlayer from './canvasFunctions/drawPlayer';
import drawPellet from './canvasFunctions/drawPellet';
import drawTimer from './canvasFunctions/drawTimer';

// Game functions:

import movePlayer from './gameFunctions/movePlayer';
import eatPellet from './gameFunctions/eatPellet';
import resetGame from './gameFunctions/resetGame';

// Update functions:

import handleGameEnd from './updateFunctions/handleGameEnd';
import {
  showHighScorer,
  showPlayerJoined,
  showPlayerDisconnected,
  showCountdownAlert,
} from './updateFunctions/handleGameEvent';
import handleGameOver from './updateFunctions/handleGameOver';
import showScoreBoard from './updateFunctions/showScoreBoard';
import handleTimeUp from './updateFunctions/handleTimeUp';

// Socket connection events:

const {
  READY_TO_START,
  START_TIMER,
  UPDATE_TIMER,
  PLAYER_CONNECTED,
  GET_PLAYERS,
  GET_PELLETS,
  UPDATE_HEALTH,
  UPDATE_SIZE,
  PLAYER_KILLED,
  GAME_OVER,
  TIME_UP,
  PLAYER_JOINED,
  UPDATE_SCOREBOARD,
} = eventDictionary;

/* The useGame hook returns a start function, which takes in the canvas redered in the Canvas component. It contains all of the fronend 
game logic */

function useGame() {
  const history = useHistory();
  useEffect(() => {
    return () => {
      connection.removeAllListeners();
    };
  }, []);

  function start(canvas) {
    // The canvas element context which is used to draw on the rendered canvas.

    let ctx = canvas.getContext('2d', { alpha: false });

    // The essential game variables, which are populated by the server before starting the game, and updated during the game.

    let myPlayerIndex = null;
    let currentPlayers = [];
    let currentPellets = [];
    let gameDuration = 0;
    let currentScoreBoard = [];

    // An emitted event to tell the game server that the player client is ready to start the game.

    connection.emit(READY_TO_START, { message: 'ready to start game' });

    // A listener which takes in the initial game variables, populates them locally for the client, and starts the game loop.

    connection.on(PLAYER_CONNECTED, ({ payload }) => {
      const { playerIndex, activePlayers, pellets } = payload;

      myPlayerIndex = playerIndex;
      currentPlayers = activePlayers;
      currentPellets = pellets;

      console.log(
        `I am Player ${myPlayerIndex} and I have updated my currentPlayers array in PLAYER_CONNECTED:`,
        currentPlayers
      );

      if (currentPlayers.length === 1) {
        connection.emit(START_TIMER, { message: 'ready to start timer' });
      }
      startGameLoop();
    });

    connection.on(PLAYER_JOINED, ({ payload }) => {
      const { newPlayer } = payload;
      currentPlayers.push(newPlayer);
      console.log(
        `I am Player ${myPlayerIndex} and I have updated my currentPlayers array in PLAYER_JOINED:`,
        currentPlayers
      );
      showPlayerJoined(newPlayer.name);
    });

    connection.on('playerDisconnected', ({ payload }) => {
      const { playerIndex } = payload;
      if (currentPlayers[playerIndex]) {
        currentPlayers[playerIndex].active = false;
        showPlayerDisconnected(currentPlayers[playerIndex]);
      }
    });

    connection.on(UPDATE_TIMER, ({ payload }) => {
      const { timeRemaining } = payload;
      gameDuration = timeRemaining;
      if (gameDuration === 20) {
        showCountdownAlert();
      }
    });

    // Shows winner on when times up
    connection.on(TIME_UP, () => {
      currentPlayers[myPlayerIndex].active = false;
      resetGame(myPlayerIndex, currentPlayers, currentPellets);
      history.push('/timeup');
      handleTimeUp(currentScoreBoard, connection);
    });

    // receive scoreboard

    connection.on(UPDATE_SCOREBOARD, ({ payload }) => {
      const { scoreBoard } = payload;
      currentScoreBoard = scoreBoard;
      showScoreBoard(currentScoreBoard);
    });

    /* A listener which takes in the game players and updates them for the client. Allows the player to see other players move
    and change in real time. */

    connection.on(GET_PLAYERS, ({ player }) => {
      if (currentPlayers[player.index] && player.index != myPlayerIndex) {
        currentPlayers[player.index].x = player.x;
        currentPlayers[player.index].y = player.y;
        currentPlayers[player.index].vx = player.vx;
        currentPlayers[player.index].vy = player.vy;
      } else
        console.log('Player has received themself in the GET_PLAYERS listener');
    });

    /* A listener that updates the client when a player's health changes during the game. */

    connection.on(UPDATE_HEALTH, ({ player }) => {
      if (player) {
        currentPlayers[player.index].health = player.health;
      }
      if (player.health === 200) {
        showHighScorer(player);
      }
    });

    /* A listener that updates the client when a player's size changes during the game, and changes their radius accordingly. */

    connection.on(UPDATE_SIZE, ({ player }) => {
      if (player) {
        currentPlayers[player.index].r = player.r;
      }
    });

    /* A listener that updates the client when a player is killed during the game, it sets their activity property accordingly and 
    registers the event to inform other players. If it is the client's player that has been killed, it redirects the player to the
    game over screen. */

    connection.on(PLAYER_KILLED, ({ losingPlayer, winningPlayer }) => {
      if (losingPlayer) {
        currentPlayers[losingPlayer.index].active = losingPlayer.active;
      }
      if (losingPlayer.index === myPlayerIndex) {
        handleGameOver(losingPlayer, winningPlayer, connection);
        currentPlayers[myPlayerIndex].active = false;
        history.push('/gameover');
      }
    });

    /* A listener that updates the client when there is only one active player remaining in the game. If the client's player is 
    victorious, they are taken to the game over screen and told they have won. Otherwise, the client is taken to the game over
    screen as normal. Currently the game mode is last player standing, but this will change with the addition of a timer. */

    connection.on(GAME_OVER, ({ victoriousPlayer }) => {
      currentPlayers[victoriousPlayer.index].active = false;
      if (victoriousPlayer.index === myPlayerIndex) {
        // NEED TO FINISH THIS FUNCTION SO THAT THE VICTORIOUS PLAYER IS GIVEN THE CORRECT MESSAGE.
        handleGameEnd(victoriousPlayer);
        history.push('/gameover');
      } else
        handleGameOver(
          currentPlayers[myPlayerIndex],
          victoriousPlayer,
          connection
        );
      history.push('/gameover');
    });

    /* A listener which takes in the game pellets and updates them for the client. Allows the player see pellets
      being eaten by other players in real time. */

    connection.on(GET_PELLETS, ({ payload }) => {
      const { pellets } = payload;
      currentPellets = pellets;
    });

    /* The startGameLoop function calls each of the essential game function in turn, and repeats itself according to the client's 
    browser refresh rate. */

    function startGameLoop() {
      // The client's player object:

      const myPlayer = currentPlayers[myPlayerIndex];

      // Stops the game loop if the client's player is set to inactive OR they do not have a player.

      if (!myPlayer || !myPlayer.active) {
        console.log(
          `Game loop has ended because myPlayer(${myPlayer}) does not exist, or myPlayer.active is false(${myPlayer.active})`
        );
        connection.emit('leaveRoom');
        resetGame(myPlayerIndex, currentPlayers, currentPellets);
        return;
      }

      // Erases the canvas so it can be redrawn.

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draws the pellets and players on to the canvas.

      currentPellets.forEach((pellet) => drawPellet(ctx, pellet));
      currentPlayers.forEach((player) => {
        if (player.active) {
          drawPlayer(ctx, player);
        }
      });

      // Allows the player to move, eat pellets and collide with other players. The movePlayer function checks and resolves collision.

      movePlayer(currentPlayers, myPlayer, myPlayerIndex, connection, ctx);
      eatPellet(myPlayer, currentPellets, connection);
      drawTimer(gameDuration);

      // Repeats the game loop at the browsers refersh rate. Only works on Google Chrome.

      requestAnimationFrame(startGameLoop);
    }
  }
  return start;
}

export default useGame;
