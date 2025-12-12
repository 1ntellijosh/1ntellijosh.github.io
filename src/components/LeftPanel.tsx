import React from 'react';
import styles from './LeftPanel.module.css';

// Props interface for LeftPanel component
export interface LeftPanelProps {
  score: number;
  level: number;
  gunLevel: number;
  gunLevelBars: number[];
}

export default function LeftPanel({ score, level, gunLevel, gunLevelBars }: LeftPanelProps) {
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
      <div className={`${styles.gunLevel} ${gunLevelFlash ? styles.flash : ''}`}>
        <div className={styles.gunLevelT}><h5>GUN LEVEL</h5></div>
        <div className={styles.gunLevelB}>
          <div className={styles.gunLevelBLeft}>
            {gunLevel}
          </div>
          <div className={styles.gunLevelBRight}>
            {gunLevelBars.map((bar, index) => (
              <div key={index} className={styles.gunLevelBRightItem}>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}