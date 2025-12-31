import imageCompression from 'browser-image-compression';
import { checkFileExists } from 'utils/file';
import { getImageUrl } from 'views/admin/Listing/client-listings/propertyUtils';

export const compressImage = async (file) => {
	const options = {
		maxSizeMB: 0.5,
		maxWidthOrHeight: 800,
		useWebWorker: true,
	};
	return await imageCompression(file, options);
};

export const resolveInitialImage = async (user) => {
	if (!user?.profileImage) return null;

	const imageUrl = getImageUrl(user.profileImage);

	const fileExists = await checkFileExists(imageUrl);

	if (!fileExists) return null;

	// server-stored image (string path / url)
	return imageUrl;
};
