import { useState, useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useFetchItemsQuery } from 'api/apiSlice';

// Helper function to read valid cached roles
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

// Hook for fetching and caching roles
export const useRoles = () => {
	const [localRoles, setLocalRoles] = useState(() =>
		getValidRolesFromStorage()
	);
	const shouldFetch = !localRoles;

	const {
		data: roles,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useFetchItemsQuery(shouldFetch ? { path: '/role-access/v2' } : skipToken);

	useEffect(() => {
		if (isSuccess && roles) {
			const expiryTime = Date.now() + 5 * 60 * 1000; // cache for 5 minutes
			const dataWithExpiry = { roles, expiry: expiryTime };
			localStorage.setItem('roles', JSON.stringify(dataWithExpiry));
			setLocalRoles(roles);
		}
	}, [isSuccess, roles]);

	return {
		roles: localRoles,
		isLoading: shouldFetch ? isLoading : false,
		isError,
		error,
		refreshRoles: () => {
			localStorage.removeItem('roles');
			setLocalRoles(null);
		},
	};
};
