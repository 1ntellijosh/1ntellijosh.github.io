import AbstractSprite from './AbstractSprite';
import { EntityTypeEnums } from '../../Enums/EntityTypeEnums';
import { ImageAssetsDict } from '../../Dicts/ImageAssetsDict';

/**
 * Ship sprite class extending AbstractSprite
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
export default class AsteroidSprite extends AbstractSprite {
  asset: HTMLImageElement;
  ySpd: number;
  xSpd: number;
  dStart: number;
  arcTime: number;
  health: number;
  scoreValue: number;

  constructor(gameContext: CanvasRenderingContext2D, payload: { x: number }) {
    super(gameContext, payload.x, 0, 57, 55, EntityTypeEnums.ASTEROID);
    this.asset = new Image();
    this.asset.src = ImageAssetsDict.ship_ast.path;
    this.ySpd = 1.5;
    this.xSpd = 0;
    this.dStart = 240;
    this.arcTime = 5;
    this.health = 25;
    this.scoreValue = 0;
  }

  /**
   * @see AbstractSprite.draw
   */
  draw(): void {
    this.gameContext.drawImage(this.asset, 0, this.dStart, this.width, this.height, this.x, this.y, this.width + 17, this.height + 17);
  }

  /**
   * Updates the asteroid sprite movement
   */
  update(): void {
    this.x += this.xSpd;
    this.y += this.ySpd;

    this.arcTime++;

    if (this.inPlay) {
      this.inPlay = this.inBounds();
    }
  }
}
