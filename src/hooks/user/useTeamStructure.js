import { useEffect, useState, useCallback, useMemo } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setTeamStructure } from './../../redux/usersSlice';

/**
 * Custom hook for fetching and caching team structure
 * Automatically uses Redux cache if available
 */
export const useTeamStructure = () => {
	const dispatch = useDispatch();
	const cachedTeam = useSelector((state) => state.users.team);

	// Local state for reactive updates
	const [teamData, setTeamData] = useState(cachedTeam ?? []);

	// Determine if we need to fetch
	const shouldFetch = !cachedTeam?.length;

	const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
		useFetchItemsQuery(
			shouldFetch ? { path: '/v2/user/team-structure' } : skipToken
		);

	// Sync fetched data with local state and Redux cache
	useEffect(() => {
		if (isSuccess && data?.data) {
			setTeamData(data.data);
			dispatch(setTeamStructure(data.data));
		}
	}, [isSuccess, data, dispatch]);

	// Expose a stable callback to refresh team structure
	const refreshTeam = useCallback(() => {
		refetch();
	}, [refetch]);

	// Memoized output for performance
	const result = useMemo(
		() => ({
			team: teamData,
			isLoading: shouldFetch ? isLoading : false,
			isFetching,
			isError,
			error,
			refreshTeam,
		}),
		[teamData, isLoading, isFetching, isError, error, refreshTeam, shouldFetch]
	);

	return result;
};
