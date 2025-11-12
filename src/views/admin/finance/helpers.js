export const paymentOptions = [
	'Cash',
	'Bank Transfer',
	'Cheque',
	'Online Transfer',
	'Credit Card',
	'Debit Card',
	'PayPal',
	'Stripe',
	'Apple Pay',
	'Google Pay',
	'Wire Transfer',
	'Mobile Money',
	'Cryptocurrency',
];

export const loanTypes = [
	'Personal Loan',
	'Salary Advance',
	'Car Loan',
	'Housing Loan',
	'Education Loan',
	'Medical Loan',
	'Emergency Loan',
	'Staff Loan',
	'Business Loan',
	'Travel Loan',
	'Credit Card Loan',
	'Motorcycle Loan',
	'Appliance/Equipment Loan',
	'Relocation/Expat Loan',
	'Home Renovation Loan',
];

export const loanTypeColors = {
	'Personal Loan': 'teal',
	'Salary Advance': 'blue',
	'Car Loan': 'orange',
	'Housing Loan': 'green',
	'Education Loan': 'cyan',
	'Medical Loan': 'red',
	'Emergency Loan': 'pink',
	'Staff Loan': 'purple',
	'Business Loan': 'yellow',
	'Travel Loan': 'teal.400',
	'Credit Card Loan': 'blue.400',
	'Motorcycle Loan': 'orange.400',
	'Appliance/Equipment Loan': 'green.400',
	'Relocation/Expat Loan': 'cyan.400',
	'Home Renovation Loan': 'purple.400',
};

export const paymentColors = {
	Cash: 'green',
	'Bank Transfer': 'blue',
	Cheque: 'yellow',
	'Online Transfer': 'cyan',
	'Credit Card': 'purple',
	'Debit Card': 'teal',
	PayPal: 'blue',
	Stripe: 'purple',
	'Apple Pay': 'gray',
	'Google Pay': 'orange',
	'Wire Transfer': 'blue',
	'Mobile Money': 'teal',
	Cryptocurrency: 'yellow',
};

export const cleanSearchParams = (obj) => {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, v]) => v !== undefined && v !== null && v !== ''
		)
	);
};

// deterministic color from string
export const avatarPalette = [
	'brand.400',
	'teal.400',
	'purple.400',
	'orange.400',
	'cyan.400',
	'pink.400',
	'green.400',
	'yellow.400',
];
export const getAvatarColor = (str = '') => {
	let hash = 0;
	for (let i = 0; i < str.length; i++)
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	const idx = Math.abs(hash) % avatarPalette.length;
	return avatarPalette[idx];
};

export const getInitials = (name = '') => {
	if (!name) return '';
	const parts = name.trim().split(/\s+/).slice(0, 2);
	return parts.map((p) => p[0]?.toUpperCase()).join('');
};
