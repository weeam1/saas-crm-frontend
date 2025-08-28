import EntityField from './EntityField';
import {
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Icon,
	Text,
} from '@chakra-ui/react';
import LastNoteField from './LastNoteField';
import MainStatus from '../MainStatus';
import Status from '../Status';
import Agents from '../Agents';
import Managers from '../Managers';
import { IoMdEye } from 'react-icons/io';
import { leadlabelFontSize, leadValueFontSize } from '../../constants';
import LeadTypeBadge from '../LeadTypeBadge';
import { useMemo } from 'react';
import { usePermissions } from 'hooks/usePermissions';

const LeftCard = ({
	lead,
	setViewLead,
	refreshLeads,
	role,
	queryParams,
	user,
	hiddenFields,
	// countryList,
}) => {
	const leadType = useMemo(() => {
		return lead?.leadType ?? (lead?.leadStatus === 'new' ? 'new' : undefined);
	}, [lead?.leadType, lead?.leadStatus]);

	const { hasPermission } = usePermissions();

	// const hideContact =
	// 	role === 'Manager'
	// 		? true
	// 		: queryParams?.invite && role !== 'superAdmin'
	// 			? role === 'Manager'
	// 				? user?._id !== lead?.managerAssigned
	// 				: user?._id !== lead?.agentAssigned
	// 			: false;

	let hideContact = false;

	if (role === 'Manager') {
		hideContact = true;
	} else if (queryParams?.invite && role !== 'superAdmin') {
		hideContact = user?._id !== lead?.agentAssigned;
		// if (role === 'Manager') {
		// 	hideContact = user?._id !== lead?.managerAssigned;
		// } else {
		// }
	}

	return (
		<Box flex='1' overflow='hidden'>
			<Flex alignItems='center' gap='2'>
				{hasPermission('leads', 'read') && (
					<Icon
						as={IoMdEye}
						boxSize='12px'
						onClick={() => setViewLead({ isOpen: true, lid: lead?._id })}
						color='gray.400'
						cursor='pointer'
					/>
				)}

				{!hiddenFields.includes('intID') && (
					<Text fontSize={leadlabelFontSize} color='softGray.200'>
						{lead?.intID || 'N/A'}
					</Text>
				)}
			</Flex>
			{!hiddenFields.includes('leadName') && (
				<HStack mb={2}>
					<Text
						fontSize='12px'
						fontWeight='semibold'
						isTruncated
						maxWidth='6rem'
					>
						{lead?.leadName || 'N/A'}
					</Text>
					<LeadTypeBadge leadType={leadType} roleName={role} />
				</HStack>
			)}

			<Grid
				minWidth='100%'
				templateColumns='repeat(2, 1fr)'
				alignItems='start'
				gap={{ base: 4, md: 2 }}
			>
				<GridItem colSpan={2} display='flex' justifyContent='space-between'>
					{!hiddenFields.includes('leadSourceDetails') && (
						<EntityField
							label='Source Content'
							value={lead.leadSourceDetails}
							valueProps={{ color: '#FFBB00' }}
							isInfo={true}
						/>
					)}

					{!hiddenFields.includes('timetocall') && (
						<EntityField
							label='Time to Call'
							value={lead?.timetocall}
							isInfo={true}
							valueProps={{ color: 'green.600' }}
						/>
					)}
				</GridItem>

				{/* Manager */}
				{/* {role === 'superAdmin' && !hiddenFields.includes('managerAssigned') && (
					<GridItem
						colSpan={hiddenFields.includes('agentAssigned') ? '2' : '1'}
					>
						<Managers
							managerAssigned={lead?.managerAssigned}
							lead={lead}
							refreshLeads={refreshLeads}
							role={role}
							queryParams={queryParams}
						/>
					</GridItem>
				)} */}
				{queryParams?.invite ? (
					<GridItem
						colSpan={hiddenFields.includes('agentAssigned') ? '2' : '1'}
					>
						<Managers
							managerAssigned={lead?.managerAssigned}
							lead={lead}
							refreshLeads={refreshLeads}
							role={role}
							queryParams={queryParams}
						/>
					</GridItem>
				) : (
					hasPermission('leads', 'managerAssign') &&
					!hiddenFields.includes('managerAssigned') && (
						<GridItem
							colSpan={hiddenFields.includes('agentAssigned') ? '2' : '1'}
						>
							<Managers
								managerAssigned={lead?.managerAssigned}
								lead={lead}
								refreshLeads={refreshLeads}
								role={role}
								queryParams={queryParams}
							/>
						</GridItem>
					)
				)}

				{/* Agent */}
				{queryParams?.invite ? (
					<GridItem
						colSpan={
							queryParams?.invite
								? '1'
								: (!queryParams?.invite && role === 'Manager') ||
									  hiddenFields.includes('agentAssigned')
									? '2'
									: '1'
						}
					>
						<Agents
							agentAssigned={lead?.agentAssigned}
							managerAssigned={lead?.managerAssigned}
							lead={lead}
							refreshLeads={refreshLeads}
						/>
					</GridItem>
				) : (
					hasPermission('leads', 'agentAssign') &&
					!hiddenFields.includes('agentAssigned') && (
						<GridItem
							colSpan={hiddenFields.includes('agentAssigned') ? '2' : '1'}
							// colSpan={
							// 	role === 'Manager' || hiddenFields.includes('agentAssigned')
							// 		? '2'
							// 		: '1'
							// }
						>
							<Agents
								agentAssigned={lead?.agentAssigned}
								managerAssigned={lead?.managerAssigned}
								lead={lead}
								refreshLeads={refreshLeads}
							/>
						</GridItem>
					)
				)}

				{/* Main lead status */}
				{hasPermission('leads', 'leadStatus') &&
					!hiddenFields.includes('eLeadStatus') && (
						<GridItem colSpan={hiddenFields.includes('leadStatus') ? '2' : '1'}>
							<MainStatus lead={lead} refreshLeads={refreshLeads} role={role} />
						</GridItem>
					)}

				{/* Lead status */}
				{hasPermission('leads', 'mainStatus') &&
					!hiddenFields.includes('leadStatus') && (
						<GridItem
							colSpan={hiddenFields.includes('eLeadStatus') ? '2' : '1'}
						>
							<Status lead={lead} refreshLeads={refreshLeads} />
						</GridItem>
					)}

				{!hideContact && (
					<GridItem colSpan={2} display='flex' justifyContent='space-between'>
						{/* Phone */}
						{!hiddenFields.includes('leadPhoneNumber') && (
							<EntityField
								label='Phone'
								value={
									typeof lead?.leadPhoneNumber === 'object'
										? lead?.leadPhoneNumber?.result
										: lead?.leadPhoneNumber
								}
								isCopy
								valueProps={{ color: '#7667FF' }}
							/>
						)}

						{/* WhatsApp */}
						{!hiddenFields.includes('leadWhatsappNumber') && (
							<EntityField
								label='WhatsApp'
								value={
									typeof lead.leadWhatsappNumber === 'object'
										? lead.leadWhatsappNumber?.result
										: lead.leadWhatsappNumber
								}
								isCopy
								valueProps={{ color: 'green.700' }}
							/>
						)}
					</GridItem>
				)}

				{/* Last Note (occupy full width) */}
				{!hiddenFields.includes('lastNote') && (
					<GridItem colSpan={{ base: 1, md: 2 }}>
						<LastNoteField label='Last Note' lead={lead} />
					</GridItem>
				)}
			</Grid>
		</Box>
	);
};

export default LeftCard;
