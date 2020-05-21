import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import css from './GameOver.module.css';
import gameOver from '../../images/gameOver.png';

function GameOver({ connection }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    connection.on('updateGameOver', ({ losingPlayer, winningPlayer }) => {
      const losingPlayerName = losingPlayer.name;
      const winningPlayerName = winningPlayer.name;
      setPlayers([losingPlayerName, winningPlayerName]);
    });
    return () => {
      connection.removeListener('updateGameOver');
    };
  }, []);

  return (
    <div className={css.GameOver}>
      <img className={css.title} alt='GAME OVER' src={gameOver} />
      <h3 id={css.killedBy}>
        Sorry {players[0]}. You were killed by {players[1]}. Why not join again
        and get your revenge!?
      </h3>
      <p id={css.tryAgain}>
        Click on the button below to have another game <br /> or click on the
        handy 'who kills whom?' button to do some research!.
      </p>
      <Link className={css.whoBeatsWhom} to='/whobeatswhom'></Link>
      <Link className={css.gotoRooms} to='/rooms'></Link>
    </div>
  );
}

export default GameOver;
