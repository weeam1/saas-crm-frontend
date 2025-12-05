/* eslint-disable no-undef */
export default class SipAudioElements {
	#ringing;
	#ringBack;
	#failed;
	#busy;
	#remote;
	#hungup;
	#localHungup;

	constructor() {
		this.#ringing = this.getAudio('audios/ringing.mp3');
		this.#ringing.loop = true;
		this.#ringing.volume = 0.8;

		this.#ringBack = this.getAudio('audios/us-ringback.mp3');
		this.#ringBack.loop = true;
		this.#ringBack.volume = 0.8;

		this.#failed = this.getAudio('audios/call-failed.mp3');
		this.#failed.volume = 0.3;

		this.#busy = this.getAudio('audios/us-busy-signal.mp3');
		this.#busy.volume = 0.3;

		this.#hungup = this.getAudio('audios/remote-party-hungup-tone.mp3');
		this.#hungup.volume = 0.3;

		this.#localHungup = this.getAudio('audios/local-party-hungup-tone.mp3');
		this.#localHungup.volume = 0.3;

		this.#remote = new Audio();
	}

	getAudio(path) {
		let audioURL;

		if (
			typeof chrome !== 'undefined' &&
			chrome.runtime &&
			chrome.runtime.getURL
		) {
			audioURL = chrome.runtime.getURL(path);
		} else {
			audioURL = `/${path}`;
		}

		return new Audio(audioURL);
	}

	playLocalHungup(volume) {
		this.pauseRingback();
		this.pauseRinging();
		if (volume) {
			this.#localHungup.volume = volume;
		}
		this.#localHungup.play();
	}

	playRinging(volume) {
		if (volume) {
			this.#ringing.volume = volume;
		}
		this.#ringing.play();
	}

	pauseRinging() {
		if (!this.#ringing.paused) {
			this.#ringing.pause();
		}
	}

	playRingback(volume) {
		if (volume) {
			this.#ringBack.volume = volume;
		}
		this.#ringBack.play();
	}

	pauseRingback() {
		if (!this.#ringBack.paused) {
			this.#ringBack.pause();
		}
	}

	playFailed(volume) {
		this.pauseRinging();
		this.pauseRingback();
		if (volume) {
			this.#failed.volume = volume;
		}
		this.#failed.play();
	}

	playRemotePartyHungup(volume) {
		if (volume) {
			this.#hungup.volume = volume;
		}
		this.#hungup.play();
	}

	playAnswer(volume) {
		this.pauseRinging();
		this.pauseRingback();
	}

	isRemoteAudioPaused() {
		return this.#remote.paused;
	}

	playRemote(stream) {
		this.#remote.srcObject = stream;
		this.#remote.play();
	}

	stopAll() {
		this.pauseRinging();
		this.pauseRingback();
	}

	isPLaying(audio) {
		return (
			audio.currentTime > 0 &&
			!audio.paused &&
			!audio.ended &&
			audio.readyState > audio.HAVE_CURRENT_DATA
		);
	}
}
