import { Box, Flex, Heading } from '@chakra-ui/react';
import Chart from 'components/charts/LineChart.js';
import Card from 'components/card/Card';
import { HSeparator } from 'components/separator/Separator';
import React, { useMemo } from 'react';

const ReportChart = ({ stats }) => {
	const data = useMemo(
		() => [
			// {
			// 	name: 'Leads',
			// 	length: stats.totalLeads || 0,
			// },
			{
				name: 'Users',
				length: stats.totalUsers || 0,
			},
			// {
			// 	name: 'Candidates',
			// 	length: stats.totalCandidates || 0,
			// },
			{
				name: 'Interviewed',
				length: stats.interviewedCandidates || 0,
			},
			{
				name: 'Developers',
				length: stats.totalDevelopers || 0,
			},
			{
				name: 'Invoices',
				length: stats.totalInvoices || 0,
			},
			{
				name: 'Expenses',
				length: stats.totalExpenses || 0,
			},
			{
				name: 'Bank Accounts',
				length: stats.totalBankAccounts || 0,
			},
		],
		[stats]
	);

	return (
		<Card>
			<Flex mb={5} alignItems={'center'} justifyContent={'space-between'}>
				<Heading size='md'>Report</Heading>
			</Flex>
			<Box mb={3}>
				<HSeparator />
			</Box>
			<Chart dashboard={'dashboard'} data={data} />
		</Card>
	);
};

export default ReportChart;
