import AbstractSprite from './AbstractSprite.js';
import { GameConsts } from '../GameConsts.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import { ImageAssetsDict } from '../Dicts/ImageAssetsDict.js';

/**
 * Ship sprite class extending AbstractSprite
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
class AsteroidSprite extends AbstractSprite {
  constructor(gameContext, payload) {
    super(gameContext, payload.x, 0, 57, 55, EntityTypeEnums.ASTEROID);
    this.asset = new Image()
    this.asset.src = ImageAssetsDict.ship_ast.path
    this.ySpd = 1.5
    this.xSpd = 0
    this.dStart = 240
    this.arcTime = 5
    this.inPlay = true
    this.health = 25
    this.scoreValue = 0
  }

  /**
   * @see AbstractSprite.draw
   */
  draw() {
    this.gameContext.drawImage(this.asset, 0, this.dStart, this.width, this.height, this.x, this.y, this.width + 17, this.height + 17);
  }

  /**
   * Checks if the asteroid is still within game bounds
   *
   * @returns {boolean} True if asteroid is in bounds
   */
  inBounds() {
    return this.x >= 0 && this.x <= GameConsts.GAME_WIDTH &&
      this.y >= 0 && this.y <= GameConsts.GAME_HEIGHT;
  }

  /**
   * Updates the asteroid sprite movement
   */
  update() {
    this.x += this.xSpd;
    this.y += this.ySpd;

    this.arcTime++;

    if (this.inPlay) {
      this.inPlay = this.inBounds();
    }
  }
}

export default AsteroidSprite;