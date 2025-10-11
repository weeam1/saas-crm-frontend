export const getAvatarColor = (input) => {
	const colors = [
		'#E57373', // red
		'#F06292', // pink
		'#BA68C8', // purple
		'#9575CD', // deep purple
		'#7986CB', // indigo
		'#64B5F6', // blue
		'#4FC3F7', // light blue
		'#4DD0E1', // cyan
		'#4DB6AC', // teal
		'#81C784', // green
		'#AED581', // light green
		'#DCE775', // lime
		'#FFD54F', // amber
		'#FFB74D', // orange
		'#FF8A65', // deep orange
		'#A1887F', // brown
		'#90A4AE', // blue gray
		'#BDBDBD', // gray
		'#F48FB1', // light pink
		'#CE93D8', // soft violet
		'#80CBC4', // seafoam
		'#81D4FA', // sky blue
		'#AED581', // apple green
		'#FFCC80', // peach
	];

	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}

	const colorIndex = Math.abs(hash % colors.length);
	return colors[colorIndex];
};
