const gameWidth = 650;
const gameHeight = 770;
let gameCanvas;
let gameCtx;

// let keys = [];
let lKey;
let rKey;
let uKey;
let dKey;
let sKey;

let rpmCount = 0;
let fireRate = 3;
let clip = 0;
let mag = 0;

let sMissiles = [];
let enemies = [];
let enemyTypes = ['b', 'c', 'd', 'e', 'f', 'g'];//could create new arrays of enemy combination types for levels later
typeAPlacements = [100, 200, 300, 400, 500];

let frameCount = 0;
let level = 1;
let spawnRange = 125;
let enemyBatch = [];
let spawnReady = true;
let spawnClip = 0;
let spawnTypeCount = 0;
let batchSlot = 0;
let roundCount = 0;
let asterLim = .012 ;

let ship_ast = new Image();
ship_ast.src = "sprite sheets/ship_ast sprites.gif";
/********   sprites taken from arboris at deviantArt - permission to use explicitely allowed: https://arboris.deviantart.com/art/Spaceship-sprites-43030167   ****/

let eSprite = new Image();
eSprite.src = "sprite sheets/enemysprites.png";
/******sprites taken from pics-about-space.com and are free to use   ****/

//     https://opengameart.org/content/space-ship-building-bits-volume-1

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
    missile.inPlay = missile.inBounds();
  }
  return missile;
}

var ship = {
  color: "green",
  sX: gameWidth/2,
  sY: 625,
  sWidth: 46,
  sHeight: 40,
  health: 3,
  speed: 9,
  draw: function() {
    gameCtx.drawImage(ship_ast, 35, 40, 50, 43, this.sX, this.sY, 50, 43);
  },
  fire: function(xSpd) {
    let missile = {
      x: this.sX + this.sWidth/2,
      y: this.sY,
      ySpd: -20,
      xSpd: xSpd,
      color: '#6495ED',
      height: 7,
      width: 3,
      inPlay: true
    }
    sMissiles.push(missileProcessor(missile));
  }
};


//enemieProcessor adds curve, appearance, fire rate according to type given
const Enemy = (enemy) => {
  // enemy = enemy || {};

  enemy.inBounds = function() {
    return enemy.x >= 0 && enemy.x <= gameWidth &&
      enemy.y >= 0 && enemy.y <= gameHeight;
  };

  enemy.draw = function() {

    if (this.type == 'a') {
      gameCtx.drawImage(ship_ast, 0, this.dStart, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    else {
      gameCtx.drawImage(eSprite, this.xStart, this.dStart, this.width, this.height, this.x, this.y, this.width, this.height);
    }

  };

  enemy.update = function() {

    this.x += this.xSpd;
    this.y += this.ySpd;

  if(this.type == 'g') {
    this.travel = this.travel + 1;
    if(this.travel > 90) {
      this.xSpd = 0;
      this.ySpd = 3.8;
      this.y += this.ySpd;
    }
    else if(this.travel > 35) {
      this.xSpd = -8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
    }
  }
  if(this.type == 'f') {
    this.travel = this.travel + 1;
    if(this.travel > 90) {
      this.xSpd = 0;
      this.ySpd = 3.8;
      this.y += this.ySpd;
    }
    else if(this.travel > 35) {
      this.xSpd = 8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
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
  }
  else if(this.type == 'b') {
    this.xSpd = 7 * Math.cos(this.arcTime * Math.PI / 200) - 9;
  }
  else {
    this.xSpd = 0;
  }

  this.arcTime++;

  this.inPlay = this.inBounds();
  };

  return enemy;
};


const drawBoard = () => {
gameCanvas = $("<canvas width='" + gameWidth + "' height='" + gameHeight + "'></canvas>").attr('id', 'canvas');
gameCtx = gameCanvas.get(0).getContext('2d');
gameCanvas.appendTo('body');

$(document).on('keydown', keyReader);
$(document).on('keyup', keyRelease);
}

const keyReader = (event) => {
  if (event.keyCode == 37) {
    lKey = true;
  }
  if (event.keyCode == 39 && ship.sX < 630) {
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
}

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
}

const moveUpdate = () => {

  if (lKey == true && ship.sX > 0) {
    ship.sX -= ship.speed;
  }
  if (rKey == true && ship.sX < 630) {
    ship.sX += ship.speed;
    }
  if (uKey == true&& ship.sY > 30) {
    ship.sY -= ship.speed;
    }
  if (dKey == true && ship.sY < 740) {
    ship.sY += ship.speed;
    }
}

const missileChamber = () => {

  if (sKey == true && rpmCount >= fireRate) {
    if (lKey == true) {
      let curve = -ship.speed/15;
      ship.fire(curve);
      rpmCount = 0;
      mag += 1;
    }
    else if (rKey == true) {
      let curve = ship.speed/15;
      ship.fire(curve);
      rpmCount = 0;
      mag += 1;
    }
    else {
      let curve = 0;
      ship.fire(curve);
      rpmCount = 0;
      mag += 1;
    }
  }
  if (mag > 3) {
    clip = 0;
    mag = 0;
  };
}

const enemySpawn = () => {
  //when game frames hit current spawnRange levels begin spawn process
  if (frameCount >= spawnRange && spawnReady == true) {
  //how many types to possibly spawn at once are randomly chosen by current level
  let possibleBatchNum = level + 1;
  //randomly spawn 1 to number-limit of enemyTypes
  let thisBatch = Math.floor(Math.random() * 3) + 1;
  //find which enemy type and make an array of types
    for (let i = 0; i < thisBatch; i++) {
     //find enemy type and put them in spawnBatch array for this enemy spawn
      enemyBatch.push(enemyTypes[Math.floor(Math.random() * 6)]);

   }
   spawnReady = false;
   spawnTypeCount = enemyBatch.length;
   batchSlot = 0;
   console.log('the '+ 'enemyBatch array is: ' + enemyBatch[0]);
   console.log('there is ' + spawnTypeCount + 'type in enemyBatch');
}

if (spawnClip >= 15 && enemyBatch.length > 0) {
    console.log('spawning at batchSlot ' + batchSlot);
    if(enemyBatch[batchSlot] == 'b') {
        let enemy = {
          type: 'b',
          x:615,
          y: 0,
          ySpd: 1.7,
          xSpd: 0,
          arcTime: 5,
          dStart:295,
          xStart:170,
          height: 39,
          width: 37,
          inPlay: true
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
          dStart:295,
          xStart:170,
          height: 39,
          width: 37,
          inPlay: true
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
          dStart:548,
          xStart:530,
          height: 60,
          width: 55,
          inPlay: true
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
          dStart:548,
          xStart:530,
          height: 60,
          width: 55,
          inPlay: true
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
          dStart:270,
          xStart:107,
          height: 34,
          width: 36,
          inPlay: true,
          travel: 1
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
          dStart:270,
          xStart:107,
          height: 34,
          width: 36,
          inPlay: true,
          travel: 1
        }
    enemies.push(Enemy(enemy));
    }
    console.log(enemies.length);
    batchSlot += 1;
    spawnClip = 0;
}

if (batchSlot >= spawnTypeCount && spawnReady == false) {

  batchSlot = 0;
  roundCount += 1;
}

if (roundCount >= 5 && spawnReady == false) {
  console.log('round count and spawn is done and resetting and sits at ' + roundCount);
  console.log('emptied');
  enemyBatch = [];
  spawnReady = true;
  frameCount = 0;
  roundCount = 0;
}
}//end of enemySpawn function

const asteroidSpawn = () => {

  if(Math.random() < asterLim) {
        let dinger = Math.floor(Math.random() * 6);
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
          width: 53,
          height: 55,
          inPlay: true
        }
      enemies.push(Enemy(asteroid));
  }

}//end of asteroidSpawn function

const updateMissiles = () => {
  for (let i = 0; i < sMissiles.length; i++) {
    sMissiles[i].update();
  };
  sMissiles = sMissiles.filter(function(missile) {
    return missile.inPlay;
  });
}//end of updateMissiles funtion

const enemyUpdater = () => {

  for (let i = 0; i < enemies.length; i++) {
      enemies[i].update();
  }

  enemies = enemies.filter(function(enemy) {
    return enemy.inPlay;
  });

}//end of enemyUpdater function

const hits = (ob1, ob2) => {

  return ob1.x < ob2.x + ob2.width && ob1.x + ob1.width > ob2.x && ob1.y < ob2.y + ob2.height && ob1.y + ob1.height > ob2.y;

}//end of hits function

const scoreDetector = () => {

  for (let = i = 0; i < sMissiles.length; i++) {
    for (let x = 0; i < enemies.length; x++) {
      if (hits(sMissiles[i], enemies[i])) {
        console.log('hit!!!!');
        sMissiles[i].inPlay = false;
      }
    }
  }

}

const update = () => {
  frameCount += 1;
  rpmCount += 1;
  clip += 1;
  spawnClip += 1;

  moveUpdate();

  if (clip > 8 && mag <= 4) {
    missileChamber();
  };

  //update ship missiles
  updateMissiles();

  //update enemy positions and actions
  enemyUpdater();

  enemySpawn();

  asteroidSpawn();

  scoreDetector();

};//update end

const draw = () => {
  //clear the screen for next frame
  gameCtx.clearRect(0, 0, gameWidth, gameHeight);
  //draw ship position
  ship.draw();
  //draw each ship missile
  for (let i = 0; i < sMissiles.length; i++) {
    sMissiles[i].draw();
  };

  //experimental
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].draw();
  };
}//end of draw function

const flash = () => {
  update();
  draw();
}//end of flash function

//game frame refresh rate settings
let fps = 25;
setInterval(flash, 1000/fps);

//on ready, draws a new gameboard
$(() => {

  drawBoard();

})
