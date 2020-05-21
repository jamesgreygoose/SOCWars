import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import whoBeatsWho from '../../images/gameInstructions/whobeatswho.PNG'

import css from './WhoBeatsWhom.module.css';



function WhoBeatsWhom() {
  

  return (
    <div className={css.WKW}>
      <img id={css.vsTable} alt='Who beats whom?' src={whoBeatsWho}></img>
      <Link className={css.gotoRooms} to='/character'></Link>
    </div>
  );
}

export default WhoBeatsWhom;
