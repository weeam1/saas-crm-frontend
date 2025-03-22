import { Box, Text, Avatar, Divider, VStack, Badge } from '@chakra-ui/react';
import { constant } from 'constant';

const AttendanceStats = ({ stats, employee }) => {
	const roleName =
		employee?.role === 'superAdmin'
			? 'Super Admin'
			: employee?.roles[0]?.roleName;

	return (
		<Box bg='white' p={5} borderRadius='md' shadow='sm' position='relative'>
			
			{/* Agency Badge on Top-Right */}
			{employee.agency?.name && (
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
					{employee.agency?.name}
				</Badge>
			)}
			<Box display='flex' mb={4}>
				<Box display='flex' alignItems='center' mb={3}>
					<Avatar
						src={
							employee?.profileImage
								? `${constant['baseUrl']}${employee.profileImage}`
								: ''
						}
						size='lg'
						mr={3}
						name={employee?.fullName}
					/>
					<Box>
						<Text fontWeight='medium' fontSize={{ base: 'md', md: 'lg' }}>
							{employee.fullName}
						</Text>
						<Text color='#C4C4C4' fontWeight='medium' fontSize='sm'>
							{roleName}
						</Text>
						<Text fontWeight='medium' fontSize={{ base: 'sm', md: 'md' }}>
							{employee.salary ? `${employee.salary}/month` : 'Salary N/A'}
						</Text>
						<Text fontWeight='medium' fontSize='12px' color='softGray.200'>
							{employee.username}
						</Text>
					</Box>
				</Box>
			</Box>

			<Divider borderColor='#A07723' my={4} />
			<VStack alignItems='flex-start'>
				<StatsCard label='Total Days' value={stats.totalDaysInMonth} />
				<StatsCard label='Working Days' value={stats.totalWorkingDays} />
				<StatsCard label='Remaining Days' value={stats.remainingDays} />
				<StatsCard label='Total Present' value={stats.totalPresent} />
				<StatsCard label='Total Absent' value={stats.totalAbsent} />
				<StatsCard label='Total Late' value={stats.totalLate} />
				<StatsCard label='Total Deduction' value={stats?.salaryDeduction} />
				<StatsCard label='Per Day Salary' value={stats?.perDaySalary} />
				<StatsCard label='Net Salary' value={stats?.netSalary} />
			</VStack>
		</Box>
	);
};

const StatsCard = ({ label, value }) => (
	<>
		<Text fontSize={{ base: '14px', md: '16px' }} fontWeight='400'>
			{label}:{' '}
			<Text as='span' fontWeight='bold'>
				{value}
			</Text>
		</Text>
	</>
);

export default AttendanceStats;
