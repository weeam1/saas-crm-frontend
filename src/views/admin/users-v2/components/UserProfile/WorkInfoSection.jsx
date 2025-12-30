import { Grid, GridItem, Text, VStack, Badge, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { getSalaryType } from './../../../../../schema/userSchema';

const WorkInfoSection = ({ user }) => {
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

	const financialItems = [
		{ label: 'Monthly Target', value: user.target || 'N/A' },
		{ label: 'Salary', value: user.salary || 'N/A' },
		{
			label: 'Commission',
			value: user?.commission ? `${user.commission}%` : 'N/A',
		},
		{ label: 'Incentive', value: user.incentive || 'N/A' },
		{ label: 'Coins', value: user.coins?.toLocaleString() || 'N/A' },
	];

	return (
		<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
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
