import { Link } from 'react-router-dom';
import { Box, Avatar, Text, Badge } from '@chakra-ui/react';
import { constant } from 'constant';
import EmployeeAttendanceMark from './EmployeeAttendanceMark';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const EmployeeCard = ({ emp, index, tab, officeSettings, loginRole }) => {
	const colors = useModalColors();
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
			bg={colors.bg}
			display='flex'
			flexDirection='column'
			justifyContent='center'
			position='relative'
			border={`1px solid ${colors.accentGold}50`}
			boxShadow={colors.cardShadow}
			transition='all 0.2s ease'
			_hover={{
				transform: 'translateY(-2px)',
				boxShadow: colors.modalShadow,
				borderColor: colors.accentGold,
			}}
		>
			{/* Agency Badge on Top-Right */}
			{emp.agencyName && (
				<Badge
					bg={`rgba(212, 175, 55, 0.15)`}
					color={colors.accentGold}
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
				_hover={{ bg: colors.bgInput }}
				transition='all 0.2s ease'
			>
				<Avatar
					src={
						emp?.profileImage ? `${constant['baseUrl']}${emp.profileImage}` : ''
					}
					size='lg'
					mr={3}
					name={emp?.fullName}
				/>
				<Box py='2'>
					<Text
						fontWeight='medium'
						fontSize={{ base: '16px', md: '24px' }}
						maxWidth={{ base: '140px', md: '200px' }}
						isTruncated
						color={colors.headingText}
					>
						{emp.fullName}
					</Text>

					<Text color={colors.mutedText} fontWeight='medium' fontSize='14px'>
						{tab === 'admins' ? 'Admin' : emp.roleName}
					</Text>
					<Text fontWeight='medium' fontSize='16px' color={colors.bodyText}>
						{emp.salary ? `${emp.salary}/month` : 'Salary N/A'}
					</Text>
					<Text fontWeight='medium' fontSize='12px' color={colors.mutedText}>
						{emp.username}
					</Text>
				</Box>
			</Box>

			<>
				{agencyId && officeSetting ? (
					<EmployeeAttendanceMark
						employeeId={emp._id}
						todayRecord={emp.todayAttendanceRecord}
						officeSetting={officeSetting}
						employeeName={emp?.fullName || ''}
					/>
				) : (
					<Text
						alignSelf='center'
						p='2'
						bg={colors.bgInput}
						color={colors.badgeErrorText}
						rounded='sm'
					>
						Agency or settings is missing
					</Text>
				)}
			</>
		</Box>
	);
};

export default EmployeeCard;