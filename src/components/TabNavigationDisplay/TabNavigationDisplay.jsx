// import {
// 	Box,
// 	Tab,
// 	TabList,
// 	TabPanels,
// 	TabPanel,
// 	Tabs,
// 	Heading,
// 	Text,
// 	useBreakpointValue,
// } from '@chakra-ui/react';

// const TabNavigationDisplay = ({
// 	tabsData,
// 	activeTab,
// 	onTabChange,
// 	pannels = true,
// }) => {
// 	const tabFontSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'md' });
// 	const tabPadding = useBreakpointValue({ base: '2', sm: '3', md: '4' });
// 	const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });
// 	const textSize = useBreakpointValue({ base: 'sm', md: 'md' });

// 	return (
// 		<Tabs variant='goldenrod' index={activeTab} onChange={onTabChange}>
// 			{/* Tab panels for title/description */}
// 			{pannels && (
// 				<TabPanels>
// 					{tabsData.map((tab, index) => (
// 						<TabPanel key={`title-${index}`} px={0}>
// 							{tab.title || tab.description ? (
// 								<Box py={3} px={5} bg='white' borderRadius='10px' shadow='sm'>
// 									<Heading size={headingSize} mb={4}>
// 										{tab.title}
// 									</Heading>
// 									<Text fontSize={textSize} color='gray.600' mb={6}>
// 										{tab.description}
// 									</Text>
// 								</Box>
// 							) : null}
// 						</TabPanel>
// 					))}
// 				</TabPanels>
// 			)}

// 			{/* Tab list - scrollable but with hidden scrollbar */}
// 			<TabList
// 				overflowX='auto'
// 				overflowY='hidden'
// 				mx={0}
// 				px={0}
// 				sx={{
// 					'&::-webkit-scrollbar': {
// 						display: 'none',
// 					},
// 					msOverflowStyle: 'none',
// 					scrollbarWidth: 'none',
// 				}}
// 			>
// 				<Box display='flex' minWidth='max-content'>
// 					{tabsData.map((tab, index) => (
// 						<Tab
// 							key={`tab-${index}`}
// 							_selected={{
// 								borderTop: '4px solid #B79045',
// 								bg: '#EDD199',
// 								fontWeight: 'semi-bold',
// 								color: 'black',
// 								outline: 'none',
// 							}}
// 							outline='none'
// 							bg='softGray.50'
// 							color='gray.500'
// 							_focus={{ outline: 'none' }}
// 							borderTop='4px solid transparent'
// 							fontSize={tabFontSize}
// 							px={tabPadding}
// 							py={2}
// 							whiteSpace='nowrap'
// 							flexShrink={0}
// 							mx={0}
// 						>
// 							{tab.label}
// 						</Tab>
// 					))}
// 				</Box>
// 			</TabList>

// 			{/* Tab panels for content */}
// 			<TabPanels>
// 				{tabsData.map((tab, index) => (
// 					<TabPanel key={`content-${index}`} px={0}>
// 						{tab.component}
// 					</TabPanel>
// 				))}
// 			</TabPanels>
// 		</Tabs>
// 	);
// };

// export default TabNavigationDisplay;
import {
	Box,
	Tab,
	TabList,
	TabPanels,
	TabPanel,
	Tabs,
	Heading,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';

const TabNavigationDisplay = ({
	tabsData,
	activeTab,
	onTabChange,
	pannels = true,
}) => {
	const tabFontSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'sm' });
	const tabPadding = useBreakpointValue({ base: 3, sm: 4, md: 5 });
	const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });
	const textSize = useBreakpointValue({ base: 'sm', md: 'md' });

	return (
		<Tabs
			index={activeTab}
			onChange={onTabChange}
			variant='unstyled'
			bg='bg.surface'
			borderRadius='xl'
			overflow='hidden'
		>
			{/* Tab panels for title/description */}
			{pannels && (
				<TabPanels>
					{tabsData.map((tab, index) => (
						<TabPanel key={`title-${index}`} px={0}>
							{tab.title || tab.description ? (
								<Box
									py={4}
									px={5}
									bg='bg.elevated'
									borderRadius='lg'
									mb={4}
									border='1px solid'
									borderColor='border.default'
								>
									{tab.title && (
										<Heading
											size={headingSize}
											mb={tab.description ? 2 : 0}
											color='text.heading'
										>
											{tab.title}
										</Heading>
									)}
									{tab.description && (
										<Text fontSize={textSize} color='text.muted'>
											{tab.description}
										</Text>
									)}
								</Box>
							) : null}
						</TabPanel>
					))}
				</TabPanels>
			)}

			{/* Tab list - scrollable with hidden scrollbar */}
			<TabList
				overflowX='auto'
				overflowY='hidden'
				mx={0}
				px={0}
				mb={4}
				borderBottom='1px solid'
				borderBottomColor='border.default'
				sx={{
					'&::-webkit-scrollbar': {
						display: 'none',
					},
					msOverflowStyle: 'none',
					scrollbarWidth: 'none',
				}}
			>
				<Box display='flex' minWidth='max-content' gap={2}>
					{tabsData.map((tab, index) => (
						<Tab
							key={`tab-${index}`}
							_selected={{
								color: 'gold.400',
								borderBottom: '2px solid',
								borderBottomColor: 'gold.400',
								bg: 'brand.600',
								fontWeight: 'semibold',
							}}
							_hover={{
								color: 'gold.primary',
							}}
							outline='none'
							bg='transparent'
							color='text.body'
							_focus={{ outline: 'none' }}
							fontSize={tabFontSize}
							fontWeight='medium'
							px={tabPadding}
							py={2.5}
							whiteSpace='nowrap'
							flexShrink={0}
							mx={0}
							transition='all 0.2s ease'
							cursor='pointer'
						>
							{tab.label}
						</Tab>
					))}
				</Box>
			</TabList>

			{/* Tab panels for content */}
			<TabPanels>
				{tabsData.map((tab, index) => (
					<TabPanel key={`content-${index}`} px={0} pt={4}>
						{tab.component}
					</TabPanel>
				))}
			</TabPanels>
		</Tabs>
	);
};

export default TabNavigationDisplay;
