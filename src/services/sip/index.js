import axios from 'axios';

const BASE_URL = 'https://webrtc.weeam.info/search';

export const fetchCallHistoryData = async (filters) => {
	try {
		console.log({ fetch: filters });
		const response = await axios.get(BASE_URL, {
			params: filters,
		});
		return response.data;
	} catch (error) {
		console.error('Failed to fetch call data', error);
		throw error;
	}
};

const BASE_URL_2 = 'https://webrtc.weeam.info/call-stats';

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
