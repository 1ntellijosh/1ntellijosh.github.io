import BaseEnemySprite from './BaseEnemySprite.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import SoundManager from '../SoundManager.js';

/**
 * Ship sprite class for EnemyESprite
 * Small enemy ship swing left
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
class EnemyESprite extends BaseEnemySprite {
  constructor(gameContext) {
    const soundMgr = new SoundManager();

    super(gameContext, 350, 0, 45, 44, EntityTypeEnums.ENEMY_E, {
      ySpd: 7,
      xSpd: 0,
      arcTime: 5,
      dStart: 96,
      xStart: 113,
      health: 2,
      scoreValue: 20,
      sounds: {
        bcFire: soundMgr.get('bcFire')
      }
    });
  }

  /**
   * @see BaseEnemySprite.update
   */
  update() {
    this.x += this.xSpd;
    this.y += this.ySpd;

    this.xSpd = -8 * Math.cos(this.arcTime * Math.PI / 180) + 1.45;

    this.arcTime++;

    if (this.inPlay) {
      this.inPlay = this.inBounds();
    }
  }
}

export default EnemyESprite;