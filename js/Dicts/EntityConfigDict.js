import SoundManager from '../SoundManager.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import { GameConsts } from '../GameConsts.js';

/**
 * Configuration dictionary for all entity types
 * Centralizes all entity properties for easier maintenance
 * 
 * This follows the Configuration Object pattern, which works well with
 * the Factory pattern to simplify complex object construction.
 */
const soundMgr = new SoundManager();

export const EntityConfigDict = Object.freeze({
  [EntityTypeEnums.SHIP]: {
    x: GameConsts.GAME_WIDTH / 2,
    y: 625,
    width: 48,
    height: 40,
    health: 3,
    speed: 9,
    gunLev: 1,
    respawnTime: 100,
    sounds: {
      shoot: soundMgr.get('shoot'),
      shoot2: soundMgr.get('shoot2'),
      shoot3: soundMgr.get('shoot3'),
      rez: soundMgr.get('rez')
    }
  },
  [EntityTypeEnums.ENEMY_B]: {
    x: 615,
    y: 0,
    width: 60,
    height: 41,
    ySpd: 1.7,
    xSpd: 0,
    arcTime: 5,
    dStart: 97,
    xStart: 367,
    health: 3,
    scoreValue: 30,
    age: 0,
    sounds: {
      bcFire: soundMgr.get('bcFire')
    }
  },
  [EntityTypeEnums.ENEMY_C]: {
    x: 35,
    y: 0,
    width: 60,
    height: 41,
    ySpd: 1.7,
    xSpd: 0,
    arcTime: 5,
    dStart: 97,
    xStart: 367,
    health: 3,
    scoreValue: 30,
    age: 0,
    sounds: {
      bcFire: soundMgr.get('bcFire')
    }
  },
  [EntityTypeEnums.ENEMY_D]: {
    x: 250,
    y: 0,
    width: 45,
    height: 44,
    ySpd: 7,
    xSpd: 0,
    arcTime: 5,
    dStart: 96,
    xStart: 113,
    health: 2,
    scoreValue: 20,
    sounds: {
      bcFire: soundMgr.get('bcFire')
    }
  },
  [EntityTypeEnums.ENEMY_E]: {
    x: 350,
    y: 0,
    width: 45,
    height: 44,
    ySpd: 7,
    xSpd: 0,
    arcTime: 5,
    dStart: 96,
    xStart: 113,
    health: 2,
    scoreValue: 20,
    sounds: {
      bcFire: soundMgr.get('bcFire')
    }
  },
  [EntityTypeEnums.ENEMY_F]: {
    x: 100,
    y: 0,
    width: 45,
    height: 31,
    ySpd: 3,
    xSpd: 0,
    arcTime: 5,
    dStart: 100,
    xStart: 20,
    health: 2,
    scoreValue: 25,
    travel: 1,
    sounds: {
      fgFire: soundMgr.get('fgFire')
    }
  },
  [EntityTypeEnums.ENEMY_G]: {
    x: 520,
    y: 0,
    width: 45,
    height: 31,
    ySpd: 3,
    xSpd: 0,
    arcTime: 5,
    dStart: 100,
    xStart: 20,
    health: 2,
    scoreValue: 25,
    travel: 1,
    sounds: {
      fgFire: soundMgr.get('fgFire')
    }
  },
  [EntityTypeEnums.ASTEROID]: {
    // Default values - x is provided via payload
    y: 0,
    width: 57,
    height: 55,
    ySpd: 1.5,
    xSpd: 0,
    dStart: 240,
    arcTime: 5,
    health: 25,
    scoreValue: 0
  },
  [EntityTypeEnums.EXPLOSION]: {
    // Default values - x, y, width, height are provided via payload
    ySpd: 0,
    xSpd: 0,
    travel: 1,
    arcTime: 5
  },
  [EntityTypeEnums.MISSILE]: {
    // Default values - all properties are provided via payload
    // This is just a placeholder for consistency
  },
  [EntityTypeEnums.LASER]: {
    // Default values - all properties are provided via payload
    // This is just a placeholder for consistency
  }
});

