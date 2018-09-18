# StarFighter

## Created By: Joshua Payne

> "Game creation keeps on expanding, just like the Universe. That is why I keep making games." ― Hideo Kojima


### A 2d Space Shooter I made using JavaScript, JQuery HTML and CSS. I learned a great deal about how to use the canvas element on a web page with this.

### To win you must get through level 10, but the game will continue to go and get harder with more and more enemies. If you get 1000 points without dying, your gun upgrades and will again if you get another 1000. Run out of health, game over. Progress a level and you are granted one health bar.Arrow keys to move, and spacebar to shoot.


### Built With:

HTML  
JavaScript  
CSS  
JQuery  

### Check out StarFighter:

[https://1ntellijosh.github.io/]

### Challenges

The first great challenge was simply learning how to create the game engine. I had never worked with the HTML canvas element and its draw/ctx functions before. Once I got the concepts down, I could draw objects on the canvas. The next step was applying the setInterval method to the canvas draw methods, and you could create frames and therefore, animation. Finally, you map keyboard inputs to the direction the object (your ship) should go on the map, and the basic game engine was set. I was really able to run away with whatever I wanted to do from there.

The most challenging part of the game had to be the collision detection. This was handled in my hits() method in js/app.js. It was pretty hard to wrap my head around, but after drawing an, x-y graph on a piece of paper, I was able to write a method that would would return true if object 1's canvas range was overlapping with object 2's canvas range, and therefore a collision occurred. This method would would be called between every frame, and it would test every object on the screen with each-other to determine collisions. These collisions included asteroid to ship, ship bullet to asteroid, ship bullet to enemy ship, and enemy bullet to ship. Each collision would be handled differently, but the hits method triggered them all.

### Future Goals:

Scripted Levels  
More Enemies  
Spread Weapon Upgrades  
Volume Control  
Boss Fights  

### Credits:

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
/********   sprites taken from arboris at deviantArt - permission to use explicitely allowed: https://arboris.deviantart.com/art/Spaceship-sprites-43030167   ****/

/******sprites taken from opengameart.org and are free to use   ****/
//https://opengameart.org/content/space-ship-building-bits-volume-1
