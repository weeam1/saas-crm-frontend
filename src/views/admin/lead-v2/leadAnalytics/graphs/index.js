import React, { useState } from 'react';
// Import individual graph components
import {
	Box,
	SimpleGrid,
	IconButton,
	useColorModeValue,
	Text,
	VStack,
	HStack,
	useBreakpointValue,
	Select,
	Button,
} from '@chakra-ui/react';
import { BiCollapse, BiExpand } from 'react-icons/bi';
// Import chart components
import LeadStatusPieChart from './charts/LeadStatusPieChart';
import LeadAssignmentBarChart from './charts/LeadAssignmentBarChart';
import MonthlyLeadsChart from './charts/MonthlyLeadsChart';
// import LeadTimelineChart from '../charts/LeadTimelineChart';
// import PerformanceRadarChart from './charts/PerformanceRadarChart';
// import PerformanceDemographicChart from './charts/PerformanceDemographicChart';
import KeyMetricsBarChart from './charts/KeyMetricsBarChart';

import { CHART_CONFIG, CHART_GRID_LAYOUT } from './chartsConfig';
import CardShimmer from 'components/loading/CardShimmer';
import NoData from 'components/Message/NoData';

// Chart component mapping
const CHART_COMPONENTS = {
	LeadStatusPieChart,
	LeadAssignmentBarChart,
	MonthlyLeadsChart,
	KeyMetricsBarChart,
	// PerformanceDemographicChart,
	// PerformanceRadarChart,
	// LeadTimelineChart,
};

const Graphs = ({ summary, isLoading, layout = 'default' }) => {
	const [fullScreenChart, setFullScreenChart] = useState(null);
	const [activeLayout, setActiveLayout] = useState(layout);
	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const chartKeys =
		CHART_GRID_LAYOUT[activeLayout] || CHART_GRID_LAYOUT.default;

	const chartProps = {
		summary,
		isFullScreen: fullScreenChart !== null,
		onToggleFullScreen: setFullScreenChart,
	};

	// Full screen renderer - SCALABLE
	if (fullScreenChart !== null) {
		const chartConfig = CHART_CONFIG[fullScreenChart];
		const ChartComponent = CHART_COMPONENTS[chartConfig.component];

		return (
			<Box
				position='fixed'
				top={0}
				left={0}
				right={0}
				bottom={0}
				bg={bgColor}
				zIndex={9999}
				p={6}
			>
				<HStack justify='space-between' mb={6}>
					<Text fontSize='2xl' fontWeight='bold'>
						{chartConfig.fullScreenTitle}
					</Text>
					<IconButton
						icon={<BiCollapse />}
						onClick={() => setFullScreenChart(null)}
						aria-label='Exit full screen'
					/>
				</HStack>
				<Box height='calc(100vh - 120px)'>
					<ChartComponent {...chartProps} />
				</Box>
			</Box>
		);
	}

	return (
		<Box py='2'>
			{/* Layout Controls */}
			{/* <HStack justify='space-between' mb={6}>
				<Text fontSize='xl' fontWeight='bold'>
					Analytics Dashboard
				</Text>
				<Box>
					<Box>
						<Select
							size='sm'
							value={activeLayout}
							onChange={(e) => setActiveLayout(e.target.value)}
							width='auto'
						>
							<option value='default'>Default View</option>
							<option value='detailed'>Detailed View</option>
						</Select>
					</Box>
				</Box>
			</HStack> */}

			{isLoading ? (
				<CardShimmer
					count={chartKeys.length}
					height='300px'
					columns={{
						base: 1,
						md: 2,
						xl: chartKeys.length >= 2 ? 2 : 1,
						'2xl': chartKeys.length >= 2 ? 2 : 1,
					}}
				/>
			) : summary ? (
				<>
					{/* Dynamic Chart Grid */}
					<SimpleGrid
						columns={{ base: 1, md: 2, xl: chartKeys.length >= 2 ? 2 : 1 }}
						gap='2'
					>
						{chartKeys.map((chartKey) => {
							const chartConfig = CHART_CONFIG[chartKey];
							const ChartComponent = CHART_COMPONENTS[chartConfig.component];

							return (
								<ChartContainer
									key={chartKey}
									title={chartConfig.title}
									chartKey={chartKey}
									onToggleFullScreen={setFullScreenChart}
									chartType={chartConfig.type}
								>
									<ChartComponent {...chartProps} />
								</ChartContainer>
							);
						})}
					</SimpleGrid>
				</>
			) : (
				<NoData label='leads summary analtyics' />
			)}
		</Box>
	);
};

// Enhanced Chart Container with type indicators

const ChartContainer = ({
	title,
	chartKey,
	onToggleFullScreen,
	children,
	chartType,
}) => {
	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const chartHeight = useBreakpointValue({
		base: 220,
		md: 250,
		lg: 280,
	});

	const getChartTypeColor = (type) => {
		const colors = {
			pie: 'blue',
			bar: 'green',
			area: 'purple',
			radar: 'orange',
			line: 'teal',
		};
		return colors[type] || 'gray';
	};

	return (
		<Box
			bg={bgColor}
			border='1px solid'
			borderColor={borderColor}
			borderRadius='lg'
			p={2}
			boxShadow='sm'
			position='relative'
			transition='all 0.2s'
			// _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
			_hover={{ boxShadow: 'md' }}
		>
			<HStack justify='space-between' mb={4} p='2'>
				<HStack spacing={3}>
					<Text fontSize={{ base: 'sm', md: 'lg' }} fontWeight='semibold'>
						{title}
					</Text>
					{/* <Box
						px={2}
						py={1}
						borderRadius='md'
						bg={`${getChartTypeColor(chartType)}.100`}
						color={`${getChartTypeColor(chartType)}.800`}
						fontSize='xs'
						fontWeight='medium'
					>
						{chartType?.toUpperCase()}
					</Box> */}
				</HStack>
				<IconButton
					size='sm'
					icon={<BiExpand />}
					onClick={() => onToggleFullScreen(chartKey)}
					aria-label={`View ${title} in full screen`}
					variant='ghost'
				/>
			</HStack>
			<Box height={chartHeight}>{children}</Box>
		</Box>
	);
};

export default Graphs;
