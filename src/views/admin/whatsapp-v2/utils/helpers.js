export const getMessageLabel = (message) => {
	if (!message) return '';

	const type = message?.type;
	const filename = message?._data?.filename;

	const typeLabels = {
		image: '📷 Image',
		video: '🎥 Video',
		document: `📄 ${filename || 'Document'}`,
		audio: '🎧 Audio',
		sticker: '🩵 Sticker',
		location: '📍 Location',
		contact: '👤 Contact',
	};

	return typeLabels[type] || message?.body || 'New Message';
};
