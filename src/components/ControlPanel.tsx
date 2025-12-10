import styles from './GameScreen.module.css';

export interface ControlPanelProps {
  keysRef: { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean };
}

export default function ControlPanel({ keysRef }: { keysRef: { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean } }) {

  return (
    <div className={styles.gameControlsWrapper}>
        <div className={styles.directionKeysWrapper}>
          <div className={styles.directionKeyRowT}>
            <div className={keysRef.w ? styles.directionKeyActive : styles.directionKey}>W</div>
          </div>
          <div className={styles.directionKeyRow}>
            <div className={keysRef.a ? styles.directionKeyActive : styles.directionKey}>A</div>
            <div className={keysRef.s ? styles.directionKeyActive : styles.directionKey}>S</div>
            <div className={keysRef.d ? styles.directionKeyActive : styles.directionKey}>D</div>
          </div>
        </div>
        <div className={styles.actionKeysWrapper}>
          <div className={keysRef.space ? styles.spaceBarKeyActive : styles.spaceBarKey}>SPACE BAR</div>
        </div>
    </div> 
  );
}