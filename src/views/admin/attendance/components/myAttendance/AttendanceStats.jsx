import { Box, Text, Avatar, Divider } from '@chakra-ui/react';
import { constant } from 'constant';

const AttendanceStats = ({ stats, employee }) => {
	const roleName =
		employee?.role === 'superAdmin'
			? 'Super Admin'
			: employee?.roles[0]?.roleName;

	console.log({ stats });

	return (
		<Box bg='white' p={5} borderRadius='md' shadow='sm'>
			<Box display='flex' mb={4}>
				<Avatar
					src={`${constant['baseUrl']}${employee.profileImage}`}
					size='lg'
					bg='brand.500'
					mr={3}
				/>
				<Box display='flex' alignItems='center' mb={3}>
					<Avatar
						src={`${constant['baseUrl']}${employee.profileImage}`}
						size='lg'
						bg='brand.500'
						mr={3}
					/>
					<Box>
						<Text fontWeight='medium' fontSize='24px'>
							{employee.fullName}
						</Text>
						<Text color='#C4C4C4' fontWeight='medium' fontSize='18px'>
							{roleName}
						</Text>
						<Text fontWeight='medium' fontSize='16px'>
							{employee.salary ? `${employee.salary}/month` : 'Salary N/A'}
						</Text>
					</Box>
				</Box>
			</Box>

			<Divider borderColor='#A07723' my={4} />
			<Box>
				<Text fontSize={{ base: '14px', md: '16px' }} fontWeight='400'>
					Total Days:{' '}
					<Text as='span' fontWeight='bold'>
						{stats.totalDaysInMonth}
					</Text>
				</Text>
				<Text fontSize={{ base: '14px', md: '16px' }} fontWeight='400'>
					Working Days:{' '}
					<Text as='span' fontWeight='bold'>
						{stats.totalWorkingDays}
					</Text>
				</Text>
				<Text fontSize={{ base: '14px', md: '16px' }} fontWeight='400'>
					Total Present:{' '}
					<Text as='span' fontWeight='bold'>
						{stats.totalPresent}
					</Text>
				</Text>
				<Text fontSize={{ base: '14px', md: '16px' }} fontWeight='400'>
					Absent:{' '}
					<Text as='span' fontWeight='bold'>
						{stats.totalAbsent}
					</Text>
				</Text>
				<Text fontSize={{ base: '14px', md: '16px' }} fontWeight='400'>
					Remaining Days:{' '}
					<Text as='span' fontWeight='bold'>
						{stats.remainingDays}
					</Text>
				</Text>
				<Text fontSize={{ base: '14px', md: '16px' }} fontWeight='400'>
					Late:{' '}
					<Text as='span' fontWeight='bold'>
						{stats.totalLate}
					</Text>
				</Text>
			</Box>
		</Box>
	);
};

export default AttendanceStats;
