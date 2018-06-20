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
let typeAPlacements = [75,75, 150, 150, 225, 225, 295, 360, 437, 437, 517, 517, 575, 575];

let frameCount = 0;
let level = 1;
let spawnRange = 125;
let enemyBatch = [];
let spawnReady = true;
let spawnClip = 0;
let spawnTypeCount = 0;
let batchSlot = 0;
let roundCount = 0;
let spawnLimit = 4;
let asterLim = .009;

let health;
let score = 0;

let ship_ast = new Image();
ship_ast.src = "sprite sheets/ship_ast sprites.gif";
/********   sprites taken from arboris at deviantArt - permission to use explicitely allowed: https://arboris.deviantart.com/art/Spaceship-sprites-43030167   ****/

let eSprite = new Image();
eSprite.src = "sprite sheets/shipsheetpartsdown.png";
/******sprites taken from opengameart.org and are free to use   ****/
//https://opengameart.org/content/space-ship-building-bits-volume-1

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
}

var ship = {
  x: gameWidth/2,
  y: 625,
  width: 46,
  height: 40,
  health: 3,
  speed: 9,
  inPlay: true,
  respawnTime: 100,
  movable: true,
  draw: function() {
    gameCtx.drawImage(ship_ast, 35, 40, 50, 43, this.x, this.y, 50, 43);
  },
  respawn: function() {
    if (this.respawnTime == 0) {
      this.movable = false;
      this.x = gameWidth/2;
      this.y = 730;
      this.health = this.health - 1;
      gameCtx.drawImage(ship_ast, 35, 40, 50, 43, this.x, this.y, 50, 43);
    }
    else if (this.respawnTime <= 80) {
      this.y -= 1;
      if (this.respawnTime > 7 && this.respawnTime < 12 ||
         this.respawnTime > 19 && this.respawnTime < 24 ||
         this.respawnTime > 31 && this.respawnTime < 36 ||
         this.respawnTime > 43 && this.respawnTime < 48 ||
         this.respawnTime > 56 && this.respawnTime < 61 ||
         this.respawnTime > 68 && this.respawnTime < 73) {
           // gameCtx.drawImage(ship_ast, 35, 40, 0, 0, this.x, this.y, 0, 0);

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
  fire: function(xSpd) {
    let missile = {
      x: this.x + this.width/2,
      y: this.y,
      ySpd: -22.5,
      xSpd: xSpd,
      color: '#6495ED',
      height: 7,
      width: 3,
      inPlay: true,
      type: 's'
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
        this.fire(3, 2, '#99ff33', 6, 4);
      }
    }
    else if (this.travel > 35) {
      this.xSpd = -8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
      if(Math.random() < .021) {
        this.fire(-.5, 3.1, '#99ff33', 6, 4);
      }
    }
    if (this.travel == 15) {
      if(Math.random() < .5) {
        this.fire(-.35, 3.1, '#99ff33', 6, 4);
      }
    }
    if (this.travel == 120) {
      if(Math.random() < .5) {
        this.fire(0, 3.1, '#99ff33', 6, 4);
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
        this.fire(-3, 2, '#99f f33', 6, 4);
      }
    }
    else if(this.travel > 35) {
      this.xSpd = 8;
      this.x += this.xSpd;
      this.ySpd = 1.2;
      if(Math.random() < .021) {
        this.fire(.5, 3.1, '#99ff33', 6, 4);
      }
    }
    if (this.travel == 15) {
      if(Math.random() < .5) {
        this.fire(.35, 3.1, '#99ff33', 6, 4);
      }
    }
    if (this.travel == 120) {
      if(Math.random() < .5) {
        this.fire(0, 3.1, '#99ff33', 6, 4);
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
        this.fire(0, 5, '#ff6600', 6, 4);
      }
    }
    else if(this.age % 15 == 0) {
      // console.log('maybe...');
      if(Math.random() < .15) {
        this.fire(0, 5, '#ff6600', 6, 4);
      }
    }
    this.age +=1;
  }
  else if(this.type == 'b') {
    this.xSpd = 7 * Math.cos(this.arcTime * Math.PI / 200) - 9;
    if (this.age > 75 && this.age % 20 == 0) {
      if(Math.random() < .20) {
        this.fire(0, 5, '#ff6600', 6, 4);
      }
    }
    else if(this.age % 15 == 0) {
      // console.log('maybe...');
      if(Math.random() < .15) {
        this.fire(0, 5, '#ff6600', 6, 4);
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
};


const drawBoard = () => {
gameCanvas = $("<canvas width='" + gameWidth + "' height='" + gameHeight + "'></canvas>").attr('id', 'canvas');
gameCtx = gameCanvas.get(0).getContext('2d');
gameCanvas.appendTo('#main');

scoreBoard= $("#score").attr('id', 'score');



$(document).on('keydown', keyReader);
$(document).on('keyup', keyRelease);
}

const keyReader = (event) => {
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
}

const missileChamber = () => {

  if (sKey == true && rpmCount >= fireRate && ship.movable == true) {
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

if (spawnClip >= 15 && enemyBatch.length > 0) {
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
          width: 58,
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
          width: 58,
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
          width: 44,
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
          width: 44,
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
          width: 42,
          inPlay: true,
          travel: 1,
          health: 1
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
          width: 42,
          inPlay: true,
          travel: 1,
          health: 1
        }
    enemies.push(Enemy(enemy));
    }
    // console.log(enemies.length);
    batchSlot += 1;
    spawnClip = 0;
}

if (batchSlot >= spawnTypeCount && spawnReady == false) {

  batchSlot = 0;
  roundCount += 1;
}

if (roundCount >= spawnLimit && spawnReady == false) {
  // console.log('round count and spawn is done and resetting and sits at ' + roundCount);
  // console.log('emptied');
  enemyBatch = [];
  spawnReady = true;
  frameCount = 0;
  roundCount = 0;
}
}//end of enemySpawn function

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

  return ob1.x < ob2.x + ob2.width &&
          ob1.x + ob1.width > ob2.x &&
          ob1.y < ob2.y + ob2.height &&
          ob1.y + ob1.height > ob2.y;

}//end of hits function

const scoreDetector = () => {

  for (let i = 0; i < sMissiles.length; i++) {
    if(sMissiles[i].type != 'e') {
      for (let x = 0; x < enemies.length; x++) {
        if(enemies[x].type != 'x') {
          if (hits(sMissiles[i], enemies[x])) {
            // console.log('hit!!');
            sMissiles[i].inPlay = false;
            if (enemies[x].type != 'a') {

              if (enemies[x].health == 1) {
                explode(enemies[x]);
                enemies[x].inPlay = false;
              }
              else {
                enemies[x].health -= 1;
              }
            }
          }
        }
      }
    }
    else if(sMissiles[i].type == 'e') {
          if (hits(sMissiles[i], ship) && ship.inPlay == true) {
            // console.log('hit!!');
            sMissiles[i].inPlay = false;
            explode(ship);
            ship.respawnTime = 0;
            ship.inPlay = false;
          }
    }
  }

  enemies.forEach(function(enemy) {
    if (hits(enemy, ship) && ship.inPlay == true) {
      if (enemy.type != 'a') {
        explode(enemy);
        enemy.inPlay = false;
        // enemy.inPlay = false;
      }
      explode(ship);
      ship.respawnTime = 0;
      ship.inPlay = false;
    }
  });
}


const update = () => {
  frameCount += 1;
  rpmCount += 1;
  clip += 1;
  spawnClip += 1;

  moveUpdate();

  if (clip > 6 && mag <= 4) {
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
