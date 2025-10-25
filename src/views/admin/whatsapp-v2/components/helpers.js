import { format } from 'date-fns';

export const getTimeFormat = (timestamp) => {
	if (!timestamp) return '';
	return format(new Date(timestamp * 1000), 'h:mm a').toUpperCase();
};

export const templatesLanguages = [
	{
		label: 'English',
		value: 'en',
	},
	{
		label: 'Arabic',
		value: 'ar',
	},
];

export const resolveMessageType = (file) => {
	if (!file) return 'text';

	const type = file.type;

	if (type.startsWith('image/')) return 'image';
	if (type.startsWith('video/')) return 'video';
	if (type.startsWith('audio/')) return 'audio';

	// For PDFs, DOCX, etc.
	return 'document';
};

export const generateRoomId = (val1, val2) => {
	const [a, b] = [
		val1?.toString()?.toLowerCase(),
		val2?.toString()?.toLowerCase(),
	].sort();

	const roomId = `${a}_${b}`;
	return roomId;
};
