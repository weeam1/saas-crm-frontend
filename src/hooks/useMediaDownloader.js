import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMediaUrl } from '../redux/whatsappSlice';
import { constant } from 'constant';
import { toast } from 'react-toastify';

export const useMediaDownloader = () => {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	const mediaUrls = useSelector((state) => state.whatsapp.mediaUrls || {});

	// const downloadMedia = async (mediaId) => {
	// 	try {
	// 		setIsLoading(true);

	// 		if (mediaUrls[mediaId]) {
	// 			return setIsLoading(false);
	// 		}

	// 		const response = await axios.get(
	// 			`${constant['baseUrl']}api/whatsapp/download/${mediaId}`,
	// 			{
	// 				responseType: 'blob',
	// 			}
	// 		);

	// 		const blob = new Blob([response.data], {
	// 			type: response.headers['content-type'],
	// 		});

	// 		const blobUrl = URL.createObjectURL(blob);

	// 		dispatch(setMediaUrl({ mediaId, url: blobUrl }));
	// 	} catch (err) {
	// 		console.error('Failed to load media:', err);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	const downloadMedia = (mediaId) => {
		const controller = new AbortController();

		const fetchMedia = async () => {
			let isMounted = true;

			try {
				if (mediaUrls[mediaId]) return;

				setIsLoading(true);

				const response = await axios.get(
					`${constant['baseUrl']}api/whatsapp/download/${mediaId}`,
					{
						responseType: 'blob',
						signal: controller.signal,
					}
				);

				const blob = new Blob([response.data], {
					type: response.headers['content-type'],
				});
				const blobUrl = URL.createObjectURL(blob);

				if (isMounted) {
					dispatch(setMediaUrl({ mediaId, url: blobUrl }));
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					console.warn(`Request cancelled: ${mediaId}`);
				} else {
					console.error('Failed to download media:', error);
				}
			} finally {
				if (isMounted) setIsLoading(false);
			}

			return () => {
				isMounted = false;
				controller.abort(); // cancel axios request
			};
		};

		fetchMedia();
	};

	const downloadMediaFile = async (
		mediaId,
		type = 'download',
		baseFilename = 'file'
	) => {
		try {
			setIsLoading(true);

			const response = await axios.get(
				`${constant['baseUrl']}api/whatsapp/download/${mediaId}`,
				{ responseType: 'blob' }
			);

			const contentType = response.headers['content-type'];
			const ext = getExtensionFromContentType(contentType);
			const filename = `${baseFilename}.${ext}`;

			const blob = new Blob([response.data], { type: contentType });
			const url = URL.createObjectURL(blob);

			if (type === 'open') {
				const viewableTypes = [
					'application/pdf',
					'image/jpeg',
					'image/png',
					'text/plain',
				];
				if (viewableTypes.includes(contentType)) {
					const newTab = window.open(url, '_blank');
					if (!newTab) toast.error('Popup blocked.');
				} else {
					toast.warning('Preview not supported. Downloading instead.');
					triggerDownload(url, filename);
				}
			} else {
				triggerDownload(url, filename);
			}

			// Optional: revoke URL after short delay
			setTimeout(() => URL.revokeObjectURL(url), 2000);
		} catch (err) {
			console.error('Download error:', err);
			toast.error('Failed to download file.');
		} finally {
			setIsLoading(false);
		}
	};

	const triggerDownload = (url, filename) => {
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success('Download started');
	};

	return { downloadMedia, downloadMediaFile, isLoading };
};

// const getExtensionFromContentType = (contentType) => {
// 	return mimeToExtension[contentType] || 'bin';
// };

const getExtensionFromContentType = (mimeType) => {
	const mimeToExt = {
		// Images
		'image/jpeg': '.jpg',
		'image/png': '.png',
		'image/gif': '.gif',
		'image/webp': '.webp',

		// Videos
		'video/mp4': '.mp4',
		'video/3gpp': '.3gp',

		// Audio
		'audio/mpeg': '.mp3',
		'audio/ogg': '.ogg',
		'audio/amr': '.amr',
		'audio/aac': '.aac',

		// Documents
		'application/pdf': '.pdf',
		'application/msword': '.doc',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			'.docx',
		'application/vnd.ms-excel': '.xls',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			'.xlsx',
		'application/vnd.ms-powerpoint': '.ppt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			'.pptx',
		'text/plain': '.txt',
		'application/rtf': '.rtf',

		// Archives (document type for WhatsApp)
		'application/zip': '.zip',
		'application/x-rar-compressed': '.rar',
		'application/x-7z-compressed': '.7z',
		'application/x-tar': '.tar',
		'application/gzip': '.gz',

		// Archives
		'application/x-bzip2': '.bz2',

		// Misc
		'application/octet-stream': '.bin',
		'application/x-msdownload': '.exe',
	};

	return mimeToExt[mimeType.toLowerCase()];
};
