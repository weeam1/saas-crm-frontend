import * as events from 'events';
import { UA, WebSocketInterface, debug } from 'jssip';

import {
	SessionManager,
	SipAudioElements,
	SipSession,
	SipConstants,
	normalizeNumber,
} from './index';

export default class SipUA extends events.EventEmitter {
	#ua;
	#rtcConfig;
	#sessionManager;

	constructor(client, settings) {
		super();
		debug.enable('JsSIP:*');
		this.#sessionManager = new SessionManager();
		this.#rtcConfig = settings.pcConfig;
		this.#ua = new UA({
			uri: `sip:${client.username}`,
			password: client.password,
			display_name: client.name,
			sockets: [new WebSocketInterface(settings.wsUri)],
			register: settings.register,
			register_expires: 600,
		});
		this.#ua.on('connecting', (data) =>
			this.emit(SipConstants.UA_CONNECTING, { ...data, client })
		);
		this.#ua.on('connected', (data) =>
			this.emit(SipConstants.UA_CONNECTED, { ...data, client })
		);
		this.#ua.on('disconnected', (data) =>
			this.emit(SipConstants.UA_DISCONNECTED, {
				...data,
				client,
			})
		);
		this.#ua.on('registered', (data) =>
			this.emit(SipConstants.UA_REGISTERED, { ...data, client })
		);
		this.#ua.on('unregistered', (data) =>
			this.emit(SipConstants.UA_UNREGISTERED, {
				...data,
				client,
			})
		);
		this.#ua.on('registrationFailed', (data) =>
			this.emit(SipConstants.UA_UNREGISTERED, {
				...data,
				client,
			})
		);
		this.#ua.on('newRTCSession', (data) => {
			const rtcSession = data.session;
			const session = new SipSession(
				rtcSession,
				this.#rtcConfig,
				new SipAudioElements()
			);
			this.#sessionManager.newSession(session);
			session.on(SipConstants.SESSION_RINGING, (args) =>
				this.updateSession(SipConstants.SESSION_RINGING, session, args, client)
			);
			session.on(SipConstants.SESSION_ANSWERED, (args) =>
				this.updateSession(SipConstants.SESSION_ANSWERED, session, args, client)
			);
			session.on(SipConstants.SESSION_FAILED, (args) =>
				this.updateSession(SipConstants.SESSION_FAILED, session, args, client)
			);
			session.on(SipConstants.SESSION_ENDED, (args) =>
				this.updateSession(SipConstants.SESSION_ENDED, session, args, client)
			);
			session.on(SipConstants.SESSION_MUTED, (args) =>
				this.updateSession(SipConstants.SESSION_MUTED, session, args, client)
			);
			session.on(SipConstants.SESSION_HOLD, (args) =>
				this.updateSession(SipConstants.SESSION_HOLD, session, args, client)
			);
			session.on(SipConstants.SESSION_UNHOLD, (args) =>
				this.updateSession(SipConstants.SESSION_UNHOLD, session, args, client)
			);
			session.on(SipConstants.SESSION_ICE_READY, (args) =>
				this.updateSession(
					SipConstants.SESSION_ICE_READY,
					session,
					args,
					client
				)
			);
			session.on(SipConstants.SESSION_ACTIVE, (args) => {
				this.updateSession(SipConstants.SESSION_ACTIVE, session, args, client);
			});
			session.setActive(true);
		});
	}

	updateSession(field, session, args, client) {
		this.emit(field, { ...args, client, session });
		this.#sessionManager.updateSession(field, session, args);
	}

	start() {
		this.#ua.start();
		this.emit(SipConstants.UA_START);
	}

	stop() {
		this.#ua.stop();
		this.emit(SipConstants.UA_STOP);
	}

	call(number, customHeaders = []) {
		let normalizedNumber = normalizeNumber(number);
		this.#ua.call(normalizedNumber, {
			extraHeaders: [`X-Original-Number:${number}`].concat(customHeaders),
			mediaConstraints: { audio: true, video: false },
			pcConfig: this.#rtcConfig,
		});
	}

	isMuted(id) {
		if (id) {
			return this.#sessionManager.getSession(id).isMuted();
		} else {
			return this.#sessionManager.activeSession.isMuted();
		}
	}

	mute(id) {
		if (id) {
			this.#sessionManager.getSession(id).mute();
		} else {
			this.#sessionManager.activeSession.mute();
		}
	}

	unmute(id) {
		if (id) {
			this.#sessionManager.getSession(id).unmute();
		} else {
			this.#sessionManager.activeSession.unmute();
		}
	}

	isHolded(id) {
		if (id) {
			return this.#sessionManager.getSession(id).isHolded();
		} else {
			return this.#sessionManager.activeSession.isHolded();
		}
	}

	hold(id) {
		if (id) {
			this.#sessionManager.getSession(id).hold();
		} else {
			this.#sessionManager.activeSession.hold();
		}
	}

	unhold(id) {
		if (id) {
			this.#sessionManager.getSession(id).unhold();
		} else {
			this.#sessionManager.activeSession.unhold();
		}
	}

	dtmf(tone, id) {
		if (id) {
			this.#sessionManager.getSession(id).sendDtmf(tone);
		} else {
			this.#sessionManager.activeSession.sendDtmf(tone);
		}
	}

	terminate(sipCode, reason, id) {
		if (id) {
			this.#sessionManager.getSession(id).terminate(sipCode, reason);
		} else {
			this.#sessionManager.activeSession.terminate(sipCode, reason);
		}
	}

	answer(id) {
		if (id) {
			this.#sessionManager.getSession(id).answer();
		} else {
			this.#sessionManager.activeSession.answer();
		}
	}

	activate(id) {
		const session = this.#sessionManager.getSession(id);
		session.setActive(true);
	}

	isConnected() {
		return this.#ua.isConnected();
	}
}
