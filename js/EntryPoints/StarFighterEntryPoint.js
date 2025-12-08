/**
 * Main entry point for the StarFighter game
 * Initializes the game when DOM is ready
 */
import Game from '../Game.js';

export default function StarFighterEntryPoint() {
  // Main entry point for the game
  $(() => {
    console.log('StarFighterEntryPoint mounting...');
    const game = new Game();

    $('#start').on('click', game.drawBoard.bind(game));
    game.setupThemeRepeatListener();
  });
}
