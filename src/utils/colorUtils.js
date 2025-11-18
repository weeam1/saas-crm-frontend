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

export const CHAKRA_COLOR_SCHEMES = [
	'orange',
	'yellow',
	'green',
	'teal',
	'blue',
	'red',
	'cyan',
	'purple',
	'pink',
	'brand',
];

export const ALPHABET_COLOR_MAP = {
	A: { bg: 'cyan.100', text: 'cyan.700' },
	B: { bg: 'orange.100', text: 'orange.700' },
	C: { bg: 'yellow.100', text: 'yellow.700' },
	D: { bg: 'green.100', text: 'green.700' },
	E: { bg: 'teal.100', text: 'teal.700' },
	F: { bg: 'blue.100', text: 'blue.700' },
	G: { bg: 'cyan.100', text: 'cyan.700' },
	H: { bg: 'purple.100', text: 'purple.700' },
	I: { bg: 'pink.100', text: 'pink.700' },
	J: { bg: 'gray.100', text: 'gray.700' },
	K: { bg: 'red.200', text: 'red.800' },
	L: { bg: 'orange.200', text: 'orange.800' },
	M: { bg: 'yellow.200', text: 'yellow.800' },
	N: { bg: 'green.200', text: 'green.800' },
	O: { bg: 'teal.200', text: 'teal.800' },
	P: { bg: 'blue.200', text: 'blue.800' },
	Q: { bg: 'cyan.200', text: 'cyan.800' },
	R: { bg: 'purple.200', text: 'purple.800' },
	S: { bg: 'pink.200', text: 'pink.900' },
	T: { bg: 'orange.200', text: 'orange.800' },
	U: { bg: 'red.300', text: 'red.900' },
	V: { bg: 'brand.300', text: 'brand.900' },
	W: { bg: 'yellow.300', text: 'yellow.900' },
	X: { bg: 'green.300', text: 'green.900' },
	Y: { bg: 'blue.300', text: 'blue.900' },
	Z: { bg: 'purple.300', text: 'purple.900' },
};

export function getBadgeColors(value = '') {
	if (!value) return { bg: 'gray.100', text: 'gray.700' };

	const first = value.trim()[0].toUpperCase();
	return ALPHABET_COLOR_MAP[first] || { bg: 'gray.100', text: 'gray.700' };
}

export function getBadgeChakraColor(role = '') {
	const colors = CHAKRA_COLOR_SCHEMES;

	let hash = 0;
	for (let i = 0; i < role.length; i++) {
		hash = role.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length];
}
