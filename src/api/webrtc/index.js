import { MSG_SOMETHING_WRONG } from './constants';
import { getActiveSettings } from 'storage';

const fetchTransport = (url, options) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(url, options);
			const transport = {
				headers: response.headers,
				status: response.status,
				json: {},
			};

			// Redirect unauthorized
			if (response.status === 401) {
				reject();
			}

			// API error handling
			if (response.status >= 400 && response.status <= 500) {
				try {
					const errJson = await response.json();
					reject({
						status: response.status,
						...errJson,
					});
				} catch (error) {
					console.error('Error parsing error response JSON:', error);
					reject({
						status: response.status,
						msg: MSG_SOMETHING_WRONG,
					});
				}
			}

			// API success handling
			if (response.status === 200 || response.status === 201) {
				if (options.headers['Content-Type'] === 'application/octet-stream') {
					const blob = await response.blob();
					transport.blob = blob;
				} else {
					const json = await response.json();
					transport.json = json;
				}
			}

			resolve(transport);
		} catch (error) {
			reject({
				status: 500,
				msg: error.message,
			});
		}
	});
};

const getAuthHeaders = () => {
	const advancedSettings = getActiveSettings();
	const token = advancedSettings?.decoded?.apiKey ?? null;

	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
};

export const getFetch = (url) => {
	return fetchTransport(url, { headers: getAuthHeaders() });
};

export const postFetch = (url, payload) => {
	return fetchTransport(url, {
		method: 'POST',
		...(payload && { body: JSON.stringify(payload) }),
		headers: getAuthHeaders(),
	});
};

export const putFetch = (url, payload) => {
	return fetchTransport(url, {
		method: 'PUT',
		body: JSON.stringify(payload),
		headers: getAuthHeaders(),
	});
};

export const deleteFetch = (url) => {
	return fetchTransport(url, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});
};

// GET Devices Users
export const getRegisteredUser = () => {
	const advancedSettings = getActiveSettings();
	return getFetch(
		`${advancedSettings?.decoded?.apiServer}/Accounts/${advancedSettings?.decoded?.accountSid}/RegisteredSipUsers`
	);
};

export const getApplications = () => {
	const advancedSettings = getActiveSettings();
	return getFetch(
		`${advancedSettings?.decoded?.apiServer}/Accounts/${advancedSettings?.decoded?.accountSid}/Applications`
	);
};

// validate user advanced credential
export const getAdvancedValidation = (apiServer, accountSid) => {
	return getFetch(`${apiServer}/Accounts/${accountSid}/Applications`);
};

export const getQueues = () => {
	const advancedSettings = getActiveSettings();
	return getFetch(
		`${advancedSettings?.decoded?.apiServer}/Accounts/${advancedSettings?.decoded?.accountSid}/Queues`
	);
};

export const getSelfRegisteredUser = (username) => {
	const advancedSettings = getActiveSettings();
	return getFetch(
		`${advancedSettings?.decoded?.apiServer}/Accounts/${advancedSettings?.decoded?.accountSid}/RegisteredSipUsers/${username}`
	);
};

export const getConferences = () => {
	const advancedSettings = getActiveSettings();
	return getFetch(
		`${advancedSettings?.decoded?.apiServer}/Accounts/${advancedSettings?.decoded?.accountSid}/Conferences`
	);
};

export const updateConferenceParticipantAction = (callSid, payload) => {
	const advancedSettings = getActiveSettings();
	return putFetch(
		`${advancedSettings?.decoded?.apiServer}/Accounts/${advancedSettings?.decoded?.accountSid}/Calls/${callSid}`,
		{
			conferenceParticipantAction: payload,
		}
	);
};
