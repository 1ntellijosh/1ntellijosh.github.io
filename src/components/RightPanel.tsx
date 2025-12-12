import styles from './RightPanel.module.css';

// Props interface for RightPanel component
export interface RightPanelProps {
  health: number;
}

export default function RightPanel({ health }: RightPanelProps) {
  return (
    <div className={styles.right}>
      <div className={styles.healthT}>
        <h5>HEALTH</h5>
        <div className={styles.health}>
          <div 
            className={`${styles.healthBar} ${health > 0 ? styles.healthBarVisible : styles.healthBarHidden}`}
          ></div>
          <div 
            className={`${styles.healthBar} ${health > 1 ? styles.healthBarVisible : styles.healthBarHidden}`}
          ></div>
          <div 
            className={`${styles.healthBar} ${health > 2 ? styles.healthBarVisible : styles.healthBarHidden}`}
          ></div>
        </div>
      </div>
    </div>
  );
}