import React from 'react';
import styles from './GameScreen.module.css';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import ControlPanel from './ControlPanel';
import Game from '../Game';
import SoundManager from '../SoundManager';
import { KeyboardControlEnums as keysEnums } from '../Enums/KeyboardControlEnums';

export default function GameScreen() {
  const gameRef = React.useRef<Game | null>(null);
  const gameDivRef = React.useRef<HTMLDivElement>(null);
  const [health, setHealth] = React.useState<number>(100);
  const [score, setScore] = React.useState<number>(0);
  const [level, setLevel] = React.useState<number>(1);
  const [gunLevel, setGunLevel] = React.useState<number>(1);
  /**
   * State for the keys
   * keys is the state of the keys that triggers React rendering of the UI in GameScreen.tsx
   * keysRef is the ref to the keys that is used to update the state of the keys for the Game class instance
   * This is a common pattern when mixing React and vanilla JavaScript classes (e.g. Game.ts class instance and
   * GameScreen.tsx component instance)
   */
  const [keys, setKeys] = React.useState<{ [key in keysEnums]: boolean }>({ [keysEnums.W]: false, [keysEnums.A]: false, [keysEnums.S]: false, [keysEnums.D]: false, [keysEnums.SPACE]: false });
  const keysRef = React.useRef<{ [key in keysEnums]: boolean }>({ [keysEnums.W]: false, [keysEnums.A]: false, [keysEnums.S]: false, [keysEnums.D]: false, [keysEnums.SPACE]: false });

  const setScoreState = (score: number): void => {
    setScore(score);
  };

  const setLevelState = (level: number): void => {
    setLevel(level);
  };

  const setHealthState = (health: number): void => {
    setHealth(health);
  };

  const onKeysUpdated = (keys: { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean }): void => {
    setKeys(keys);
  };

  const setGunLevelState = (gunLevel: number): void => {
    setGunLevel(gunLevel);
  };

  /**
   * Sets both the keys state and the keysRef state for pressed and released keys
   *
   * @param key - The key to set the state of
   * @param state - The state to set the key to
   *
   * @returns {void}
   */
  const setNewKeyState = (key: string, state: boolean): void => {
    const newKeys = { ...keysRef.current };

    newKeys[key as keyof { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean }] = state;
    keysRef.current[key as keyof { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean }] = state;

    onKeysUpdated(newKeys);
  }

  /**
   * Handler for key strokes set the pressed down keys to true
   *
   * @param {Event} event - The key event
   */
  const keyReader = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();

    switch (key) {
      case keysEnums.A:
        setNewKeyState(keysEnums.A, true);
        break;
      case keysEnums.D:
        setNewKeyState(keysEnums.D, true);
        break;
      case ' ':
        setNewKeyState(keysEnums.SPACE, true);
        break;
      case keysEnums.W:
        setNewKeyState(keysEnums.W, true);
        break;
      case keysEnums.S:
        setNewKeyState(keysEnums.S, true);
        break;
    }
  };

  /**
   * Handles the key strokes for released keys to false
   *
   * @param {Event} event - The key event
   */
  const keyRelease = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    
    switch (key) {
      case keysEnums.A:
        setNewKeyState(keysEnums.A, false);
        break;
      case keysEnums.D:
        setNewKeyState(keysEnums.D, false);
        break;
      case ' ':
        setNewKeyState(keysEnums.SPACE, false);
        break;
      case keysEnums.W:
        setNewKeyState(keysEnums.W, false);
        break;
      case keysEnums.S:
        setNewKeyState(keysEnums.S, false);
        break;
    }
  };

  /**
   * Sets up the keyboard listeners for controls of the game
   */
  const setupKeyboardListeners = (): void => {
    document.addEventListener('keydown', keyReader);
    document.addEventListener('keyup', keyRelease);
  };

  /**
   * Initializes the game instance
   */
  const initializeGameInstance = (): void => {
    gameRef.current = new Game(
      gameDivRef.current as HTMLElement,
      keysRef.current,
      setScoreState,
      setLevelState,
      setHealthState,
      setGunLevelState
    );
    gameRef.current.drawBoard();
    gameRef.current.setupThemeRepeatListener();
  }

  /**
   * Clears the game instance
   */
  const clearGameInstance = (): void => {
    // Remove event listeners
    clearKeyboardListeners();
      
    if (gameRef.current) {
      // Cleanup sounds
      clearGameSoundsFromDOM();
      
      // Cleanup theme
      clearGameThemeFromDOM();
      
      // Cleanup game canvas
      clearGameCanvasFromDOM();

      gameRef.current = null;
    }
    
    // Reset SoundManager singleton to cleanup all audio elements
    SoundManager.resetInstance();
  }

  /**
   * Clears the keyboard listeners
   */
  const clearKeyboardListeners = (): void => {
    document.removeEventListener('keydown', keyReader);
    document.removeEventListener('keyup', keyRelease);
  }

  /**
   * Clears the game sounds from the DOM
   */
  const clearGameSoundsFromDOM = (): void => {
    if (!gameRef.current || !gameRef.current.sounds) return;
    
    Object.values(gameRef.current.sounds).forEach(sound => {
      if (sound && typeof sound.cleanup === 'function') {
        sound.cleanup();
      }
    });
  }

  /**
   * Clears the game theme from the DOM
   */
  const clearGameThemeFromDOM = (): void => {
    if (!gameRef.current || !gameRef.current.theme) return;
    
    if (gameRef.current.theme) {
      gameRef.current.theme.pause();
      gameRef.current.theme.src = '';
      gameRef.current.theme.load();
    }
  }

  /**
   * Clears the game canvas from the DOM
   */
  const clearGameCanvasFromDOM = (): void => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.remove();
    }
  }

  // Component mount lifecycle - runs when Game.tsx is rendered
  React.useEffect(() => {
    // Initialize the game when component mounts
    // Wait for refs to be attached to DOM elements
    if (!gameRef.current && gameDivRef.current) {
      setupKeyboardListeners();
      initializeGameInstance();
    }

    // Cleanup function - runs when component unmounts
    return () => {
      clearGameInstance();
    };
  }, []); // Empty dependency array = runs once on mount

  return (
    <div className={styles.gameScreenWrapper}>
      <div className={styles.gamePanelWrapper}>
        <LeftPanel 
          score={score} 
          level={level}
          gunLevel={gunLevel}
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
