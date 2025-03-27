import axios from 'axios';
import keys from 'config/keys';
import SHA256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

import { constant } from 'constant';

const { getApi } = require('services/api');

export const setAuthHeader = (headers) => {
	const token = localStorage.getItem('accessToken');

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
};

export const fetchAgentLeadsSats = async (userId) => {
	try {
		const { data } = await getApi(`api/lead/leads-stats/${userId}`);

		return data?.doc;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export const fetchAllUsers = async () => {
	try {
		const response = await getApi('api/v2/user/hierarchy?type=all');

		if (response?.status === 200) {
			return response.data?.doc || [];
		} else {
			throw new Error(
				`Unexpected response: ${response?.status} - ${response?.statusText}`
			);
		}
	} catch (error) {
		// Rethrow the error for handling in the consuming component
		throw new Error(
			error?.message || 'An unexpected error occurred while fetching users.'
		);
	}
};

export const getApplications = async (
	page,
	pageSize,
	query,
	server = 'baseUrl'
) => {
	try {
		const headers = {};
		setAuthHeader(headers);

		const url = !query
			? `${constant[server]}api/applications?page=${page}&limit=${pageSize}`
			: `${constant[server]}api/applications?page=${page}&limit=${pageSize}${query}`;

		const response = await axios.get(url, {
			headers,
		});

		if (response?.status === 200) {
			return response.data || [];
		} else {
			throw new Error(
				`Unexpected response: ${response?.status} - ${response?.statusText}`
			);
		}
	} catch (error) {
		throw new Error(
			error?.message ||
				'An unexpected error occurred while fetching candidates applications.'
		);
	}
};

// Hash function for security
const hash = (data) => {
	if (!data) return null;
	return SHA256(data?.trim()?.toLowerCase()).toString(encHex);
};

// send lead feedback
export const sendLeadFeedback = async ({ email, phone, status, action }) => {
	try {
		const url = `${keys.fbPixelAPI}/${keys.fbPixelId}/events?access_token=${keys.fbPixelToken}`;

		const eventNameMapMStatus = {
			interested: 'Lead_Interested',
			'not-interested': 'Lead_Not_Interested',
			junk: 'Lead_Unqualified',
			deal: 'Lead_Qualified',
		};

		const eventNameMapStatus = {
			pending: 'Lead_Unqualified',
			broker: 'Lead_Unqualified',
			will_attend_the_show: 'Lead_Qualified',
		};

		const event_name =
			action === 'MStatus'
				? eventNameMapMStatus[status]
				: eventNameMapStatus[status];

		const user_data = {};
		const hashedEmail = hash(email);
		const hashedPhone = hash(phone);

		if (hashedEmail) user_data.em = [hashedEmail];
		if (hashedPhone) user_data.ph = [hashedPhone];

		const eventData = {
			data: [
				{
					event_name,
					event_time: Math.floor(Date.now() / 1000),
					user_data,
					action_source: 'website',
				},
			],
		};

		console.log(eventData, status, email, phone);
		await axios.post(url, eventData);
		// console.log(`Lead feedback sent: ${event_name}`, data, eventData);
	} catch (error) {
		console.error(
			'Error sending lead feedback:',
			error.response?.data || error.message
		);
	}
};

export const sendLeadNotification = async (senderId, receiverId, leadData) => {
	try {
		const notifyData = {
			receiver_id: receiverId,
			lead_id: leadData?._id,
			lead_name: leadData?.leadName,
			sender_id: senderId,
		};

		await axios.post(`${keys.socketUrl}/notification`, notifyData);
	} catch (err) {
		console.log(err);
	}
};

export const readLeadNotification = async (id) => {
	try {
		await axios.post(`${keys.socketUrl}/read_notification`, { id });
	} catch (err) {
		console.log(err);
	}
};
