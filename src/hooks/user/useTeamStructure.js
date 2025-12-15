import { useEffect, useState, useCallback, useMemo } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setTeamStructure } from './../../redux/usersSlice';
import { mergeSort } from 'utils/helpers';

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

	const allAgents = useMemo(
		() =>
			teamData?.flatMap(
				(manager) =>
					manager?.teamLeaders?.flatMap((tl) => tl.agents ?? []) ?? []
			) ?? [],
		[teamData]
	);
	const allTeamLeaders = useMemo(
		() => teamData?.flatMap((manager) => manager?.teamLeaders || []) ?? [],
		[teamData]
	);

	// Filter agents related to the assigned manager + team lead
	const teamIndex = useMemo(() => {
		const byManagerTeamLead = new Map(); // managerId:teamLeadId -> agents[]
		const byManager = new Map(); // managerId -> agents[]
		const teamLeadsByManager = new Map(); // managerId -> teamLeaders[]

		for (const manager of teamData ?? []) {
			const allAgents = [];
			const teamLeads = manager.teamLeaders ?? [];

			for (const tl of teamLeads) {
				const agents = mergeSort(tl.agents ?? []);
				byManagerTeamLead.set(`${manager._id}:${tl._id}`, agents);
				allAgents.push(...agents);
			}

			byManager.set(manager._id, mergeSort(allAgents));
			teamLeadsByManager.set(manager._id, teamLeads);
		}

		return { byManagerTeamLead, byManager, teamLeadsByManager };
	}, [teamData]);

	const getAgentsByManagerAndTL = useCallback(
		(managerId, teamLeadId) =>
			teamIndex.byManagerTeamLead.get(`${managerId}:${teamLeadId}`) ?? [],
		[teamIndex]
	);

	const getAgentsByManager = useCallback(
		(managerId) => teamIndex.byManager.get(managerId) ?? [],
		[teamIndex]
	);

	const getTeamLeadsByManager = useCallback(
		(managerId) => teamIndex.teamLeadsByManager.get(managerId) ?? [],
		[teamIndex]
	);

	// Memoized output for performance
	const result = useMemo(
		() => ({
			team: teamData,
			allAgents,
			allTeamLeaders,
			getTeamLeadsByManager,
			getAgentsByManagerAndTL,
			getAgentsByManager,
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
