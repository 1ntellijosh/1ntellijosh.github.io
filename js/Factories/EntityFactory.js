import EnemyBSprite from '../Prototypes/EnemyBSprite.js';
import EnemyCSprite from '../Prototypes/EnemyCSprite.js';
import EnemyDSprite from '../Prototypes/EnemyDSprite.js';
import EnemyESprite from '../Prototypes/EnemyESprite.js';
import EnemyFSprite from '../Prototypes/EnemyFSprite.js';
import EnemyGSprite from '../Prototypes/EnemyGSprite.js';
import AsteroidSprite from '../Prototypes/AsteroidSprite.js';
import ExplosionSprite from '../Prototypes/ExplosionSprite.js';
import MissileSprite from '../Prototypes/MissileSprite.js';
import ShipSprite from '../Prototypes/ShipSprite.js';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums.js';
import { EntityConfigDict } from '../Dicts/EntityConfigDict.js';

/**
 * Factory for creating enemy sprites
 * Uses Factory Pattern to create different enemy types with their specific configurations
 */
class EntityFactory {
  /**
   * Creates an enemy based on type
   * @param {Object} gameContext - The game context
   * @param {ENUM} EntityTypeEnums - Entity type
   * @param {Object} payload - The payload for the entity (for custom, dynamic settings)
   *
   * @returns {EnemySprite}
   */
  static create(gameContext, type, payload = false) {
    switch (type) {
      case EntityTypeEnums.SHIP:
        return new ShipSprite(gameContext, this.getConfig(type));
      case EntityTypeEnums.ENEMY_B:
        return new EnemyBSprite(gameContext, this.getConfig(type));
      case EntityTypeEnums.ENEMY_C:
        return new EnemyCSprite(gameContext, this.getConfig(type));
      case EntityTypeEnums.ENEMY_D:
        return new EnemyDSprite(gameContext, this.getConfig(type));
      case EntityTypeEnums.ENEMY_E:
        return new EnemyESprite(gameContext, this.getConfig(type));
      case EntityTypeEnums.ENEMY_F:
        return new EnemyFSprite(gameContext, this.getConfig(type));
      case EntityTypeEnums.ENEMY_G:
        return new EnemyGSprite(gameContext, this.getConfig(type));
      case EntityTypeEnums.ASTEROID:
        return new AsteroidSprite(gameContext, { ...this.getConfig(type), ...payload });
      case EntityTypeEnums.EXPLOSION:
        return new ExplosionSprite(gameContext, { ...this.getConfig(type), ...payload });
      case EntityTypeEnums.LASER:
      case EntityTypeEnums.MISSILE:
        return new MissileSprite(gameContext, type, payload);
      default:
        throw new Error(`Invalid enemy type: ${type}`);
    }
  }

  static getConfig(type) {
    return EntityConfigDict[type];
  }
}

export default EntityFactory;

