import BaseEnemySprite from './BaseEnemySprite';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums';
import SoundManager from '../../src/SoundManager';

/**
 * Ship sprite class for EnemyGSprite
 * Small enemy ship shooting right angle to left
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
export default class EnemyGSprite extends BaseEnemySprite {
  constructor(gameContext: CanvasRenderingContext2D) {
    const soundMgr = new SoundManager();

    super(gameContext, 520, 0, 45, 31, EntityTypeEnums.ENEMY_G, {
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
   *
   * @param {Array} sMissiles - The array of missiles
   *
   * @returns {EnemyGSprite} - The updated enemy sprite
   */
  update(sMissiles: any[]): BaseEnemySprite {
    // Check if the enemy is still in play
    if (this.inPlay) {
      this.inPlay = this.inBounds()
    }

    // If the enemy is not in play, return
    if (!this.inPlay) return this;

    this.x += this.xSpd;
    this.y += this.ySpd;
    this.travel = this.travel + 1;

    this.handleEnemyLaserFiring(sMissiles);

    this.age +=1;
    this.xSpd = 0;
    this.arcTime++;

    return this;
  }

  /**
   * Handles the enemy laser firing (randomized firing logic)
   *
   * @param {Array} sMissiles - The array of missiles
   *
   * @returns {EnemyGSprite} - The updated enemy sprite
   */
  handleEnemyLaserFiring(sMissiles: any[]): BaseEnemySprite {
    if (this.travel > 90) {
      this.xSpd = 0;
      this.ySpd = 3.8;
      this.y += this.ySpd;
      if (Math.random() < .018) {
        this.fire(3, 3.1, '#99ff33', 6, 4);
        this.sounds.fgFire.play();
      }
    } else if (this.travel > 35) {
      this.xSpd = -8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
      if (Math.random() < .021) {
        sMissiles.push(this.fire(-.5, 3.6, '#99ff33', 6, 4));
        this.sounds.fgFire.play();
      }
    }
    if (this.travel == 15 && Math.random() < .5) {
      sMissiles.push(this.fire(-.35, 3.6, '#99ff33', 6, 4));
      this.sounds.fgFire.play();
    } else if (this.travel == 120 && Math.random() < .5) {
      sMissiles.push(this.fire(0, 3.1, '#99ff33', 6, 4));
      this.sounds.fgFire.play();
    }

    return this;
  }
}
