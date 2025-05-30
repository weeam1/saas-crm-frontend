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
