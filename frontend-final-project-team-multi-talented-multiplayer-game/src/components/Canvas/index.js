import React, { useEffect, useRef } from 'react';
import css from './canvas.module.css';

import background from '../../images/SOC/circuitBoard.jpg';
import SOC from '../../images/SOC/soc.png';
import Chris from '../../images/SOC/Chris_game.png';
import ChrisLeft from '../../images/SOC/Chris_game_left.png';
import Banwo from '../../images/SOC/Banwo_game.png';
import BanwoLeft from '../../images/SOC/Banwo_game_left.png';
import Ben from '../../images/SOC/Ben_game.png';
import BenLeft from '../../images/SOC/Ben_game_left.png';
import Liz from '../../images/SOC/Liz_game.png';
import LizLeft from '../../images/SOC/Liz_game_left.png';
import Bish from '../../images/SOC/Bish_game.png';
import BishLeft from '../../images/SOC/Bish_game_left.png';
import useGame from '../../gameLogic/useGame';

import canvasProperties from './canvasConfig.js';

const { canvasWidth, canvasHeight } = canvasProperties;

function Canvas() {
  const ref = useRef();
  const start = useGame();

  useEffect(() => {
    start(ref.current);
  }, []);

  return (
    <div className={css.canvas}>
      <h1 id='timer' className={css.timerHUD}>
        Timer
      </h1>
      <h1 id='inGameEvents' className={css.inGameEvents}></h1>
      <ol className={css.canvasScoreBoard}>
        <li className={css.scores} id='firstScore'></li>
        <li className={css.scores} id='secondScore'></li>
        <li className={css.scores} id='thirdScore'></li>
      </ol>
      <canvas
        ref={ref}
        id='myCanvas'
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: 'black solid 1px' }}
      ></canvas>
      <img id='background' src={background} width='0' height='0' alt='' />
      <img id='SOC' src={SOC} width='0' height='0' alt='' />
      <img id='Chris' src={Chris} width='0' height='0' alt='' />
      <img id='ChrisLeft' src={ChrisLeft} width='0' height='0' alt='' />
      <img id='Banwo' src={Banwo} width='0' height='0' alt='' />
      <img id='BanwoLeft' src={BanwoLeft} width='0' height='0' alt='' />
      <img id='Ben' src={Ben} width='0' height='0' alt='' />
      <img id='BenLeft' src={BenLeft} width='0' height='0' alt='' />
      <img id='Liz' src={Liz} width='0' height='0' alt='' />
      <img id='LizLeft' src={LizLeft} width='0' height='0' alt='' />
      <img id='Bish' src={Bish} width='0' height='0' alt='' />
      <img id='BishLeft' src={BishLeft} width='0' height='0' alt='' />
    </div>
  );
}

export default Canvas;
