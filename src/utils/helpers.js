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
