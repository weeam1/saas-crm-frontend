
import { Box, Button, Flex } from '@chakra-ui/react';

const Tabs = ({ activeTab, setActiveTab }) => {
	const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

	return (
		<Box width="100%">
			<Flex
				width="100%"
				flexWrap="wrap"
				justifyContent={{ base: 'center', md: 'flex-start' }}
				p={2}
			>
				{tabs.map((tab, index) => (
					<Button
					key={index}
					variant="unstyled"
					onClick={() => setActiveTab(tab)}
					bg={activeTab === tab ? "#EDD199" : "softGray.50"}
					color={activeTab === tab ? "black" : "gray.500"}
					fontWeight={activeTab === tab ? "semi-bold" : "normal"}
					borderTop={
					  activeTab === tab
						? "4px solid #B79045"
						: "4px solid transparent"
					}
					borderRadius="0"
					h="42px"
					minW="100px"
					_focus={{ outline: "none" }}
					outline="none"
					fontFamily="DM Sans"
				  >
					{tab}
				  </Button>
				))}
			</Flex>
		</Box>
	);
};

export default Tabs;
