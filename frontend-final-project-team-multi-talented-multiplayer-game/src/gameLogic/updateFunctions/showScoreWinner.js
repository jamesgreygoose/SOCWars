// The showScoreWinner unction renders the top 3 ranked players on to the final Winners page.

function showScoreWinner(scoreBoard) {
  let winnerFirst = document.getElementById('winnerFirstScore');
  let winnerSecond = document.getElementById('winnerSecondScore');
  let winnerThird = document.getElementById('winneThirdScore');

  if (scoreBoard.length > 0) {
    winnerFirst.innerHTML = `${scoreBoard[0].name} - ${scoreBoard[0].health}`;
  }

  if (scoreBoard.length > 1) {
    winnerSecond.innerHTML = `${scoreBoard[1].name} - ${scoreBoard[1].health}`;
  }

  if (scoreBoard.length > 2) {
    winnerThird.innerHTML = `${scoreBoard[2].name} - ${scoreBoard[2].health}`;
  }
}

export default showScoreWinner;
