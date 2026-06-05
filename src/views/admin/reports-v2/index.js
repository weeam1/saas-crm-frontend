import { Box, Text } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

import LeadReport from './components/lead-report';
import CallsRecordGraph from './components/sip';
import AttendanceReport from './components/attendance';
import HiringReport from './components/hiring';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from 'hooks/usePermissions';
import OrganizationalChart from './components/team-strucuture/OrganizationalChart';

const Reports = () => {
	const colors = useModalColors();
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('reports')) return navigate('/default');
	}, []);

	const teamData = {
		teamLeaders: [
			{
				_id: '66c21be47f552f201d1eac9d',
				fullName: 'Ali Team Leader',
				username: 'teamleader10@gmail.com',
				agents: [
					{
						_id: '6738430d2773d5d9131e5b86',
						username: 'sulaiman@gmail.com',
						fullName: 'Muhammad Sulaiman Khan',
						teamLead: '66c21be47f552f201d1eac9d',
					},
					{
						_id: '6738430d2773d5d9131e5b87',
						username: 'agent2@gmail.com',
						fullName: 'John Smith',
						teamLead: '66c21be47f552f201d1eac9d',
					},
					{
						_id: '6738430d2773d5d9131e5b87',
						username: 'agent2@gmail.com',
						fullName: 'John Smith',
						teamLead: '66c21be47f552f201d1eac9d',
					},
					{
						_id: '6738430d2773d5d9131e5b87',
						username: 'agent2@gmail.com',
						fullName: 'John Smith',
						teamLead: '66c21be47f552f201d1eac9d',
					},
					{
						_id: '6738430d2773d5d9131e5b87',
						username: 'agent2@gmail.com',
						fullName: 'John Smith',
						teamLead: '66c21be47f552f201d1eac9d',
					},
				],
			},
			{
				_id: '66c21be47f552f201d1eac9e',
				fullName: 'Sarah Johnson',
				username: 'sarah.johnson@gmail.com',
				agents: [
					{
						_id: '6738430d2773d5d9131e5b88',
						username: 'mike.wilson@gmail.com',
						fullName: 'Mike Wilson',
						teamLead: '66c21be47f552f201d1eac9e',
					},
				],
			},
		],
		managerId: '669cef0132ce39be23fccc03',
		managerName: 'Alaa Selema',
		managerEmail: 'alaaselema456@gmail.com',
		agentsUnderManager: [
			{
				_id: '6738483a2773d5d9131e7335',
				fullName: 'Jamsheed VK',
				username: 'jamsheed@gmail.com',
			},
			{
				_id: '673848922773d5d9131e7352',
				fullName: 'Salman Ahmad',
				username: 'salman@gmail.com',
			},
		],
	};

	return (
		<Box bg={colors.bgDeep} minH='100vh' p={4}>
			<Box
				mx='2'
				bg={colors.bg}
				p='6'
				rounded='lg'
				shadow={colors.cardShadow}
				mb='6'
				border="1px solid"
				borderColor={colors.borderColor}
			>
				<Text
					fontSize={{ base: 'md', md: 'lg', lg: '2xl', xl: '3xl' }}
					fontWeight='bold'
					mb='2'
					color={colors.headingText}
				>
					Reports Overview
				</Text>
				<Text
					color={colors.bodyText}
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

			{/*  */}
			{/* <OrganizationalChart teamData={teamData} /> */}
		</Box>
	);
};

export default Reports;