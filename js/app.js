//Written by Joshua Payne June 2018. Not intended for commercial use.

import SoundManager from './SoundManager.js';
import { GameConsts } from './GameConsts.js';
import EntityFactory from './Factories/EntityFactory.js';
import { EntityTypeEnums } from './Enums/EntityTypeEnums.js';

class Game {
  constructor() {
    this.gameCanvas = null;
    this.gameCtx = null;
    // keyboard keys to add listeners to
    this.keys = {
      lKey: false,
      rKey: false,
      uKey: false,
      dKey: false,
      sKey: false,
    }
    //gun fire rate modifiers
    this.rpmCount = 0;
    this.fireRate = 3;
    this.clip = 0;
    this.clipSize = 4;
    this.clipReady = 6;
    this.mag = 0;
    this.pointCount = 0;
    //arrays for handling every enemy and bullet on screen, as well as enemy spawn types and asteroid placements
    this.sMissiles = [];
    this.enemies = [];
    //could create new arrays of enemy combination types for levels later
    this.enemyTypes = [
      EntityTypeEnums.ENEMY_B,
      EntityTypeEnums.ENEMY_C,
      EntityTypeEnums.ENEMY_D,
      EntityTypeEnums.ENEMY_E,
      EntityTypeEnums.ENEMY_F,
      EntityTypeEnums.ENEMY_G
    ]
    this.typeAPlacements = [75, 75, 150, 150, 225, 225, 295, 360, 437, 437, 517, 517, 575, 575];
    //level modifiers changes as levels progress
    this.frameCount = 0;
    this.level = 1;
    this.levelLength = 1350;
    this.levelStep = 0;
    this.levelMessage = 75;
    this.spawnRange = 130;
    this.possibleBatchNum = 3;
    this.enemyBatch = [];
    this.spawnReady = true;
    this.spawnClip = 0;
    this.spawnClipLim = 15;
    this.spawnTypeCount = 0;
    this.batchSlot = 0;
    this.roundCount = 0;
    this.spawnLimit = 5;
    this.asterLim = .010;
    //main score and game status
    this.score = 0;
    this.gameOver = false;
    this.gameWon = false;
    // initialize sound manager and load sounds and theme
    const soundMgr = new SoundManager();
    this.sounds = {
      death: soundMgr.get('death'),
      tap: soundMgr.get('tap'),
      blowUp: soundMgr.get('blowUp'),
      rez: soundMgr.get('rez'),
      boost: soundMgr.get('boost'),
      nova: soundMgr.get('nova')
    }
    this.theme = soundMgr.loadTheme('firstTheme');
    // Null values will instantiate in drawBoard function
    this.ship = null
    this.scoreBoard;
    this.levelBoard;
    this.healthBoard;
  }

  /**
   * Handles the ship missile fire
   *
   * @returns {Game}
   */
  handleShipMissileFire = function() {
    if (!this.canProcessMissileFire()) return this

    if (this.fireMissilesInputActivated()) {
      if (this.keys.lKey) return this.fireShipMissile(-this.ship.speed/15).checkAndResetShipClipAndMag()

      if (this.keys.rKey == true) return this.fireShipMissile(this.ship.speed/15).checkAndResetShipClipAndMag()

      return this
        .fireShipMissile(0)
        .checkAndResetShipClipAndMag()
    }

    return this.checkAndResetShipClipAndMag();
  }

  /**
   * Counter between ship fires, when clip (adds up every frame) hits the clipready (reload limit) initiates fire
   *
   * @returns {boolean} True if missile fire can be processed
   */
  canProcessMissileFire = function() {
    return this.clip > this.clipReady && this.mag <= this.clipSize
  }

  /**
   * Checks if the ship missile fire input is activated
   *
   * @returns {boolean} True if missile fire input is activated
   */
  fireMissilesInputActivated = function() {
    return this.keys.sKey && this.rpmCount >= this.fireRate && this.ship.movable
  }

  /**
   * Fires a ship missile
   *
   * @param {number} curve - The curve of the missile
   *
   * @returns {Game}
   */
  fireShipMissile = function(curve) {
    this.sMissiles.push(
      this.ship.fire(
        curve,
        this.ship.missileColor,
        this.ship.missileWidth,
        this.ship.missileHeight
      )
    )
    this.rpmCount = 0;
    this.mag += 1;

    return this
  }

  /**
   * Checks and resets the ship clip and mag state for firing between clips
   *
   * @returns {Game}
   */
  checkAndResetShipClipAndMag = function() {
    if (this.mag > this.clipSize) {
      this.clip = 0;
      this.mag = 0;
    }

    return this
  }

  /**
   * Spawns new enemies at a random interval based on the spawn range
   *
   * @returns {Game}
   */
  spawnNewEnemies = function() {
    //when game frames hit current spawnRange levels begin spawn process
    if (this.frameCount >= this.spawnRange && this.spawnReady == true) {
      //randomly spawn 1 to number-limit of enemyTypes (possibleBatchNum)
      let thisBatch = Math.floor(Math.random() * this.possibleBatchNum) + 1;
      //find which enemy type and make an array of types
      for (let i = 0; i < thisBatch; i++) {
        //find enemy type and put them in spawnBatch array for this enemy spawn
        this.enemyBatch.push(this.enemyTypes[Math.floor(Math.random() * 6)]);
      }
      this.spawnReady = false;
      this.spawnTypeCount = this.enemyBatch.length;
      this.batchSlot = 0;
    }
    /**
     * When each spawn is activated between the spawnClipLimit (adjusted per level) a new baddy through the spawn array
     * is called. depending on type, that type is send to the Enemy Array to be processed and drawn, and added to the
     * onscreen enemies array
     */
    if (this.spawnClip >= this.spawnClipLim && this.enemyBatch.length > 0) {
      this.enemies.push(
        EntityFactory.create(this.gameCtx, this.enemyBatch[this.batchSlot])
      );
      this.batchSlot += 1;
      this.spawnClip = 0;
    }
    //reset the round through the batch array - to be done the spawnLimit of times, increaed per level
    if (this.batchSlot >= this.spawnTypeCount && this.spawnReady == false) {
      this.batchSlot = 0;
      this.roundCount += 1;
    }
    //handles and reset the spawnlimit variables and spawn window
    if (this.roundCount >= this.spawnLimit && this.spawnReady == false) {
      this.enemyBatch = [];
      this.spawnReady = true;
      this.frameCount = 0;
      this.roundCount = 0;
    }

    return this
  }

  /**
   * Handles random asteroid drops. asterLim variable increases as levels increase, and therefore astroid spawn
   * likelihood increases
   *
   * @returns {Game}
   */
  spawnNewAsteroids = function() {
    if(Math.random() >= this.asterLim) return this
        
    let dinger = Math.floor(Math.random() * 15);
    let x = this.typeAPlacements[dinger];
    this.enemies.push(EntityFactory.create(this.gameCtx, EntityTypeEnums.ASTEROID, { x }));

    return this
  }

  /**
   * Object sent to explode, function takes relevant variables and converts them to the Enemy function under type 'x'
   * for explosion animation
   *
   * @param {Object} object - The object to explode
   *
   * @returns {Game}
   */
  explode = function(object) {
    const payload = object.type === EntityTypeEnums.ASTEROID
      ? {
        x: object.x,
        y: object.y,
        width: 56,
        height: 53,
      }
      : {
        x: object.x,
        y: object.y,
        width: 36,
        height: 34,
      }
    this.enemies.push(EntityFactory.create(this.gameCtx, EntityTypeEnums.EXPLOSION, payload));

    return this
  }

  /**
   * Handles missile placements and movements, enemy and friendly. called every flash/frame
   *
   * @returns {Game}
   */
  updateActiveEnemyAndShipFireSprites = function() {
    for (let i = 0; i < this.sMissiles.length; i++) {
      this.sMissiles[i].update(this.sMissiles);
    };
    this.sMissiles = this.sMissiles.filter(function(missile) {
      return missile.inPlay;
    });

    return this
  }

  /**
   * Handles enemy movment and inbounds checker. called ever flash/frame
   *
   * @returns {Game}
   */
  updateEnemyMovementAndFire = function() {
    for (let i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update(this.sMissiles);
    }

    this.enemies = this.enemies.filter(function(enemy) {
      return enemy.inPlay;
    });

    return this
  }

  /**
   * Determines if two objects collide
   *
   * @param {Object} ob1 - The first object
   * @param {Object} ob2 - The second object
   *
   * @returns {boolean}
   */
  hits = function(ob1, ob2) {
    return ob1.x < ob2.x + ob2.width &&
      ob1.x + ob1.width > ob2.x &&
      ob1.y < ob2.y + ob2.height &&
      ob1.y + ob1.height > ob2.y;
  }

  /**
   * Handles all missiles hits and impacts for score and ship health updates
   *
   * @returns {Game}
   */
  updateUserScore = function() {
    return this
      .checkForLaserAndMissileHits()
      .checkForShipHitOnEnemies()
  }

  /**
   * Checks if a ship missile has hit the ship
   *
   * @returns {Game}
   */
  checkForLaserAndMissileHits = function() {
    for (let i = 0; i < this.sMissiles.length; i++) {
      if (this.sMissiles[i].type === EntityTypeEnums.LASER) {
        this.checkForLaserHitOnShip(this.sMissiles[i])

        continue
      }

      this.checkForMissileHitsOnEnemies(this.sMissiles[i]);
    }

    return this
  }

  /**
   * Checks if a laser has hit the ship
   *
   * @param {Object} laser - The laser sprite
   *
   * @returns {Game}
   */
  checkForLaserHitOnShip = function(laser) {
    if (!this.hits(laser, this.ship) || !this.ship.inPlay) return this

    laser.inPlay = false;
    this.onShipHit('checkForLaserHitOnShip');

    return this
  }

  /**
   * Checks if a ship missiles have hit enemies
   *
   * @returns {Game}
   */
  checkForMissileHitsOnEnemies = function(missile) {
    // Loop through all enemies
    for (let x = 0; x < this.enemies.length; x++) {
      // If the enemy is an explosion, skip it
      if(this.enemies[x].type === EntityTypeEnums.EXPLOSION) continue
      
      if (this.hits(missile, this.enemies[x])) {
        this.onEnemyHit(this.enemies[x], missile);
      }
    }

    return this
  }

  /**
   * Checks if the ship has hit an enemy
   *
   * @returns {Game}
   */
  checkForShipHitOnEnemies = function() {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (!this.ship.inPlay || !this.hits(enemy, this.ship)) continue

      if (enemy.type != EntityTypeEnums.ASTEROID) {
        this.sounds.blowUp.play();
        this.explode(enemy);
        enemy.inPlay = false;
      }
      this.onShipHit('checkForShipHitOnEnemies');
    }

    return this
  }

  /**
   * Handles the enemy hit event
   *
   * @param {Object} enemy - The enemy sprite
   * @param {Object} missile - The ship missile sprite
   *
   * @returns {Game}
   */
  onEnemyHit = function(enemy, missile) {
    this.sounds.tap.play();
    missile.inPlay = false;

    // If enemy has over 1 health, subtract 1 and add 3 to score and point count
    if (enemy.health > 1) {
      enemy.health -= 1;
      if (enemy.type !== EntityTypeEnums.ASTEROID) {
        this.score += enemy.scoreValue;
        this.pointCount += enemy.scoreValue;
      }

      return this
    }

    this.sounds.blowUp.play();
    this.explode(enemy);
    enemy.inPlay = false;
    this.score += enemy.scoreValue;
    this.pointCount += enemy.scoreValue;

    return this
  }

  /**
   * Handles the ship hit event
   *
   * @returns {Game}
   */
  onShipHit = function() {
    this.sounds.blowUp.play();
    this.sounds.death.play();
    this.ship.health -= 1;
    this.explode(this.ship);
    this.ship.respawnTime = 0;
    this.ship.inPlay = false;
    this.ship.changeGunLevel(1);
    this.clipReady = 6;
    this.clipSize = 4;
    this.fireRate = 3;
    this.pointCount = 0;
  }

  /**
   * Handles weapon upgrades. Weapons increase as score goes up without dying. This is the pointcount. If the player
   * dies, they pointcount goes to 0.
   *
   * @returns {Game}
   */
  checkForWeaponUpgrade = function() {
    if (this.ship.gunLev === 3) return this

    if (this.pointCount >= 1000 && this.ship.gunLev < 2) {
      this.ship.changeGunLevel(2);
      this.fireRate = 2;
      this.clipReady = 7;
      this.sounds.boost.play();

      return this
    }
    if (this.pointCount >= 2000 && this.ship.gunLev < 3) {
      this.ship.changeGunLevel(3);
      this.fireRate = 1;
      this.clipReady = 5;
      this.clipSize = 3;
      this.mag = 0;
      this.sounds.boost.play();

      return this
    }

    return this
  }

  /**
   * updates level score and health boards. called every flash/frame from update function
   *
   * @returns {Game}
   */
  updateBoards = function() {
    this.levelBoard.text(this.level);

    this.scoreBoard.empty();
    let newScore = $('<p>').text(this.score);
    this.scoreBoard.append(newScore);

    this.healthBoard.empty();
    for (let i = 0; i < this.ship.health; i++) {
      let healthDiv = $('<div>').attr('id', 'healthBar');
      healthDiv.appendTo('#health')
    }

    return this
  }

  /**
   * Calls every flash. Triggers all handlers each frame called from flash method
   *
   * @returns {Game}
   */
  updateDataForNewFrame = function() {
    //handles game over status variable
    if(this.ship.health == 0) {
      this.gameOver = true
    }
    //increments all relevant frame to frame variables
    this.frameCount += 1
    this.rpmCount += 1
    this.clip += 1
    this.spawnClip += 1
    this.levelStep += 1

    //calls for ship movement per keystrokes
    this.ship.updateShipMovement(this.keys)
    
    return this
      .checkForWeaponUpgrade()
      .handleShipMissileFire()
      .updateActiveEnemyAndShipFireSprites()
      .updateEnemyMovementAndFire()
      .spawnNewEnemies()
      .spawnNewAsteroids()
      .updateUserScore()
      .checkForNextLevel()
  }

  /**
   * Checks for level progression as game progresses
   *
   * @returns {Game}
   */
  checkForNextLevel = function() {
    if(this.levelStep < this.levelLength) return this

    return this.onLevelUp();
  }

  /**
   * Handles the level up event
   *
   * @returns {Game}
   */
  onLevelUp = function() {
    return this
      .blowUpAllEnemiesAndClearBullets()
      .spawnShipIntoNewLevel()
      .updateLevelVariablesForNewLevel()
  }

  /**
   * Blows up all enemies and clears all ship missiles
   *
   * @returns {Game}
   */
  blowUpAllEnemiesAndClearBullets = function() {
    // Play sound of enemies and asteroids clearing
    this.sounds.nova.play()
    // Blow up all enemies
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].type === EntityTypeEnums.EXPLOSION) continue

      this.enemies[i].inPlay = false
      this.explode(this.enemies[i])
    }

    // Clear all ship missiles
    this.sMissiles = [];

    return this
  }

  /**
   * Spawns the ship into the new level
   *
   * @returns {Game}
   */
  spawnShipIntoNewLevel = function() {
    // Recover one health if ship health is less than 3
    if (this.ship.health < 3) this.ship.health += 1

    // Respawn the ship
    this.ship.respawnTime = 0
    this.ship.inPlay = false
    this.ship.respawn()

    return this
  }

  /**
   * Updates the level variables for a new level
   *
   * @returns {Game}
   */
  updateLevelVariablesForNewLevel = function() {
    // Increment level variable
    this.level += 1;
    this.levelStep = 0;
    // Mark variable to draw level on the sreen
    this.levelMessage = 0;
    // Reset relevant variables
    this.frameCount = 0;
    this.enemyBatch = [];
    this.spawnReady = true;
    this.spawnClip = 0;
    this.spawnTypeCount = 0;
    this.batchSlot = 0;
    this.roundCount = 0;
    this.spawnLimit = 5;

    // Increase frequency a new batch is rung up for increased difficulty
    if(this.spawnRange > 110) this.spawnRange -= 10
    // Increase amount of enemies spawn for each type per spawn
    this.possibleBatchNum +=1
    // Increase asteroid probability
    if(this.asterLim < .024) this.asterLim += .002
    // Increase enemy spawn rate
    if (this.spawnClipLim > 6) this.spawnClipLim -= 1

    return this
  }

  /**
   * Draws all enemy bullet and ship placements on the screen. Also draws level message on level up. Called every frame
   * from flash function.
   *
   * @returns {Game}
   */
  drawGameScreen = function() {
    return this
      .clearScreenForNewFrame()
      .drawShip()
      .drawShipMissiles()
      .drawEnemies()
      .drawLevelMessage()
  }

  /**
   * Clears the screen for a new frame
   *
   * @returns {Game}
   */
  clearScreenForNewFrame = function() {
    this.gameCtx.clearRect(0, 0, GameConsts.GAME_WIDTH, GameConsts.GAME_HEIGHT)

    return this
  }

  /**
   * Draws the ship sprite placement for the current frame
   *
   * @returns {Game}
   */
  drawShip = function() {
    this.ship.inPlay
      ? this.ship.draw()
      : this.ship.respawn();

    return this
  }

  /**
   * Draws the ship missile sprite placements for the current frame
   *
   * @returns {Game}
   */
  drawShipMissiles = function() {
    for (let i = 0; i < this.sMissiles.length; i++) {
      this.sMissiles[i].draw();
    }

    return this
  }

  /**
   * Draws the enemy sprite placements for the current frame
   *
   * @returns {Game}
   */
  drawEnemies = function() {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw();
    }

    return this
  }

  /**
   * Draws the level message for the current frame
   *
   * @returns {Game}
   */
  drawLevelMessage = function() {
    if (this.level <= 10) {
      if (this.levelMessage < 75) {
        this.gameCtx.font = '50px \'Sarpanch\'';
        this.gameCtx.fillStyle = '#009999'
        this.gameCtx.textAlign = 'center';
        this.gameCtx.fillText('Level: ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
        this.levelMessage += 1;
      }

      return this
    }
    if (this.level === 11) {
      if (this.levelMessage < 75) {
        this.gameCtx.font = '75px \'Sarpanch\'';
        this.gameCtx.fillStyle = '#CD5C5C'
        this.gameCtx.textAlign = 'center';
        this.gameCtx.fillText('YOU WIN!!!', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
        this.gameCtx.font = '50px \'Sarpanch\'';
        this.gameCtx.textAlign = 'center';
        this.gameCtx.fillText('Bonus Level ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 - 50);
        this.levelMessage += 1;
        $('#scoreB').addClass('bonus');
        $('#levelB').addClass('bonus');
      }

      return this
    }

    if (this.levelMessage < 75) {
      this.gameCtx.font = '75px \'Sarpanch\'';
      this.gameCtx.fillStyle = '#CD5C5C'
      this.gameCtx.textAlign = 'center';
      this.gameCtx.fillText('Survive', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
      this.gameCtx.font = '50px \'Sarpanch\'';
      this.gameCtx.textAlign = 'center';
      this.gameCtx.fillText('Bonus Level ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 - 50);
      this.levelMessage += 1;
    }

    return this
  }

  //called every frame
  flash = function() {
    /**
     * If game over status is off, function as normal
     */
    if (this.gameOver == false) {
      return this
        .updateDataForNewFrame()
        .drawGameScreen()
        .updateBoards()
    }

    /**
     * If game over status is on, clear screen and display score and game over. set up listener for enter key to reset
     * game (calls resetCall function)
     */
    return this.onGameOver()
  }

  /**
   * Displays the game over screen, resets the game, and sets up the listener for the enter key to reset the game
   *
   * @returns {Game}
   */
  onGameOver = function() {
    this.gameCtx.clearRect(0, 0, GameConsts.GAME_WIDTH, GameConsts.GAME_HEIGHT);
    this.theme.pause();
    this.theme.currentTime = 0;
    this.gameCtx.font = '50px \'Sarpanch\'';
    this.gameCtx.fillStyle = '#009999'
    this.gameCtx.textAlign = 'center';
    this.gameCtx.fillText('Game Over', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 - 60);
    this.gameCtx.fillText('Level ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
    this.gameCtx.fillText('Score: '+ this.score, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 + 45);
    this.gameCtx.font = '25px \'Sarpanch\'';
    this.gameCtx.fillText('Hit enter to play again', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 + 95);
    $(document).on('keydown', this.resetCall.bind(this));

    return this
  }

  /**
   * Draws the board set up and sets up game after clicking start.
   *
   * @returns {Game}
   */
  drawBoard = function() {
    this
      .removeNonGameElements()
      .displayGameUiElements()
      .instantiateGameContextAndAssets()
      .setFrameRate()
      .playTheme()
      .setupKeyboardListeners()

    return this
  }

  /**
   * Generates and applies the game screen to the #main div
   *
   * @returns {<canvas> gameContext}
   */
  pinGame = function() {
    this.gameCanvas = $("<canvas width='" + GameConsts.GAME_WIDTH + "' height='" + GameConsts.GAME_HEIGHT + "'></canvas>").attr('id', 'canvas');
    this.gameCtx = this.gameCanvas.get(0).getContext('2d');
    this.gameCanvas.appendTo('#gameDiv');

    return this.gameCtx
  }

  /**
   * Removes the non-game elements from the screen (when game is started)
   *
   * @returns {Game}
   */
  removeNonGameElements = function() {
    $('#start').remove();
    $('.buttonWrap').remove();
    $('h2').remove();

    return this
  }

  /**
   * Displays the game UI elements for level health and score (when game is started)
   *
   * @returns {Game}
   */
  displayGameUiElements = function() {
    $('#left').css('display', 'flex');
    $('#right').css('display', 'flex');

    return this
  }

  /**
   * Instantiates the game context and assets that need context
   *
   * @returns {Game}
   */
  instantiateGameContextAndAssets = function() {
    const gameCtx = this.pinGame();

    this.ship = EntityFactory.create(gameCtx, EntityTypeEnums.SHIP);

    //grabs score level and health elements to populate them
    this.scoreBoard = $('#scoreB');
    this.levelBoard = $('#levelB');
    this.healthBoard = $('#health');

    return this
  }

  /**
   * Sets the frame rate for the game
   *
   * @returns {Game}
   */
  setFrameRate = function() {
    setInterval(this.flash.bind(this), 1000/GameConsts.FPS);

    return this
  }

  /**
   * Plays the theme music
   *
   * @returns {Game}
   */
  playTheme = function() {
    this.theme.play();

    return this
  }

  /**
   * Sets up the keyboard listeners for controls of the game
   *
   * @returns {Game}
   */
  setupKeyboardListeners = function() {
    $(document).on('keydown', this.keyReader.bind(this));
    $(document).on('keyup', this.keyRelease.bind(this));

    return this
  }

  /**
   * Resets the game when the enter key is pressed in the game over screen
   *
   * @param {Event} event - The key event
   *
   * @returns {Game}
   */
  resetCall = function(event) {
    if (event.keyCode == 13) {
      return this.resetGame();
    }

    return this
  }

  /**
   * Resets all game variables when reset command made
   *
   * @returns {Game}
   */
  resetGame = function() {
    //reset gun variables -- might be irrelevant if ship fire powerup is not yet implemented
    this.rpmCount = 0;
    this.fireRate = 3;
    this.clip = 0;
    this.clipSize = 4;
    this.clipReady = 6;
    this.mag = 0;
    this.pointCount = 0;
    //reset onscreen enemies and missiles/lasers
    this.sMissiles = [];
    this.enemies = [];

    //reset game variables
    this.frameCount = 0;
    this.level = 1;
    this.levelStep = 0;
    this.levelMessage = 75;
    this.spawnRange = 130;
    this.enemyBatch = [];
    this.possibleBatchNum = 3;
    this.spawnReady = true;
    this.spawnClip = 0;
    this.spawnClipLim = 15;
    this.spawnTypeCount = 0;
    this.batchSlot = 0;
    this.roundCount = 0;
    this.spawnLimit = 5;
    this.asterLim = .010;

    //reset ship health and gun levels and send into respawn animation
    this.ship.health = 3;
    this.ship.changeGunLevel(1);
    this.score = 0;
    this.gameOver = false;

    this.sounds.rez.play();
    this.playTheme();

    //clear canvas for a new canvas to be drawn and pinned
    this.gameCanvas.remove();

    //pin new canvas
    this.pinGame();

    //reset default ship placement
    this.ship.x = GameConsts.GAME_WIDTH/2;
    this.ship.y = 625;
    this.ship.draw();

    //if player won the game, the score and level colors reset
    $('#scoreB').removeClass();
    $('#levelB').removeClass();

    return this
  }

  /**
   * Handler for key strokes set the pressed down keys to true
   *
   * @param {Event} event - The key event
   *
   * @returns {Game}
   */
  keyReader = function(event) {
    switch (event.keyCode) {
      case 37:
        this.keys.lKey = true;
        break;
      case 39:
        this.keys.rKey = true;
        break;
      case 32:
        this.keys.sKey = true;
        break;
      case 38:
        this.keys.uKey = true;
        break;
      case 40:
        this.keys.dKey = true;
        break;
    }

    return this
  }

  /**
   * Handles the key strokes for released keys to false
   *
   * @param {Event} event - The key event
   *
   * @returns {Game}
   */
  keyRelease = function(event) {
    switch (event.keyCode) {
      case 37:
        this.keys.lKey = false;
        break;
      case 39:
        this.keys.rKey = false;
        break;
      case 32:
        this.keys.sKey = false;
        break;
      case 38:
        this.keys.uKey = false;
        break;
      case 40:
        this.keys.dKey = false;
        break;
    }

    return this
  }

  /**
   * Sets up a listener to repeat the theme music when it ends
   *
   * @returns {Game}
   */
  setupThemeRepeatListener = function() {
    this.theme.addEventListener('ended', () => {
      this.theme.currentTime = 0;
      this.playTheme();
    }, false);

    return this
  }
}

// Main entry point for the game
$(() => {
  const game = new Game();

  $('#start').on('click', game.drawBoard.bind(game));
  game.setupThemeRepeatListener();
})
