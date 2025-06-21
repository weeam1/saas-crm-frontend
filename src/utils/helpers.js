import moment from 'moment';

export const currentTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formattedDate = (_date) => {
	if (_date === '') {
		return '';
	}

	const date = new Date(_date);

	// Get the formatted date
	const options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	};
	const formattedDate = date.toLocaleDateString('en-US', options);

	return formattedDate;
};

// export const formatPostDate = (date, timezone) => {
// 	const now = new Date();
// 	let inputDate = new Date(date);

// 	console.log(inputDate);

// 	// Apply timezone offset if provided
// 	if (timezone) {
// 		const offset = inputDate.getTimezoneOffset() * 60000;
// 		const timezoneOffset = parseInt(timezone) * 3600000;
// 		console.log(offset, timezoneOffset);
// 		inputDate = new Date(inputDate.getTime() + offset + timezoneOffset);

// 		console.log(inputDate);
// 	}

// 	const seconds = Math.floor((now - inputDate) / 1000);

// 	// Less than 1 minute
// 	// if (seconds < 60) {
// 	// 	return seconds <= 0 ? 'now' : `${seconds} sec ago`;
// 	// }

// 	if (seconds < 60) {
// 		return 'now';
// 	}

// 	// Less than 1 hour
// 	const minutes = Math.floor(seconds / 60);
// 	if (minutes < 60) {
// 		return `${minutes} min ago`;
// 	}

// 	// Less than 24 hours
// 	const hours = Math.floor(minutes / 60);
// 	if (hours < 24) {
// 		return `${hours}h ago`;
// 	}

// 	// 24 hours or older - show full date with time
// 	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// 	const weekday = weekdays[inputDate.getDay()];
// 	const day = inputDate.getDate().toString().padStart(2, '0');
// 	const month = [
// 		'Jan',
// 		'Feb',
// 		'Mar',
// 		'Apr',
// 		'May',
// 		'Jun',
// 		'Jul',
// 		'Aug',
// 		'Sep',
// 		'Oct',
// 		'Nov',
// 		'Dec',
// 	][inputDate.getMonth()];
// 	const year = inputDate.getFullYear().toString().slice(-2);

// 	// Format time as 09:24 PM
// 	let hours12 = inputDate.getHours();
// 	const ampm = hours12 >= 12 ? 'PM' : 'AM';
// 	hours12 = hours12 % 12;
// 	hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
// 	const mins = inputDate.getMinutes().toString().padStart(2, '0');
// 	const timeString = `${hours12}:${mins} ${ampm}`;

// 	return `${weekday} ${day} ${month} ${year}, ${timeString}`;
// };

export const formatPostDate = (date, timezone) => {
	try {
		// Create moment objects with timezone handling
		const now = timezone ? moment().tz(timezone) : moment();
		const inputDate = timezone ? moment(date).tz(timezone) : moment(date);

		if (!inputDate.isValid()) return 'Invalid date';

		// Calculate difference in seconds
		const diffSeconds = now.diff(inputDate, 'seconds');

		console.log(diffSeconds);

		// Relative time formats
		if (diffSeconds < 60) return 'now';
		if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
		if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;

		// Format full date with timezone
		return inputDate.format('ddd DD MMM YY, hh:mm A');
	} catch (error) {
		console.error('Date formatting error:', error);
		return 'Invalid date';
	}
};

export const toUTCString = (date) => {
	return date
		? moment(date).utcOffset(0, true).startOf('day').toISOString()
		: null;
};

export const formatDNS = (dateStr) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
};

export const extractLocationData = (ipString, countryNames) => {
	const countryList = new Set(countryNames);

	if (ipString === null) {
		return { ip: null, country: null, city: null };
	}

	const parts = ipString?.split('-').map((part) => part.trim());

	let ip = null,
		city = null,
		country = null;

	const isValidIPv4 = (str) => {
		const octets = str.split('.');
		return (
			octets.length === 4 &&
			octets.every(
				(octet) =>
					/^\d+$/.test(octet) && Number(octet) >= 0 && Number(octet) <= 255
			)
		);
	};

	// If first part is a valid IPv4 address or a pure number, set it as IP
	if (isValidIPv4(parts[0]) || /^\d*$/.test(parts[0])) {
		ip = parts.shift(); // Remove IP so remaining parts are city & country
	}

	if (parts.length === 2) {
		const firstPartLower = parts[0].toLowerCase();
		const secondPartLower = parts[1].toLowerCase();

		if (countryList.has(secondPartLower)) {
			city = parts[0];
			country = parts[1];
		} else if (countryList.has(firstPartLower)) {
			country = parts[0];
			city = parts[1]; // Handle misplaced country
		} else {
			city = parts[0];
			country = null;
		}
	} else if (parts.length === 1) {
		const partLower = parts[0].toLowerCase();
		country = countryList.has(partLower) ? parts[0] : null;
		city = country ? null : parts[0];
	}

	return { ip, city, country };
};

export const renderValue = (value) => {
	if (!value) return 'No data';
	if (typeof value === 'string' || typeof value === 'number') return value;
	if (typeof value === 'object' && value.text) return value.text;
	return 'Invalid data';
};

export const mergeSort = (arr) => {
	if (arr.length <= 1) return arr;

	const mid = Math.floor(arr.length / 2);
	const left = mergeSort(arr.slice(0, mid));
	const right = mergeSort(arr.slice(mid));

	return merge(left, right);
};

const merge = (left, right) => {
	let sortedArr = [];
	let i = 0,
		j = 0;

	while (i < left.length && j < right.length) {
		if (left[i].firstName.localeCompare(right[j].firstName) <= 0) {
			sortedArr.push(left[i]);
			i++;
		} else {
			sortedArr.push(right[j]);
			j++;
		}
	}

	return [...sortedArr, ...left.slice(i), ...right.slice(j)];
};

export const BRAND_COLORS = [
	'#B79045',
	'#D99A36',
	'#E5B668',
	'#EDD199',
	'#F5ECCB',
];

export const formattedValue = (value, precision = 0) =>
	Number(value).toLocaleString(undefined, {
		minimumFractionDigits: precision,
		maximumFractionDigits: precision,
	});

export const formatTime = (seconds) => {
	const safeSeconds = Math.max(0, seconds);
	const mins = Math.floor(safeSeconds / 60);
	const secs = Math.floor(safeSeconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDateHeader = (date) => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const messageDate = new Date(date);

	if (messageDate.toDateString() === today.toDateString()) {
		return 'Today';
	} else if (messageDate.toDateString() === yesterday.toDateString()) {
		return 'Yesterday';
	} else {
		return messageDate.toLocaleDateString([], {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
		});
	}
};

export const formatMessageTime = (date) => {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const whatsappColors = {
	primary: '#008069',
	secondary: '#00A884',
	incomingBg: 'softGray.100',
	outgoingBg: '#D9FDD3',
	textDark: '#111B21',
	textLight: '#FFFFFF',
	textSecondary: '#667781',
	sidebarBg: '#F0F2F5',
	headerBg: '#F0F2F5',
	inputBg: '#FFFFFF',
	recordingDot: '#34B7F1',
	userHoverBg: 'rgba(0, 0, 0, 0.05)',
	userSelectedBg: 'rgba(0, 0, 0, 0.08)',
	messageHoverBg: 'rgba(0, 0, 0, 0.03)',
	timeStampColor: 'gray.600',
	replyBg: '#F0F2F5',
	replyBorder: '#D1D7DB',
	chatHeaderBg: '#F0F2F5',
};
