/**
 * This class is used to load and play mp3 files in the browser.
 * Uses an audio pool pattern to allow overlapping sounds.
 *
 * @param {string} file - The path to the mp3 file.
 * @param {number} poolSize - Number of audio instances to create for overlapping playback (default: 5)
 * @returns {Mp3} - The Mp3 object.
 *
 * @since abstract--JP
 */

export default class Mp3 {
  file: string;
  poolSize: number;
  pool: HTMLAudioElement[];
  currentIndex: number;
  mp3: HTMLAudioElement;

  constructor(file: string, poolSize: number = 5) {
    this.file = file;
    this.poolSize = poolSize;
    this.pool = [];
    this.currentIndex = 0;
    
    // Create a pool of audio elements for overlapping playback
    for (let i = 0; i < poolSize; i++) {
      const audio = document.createElement("audio");
      audio.src = file;
      audio.setAttribute("preload", "auto");
      audio.setAttribute("controls", "none");
      audio.style.display = "none";
      
      // Add error handling for loading issues
      audio.addEventListener('error', (e) => {
        console.warn(`Audio loading error for ${file}:`, e);
      });
      
      document.body.appendChild(audio);
      this.pool.push(audio);
    }
    
    // Keep reference to first element for backward compatibility
    this.mp3 = this.pool[0];
  }

  /**
   * Plays the mp3 file using the next available audio instance in the pool
   * This allows multiple overlapping instances of the same sound
   *
   * @returns {Mp3} - The Mp3 object.
   */
  play(): Mp3 {
    if (this.poolSize === 1) {
      this.mp3.play().catch(err => {
        console.warn('Audio play failed:', err);
      });

      return this;
    }

    // Find an available (paused) audio instance, or use the next one
    let audio = null;
    
    // First, try to find a paused instance
    for (let i = 0; i < this.poolSize; i++) {
      const index = (this.currentIndex + i) % this.poolSize;
      const candidate = this.pool[index];
      
      if (candidate.paused || candidate.ended) {
        audio = candidate;
        this.currentIndex = (index + 1) % this.poolSize;
        break;
      }
    }
    
    // If all are playing, use round-robin and reset the oldest
    if (!audio) {
      audio = this.pool[this.currentIndex];
      audio.currentTime = 0; // Reset to beginning
      this.currentIndex = (this.currentIndex + 1) % this.poolSize;
    }
    
    // Reset to beginning before playing
    audio.currentTime = 0;
    
    // Check if audio source is loaded
    if (audio.readyState === 0) {
      // Audio not loaded yet, wait for it
      audio.load();
    }
    
    // Play the sound
    audio.play().catch(err => {
      // Handle autoplay restrictions and loading errors gracefully
      if (err.name !== 'NotAllowedError') {
        console.warn('Audio play failed:', err);
      }
    });

    return this;
  }

  /**
   * Stops all instances of the mp3 file
   *
   * @returns {Mp3} - The Mp3 object.
   */
  stop(): Mp3 {
    if (this.poolSize === 1) {
      this.mp3.pause()

      return this
    }

    // Stop all instances in the pool
    this.pool.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    return this;
  }
}
