import EntityField from './EntityField';
import {
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Icon,
	Text,
	Tooltip,
} from '@chakra-ui/react';
import LastNoteField from './LastNoteField';
import MainStatus from '../MainStatus';
import Status from '../Status';
import Agents from '../Agents';
import Managers from '../Managers';
import { IoMdEye } from 'react-icons/io';
import { leadlabelFontSize } from '../../constants';
import LeadTypeBadge from '../LeadTypeBadge';

const LeftCard = ({ lead, user, setViewLead, refreshLeads }) => {
	const leadType =
		lead?.leadType ?? (lead?.leadStatus === 'new' ? 'new' : undefined);

	const roleName =
		user?.role === 'superAdmin'
			? 'superAdmin'
			: (user?.roles?.[0]?.roleName ?? 'unknown');

	return (
		<Box flex='1'>
			<Flex alignItems='center' gap='2'>
				<Icon
					as={IoMdEye}
					boxSize='12px'
					onClick={() => setViewLead({ isOpen: true, lid: lead?._id })}
					color='gray.400'
					cursor='pointer'
				/>

				<Text fontSize={leadlabelFontSize} color='softGray.200'>
					{lead?.intID || 'N/A'}
				</Text>
			</Flex>
			<HStack mb={2}>
				<Text fontSize='12px' fontWeight='semibold'>
					{lead?.leadName || 'N/A'}
				</Text>
				<LeadTypeBadge leadType={leadType} roleName={roleName} />
			</HStack>

			<Grid
				// minWidth='14.75rem'
				minWidth='14.75em' // Scales based on the parent element's font size
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
					<Managers
						managerAssigned={lead?.managerAssigned}
						lead={lead}
						refreshLeads={refreshLeads}
					/>
				</GridItem>

				{/* Agent */}
				<GridItem>
					<Agents
						agentAssigned={lead?.agentAssigned}
						managerAssigned={lead?.managerAssigned}
						lead={lead}
						refreshLeads={refreshLeads}
					/>
				</GridItem>

				{/* Main lead status */}
				<GridItem>
					<MainStatus lead={lead} refreshLeads={refreshLeads} />
				</GridItem>
				{/* Lead status */}
				<GridItem>
					<Status lead={lead} refreshLeads={refreshLeads} />
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
