import { Box } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';

const SafeResponsiveChart = ({
	children,
	height = '300px',
	width = '100%',
}) => {
	const [dimensions, setDimensions] = useState({
		width: '100%',
		height: '100%',
	});
	const containerRef = useRef(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			try {
				const { width, height } = entries[0].contentRect;
				setDimensions({ width, height });
			} catch (error) {
				console.warn('ResizeObserver error:', error);
			}
		});

		resizeObserver.observe(containerRef.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<Box ref={containerRef} width={width} height={height} position='relative'>
			<ResponsiveContainer {...dimensions} debounce={250}>
				{children}
			</ResponsiveContainer>
		</Box>
	);
};

export default SafeResponsiveChart;
