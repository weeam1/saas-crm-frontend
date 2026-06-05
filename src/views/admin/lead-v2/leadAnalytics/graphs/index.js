import React, { useState } from 'react';
// Import individual graph components
import {
	Box,
	SimpleGrid,
	IconButton,
	Text,
	VStack,
	HStack,
	useBreakpointValue,
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
				bg='bg.surface'
				zIndex={9999}
				p={6}
			>
				<HStack justify='space-between' mb={6}>
					<Text fontSize='2xl' fontWeight='bold' color='text.heading'>
						{chartConfig.fullScreenTitle}
					</Text>
					<IconButton
						icon={<BiCollapse />}
						onClick={() => setFullScreenChart(null)}
						aria-label='Exit full screen'
						variant='ghost'
						color='text.muted'
						_hover={{ color: 'text.accent', bg: 'bg.elevated' }}
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
						sx={{
							// >= 0px
							'@media (min-width: 0px)': {
								gridTemplateColumns: '1fr',
							},
							// >= 1280px
							'@media (min-width: 1080px)': {
								gridTemplateColumns: 'repeat(2, 1fr)',
							},
							// >= 3840px (4K)
							'@media (min-width: 3840px)': {
								gridTemplateColumns: 'repeat(3, 1fr)',
							},
						}}
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
				<NoData label='leads summary analytics' />
			)}
		</Box>
	);
};

const ChartContainer = ({
	title,
	chartKey,
	onToggleFullScreen,
	children,
	chartType,
}) => {
	const chartHeight = useBreakpointValue({
		base: 260,
		md: 260,
		lg: 280,
	});

	return (
		<Box
			bg='bg.surface'
			border='1px solid'
			borderColor='border.default'
			borderRadius='xl'
			p={2}
			boxShadow='card'
			position='relative'
			transition='all 0.2s'
			_hover={{ boxShadow: 'goldGlow' }}
		>
			<HStack justify='space-between' mb={4} p='2'>
				<HStack spacing={3}>
					<Text
						fontSize={{ base: 'sm', md: 'lg' }}
						fontWeight='semibold'
						color='text.heading'
					>
						{title}
					</Text>
				</HStack>
				<IconButton
					size='sm'
					icon={<BiExpand />}
					onClick={() => onToggleFullScreen(chartKey)}
					aria-label={`View ${title} in full screen`}
					variant='ghost'
					color='text.muted'
					_hover={{
						color: 'text.accent',
						bg: 'bg.elevated',
						transform: 'scale(1.1)'
					}}
					transition='all 0.2s ease'
				/>
			</HStack>
			<Box height={chartHeight}>{children}</Box>
		</Box>
	);
};

export default Graphs;