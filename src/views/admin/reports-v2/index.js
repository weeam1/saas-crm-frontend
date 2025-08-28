import { Box, Text } from '@chakra-ui/react';

import LeadReport from './components/lead-report';
import CallsRecordGraph from './components/sip';
import AttendanceReport from './components/attendance';
import HiringReport from './components/hiring';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from 'hooks/usePermissions';

const Reports = () => {
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('reports')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box>
			<Box mx='2' bg='white' p='6' rounded='lg' shadow='sm' mb='6'>
				<Text
					fontSize={{ base: 'md', md: 'lg', lg: '2xl', xl: '3xl' }}
					fontWeight='bold'
					mb='2'
				>
					Reports Overview
				</Text>
				<Text
					color='gray.600'
					fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
					maxWidth={{ base: '100%', md: '1000px' }}
				>
					Real-time reporting module for analyzing leads, attendance, team
					performance, hiring metrics, and call data. Enables actionable
					insights to optimize recruitment, operations, and team efficiency.
				</Text>
			</Box>

			{/* lead report  */}
			<LeadReport />

			{/* Sip  */}
			<CallsRecordGraph />

			{/* Hiring */}
			<HiringReport />

			{/* Attendance */}
			<AttendanceReport />
		</Box>
	);
};

export default Reports;
