import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';
import css from './CharacterSelect.module.css';

import SOCWARS from '../../images/SOCWARS.png';
import pickCharacter from '../../images/pickYourCharacter.png';

import ChrisBeats from '../../images/gameInstructions/Chris beats.PNG';
import BenBeats from '../../images/gameInstructions/Ben beats.PNG';
import BanwoBeats from '../../images/gameInstructions/Banwo beats.PNG';
import LizBeats from '../../images/gameInstructions/Liz beats.PNG';
import BishBeats from '../../images/gameInstructions/Bish beats.PNG';
import ChrisImg from '../../images/SOC/Chris_Character.png';
import BenImg from '../../images/SOC/Ben_Character.png';
import BanwoImg from '../../images/SOC/Banwo_Character.png';
import LizImg from '../../images/SOC/Liz_Character.png';
import BishImg from '../../images/SOC/Bish_Character.png';
import ChrisControls from '../../images/gameInstructions/controls_Chris.JPG';
import BenControls from '../../images/gameInstructions/controls_Ben.JPG';
import BanwoControls from '../../images/gameInstructions/controls_Banwo.JPG';
import LizControls from '../../images/gameInstructions/controls_Liz.JPG';
import BishControls from '../../images/gameInstructions/controls_Bish.JPG';

import eventDictionary from '../../connections/eventDictionary';

const { ENTER_GAME } = eventDictionary;

function CharacterSelect({ connection }) {
  const history = useHistory();

  useEffect(() => {
    connection.on('UPDATE_MAX_CAPACITY', ({ payload }) => {
      history.push('/waitingPage');
    });
    return () => {
      connection.removeListener('UPDATE_ROOMS');
    };
  }, []);
  connection.emit('UPDATE_MAX_CAPACITY', {});

  // This should come from back-end
  const [characters, setCharacters] = useState([
    {
      img: ChrisImg,
      beatsImg: ChrisBeats,
      name: 'Chris',
      controlImg: ChrisControls,
    },
    { img: BenImg, beatsImg: BenBeats, name: 'Ben', controlImg: BenControls },
    {
      img: BanwoImg,
      beatsImg: BanwoBeats,
      name: 'Banwo',
      controlImg: BanwoControls,
    },
    { img: LizImg, beatsImg: LizBeats, name: 'Liz', controlImg: LizControls },
    {
      img: BishImg,
      beatsImg: BishBeats,
      name: 'Bish',
      controlImg: BishControls,
    },
  ]);

  const [name, setName] = useState('');
  const [selected, setSelected] = useState(-1);
  const [shown, setShown] = useState(-1);

  function handleInput(event) {
    setName(event.target.value);
  }

  function selectCharacter(index) {
    setSelected(index);
  }

  function enterGame() {
    console.log('hello from the enter game function');
    if (selected >= 0) {
      connection.emit(ENTER_GAME, {
        name,
        character: characters[selected].name,
      });
      history.push('/canvas');
    }
  }

  return (
    <div className={css.CharacterSelect}>
      <img id={css.title} alt='SOC WARS' src={SOCWARS} />
      <img id={css.pickCharacter} src={pickCharacter} alt='Pick Character' />
      <input
        value={name}
        onChange={(value) => handleInput(value)}
        placeholder='Add your name here'
      />
      <div className={css.characterList}>
        {characters.map((character, index) => (
          <div
            className={cn(css.character, {
              [css.selected]: selected === index,
            })}
            style={{ backgroundImage: `url(${character.img})` }}
            onClick={() => selectCharacter(index)}
            onMouseEnter={() => setShown(index)}
            onMouseOut={() => setShown(-1)}
          ></div>
        ))}

        {name && selected >= 0 && (
          <button
            className={css.enterGame}
            onClick={enterGame}
            to='/canvas'
          ></button>
        )}
      </div>
      {shown >= 0 && (
        <>
          <img
            className={cn(css.info, css.slide_in_blurred_left)}
            src={characters[shown].beatsImg}
          />
          <img
            id={css.keyboard}
            className={css.slide_in_blurred_right}
            src={characters[shown].controlImg}
          />
        </>
      )}
    </div>
  );
}

export default CharacterSelect;
