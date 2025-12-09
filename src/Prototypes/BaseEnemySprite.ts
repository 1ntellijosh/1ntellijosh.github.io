import AbstractSprite from './AbstractSprite';
import EntityFactory from '../Factories/EntityFactory';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums';
import { ImageAssetsDict } from '../Dicts/ImageAssetsDict';
import Mp3 from '../Mp3';
import MissileSprite from './MissileSprite';

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
export default class BaseEnemySprite extends AbstractSprite {
  asset: HTMLImageElement;
  ySpd: number;
  xSpd: number;
  arcTime: number;
  dStart: number;
  xStart: number;
  health: number;
  scoreValue: number;
  age: number;
  travel: number;
  sounds: { [key: string]: Mp3 };

  constructor(
    gameContext: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    type: string,
    config: {
      ySpd: number;
      xSpd: number;
      arcTime?: number;
      dStart: number;
      xStart: number;
      health: number;
      scoreValue: number;
      age?: number;
      travel?: number;
      sounds?: { [key: string]: Mp3 };
    }
  ) {
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
  draw(): void {
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
  fire(x: number, y: number, c: string, h: number, w: number): MissileSprite {
    const sprite = EntityFactory.create(
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
    ) as MissileSprite;

    return sprite;
  }

  /**
   * Update method - must be overridden by subclasses
   * Each enemy type has unique movement and firing patterns
   */
  update(_sMissiles: MissileSprite[]): void {
    throw new Error('update method must be implemented by subclass');
  }
}
