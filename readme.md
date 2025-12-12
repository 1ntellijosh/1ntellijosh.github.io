# StarFighter

## Created By: Joshua Payne

> "Game creation keeps on expanding, just like the Universe. That is why I keep making games." ― Hideo Kojima


### A 2d Space Shooter

### To win you must get through level 10, but the game will continue to go and get harder with more and more enemies. For every 1000 points you earn without dying, your gun upgrades to a new level. Deaths will lower your gun upgrade level by one. Run out of health, game over. Progress a level and you are granted one health bar. Arrow keys to move, and spacebar to shoot.

## How to Run

### Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173` (or next available port)

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally


### Built With:

Vite
NodeJs
React
Typescript
CSS

### Check out StarFighter:

[https://1ntellijosh.github.io/]

### Challenges

I had never worked with the HTML canvas element and its draw/ctx functions before. Once I got the concepts down, I could draw objects on the canvas. The next step was applying the setInterval method to the canvas draw methods, and you could create frames and animation. Finally, you map keyboard inputs to the direction the object (your ship) should go on the map, and the basic game engine was set. I was really able to run away with whatever I wanted to do from there.

### Future Goals:

Database for game data (currently served from dicts and enums), high scores, etc
High score page
Dockerize the app
Setup Ansible scripts to deploy to DigitalOcean or AWS from Github actions
SCSS variables
Scripted Levels and boss fights
More Enemies  
Spread Weapon Upgrades  
Volume Control

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
