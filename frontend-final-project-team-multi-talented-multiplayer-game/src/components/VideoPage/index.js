import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import css from './VideoPage.module.css';
import SOCWARS from '../../images/SOCWARS.png';
import SOCVideo from '../../images/SOC WARS2.mp4'

function VideoPage({ choicePage }) {
  return (
    <div className={css.VideoPage}>
      <Link className={css.gotoCharacter} to='/rooms'></Link>
      <img className={css.title} alt='SOC WARS' src={SOCWARS} />
      <video width='600' controls>
        <source src={SOCVideo} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
export default VideoPage;
