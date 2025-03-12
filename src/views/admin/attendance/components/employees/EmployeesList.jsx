import { Box, Grid, Avatar, Text } from '@chakra-ui/react';
import NotFoundMessage from 'components/Message/NotFoundMessage';
import { constant } from 'constant';
import { Link } from 'react-router-dom';

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
					<Box
						key={index}
						as={Link}
						to={`/attendance/employees/${emp._id}`}
						px={4}
						py='8'
						borderRadius='lg'
						bg='white'
						shadow='md'
						display='flex'
						flexDirection='column'
						justifyContent='center'
					>
						<Box display='flex' alignItems='center' mb={3}>
							<Avatar
								src={`${constant['baseUrl']}${emp.profileImage}`}
								size='lg'
								bg='brand.500'
								mr={3}
							/>
							<Box>
								<Text fontWeight='medium' fontSize='24px'>
									{emp.fullName}
								</Text>
								<Text color='#C4C4C4' fontWeight='medium' fontSize='18px'>
									{tab === 'admins' ? 'Admin' : emp.roleName}
								</Text>
								<Text fontWeight='medium' fontSize='16px'>
									{emp.salary ? `${emp.salary}/month` : 'Salary N/A'}
								</Text>
							</Box>
						</Box>
					</Box>
				))}
			</Grid>
		</Box>
	) : (
		<NotFoundMessage message='Employees not found!' />
	);
};

export default EmployeesList;
