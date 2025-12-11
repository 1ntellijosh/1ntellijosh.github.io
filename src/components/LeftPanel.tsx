import React from 'react';
import styles from './LeftPanel.module.css';

// Props interface for LeftPanel component
export interface LeftPanelProps {
  score: number;
  level: number;
  gunLevel: number;
}

export default function LeftPanel({ score, level, gunLevel }: LeftPanelProps) {
  const [levelFlash, setLevelFlash] = React.useState(false);
  const [gunLevelFlash, setGunLevelFlash] = React.useState(false);

  // Trigger animation when level changes
  React.useEffect(() => {
    setLevelFlash(true);
    const timer = setTimeout(() => setLevelFlash(false), 300);
    return () => clearTimeout(timer);
  }, [level]);

  // Trigger animation when gunLevel changes
  React.useEffect(() => {
    setGunLevelFlash(true);
    const timer = setTimeout(() => setGunLevelFlash(false), 300);
    return () => clearTimeout(timer);
  }, [gunLevel]);

  return (
    <div className={styles.left}>
      <div className={styles.score}>
        <div className={styles.scoreT}><h5>SCORE</h5></div>
        <div className={styles.scoreB}>
          {score}
        </div>
      </div>
      <div className={`${styles.level} ${levelFlash ? styles.flash : ''}`}>
        <div className={styles.levelT}><h5>LEVEL</h5></div>
        <div className={styles.levelB}>
          {level}
        </div>
      </div > 
      <div className={`${styles.level} ${gunLevelFlash ? styles.flash : ''}`}>
        <div className={styles.gunLevelT}><h5>GUN LEVEL</h5></div>
        <div className={styles.levelB}>
          {gunLevel}
        </div>
      </div>
    </div>
  );
}