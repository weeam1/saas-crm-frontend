import { Grid, GridItem, Text, VStack, Badge, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { getSalaryType } from './../../../../../schema/userSchema';
import { useMemo } from 'react';

const WorkInfoSection = ({ user }) => {
	const salaryType = getSalaryType(user?.salaryType);

	const workItems = [
		{ label: 'Agency', value: user.agency?.name || 'Not assigned' },
		{
			label: 'Salary Type',
			value: getSalaryType(user.salaryType)?.label || 'Not set',
		},
		{
			label: 'Commission Type',
			value: user.commissionType?.replace('_', ' ') || 'Not set',
		},
		{
			label: 'Education Degree',
			value: user.educationDegree || 'Not specified',
		},
		// { label: 'Currency', value: user.currency },
	];

	const financialItems = useMemo(() => {
		const items = [
			{
				label: 'Monthly Target',
				value: user.target ?? 'N/A',
			},
		];

		if (salaryType?.hasBaseSalary) {
			items.push({
				label: 'Salary',
				value: user.salary ?? 'N/A',
			});
		}

		if (salaryType?.value === 'COMMISSION_ONLY') {
			items.push({
				label: 'Virtual Salary',
				value: user.virtualSalary ?? 'N/A',
			});
		}

		if (salaryType?.hasCommission) {
			items.push({
				label: 'Commission',
				value:
					user.commission !== null && user.commission !== undefined
						? `${user.commission}%`
						: 'N/A',
			});
		}

		if (salaryType?.hasIncentive) {
			items.push({
				label: 'Incentive',
				value: user.incentive ?? 'N/A',
			});
		}

		items.push({
			label: 'Coins',
			value:
				user.coins !== null && user.coins !== undefined
					? user.coins.toLocaleString()
					: 'N/A',
		});

		return items;
	}, [
		user.target,
		user.salary,
		user.virtualSalary,
		user.commission,
		user.incentive,
		user.coins,
		salaryType?.hasBaseSalary,
		salaryType?.hasCommission,
		salaryType?.hasIncentive,
		salaryType?.value,
	]);

	return (
		<Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
			<GridItem bg='gray.50' p={2} borderRadius='md'>
				<VStack align='start' spacing={4}>
					<Text fontSize='lg' fontWeight='semibold' color='gray.700'>
						Employment Details
					</Text>
					{workItems.map((item, index) => (
						<Flex
							key={index}
							flexDir={{ base: 'column', md: 'row' }}
							justify='space-between'
							w='full'
						>
							<Text
								fontSize={{ base: 'sm', md: 'md' }}
								fontWeight='medium'
								color='gray.500'
							>
								{item.label}
							</Text>
							<Text
								fontSize={{ base: 'sm', md: 'md' }}
								fontWeight='medium'
								color='gray.600'
							>
								{item.value}
							</Text>

							{/* <Badge colorScheme='blue' fontSize='sm'>
								{item.value}
							</Badge> */}
						</Flex>
					))}
				</VStack>
			</GridItem>

			<GridItem bg='gray.50' p={2} borderRadius='md'>
				<VStack align='start' spacing={4}>
					<Text fontSize='lg' fontWeight='semibold' color='gray.700'>
						Financial Details
					</Text>
					{financialItems.map((item, index) => (
						<Flex
							key={index}
							flexDir={{ base: 'column', md: 'row' }}
							justify='space-between'
							w='full'
						>
							<Text
								fontSize={{ base: 'sm', md: 'md' }}
								fontWeight='medium'
								color='gray.500'
							>
								{item.label}
							</Text>
							<Text
								fontSize={{ base: 'sm', md: 'md' }}
								fontWeight='medium'
								color='gray.800'
							>
								{item.value}
							</Text>
						</Flex>
					))}
				</VStack>
			</GridItem>
		</Grid>
	);
};

WorkInfoSection.propTypes = {
	user: PropTypes.object.isRequired,
};

export default WorkInfoSection;
