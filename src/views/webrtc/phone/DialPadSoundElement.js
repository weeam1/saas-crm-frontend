/* eslint-disable no-undef */

export default class DialPadAudioElements {
	constructor() {
		this.keySounds = {};

		const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '#'];
		for (const i of arr) {
			let audioURL;

			// Check if we're in a Chrome extension
			if (
				typeof chrome !== 'undefined' &&
				chrome.runtime &&
				chrome.runtime.getURL
			) {
				audioURL = chrome.runtime.getURL(
					`audios/dtmf-${encodeURIComponent(i)}.mp3`
				);
			} else {
				// Web context
				audioURL = `/audios/dtmf-${encodeURIComponent(i)}.mp3`;
			}

			this.keySounds[i] = new Audio(audioURL);
			const audio = this.keySounds[i];
			if (audio) {
				audio.volume = 0.5;
			}
		}
	}

	playKeyTone(key) {
		const audio = this.keySounds[key];
		if (audio) {
			if (!audio.paused) {
				audio.pause();
				audio.currentTime = 0;
			}
			audio.play();
		}
	}
}
