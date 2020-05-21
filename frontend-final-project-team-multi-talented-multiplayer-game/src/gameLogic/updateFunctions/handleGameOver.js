import eventDictionary from '../../connections/eventDictionary';

const { UPDATE_GAME_OVER } = eventDictionary;

function handleGameOver(losingPlayer, winningPlayer, connection) {
  connection.emit(UPDATE_GAME_OVER, { losingPlayer, winningPlayer });
}

export default handleGameOver;
