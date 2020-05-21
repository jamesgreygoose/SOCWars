// The showScoreBoard function renders the top 5 ranked players on to the screen.

function showScoreBoard(scoreBoard) {
  let first = document.getElementById('firstScore');
  let second = document.getElementById('secondScore');
  let third = document.getElementById('thirdScore');

  if (scoreBoard.length > 0 && first) {
    first.innerHTML = `${scoreBoard[0].name} - ${scoreBoard[0].health}`;
  }

  if (scoreBoard.length > 1 && second) {
    second.innerHTML = `${scoreBoard[1].name} - ${scoreBoard[1].health}`;
  }

  if (scoreBoard.length > 2 && third) {
    third.innerHTML = `${scoreBoard[2].name} - ${scoreBoard[2].health}`;
  }
}

export default showScoreBoard;
