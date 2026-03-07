class SoundPlayer {
	constructor() {
		this.audioCache = new Map();
		this.currentlyPlaying = new Map();
		this.audioUnlocked = false;

		this.unlockAudio = this.unlockAudio.bind(this);

		document.addEventListener('click', this.unlockAudio, { once: true });
		document.addEventListener('keydown', this.unlockAudio, { once: true });
	}

	unlockAudio() {
		const audio = new Audio();
		audio.src = '/assets/notification.mp3';
		audio.volume = 0;

		audio
			.play()
			.then(() => {
				audio.pause();
				this.audioUnlocked = true;
			})
			.catch(() => {});
	}

	/**
	 * Play a sound from the assets folder
	 * @param {string} src - Path to the audio file (relative to public folder or import path)
	 * @param {Object} options - Optional configuration
	 * @param {number} options.volume - Volume level (0 to 1)
	 * @param {boolean} options.loop - Whether to loop the sound
	 * @param {string} options.id - Unique ID for the sound (useful for stopping specific sounds)
	 * @returns {Promise<HTMLAudioElement>} - The audio element being played
	 */
	play(src, options = {}) {
		const { volume = 1, loop = false, id = src } = options;

		try {
			// Validate input
			if (!src) {
				throw new Error('Audio source path is required');
			}

			// Validate file type
			const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
			const hasValidExtension = validExtensions.some((ext) =>
				src.toLowerCase().endsWith(ext),
			);

			if (!hasValidExtension) {
				console.warn(
					`Audio file may not be supported: ${src}. Supported formats: ${validExtensions.join(', ')}`,
				);
			}

			// Stop any existing instance of this sound if it's playing
			if (this.currentlyPlaying.has(id)) {
				this.stop(id);
			}

			// Get or create audio element
			let audio;
			if (this.audioCache.has(src)) {
				audio = this.audioCache.get(src).cloneNode();
			} else {
				audio = new Audio();

				// Handle different import scenarios
				if (src.startsWith('http')) {
					// External URL
					audio.src = src;
				} else if (src.startsWith('/')) {
					// Public folder path
					audio.src = src;
				} else {
					// Asset import - you'll need to import the file first
					try {
						// For Create React App
						if (typeof src === 'string' && src.includes('./assets/')) {
							// If using import, you'll pass the imported object
							audio.src = src;
						} else {
							// Try to load from public folder as fallback
							audio.src = `/assets/${src}`;
						}
					} catch (importError) {
						throw new Error(`Failed to load audio file: ${src}`);
					}
				}

				this.audioCache.set(src, audio);
			}

			// Configure audio
			audio.volume = Math.max(0, Math.min(1, volume));
			audio.loop = loop;

			// Set up event listeners
			const playPromise = new Promise((resolve, reject) => {
				const onCanPlay = () => {
					audio
						.play()
						.then(() => {
							this.currentlyPlaying.set(id, audio);
							resolve(audio);
						})
						.catch((error) => {
							reject(new Error(`Failed to play audio: ${error.message}`));
						});
					audio.removeEventListener('canplaythrough', onCanPlay);
				};

				const onError = () => {
					reject(
						new Error(
							`Failed to load audio: ${audio.error?.message || 'Unknown error'}`,
						),
					);
					audio.removeEventListener('error', onError);
				};

				audio.addEventListener('canplaythrough', onCanPlay, { once: true });
				audio.addEventListener('error', onError, { once: true });

				// Load the audio
				audio.load();
			});

			// Clean up when done playing
			audio.addEventListener('ended', () => {
				if (this.currentlyPlaying.get(id) === audio) {
					this.currentlyPlaying.delete(id);
				}
			});

			return playPromise;
		} catch (error) {
			console.error('SoundPlayer error:', error);
			throw error;
		}
	}

	/**
	 * Stop a specific sound
	 * @param {string} id - The ID of the sound to stop
	 */
	stop(id) {
		const audio = this.currentlyPlaying.get(id);
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
			this.currentlyPlaying.delete(id);
		}
	}

	/**
	 * Stop all currently playing sounds
	 */
	stopAll() {
		this.currentlyPlaying.forEach((audio, id) => {
			this.stop(id);
		});
	}

	/**
	 * Preload a sound into cache
	 * @param {string} src - Path to the audio file
	 */
	preload(src) {
		if (this.audioCache.has(src)) return;

		const audio = new Audio(src);
		audio.preload = 'auto';
		audio.load();

		this.audioCache.set(src, audio);
	}

	/**
	 * Check if a sound is currently playing
	 * @param {string} id - The ID of the sound
	 * @returns {boolean}
	 */
	isPlaying(id) {
		return this.currentlyPlaying.has(id);
	}

	/**
	 * Set volume for a playing sound
	 * @param {string} id - The ID of the sound
	 * @param {number} volume - Volume level (0 to 1)
	 */
	setVolume(id, volume) {
		const audio = this.currentlyPlaying.get(id);
		if (audio) {
			audio.volume = Math.max(0, Math.min(1, volume));
		}
	}
}

// Create a singleton instance
const soundPlayer = new SoundPlayer();

export default soundPlayer;
