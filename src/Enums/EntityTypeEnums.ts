/**
 * Entity type enums - all entity types defined in one place
 * 
 * @returns {Object} - The EntityTypeEnums object.
 * 
 * @since abstract--JP
 */

export interface EntityType {
  readonly [key: string]: string;
}

export const EntityTypeEnums: EntityType = Object.freeze({
  SHIP: 'ship',
  MISSILE: 's',
  ASTEROID: 'a',
  EXPLOSION: 'x',
  LASER: 'l',
  ENEMY_B: 'b',
  ENEMY_C: 'c',
  ENEMY_D: 'd',
  ENEMY_E: 'e',
  ENEMY_F: 'f',
  ENEMY_G: 'g',
} as const);
