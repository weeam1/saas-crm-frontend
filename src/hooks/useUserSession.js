import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser, syncUser } from '../redux/localSlice';
import { useEffect, useState } from 'react';
import keys from 'config/keys';
// const getUserFromStorage = () => {
// 	try {
// 		// 1. Check sessionStorage first
// 		const sessionUser = sessionStorage.getItem('user');
// 		if (sessionUser) {
// 			const parsed = JSON.parse(sessionUser);
// 			return {
// 				...parsed,
// 				roleName: parsed?.roles?.[0]?.roleName || parsed?.role || 'user',
// 			};
// 		}

// 		// 2. Fallback to localStorage
// 		const localUser = localStorage.getItem('user');
// 		if (localUser) {
// 			const parsed = JSON.parse(localUser);
// 			sessionStorage.setItem('user', localUser); // Sync to sessionStorage
// 			return {
// 				...parsed,
// 				roleName: parsed?.roles?.[0]?.roleName || parsed?.role || 'user',
// 			};
// 		}

// 		return null;
// 	} catch (error) {
// 		console.error('Failed to parse user data:', error);
// 		return null;
// 	}
// };

// const useUserSession = () => {
// 	// Initialize synchronously with stored user
// 	const [user, setUser] = useState(() => getUserFromStorage());

// 	console.log({ user });

// 	// Optional: Add storage event listener for cross-tab sync
// 	const handleStorageChange = useCallback((e) => {
// 		if (e.key === 'user') {
// 			setUser(getUserFromStorage());
// 		}
// 	}, []);

// 	useState(() => {
// 		window.addEventListener('storage', handleStorageChange);
// 		return () => window.removeEventListener('storage', handleStorageChange);
// 	});

// 	return {
// 		user,
// 		role: user?.userRole,
// 		isAdmin: user?.userRole === 'admin' || user?.userRole === 'superAdmin',
// 		isAuthenticated: !!user,
// 		// Bonus: Add methods to update storage
// 		updateUser: (newUser) => {
// 			const userData = JSON.stringify(newUser);
// 			sessionStorage.setItem('user', userData);
// 			localStorage.setItem('user', userData);
// 			setUser(getUserFromStorage());
// 		},
// 		clearUser: () => {
// 			sessionStorage.removeItem('user');
// 			localStorage.removeItem('user');
// 			setUser(null);
// 		},
// 	};
// };
// hooks/useUserSession.js

const useAgencyLogo = () => {
	const [agencyLogo, setAgencyLogo] = useState(null);

	useEffect(() => {
		const checkLogo = async () => {
			try {
				const logo = localStorage.getItem('AgencyLogo');

				if (!logo || logo === 'null' || logo === 'undefined') {
					setAgencyLogo(null);
					return;
				}

				const logoUrl = `${keys.productApiUrl}api/${logo}`;

				const response = await fetch(logoUrl, {
					method: 'HEAD',
				});

				console.log({ response });

				if (response.ok) {
					setAgencyLogo(logoUrl);
				} else {
					setAgencyLogo(null);
				}
			} catch (error) {
				console.error('Logo fetch error:', error);
				setAgencyLogo(null);
			}
		};

		checkLogo();
	}, []);

	return agencyLogo;
};

export const useUserSession = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.user);
	const agencyName =
		user?.tenant?.agencyName ||
		localStorage.getItem('workspaceAgencyName') ||
		'Default Agency';

	const agencyLogo = useAgencyLogo();
	// const agencyLogo = `${process.env.REACT_APP_CRM_PRODUCT_API_URL}api/${localStorage.getItem('AgencyLogo')}`;
	// useEffect(() => {
	// 	const handleStorageChange = (e) => {
	// 		if (e.key === 'user') {
	// 			dispatch(syncUser());
	// 		}
	// 	};
	// 	window.addEventListener('storage', handleStorageChange);
	// 	return () => window.removeEventListener('storage', handleStorageChange);
	// }, [dispatch]);

	return {
		agencyName,
		agencyLogo,
		user,
		userRoleName: user?.roleName,
		isSuperAdmin:
			user?.roleName === 'superAdmin' || user?.role === 'superAdmin',
		isAdmin: user?.roleName === 'Admin',
		isAuthenticated: !!user,
		updateUser: (newUser) => dispatch(setUser(newUser)),
		clearUser: () => dispatch(clearUser()),
	};
};

export default useUserSession;
