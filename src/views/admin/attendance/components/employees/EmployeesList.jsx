import { Box, Grid } from '@chakra-ui/react';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import EmployeeCard from './EmployeeCard';

const EmployeesList = ({ employees, tab }) => {
	return employees?.length > 0 ? (
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
				{employees?.map((emp, index) => (
					<EmployeeCard index={index} emp={emp} tab={tab} />
				))}
			</Grid>
		</Box>
	) : (
		<NoData label='employees' />
	);
};

export default EmployeesList;
