import {
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Box,
	useColorModeValue,
} from '@chakra-ui/react';
import { StepAccountSelect } from './StepAccountSelect';
import { StepTemplateSelect } from './StepTemplateSelect';
import { StepLeadSelect } from './StepLeadSelect';
const BulkMessage = () => {
	const tabBg = useColorModeValue('white', 'gray.800');

	return (
		<Box maxW='6xl' mx='auto' mt={6} bg={tabBg} rounded='xl' shadow='sm' p={6}>
			<Tabs variant='enclosed' colorScheme='teal' isFitted>
				<TabList>
					<Tab fontWeight='600'>1. Select Account</Tab>
					<Tab fontWeight='600'>2. Select Template</Tab>
					<Tab fontWeight='600'>3. Select Leads</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<StepAccountSelect />
					</TabPanel>
					<TabPanel>
						<StepTemplateSelect />
					</TabPanel>
					<TabPanel>
						<StepLeadSelect />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default BulkMessage;
