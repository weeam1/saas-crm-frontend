import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser, syncUser } from '../redux/localSlice';
import { useEffect } from 'react';
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

export const useUserSession = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === 'user') {
				dispatch(syncUser());
			}
		};
		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [dispatch]);

	return {
		user,
		userRoleName: user?.roleName,
		isSuperAdmin:
			user?.roleName === 'superAdmin' || user?.role === 'superAdmin',
		isAuthenticated: !!user,
		updateUser: (newUser) => dispatch(setUser(newUser)),
		clearUser: () => dispatch(clearUser()),
	};
};

export default useUserSession;
