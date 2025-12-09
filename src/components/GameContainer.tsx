import React from 'react';
import styles from './GameContainer.module.css';
import GameScreen from './GameScreen';
import StartButton from './StartButton';

export default function GameContainer() {
  const [gameStarted, setGameStarted] = React.useState<boolean>(false);

  const onStartGameClick = (): void => {
    setGameStarted(prev => !prev);
  };

  return (
    <div>
      {!gameStarted && <h2>StarFighter</h2>}
      <div className={styles.main}>
        {!gameStarted && <StartButton onClick={onStartGameClick} />}

        {gameStarted && <GameScreen />}
      </div>

      <p id="sig">
        Made by Joshua Payne
      </p>
    </div>
  );
}

