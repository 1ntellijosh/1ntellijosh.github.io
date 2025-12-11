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
  FRAME_RATE: number;
  GUN_UPRADE_THRESHOLD: number;
  GUN_UPRADE_THRESHOLD_2: number;
  GUN_UPRADE_THRESHOLD_3: number;
  GUN_UPRADE_THRESHOLD_4: number;
}

export const GameConsts: GameConsts = Object.freeze({
  GAME_WIDTH: 650,
  GAME_HEIGHT: 770,
  FRAME_RATE: 40,
  GUN_UPRADE_THRESHOLD: 1000
} as const);