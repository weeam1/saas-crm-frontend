import { WHATSAPP_EVENTS } from './types';

export const eventHandlers = {
	[WHATSAPP_EVENTS.QR_CODE]: (state, payload) => ({
		...state,
		qr: payload?.qrCode,
	}),
	[WHATSAPP_EVENTS.AUTH_FAIL]: (state, payload) => ({
		...state,
		error: payload,
	}),
	[WHATSAPP_EVENTS.AUTHENTICATED]: (state) => ({
		...state,
		isAuthenticated: true,
	}),
	[WHATSAPP_EVENTS.READY]: (state) => ({
		...state,
		isReady: true,
	}),
	[WHATSAPP_EVENTS.FAIL]: (state, payload) => ({
		...state,
		error: payload,
	}),
	[WHATSAPP_EVENTS.NEW_MESSAGE]: (state, payload) => ({
		...state,
		messages: [...state.messages, payload],
	}),
};
