import SoundManager from './SoundManager';
import { GameConsts } from './GameConsts';
import MissileSprite from './Prototypes/MissileSprite';
import AbstractSprite from './Prototypes/AbstractSprite';
import BaseEnemySprite from './Prototypes/BaseEnemySprite';
import AsteroidSprite from './Prototypes/AsteroidSprite';
import ExplosionSprite from './Prototypes/ExplosionSprite';
import ShipSprite from './Prototypes/ShipSprite';
import Mp3 from './Mp3';
import EntityFactory from './Factories/EntityFactory';
import { EntityTypeEnums } from './Enums/EntityTypeEnums';

// TypeScript callback types for React state setters
type ScoreCallback = (points: number) => void;
type HealthCallback = (amount: number) => void;
type SetLevelStateCallback = (level: number) => void;

export default class Game {
  gameDiv: HTMLElement;
  gameCanvas: HTMLCanvasElement | null;
  gameCtx: CanvasRenderingContext2D | null;
  keys: { a: boolean, d: boolean, w: boolean, s: boolean, space: boolean };
  rpmCount: number;
  fireRate: number;
  clip: number;
  clipSize: number;
  clipReady: number;
  mag: number;
  pointCount: number;
  sMissiles: MissileSprite[];
  enemies: (BaseEnemySprite | AsteroidSprite | ExplosionSprite)[];
  enemyTypes: string[];
  typeAPlacements: number[];
  frameCount: number;
  level: number;
  levelLength: number;
  levelStep: number;
  levelMessage: number;
  spawnRange: number;
  possibleBatchNum: number;
  enemyBatch: string[];
  spawnReady: boolean;
  spawnClip: number;
  spawnClipLim: number;
  spawnTypeCount: number;
  batchSlot: number;
  roundCount: number;
  spawnLimit: number;
  asterLim: number;
  score: number;
  gameOver: boolean;
  gameWon: boolean;
  sounds: { [key: string]: Mp3 };
  theme: HTMLAudioElement | null;
  ship: ShipSprite | null;
  // React callback functions
  setScoreState: ScoreCallback;
  setLevelState: SetLevelStateCallback;
  setHealthState: HealthCallback;

  constructor(
    gameDiv: HTMLElement,
    keys: { w: boolean, a: boolean, s: boolean, d: boolean, space: boolean },
    setScoreState: ScoreCallback,
    setLevelState: SetLevelStateCallback,
    setHealthState: HealthCallback,
  ) {
    this.gameDiv = gameDiv;
    this.gameCanvas = null;
    this.gameCtx = null;
    // keyboard keys to add listeners to
    this.keys = keys;
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
    // Null values will instantiate in instantiateGameContextAndAssets function
    this.ship = null
    // Store React callbacks
    this.setScoreState = setScoreState;
    this.setLevelState = setLevelState;
    this.setHealthState = setHealthState;
  }

  /**
   * Draws the board set up and sets up game after clicking start.
   *
   * @returns {Game}
   */
  drawBoard(): Game {
    this
      .instantiateGameContextAndAssets()
      .setFrameRateAndFrameOperations()
      .playTheme()

    return this
  }

  /**
   * Instantiates the game context and assets that need context
   *
   * @returns {Game}
   */
  instantiateGameContextAndAssets(): Game {
    const gameCtx = this.pinGame();

    this.ship = EntityFactory.create(gameCtx, EntityTypeEnums.SHIP) as ShipSprite;

    return this
  }

  /**
   * Sets the frame rate for the game
   *
   * @returns {Game}
   */
  setFrameRateAndFrameOperations(): Game {
    setInterval(this.onNewFrame.bind(this), 1000/GameConsts.FPS);

    return this
  }

  /**
   * Called every frame, updates the game data and draws the game screen with ship and enemies, and updates the score
   * and health boards
   *
   * @returns {Game}
   */
  onNewFrame(): Game {
    /**
     * If game over status is off, function as normal
     */
    if (this.gameOver == false) {
      return this
        .updateDataForNewFrame()
        .drawGameScreen()
    }

    /**
     * If game over status is on, clear screen and display score and game over. set up listener for enter key to reset
     * game (calls resetCall function)
     */
    return this.onGameOver()
  }

  /**
   * Plays the theme music
   *
   * @returns {Game}
   */
  playTheme(): Game {
    this.theme!.play();

    return this
  }

  /**
   * Handles the ship missile fire
   *
   * @returns {Game}
   */
  handleShipMissileFire(): Game {
    if (!this.canProcessMissileFire()) return this

    if (this.fireMissilesInputActivated()) {
      if (this.keys.a) return this.fireShipMissile(-this.ship!.speed/15).checkAndResetShipClipAndMag()

      if (this.keys.d == true) return this.fireShipMissile(this.ship!.speed/15).checkAndResetShipClipAndMag()

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
  canProcessMissileFire(): boolean {
    return this.clip > this.clipReady && this.mag <= this.clipSize
  }

  /**
   * Checks if the ship missile fire input is activated
   *
   * @returns {boolean} True if missile fire input is activated
   */
  fireMissilesInputActivated(): boolean {
    return this.keys.space && this.rpmCount >= this.fireRate && this.ship!.movable
  }

  /**
   * Fires a ship missile
   *
   * @param {number} curve - The curve of the missile
   *
   * @returns {Game}
   */
  fireShipMissile(curve: number): Game {
    const missile = this.ship!.fire(
      curve,
      this.ship!.missileColor,
      this.ship!.missileWidth,
      this.ship!.missileHeight
    ) as MissileSprite | null;
    if (missile) this.sMissiles.push(missile);
    this.rpmCount = 0;
    this.mag += 1;

    return this
  }

  /**
   * Checks and resets the ship clip and mag state for firing between clips
   *
   * @returns {Game}
   */
  checkAndResetShipClipAndMag(): Game {
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
  spawnNewEnemies(): Game {
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
        EntityFactory.create(this.gameCtx, this.enemyBatch[this.batchSlot]) as BaseEnemySprite
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
  spawnNewAsteroids(): Game {
    if(Math.random() >= this.asterLim) return this
        
    let dinger = Math.floor(Math.random() * 15);
    let x = this.typeAPlacements[dinger];
    this.enemies.push(
      EntityFactory.create(this.gameCtx, EntityTypeEnums.ASTEROID, { x }) as AsteroidSprite
    );

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
  explodeEntity(object: BaseEnemySprite | AsteroidSprite | ShipSprite): Game {
    const payload = {
      x: object.x,
      y: object.y,
      width: object.type === EntityTypeEnums.ASTEROID ? 56 : 36,
      height: object.type === EntityTypeEnums.ASTEROID ? 53 : 34,
    }
    
    this.enemies.push(
      EntityFactory.create(this.gameCtx, EntityTypeEnums.EXPLOSION, payload) as ExplosionSprite
    );

    return this
  }

  /**
   * Handles missile placements and movements, enemy and friendly. called every frame
   *
   * @returns {Game}
   */
  updateActiveEnemyAndShipMissileSprites(): Game {
    this.sMissiles = this.sMissiles.filter(function(missile) {
      return missile.inPlay;
    });
    for (let i = 0; i < this.sMissiles.length; i++) {
      this.sMissiles[i].update();
    };

    return this
  }

  /**
   * Handles enemy movment and inbounds checker. called ever frame
   *
   * @returns {Game}
   */
  updateEnemyMovementAndFire(): Game {
    this.enemies = this.enemies.filter((enemy: BaseEnemySprite | AsteroidSprite | ExplosionSprite) => {
      return enemy.inPlay;
    })

    for (let i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update(this.sMissiles);
    }

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
  hits(ob1: AbstractSprite, ob2: AbstractSprite): boolean {
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
  updateUserScore(): Game {
    return this
      .checkForLaserAndMissileHits()
      .checkForShipHitOnEnemies()
  }

  /**
   * Checks if a ship missile has hit the ship
   *
   * @returns {Game}
   */
  checkForLaserAndMissileHits(): Game {
    for (let i = 0; i < this.sMissiles.length; i++) {
      if (this.sMissiles[i].type === EntityTypeEnums.LASER) {
        this.checkForLaserHitOnShip(this.sMissiles[i])

        continue
      }

      if (this.sMissiles[i].type === EntityTypeEnums.MISSILE) {
        this.checkForMissileHitsOnEnemies(this.sMissiles[i]);
      }
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
  checkForLaserHitOnShip(laser: MissileSprite): Game {
    if (!this.ship!.inPlay || !this.hits(laser, this.ship!)) return this

    laser.inPlay = false;

    return this.onShipHit();
  }

  /**
   * Checks if a ship missiles have hit enemies
   *
   * @returns {Game}
   */
  checkForMissileHitsOnEnemies(missile: MissileSprite): Game {
    // Loop through all enemies
    for (let x = 0; x < this.enemies.length; x++) {
      // If the enemy is an explosion, skip it
      if(this.enemies[x].type === EntityTypeEnums.EXPLOSION) continue

      if (this.hits(missile, this.enemies[x])) {
        this.onEnemyHit(this.enemies[x] as BaseEnemySprite | AsteroidSprite, missile);
      }
    }

    return this
  }

  /**
   * Checks if the ship has hit an enemy
   *
   * @returns {Game}
   */
  checkForShipHitOnEnemies(): Game {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (!this.ship!.inPlay || !this.hits(enemy, this.ship!)) continue

      if (enemy.type != EntityTypeEnums.ASTEROID) {
        this.sounds.blowUp.play();
        this.explodeEntity(enemy as BaseEnemySprite | AsteroidSprite);
        enemy.inPlay = false;
      }
      this.onShipHit();
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
  onEnemyHit(enemy: BaseEnemySprite | AsteroidSprite, missile: MissileSprite): Game {
    this.sounds.tap.play();
    missile.inPlay = false;

    // If enemy has over 1 health, subtract 1 and add 3 to score and point count
    if (enemy.health > 1) {
      return this.handleEnemyHitAndIncScore(enemy);
    }

    return this.handleEnemyExplodeAndIncScore(enemy as BaseEnemySprite | AsteroidSprite);
  }

  /**
   * Handles the enemy hit event with more than one health
   *
   * @param {Object} enemy - The enemy sprite
   * @param {Object} missile - The ship missile sprite
   *
   * @returns {Game}
   */
  handleEnemyHitAndIncScore(enemy: BaseEnemySprite | AsteroidSprite): Game {
    enemy.health -= 1

    if (enemy.type !== EntityTypeEnums.ASTEROID) {
      return this.incrementScoreOnEnemyHit(1)
    }

    return this
  }

  /**
   * Handles the enemy explosion event and increments the score
   *
   * @param {Object} enemy - The enemy sprite
   *
   * @returns {Game}
   */
  handleEnemyExplodeAndIncScore(enemy: BaseEnemySprite | AsteroidSprite): Game {
    this.sounds.blowUp.play()
    this.explodeEntity(enemy as BaseEnemySprite | AsteroidSprite)
    enemy.inPlay = false

    return this.incrementScoreOnEnemyHit(enemy.scoreValue)
  }

  /**
   * Increments the score on an enemy hit/explosion
   *
   * @param {number} scoreValue - The score value to increment
   *
   * @returns {Game}
   */
  incrementScoreOnEnemyHit(scoreValue: number): Game {
    this.score += scoreValue
    this.pointCount += scoreValue
    // Update React state via callback
    this.setScoreState(this.score);

    return this
  }

  /**
   * Handles the ship hit event
   *
   * @returns {Game}
   */
  onShipHit(): Game {
    this.sounds.blowUp.play();
    this.sounds.death.play();
    this.ship!.health -= 1;
    // Update React state via callback
    this.setHealthState(this.ship!.health);
    this.explodeEntity(this.ship! as ShipSprite);
    this.ship!.respawnTime = 0;
    this.ship!.inPlay = false;
    this.ship!.changeGunLevel(1);
    this.clipReady = 6;
    this.clipSize = 4;
    this.fireRate = 3;
    this.pointCount = 0;

    return this
  }

  /**
   * Handles weapon upgrades. Weapons increase as score goes up without dying. This is the pointcount. If the player
   * dies, they pointcount goes to 0.
   *
   * @returns {Game}
   */
  checkForWeaponUpgrade(): Game {
    if (this.ship!.gunLev === 3) return this

    if (this.pointCount >= 1000 && this.ship!.gunLev < 2) {
      this.ship!.changeGunLevel(2);
      this.fireRate = 2;
      this.clipReady = 7;
      this.sounds.boost.play();

      return this
    }
    if (this.pointCount >= 2000 && this.ship!.gunLev < 3) {
      this.ship!.changeGunLevel(3);
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
   * Calls every frame. Triggers all handlers each frame called from frame method
   *
   * @returns {Game}
   */
  updateDataForNewFrame(): Game {
    //handles game over status variable
    if(this.ship!.health == 0) {
      this.gameOver = true

      return this
    }
    
    // Increments all relevant frame to frame variables
    this.updateIncrementedPerFrameData()

    // Calls for ship movement per keystrokes
    this.ship!.updateShipMovement(this.keys)
    
    return this
      .checkForWeaponUpgrade()
      .handleShipMissileFire()
      .updateActiveEnemyAndShipMissileSprites()
      .updateEnemyMovementAndFire()
      .spawnNewEnemies()
      .spawnNewAsteroids()
      .updateUserScore()
      .checkForNextLevel()
  }

  /**
   * Updates the data for a new frame
   *
   * @returns {Game}
   */
  updateIncrementedPerFrameData(): Game {
    this.frameCount += 1
    this.rpmCount += 1
    this.clip += 1
    this.spawnClip += 1
    this.levelStep += 1

    return this
  }

  /**
   * Checks for level progression as game progresses
   *
   * @returns {Game}
   */
  checkForNextLevel(): Game {
    if(this.levelStep < this.levelLength) return this

    return this.onLevelUp();
  }

  /**
   * Handles the level up event
   *
   * @returns {Game}
   */
  onLevelUp(): Game {
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
  blowUpAllEnemiesAndClearBullets(): Game {
    // Play sound of enemies and asteroids clearing
    this.sounds.nova.play()
    // Blow up all enemies
    this.blowUpAllEnemies()
    // Clear all ship missiles
    this.sMissiles = [];

    return this
  }

  /**
   * Blows up all enemies and clears all ship missiles
   *
   * @returns {Game}
   */
  blowUpAllEnemies(): Game {
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].type === EntityTypeEnums.EXPLOSION) continue

      this.enemies[i].inPlay = false
      this.explodeEntity(this.enemies[i] as BaseEnemySprite | AsteroidSprite)
    }

    return this
  }

  /**
   * Spawns the ship into the new level
   *
   * @returns {Game}
   */
  spawnShipIntoNewLevel(): Game {
    // Recover one health if ship health is less than 3
    if (this.ship!.health < 3) {
      this.ship!.health += 1;
      // Update React state via callback
      this.setHealthState(this.ship!.health);
    }

    // Respawn the ship
    this.ship!.respawnTime = 0
    this.ship!.inPlay = false
    this.ship!.respawn()

    return this
  }

  /**
   * Updates the level variables for a new level
   *
   * @returns {Game}
   */
  updateLevelVariablesForNewLevel(): Game {
    // Increment level variable
    this.level += 1;
    this.levelStep = 0;
    // Mark variable to draw level on the sreen
    this.levelMessage = 0;
    // Update React state via callback
    this.setLevelState(this.level);
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
   * from frame function.
   *
   * @returns {Game}
   */
  drawGameScreen(): Game {
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
  clearScreenForNewFrame(): Game {
    this.gameCtx!.clearRect(0, 0, GameConsts.GAME_WIDTH, GameConsts.GAME_HEIGHT)

    return this
  }

  /**
   * Draws the ship sprite placement for the current frame
   *
   * @returns {Game}
   */
  drawShip(): Game {
    this.ship!.inPlay
      ? this.ship!.draw()
      : this.ship!.respawn();

    return this
  }

  /**
   * Draws the ship missile sprite placements for the current frame
   *
   * @returns {Game}
   */
  drawShipMissiles(): Game {
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
  drawEnemies(): Game {
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
  drawLevelMessage(): Game {
    if (this.level <= 10) {
      if (this.levelMessage < 75) {
        this.gameCtx!.font = '50px \'Sarpanch\'';
        this.gameCtx!.fillStyle = '#009999'
        this.gameCtx!.textAlign = 'center';
        this.gameCtx!.fillText('Level: ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
        this.levelMessage += 1;
      }

      return this
    }
    if (this.level === 11) {
      if (this.levelMessage < 75) {
        this.gameCtx!.font = '75px \'Sarpanch\'';
        this.gameCtx!.fillStyle = '#CD5C5C'
        this.gameCtx!.textAlign = 'center';
        this.gameCtx!.fillText('YOU WIN!!!', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
        this.gameCtx!.font = '50px \'Sarpanch\'';
        this.gameCtx!.textAlign = 'center';
        this.gameCtx!.fillText('Bonus Level ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 - 50);
        this.levelMessage += 1;
      }

      return this
    }

    if (this.levelMessage < 75) {
      this.gameCtx!.font = '75px \'Sarpanch\'';
      this.gameCtx!.fillStyle = '#CD5C5C'
      this.gameCtx!.textAlign = 'center';
      this.gameCtx!.fillText('Survive', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
      this.gameCtx!.font = '50px \'Sarpanch\'';
      this.gameCtx!.textAlign = 'center';
      this.gameCtx!.fillText('Bonus Level ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 - 50);
      this.levelMessage += 1;
    }

    return this
  }

  /**
   * Displays the game over screen, resets the game, and sets up the listener for the enter key to reset the game
   *
   * @returns {Game}
   */
  onGameOver(): Game {
    this.gameCtx!.clearRect(0, 0, GameConsts.GAME_WIDTH, GameConsts.GAME_HEIGHT);
    this.theme!.pause();
    this.theme!.currentTime = 0;
    this.gameCtx!.font = '50px \'Sarpanch\'';
    this.gameCtx!.fillStyle = '#009999'
    this.gameCtx!.textAlign = 'center';
    this.gameCtx!.fillText('Game Over', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 - 60);
    this.gameCtx!.fillText('Level ' + this.level, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2);
    this.gameCtx!.fillText('Score: '+ this.score, GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 + 45);
    this.gameCtx!.font = '25px \'Sarpanch\'';
    this.gameCtx!.fillText('Hit enter to play again', GameConsts.GAME_WIDTH/2, GameConsts.GAME_HEIGHT/2 + 95);
    document.addEventListener('keydown', this.resetCall.bind(this));

    return this
  }

  /**
   * Generates and applies the game screen to the #main div
   *
   * @returns {<canvas> gameContext}
   */
  pinGame(): CanvasRenderingContext2D {
    // Remove existing canvas if it exists
    const existingCanvas = document.getElementById('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    this.gameCanvas = document.createElement('canvas');
    this.gameCanvas.width = GameConsts.GAME_WIDTH;
    this.gameCanvas.height = GameConsts.GAME_HEIGHT;
    this.gameCanvas.id = 'canvas';
    this.gameCtx = this.gameCanvas.getContext('2d')!;
    if (this.gameDiv) {
      this.gameDiv.appendChild(this.gameCanvas);
    }

    return this.gameCtx;
  }

  /**
   * Resets the game when the enter key is pressed in the game over screen
   *
   * @param {Event} event - The key event
   *
   * @returns {Game}
   */
  resetCall = (event: KeyboardEvent): Game => {
    if (event.key === 'Enter') {
      return this.resetGame.bind(this)();
    }

    return this
  }

  /**
   * Resets all game variables when reset command made
   *
   * @returns {Game}
   */
  resetGame = (): Game => {
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
    // Update React state via callback
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
    this.score = 0;
    this.gameOver = false;
    // Update React state via callbacks
    this.setScoreState(0);
    this.setLevelState(1);
    this.setHealthState(3);

    this.sounds.rez.play();
    this.playTheme();

    //clear canvas for a new canvas to be drawn and pinned
    this.gameCanvas!.remove();

    //pin new canvas
    this.pinGame();

    //reset default ship placement
    this.ship = null;
    this.ship = EntityFactory.create(this.gameCtx!, EntityTypeEnums.SHIP) as ShipSprite;
    this.ship.respawn();
    // Create new SoundManager singleton instance
    new SoundManager();

    return this
  }

  /**
   * Sets up a listener to repeat the theme music when it ends
   *
   * @returns {Game}
   */
  setupThemeRepeatListener = (): Game => {
    this.theme!.addEventListener('ended', (): Game => {
      this.theme!.currentTime = 0;

      return this.playTheme.bind(this)();
    }, false);

    return this
  }
}
