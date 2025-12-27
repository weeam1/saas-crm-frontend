import { constant } from 'constant';
const BASE_URL = constant.baseUrl || '';

/**
 * Format currency with native symbol
 */
export const formatCurrency = (amount, currency) => {
	if (!currency) return `${amount}`;

	const symbol =
		currency.raw?.symbol_native || currency.symbol || currency.value;
	const formattedAmount = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);

	return `${symbol}${formattedAmount}`;
};

/**
 * Get full image URL
 */
export const getImageUrl = (imagePath) => {
	if (!imagePath) return null;

	// Adjust based on your API base URL
	const imageUrl = imagePath.startsWith('http')
		? imagePath
		: `${BASE_URL}${imagePath}`;

	return imageUrl;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
	if (!text || text.length <= maxLength) return text;
	return `${text.substring(0, maxLength)}...`;
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
	const options = { year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Get status color scheme for Chakra UI
 */
export const getStatusColor = (status) => {
	const statusColors = {
		pending: 'yellow',
		active: 'green',
		sold: 'red',
		available: 'blue',
		rented: 'purple',
		draft: 'gray',
	};
	return statusColors[status] || 'gray';
};

/**
 * Get status text
 */
export const getStatusText = (status) => {
	const statusMap = {
		pending: 'Pending Review',
		active: 'Active',
		sold: 'Sold',
		available: 'Available',
		rented: 'Rented',
		draft: 'Draft',
	};
	return statusMap[status] || status;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
	if (!phoneNumber) return 'N/A';

	// Remove all non-digits
	const cleaned = phoneNumber.replace(/\D/g, '');

	// Format based on length
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
	} else if (cleaned.length > 10) {
		return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
	}

	return phoneNumber;
};

/**
 * Get document icon based on file type
 */
export const getDocumentIcon = (filename) => {
	const extension = filename?.split('.').pop().toLowerCase();

	const iconMap = {
		pdf: 'FaFilePdf',
		doc: 'FaFileWord',
		docx: 'FaFileWord',
		xls: 'FaFileExcel',
		xlsx: 'FaFileExcel',
		ppt: 'FaFilePowerpoint',
		pptx: 'FaFilePowerpoint',
		txt: 'FaFileAlt',
		jpg: 'FaFileImage',
		jpeg: 'FaFileImage',
		png: 'FaFileImage',
		zip: 'FaFileArchive',
		rar: 'FaFileArchive',
		default: 'FaFile',
	};

	return iconMap[extension] || iconMap.default;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
	if (!bytes) return 'N/A';

	const units = ['B', 'KB', 'MB', 'GB'];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Get document URL
 */
export const getDocumentUrl = (documentPath) => {
	if (!documentPath) return null;

	return documentPath.startsWith('http')
		? documentPath
		: `${BASE_URL}${documentPath}`;
};

/**
 * Get file name from path
 */
export const getFileName = (path) => {
	if (!path) return 'Unknown File';
	return path.split('/').pop().split('_').pop() || 'Document';
};
