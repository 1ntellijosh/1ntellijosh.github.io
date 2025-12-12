import AbstractSprite from './AbstractSprite';
import { EntityTypeEnums } from '../../Enums/EntityTypeEnums';
import { ImageAssetsDict } from '../../Dicts/ImageAssetsDict';

/**
 * Ship sprite class extending AbstractSprite
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
export default class ExplosionSprite extends AbstractSprite {
  asset: HTMLImageElement;
  ySpd: number;
  xSpd: number;
  travel: number;
  arcTime: number;

  constructor(
    gameContext: CanvasRenderingContext2D,
    payload: {
      x: number,
      y: number,
      width: number,
      height: number
    }
  ) {
    super(gameContext, payload.x, payload.y, payload.width, payload.height, EntityTypeEnums.EXPLOSION);
    this.asset = new Image();
    this.asset.src = ImageAssetsDict.ship_ast.path;
    this.ySpd = 0;
    this.xSpd = 0;
    this.travel = 1;
    this.arcTime = 5;
  }

  /**
   * @see AbstractSprite.draw
   * 
   * @returns {ExplosionSprite} - The updated explosion sprite
   */
  draw(): AbstractSprite {
    this.travel += 1;
    if (this.travel >= 16) {
        this.inPlay = false

        return this;
    }
    
    if (this.travel >= 14) {
        this.gameContext.drawImage(this.asset, 51, 191, 55, 50, this.x + -1, this.y + 5, 55, 50);
    } else if (this.travel >= 12) {
        this.gameContext.drawImage(this.asset, 0, 192, 45, 44, this.x + 2, this.y + 8, 45, 44)
    } else if (this.travel >= 10) {
        this.gameContext.drawImage(this.asset, 74, 151, 39, 35, this.x + 5, this.y + 11, 39, 35)
    } else if (this.travel >= 7) {
        this.gameContext.drawImage(this.asset, 45, 158, 23, 23, this.x + 13, this.y + 16, 23, 23)
    } else if (this.travel >= 4) {
        this.gameContext.drawImage(this.asset, 20, 161, 18, 18, this.x + 14, this.y + 18, 18, 18)
    } else {
        this.gameContext.drawImage(this.asset, 5, 163, 8, 8, this.x + 20, this.y + 20, 8, 8);
    }

    return this;
  }

  /**
   * Updates the explosion sprite movement
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
