import AbstractSprite from '../Strategies/Sprites/AbstractSprite';
import EnemyBSprite from '../Strategies/Sprites/EnemyBSprite';
import EnemyCSprite from '../Strategies/Sprites/EnemyCSprite';
import EnemyDSprite from '../Strategies/Sprites/EnemyDSprite';
import EnemyESprite from '../Strategies/Sprites/EnemyESprite';
import EnemyFSprite from '../Strategies/Sprites/EnemyFSprite';
import EnemyGSprite from '../Strategies/Sprites/EnemyGSprite';
import AsteroidSprite from '../Strategies/Sprites/AsteroidSprite';
import ExplosionSprite from '../Strategies/Sprites/ExplosionSprite';
import MissileSprite from '../Strategies/Sprites/MissileSprite';
import ShipSprite from '../Strategies/Sprites/ShipSprite';
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
