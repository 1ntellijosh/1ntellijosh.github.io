import BaseEnemySprite from './BaseEnemySprite.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import SoundManager from '../SoundManager.js';

/**
 * Ship sprite class for EnemyCSprite
 * Large enemy firing ship swing right
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
class EnemyCSprite extends BaseEnemySprite {
  constructor(gameContext) {
    const soundMgr = new SoundManager();

    super(gameContext, 35, 0, 60, 41, EntityTypeEnums.ENEMY_C, {
      ySpd: 1.7,
      xSpd: 0,
      arcTime: 5,
      dStart: 97,
      xStart: 367,
      health: 3,
      scoreValue: 30,
      age: 0,
      sounds: {
        bcFire: soundMgr.get('bcFire')
      }
    });
  }

  /**
   * @see BaseEnemySprite.update
   */
  update(sMissiles) {
    this.x += this.xSpd;
    this.y += this.ySpd;

    this.xSpd = -7 * Math.cos(this.arcTime * Math.PI / 200) + 9;
    if (this.age > 75 && this.age % 20 == 0) {
      if(Math.random() < .20) {
        sMissiles.push(this.fire(0, 6, '#ff6600', 6, 4));
        this.sounds.bcFire.play();
      }
    }
    else if(this.age % 15 == 0) {
      // console.log('maybe...');
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

export default EnemyCSprite;