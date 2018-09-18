/**
 * Sound dictionary - all sounds defined in one place
 * 
 * Sound effects use Mp3 class
 * "Sound effects obtained from https://www.zapsplat.com"
 * https://www.zapsplat.com/license-type/standard-license/

 * international license — Attribution — "You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.""
 * https://www.zapsplat.com/license-type/cc-attribution-4-0-international/
 * little robot sound factory:
 * Please make sure you attribute Morten's sounds if you use them in the following manner:
 * "Morten Barfod Søegaard, Little Robot Sound Factory"
 * Please provide this link where possible: www.littlerobotsoundfactory.com
 * little_robot_sound_factory_Explosion_03.mp3
 * little_robot_sound_factory_Hit_00.mp3
 * little_robot_sound_factory_Hit_01 (1).mp3
 * little_robot_sound_factory_Shoot_01.mp3

 * sfx_wpn_machinegun_loop9.wav
 * taken from opengame art and is free to use. Thank you Subspace Audio
 * https://opengameart.org/content/512-sound-effects-8-bit-style

 * Sfx RVGSE1 Bleep 1.wav
 * downloaded from sounds.com on pro membership. relative use rights are as follows:
 * 2.1Subject to the restrictions set out in these Terms, we hereby grant you a limited, non-exclusive, non-transferable, perpetual, worldwide right to use any Audio File you download from the Service solely as incorporated into a musical work created by you (“Your Music”).
 * 2.2You may use the Audio Files as incorporated into Your Music in nearly any work (commercial or non-commercial), including music, sound design, feature films, broadcasting, commercials, industrial, educational videos, multimedia, games, merchandise, and the internet.
 * 2.6You shall own all intellectual property rights in all Your Music incorporating any of the Audio Files, provided, however, that you shall not own any underlying Audio Files incorporated into Your Music.
 *
 * @returns {Object} - The SoundDict object.
 *
 * @since abstract--JP
 */

const baseUrl = 'https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/music%20and%20sounds/';

const SoundDict = {
    death: {
        type: 'mp3',
        path: baseUrl + 'zapsplat_multimedia_game_lose_negative_004.mp3',
        noOverlap: true,
    },
    tap: {
        type: 'mp3',
        path: baseUrl + 'little_robot_sound_factory_Hit_01%20(1).mp3',
        noOverlap: false,
    },
    blowUp: {
        type: 'mp3',
        path: baseUrl + 'little_robot_sound_factory_Explosion_03.mp3',
        noOverlap: false,
    },
    rez: {
        type: 'mp3',
        path: baseUrl + 'multimedia_retro_game_ping.mp3',
        noOverlap: true,
    },
    fgFire: {
        type: 'mp3',
        path: baseUrl + 'leisure_video_game_retro_laser_gun_fire_003.mp3',
        noOverlap: false,
    },
    bcFire: {   
        type: 'mp3',
        path: baseUrl + 'little_robot_sound_factory_Shoot_01.mp3',
        noOverlap: false,
    },
    shoot: {
        type: 'mp3',
        path: baseUrl + 'little_robot_sound_factory_Hit_00.mp3',
        noOverlap: false,
    },
    shoot2: {
        type: 'mp3',
        path: baseUrl + 'sfx_wpn_machinegun_loop9.wav',
        noOverlap: true,
    },
    shoot3: {
        type: 'mp3',
        path: baseUrl + 'Sfx%20RVGSE1%20Bleep%201.wav',
        noOverlap: true,
    },
    boost: {
        type: 'mp3',
        path: baseUrl + 'zapsplat_multimedia_game_one_up_extra_life_005.mp3',
        noOverlap: true,
    },
    nova: {
        type: 'mp3',
        path: baseUrl + 'zapsplat_multimedia_retro_game_explode_disintergrate_17657.mp3',
        noOverlap: true,
    }
};

export default SoundDict;
