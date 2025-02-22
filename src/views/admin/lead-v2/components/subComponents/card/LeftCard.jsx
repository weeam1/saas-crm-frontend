import EntityField from './EntityField';
import { Box, Flex, Grid, GridItem, Icon, Text } from '@chakra-ui/react';
import LastNoteField from './LastNoteField';
import MainStatus from '../MainStatus';
import Status from '../Status';
import Agents from '../Agents';
import Managers from '../Managers';
import { IoMdEye } from 'react-icons/io';
import { leadlabelFontSize, leadValueFontSize } from '../../constants';

const LeftCard = ({ lead }) => {
	return (
		<Box flex='1'>
			<Flex alignItems='center' gap='2'>
				<Icon as={IoMdEye} boxSize='10px' color='gray.400' />

				<Text fontSize={leadlabelFontSize} color='softGray.200'>
					{lead?.intID || 'N/A'}
				</Text>
			</Flex>
			<Text fontSize='12px' fontWeight='semibold' mb={2}>
				{lead?.leadName || 'N/A'}
			</Text>

			<Grid
				minWidth='13.75rem'
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
				gap={1}
			>
				<EntityField
					label='Country'
					value={lead?.ip?.split('-')[1]}
					valueProps={{ color: '#FF0004' }}
				/>
				<EntityField
					label='Nationality'
					value={lead.nationality}
					valueProps={{ color: '#FF0004' }}
				/>
				{/* Manager */}
				<GridItem>
					<Managers managerAssigned={lead?.managerAssigned} lead={lead} />
				</GridItem>

				{/* Agent */}
				<GridItem>
					<Agents
						agentAssigned={lead?.agentAssigned}
						managerAssigned={lead?.managerAssigned}
						lead={lead}
					/>
				</GridItem>

				{/* Main lead status */}
				<GridItem>
					<MainStatus lead={lead} />
				</GridItem>
				{/* Lead status */}
				<GridItem>
					<Status lead={lead} />
				</GridItem>

				{/* Phone */}
				<GridItem>
					<EntityField
						label='Phone'
						value={lead.leadPhoneNumber}
						isCopy
						valueProps={{ color: '#7667FF' }}
					/>
				</GridItem>

				{/* WhatsApp */}
				<GridItem>
					<EntityField
						label='WhatsApp'
						value={lead.leadWhatsappNumber}
						isCopy
						valueProps={{ color: 'green.700' }}
					/>
				</GridItem>

				{/* Last Note (occupy full width) */}
				<GridItem colSpan={{ base: 1, md: 2 }}>
					<LastNoteField label='Last Note' value={lead.lastNote} />
				</GridItem>
			</Grid>
		</Box>
	);
};

export default LeftCard;
