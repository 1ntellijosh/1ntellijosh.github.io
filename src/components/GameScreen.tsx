import React from 'react';
import styles from './GameScreen.module.css';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import Game from '../Game';

export default function GameScreen() {
  const gameRef = React.useRef<Game | null>(null);
  const gameDivRef = React.useRef<HTMLDivElement>(null);
  const [health, setHealth] = React.useState<number>(100);
  const [score, setScore] = React.useState<number>(0);
  const [level, setLevel] = React.useState<number>(1);

  const setScoreState = (score: number): void => {
    setScore(score);
  };

  const setLevelState = (level: number): void => {
    setLevel(level);
  };

  const setHealthState = (health: number): void => {
    setHealth(health);
  };

  // Component mount lifecycle - runs when Game.tsx is rendered
  React.useEffect(() => {
    // Initialize the game when component mounts
    // Wait for refs to be attached to DOM elements
    if (!gameRef.current && gameDivRef.current) {
      gameRef.current = new Game(
        gameDivRef.current as HTMLElement,
        setScoreState,
        setLevelState,
        setHealthState
      );
      gameRef.current.drawBoard();
      gameRef.current.setupThemeRepeatListener();
    }

    // Cleanup function - runs when component unmounts
    return () => {
      if (gameRef.current) {
        const canvas = document.getElementById('canvas');
        if (canvas) {
          canvas.remove();
        }
        // Remove jQuery event listeners
        $('#start').off('click');
        $(document).off('keydown');
        $(document).off('keyup');
        gameRef.current = null;
      }
    };
  }, []); // Empty dependency array = runs once on mount

  return (
    <div className={styles.gameSectionWrapper}>
      <LeftPanel 
        score={score} 
        level={level}
      />

      <div className={styles.gameDiv} ref={gameDivRef}>
        {/* this is where the game will populate */}
      </div>

      <RightPanel 
        health={health}
      />
    </div>
  );
}
