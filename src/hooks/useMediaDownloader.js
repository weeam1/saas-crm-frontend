import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMediaUrl } from '../redux/whatsappSlice';
import { constant } from 'constant';

export const useMediaDownloader = () => {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	const mediaUrls = useSelector((state) => state.whatsapp.mediaUrls || {});

	const downloadMedia = async (mediaId) => {
		try {
			setIsLoading(true);

			if (mediaUrls[mediaId]) {
				return setIsLoading(false);
			}

			const response = await axios.get(
				`${constant['baseUrl']}api/whatsapp/download/${mediaId}`,
				{
					responseType: 'blob',
				}
			);

			const blob = new Blob([response.data], {
				type: response.headers['Content-Type'],
			});

			const blobUrl = URL.createObjectURL(blob);

			dispatch(setMediaUrl({ mediaId, url: blobUrl }));
		} catch (err) {
			console.error('Failed to load media:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return { downloadMedia, isLoading };
};
