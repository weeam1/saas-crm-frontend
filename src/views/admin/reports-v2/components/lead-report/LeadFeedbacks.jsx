import { Box, Flex, Stack, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import LeadStatusChart from './LeadStatusChart';
import { useLeadReportFilters } from 'hooks/reports/useLeadReportFilters';
import { useMemo, useState } from 'react';
import LeadMainStatusChart from './LeadMainStatusChart';

const LeadFeedbacks = () => {
	const { filters } = useLeadReportFilters();

	const [view, setView] = useState('top5');

	const viewOptions = ['top5', 'top10', 'all'];

	// Inside your component
	const queryParams = useMemo(() => {
		const params = {};

		// Only add userId if either agentId or managerId exists
		const userId = filters.agentId || filters.managerId;
		if (userId) {
			params.userId = userId;
		}

		return params;
	}, [filters.agentId, filters.managerId]);

	return (
		<Box bg='white' my='2' rounded='md' shadow='sm' p='4'>
			<Flex
				justify='space-between'
				align='center'
				mb={4}
				gap={3}
				flexDir={{ base: 'column', md: 'row' }}
			>
				<Text fontSize='2xl' fontWeight='bold' mb='2'>
					Lead Feedbacks
				</Text>

				<Tabs
					variant='soft-rounded'
					colorScheme='brand'
					index={viewOptions.indexOf(view)}
					onChange={(index) => setView(viewOptions[index])}
				>
					<TabList>
						{viewOptions.map((label, i) => (
							<Tab
								key={i}
								sx={{
									_hover: {
										boxShadow: 'none',
										outline: 'none',
										border: 'none',
									},
									_focus: {
										boxShadow: 'none',
										outline: 'none',
										border: 'none',
									},
									_focusVisible: {
										boxShadow: 'none',
										outline: 'none',
										border: 'none',
									},
								}}
							>
								{label === 'top5'
									? 'Top 5'
									: label === 'top10'
										? 'Top 10'
										: 'All'}
							</Tab>
						))}
					</TabList>
				</Tabs>
			</Flex>

			<Stack
				sx={{
					flexDirection: 'row',
					'@media (max-width: 1050px)': {
						flexDirection: 'column',
					},
				}}
				gap='1'
				align='stretch'
				justify='space-between'
			>
				<LeadStatusChart queryParams={queryParams} view={view} />
				<LeadMainStatusChart queryParams={queryParams} view={view} />
			</Stack>
		</Box>
	);
};

export default LeadFeedbacks;
