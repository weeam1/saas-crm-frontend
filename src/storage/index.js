import { Buffer } from 'buffer';
// Conference settings
const CONFERENCE_SETTINGS = 'ConferenceSettingsKey';

export const saveConferenceSettings = (settings) => {
	sessionStorage.setItem(CONFERENCE_SETTINGS, JSON.stringify(settings));
};

export const getConferenceSettings = () => {
	return JSON.parse(sessionStorage.getItem(CONFERENCE_SETTINGS) || '{}');
};

export const deleteConferenceSettings = () => {
	sessionStorage.removeItem(CONFERENCE_SETTINGS);
};

// Settings
const SETTINGS_KEY = 'SettingsKey';

export const saveSettings = (settings) => {
	const encoded = Buffer.from(JSON.stringify(settings), 'utf-8').toString(
		'base64'
	);

	const str = localStorage.getItem(SETTINGS_KEY);

	const parsed = str ? JSON.parse(str) : [];
	const newItem = {
		id: parsed.length + 1,
		encoded,
		active: parsed.length === 0,
	};

	localStorage.setItem(SETTINGS_KEY, JSON.stringify([...parsed, newItem]));
};

export const editSettings = (settings, id) => {
	const encoded = Buffer.from(JSON.stringify(settings), 'utf-8').toString(
		'base64'
	);

	const str = localStorage.getItem(SETTINGS_KEY);
	if (str) {
		const parsed = JSON.parse(str);

		// for edit:
		const newData = parsed.map((el) => {
			if (el.id === id)
				return {
					id: el.id,
					active: el.active,
					encoded: encoded,
				};
			else return el;
		});

		localStorage.setItem(SETTINGS_KEY, JSON.stringify(newData));
	}
};
export const setActiveSettings = (id) => {
	const str = localStorage.getItem(SETTINGS_KEY);

	if (str) {
		const parsed = JSON.parse(str);

		const newData = parsed.map((el) => ({
			...el,
			active: el.id === id,
		}));

		localStorage.setItem(SETTINGS_KEY, JSON.stringify(newData));
	}
};

export const deleteSettings = (id) => {
	const str = localStorage.getItem(SETTINGS_KEY);
	if (str) {
		const parsed = JSON.parse(str);

		const setting = parsed.find((s) => s.id === id);

		const newSettings = parsed.filter((el) => el.id !== id);

		// deleting active account, reassign active to next account
		if (setting?.active && newSettings.length) {
			newSettings[0].active = true;
		}

		localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
	}
};

export const getSettings = () => {
	const str = localStorage.getItem(SETTINGS_KEY);
	if (str) {
		const data = JSON.parse(str);
		const decoded = data.map((el) => {
			return {
				active: el.active,
				decoded: JSON.parse(
					Buffer.from(el.encoded, 'base64').toString('utf-8')
				),
				id: el.id,
			};
		});
		return decoded;
	}
	return [];
};

export const getActiveSettings = () => {
	const str = localStorage.getItem(SETTINGS_KEY);
	if (str) {
		const parsed = JSON.parse(str);

		const activeSettings = parsed.find((el) => el.active);
		if (activeSettings) {
			const decoded = {
				active: activeSettings?.active,
				decoded: JSON.parse(
					Buffer.from(activeSettings.encoded, 'base64').toString('utf-8')
				),
				id: activeSettings.id,
			};
			return decoded;
		}
	}
	return {};
};

// Advanced settings
const ADVANCED_SETTINGS_KET = 'AdvancedSettingsKey';

export const saveAddvancedSettings = (settings) => {
	const encoded = Buffer.from(JSON.stringify(settings), 'utf-8').toString(
		'base64'
	);

	const str = localStorage.getItem(ADVANCED_SETTINGS_KET);
	const data = str ? JSON.parse(str) : [];

	if (data.some((el) => el.encoded === encoded)) return;

	data.push({ encoded, active: data.length === 0, id: data.length + 1 });
	localStorage.setItem(ADVANCED_SETTINGS_KET, JSON.stringify(data));
};

export const getAdvancedSettings = () => {
	const str = localStorage.getItem(ADVANCED_SETTINGS_KET);

	if (str) {
		const data = JSON.parse(str);
		const decoded = data.map((el) => {
			return {
				active: el.active,
				decoded: JSON.parse(
					Buffer.from(el.encoded, 'base64').toString('utf-8')
				),
				id: el.id,
			};
		});
		return decoded;
	}
	return [];
};
export const getActiveAdvancedSettings = () => {
	const str = localStorage.getItem(ADVANCED_SETTINGS_KET);

	if (str) {
		const data = JSON.parse(str);
		const decoded = data.map((el) => {
			return {
				active: el.active,
				decoded: JSON.parse(
					Buffer.from(el.encoded, 'base64').toString('utf-8')
				),
				id: el.id,
			};
		});
		return decoded.find((el) => el.active);
	}
	return {};
};

// Call History
const historyKey = 'History';
const MAX_HISTORY_COUNT = 20;
export const saveCallHistory = (username, call) => {
	const str = localStorage.getItem(`${username}_${historyKey}`);
	let calls = [];
	if (str) {
		const c = Buffer.from(str, 'base64').toString('utf-8');
		calls = JSON.parse(c);
	}
	calls.unshift(call);

	if (calls.length > MAX_HISTORY_COUNT) {
		calls = calls.slice(0, MAX_HISTORY_COUNT);
	}
	const saveStr = JSON.stringify(calls);
	const encoded = Buffer.from(saveStr, 'utf-8').toString('base64');
	localStorage.setItem(`${username}_${historyKey}`, encoded);
};

export const isSaveCallHistory = (username, callSid, isSaved) => {
	const calls = getCallHistories(username).map((c) => {
		if (c.callSid === callSid) {
			return { ...c, isSaved };
		} else {
			return c;
		}
	});
	const saveStr = JSON.stringify(calls);
	const encoded = Buffer.from(saveStr, 'utf-8').toString('base64');
	localStorage.setItem(`${username}_${historyKey}`, encoded);
};

export const getCallHistories = (username) => {
	const str = localStorage.getItem(`${username}_${historyKey}`);
	if (str) {
		const c = Buffer.from(str, 'base64').toString('utf-8');
		return JSON.parse(c);
	}

	return [];
};

// Current Call
const currentCallKey = 'CurrentCall';
export const saveCurrentCall = (call) => {
	sessionStorage.setItem(currentCallKey, JSON.stringify(call));
};

export const getCurrentCall = () => {
	const str = sessionStorage.getItem(currentCallKey);
	if (str) {
		return JSON.parse(str);
	}
	return null;
};

export const deleteCurrentCall = () => {
	sessionStorage.removeItem(currentCallKey);
};
