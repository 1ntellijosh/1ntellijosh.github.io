/**
 * Main entry point for the StarFighter game
 * Initializes the game when DOM is ready
 */
import Game from '../Game';

export default function StarFighterEntryPoint(): void {
  // Main entry point for the game
  $((): void => {
    const game: Game = new Game();

    $('#start').on('click', game.drawBoard.bind(game));
    game.setupThemeRepeatListener();
  });
}
