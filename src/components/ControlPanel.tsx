import styles from './GameScreen.module.css';
import { KeyboardControlEnums as keysEnums } from '../Enums/KeyboardControlEnums';

export interface ControlPanelProps {
  keysRef: { [key in keysEnums]: boolean };
}

export default function ControlPanel({ keysRef }: { keysRef: { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean } }) {

  return (
    <div className={styles.gameControlsWrapper}>
        <div className={styles.directionKeysWrapper}>
          <div className={styles.directionKeyRowT}>
            <div className={keysRef[keysEnums.W] ? styles.directionKeyActive : styles.directionKey}>W</div>
          </div>
          <div className={styles.directionKeyRow}>
            <div className={keysRef[keysEnums.A] ? styles.directionKeyActive : styles.directionKey}>A</div>
            <div className={keysRef[keysEnums.S] ? styles.directionKeyActive : styles.directionKey}>S</div>
            <div className={keysRef[keysEnums.D] ? styles.directionKeyActive : styles.directionKey}>D</div>
          </div>
        </div>
        <div className={styles.actionKeysWrapper}>
          <div className={keysRef[keysEnums.SPACE] ? styles.spaceBarKeyActive : styles.spaceBarKey}>SPACE BAR</div>
        </div>
    </div> 
  );
}