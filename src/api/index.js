import axios from 'axios';
import keys from 'config/keys';
import SHA256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

import { constant } from 'constant';

const { getApi } = require('services/api');

const server = 'baseUrl';

export const setAuthHeader = (headers) => {
	const token = localStorage.getItem('accessToken');

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
};

export const fetchAgentLeadsSats = async (
	userId,
	type = 'assigned',
	selectedLeads = 1
) => {
	try {
		const { data } = await getApi(
			`api/lead/leads-stats/${userId}?type=${type}&selectedLeads=${selectedLeads}`
		);

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
export const sendLeadFeedback = async ({
	email,
	phone,
	ip,
	fbclid,
	status,
	action,
}) => {
	try {
		const url = `${keys.fbPixelAPI}/${keys.fbPixelId}/events?access_token=${keys.fbPixelToken}`;

		const eventNameMapMStatus = {
			interested: 'Lead_Interested',
			'interested-buyer': 'Lead_Interested',
			'interested-seller': 'Lead_Interested',
			'secondary-request': 'Lead_Interested',
			'change-agent': 'Lead_Interested',
			'not-interested': 'Lead_Not_Interested',
			junk: 'Lead_Unqualified',
			deal: 'Lead_Qualified',
		};

		const eventNameMapStatus = {
			pending: 'Lead_Unqualified',
			broker: 'Lead_Unqualified',
			will_attend_the_show: 'Lead_Interested',
			// will_attend_the_show: 'Lead_Qualified',
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
		if (ip) user_data.client_ip_address = ip;
		if (fbclid) user_data.fbc = fbclid;

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

export const sendBulkLeadNotification = async (
	senderId,
	receiverIds,
	leads
) => {
	try {
		if (!receiverIds || typeof receiverIds !== 'object') {
			console.warn('Invalid receiverIds format. Skipping notification.');
			return;
		}

		if (!Array.isArray(leads) || leads.length === 0) {
			console.warn('No leads available to notify.');
			return;
		}

		// Extract valid receiver IDs from the object
		const validReceiverIds = Object.values(receiverIds).filter((id) => id);

		if (validReceiverIds.length === 0) {
			console.warn('No valid receivers found. Skipping notification.');
			return;
		}

		const notifications = [];

		leads.forEach((lead) => {
			validReceiverIds.forEach((receiverId) => {
				notifications.push({
					receiver_id: receiverId,
					lead_id: lead._id,
					lead_name: lead.leadName,
					sender_id: senderId,
				});
			});
		});

		if (notifications.length === 0) {
			console.warn('No valid notifications to send.');
			return;
		}

		await Promise.all(
			notifications.map((notifyData) =>
				axios.post(`${keys.socketUrl}/notification`, notifyData)
			)
		);
	} catch (err) {
		console.error('Failed to send bulk notifications:', err);
	}
};

export const readNotification = async (id, type) => {
	try {
		await axios.post(`${keys.socketUrl}/read_notification`, { id, type });
	} catch (err) {
		console.log(err);
	}
};

export const getNotificationCount = async (userId) => {
	try {
		const res = await axios.get(`${keys.socketUrl}/count?id=${userId}`);

		return res?.data ?? null;
	} catch (err) {
		console.log(err);
	}
};

// export const generateReportApi = async ({
// 	agency,
// 	month,
// 	year,
// 	format,
// 	server = 'baseUrl',
// }) => {
// 	const queryString = new URLSearchParams({
// 		agency,
// 		month,
// 		year,
// 		format,
// 	}).toString();

// 	const headers = {};
// 	setAuthHeader(headers);

// 	try {
// 		const response = await axios.get(
// 			`${constant[server]}api/attendance/monthly-records?${queryString}`,
// 			{
// 				headers,
// 				responseType: 'blob', // crucial for binary files!
// 				validateStatus: (status) => status >= 200 && status < 300, // handle non-2xx as errors
// 			}
// 		);

// 		const contentType =
// 			response.headers['content-type'] || 'application/octet-stream';

// 		return {
// 			blob: response.data,
// 			contentType,
// 		};
// 	} catch (error) {
// 		// axios error shape:
// 		// error.response → server responded
// 		// error.request  → no response (network issue)
// 		// error.message  → generic error

// 		if (error.response) {
// 			const reader = new FileReader();
// 			reader.readAsText(error.response.data);
// 			const errorText = await new Promise((resolve) => {
// 				reader.onload = () => resolve(reader.result);
// 			});
// 			let message;
// 			try {
// 				const parsed = JSON.parse(errorText);
// 				message = parsed.message || 'Failed to generate report';
// 			} catch {
// 				message = 'Failed to generate report';
// 			}
// 			throw new Error(message);
// 		} else {
// 			throw new Error(error.message || 'Failed to generate report');
// 		}
// 	}
// };

export const generateReportApi = async (payload) => {
	const {
		agency,
		format,
		type = 'month', // 'month' or 'range'
		month,
		year,
		startDate,
		endDate,
	} = payload;

	if (!agency || !format) {
		throw new Error(
			'Missing required parameters: agency and format are required.'
		);
	}

	const params = new URLSearchParams();
	params.append('agency', agency);
	params.append('format', format);
	params.append('type', type); // explicitly tell backend what type of filter

	if (type === 'month') {
		if (!month || !year) {
			throw new Error('Month and year are required for monthly report.');
		}
		params.append('month', month);
		params.append('year', year);
	} else if (type === 'range') {
		if (!startDate || !endDate) {
			throw new Error('Start and end dates are required for range report.');
		}
		params.append('startDate', startDate);
		params.append('endDate', endDate);
	}

	const url = `${constant[server]}api/attendance/monthly-records?${params.toString()}`;

	const headers = {};
	setAuthHeader(headers);

	try {
		const response = await axios.get(url, {
			headers,
			responseType: 'blob',
			validateStatus: (status) => status >= 200 && status < 300,
		});

		const contentType =
			response.headers['content-type'] || 'application/octet-stream';

		return {
			blob: response.data,
			contentType,
		};
	} catch (error) {
		let message = 'Failed to generate report';
		if (error.response && error.response.data instanceof Blob) {
			try {
				const text = await error.response.data.text();
				const parsed = JSON.parse(text);
				message = parsed?.message || message;
			} catch {
				// Fallback to default message
			}
		} else if (error.message) {
			message = error.message;
		}
		throw new Error(message);
	}
};

export const generateEmployeeAttendanceReport = async (payload) => {
	const { employeeId, format, type = 'month', month, year } = payload;

	if (!format || !employeeId) {
		throw new Error(
			'Missing required parameters: employeeId and format are required.'
		);
	}

	const params = new URLSearchParams();
	params.append('format', format);
	params.append('type', type); // explicitly tell backend what type of filter

	if (!month || !year) {
		throw new Error('Month and year are required for monthly report.');
	}
	params.append('month', month);
	params.append('year', year);

	const url = `${constant[server]}api/attendance/employee-report/${employeeId}?${params.toString()}`;

	const headers = {};
	setAuthHeader(headers);

	try {
		const response = await axios.get(url, {
			headers,
			responseType: 'blob',
			validateStatus: (status) => status >= 200 && status < 300,
		});

		const contentType =
			response.headers['content-type'] || 'application/octet-stream';

		return {
			blob: response.data,
			contentType,
		};
	} catch (error) {
		let message = 'Failed to generate report';
		if (error.response && error.response.data instanceof Blob) {
			try {
				const text = await error.response.data.text();
				const parsed = JSON.parse(text);
				message = parsed?.message || message;
			} catch {
				// Fallback to default message
			}
		} else if (error.message) {
			message = error.message;
		}
		throw new Error(message);
	}
};
