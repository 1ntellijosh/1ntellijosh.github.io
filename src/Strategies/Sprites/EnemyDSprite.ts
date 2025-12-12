import BaseEnemySprite from './BaseEnemySprite';
import { EntityTypeEnums } from '../../Enums/EntityTypeEnums';
import SoundManager from '../../SoundManager';

/**
 * Ship sprite class for EnemyDSprite
 * Small enemy ship swing right
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
export default class EnemyDSprite extends BaseEnemySprite {
  constructor(gameContext: CanvasRenderingContext2D) {
    const soundMgr = new SoundManager();

    super(gameContext, 250, 0, 45, 44, EntityTypeEnums.ENEMY_D, {
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
  update(): void {
    this.x += this.xSpd;
    this.y += this.ySpd;

    this.xSpd = 8 * Math.cos(this.arcTime * Math.PI / 180) - 1.45;

    this.arcTime++;

    if (this.inPlay) {
      this.inPlay = this.inBounds();
    }
  }
}
