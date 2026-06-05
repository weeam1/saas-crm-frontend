import { Box, Text, Avatar, Divider, VStack, Badge, SimpleGrid, Flex } from '@chakra-ui/react';
import { constant } from 'constant';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceStats = ({ stats, employee }) => {
	const colors = useModalColors();
	const roleName =
		employee?.role === 'superAdmin'
			? 'Super Admin'
			: employee?.roles[0]?.roleName;

	const isCommissionOnly = employee?.salaryType === 'COMMISSION_ONLY';

	return (
		<Box bg={colors.bg} p={2} borderRadius='md' shadow={colors.cardShadow} position='relative' border="1px solid" borderColor={colors.borderColor}>
			{/* Agency Badge on Top-Right */}
			{employee.agency?.name && (
				<Badge
					bg={`rgba(212, 175, 55, 0.15)`}
					color={colors.accentGold}
					position='absolute'
					top={2}
					right={2}
					fontSize='10px'
					px={2}
					py={0.5}
					borderRadius='full'
				>
					{employee.agency?.name}
				</Badge>
			)}

			{/* Compact employee info section */}
			<Flex alignItems='center' mb={3}>
				<Avatar
					src={
						employee?.profileImage
							? `${constant['baseUrl']}${employee.profileImage}`
							: ''
					}
					size='md'
					mr={3}
					name={employee?.fullName}
				/>
				<Box>
					<Text
						fontWeight='medium'
						fontSize='md'
						isTruncated
						color={colors.headingText}
					>
						{employee.fullName}
					</Text>
					<Text fontSize='11px' color={colors.mutedText}>
						{employee.username}
					</Text>
					<Text fontSize='11px'>
						{isCommissionOnly ? (
							<Badge
								bg={`rgba(212, 175, 55, 0.15)`}
								color={colors.accentGold}
								fontSize='10px'
								px={2}
								py={0.5}
								borderRadius='full'
							>
								Commission Only
							</Badge>
						) : employee?.salary ? (
							<Text as='span' color={colors.bodyText}>
								{employee.salary}/month
							</Text>
						) : (
							<Text as='span' color={colors.mutedText}>
								Salary N/A
							</Text>
						)}
					</Text>
				</Box>
			</Flex>

			<Divider borderColor={colors.borderColor} my={2} />

			{/* Compact stats grid */}
			<SimpleGrid columns={{ base: 2, md: 3, lg: 8 }} spacing={2} mt={2}>
				<StatsCard label='Total Days' value={stats.totalDaysInMonth ?? 0} colors={colors} />
				<StatsCard label='Working Days' value={stats.totalWorkingDays ?? 0} colors={colors} />
				<StatsCard label='Remaining Days' value={stats.remainingDays ?? 0} colors={colors} />
				<StatsCard label='Present' value={stats.totalPresent ?? 0} colors={colors} />
				<StatsCard label='Absent' value={stats.totalAbsent ?? 0} colors={colors} />
				<StatsCard label='Late' value={stats.totalLate ?? 0} colors={colors} />
				<StatsCard label='Leave' value={stats.totalLeave ?? 0} colors={colors} />
				<StatsCard label='Per Day Salary' value={stats?.perDaySalary ?? 0} colors={colors} />
			</SimpleGrid>
		</Box>
	);
};

const StatsCard = ({ label, value, colors }) => (
	<Box
		bg={colors.bgInput}
		px={2}
		py={1.5}
		borderRadius='md'
		border='1px solid'
		borderColor={colors.borderColor}
		transition='all 0.2s'
		_hover={{ bg: colors.bgInputHover, borderColor: colors.accentGold }}
	>
		<Text fontSize='10px' fontWeight='500' color={colors.mutedText} mb={0.5}>
			{label}
		</Text>
		<Text fontSize='18px' fontWeight='bold' color={colors.headingText} lineHeight='1.2'>
			{value}
		</Text>
	</Box>
);

export default AttendanceStats;