import Mp3 from '../js/Mp3.js';
import SoundDict from '../js/Dicts/SoundDict.js';
import ThemeDict from '../js/Dicts/ThemeDict.js';

// Sound Manager - Centralized sound management pattern
// This pattern provides a clean way to manage multiple sounds
class SoundManager {
    constructor() {
      this.sounds = {};
      this.theme = null;
      this.baseUrl = 'https://raw.githubusercontent.com/1ntellijosh/1ntellijosh.github.io/master/music%20and%20sounds/';
      
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
    loadSounds(config) {
      this.loadMp3(SoundDict);

      return this;
    }

    /**
     * Loads the theme
     *
     * @param {string} themeName - The name of the theme to load
     *
     * @returns {Audio} - The Audio object.
     */
    loadTheme(themeName) {
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
    loadAudio(config) {
      return new Audio(config.path);
    }

    /**
     * Loads the mp3
     *
     * @param {Object} soundDict - The sound dictionary
     *
     * @returns {SoundManager} - The SoundManager object.
     */
    loadMp3(soundDict) {
      for (const [name, config] of Object.entries(soundDict)) {
        this.sounds[name] = new Mp3(config.path, config.noOverlap ? 1 : 5);
      }

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
    play(name) {
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
    stop(name) {
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
    get(name) {
      if (!this.sounds[name]) throw new Error(`Sound ${name} not found`)
      
      return this.sounds[name];
    }
}

export default SoundManager;