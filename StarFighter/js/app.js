//Written by Joshua Payne June 2018. Not intended for commercial use.

//Main game variables
const gameWidth = 650;
const gameHeight = 770;
let gameCanvas;
let gameCtx;

//keyboard keys to add listeners to
let lKey;
let rKey;
let uKey;
let dKey;
let sKey;
let enKey;

//gun fire rate modifiers
let rpmCount = 0;
let fireRate = 3;
let clip = 0;
let clipSize = 4;
let clipReady = 6;
let mag = 0;
let pointCount = 0;

//arrays for handling every enemy and bullet on screen, as well as enemy spawn types and asteroid placements
let sMissiles = [];
let enemies = [];
let enemyTypes = ['b', 'c', 'd', 'e', 'f', 'g'];//could create new arrays of enemy combination types for levels later
let typeAPlacements = [75,75, 150, 150, 225, 225, 295, 360, 437, 437, 517, 517, 575, 575];

//level modifiers changes as levels progress
let frameCount = 0;
let level = 1;
let levelLength = 1350;
let levelStep = 0;
let levelMessage = 75;
let spawnRange = 130;
let possibleBatchNum = 3;
let enemyBatch = [];
let spawnReady = true;
let spawnClip = 0;
let spawnClipLim = 15;
let spawnTypeCount = 0;
let batchSlot = 0;
let roundCount = 0;
let spawnLimit = 5;
let asterLim = .010;

//main score and game status
let score = 0;
let gameOver = false;
let gameWon = false;

//load sounds

//main theme
let theme = new Audio('music and sounds/Superboy.mp3');
//royalty free music purchased and licensed from dl-sounds.com to joshua payne 11:10pm 6/19/18

let death = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/zapsplat_multimedia_game_lose_negative_004.mp3');
let tap = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/little_robot_sound_factory_Hit_01%20(1).mp3');
let blowUp = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/little_robot_sound_factory_Explosion_03.mp3');
let rez = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/multimedia_retro_game_ping.mp3');
let fgFire = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/leisure_video_game_retro_laser_gun_fire_003.mp3');
let bcFire = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/little_robot_sound_factory_Shoot_01.mp3');
let shoot = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/little_robot_sound_factory_Hit_00.mp3');
let shoot2 = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/sfx_wpn_machinegun_loop9.wav');
let shoot3 = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/Sfx%20RVGSE1%20Bleep%201.wav');
let boost = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/zapsplat_multimedia_game_one_up_extra_life_005.mp3');
let nova = new mp3('https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/StarFighter/music%20and%20sounds/zapsplat_multimedia_retro_game_explode_disintergrate_17657.mp3');
// “Sound effects obtained from https://www.zapsplat.com“
// https://www.zapsplat.com/license-type/standard-license/
// zapsplat_multimedia_game_lose_negative_004.mp3
// multimedia_retro_game_ping.mp3
// leisure_video_game_retro_laser_gun_fire_003.mp3
// zapsplat_multimedia_retro_game_explode_disintergrate_17657.mp3
// zapsplat_multimedia_game_one_up_extra_life_005.mp3

// international license — Attribution — "You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.""
// https://www.zapsplat.com/license-type/cc-attribution-4-0-international/
// little robot sound factory:
// Please make sure you attribute Morten's sounds if you use them in the following manner:
// "Morten Barfod Søegaard, Little Robot Sound Factory"
// Please provide this link where possible: www.littlerobotsoundfactory.com
// little_robot_sound_factory_Explosion_03.mp3
// little_robot_sound_factory_Hit_00.mp3
// little_robot_sound_factory_Hit_01 (1).mp3
// little_robot_sound_factory_Shoot_01.mp3

// sfx_wpn_machinegun_loop9.wav
// taken from opengame art and is free to use. Thank you Subspace Audio
// https://opengameart.org/content/512-sound-effects-8-bit-style

// Sfx RVGSE1 Bleep 1.wav
//downloaded from sounds.com on pro membership. relative use rights are as follows:
// 2.1Subject to the restrictions set out in these Terms, we hereby grant you a limited, non-exclusive, non-transferable, perpetual, worldwide right to use any Audio File you download from the Service solely as incorporated into a musical work created by you (“Your Music”).
// 2.2You may use the Audio Files as incorporated into Your Music in nearly any work (commercial or non-commercial), including music, sound design, feature films, broadcasting, commercials, industrial, educational videos, multimedia, games, merchandise, and the internet.
// 2.6You shall own all intellectual property rights in all Your Music incorporating any of the Audio Files, provided, however, that you shall not own any underlying Audio Files incorporated into Your Music.

//images used for game sprite graphics
let ship_ast = new Image();
ship_ast.src = "sprite sheets/ship_ast sprites.gif";
/********   sprites taken from arboris at deviantArt - permission to use explicitely allowed: https://arboris.deviantart.com/art/Spaceship-sprites-43030167   ****/

let eSprite = new Image();
eSprite.src = "sprite sheets/shipsheetparts2-highercontrast.PNG";
/******sprites taken from opengameart.org and are free to use   ****/
//https://opengameart.org/content/space-ship-building-bits-volume-1

//used to load sound files into js script
function mp3(file) {
    this.mp3 = document.createElement("audio");
    this.mp3.src = file;
    this.mp3.setAttribute("preload", "auto");
    this.mp3.setAttribute("controls", "none");
    this.mp3.style.display = "none";
    document.body.appendChild(this.mp3);
    this.play = function(){
        this.mp3.play();
    }
    this.stop = function(){
        this.mp3.pause();
    }
}

//used to generate and apply the game screen to the #main div
const pinGame = () => {
  gameCanvas = $("<canvas width='" + gameWidth + "' height='" + gameHeight + "'></canvas>").attr('id', 'canvas');
  gameCtx = gameCanvas.get(0).getContext('2d');
  gameCanvas.appendTo('#gameDiv');
}//end of pinGame function

//draws the board set up and sets up game.
const drawBoard = function() {

//remove nongame divs from start screen
$('#start').remove();
$('.buttonWrap').remove();
$('h2').remove();

//displays game divs for health, level and score
$('#left').css('display', 'flex');
$('#right').css('display', 'flex');

//attach game screen to "main" div
pinGame();

//game frame refresh rate settings. also calls the game to run flash method, which handles all functions updating and drawin each screen
let fps = 25;
setInterval(flash, 1000/fps);

//play main theme on start
theme.play();

//grabs score level and helth elements to populate them
scoreBoard = $("#scoreB");
levelBoard = $('#levelB');
healthBoard = $('#health');

//listerners for keyboard strokes
$(document).on('keydown', keyReader);
$(document).on('keyup', keyRelease);

}//end of drawBoard function

//when game is in game over screen and not in regular play, resetCall will reach into script to manually call reset function
const resetCall = () => {
  if (event.keyCode == 13) {
    reset();
  }
}//end of resetCall function

//resets all game
const reset = () => {
  //reset gun variables -- might be irrelevant if ship fire powerup is not yet implemented
  rpmCount = 0;
  fireRate = 3;
  clip = 0;
  clipSize = 4;
  clipReady = 6;
  mag = 0;
  pointCount = 0;
  //reset onscreen enemies and missiles/lasers
  sMissiles = [];
  enemies = [];

  //reset game variables
  frameCount = 0;
  level = 1;
  levelStep = 0;
  levelMessage = 75;
  spawnRange = 130;
  enemyBatch = [];
  possibleBatchNum = 3;
  spawnReady = true;
  spawnClip = 0;
  spawnClipLim = 15;
  spawnTypeCount = 0;
  batchSlot = 0;
  roundCount = 0;
  spawnLimit = 5;
  asterLim = .010;

  //reset ship health and gun levels and send into respawn animation
  ship.health = 3;
  ship.gunLev = 1;
  score = 0;
  gameOver = false;

  rez.play();
  theme.play();

  //clear canvas for a new canvas to be drawn and pinned
  gameCanvas.remove();

  //pin new canvas
  pinGame();

  //reset default ship placement
  ship.x = gameWidth/2;
  ship.y = 625;

  //if player won the game, the score and level colors reset
  $('#scoreB').removeClass();
  $('#levelB').removeClass();

}// end of reset function

//handler for key strokes set the pressed down keys to true
const keyReader = (event) => {
  // console.log(event.keyCode);
  if (event.keyCode == 37) {
    lKey = true;
  }
  if (event.keyCode == 39 && ship.x < 630) {
    rKey = true;
  }
  if (event.keyCode == 32) {
    sKey = true;
  }
  if (event.keyCode == 40) {
    dKey = true;
  }
  if (event.keyCode == 38) {
    uKey = true;
  }
  if (event.keyCode == 13) {
    enKey = true;
  }
}
//handles the key strokes for released keys to false
const keyRelease = (event) => {
  if (event.keyCode == 37) {
    lKey = false;
  }
  if (event.keyCode == 39) {
    rKey = false;
  }
  if (event.keyCode == 32) {
    sKey = false;
  }
  if (event.keyCode == 38) {
    uKey = false;
  }
  if (event.keyCode == 40) {
    dKey = false;
  }
  if (event.keyCode == 13) {
    enKey = false;
  }
}
//update, the game responds with the actions the players put the key board. moevment, shooting, or reset key
const moveUpdate = () => {

  if (lKey == true && ship.x > 0 && ship.movable == true) {
    ship.x -= ship.speed;
  }
  if (rKey == true && ship.x < 630 && ship.movable == true) {
    ship.x += ship.speed;
    }
  if (uKey == true&& ship.y > 30 && ship.movable == true) {
    ship.y -= ship.speed;
    }
  if (dKey == true && ship.y < 740 && ship.movable == true) {
    ship.y += ship.speed;
    }
  if (enKey == true) {
    reset();
  }
}

//main ship object
var ship = {
  x: gameWidth/2,
  y: 625,
  width: 48,
  height: 40,
  health: 3,
  speed: 9,
  inPlay: true,
  gunLev: 1,
  respawnTime: 100,
  movable: true,
  //ship draw function
  draw: function() {
    gameCtx.drawImage(ship_ast, 35, 40, 50, 43, this.x, this.y, 50, 43);
  },
  //handles respawn animation and temporary invincibility
  respawn: function() {
    if (this.respawnTime == 0) {
      this.movable = false;
      this.x = gameWidth/2;
      this.y = 730;
      gameCtx.drawImage(ship_ast, 35, 40, 50, 43, this.x, this.y, 50, 43);
    }
    else if (this.respawnTime <= 80) {
      this.y -= 1;
      if (this.respawnTime > 7 && this.respawnTime < 12 ||
         this.respawnTime > 19 && this.respawnTime < 24 ||
         this.respawnTime > 31 && this.respawnTime < 36) {
           // gameCtx.drawImage(ship_ast, 35, 40, 0, 0, this.x, this.y, 0, 0);
           rez.play();
         }
      else if (this.respawnTime > 43 && this.respawnTime < 48 ||
      this.respawnTime > 56 && this.respawnTime < 61 ||
      this.respawnTime > 68 && this.respawnTime < 73) {

      }
      else {
        gameCtx.drawImage(ship_ast, 35, 40, 50, 43, this.x, this.y, 50, 43);
      }
    }
    else if (ship.respawnTime < 150) {
      this.movable = true;
      if (this.respawnTime > 80 && this.respawnTime < 85 ||
         this.respawnTime > 92 && this.respawnTime < 97 ||
         this.respawnTime > 103 && this.respawnTime < 107 ||
         this.respawnTime > 112 && this.respawnTime < 115 ||
         this.respawnTime > 119 && this.respawnTime < 123 ||
         this.respawnTime > 126 && this.respawnTime < 129 ||
         this.respawnTime > 131 && this.respawnTime < 133 ||
         this.respawnTime > 135 && this.respawnTime < 137 ||
         this.respawnTime > 139 && this.respawnTime < 141 ||
         this.respawnTime > 143 && this.respawnTime < 145 ||
         this.respawnTime > 147 && this.respawnTime < 149) {
      }
      else {
        gameCtx.drawImage(ship_ast, 35, 40, 50, 43, this.x, this.y, 50, 43);
      }
    }
    if (this.respawnTime == 150) {
      this.inPlay = true;
    }

    this.respawnTime += 1;
  },
  //handles ship fire. ship sends 's' type missiles so hit handlers can differenciate which missiles to process hitting what (enemy or friendly)
  fire: function(xSpd, color, w, h) {
    let missile = {
      x: this.x + this.width/2,
      y: this.y,
      ySpd: -22.5,
      xSpd: xSpd,
      color: color,
      height: h,
      width: w,
      inPlay: true,
      type: 's'
    }
    if (ship.gunLev == 1) {
      shoot.play();
    }
    else if (ship.gunLev == 2) {
      shoot2.play();
    }
    else {
      shoot3.play();
    }
    sMissiles.push(missileProcessor(missile));
  }
};//end of main ship object

//enemieProcessor adds curve path, appearance, fire rate according to type given
//takes in enemy object and applies functions:
// let enemy = {
//   type: 'f',
//   x: 100,
//   y: 0,
//   ySpd: 3,
//   xSpd: 0,
//   arcTime: 5,
//   dStart:100,
//   xStart:20,
//   height: 31,
//   width: 45,
//   inPlay: true,
//   travel: 1,
//   health: 2
// }
const Enemy = (enemy) => {
  //tester to see if enemies still inbounds. if not, delete from array
  enemy.inBounds = function() {
    return enemy.x >= 0 && enemy.x <= gameWidth &&
      enemy.y >= 0 && enemy.y <= gameHeight;
  };
  //each type has a different fire capability size and speed for lasers/missiles
  enemy.fire = function(x, y, c, h, w) {

    let laser = {
      x: this.x + this.width/2,
      y: this.y + this.height,
      ySpd: y,
      xSpd: x,
      color: c,
      height: h,
      width: w,
      inPlay: true,
      type: 'e'
    }
    sMissiles.push(missileProcessor(laser));
  }
  //each enemy is drawn in different sprites asteroids are type a explosions type x
  enemy.draw = function() {

    if (this.type == 'a') {
      gameCtx.drawImage(ship_ast, 0, this.dStart, this.width, this.height, this.x, this.y, this.width + 17, this.height + 17);
    }
    else if (this.type == 'x') {
      this.travel += 1;
       if (this.travel >= 16) {
        this.inPlay = false;
      }
      else if (this.travel >= 14) {
        gameCtx.drawImage(ship_ast, 51, 191, 55, 50, this.x + -1, this.y + 5, 55, 50);
      }
      else if (this.travel >= 12) {
        gameCtx.drawImage(ship_ast, 0, 192, 45, 44, this.x + 2, this.y + 8, 45, 44)
      }
      else if (this.travel >= 10) {
        gameCtx.drawImage(ship_ast, 74, 151, 39, 35, this.x + 5, this.y + 11, 39, 35)
      }
      else if (this.travel >= 7) {
        gameCtx.drawImage(ship_ast, 45, 158, 23, 23, this.x + 13, this.y + 16, 23, 23)
      }
      else if (this.travel >= 4) {
        gameCtx.drawImage(ship_ast, 20, 161, 18, 18, this.x + 14, this.y + 18, 18, 18)
      }
      else {
        gameCtx.drawImage(ship_ast, 5, 163, 8, 8, this.x + 20, this.y + 20, 8, 8);
      }
    }
    else {
      gameCtx.drawImage(eSprite, this.xStart, this.dStart, this.width, this.height, this.x, this.y, this.width, this.height);
    }

  };
  //enemy movement patterns and shots settings. enemies send 'e' type missiles
  enemy.update = function() {

    this.x += this.xSpd;
    this.y += this.ySpd;

  if(this.type == 'g') {
    this.travel = this.travel + 1;
    if(this.travel > 90) {
      this.xSpd = 0;
      this.ySpd = 3.8;
      this.y += this.ySpd;
      if(Math.random() < .018) {
        this.fire(3, 3.1, '#99ff33', 6, 4);
        fgFire.play();
      }
    }
    else if (this.travel > 35) {
      this.xSpd = -8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
      if(Math.random() < .021) {
        this.fire(-.5, 3.6, '#99ff33', 6, 4);
        fgFire.play();
      }
    }
    if (this.travel == 15) {
      if(Math.random() < .5) {
        this.fire(-.35, 3.6, '#99ff33', 6, 4);
        fgFire.play();
      }
    }
    if (this.travel == 120) {
      if(Math.random() < .5) {
        this.fire(0, 3.1, '#99ff33', 6, 4);
        fgFire.play();
      }
    }
    // if(Math.random() < .184) {
    //   this.fire();
    // }

    this.age +=1;
  }
  if(this.type == 'f') {
    this.travel = this.travel + 1;
    if(this.travel > 90) {
      this.xSpd = 0;
      this.ySpd = 3.8;
      this.y += this.ySpd;
      if(Math.random() < .018) {
        this.fire(-3, 3.1, '#99f f33', 6, 4);
        fgFire.play();
      }
    }
    else if(this.travel > 35) {
      this.xSpd = 8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
      if(Math.random() < .021) {
        this.fire(.5, 3.6, '#99ff33', 6, 4);
        fgFire.play();
      }
    }
    if (this.travel == 15) {
      if(Math.random() < .5) {
        this.fire(.35, 3.6, '#99ff33', 6, 4);
        fgFire.play();
      }
    }
    if (this.travel == 120) {
      if(Math.random() < .5) {
        this.fire(0, 3.1, '#99ff33', 6, 4);
        fgFire.play();
      }
    }
  }
  if(this.type == 'e') {
    this.xSpd = -8 * Math.cos(this.arcTime * Math.PI / 180) + 1.45;
  }
  else if (this.type == 'd') {
    this.xSpd = 8 * Math.cos(this.arcTime * Math.PI / 180) - 1.45;
  }
  else if(this.type == 'c') {
    this.xSpd = -7 * Math.cos(this.arcTime * Math.PI / 200) + 9;
    if (this.age > 75 && this.age % 20 == 0) {
      if(Math.random() < .20) {
        this.fire(0, 6, '#ff6600', 6, 4);
        bcFire.play();
      }
    }
    else if(this.age % 15 == 0) {
      // console.log('maybe...');
      if(Math.random() < .15) {
        this.fire(0, 6, '#ff6600', 6, 4);
        bcFire.play();
      }
    }
    this.age +=1;
  }
  else if(this.type == 'b') {
    this.xSpd = 7 * Math.cos(this.arcTime * Math.PI / 200) - 9;
    if (this.age > 75 && this.age % 20 == 0) {
      if(Math.random() < .20) {
        this.fire(0, 6, '#ff6600', 6, 4);
        bcFire.play();
      }
    }
    else if(this.age % 15 == 0) {
      // console.log('maybe...');
      if(Math.random() < .15) {
        this.fire(0, 6, '#ff6600', 6, 4);
        bcFire.play();
      }
    }
    this.age +=1;
  }
  else {
    this.xSpd = 0;
  }

  this.arcTime++;

  if (this.inPlay) {
    this.inPlay = this.inBounds();
  }

  };

  return enemy;
};//end of Enemy function/processor

//handler for fire rate between missiles and clip on the ship. called every update/flash
const missileChamber = () => {

  if (sKey == true && rpmCount >= fireRate && ship.movable == true) {
    let color;
    let width;
    let height;
    if(ship.gunLev == 1) {
      color = '#6495ED';
      width = 3;
      height = 7;
    }
    else if (ship.gunLev == 2) {
        color = '#00ff80';
        width = 3;
        height = 6;
      }
    else {
      color = '#ffff00';
      width = 5.5;
      height = 3.5;
    }
    if (lKey == true) {
      let curve = -ship.speed/15;
      ship.fire(curve, color, width, height);
      rpmCount = 0;
      mag += 1;
    }
    else if (rKey == true) {
      let curve = ship.speed/15;
      ship.fire(curve, color, width, height);
      rpmCount = 0;
      mag += 1;
    }
    else {
      let curve = 0;
      ship.fire(curve, color, width, height);
      rpmCount = 0;
      mag += 1;
    }
  }
  if (mag > clipSize) {
    clip = 0;
    mag = 0;
  };
}//end of missileChamber function

//missileProcessor takes in missile object:
// let missile = {
//   inBounds:
//   x:
//   y:
//   ySpd:
//   color:
//   height:
//   width:
// }
//adds functions to each missile object received, which updates positions, checks for boundries, redraws them on canvas, and returns updated objects to enemy/ship missile arrays
const missileProcessor = (missile) => {

  missile.inBounds = function() {
    return missile.y >= 0 && missile.y <= gameHeight;
  }

  missile.draw = function() {
    gameCtx.fillStyle = missile.color;
    gameCtx.fillRect(missile.x, missile.y, missile.width, missile.height);
  }

  missile.update = function() {
    missile.y += missile.ySpd;
    missile.x += missile.xSpd;
    if (missile.inPlay) {
      missile.inPlay = missile.inBounds();
    }
  }
  return missile;
}//end of missileProcessor function

//at spanrage between frames, baddies are spawned
const enemySpawn = () => {
  //when game frames hit current spawnRange levels begin spawn process
  if (frameCount >= spawnRange && spawnReady == true) {
  //randomly spawn 1 to number-limit of enemyTypes (possibleBatchNum)
  let thisBatch = Math.floor(Math.random() * possibleBatchNum) + 1;
  //find which enemy type and make an array of types
    for (let i = 0; i < thisBatch; i++) {
     //find enemy type and put them in spawnBatch array for this enemy spawn
      enemyBatch.push(enemyTypes[Math.floor(Math.random() * 6)]);
   }
   spawnReady = false;
   spawnTypeCount = enemyBatch.length;
   batchSlot = 0;
   // console.log('the '+ 'enemyBatch array is: ' + enemyBatch[0]);
   // console.log('there is ' + spawnTypeCount + 'type in enemyBatch');
}
//when each spawn is activated between the spawnClipLimit (adjusted per level) a new baddy through the spawn array is called. depending on type, that type is send to the Enemy Array to be processed and drawn, and added to the onscreen enemies array
if (spawnClip >= spawnClipLim && enemyBatch.length > 0) {
    // console.log('spawning at batchSlot ' + batchSlot);
    if(enemyBatch[batchSlot] == 'b') {
        let enemy = {
          type: 'b',
          x:615,
          y: 0,
          ySpd: 1.7,
          xSpd: 0,
          arcTime: 5,
          dStart:97,
          xStart:367,
          height: 41,
          width: 60,
          inPlay: true,
          age: 0,
          health: 3
        }
      enemies.push(Enemy(enemy));
    }
    if(enemyBatch[batchSlot] == 'c') {
        let enemy = {
          type: 'c',
          x: 35,
          y: 0,
          ySpd: 1.7,
          xSpd: 0,
          arcTime: 5,
          dStart:97,
          xStart:367,
          height: 41,
          width: 60,
          inPlay: true,
          age: 0,
          health: 3
        }
      enemies.push(Enemy(enemy));
    }
    if(enemyBatch[batchSlot] == 'd') {
        let enemy = {
          type: 'd',
          x: 250,
          y: 0,
          ySpd: 7,
          xSpd: 0,
          arcTime: 5,
          dStart:96,
          xStart:113,
          height: 44,
          width: 45,
          inPlay: true,
          health: 2
        }
      enemies.push(Enemy(enemy));
    }
    if(enemyBatch[batchSlot] == 'e') {
        let enemy = {
          type: 'e',
          x: 350,
          y: 0,
          ySpd: 7,
          xSpd: 0,
          arcTime: 5,
          dStart:96,
          xStart:113,
          height: 44,
          width: 45,
          inPlay: true,
          health: 2
        }
    enemies.push(Enemy(enemy));
    }
    if(enemyBatch[batchSlot] == 'f') {
        let enemy = {
          type: 'f',
          x: 100,
          y: 0,
          ySpd: 3,
          xSpd: 0,
          arcTime: 5,
          dStart:100,
          xStart:20,
          height: 31,
          width: 45,
          inPlay: true,
          travel: 1,
          health: 2
        }
    enemies.push(Enemy(enemy));
    }
    if(enemyBatch[batchSlot] == 'g') {
        let enemy = {
          type: 'g',
          x: 520,
          y: 0,
          ySpd: 3,
          xSpd: 0,
          arcTime: 5,
          dStart:100,
          xStart:20,
          height: 31,
          width: 45,
          inPlay: true,
          travel: 1,
          health: 2
        }
    enemies.push(Enemy(enemy));
    }
    // console.log(enemies.length);
    batchSlot += 1;
    spawnClip = 0;
}
//reset the round through the batch array - to be done the spawnLimit of times, increaed per level
if (batchSlot >= spawnTypeCount && spawnReady == false) {

  batchSlot = 0;
  roundCount += 1;
}
//handles and reset the spawnlimit variables and spawn window
if (roundCount >= spawnLimit && spawnReady == false) {
  // console.log('round count and spawn is done and resetting and sits at ' + roundCount);
  // console.log('emptied');
  enemyBatch = [];
  spawnReady = true;
  frameCount = 0;
  roundCount = 0;
}
}//end of enemySpawn function

//handler for random asteroid drops. asterLim variable increases as levels increase, and therefore astroid spawn liklihood increases
const asteroidSpawn = () => {

  if(Math.random() < asterLim) {
        let dinger = Math.floor(Math.random() * 15);
        let x = typeAPlacements[dinger];
        let asteroid = {
          type: 'a',
          x: x,
          y: 0,
          ySpd: 1.5,
          xSpd: 0,
          arcTime: 5,
          color: '#c0c0c0',
          dStart: 240,
          width: 57,
          height: 55,
          inPlay: true
        }
      enemies.push(Enemy(asteroid));
  }

}//end of asteroidSpawn function

//object sent to explode, function takes relevant variables and converts them to the Enemy function under type 'x' for explosion animation
const explode = (object) => {
  let explosion = {
    type: 'x',
    x: object.x,
    y: object.y,
    xSpd: 0,
    ySpd: 0,
    height: 34,
    width: 36,
    inPlay: true,
    travel: 1,
    arcTime: 5
  }
  // object.inPlay = false;
  enemies.push(Enemy(explosion));
}//end of explode function

//handler for missile placements and movements, enemy and friendly. called every flash/frame
const updateMissiles = () => {
  for (let i = 0; i < sMissiles.length; i++) {
    sMissiles[i].update();
  };
  sMissiles = sMissiles.filter(function(missile) {
    return missile.inPlay;
  });
}//end of updateMissiles funtion

//handler for enemy movment and inbounds checker. called ever flash/frame
const enemyUpdater = () => {

  for (let i = 0; i < enemies.length; i++) {
      enemies[i].update();
  }

  enemies = enemies.filter(function(enemy) {
    return enemy.inPlay;
  });

}//end of enemyUpdater function

//determines missile hits for both friend and enemy type missiles. called by scoreDetector
const hits = (ob1, ob2) => {

  return ob1.x < ob2.x + ob2.width &&
          ob1.x + ob1.width > ob2.x &&
          ob1.y < ob2.y + ob2.height &&
          ob1.y + ob1.height > ob2.y;

}//end of hits function

//handles all missiles hits and impacts
const scoreDetector = () => {
//checker for ship missiles and scores
  for (let i = 0; i < sMissiles.length; i++) {
    if(sMissiles[i].type != 'e') {
      for (let x = 0; x < enemies.length; x++) {
        if(enemies[x].type != 'x') {
          if (hits(sMissiles[i], enemies[x])) {
            // console.log('hit!!');
            tap.play();
            sMissiles[i].inPlay = false;
            if (enemies[x].type != 'a') {
              //if ship missiles hit
              if (enemies[x].health == 1) {
                blowUp.play();
                explode(enemies[x]);
                enemies[x].inPlay = false;
                if (enemies[x].type == 'b' || enemies[x].type == 'c') {
                  score += 30;
                  pointCount += 30;
                  console.log(pointCount);
                }
                else if (enemies[x].type == 'd' || enemies[x].type == 'e') {
                  score += 20;
                  pointCount += 20;
                  console.log(pointCount);
                }
                else if (enemies[x].type == 'f' || enemies[x].type == 'g') {
                  score += 25;
                  pointCount += 25;
                  console.log(pointCount);
                }
              }
              //docs enemy health if it is not at 1 and tap sound
              else {
                tap.play();
                enemies[x].health -= 1;
                score += 3;
                pointCount +=3;
                console.log(pointCount);
              }
            }
          }
        }
      }
    }
    //checks all enemy missiles placements and hits
    else if(sMissiles[i].type == 'e') {
          if (hits(sMissiles[i], ship) && ship.inPlay == true) {
            // console.log('hit!!');
            sMissiles[i].inPlay = false;
            blowUp.play();
            death.play();
            ship.health -= 1;
            explode(ship);
            ship.respawnTime = 0;
            ship.inPlay = false;
            ship.gunLev = 1;
            clipReady = 6;
            clipSize = 4;
            fireRate = 3;
            pointCount = 0;
          }
    }
  }
  //checks all enemy/ship collisions
  enemies.forEach(function(enemy) {
    if (hits(enemy, ship) && ship.inPlay == true) {
      if (enemy.type != 'a') {
        blowUp.play();
        explode(enemy);
        enemy.inPlay = false;
        // enemy.inPlay = false;
      }
      blowUp.play();
      death.play();
      ship.health -= 1;
      explode(ship);
      ship.respawnTime = 0;
      ship.inPlay = false;
      ship.gunLev = 1;
      clipReady = 6;
      clipSize = 4;
      fireRate = 3;
      pointCount = 0;
      console.log(pointCount);
    }
  });
}//end of scoreDetector function

//handler for weapon upgrades. weapons increase as score goes up without dying. this is the pointcount. if the player dies, they pointcount goes to 0. shceck every frame at update function
const weaponUp = () => {

    if (pointCount >= 1000 && ship.gunLev < 2) {
      ship.gunLev = 2;
      fireRate = 2;
      clipReady = 7;
      boost.play();
      console.log('ship.gunlev is now ' + ship.gunLev);
    }
    if (pointCount >= 2000 && ship.gunLev < 3) {
      ship.gunLev = 3;
      fireRate = 1;
      clipReady = 5;
      clipSize = 2;
      mag = 0;
      boost.play();
      console.log('ship.gunlev is now ' + ship.gunLev);
    }
}

//updates level score and health boards. called every flash/frame from update function
const updateBoards = function() {

  levelBoard.text(level);

  scoreBoard.empty();
  let newScore = $('<p>').text(score);
  scoreBoard.append(newScore);

  healthBoard.empty();
  for (let i = 0; i < ship.health; i++) {
    let healthDiv = $('<div>').attr('id', 'healthBar');
    healthDiv.appendTo('#health')
  }

}
//called ever flash. calls all handlers each frame called from flash method
const update = function() {
    //handles game over status variable
    if(ship.health == 0) {
      gameOver = true;
    }
    //increments all relevant frame to frame variables
    frameCount += 1;
    rpmCount += 1;
    clip += 1;
    spawnClip += 1;
    levelStep += 1;

    //calls for ship movement per keystrokes
    moveUpdate();

    //call the handler for weapon upgrades.
    if(ship.gunLev != 3) {
      weaponUp();
    }

    //counter between ship fires, when clip (adds up every frame) hits the clipready (reload limit) initiates fire
    if (clip > clipReady && mag <= clipSize) {
      missileChamber();
    };

    //update ship missiles
    updateMissiles();

    //update enemy positions and actions
    enemyUpdater();

    //checks enemy spawn status and spawns enemys when ready
    enemySpawn();

    //calls asteroid spawn status and deploys randomly
    asteroidSpawn();

    //calls for all impacts and missile/laser hits
    scoreDetector();

    //counter for level progression count. when levelStep hit levelLength, level up
    if(levelStep >= levelLength) {
        levelUp();
    }

};//update end

//called between level progression
const levelUp = () => {
  // console.log('leveling');
  //increment level variable
  level += 1;

  levelStep = 0;
  //blow up all enemy ships and clear bullets
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].type == 'b' ||
     enemies[i].type == 'c' ||
     enemies[i].type == 'a' ||
     enemies[i].type == 'd' ||
     enemies[i].type == 'e' ||
     enemies[i].type == 'f' ||
     enemies[i].type == 'g') {
        enemies[i].inPlay = false;
        explode(enemies[i]);
    }
  }
  sMissiles = [];

  //respawn ship and regain one health
  if(ship.health < 3) {
    ship.health += 1;
  }
  ship.respawnTime = 0;
  ship.inPlay = false;
  ship.respawn();
  //mark variable to draw level on the sreen
  levelMessage = 0;
  //reset relevant variables
  frameCount = 0;
  enemyBatch = [];
  spawnReady = true;
  spawnClip = 0;
  spawnTypeCount = 0;
  batchSlot = 0;
  roundCount = 0;
  spawnLimit = 5;

  //elevate difficulties
  //increase frequency a new batch is rung up
  if(spawnRange > 110) {
      spawnRange -= 10;
  }
  //increase amount of enemies spawn for each type per spawn
  possibleBatchNum +=1;
  //increase asteroid probability
  if(asterLim < .024) {
    asterLim += .002;
  }
  //increase enemy spawn rate
  if (spawnClipLim > 6) {
    spawnClipLim -= 1;
  }

  //play sound of enemies and asteroids clearing
  nova.play();
}//end of levelup function

//draws all enemy bullet and ship placements. also draws level message on level up. called every frame from flash function
const draw = () => {
  //clear the screen for next frame
  gameCtx.clearRect(0, 0, gameWidth, gameHeight);

    //draw ship position
    if(ship.inPlay) {
      ship.draw();
    }
    else {
      ship.respawn();
    }
    //draw each ship missile
    for (let i = 0; i < sMissiles.length; i++) {
      sMissiles[i].draw();
    };

    //experimental
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].draw();
    };
  //display level message on new level for 75 frames
  if (level <= 10) {
  if (levelMessage < 75) {
    gameCtx.font = '50px \'Sarpanch\'';
    gameCtx.fillStyle = '#009999'
    gameCtx.textAlign = 'center';
    gameCtx.fillText('Level: ' + level, gameWidth/2, gameHeight/2);
    levelMessage += 1;
  }
  }
  else if (level == 11) {
    if (levelMessage < 75) {
      gameCtx.font = '75px \'Sarpanch\'';
      gameCtx.fillStyle = '#CD5C5C'
      gameCtx.textAlign = 'center';
      gameCtx.fillText('YOU WIN!!!', gameWidth/2, gameHeight/2);
      gameCtx.font = '50px \'Sarpanch\'';
      gameCtx.textAlign = 'center';
      gameCtx.fillText('Bonus Level ' + level, gameWidth/2, gameHeight/2 - 50);
      levelMessage += 1;
      $('#scoreB').addClass('bonus');
      $('#levelB').addClass('bonus');
    }
  }
  else {
    if (levelMessage < 75) {
      gameCtx.font = '75px \'Sarpanch\'';
      gameCtx.fillStyle = '#CD5C5C'
      gameCtx.textAlign = 'center';
      gameCtx.fillText('Survive', gameWidth/2, gameHeight/2);
      gameCtx.font = '50px \'Sarpanch\'';
      gameCtx.textAlign = 'center';
      gameCtx.fillText('Bonus Level ' + level, gameWidth/2, gameHeight/2 - 50);
      levelMessage += 1;
    }
  }

}//end of draw function

//called every frame
const flash = () => {
  //if game over status is off, function as normal
  if (gameOver == false) {
    update();
    draw();
    updateBoards();
  }
  //if game over status is on, clear screen and display score and game over. set up listener for enter key to reset game (calls resetCall function)
  else {
    gameCtx.clearRect(0, 0, gameWidth, gameHeight);
    theme.pause();
    theme.currentTime = 0;
    gameCtx.font = '50px \'Sarpanch\'';
    gameCtx.fillStyle = '#009999'
    gameCtx.textAlign = 'center';
    gameCtx.fillText('Game Over', gameWidth/2, gameHeight/2 - 60);
    gameCtx.fillText('Level ' + level, gameWidth/2, gameHeight/2);
    gameCtx.fillText('Score: '+ score, gameWidth/2, gameHeight/2 + 45);
    gameCtx.font = '25px \'Sarpanch\'';
    gameCtx.fillText('Hit enter to play again', gameWidth/2, gameHeight/2 + 95);
    $(document).on('keydown', resetCall);
  }

}//end of flash function

$(() => {

  //on ready, draws a new gameboard
  $('#start').on('click', drawBoard);
  //sets up listener to repeat theme music when it ends
  theme.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);

})
