import axios from 'axios';
import { toast } from 'react-toastify';
import { constant } from 'constant';

export const downloadFile = async (documentUrl) => {
	if (!documentUrl) {
		toast.error('Document URL is missing');
		return;
	}

	try {
		const apiURL = constant.baseUrl + 'api/files/download';
		const res = await axios.post(
			apiURL,
			{ filepath: documentUrl },
			{
				responseType: 'blob',
				timeout: 0, // allow large files
				validateStatus: (status) => status < 500,
			}
		);

		// Backend error response (JSON)
		if (res.headers['content-type']?.includes('application/json')) {
			const text = await res.data.text();
			const error = JSON.parse(text);
			throw new Error(error.message || 'Download failed');
		}

		// Extract filename from header
		const disposition = res.headers['content-disposition'];
		const filename =
			disposition?.match(/filename="(.+)"/)?.[1] || 'downloaded-file';

		const blob = new Blob([res.data]);
		const url = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = decodeURIComponent(filename);
		document.body.appendChild(a);
		a.click();
		a.remove();

		window.URL.revokeObjectURL(url);

		toast.success('Download started');
	} catch (err) {
		console.error('Download failed:', err);
		toast.error(err.message || 'Unable to download file');
	}
};
