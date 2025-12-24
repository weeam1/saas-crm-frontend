// import { constant } from 'constant';
// import { useState, useCallback } from 'react';

// export function usePdfDownloader() {
// 	const [loading, setLoading] = useState(false);
// 	const [progress, setProgress] = useState(0);
// 	const [error, setError] = useState(null);

// 	const downloadPdf = useCallback(async (url, filename = 'document.pdf') => {
// 		try {
// 			setLoading(true);
// 			setProgress(0);
// 			setError(null);

// 			const fullUrl = constant.baseUrl + url;

// 			const response = await fetch(fullUrl);

// 			if (!response.ok) throw new Error('Failed to download');

// 			const contentLength = response.headers.get('content-length');

// 			const reader = response.body.getReader();
// 			let receivedLength = 0;
// 			const chunks = [];

// 			while (true) {
// 				const { done, value } = await reader.read();
// 				if (done) break;

// 				chunks.push(value);
// 				receivedLength += value.length;

// 				if (contentLength) {
// 					setProgress(Math.round((receivedLength / contentLength) * 100));
// 				}
// 			}

// 			const blob = new Blob(chunks, { type: 'application/pdf' });
// 			const link = document.createElement('a');
// 			link.href = URL.createObjectURL(blob);
// 			link.download = filename;
// 			link.click();

// 			URL.revokeObjectURL(link.href);
// 			setLoading(false);
// 			setProgress(100);
// 		} catch (err) {
// 			setError(err.message);
// 			setLoading(false);
// 		}
// 	}, []);

// 	return { downloadPdf, loading, progress, error };
// }

import { setAuthHeader } from 'api';
import { constant } from 'constant';
import { useState, useCallback, useRef, useEffect } from 'react';

export function usePdfDownloader() {
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const abortRef = useRef(null);
	const isMounted = useRef(true);

	useEffect(() => {
		return () => {
			isMounted.current = false;
			if (abortRef.current) abortRef.current.abort();
		};
	}, []);

	const downloadPdf = useCallback(async (url, filename = 'document.pdf') => {
		try {
			// Abort previous downloads
			if (abortRef.current) abortRef.current.abort();
			abortRef.current = new AbortController();

			if (isMounted.current) {
				setLoading(true);
				setProgress(0);
				setError(null);
			}

			const headers = {};
			setAuthHeader(headers);

			const response = await fetch(constant.baseUrl + url, {
				method: 'GET',
				headers: headers,
				signal: abortRef.current.signal,
			});

			if (!response.ok) {
				throw new Error(`Download failed with status: ${response.status}`);
			}

			const contentLength = Number(response.headers.get('content-length'));
			const reader = response.body.getReader();

			const chunks = [];
			let received = 0;

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				chunks.push(value);
				received += value.length;

				// Progress handling
				if (contentLength && isMounted.current) {
					setProgress(
						Math.min(100, Math.round((received / contentLength) * 100))
					);
				} else if (isMounted.current) {
					// No content length header available
					setProgress((prev) => (prev < 95 ? prev + 5 : 95));
				}
			}

			// Basic corruption check
			if (contentLength && received !== contentLength) {
				throw new Error('File corrupted during download');
			}

			const blob = new Blob(chunks, { type: 'application/pdf' });
			const fileUrl = URL.createObjectURL(blob);

			// Download without browser UI
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = fileUrl;
			a.download = filename;

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			// Allow browser to settle before cleanup
			requestIdleCallback(() => URL.revokeObjectURL(fileUrl));

			if (isMounted.current) {
				setProgress(100);
				setLoading(false);
			}
		} catch (err) {
			if (err.name === 'AbortError') return;

			if (isMounted.current) {
				setError(err.message || 'Download error');
				setLoading(false);
			}
		}
	}, []);

	return { downloadPdf, loading, progress, error };
}
