import BaseEnemySprite from './BaseEnemySprite.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';

/**
 * Ship sprite class for EnemyESprite
 * Small enemy ship swing left
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 * @param {Object} config - Configuration object from EntityConfigDict
 */
class EnemyESprite extends BaseEnemySprite {
  constructor(gameContext, config) {
    super(
      gameContext, 
      config.x, 
      config.y, 
      config.width, 
      config.height, 
      EntityTypeEnums.ENEMY_E, 
      config
    );
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