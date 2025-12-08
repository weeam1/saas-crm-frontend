/* eslint-disable no-undef */
import { SipConstants } from 'lib/webrtc';
import { deleteWindowIdKey, getWindowIdKey, saveWindowIdKey } from './storage';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

export const formatPhoneNumber = (number) => {
	try {
		const phoneUtil = PhoneNumberUtil.getInstance();

		const phoneNumber = phoneUtil.parse(number, 'US');
		return phoneUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL);
	} catch (error) {
		console.log('Error formatting phone number:', error);
	}
	return number;
};

	
export const maskFormattedNumber = (formatted = "") =>
			formatted.replace(/(\d{5})$/, "*****");

export const openPhonePopup = () => {
	return new Promise((resolve) => {
		const runningPhoneWindowId = getWindowIdKey();
		if (runningPhoneWindowId) {
			chrome.windows.update(runningPhoneWindowId, { focused: true }, () => {
				if (chrome.runtime.lastError) {
					deleteWindowIdKey();
					initiateNewPhonePopup(resolve);
				}
				resolve(1);
			});
		} else {
			initiateNewPhonePopup(resolve);
		}
	});
};

const initiateNewPhonePopup = (callback) => {
	const cfg = {
		url: chrome.runtime.getURL('window/index.html'),
		width: 440,
		height: 720,
		focused: true,
		type: 'panel',
		state: 'normal',
	};
	chrome.windows.create(cfg, (w) => {
		callback(1);
		if (w && w.id) saveWindowIdKey(w.id);
	});
};

export const isSipClientRinging = (callStatus) => {
	return callStatus === SipConstants.SESSION_RINGING;
};

export const isSipClientAnswered = (callStatus) => {
	return callStatus === SipConstants.SESSION_ANSWERED;
};

export const isSipClientIdle = (callStatus) => {
	return (
		callStatus === SipConstants.SESSION_ENDED ||
		callStatus === SipConstants.SESSION_FAILED
	);
};

export const normalizeUrl = (input) => {
	// Extract the domain name
	const url = new URL(input.startsWith('http') ? input : `https://${input}`);

	// Return the fully formed URL
	return `${url.protocol}//${url.hostname}/api/v1`;
};
