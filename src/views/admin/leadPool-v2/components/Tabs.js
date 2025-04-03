import { Button, HStack, Box, Flex, Stack } from '@chakra-ui/react';

const Tabs = ({ activeTab, setActiveTab, isLoading }) => {
	const tabs = ['Buy Leads', 'Pending', 'Rejected'];

	const handleTabClick = (tab) => {
		if (tab !== activeTab && !isLoading) {
			setActiveTab(tab);
		}
	};

	return (
		<Box width='100%'>
			<Flex
				justifyContent='space-between'
				alignItems='center'
				p={2}
				width='100%'
				flexWrap='wrap'
				gap={{ base: 2, md: 4 }}
			>
				<Stack
					direction={{ base: 'column', sm: 'row' }}
					spacing={{ base: 2, md: 1 }}
					width={{ base: '100%', md: 'auto' }}
					align='center'
				>
					{tabs.map((tab) => (
						<Button
							key={tab}
							onClick={() => handleTabClick(tab)}
							bg={activeTab === tab ? '#b79045' : 'white'}
							color={activeTab === tab ? 'white' : 'black'}
							_hover={{ bg: activeTab === tab ? 'brand.400' : 'white' }}
							border='1px solid'
							borderColor='gray.300'
							fontFamily='DM Sans'
							fontWeight='400'
							borderRadius='6px'
							w={{ base: '90px', sm: '100px', md: '120px' }}
							h='40px'
							isDisabled={isLoading}
						>
							{tab}
						</Button>
					))}
				</Stack>
			</Flex>
		</Box>
	);
};

export default Tabs;
