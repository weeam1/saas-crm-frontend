// export function formatFileSize(bytes) {
// 	if (!bytes || bytes === 0) return '0 Bytes';

// 	const k = 1024;
// 	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
// 	const i = Math.floor(Math.log(bytes) / Math.log(k));

// 	const size = bytes / Math.pow(k, i);

// 	// Round intelligently: no decimals if <10 MB, else 1 decimal
// 	const rounded = size < 10 && i > 0 ? size.toFixed(1) : Math.round(size);

// 	return `${rounded} ${units[i]}`;
// }

export function formatFileSize(bytes) {
	if (!bytes || bytes === 0) return '0 Bytes';

	const k = 1024;
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	const size = bytes / Math.pow(k, i);
	const rounded = size < 10 && i > 0 ? roundTo(size, 1) : roundTo(size, 0);

	return `${rounded} ${units[i]}`;
}

function roundTo(value, decimals = 0) {
	const factor = Math.pow(10, decimals);
	return Math.round(value * factor) / factor;
}
