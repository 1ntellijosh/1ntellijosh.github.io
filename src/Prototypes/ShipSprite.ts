import AbstractSprite from './AbstractSprite';
import EntityFactory from '../Factories/EntityFactory';
import MissileSprite from './MissileSprite';
import { GameConsts } from '../../src/GameConsts';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums';
import { ImageAssetsDict } from '../Dicts/ImageAssetsDict';
import { WeaponLevelDict } from '../Dicts/WeaponLevelDict';
import Mp3 from '../Mp3';
import SoundManager from '../../src/SoundManager';
import { KeyboardControlEnums as keysEnums } from '../Enums/KeyboardControlEnums';

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
  fireRate: number;
  clip: number;
  clipSize: number;
  clipReady: number;
  mag: number;
  missileColor: string;
  missileWidth: number;
  missileHeight: number;
  missileHealth: number;

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
      shoot4: soundMgr.get('shoot4'),
      rez: soundMgr.get('rez')
    }
    this.clip = 0;
    this.mag = 0;
    // Initialize with default values (will be set by determineGunLevelAspects)
    const defaultConfig = WeaponLevelDict.level1;
    this.fireRate = defaultConfig.fireRate;
    this.clipSize = defaultConfig.clipSize;
    this.clipReady = defaultConfig.clipReady;
    this.missileColor = defaultConfig.missileColor;
    this.missileWidth = defaultConfig.missileWidth;
    this.missileHeight = defaultConfig.missileHeight;
    this.missileHealth = defaultConfig.missileHealth;
    // Now set the correct values based on gun level
    this.determineGunLevelAspects();
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
  updateShipMovement(keys: { [key in keysEnums]: boolean }): AbstractSprite {
    if (keys[keysEnums.A] == true && this.x > 0 && this.movable == true) {
      this.x -= this.speed;
    }
    if (keys[keysEnums.D] == true && this.x < 630 && this.movable == true) {
      this.x += this.speed;
    }
    if (keys[keysEnums.W] == true && this.y > 30 && this.movable == true) {
      this.y -= this.speed;
    }
    if (keys[keysEnums.S] == true && this.y < 740 && this.movable == true) {
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
   * @param {GunLevel} newGunLev - The new gun level (1-4)
   */
  changeGunLevel(newGunLev: number): void {
    this.gunLev = newGunLev;
    this.determineGunLevelAspects();
  } 

  /**
   * Determines the missile aspects based on the gun level
   *
   * @throws {Error} If the gun level is not valid
   */
  determineGunLevelAspects(): void {
    if (this.gunLev < 1 || this.gunLev > 4) throw new Error(`Invalid gun level: ${this.gunLev}`);

    const gunLevel = ('level' + this.gunLev) as keyof typeof WeaponLevelDict;
    const config = WeaponLevelDict[gunLevel];

    // Set all values from the config
    this.missileColor = config.missileColor;
    this.missileWidth = config.missileWidth;
    this.missileHeight = config.missileHeight;
    this.missileHealth = config.missileHealth;
    this.fireRate = config.fireRate;
    this.clipSize = config.clipSize;
    this.clipReady = config.clipReady;
  }

  /**
   * Fires a missile from the ship
   *
   * @param {number} xSpd - The x speed of the missile
   *
   * @returns {MissileSprite} The created missile
   */
  fire(xSpd: number): MissileSprite {
    const missile = EntityFactory.create(
      this.gameContext,
      EntityTypeEnums.MISSILE,
      this.createMissilePayload(xSpd)
    ) as MissileSprite;
    
    // Play appropriate sound
    this.playShootSound();

    return missile;
  }

  /**
   * Plays the appropriate shoot sound based on the gun level
   */
  playShootSound(): void {
    switch (this.gunLev) {
      case 1:
        this.sounds.shoot.play();
        break;
      case 2:
        this.sounds.shoot2.play();
        break;
      case 3:
        this.sounds.shoot3.play();
        break;
      case 4:
        this.sounds.shoot4.play();
        break;
    }
  }

  /**
   * Creates the payload for the missile
   *
   * @param {number} xSpd - The x speed of the missile
   *
   * @returns {Object} The payload for the missile
   */
  createMissilePayload(
    xSpd: number,
  ): { x: number, y: number, xSpd: number, ySpd: number, color: string, width: number, height: number, health?: number } {
    return {
      x: this.x + this.width/2 - this.missileWidth/2,
      y: this.y,
      xSpd: xSpd,
      ySpd: -22.5,
      color: this.missileColor,
      width: this.missileWidth,
      height: this.missileHeight,
      health: this.missileHealth
    }
  }
}
