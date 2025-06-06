import { Link } from 'react-router-dom';
import { Box, Avatar, Text, Badge } from '@chakra-ui/react';
import { constant } from 'constant';
import EmployeeAttendanceMark from './EmployeeAttendanceMark';

const EmployeeCard = ({ emp, index, tab, officeSettings, loginRole }) => {
	const agencyId = emp?.agency?._id;

	const officeSetting = officeSettings?.find(
		(office) => office?.agency?._id === agencyId
	);

	return (
		<Box
			key={index}
			px={4}
			py='2'
			borderRadius='lg'
			bg='white'
			display='flex'
			flexDirection='column'
			justifyContent='center'
			position='relative'
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
			<Box
				as={Link}
				to={`/attendance/employees/${emp._id}`}
				display='flex'
				alignItems='center'
				mb={3}
				p='2'
				rounded='sm'
				_hover={{ bg: 'gray.100' }}
			>
				<Avatar
					src={
						emp?.profileImage ? `${constant['baseUrl']}${emp.profileImage}` : ''
					}
					size='lg'
					mr={3}
					name={emp?.fullName}
				/>
				<Box>
					<Text
						fontWeight='medium'
						fontSize={{ base: '16px', md: '24px' }}
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

			{(loginRole === 'superAdmin' || loginRole === 'HR') && (
				<>
					{agencyId && officeSetting ? (
						<EmployeeAttendanceMark
							employeeId={emp._id}
							todayRecord={emp.todayAttendanceRecord}
							officeSetting={officeSetting}
						/>
					) : (
						<Box
							alignSelf='center'
							p='2'
							bg='gray.100'
							color='red.400'
							rounded='sm'
							as={Link}
							to={`/userView/${emp._id}`}
							_hover={{ textDecoration: 'underline' }}
						>
							Add Employee agency
						</Box>
					)}
				</>
			)}
		</Box>
	);
};

export default EmployeeCard;
