import AbstractSprite from './AbstractSprite.js';
import EntityFactory from '../Factories/EntityFactory.js';
import { GameConsts } from '../GameConsts.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import { ImageAssetsDict } from '../Dicts/ImageAssetsDict.js';

/**
 * Ship sprite class extending AbstractSprite
 * 
 * @param {Object} gameContext - Reference to the game instance for accessing game state
 * @param {Object} config - Configuration object from EntityConfigDict
 */
class ShipSprite extends AbstractSprite {
  constructor(gameContext, config) {
    super(gameContext, config.x, config.y, config.width, config.height, EntityTypeEnums.SHIP);
    this.asset = new Image();
    this.asset.src = ImageAssetsDict.ship_ast.path;
    this.health = config.health;
    this.speed = config.speed;
    this.inPlay = true;
    this.gunLev = config.gunLev;
    this.respawnTime = config.respawnTime;
    this.movable = true;
    this.sounds = config.sounds;
    // Missile data
    this.missileColor;
    this.missileWidth;
    this.missileHeight;
    this.determinMissileAspects();
  }

  /**
   * @see AbstractSprite.draw
   */
  draw() {
    this.gameContext.drawImage(this.asset, 35, 40, 50, 43, this.x, this.y, 50, 43);
  }

  /**
   * Updates the ship movement based on the key strokes
   *
   * @returns {Game}
   */
  updateShipMovement = function(keys) {
    if (keys.lKey == true && this.x > 0 && this.movable == true) {
      this.x -= this.speed;
    }
    if (keys.rKey == true && this.x < 630 && this.movable == true) {
      this.x += this.speed;
    }
    if (keys.uKey == true && this.y > 30 && this.movable == true) {
      this.y -= this.speed;
    }
    if (keys.dKey == true && this.y < 740 && this.movable == true) {
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
  respawn() {
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
  changeGunLevel = (newGunLev) => {
    this.gunLev = newGunLev;
    this.determinMissileAspects();
  }

  /**
   * Determines the missile aspects based on the gun level
   */
  determinMissileAspects = () => {
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
  fire(xSpd, color, w, h) {
    const missile = EntityFactory.create(
      this.gameContext,
      EntityTypeEnums.MISSILE,
      this.createMissilePayload(xSpd, color, w, h)
    );
    
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
  createMissilePayload = (xSpd, color, w, h) => {
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

export default ShipSprite;
