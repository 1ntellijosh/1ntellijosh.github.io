import { GameConsts } from '../../src/GameConsts';

/**
 * This class is an abstract class for all sprites.
 *
 * @param {Object} gameContext - The game context.
 * @param {number} x - The x position of the sprite.
 * @param {number} y - The y position of the sprite.
 * @param {number} width - The width of the sprite.
 * @param {number} height - The height of the sprite.
 * @param {EntityTypeEnums} type - The type of the sprite.
 * @returns {AbstractSprite} - The AbstractSprite object.
 *
 * @since abstract--JP
 */

export default class AbstractSprite {
  gameContext: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  inPlay: boolean;

  constructor(gameContext: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, type: string) {
    this.gameContext = gameContext;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.inPlay = true;
  }

  /**
   * @see AbstractSprite.draw
   */
  draw(): void {
    throw new Error('draw method must be implemented');
  }

  /**
   * Checks if the entity is still within game bounds
   *
   * @returns {boolean} True if entity is in bounds
   */
  inBounds(): boolean {
    return this.x >= 0 && this.x <= GameConsts.GAME_WIDTH &&
      this.y >= 0 && this.y <= GameConsts.GAME_HEIGHT;
  }
}
