/**
 * Weapon Level Dictionary - Configuration for all weapon levels
 * 
 * Defines missile properties, fire rates, and clip settings for each weapon level (1-4)
 * 
 * @returns {Object} - The WeaponLevelDict object.
 * 
 * @since abstract--JP
 */

export const WeaponLevelDict = Object.freeze({
  level1: {
    missileColor: '#6495ED',
    missileWidth: 3,
    missileHeight: 7,
    missileHealth: 1,
    fireRate: 3,
    clipSize: 4,
    clipReady: 6
  },
  level2: {
    missileColor: '#00ff80',
    missileWidth: 3,
    missileHeight: 6,
    missileHealth: 1,
    fireRate: 2,
    clipSize: 4,
    clipReady: 7
  },
  level3: {
    missileColor: '#ffff00',
    missileWidth: 5.5,
    missileHeight: 3.5,
    missileHealth: 1,
    fireRate: 1,
    clipSize: 2,
    clipReady: 5
  },
  level4: {
    missileColor: '#009999',
    missileWidth: 5.5,
    missileHeight: 25,
    missileHealth: 2,
    fireRate: 4,
    clipSize: 1,
    clipReady: 1
  }
} as const);

