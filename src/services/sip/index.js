import axios from 'axios';
import keys from 'config/keys';

const BASE_URL = `${keys.sipApiUrl}/search`;

export const fetchCallHistoryData = async (filters) => {
	try {
		const response = await axios.get(BASE_URL, {
			params: filters,
		});
		return response.data;
	} catch (error) {
		console.error('Failed to fetch call data', error);
		throw error;
	}
};
export const fetchCallHistoryServer2Data = async (filters) => {
	try {
		const response = await axios.get(`${keys.sipApiUrl2}/search`, {
			params: filters,
		});
		return response.data;
	} catch (error) {
		console.error('Failed to fetch call data', error);
		throw error;
	}
};

const BASE_URL_2 = `${keys.sipApiUrl}/call-stats`;

export const fetchTotalTimeCallsRecordStats = async (days = 30) => {
	try {
		const response = await axios.get(BASE_URL_2, {
			params: { days },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching call stats:', error);
		throw error;
	}
};
