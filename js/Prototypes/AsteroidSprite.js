import AbstractSprite from './AbstractSprite.js';
import { GameConsts } from '../GameConsts.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import { ImageAssetsDict } from '../Dicts/ImageAssetsDict.js';

/**
 * Ship sprite class extending AbstractSprite
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 * @param {Object} config - Configuration object from EntityConfigDict (merged with payload)
 */
class AsteroidSprite extends AbstractSprite {
  constructor(gameContext, config) {
    super(gameContext, config.x, config.y, config.width, config.height, EntityTypeEnums.ASTEROID);
    this.asset = new Image()
    this.asset.src = ImageAssetsDict.ship_ast.path
    this.ySpd = config.ySpd
    this.xSpd = config.xSpd
    this.dStart = config.dStart
    this.arcTime = config.arcTime
    this.inPlay = true
    this.health = config.health
    this.scoreValue = config.scoreValue
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