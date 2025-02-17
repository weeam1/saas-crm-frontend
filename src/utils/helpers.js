export const formattedDate = (_date) => {
	if (_date === '') {
		return '';
	}

	console.log('date is changed');

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

export const renderValue = (value) => {
	if (!value) return 'No data';
	if (typeof value === 'string' || typeof value === 'number') return value;
	if (typeof value === 'object' && value.text) return value.text;
	return 'Invalid data';
};
