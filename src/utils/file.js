export const checkFileExists = async (url) => {
	try {
		const res = await fetch(url, { method: 'HEAD' });

		// Covers 404, 403, 500, signed URL expiry, etc.
		if (!res.ok) return false;

		return true;
	} catch {
		// Network error / CORS / DNS
		return false;
	}
};
