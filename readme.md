# StarFighter, a 2D Space Shooter

A game I made learning HTML canvas element and its draw/ctx functions. The game runs by "clearing and redrawing" the game canvas on every new "frame" using setInterval. On each frame, sprites are moved to new positions, missiles are fired and moved to new positions, collisions are detected, and points and health are incremented and decremented.

### Play StarFighter, click [HERE](https://1ntellijosh.github.io/)

#### Game Details:
- Arrow keys to move, and spacebar to shoot.
- Run out of health bars, game over.
- Progress a level and you are granted one health bar. 
- You must get through level 10 to win
  - The game will continue to go and get harder with each level.
- For every 1000 points you earn without dying, your gun upgrades to a new gun power level.
  - Getting hit will lower your gun upgrade level by one.


## Built With:

- Vite
- NodeJs
- React
- Typescript

## How to Run

#### Local machine (Opens at `http://localhost:5173`)
```bash
npm run dev
```
#### Production Build (Creates optimized build in `dist/` folder)
  ```bash
  npm run build
  ```


## Future Goals:

- Database for game data (currently served from dicts and enums), high scores, etc
- High score page
- Dockerize the app
- Setup Ansible scripts to deploy to DigitalOcean or AWS from Github actions
- SCSS variables
- Scripted Levels and boss fights
- More Enemies  
- Spread Weapon Upgrades  
- Volume Control

## Credits

### Sound Credits:

#### [ZapSplat](https://www.zapsplat.com)
[Standard License](https://www.zapsplat.com/license-type/standard-license/) | [International license](https://www.zapsplat.com/license-type/cc-attribution-4-0-international/)
  - zapsplat_multimedia_game_lose_negative_004.mp3
  - multimedia_retro_game_ping.mp3
  - leisure_video_game_retro_laser_gun_fire_003.mp3
  - zapsplat_multimedia_retro_game_explode_disintergrate_17657.mp3
  - zapsplat_multimedia_game_one_up_extra_life_005.mp3

#### [Morten Barfod Søegaard at littlerobotsoundfactory.com](www.littlerobotsoundfactory.com)
- little_robot_sound_factory_Explosion_03.mp3
- little_robot_sound_factory_Hit_00.mp3
- little_robot_sound_factory_Hit_01 (1).mp3
- little_robot_sound_factory_Shoot_01.mp3

#### [Subspace Audio at OpenGameArt](https://opengameart.org/content/512-sound-effects-8-bit-style)
 - sfx_wpn_machinegun_loop9.wav

#### [Sounds.com (Pro membership)](sounds.com)
 - Sfx RVGSE1 Bleep 1.wav

*sounds.com relative use rights are as follows:*

    2.1: Subject to the restrictions set out in these Terms, we hereby grant you a limited, non-exclusive, non-transferable, perpetual, worldwide right to use any Audio File you download from the Service solely as incorporated into a musical work created by you (“Your Music”).

    2.2: You may use the Audio Files as incorporated into Your Music in nearly any work (commercial or non-commercial), including music, sound design, feature films, broadcasting, commercials, industrial, educational videos, multimedia, games, merchandise, and the internet.

    2.6: You shall own all intellectual property rights in all Your Music incorporating any of the Audio Files, provided, however, that you shall not own any underlying Audio Files incorporated into Your Music.

### Game Sprite Image Credits:

- [Arboris at deviantart.com](https://arboris.deviantart.com/art/Spaceship-sprites-43030167)
- [OpenGameArt](https://opengameart.org/content/space-ship-building-bits-volume-1)
