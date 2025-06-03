import LeadReport from './components/lead-report';
import CallsRecordGraph from './components/sip';

import {
	Box,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	HStack,
	Text,
} from '@chakra-ui/react';
import { ViewIcon, PhoneIcon } from '@chakra-ui/icons';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from 'components/loading/Loader';
import AttendanceReport from './components/attendance';
import HiringReport from './components/hiring';

// const Reports = () => {
// 	const [searchParams, setSearchParams] = useSearchParams();

// 	// Tab index mapping
// 	const tabKeys = ['lead', 'calls'];
// 	const tabKey = searchParams.get('tab');
// 	const currentTabIndex =
// 		tabKeys.indexOf(tabKey) === -1 ? 0 : tabKeys.indexOf(tabKey);

// 	const handleTabChange = (index) => {
// 		setSearchParams({ tab: tabKeys[index] });
// 	};

// 	// Ensure `tab` param exists on first mount
// 	useEffect(() => {
// 		if (!tabKey || tabKeys.indexOf(tabKey) === -1) {
// 			setSearchParams({ tab: tabKeys[0] });
// 		}
// 	}, []);

// 	return (
// 		<Box>
// 			<Tabs
// 				index={currentTabIndex}
// 				onChange={handleTabChange}
// 				variant='enclosed'
// 				colorScheme='brand'
// 				rounded='md'
// 				shadow='sm'
// 				isFitted
// 			>
// 				<TabList
// 					bg='softGray.100'
// 					px='4'
// 					py='2'
// 					rounded='md'
// 					width={{ base: 'full', md: '500px' }}
// 					justifyContent='space-between'
// 				>
// 					<Tab
// 						_selected={{ bg: 'brand.400', color: 'white' }}
// 						_focus={{ boxShadow: 'none' }}
// 						rounded='md'
// 						fontSize={{ base: 'sm', md: 'md' }}
// 					>
// 						<HStack justify='center' width='full'>
// 							<ViewIcon />
// 							<Text>Lead Report</Text>
// 						</HStack>
// 					</Tab>
// 					<Tab
// 						_selected={{ bg: 'brand.400', color: 'white' }}
// 						_focus={{ boxShadow: 'none' }}
// 						rounded='md'
// 						fontSize={{ base: 'sm', md: 'md' }}
// 					>
// 						<HStack justify='center' width='full'>
// 							<PhoneIcon />
// 							<Text>Calls Report</Text>
// 						</HStack>
// 					</Tab>
// 				</TabList>

// 				<TabPanels>
// 					<TabPanel bg='red.200'>
// 						<LeadReport />
// 					</TabPanel>
// 					<TabPanel>
// 						<CallsRecordGraph />
// 					</TabPanel>
// 				</TabPanels>
// 			</Tabs>
// 		</Box>
// 	);
// };

const Reports = () => {
	// const [loading, setLoading] = useState(true);

	// useEffect(() => {
	// 	const timer = setTimeout(() => {
	// 		setLoading(false);
	// 	}, 3000); // 2 seconds

	// 	return () => clearTimeout(timer);
	// }, []);

	return (
		<Box>
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
