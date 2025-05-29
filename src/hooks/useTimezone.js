// getSmartTimezone.js

const GEO_STORAGE_KEY = 'geo_cache';
const TIMEZONE_STORAGE_KEY = 'timezone_cache';

function calculateDistance(lat1, lon1, lat2, lon2) {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export async function getSmartTimezone() {
	return new Promise((resolve) => {
		if (!navigator.geolocation) {
			console.warn('No geolocation support');
			return resolve(getFallbackTz());
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;
				const newCoords = { lat: latitude, lon: longitude };

				const storedGeo = localStorage.getItem(GEO_STORAGE_KEY);
				const storedTz = localStorage.getItem(TIMEZONE_STORAGE_KEY);

				if (storedGeo && storedTz) {
					const { lat, lon } = JSON.parse(storedGeo);
					const distance = calculateDistance(lat, lon, latitude, longitude);

					if (distance < 10) {
						return resolve(storedTz);
					}
				}

				// Location changed or first time
				try {
					const res = await fetch('https://ipwho.is');
					const data = await res.json();
					const timezone = data.timezone.id;

					localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone);
					localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(newCoords));
					resolve(timezone);
				} catch (err) {
					console.error('IP API failed:', err);
					resolve(getFallbackTz());
				}
			},
			(error) => {
				console.warn('Geolocation error:', error.message);
				resolve(getFallbackTz());
			},
			{ timeout: 5000 }
		);
	});
}

function getFallbackTz() {
	const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone;
	localStorage.setItem(TIMEZONE_STORAGE_KEY, fallback);
	return fallback;
}
