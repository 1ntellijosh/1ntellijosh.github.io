/**
 * Game constants - all game constants defined in one place
 * 
 * @returns {Object} - The GameConsts object.
 * 
 * @since abstract--JP
 */

export interface GameConsts {
  GAME_WIDTH: number;
  GAME_HEIGHT: number;
  FPS: number;
}

export const GameConsts: GameConsts = Object.freeze({
  GAME_WIDTH: 650,
  GAME_HEIGHT: 770,
  FPS: 25,
});