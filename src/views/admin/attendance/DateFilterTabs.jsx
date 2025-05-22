import {
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	HStack,
	Text,
} from '@chakra-ui/react';
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import DateRangeFilter from './components/DateRangeFilter';
import DateFilter from './components/DateFilter';

const DateFilterTabs = ({
	filterType,
	setFilterType,
	dateFilterHandler,
	monthFilterHandler,
}) => {
	const handleTabChange = (index) => {
		const types = ['range', 'month'];
		setFilterType(types[index]);
	};

	const tabIndex = filterType === 'month' ? 1 : 0;

	return (
		<Tabs
			index={tabIndex}
			onChange={handleTabChange}
			variant='enclosed'
			colorScheme='brand'
			width={{ base: 'full', md: '500px' }}
			rounded='md'
			shadow='sm'
		>
			<TabList
				bg='softGray.100'
				px='4'
				py='2'
				rounded='md'
				justifyContent='space-between'
			>
				<Tab
					_selected={{ bg: 'brand.400', color: 'white' }}
					_focus={{ boxShadow: 'none' }}
					rounded='md'
					width='full'
					fontSize={{ base: 'sm', md: 'md' }}
				>
					<HStack justify='center' width='full'>
						<TimeIcon />
						<Text>Date Range</Text>
					</HStack>
				</Tab>
				<Tab
					_selected={{ bg: 'brand.400', color: 'white' }}
					_focus={{ boxShadow: 'none' }}
					rounded='md'
					width='full'
					fontSize={{ base: 'sm', md: 'md' }}
				>
					<HStack justify='center' width='full'>
						<CalendarIcon />
						<Text>Monthly</Text>
					</HStack>
				</Tab>
			</TabList>

			{/* Optional: Panels if you're using tab-specific content */}
			<TabPanels textAlign='center'>
				<TabPanel p={4}>
					{/* Render range filter component */}
					<DateRangeFilter dateFilterHandler={dateFilterHandler} />
				</TabPanel>
				<TabPanel p={4}>
					{/* Render monthly filter component */}
					<DateFilter onFilterChange={monthFilterHandler} />
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};

export default DateFilterTabs;
