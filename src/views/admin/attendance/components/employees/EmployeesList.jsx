import { Box, Grid, Avatar, Text, Badge } from '@chakra-ui/react';
import NotFoundMessage from 'components/Message/NotFoundMessage';
import { constant } from 'constant';
import { Link } from 'react-router-dom';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';

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
						// shadow='md'
						display='flex'
						flexDirection='column'
						justifyContent='center'
						position='relative'
						// boxShadow="0px 0px 60px rgba(217, 154, 54, 0.2)"
						// boxShadow="0px 0px 70px rgb(255 215 0 / 30%)"
						border='1px solid rgb(255 215 0 / 50%)'
					>
						{/* Agency Badge on Top-Right */}
						{emp.agencyName && (
							<Badge
								colorScheme='brand'
								position='absolute'
								top={2}
								right={2}
								fontSize='12px'
								px={3}
								py={1}
								borderRadius='full'
							>
								{emp.agencyName}
							</Badge>
						)}
						<Box display='flex' alignItems='center' mb={3}>
							<Avatar
								src={
									emp?.profileImage
										? `${constant['baseUrl']}${emp.profileImage}`
										: ''
								}
								size='lg'
								mr={3}
								name={emp?.fullName}
							/>
							<Box>
								<Text
									fontWeight='medium'
									fontSize='24px'
									maxWidth={{ base: 'full', md: '250px' }}
									isTruncated
								>
									{emp.fullName}
								</Text>

								<Text color='#C4C4C4' fontWeight='medium' fontSize='14px'>
									{tab === 'admins' ? 'Admin' : emp.roleName}
								</Text>
								<Text fontWeight='medium' fontSize='16px'>
									{emp.salary ? `${emp.salary}/month` : 'Salary N/A'}
								</Text>
								<Text fontWeight='medium' fontSize='12px' color='softGray.200'>
									{emp.username}
								</Text>
							</Box>
						</Box>
					</Box>
				))}
			</Grid>
		</Box>
	) : (
		<NoData label='employees' />
	);
};

export default EmployeesList;
