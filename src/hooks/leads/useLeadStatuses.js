import { useFetchItemsQuery } from 'api/apiSlice';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLeadStatuses } from './../../redux/leadsSlice';

export const useLeadStatuses = () => {
	const dispatch = useDispatch();

	const leads = useSelector((state) => state.leads);

	const { leadStatuses, leadStatusMaps } = leads;

	const { data, isLoading, isFetching, isError, error, refetch } =
		useFetchItemsQuery(
			{ path: '/lead/statuses' },
			{
				skip: leadStatuses?.length > 0,
				refetchOnMountOrArgChange: false,
				refetchOnFocus: true,
			},
		);

	// Store in Redux when first loaded
	useEffect(() => {
		if (!leadStatuses?.length && data?.data?.length) {
			dispatch(setLeadStatuses(data));
		}
	}, [data, dispatch]);

	const getSubStatuses = useCallback(
		(mainStatus) => {
			return (
				leadStatuses.find((status) => status.value === mainStatus)?.statuses ||
				[]
			);
		},
		[leadStatuses],
	);

	const allSubStatuses = useMemo(() => {
		return leadStatuses.flatMap((status) => status.statuses || []);
	}, [leadStatuses]);

	return {
		leadStatuses,
		allSubStatuses,
		isLoading: isLoading || isFetching,
		isError,
		error,
		leadStatusMaps,
		refresh: refetch,
		getSubStatuses,
	};
};
