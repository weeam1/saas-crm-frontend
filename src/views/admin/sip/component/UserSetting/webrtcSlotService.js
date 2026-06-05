import axios from 'axios';
import keys from 'config/keys';

// Create isolated axios instance
const webrtcClient = axios.create({
	baseURL: keys.sipApiUrl, // e.g. https://webrtc.example.com
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

// Silent error logger (extendable → Sentry, Datadog, etc.)
const logError = (error, context) => {
	if (keys.nodeENV === 'development') {
		console.error(`[WebRTC Slot Error] [${context}]`, error?.response || error);
	}
};

// Core request wrapper (silent execution)
const silentRequest = async (config, context) => {
	try {
		// Fire request but don't block UI
		const promise = webrtcClient(config);

		// Do not await → background execution
		promise.catch((err) => logError(err, context));

		return true; // immediate success signal (queued)
	} catch (error) {
		logError(error, context);
		return false;
	}
};

const webrtcSlotService = {
	/**
	 * Create slot user
	 */
	create: (payload) =>
		silentRequest(
			{
				method: 'POST',
				url: '/slot-user',
				data: payload,
			},
			'CREATE_SLOT_USER',
		),

	/**
	 * Update slot user
	 */
	update: (slotNumber, payload) =>
		silentRequest(
			{
				method: 'PUT',
				url: `/slot-user/${slotNumber}`,
				data: payload,
			},
			'UPDATE_SLOT_USER',
		),

	/**
	 * Delete slot user
	 */
	remove: (slotNumber) =>
		silentRequest(
			{
				method: 'DELETE',
				url: `/slot-user/${slotNumber}`,
			},
			'DELETE_SLOT_USER',
		),
};

export default webrtcSlotService;
