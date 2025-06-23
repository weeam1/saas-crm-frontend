import { format } from 'date-fns';

export const getTimeFormat = (isoString) => {
	return format(new Date(isoString), 'h:mm a').toUpperCase();
};


export const resolveMessageType = (file: File | null): string => {
	if (!file) return 'text';

	const type = file.type;

	if (type.startsWith('image/')) return 'image';
	if (type.startsWith('video/')) return 'video';
	if (type.startsWith('audio/')) return 'audio';

	// For PDFs, DOCX, etc.
	return 'document';
};