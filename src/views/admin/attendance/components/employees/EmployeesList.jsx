import { Box, Grid } from '@chakra-ui/react';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import EmployeeCard from './EmployeeCard';
import EmployeeLoading from './EmployeeLoading';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useFetchItemsQuery } from 'api/apiSlice';

const EmployeesList = ({ data, tab, isLoading, isFetching, queryParams }) => {
	const { data: officeSettings, isLoading: officeSettingsLoading } =
		useFetchItemsQuery(
			{ path: `/attendance/office-settings` },
			{ refetchOnMountOrArgChange: true }
		);

	return isLoading || isFetching || officeSettingsLoading ? (
		<EmployeeLoading size={queryParams.pageSize} />
	) : data && data?.doc ? (
		data?.doc?.length > 0 ? (
			<Box p='4'>
				<Grid
					templateColumns={{
						base: '1fr',
						md: 'repeat(2, 1fr)',
						lg: 'repeat(auto-fill, minmax(360px, 1fr))',
					}}
					height='fit-content'
					gap={4}
				>
					{data?.doc?.map((emp, index) => (
						<EmployeeCard
							index={index}
							emp={emp}
							tab={tab}
							officeSettings={officeSettings?.doc}
						/>
					))}
				</Grid>
			</Box>
		) : (
			<NoData label='employees' />
		)
	) : (
		<ErrorMessage message='Something went wrong on the server side.' />
	);
};

export default EmployeesList;
