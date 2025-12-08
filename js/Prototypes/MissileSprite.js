import AbstractSprite from './AbstractSprite.js';
import { GameConsts } from '../GameConsts.js';

/**
 * Missile sprite class extending AbstractSprite
 * 
 * @param {Object} gameContext - Reference to the game instance
 * @param {Object} payload - The payload for the missile
 *  @prop {number} x - The x position of the missile
 *  @prop {number} y - The y position of the missile
 *  @prop {number} xSpd - The x speed of the missile
 *  @prop {number} ySpd - The y speed of the missile
 *  @prop {string} color - The color of the missile
 *  @prop {number} width - The width of the missile
 *  @prop {number} height - The height of the missile
 *  @prop {string} type - The type of missile ('s' for ship, 'e' for enemy)
 */
class MissileSprite extends AbstractSprite {
  constructor(gameContext, payload) {
    super(
      gameContext, 
      payload.x, 
      payload.y, 
      payload.width, 
      payload.height, 
      payload.type
    );
    this.xSpd = payload.xSpd;
    this.ySpd = payload.ySpd;
    this.color = payload.color;
    this.inPlay = true;
  }

  /**
   * @see AbstractSprite.draw
   */
  draw() {
    this.gameContext.fillStyle = this.color;
    this.gameContext.fillRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Updates the missile sprite movement
   */
  update() {
    this.y += this.ySpd;
    this.x += this.xSpd;
    this.inPlay = this.inBounds();

    return this;
  }

  /**
   * Checks if the missile is still within game bounds
   *
   * @returns {boolean} True if missile is in bounds
   */
  inBounds() {
    return this.y >= 0 && this.y <= GameConsts.GAME_HEIGHT;
  }
}

export default MissileSprite;

