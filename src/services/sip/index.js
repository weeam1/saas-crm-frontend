import axios from 'axios';

const BASE_URL = 'https://webrtc.weeam.info/cdr';

export const fetchCallHistoryData = async (page = 1, pageSize = 20) => {
	try {
		const response = await axios.get(BASE_URL, {
			params: { page, page_size: pageSize },
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
