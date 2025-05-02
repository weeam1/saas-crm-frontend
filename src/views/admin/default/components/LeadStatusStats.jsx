import React, { useEffect, useRef, useCallback } from 'react';

import {
	Chart,
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from 'chart.js';
import { Box, Text } from '@chakra-ui/react';

// Register Chart.js components
Chart.register(
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend
);

// const LeadStatusStats = ({ doc }) => {
// 	const { leadStatusStats: data, totalLeads } = doc;
// 	const chartRef = useRef(null);
// 	const chartInstance = useRef(null);

// 	useEffect(() => {
// 		if (chartRef.current && data.length > 0) {
// 			// Sort data by percentage (descending)
// 			const sortedData = [...data].sort((a, b) => b.percent - a.percent);

// 			// Find max percentage to use as 100% reference
// 			const maxPercentage = Math.max(...sortedData.map((item) => item.percent));
// 			const referencePercentage = Math.ceil(maxPercentage / 10) * 10; // Round up to nearest 10

// 			if (chartInstance.current) {
// 				chartInstance.current.destroy();
// 			}

// 			const ctx = chartRef.current.getContext('2d');

// 			chartInstance.current = new Chart(ctx, {
// 				type: 'bar',
// 				data: {
// 					labels: sortedData.map((item) => item.label),
// 					datasets: [
// 						{
// 							label: 'Percentage',
// 							data: sortedData.map((item) => item.percent),
// 							backgroundColor: sortedData.map((item) => item.bgColor),
// 							borderColor: sortedData.map((item) => `${item.bgColor}80`),
// 							borderWidth: 1,
// 							hoverBackgroundColor: sortedData.map(
// 								(item) => `${item.bgColor}CC`
// 							),
// 							hoverBorderColor: sortedData.map((item) => item.bgColor),
// 							barThickness: 20,
// 						},
// 					],
// 				},
// 				options: {
// 					indexAxis: 'y',
// 					responsive: true,
// 					maintainAspectRatio: false,
// 					plugins: {
// 						legend: {
// 							display: false,
// 						},
// 						title: {
// 							display: true,
// 							text: `Total Leads: ${totalLeads}`,
// 							font: {
// 								size: 16,
// 								weight: 'bold',
// 							},
// 							padding: {
// 								top: 10,
// 								bottom: 30,
// 							},
// 						},
// 						tooltip: {
// 							callbacks: {
// 								label: (context) => {
// 									const item = sortedData[context.dataIndex];
// 									return [
// 										`Count: ${item.value}`,
// 										`Percentage: ${item.percent.toFixed(1)}% (of total)`,
// 										`Relative: ${((item.percent / maxPercentage) * 100).toFixed(1)}% (of max)`,
// 									];
// 								},
// 							},
// 						},
// 						datalabels: {
// 							display: true,
// 							color: (context) => {
// 								// Use textColor from data or calculate contrast color
// 								return sortedData[context.dataIndex].textColor || '#000';
// 							},
// 							anchor: 'center',
// 							align: 'center',
// 							formatter: (value, context) => {
// 								const item = sortedData[context.dataIndex];
// 								return `${item.percent.toFixed(1)}%`;
// 							},
// 							font: {
// 								weight: 'bold',
// 								size: 12,
// 							},
// 						},
// 					},
// 					scales: {
// 						x: {
// 							beginAtZero: true,
// 							max: referencePercentage,
// 							title: {
// 								display: true,
// 								text: 'Percentage (Relative Scale)',
// 								font: {
// 									weight: 'bold',
// 								},
// 							},
// 							grid: {
// 								color: 'rgba(0, 0, 0, 0.05)',
// 							},
// 							ticks: {
// 								callback: (value) => `${value}%`,
// 								stepSize: referencePercentage > 50 ? 10 : 2,
// 							},
// 						},
// 						y: {
// 							grid: {
// 								display: false,
// 							},
// 							ticks: {
// 								color: '#333',
// 								font: {
// 									weight: 500,
// 									size: 12,
// 								},
// 								padding: 10,
// 							},
// 						},
// 					},
// 					animation: {
// 						duration: 800,
// 						easing: 'easeInOutQuad',
// 					},
// 					layout: {
// 						padding: {
// 							top: 40,
// 							left: 20,
// 							right: 20,
// 							bottom: 20,
// 						},
// 					},
// 				},
// 			});
// 		}

// 		return () => {
// 			if (chartInstance.current) {
// 				chartInstance.current.destroy();
// 			}
// 		};
// 	}, [data, totalLeads]);

// 	return (
// 		<Box
// 			position='relative'
// 			height='700px'
// 			width='100%'
// 			bg='white'
// 			borderRadius='md'
// 			p='4'
// 			boxShadow='md'
// 		>
// 			<canvas ref={chartRef} />
// 		</Box>
// 	);
// };

// Register Chart.js components

const LeadStatusStats = ({ doc }) => {
	const { leadStatusStats: data, totalLeads } = doc;
	const chartRef = useRef(null);
	const chartInstance = useRef(null);
	const containerRef = useRef(null);

	// High-DPI setup for crisp rendering
	const setupCanvas = useCallback(() => {
		if (!chartRef.current || !containerRef.current) return;

		const dpr = window.devicePixelRatio || 1;
		const container = containerRef.current;
		const canvas = chartRef.current;

		// Set actual dimensions
		canvas.width = container.clientWidth * dpr;
		canvas.height = container.clientHeight * dpr;

		// Maintain CSS dimensions
		canvas.style.width = `${container.clientWidth}px`;
		canvas.style.height = `${container.clientHeight}px`;

		const ctx = canvas.getContext('2d');
		ctx.scale(dpr, dpr);

		return { ctx, dpr };
	}, []);

	useEffect(() => {
		if (!chartRef.current || !data.length || totalLeads < 1) return;

		const { ctx, dpr } = setupCanvas();
		const sortedData = [...data].sort((a, b) => b.percent - a.percent);
		const maxPercentage = Math.max(...sortedData.map((item) => item.percent));
		const referencePercentage = Math.ceil(maxPercentage / 10) * 10;

		if (chartInstance.current) {
			chartInstance.current.destroy();
		}

		chartInstance.current = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: sortedData.map((item) => item.label),
				datasets: [
					{
						label: 'Percentage',
						data: sortedData.map((item) => item.percent),
						backgroundColor: sortedData.map((item) => item.bgColor),
						borderColor: sortedData.map((item) => `${item.bgColor}80`),
						borderWidth: 1,
						hoverBackgroundColor: sortedData.map((item) => `${item.bgColor}CC`),
						hoverBorderColor: sortedData.map((item) => item.bgColor),
						barThickness: 20,
					},
				],
			},
			options: {
				indexAxis: 'y', // Keep vertical layout
				responsive: true,
				maintainAspectRatio: false,
				devicePixelRatio: dpr, // Ensure HD rendering
				plugins: {
					legend: { display: false },
					title: {
						display: true,
						text: `Total Leads: ${totalLeads}`,
						font: { size: 16, weight: 'bold' },
						padding: { top: 10, bottom: 30 },
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const item = sortedData[context.dataIndex];
								return `Count: ${item.value} (${item.percent.toFixed(1)}%)`;
							},
						},
					},
					datalabels: {
						display: true,
						color: (context) => {
							// Auto-contrast for readability
							const bgColor = sortedData[context.dataIndex].bgColor;
							return getContrastColor(bgColor);
						},
						anchor: 'end',
						align: 'right',
						offset: -30, // Position inside bar end
						formatter: (value) => `${value.toFixed(1)}%`,
						font: { weight: 'bold', size: 12 },
					},
				},
				scales: {
					x: {
						beginAtZero: true,
						max: referencePercentage,
						title: {
							display: true,
							text: 'Percentage (%)',
							font: { weight: 'bold' },
						},
						grid: { color: 'rgba(0, 0, 0, 0.05)' },
						ticks: {
							callback: (value) => `${value}%`,
							stepSize: referencePercentage > 50 ? 10 : 5,
						},
					},
					y: {
						grid: { display: false },
						ticks: {
							color: '#333',
							font: { weight: 500, size: 12 },
							padding: 10,
						},
					},
				},
				animation: {
					duration: 800,
					easing: 'easeInOutQuad',
					onComplete: () => {
						if (chartInstance.current) {
							chartInstance.current.draw(); // Final sharpen
						}
					},
				},
				layout: {
					padding: {
						top: 40,
						left: 20,
						right: 20,
						bottom: 20,
					},
				},
			},
			// plugins: [
			// 	{
			// 		id: 'customCenterLabels',
			// 		afterDatasetsDraw(chart) {
			// 			const {
			// 				ctx,
			// 				data,
			// 				chartArea: { top, bottom, left, right },
			// 			} = chart;

			// 			data.datasets.forEach((dataset, i) => {
			// 				const meta = chart.getDatasetMeta(i);
			// 				meta.data.forEach((bar, index) => {
			// 					const value = dataset.data[index];
			// 					const xPos = bar.x - 20; // Center position
			// 					const yPos = bar.y;

			// 					ctx.fillStyle = getContrastColor(
			// 						dataset.backgroundColor[index]
			// 					);
			// 					ctx.font = 'bold 12px Arial';
			// 					ctx.textAlign = 'right';
			// 					ctx.fillText(`${value.toFixed(1)}%`, xPos, yPos + 4);
			// 				});
			// 			});
			// 		},
			// 	},
			// ],
		});

		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, [data, totalLeads, setupCanvas]);

	// Helper for contrast text color
	function getContrastColor(hexColor) {
		// Convert hex to RGB
		const r = parseInt(hexColor.slice(1, 3), 16);
		const g = parseInt(hexColor.slice(3, 5), 16);
		const b = parseInt(hexColor.slice(5, 7), 16);
		// Calculate luminance
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? '#000000' : '#FFFFFF';
	}

	// Handle resize
	useEffect(() => {
		const handleResize = () => {
			if (chartRef.current && chartInstance.current) {
				setupCanvas();
				chartInstance.current.resize();
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [setupCanvas]);

	return (
		totalLeads > 0 && (
			<Box
				ref={containerRef}
				position='relative'
				height='700px'
				width='100%'
				bg='white'
				borderRadius='2xl'
				p='4'
				boxShadow='sm'
				my='2'
			>
				<Text fontSize='xl' fontWeight='bold' mb={1}>
					Lead Status Summary
				</Text>
				<canvas ref={chartRef} style={{ display: 'block' }} />
			</Box>
		)
	);
};

export default LeadStatusStats;
