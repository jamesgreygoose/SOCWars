import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SOCWARS from '../../images/SOCWARS.png';
import css from './WaitingPage.module.css';
import eventDictionary from '../../connections/eventDictionary';

const { UPDATE_TIMER } = eventDictionary;

function WaitingPage({ connection }) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    connection.on(UPDATE_TIMER, ({ payload }) => {
      const { timeRemaining, roomId } = payload;
      drawTimer(timeRemaining);
      setRoomId(roomId);
    });
    return () => {
      connection.removeListener(UPDATE_TIMER);
    };
  }, []);

  function drawTimer(timeRemaining) {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining - minutes * 60;
    setMinutes(minutes);
    setSeconds(seconds);
  }

  return (
    <div className={css.WaitingPage}>
      <img id={css.title} alt='SOC WARS' src={SOCWARS} />
      <h1>
        Sorry, we know you <span>really</span> want to play the game <br /> but {roomId} is
        full at the moment!
      </h1>
      <div class={css.timerInformation}>
      <h2>The game will be finishing in...</h2>
      <h1 id='waitPageTimer' className={css.timerHUD}>
        {minutes}:{seconds}
      </h1>
      </div>
     
      <h3 id={css.jumpText}>
        Click on the link below to get back to the character screen and jump on
        the next game!
      </h3>
      <Link className={css.gotoRooms} to='/rooms'></Link>
    </div>
  );
}

export default WaitingPage;
