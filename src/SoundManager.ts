import Mp3 from './Mp3';
import { SoundDict, Sound } from './Dicts/SoundDict';
import { ThemeDict, Theme } from './Dicts/ThemeDict';

/**
 * Sound Manager - Centralized sound management pattern
 * This pattern provides a clean way to manage multiple sounds
 * 
 * @since abstract--JP
 */

export default class SoundManager {
  sounds: { [key: string]: Mp3 };
  theme: HTMLAudioElement | null;
  baseUrl: string;

  constructor() {
    this.sounds = {};
    this.theme = null;
    this.baseUrl = ''; // No longer needed - using local paths
    
    // Load all sounds
    this.loadSounds(SoundDict);
  }
  
  /**
   * Loads the sounds
   *
   * @param {Object} config - The configuration object
   *
   * @returns {SoundManager} - The SoundManager object.
   */
  loadSounds(soundDict: SoundDict): SoundManager {
    for (const [name, config] of Object.entries(soundDict)) {
      const soundConfig = config as Sound;
      this.loadMp3(name, soundConfig.path, soundConfig.noOverlap);
    }

    return this;
  }

  /**
   * Loads the theme
   *
   * @param {string} themeName - The name of the theme to load
   *
   * @returns {Audio} - The Audio object.
   */
  loadTheme(themeName: string): HTMLAudioElement | null {
    this.theme = this.loadAudio(ThemeDict[themeName]);

    return this.theme;
  }

  /**
   * Loads the audio
   *
   * @param {Object} config - The configuration object
   *
   * @returns {Audio} - The Audio object.
   */
  loadAudio(config: Theme): HTMLAudioElement {
    // Encode the path to handle spaces and special characters in URLs
    const pathParts = config.path.split('/');
    const encodedPath = pathParts.map((segment, index) => {
      if (segment === '') return '';
      return encodeURIComponent(segment);
    }).join('/');
    return new Audio(encodedPath);
  }

  /**
   * Loads the mp3
   *
   * @param {Object} soundDict - The sound dictionary
   *
   * @returns {SoundManager} - The SoundManager object.
   */
  loadMp3(name: string, path: string, noOverlap: boolean): SoundManager {
      this.sounds[name] = new Mp3(path, noOverlap ? 1 : 5);

    return this;
  }
  
  /**
   * Convenience method to play a sound
   *
   * @param {string} name - The name of the sound to play
   *
   * @returns {Mp3} - The Mp3 object.
   * 
   * @throws {Error} - If the sound is not found/registered
   */
  play(name: string): SoundManager {
    if (!this.sounds[name]) throw new Error(`Sound ${name} not found`)

    this.sounds[name].play();

    return this;
  }
  
  /**
   * Convenience method to stop a sound
   *
   * @param {string} name - The name of the sound to stop
   *
   * @returns {Mp3} - The Mp3 object.
   * 
   * @throws {Error} - If the sound is not found/registered
   */
  stop(name: string): SoundManager {
    if (!this.sounds[name]) throw new Error(`Sound ${name} not found`)
    
    this.sounds[name].stop();

    return this;
  }
  
  /**
   * Direct access to sound objects (for advanced usage like theme.pause(), theme.currentTime, etc.)
   *
   * @param {string} name - The name of the sound to get
   *
   * @returns {Mp3} - The Mp3 object.
   * 
   * @throws {Error} - If the sound is not found/registered
   */
  get(name: string): Mp3 {
    if (!this.sounds[name]) throw new Error(`Sound ${name} not found`)
    
    return this.sounds[name];
  }
}
