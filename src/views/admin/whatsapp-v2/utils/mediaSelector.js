// mediaSelector.js
/**
 * Returns the correct media URL or base64 data URI for images/videos, etc.
 * Automatically handles:
 *  - Base64 stored in Redux
 *  - Fallback placeholder (if not loaded yet)
 */
export function getMediaSrc(mediaData) {
	if (!mediaData) return null;

	const { data, mimeType } = mediaData;

	console.log('getMediaSrc mediaData: ', mediaData);

	// Case 1: Already downloaded base64 in Redux
	if (data && mimeType) {
		return URL.createObjectURL(base64ToBlob(data, mimeType));
	}

	// Case 2: fallback blurred image or null
	return '/placeholder.png'; // optional: your blur placeholder path
}

/**
 * Convert base64 (without data URI header) to Blob for object URL use.
 */
export function base64ToBlob(b64Data, contentType = '') {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];
	for (let offset = 0; offset < byteCharacters.length; offset += 512) {
		const slice = byteCharacters.slice(offset, offset + 512);
		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}
		byteArrays.push(new Uint8Array(byteNumbers));
	}
	return new Blob(byteArrays, { type: contentType });
}
