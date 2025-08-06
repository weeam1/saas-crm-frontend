import { useState, useCallback } from 'react';

const getUserFromStorage = () => {
	try {
		// 1. Check sessionStorage first
		const sessionUser = sessionStorage.getItem('user');
		if (sessionUser) {
			const parsed = JSON.parse(sessionUser);
			return {
				...parsed,
				userRole: parsed?.roles?.[0]?.roleName || parsed?.role || 'user',
			};
		}

		// 2. Fallback to localStorage
		const localUser = localStorage.getItem('user');
		if (localUser) {
			const parsed = JSON.parse(localUser);
			sessionStorage.setItem('user', localUser); // Sync to sessionStorage
			return {
				...parsed,
				userRole: parsed?.roles?.[0]?.roleName || parsed?.role || 'guest',
			};
		}

		return null;
	} catch (error) {
		console.error('Failed to parse user data:', error);
		return null;
	}
};

const useUserSession = () => {
	// Initialize synchronously with stored user
	const [user, setUser] = useState(() => getUserFromStorage());

	// Optional: Add storage event listener for cross-tab sync
	const handleStorageChange = useCallback((e) => {
		if (e.key === 'user') {
			setUser(getUserFromStorage());
		}
	}, []);

	useState(() => {
		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	});

	return {
		user,
		role: user?.userRole,
		isAdmin: user?.userRole === 'admin' || user?.userRole === 'superAdmin',
		isAuthenticated: !!user,
		// Bonus: Add methods to update storage
		updateUser: (newUser) => {
			const userData = JSON.stringify(newUser);
			sessionStorage.setItem('user', userData);
			localStorage.setItem('user', userData);
			setUser(getUserFromStorage());
		},
		clearUser: () => {
			sessionStorage.removeItem('user');
			localStorage.removeItem('user');
			setUser(null);
		},
	};
};

export default useUserSession;
