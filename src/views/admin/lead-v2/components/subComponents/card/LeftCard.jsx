import EntityField from './EntityField';
import { Box, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react';
import LastNoteField from './LastNoteField';
import MainStatus from '../MainStatus';
import Status from '../Status';
import Agents from '../Agents';
import Managers from '../Managers';
import { IoMdEye } from 'react-icons/io';

const LeftCard = ({ lead }) => {
	return (
		<Box>
			<Flex alignItems='center' gap='2'>
				<Icon as={IoMdEye} boxSize='10px' color='gray.400' />

				<Text fontSize='10px' color='softGray.200'>
					{lead?.intID}
				</Text>
			</Flex>
			<Text fontSize='xs' fontWeight='semibold' mb={2}>
				{lead?.leadName}
			</Text>

			<Grid
				width='230px'
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
				gap={1}
			>
				{/* Manager */}
				<GridItem>
					<Managers />
				</GridItem>

				{/* Agent */}
				<GridItem>
					<Agents />
				</GridItem>

				{/* Main lead status */}
				<GridItem>
					<MainStatus />
				</GridItem>
				{/* Lead status */}
				<GridItem>
					<Status />
				</GridItem>

				{/* Phone */}
				<GridItem>
					<EntityField
						label='Phone'
						value='234234234324'
						isCopy
						valueProps={{ color: 'blue.500' }}
					/>
				</GridItem>

				{/* WhatsApp */}
				<GridItem>
					<EntityField
						label='WhatsApp'
						value='234234234324'
						isCopy
						valueProps={{ color: 'green.400' }}
					/>
				</GridItem>

				{/* Last Note (occupy full width) */}
				<GridItem colSpan={{ base: 1, md: 2 }}>
					<LastNoteField
						label='Last Note'
						value='Whereas disregard and contempt for human rights sldkjflsd kljsdflkjsd lkfksdjflk sdfkljsdkl fdskljf'
					/>
				</GridItem>
			</Grid>
		</Box>
	);
};

export default LeftCard;
