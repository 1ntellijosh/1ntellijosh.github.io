import BaseEnemySprite from './BaseEnemySprite.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import SoundManager from '../SoundManager.js';

/**
 * Ship sprite class for EnemyFSprite
 * Small enemy ship shooting right angle to left
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
class EnemyFSprite extends BaseEnemySprite {
  constructor(gameContext) {
    const soundMgr = new SoundManager();

    super(gameContext, 100, 0, 45, 31, EntityTypeEnums.ENEMY_F, {
      ySpd: 3,
      xSpd: 0,
      arcTime: 5,
      dStart: 100,
      xStart: 20,
      health: 2,
      scoreValue: 25,
      travel: 1,
      sounds: {
        fgFire: soundMgr.get('fgFire')
      }
    });
  }

  /**
   * @see BaseEnemySprite.update
   */
  update(sMissiles) {
    this.x += this.xSpd;
    this.y += this.ySpd;

    this.travel = this.travel + 1;
    if (this.travel > 90) {
      this.xSpd = 0;
      this.ySpd = 3.8;
      this.y += this.ySpd;
      if (Math.random() < .018) {
        sMissiles.push(this.fire(-3, 3.1, '#99f f33', 6, 4));
        this.sounds.fgFire.play();
      }
    } else if (this.travel > 35) {
      this.xSpd = 8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
      if (Math.random() < .021) {
        sMissiles.push(this.fire(.5, 3.6, '#99ff33', 6, 4));
        this.sounds.fgFire.play();
      }
    }
    if (this.travel == 15) {
      if (Math.random() < .5) {
        sMissiles.push(this.fire(.35, 3.6, '#99ff33', 6, 4));
        this.sounds.fgFire.play();
      }
    }
    if (this.travel == 120) {
      if (Math.random() < .5) {
        sMissiles.push(this.fire(0, 3.1, '#99ff33', 6, 4));
        this.sounds.fgFire.play();
      }
    }

    this.arcTime++;

    if (this.inPlay) {
      this.inPlay = this.inBounds();
    }
  }
}

export default EnemyFSprite;