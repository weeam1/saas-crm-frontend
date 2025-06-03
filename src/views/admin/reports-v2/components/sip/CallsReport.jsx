'use client';

import { useEffect, useRef, useState } from 'react';
import {
	Box,
	Flex,
	Heading,
	Text,
	Select,
	useColorModeValue,
	HStack,
	VStack,
	Square,
} from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { fetchTotalTimeCallsRecordStats } from '../../../../../services/sip/index';
import TopFilter from '../TopFilter';
import { dayOptions } from '../../helpers';

const formatSeconds = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	return `${hrs > 0 ? `${hrs} hrs ` : ''}${mins} min${secs > 0 ? ` ${secs}s` : ''}`;
};

const CallsReport = () => {
	const [days, setDays] = useState(30);
	const [uniqueCalls, setUniqueCalls] = useState(0);
	const [avgMinutes, setAvgMinutes] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);
	const [chartData, setChartData] = useState({
		labels: [],
		totalTime: [],
		uniqueCalls: [],
	});

	const bgColor = useColorModeValue('white', 'gray.800');
	const chartRef = useRef(null);
	const chartInstance = useRef(null);

	const updateChart = (data) => {
		const labels = data.daily.map((d) => moment(d.date).format('MMMM D'));
		const totalTime = data.daily.map(
			(d) => parseFloat(d.duration.replace('s', '')) / 60
		); // in minutes
		const uniqueCalls = data.daily.map((d) => d.joinedCount);

		setChartData({ labels, totalTime, uniqueCalls });

		if (chartInstance.current) {
			chartInstance.current.destroy();
		}

		const ctx = chartRef.current.getContext('2d');
		chartInstance.current = new Chart(ctx, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: 'Total Time (minutes)',
						data: totalTime,
						backgroundColor: '#4299E1',
						barPercentage: 0.5,
						categoryPercentage: 0.5,
						order: 2,
						yAxisID: 'y',
					},
					{
						label: 'Unique Calls',
						data: uniqueCalls,
						borderColor: '#38A169',
						backgroundColor: 'transparent',
						borderWidth: 2,
						type: 'line',
						pointRadius: 0,
						tension: 0,
						order: 2,
						yAxisID: 'y1',
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						grid: { display: false, drawBorder: false },
						ticks: {
							font: { size: 12 },
							padding: 10,
							autoSkip: false,
							maxRotation: 25,
							minRotation: 25,
						},
						border: { display: false },
					},
					y: {
						position: 'left',
						beginAtZero: true,
						suggestedMax: Math.max(...totalTime) + 10 || 10,
						ticks: {
							stepSize: 5,
							callback: (value) => value,
						},
						grid: { color: '#E2E8F0', drawBorder: false },
						border: { display: false },
					},
					y1: {
						position: 'right',
						beginAtZero: true,
						suggestedMax: Math.max(...uniqueCalls) + 15 || 15,
						ticks: {
							stepSize: 10,
							callback: (value) => value,
						},
						grid: { display: false, drawBorder: false },
						border: { display: false },
					},
				},
				plugins: {
					legend: { display: false },
					tooltip: { enabled: true },
				},
			},
		});
	};

	useEffect(() => {
		const getData = async () => {
			try {
				const data = await fetchTotalTimeCallsRecordStats(days);
				setUniqueCalls(data.unique_calls);
				setAvgMinutes(data.average_minutes);
				const durationInSeconds = parseFloat(
					data.allTime.duration.replace('s', '')
				);
				setTotalSeconds(durationInSeconds);
				updateChart(data);
			} catch (error) {
				console.error('Error loading chart data:', error);
			}
		};

		getData();

		return () => {
			if (chartInstance.current) chartInstance.current.destroy();
		};
	}, [days]);

	return (
		<Box p={8} bg={bgColor} rounded='md' shadow='sm'>
			<Flex justify='space-between' align='center' mb={8}>
				<Text fontSize='2xl' fontWeight='bold'>
					Calls Report
				</Text>

				<TopFilter view={days} setView={setDays} options={dayOptions} />
			</Flex>

			<Flex justify='space-between' mb={10} wrap='wrap'>
				<VStack align='flex-start' spacing={1} minW='200px' mb={4}>
					<HStack>
						<Square size='16px' bg='blue.400' />
						<Text color='gray.600' fontWeight='medium'>
							Total Time
						</Text>
					</HStack>
					<Text fontSize='2xl' fontWeight='bold'>
						{formatSeconds(totalSeconds)}
					</Text>
				</VStack>

				<VStack align='flex-start' spacing={1} minW='200px' mb={4}>
					<HStack>
						<Box w='16px' h='2px' bg='green.400' my='auto' />
						<Text color='gray.600' fontWeight='medium'>
							Unique Calls
						</Text>
					</HStack>
					<Text fontSize='2xl' fontWeight='bold'>
						{uniqueCalls}
					</Text>
				</VStack>
				<VStack align='flex-start' spacing={1} minW='200px' mb={4}>
					<Text color='gray.600' fontWeight='medium'>
						Average Call Duration
					</Text>
					<Text fontSize='2xl' fontWeight='bold'>
						{formatSeconds(avgMinutes * 60)}
					</Text>
				</VStack>
			</Flex>

			<Box h='300px' w='100%'>
				<canvas ref={chartRef} />
			</Box>
		</Box>
	);
};

export default CallsReport;
