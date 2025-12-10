import AbstractSprite from './AbstractSprite';
import EntityFactory from '../Factories/EntityFactory';
import MissileSprite from './MissileSprite';
import { GameConsts } from '../../src/GameConsts';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums';
import { ImageAssetsDict } from '../Dicts/ImageAssetsDict';
import Mp3 from '../Mp3';
import SoundManager from '../../src/SoundManager';

// Missile Specifications data
const missileColors = {
  level1: '#6495ED',
  level2: '#00ff80',
  level3: '#ffff00'
}
const missileWidths = {
  level1: 3,
  level2: 3,
  level3: 5.5
}
const missileHeights = {
  level1: 7,
  level2: 6,
  level3: 3.5
}

/**
 * Ship sprite class extending AbstractSprite
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 */
export default class ShipSprite extends AbstractSprite {
  asset: HTMLImageElement;
  health: number;
  speed: number;
  gunLev: number;
  respawnTime: number;
  movable: boolean;
  sounds: { [key: string]: Mp3 };
  missileColor: string;
  missileWidth: number;
  missileHeight: number;

  constructor(gameContext: CanvasRenderingContext2D) {
    super(gameContext, GameConsts.GAME_WIDTH/2, 625, 48, 40, EntityTypeEnums.SHIP);
    this.asset = new Image();
    this.asset.src = ImageAssetsDict.ship_ast.path;
    this.health = 3;
    this.speed = 9;
    this.gunLev = 1;
    this.respawnTime = 100;
    this.movable = true;
    const soundMgr = new SoundManager();
    this.sounds = {
      shoot: soundMgr.get('shoot'),
      shoot2: soundMgr.get('shoot2'),
      shoot3: soundMgr.get('shoot3'),
      rez: soundMgr.get('rez')
    }  
    this.missileColor = missileColors.level1;
    this.missileWidth = missileWidths.level1;
    this.missileHeight = missileHeights.level1;
    this.determinMissileAspects();
  }

  /**
   * @see AbstractSprite.draw
   */
  draw(): void {
    this.gameContext.drawImage(this.asset, 35, 40, 50, 43, this.x, this.y, 50, 43);
  }

  /**
   * Updates the ship movement based on the key strokes
   *
   * @returns {Game}
   */
  updateShipMovement(keys: { a: boolean, d: boolean, w: boolean, s: boolean }): AbstractSprite {
    if (keys.a == true && this.x > 0 && this.movable == true) {
      this.x -= this.speed;
    }
    if (keys.d == true && this.x < 630 && this.movable == true) {
      this.x += this.speed;
    }
    if (keys.w == true && this.y > 30 && this.movable == true) {
      this.y -= this.speed;
    }
    if (keys.s == true && this.y < 740 && this.movable == true) {
      this.y += this.speed;
    }

    return this
  }

  /**
   * Respawns the ship sprite. Performs a graceful animation when while ship respawns. Ship is not controllable during
   * this time.
   *
   * @returns {ShipSprite}
   */
  respawn(): void {
    if (this.respawnTime == 0) {
      this.movable = false;
      this.x = GameConsts.GAME_WIDTH/2;
      this.y = 730;
      this.draw()
    } else if (this.respawnTime <= 80) {
      this.y -= 1;
      if (
        this.respawnTime > 7 && this.respawnTime < 12 ||
        this.respawnTime > 19 && this.respawnTime < 24 ||
        this.respawnTime > 31 && this.respawnTime < 36
      ) {
        this.sounds.rez.play();
      } else if (
        this.respawnTime > 43 && this.respawnTime < 48 ||
        this.respawnTime > 56 && this.respawnTime < 61 ||
        this.respawnTime > 68 && this.respawnTime < 73
      ) {
        // Do nothing, the ship will disappear for a moment
      } else {
        this.draw()
      }
    } else if (this.respawnTime < 150) {
      this.movable = true;
      if (this.respawnTime > 80 && this.respawnTime < 85 ||
        this.respawnTime > 92 && this.respawnTime < 97 ||
        this.respawnTime > 103 && this.respawnTime < 107 ||
        this.respawnTime > 112 && this.respawnTime < 115 ||
        this.respawnTime > 119 && this.respawnTime < 123 ||
        this.respawnTime > 126 && this.respawnTime < 129 ||
        this.respawnTime > 131 && this.respawnTime < 133 ||
        this.respawnTime > 135 && this.respawnTime < 137 ||
        this.respawnTime > 139 && this.respawnTime < 141 ||
        this.respawnTime > 143 && this.respawnTime < 145 ||
        this.respawnTime > 147 && this.respawnTime < 149
      ) {
        // Do nothing, the ship will disappear for a moment
      } else {
        this.draw()
      }
    }

    if (this.respawnTime == 150) {
      this.inPlay = true;
    }

    this.respawnTime += 1;
  }

  /**
   * Changes the gun level of the ship
   *
   * @param {number} newGunLev - The new gun level
   */
  changeGunLevel(newGunLev: number): void {
    this.gunLev = newGunLev;
    this.determinMissileAspects();
  }

  /**
   * Determines the missile aspects based on the gun level
   */
  determinMissileAspects(): void {
    switch (this.gunLev) {
      case 1:
        this.missileColor = '#6495ED';
        this.missileWidth = 3;
        this.missileHeight = 7;
        break;
      case 2:
        this.missileColor = '#00ff80';
        this.missileWidth = 3;
        this.missileHeight = 6;
        break;
      case 3:
        this.missileColor = '#ffff00';
        this.missileWidth = 5.5;
        this.missileHeight = 3.5;
        break;
      default:
        throw new Error(`Invalid gun level: ${this.gunLev}`);
    }
  }

  /**
   * Fires a missile from the ship
   *
   * @param {number} xSpd - The x speed of the missile
   * @param {string} color - The color of the missile
   * @param {number} w - The width of the missile
   * @param {number} h - The height of the missile
   * @returns {MissileSprite} The created missile
   */
  fire(xSpd: number, color: string, w: number, h: number): MissileSprite {
    const missile = EntityFactory.create(
      this.gameContext,
      EntityTypeEnums.MISSILE,
      this.createMissilePayload(xSpd, color, w, h)
    ) as MissileSprite;
    
    // Play appropriate sound
    if (this.gunLev == 1) {
      this.sounds.shoot.play();
    } else if (this.gunLev == 2) {
      this.sounds.shoot2.play();
    } else {
      this.sounds.shoot3.play();
    }

    return missile;
  }

  /**
   * Creates the payload for the missile
   *
   * @param {number} xSpd - The x speed of the missile
   * @param {string} color - The color of the missile
   * @param {number} w - The width of the missile
   * @param {number} h - The height of the missile
   * @returns {Object} The payload for the missile
   */
  createMissilePayload(
    xSpd: number,
    color: string,
    w: number,
    h: number
  ): { x: number, y: number, xSpd: number, ySpd: number, color: string, width: number, height: number } {
    return {
      x: this.x + this.width/2,
      y: this.y,
      xSpd: xSpd,
      ySpd: -22.5,
      color,
      width: w,
      height: h
    }
  }
}
