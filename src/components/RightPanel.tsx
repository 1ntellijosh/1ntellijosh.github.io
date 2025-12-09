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
          {health > 0 && <div className={styles.healthBar} style={{ height: `${health}%` }}></div>}
          {health > 1 && <div className={styles.healthBar} style={{ height: `${health}%` }}></div>}
          {health > 2 && <div className={styles.healthBar} style={{ height: `${health}%` }}></div>}
        </div>
      </div>
    </div>
  );
}