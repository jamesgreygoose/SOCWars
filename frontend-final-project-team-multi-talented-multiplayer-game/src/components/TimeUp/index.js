import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import css from './TimeUp.module.css';
import timesUp from '../../images/timesUp.png';

function Winner({ connection }) {
  const [playerNames, setPlayerNames] = useState([]);
  const [playerScores, setPlayerScores] = useState([]);

  useEffect(() => {
    connection.on('UPDATE_TIME_UP', ({ scoreBoard }) => {
      let updatedPlayerNames = scoreBoard.map((player) => player.name);
      let updatedPlayerScores = scoreBoard.map((player) => player.health);
      setPlayerNames(updatedPlayerNames);
      setPlayerScores(updatedPlayerScores);
      return () => {
        connection.removeListener('UPDATE_TIME_UP');
      };
    });
  }, []);

  return (
    <div className={css.Winner}>
      <img className={css.title} alt='TIME IS UP!' src={timesUp} />
      <h1 id={css.winnerWas} className={css.vibrate_1}>
        The winner was...{playerNames[0]}
      </h1>
      <ol className={css.scoreBoard}>
        <li className={css.scores}>
          {playerNames[0]}: {playerScores[0]} 
        </li>
        <li className={css.scores}>
          {playerNames[1]}: {playerScores[1]} 
        </li>
        <li className={css.scores}>
          {playerNames[2]}: {playerScores[2]} 
        </li>
      </ol>
      <p>
        Click on the button below to have another game <br /> or click on the
        handy 'who kills whom?' button to do some research!.
      </p>
      <Link className={css.whoBeatsWhom} to='/whobeatswhom'></Link>
      <Link className={css.gotoRooms} to='/rooms'></Link>
    </div>
  );
}

export default Winner;
