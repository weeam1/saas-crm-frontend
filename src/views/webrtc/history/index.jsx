import {
	Grid,
	HStack,
	InputGroup,
	Input,
	InputLeftElement,
	Icon,
	Text,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from '@chakra-ui/react';
import { useState } from 'react';

import Recents from './recent';
import { FaSearch } from 'react-icons/fa';
import { FaSliders } from 'react-icons/fa6';

export const CallHistories = ({ calls, onDataChange, onCallNumber }) => {
	const [searchText, setSearchText] = useState('');

	return (
		<Tabs isFitted colorScheme='greenish'>
			<TabList mb='1em' gap={1}>
				<Tab>Recent</Tab>
				<Tab>Saved</Tab>
			</TabList>

			<Grid w='full' templateColumns='1fr auto' gap={5}>
				<InputGroup size='md'>
					<Input
						isDisabled={calls.length === 0}
						pr='4.5rem'
						placeholder='Type to search...'
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						bg='grey.100'
						fontWeight='normal'
					/>
					<InputLeftElement mr={2}>
						<Icon as={FaSearch} width='20px' height='20px' />
					</InputLeftElement>
				</InputGroup>
				<HStack spacing={2} bg='grey.100' p={2} borderRadius={7}>
					<Icon as={FaSliders} width='20px' height='20px' />
					<Text fontSize='12px' fontWeight='500'>
						Filter
					</Text>
				</HStack>
			</Grid>

			<TabPanels mt={1}>
				<TabPanel p={0}>
					<Recents
						calls={calls}
						search={searchText}
						onCallNumber={onCallNumber}
						onDataChange={onDataChange}
					/>
				</TabPanel>
				<TabPanel p={0}>
					<Recents
						calls={calls}
						search={searchText}
						isSaved
						onCallNumber={onCallNumber}
						onDataChange={onDataChange}
					/>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};

export default CallHistories;
