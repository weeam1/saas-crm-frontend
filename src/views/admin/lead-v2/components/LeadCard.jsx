import { formattedDate } from 'utils/helpers';
import { leadlabelFontSize } from './constants';
import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';
import { Box, Checkbox, Flex, useBreakpointValue } from '@chakra-ui/react';
import LeadMenu from './subComponents/card/LeadMenu';
import { useMemo, memo, useCallback } from 'react';

const LeadCard = memo(
	({
		lead,
		refreshLeads,
		setViewLead,
		permission,
		emailAccess,
		callAccess,
		setEditLead,
		setAddLead,
		setSendEmail,
		selectedValues,
		setSelectedValues,
		setDeleteLead,
		setLeadDetails,
	}) => {
		const cardWidth = useBreakpointValue({
			base: '100%', // Full width on mobile
			// sm: '48%', // Two cards per row on small screens
			md: '33.33%', // Three cards per row on medium screens
			lg: '25%', // Three cards per row on larger screens
		});

		const user = JSON.parse(localStorage.getItem('user'));

		const isChecked = useMemo(
			() => Boolean(selectedValues?.includes(lead?._id)),
			[selectedValues, lead?._id]
		);

		const handleCheckboxChange = useCallback(
			(event, value) => {
				setSelectedValues((prev = []) =>
					event.target.checked
						? [...prev, value]
						: prev.filter((v) => v !== value)
				);
			},
			[setSelectedValues]
		);

		return (
			<>
				<Box
					fontFamily="'DM Sans', sans-serif"
					borderWidth='1px'
					borderRadius='md'
					p={2}
					bg='white'
					width='100%'
					flexBasis={cardWidth}
					boxShadow='sm'
					_hover={{ boxShadow: 'lg' }}
					transition='all 0.2s ease-in-out'
					position='relative'
				>
					{/* Top-right controls */}
					<Box
						position='absolute'
						top={1}
						right={0}
						display='flex'
						alignItems='center'
						gap={2}
					>
						<Checkbox
							colorScheme='brand'
							value={selectedValues}
							isChecked={isChecked}
							onChange={(event) => handleCheckboxChange(event, lead?._id)}
						/>
						{/* <IconButton
					aria-label='More options'
					icon={<TbDotsVertical size='20' />}
					size='sm'
					variant='ghost'
				/> */}
						<LeadMenu
							user={user}
							lead={lead}
							emailAccess={emailAccess}
							access={permission}
							callAccess={callAccess}
							setEditLead={setEditLead}
							setAddLead={setAddLead}
							setSendEmail={setSendEmail}
							setSelectedValues={setSelectedValues}
							setDeleteLead={setDeleteLead}
							setLeadDetails={setLeadDetails}
						/>
					</Box>
					<Flex
						justify='space-between'
						align='stretch'
						wrap='wrap'
						gap={{ base: 2, md: 3, lg: 4 }}
					>
						<LeftCard
							lead={lead}
							user={user}
							setViewLead={setViewLead}
							refreshLeads={refreshLeads}
						/>
						<RightCard lead={lead} />
					</Flex>
					<Box
						textAlign='right'
						width='full'
						fontSize={leadlabelFontSize}
						color='gray.900'
					>
						<span style={{ color: 'softGray.200', marginRight: '4px' }}>
							Lead time
						</span>
						{formattedDate(lead?.createdDate) || 'N/A'}
					</Box>
				</Box>
			</>
		);
	}
);

export default LeadCard;
