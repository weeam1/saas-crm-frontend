import { saveAs } from 'file-saver';

/**
 * Convert a base64 string (without data: header) to a Blob.
 * @param {string} b64Data - base64 string (no "data:...;base64," prefix)
 * @param {string} contentType - mimeType
 * @returns {Blob}
 */
export function base64ToBlob(b64Data, contentType = '') {
	const sliceSize = 512;
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);
		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}
		byteArrays.push(new Uint8Array(byteNumbers));
	}

	return new Blob(byteArrays, { type: contentType });
}

/**
 * Open base64 content in a new tab (preferred for images, pdfs, video small)
 * Uses Blob URL to avoid data URL length issues for very big files.
 */
export function openBase64InNewTab(b64Data, mimeType = '') {
	const blob = base64ToBlob(b64Data, mimeType);
	const url = URL.createObjectURL(blob);
	window.open(url, '_blank', 'noopener,noreferrer');
	// optional: revoke later
	setTimeout(() => URL.revokeObjectURL(url), 1000 * 60);
}

/**
 * Download base64 content with original filename using file-saver
 */
export function downloadBase64File(b64Data, mimeType = '', fileName = 'file') {
	const blob = base64ToBlob(b64Data, mimeType);
	saveAs(blob, fileName);
}

/**
 * Decide whether mimeType is viewable inline.
 * We'll treat images, video, audio, pdf as "viewable" in a new tab.
 */
export function isViewableInline(mimeType = '') {
	if (!mimeType) return false;
	return (
		mimeType.startsWith('image/') ||
		mimeType.startsWith('video/') ||
		mimeType.startsWith('audio/') ||
		mimeType === 'application/pdf'
	);
}
