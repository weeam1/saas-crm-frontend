import { constant } from 'constant';
import { useState, useCallback } from 'react';

export function usePdfDownloader() {
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);

	const downloadPdf = useCallback(async (url, filename = 'document.pdf') => {
		try {
			setLoading(true);
			setProgress(0);
			setError(null);

			const fullUrl = constant.baseUrl + url;

			const response = await fetch(fullUrl);

			if (!response.ok) throw new Error('Failed to download');

			const contentLength = response.headers.get('content-length');

			const reader = response.body.getReader();
			let receivedLength = 0;
			const chunks = [];

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				chunks.push(value);
				receivedLength += value.length;

				if (contentLength) {
					setProgress(Math.round((receivedLength / contentLength) * 100));
				}
			}

			const blob = new Blob(chunks, { type: 'application/pdf' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = filename;
			link.click();

			URL.revokeObjectURL(link.href);
			setLoading(false);
			setProgress(100);
		} catch (err) {
			setError(err.message);
			setLoading(false);
		}
	}, []);

	return { downloadPdf, loading, progress, error };
}
