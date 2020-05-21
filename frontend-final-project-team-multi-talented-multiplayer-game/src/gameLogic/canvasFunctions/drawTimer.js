function drawTimer(gameDuration) {
  let minutes = Math.floor(gameDuration / 60);
  let seconds = gameDuration - minutes * 60;
  let timerHeader = document.getElementById('timer');
  timerHeader.innerHTML = `${minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}:${seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;
}

export default drawTimer;
