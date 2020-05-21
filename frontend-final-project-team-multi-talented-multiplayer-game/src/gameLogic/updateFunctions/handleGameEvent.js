export function showHighScorer(highScoringPlayer) {
  let eventHeader = document.getElementById('inGameEvents');
  if (eventHeader) {
    eventHeader.innerHTML = `${highScoringPlayer.name} has reached ${highScoringPlayer.health}`;
    setTimeout(() => {
      eventHeader.innerHTML = '';
    }, 3000);
  }
}

export function showPlayerJoined(newPlayer) {
  let eventHeader = document.getElementById('inGameEvents');
  if (eventHeader) {
    eventHeader.innerHTML = `${newPlayer} has joined the game.`;
    setTimeout(() => {
      eventHeader.innerHTML = '';
    }, 3000);
  }
}

export function showPlayerDisconnected(disconnectedPlayer) {
  let eventHeader = document.getElementById('inGameEvents');
  if (eventHeader) {
    eventHeader.innerHTML = `${disconnectedPlayer.name} has disconnected from the game.`;
    setTimeout(() => {
      eventHeader.innerHTML = '';
    }, 3000);
  }
}

export function showCountdownAlert() {
  let eventHeader = document.getElementById('inGameEvents');
  if (eventHeader) {
    eventHeader.innerHTML = `There are only 20 seconds remaining!`;
    setTimeout(() => {
      eventHeader.innerHTML = '';
    }, 3000);
  }
}
