// The showScoreWinner unction renders the top 3 ranked players on to the final Winners page.

function handleTimeUp(scoreBoard, connection) {
  connection.emit('UPDATE_TIME_UP', { scoreBoard });
}

export default handleTimeUp;
