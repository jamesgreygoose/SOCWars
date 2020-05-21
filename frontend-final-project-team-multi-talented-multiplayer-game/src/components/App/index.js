import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import connection from '../../connections/gameConnection';

import Canvas from '../Canvas';
import VideoPage from '../VideoPage';
import CharacterSelect from '../CharacterSelect';
import GameOver from '../GameOver';
import WhoBeatsWhom from '../WhoBeatsWhom/index';
import WaitingPage from '../WaitingPage/index';
import TimeUp from '../TimeUp/index';
import Rooms from '../Rooms/index';

function App() {
  return (
    <div>
      <Router>
        <div>
          <Switch>
            <Route path='/rooms'>
              <Rooms connection={connection} />
            </Route>
            <Route path='/timeup'>
              <TimeUp connection={connection} />
            </Route>
            <Route path='/waitingpage'>
              <WaitingPage connection={connection} />
            </Route>
            <Route path='/whobeatswhom'>
              <WhoBeatsWhom />
            </Route>
            <Route path='/character'>
              <CharacterSelect connection={connection} />
            </Route>
            <Route path='/canvas'>
              <Canvas />
            </Route>
            <Route path='/gameover'>
              <GameOver connection={connection} />
            </Route>
            <Route path='/'>
              <VideoPage />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
