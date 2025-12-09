import AbstractSprite from '../Prototypes/AbstractSprite';
import EnemyBSprite from '../Prototypes/EnemyBSprite';
import EnemyCSprite from '../Prototypes/EnemyCSprite';
import EnemyDSprite from '../Prototypes/EnemyDSprite';
import EnemyESprite from '../Prototypes/EnemyESprite';
import EnemyFSprite from '../Prototypes/EnemyFSprite';
import EnemyGSprite from '../Prototypes/EnemyGSprite';
import AsteroidSprite from '../Prototypes/AsteroidSprite';
import ExplosionSprite from '../Prototypes/ExplosionSprite';
import MissileSprite from '../Prototypes/MissileSprite';
import ShipSprite from '../Prototypes/ShipSprite';
import { EntityTypeEnums } from '../Enums/EntityTypeEnums';

/**
 * Factory for creating enemy sprites
 * Uses Factory Pattern to create different enemy types with their specific configurations
 */
export default class EntityFactory {
  /**
   * Creates an enemy based on type
   * @param {Object} gameContext - The game context
   * @param {ENUM} EntityTypeEnums - Entity type
   * @param {Object} payload - The payload for the entity (for custom, dynamic settings)
   *
   * @returns {EnemySprite}
   */
  static create = (gameContext: any, type: string, payload: object = {}): AbstractSprite => {
    switch (type) {
      case EntityTypeEnums.SHIP:
        return new ShipSprite(gameContext);
      case EntityTypeEnums.ENEMY_B:
        return new EnemyBSprite(gameContext);
      case EntityTypeEnums.ENEMY_C:
        return new EnemyCSprite(gameContext);
      case EntityTypeEnums.ENEMY_D:
        return new EnemyDSprite(gameContext);
      case EntityTypeEnums.ENEMY_E:
        return new EnemyESprite(gameContext);
      case EntityTypeEnums.ENEMY_F:
        return new EnemyFSprite(gameContext);
      case EntityTypeEnums.ENEMY_G:
        return new EnemyGSprite(gameContext);
      case EntityTypeEnums.ASTEROID:
        return new AsteroidSprite(gameContext, payload as { x: number });
      case EntityTypeEnums.EXPLOSION:
        return new ExplosionSprite(gameContext, payload as { x: number, y: number, width: number, height: number });
      case EntityTypeEnums.LASER:
      case EntityTypeEnums.MISSILE:
        return new MissileSprite(
          gameContext,
          type,
          payload as {
            x: number,
            y: number,
            xSpd: number,
            ySpd: number,
            color: string,
            width: number,
            height: number
          });
      default:
        throw new Error(`Invalid enemy type: ${type}`);
    }
  }
}
