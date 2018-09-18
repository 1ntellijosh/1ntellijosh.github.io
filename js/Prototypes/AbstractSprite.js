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

class AbstractSprite {
  constructor(gameContext, x, y, width, height, type) {
    this.gameContext = gameContext;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  /**
   * @see AbstractSprite.draw
   */
  draw() {
    throw new Error('draw method must be implemented');
  }
}

export default AbstractSprite;