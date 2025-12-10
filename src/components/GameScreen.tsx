import React from 'react';
import styles from './GameScreen.module.css';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import ControlPanel from './ControlPanel';
import Game from '../Game';

export default function GameScreen() {
  const gameRef = React.useRef<Game | null>(null);
  const gameDivRef = React.useRef<HTMLDivElement>(null);
  const keysRef = React.useRef<{ w: boolean, a: boolean, s: boolean, d: boolean, space: boolean }>({ w: false, a: false, s: false, d: false, space: false });
  const [health, setHealth] = React.useState<number>(100);
  const [score, setScore] = React.useState<number>(0);
  const [level, setLevel] = React.useState<number>(1);
  const [keys, setKeys] = React.useState<{ w: boolean, a: boolean, s: boolean, d: boolean, space: boolean }>({ w: false, a: false, s: false, d: false, space: false });

  const setScoreState = (score: number): void => {
    setScore(score);
  };

  const setLevelState = (level: number): void => {
    setLevel(level);
  };

  const setHealthState = (health: number): void => {
    setHealth(health);
  };


  /**
   * Handler for key strokes set the pressed down keys to true
   *
   * @param {Event} event - The key event
   */
  const keyReader = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    let updated = false;
    const newKeys = { ...keysRef.current };
    
    switch (key) {
      case 'a':
        if (!newKeys.a) {
          newKeys.a = true; keysRef.current.a = true; updated = true;
        }
        break;
      case 'd':
        if (!newKeys.d) {
          newKeys.d = true; keysRef.current.d = true; updated = true;
        }
        break;
      case ' ':
        if (!newKeys.space) {
          newKeys.space = true; keysRef.current.space = true; updated = true;
        }
        break;
      case 'w':
        if (!newKeys.w) {
          newKeys.w = true; keysRef.current.w = true; updated = true;
        }
        break;
      case 's':
        if (!newKeys.s) {
          newKeys.s = true; keysRef.current.s = true; updated = true;
        }
        break;
    }
    
    if (updated) {
      onKeysUpdated(newKeys);
    }
  };

  /**
   * Handles the key strokes for released keys to false
   *
   * @param {Event} event - The key event
   */
  const keyRelease = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    let updated = false;
    const newKeys = { ...keysRef.current };
    
    switch (key) {
      case 'a':
        if (newKeys.a) { 
          newKeys.a = false; keysRef.current.a = false; updated = true; 
        }
        break;
      case 'd':
        if (newKeys.d) {
          newKeys.d = false; keysRef.current.d = false; updated = true;
        }
        break;
      case ' ':
        if (newKeys.space) {
          newKeys.space = false; keysRef.current.space = false; updated = true;
        }
        break;
      case 'w':
        if (newKeys.w) {
          newKeys.w = false; keysRef.current.w = false; updated = true;
        }
        break;
      case 's':
        if (newKeys.s) {
          newKeys.s = false; keysRef.current.s = false; updated = true;
        }
        break;
    }
    
    if (updated) {
      onKeysUpdated(newKeys);
    }
  };

  const onKeysUpdated = (keys: { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean }): void => {
    setKeys(keys);
  };

  /**
   * Sets up the keyboard listeners for controls of the game
   */
  const setupKeyboardListeners = (): void => {
    document.addEventListener('keydown', keyReader);
    document.addEventListener('keyup', keyRelease);
  };

  // Component mount lifecycle - runs when Game.tsx is rendered
  React.useEffect(() => {
    // Initialize the game when component mounts
    // Wait for refs to be attached to DOM elements
    if (!gameRef.current && gameDivRef.current) {
      setupKeyboardListeners();
      gameRef.current = new Game(
        gameDivRef.current as HTMLElement,
        keysRef.current,
        setScoreState,
        setLevelState,
        setHealthState
      );
      gameRef.current.drawBoard();
      gameRef.current.setupThemeRepeatListener();
    }

    // Cleanup function - runs when component unmounts
    return () => {
      // Remove event listeners
      document.removeEventListener('keydown', keyReader);
      document.removeEventListener('keyup', keyRelease);
      
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
    <div className={styles.gameScreenWrapper}>
      <div className={styles.gamePanelWrapper}>
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

      <ControlPanel keysRef={keysRef.current} />
    </div>    
  );
}
