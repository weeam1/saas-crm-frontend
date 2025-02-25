import axios from 'axios';
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
