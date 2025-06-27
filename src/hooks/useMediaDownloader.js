import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setMediaUrl } from '../redux/whatsappSlice';
import { constant } from 'constant';

export const useMediaDownloader = () => {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	const downloadMedia = async (mediaId) => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${constant['baseUrl']}api/whatsapp/download/${mediaId}`,
				{
					responseType: 'blob',
				}
			);
			const blobUrl = URL.createObjectURL(response.data);
			dispatch(setMediaUrl({ mediaId, url: blobUrl }));
		} catch (err) {
			console.error('Failed to load media:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return { downloadMedia, isLoading };
};
