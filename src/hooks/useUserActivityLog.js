import { useCallback } from 'react';

import socketService from 'services/socketService';

export function useUserActivityLog() {
	async function getUserMetadata() {
		const cached = sessionStorage.getItem('user-metadata');
		if (cached) return JSON.parse(cached);

		try {
			const pos = await new Promise((resolve, reject) =>
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 5000,
				}),
			);

			const lat = pos.coords.latitude;
			const lon = pos.coords.longitude;

			const res = await fetch(
				`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
			);
			const data = await res.json();

			console.log({ lat, lon });

			const metadata = {
				country: data.countryName || 'Unknown',
				city: data.city || 'Unknown',
				latitude: lat || null,
				longitude: lon || null,
			};

			sessionStorage.setItem('user-metadata', JSON.stringify(metadata));
			return metadata;
		} catch (_) {
			return {
				country: 'Unknown',
				city: 'Unknown',
				latitude: null,
				longitude: null,
			};
		}
	}

	// Register user payload
	const createUserLog = useCallback(async (payload) => {
		const logData = {
			...payload,
			metadata: await getUserMetadata(),
			// metadata: {
			// 	ip: '103.255.4.11',
			// 	device: 'Desktop (Windows)',
			// 	browser: 'Chrome',
			// 	country: 'Pakistan',
			// 	city: 'Lahore',
			// 	timezone: 'Asia/Karachi',
			// },
		};

		console.log('User activity log with payload:', logData);

		socketService.createUserActivityLog(logData);
	}, []);

	return { createUserLog };
}
