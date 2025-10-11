export const getAvatarColor = (input) => {
	const colors = [
		'#E57373', // red
		'#F06292', // pink
		'#BA68C8', // purple
		'#64B5F6', // blue
		'#4DB6AC', // teal
		'#81C784', // green
		'#FFD54F', // amber
		'#FFB74D', // orange
		'#A1887F', // brown
		'#90A4AE', // blue gray
	];

	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}

	const colorIndex = Math.abs(hash % colors.length);
	return colors[colorIndex];
};
