import AbstractSprite from './AbstractSprite.js';
import EntityFactory from '../Factories/EntityFactory.js';
import { GameConsts } from '../GameConsts.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import { ImageAssetsDict } from '../Dicts/ImageAssetsDict.js';

/**
 * Base enemy sprite class - contains common functionality for all enemy types
 * 
 * This class implements the Template Method pattern - it defines the common
 * structure and behavior, while subclasses override the update() method for
 * type-specific movement and firing patterns.
 * 
 * @param {Object} gameContext - Reference to the game instance (canvas context)
 * @param {number} x - Initial x position
 * @param {number} y - Initial y position
 * @param {number} width - Sprite width
 * @param {number} height - Sprite height
 * @param {EntityTypeEnums} type - Enemy type enum
 * @param {Object} config - Configuration object with sprite-specific properties
 * @param {number} config.dStart - Sprite sheet y coordinate
 * @param {number} config.xStart - Sprite sheet x coordinate
 * @param {number} config.health - Enemy health
 * @param {number} config.scoreValue - Points awarded for destroying this enemy
 * @param {Object} config.sounds - Sound configuration object
 * 
 * @since abstract--JP
 */
class BaseEnemySprite extends AbstractSprite {
  constructor(gameContext, x, y, width, height, type, config) {
    super(gameContext, x, y, width, height, type);
    
    // Sprite asset
    this.asset = new Image();
    this.asset.src = ImageAssetsDict.eSprite.path;
    
    // Movement properties
    this.ySpd = config.ySpd || 0;
    this.xSpd = config.xSpd || 0;
    this.arcTime = config.arcTime || 5;
    
    // Sprite sheet coordinates
    this.dStart = config.dStart;
    this.xStart = config.xStart;
    
    // Game state
    this.inPlay = true;
    this.health = config.health || 1;
    this.scoreValue = config.scoreValue || 10;
    
    // Optional properties (some enemies use these)
    this.age = config.age || 0;
    this.travel = config.travel || 0;
    
    // Sound manager
    this.sounds = config.sounds || {};
  }

  /**
   * Draws the enemy sprite on the canvas
   * All enemies use the same drawing logic
   */
  draw() {
    this.gameContext.drawImage(
      this.asset, 
      this.xStart, 
      this.dStart, 
      this.width, 
      this.height, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    );
  }

  /**
   * Fires a laser/missile from the enemy
   * All enemies use the same firing logic
   * 
   * @param {number} x - X speed component
   * @param {number} y - Y speed component
   * @param {string} c - Color
   * @param {number} h - Height
   * @param {number} w - Width
   * @returns {MissileSprite} The created missile
   */
  fire(x, y, c, h, w) {
    return EntityFactory.create(
      this.gameContext,
      EntityTypeEnums.LASER,
      {
        x: this.x + this.width/2,
        y: this.y + this.height,
        xSpd: x,
        ySpd: y,
        color: c,
        width: w,
        height: h
      }
    );
  }

  /**
   * Checks if the enemy is still within game bounds
   * All enemies use the same bounds checking logic
   * 
   * @returns {boolean} True if enemy is in bounds
   */
  inBounds() {
    return this.x >= 0 && this.x <= GameConsts.GAME_WIDTH &&
      this.y >= 0 && this.y <= GameConsts.GAME_HEIGHT;
  }

  /**
   * Update method - must be overridden by subclasses
   * Each enemy type has unique movement and firing patterns
   * 
   * @param {Array} sMissiles - Array of missiles to add fired missiles to
   */
  update(sMissiles) {
    throw new Error('update method must be implemented by subclass');
  }
}

export default BaseEnemySprite;

