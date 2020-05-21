const { eventDictionary } = require('../config/eventDictionary');

const { UPDATE_TIMER, TIME_UP } = eventDictionary;

function setTimer(time, connection, roomId) {
  let timeRemaining = time;
  let intervalID = setInterval(() => {
    if (timeRemaining <= 0) {
      connection.to(roomId).emit(TIME_UP, {
        success: true,
      });
      clearInterval(intervalID);
    }
    timeRemaining--;
    connection.to(roomId).emit(UPDATE_TIMER, {
      success: true,
      payload: { timeRemaining, roomId },
    });
  }, 1000);
}

module.exports = { setTimer };
