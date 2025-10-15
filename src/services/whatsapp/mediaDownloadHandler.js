import {
	downloadBase64File,
	isViewableInline,
	openBase64InNewTab,
} from 'views/admin/whatsapp-v2/utils/mediaUtils';

/**
 * After we got base64 from server and saved it, open or download appropriately.
 */
export function handleAfterDownload({ mediaKey, media, action }) {
	const { data, mimetype, filename } = media;

	if (!data) return;

	// Action can be 'open' or 'download'; server might echo it back.
	if (action === 'open') {
		// For documents that are not inline-viewable, we might still prefer to download
		if (isViewableInline(mimetype)) {
			openBase64InNewTab(data, mimetype);
		} else {
			// If it's a doc type like docx/xlsx/zip, fallback to download
			downloadBase64File(data, mimetype, filename || 'download');
		}
		return;
	}

	// default action: download
	if (action === 'download') {
		downloadBase64File(data, mimetype, filename || 'download');
	}
}
