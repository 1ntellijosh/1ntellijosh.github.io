import BaseEnemySprite from './BaseEnemySprite.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';

/**
 * Ship sprite class for EnemyBSprite
 * Large enemy firing ship that swings left
 * 
 * @param {Object} gameContext - Reference to the game instance (canvas context)
 * @param {Object} config - Configuration object from EntityConfigDict
 */
class EnemyBSprite extends BaseEnemySprite {
  constructor(gameContext, config) {
    super(
      gameContext, 
      config.x, 
      config.y, 
      config.width, 
      config.height, 
      EntityTypeEnums.ENEMY_B, 
      config
    );
  }

  /**
   * @see BaseEnemySprite.update
   */
  update(sMissiles) {
    this.x += this.xSpd;
    this.y += this.ySpd;

    this.xSpd = 7 * Math.cos(this.arcTime * Math.PI / 200) - 9;
    if (this.age > 75 && this.age % 20 == 0) {
      if(Math.random() < .20) {
        sMissiles.push(this.fire(0, 6, '#ff6600', 6, 4));
        this.sounds.bcFire.play();
      }
    }
    else if(this.age % 15 == 0) {
      if(Math.random() < .15) {
        sMissiles.push(this.fire(0, 6, '#ff6600', 6, 4));
        this.sounds.bcFire.play();
      }
    }
    this.age +=1;

    this.arcTime++;

    if (this.inPlay) {
      this.inPlay = this.inBounds();
    }
  }
}

export default EnemyBSprite;
