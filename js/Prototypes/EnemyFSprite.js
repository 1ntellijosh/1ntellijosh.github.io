import BaseEnemySprite from './BaseEnemySprite.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';

/**
 * Ship sprite class for EnemyFSprite
 * Small enemy ship shooting right angle to left
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 * @param {Object} config - Configuration object from EntityConfigDict
 */
class EnemyFSprite extends BaseEnemySprite {
  constructor(gameContext, config) {
    super(
      gameContext, 
      config.x, 
      config.y, 
      config.width, 
      config.height, 
      EntityTypeEnums.ENEMY_F, 
      config
    );
  }

  /**
   * @see BaseEnemySprite.update
   */
  update(sMissiles) {
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

    this.arcTime++;

    return this;
  }

  /**
   * Handles the enemy laser firing (randomized firing logic)
   *
   * @param {Array} sMissiles - The array of missiles
   *
   * @returns {EnemyFSprite} - The updated enemy sprite
   */
  handleEnemyLaserFiring(sMissiles) {
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
    } else if (this.travel == 120) {
      if (Math.random() < .5) {
        sMissiles.push(this.fire(0, 3.1, '#99ff33', 6, 4));
        this.sounds.fgFire.play();
      }
    }

    return this;
  }
}

export default EnemyFSprite;