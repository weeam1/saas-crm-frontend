import { format } from 'date-fns';

export const getTimeFormat = (isoString) => {
	return format(new Date(isoString), 'h:mm a').toUpperCase();
};
