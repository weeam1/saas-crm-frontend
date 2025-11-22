import { useFetchItemsQuery } from 'api/apiSlice';

function useCurrency() {
	const { data, isLoading } = useFetchItemsQuery(
		{ path: '/currencies' },
		{
			refetchOnReconnect: true,
			refetchOnMountOrArgChange: true,
		}
	);

	return {
		isLoading,
		currencies: data?.doc || null,
	};
}

export default useCurrency;
