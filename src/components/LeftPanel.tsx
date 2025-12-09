import styles from './LeftPanel.module.css';

// Props interface for LeftPanel component
export interface LeftPanelProps {
  score: number;
  level: number;
}

export default function LeftPanel({ score, level }: LeftPanelProps) {
  return (
    <div className={styles.left}>
      <div className={styles.score}>
        <div className={styles.scoreT}><h5>SCORE</h5></div>
        <div className={styles.scoreB}>
          {score}
        </div>
      </div>
      <div className={styles.level}>
        <div className={styles.levelT}><h5>LEVEL</h5></div>
        <div className={styles.levelB}>
          {level}
        </div>
      </div > 
    </div>
  );
}