export const getValidRolesFromStorage = () => {
	const stored = localStorage.getItem('roles');
	if (!stored) return null;

	try {
		const parsed = JSON.parse(stored);
		if (Date.now() > parsed.expiry) {
			localStorage.removeItem('roles');
			return null;
		}
		return parsed.roles;
	} catch {
		localStorage.removeItem('roles');
		return null;
	}
};
