
import { useCallback, useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { format } from 'date-fns';
import { Box, Flex, Icon, useBreakpointValue, Checkbox } from '@chakra-ui/react';
import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';
import LeadMenu from './subComponents/card/LeadMenu';
import { leadlabelFontSize } from './constants';

import LeadNotesModal from './lead-note/LeadNotesModal';
import useUserSession from 'hooks/useUserSession';

const LeadCard = ({
	editSecondary,
	setEditSecondary,
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
	setSelectedLeads,
	setDeleteLead,
	setLeadDetails,
	setViewPhoneHistory,
	queryParams,
	setLeadAddtionalInfo,
	setIsLeadCycle,
}) => {
	const cardWidth = useBreakpointValue({
		base: '100%',
		md: '33.33%',
		lg: '25%',
	});

	const { user, userRoleName } = useUserSession();

	const [leadNotes, setLeadNotes] = useState(false);

	const [localChecked, setLocalChecked] = useState(
		selectedValues.includes(lead?._id),
	);

	const handleCheckboxChange = useCallback(
		(e) => {
			const isChecked = e.target.checked;
			setLocalChecked(isChecked);

			setTimeout(() => {
				setSelectedValues((prev = []) =>
					isChecked
						? [...prev, lead?._id]
						: prev.filter((id) => id !== lead?._id),
				);
				setSelectedLeads((prev) => {
					if (!Array.isArray(prev)) prev = [];

					return isChecked
						? [...prev, lead]
						: prev.filter((item) => item._id !== lead._id);
				});
			}, 0);
		},
		[setSelectedValues, lead],
	);

	useEffect(() => {
		setLocalChecked(selectedValues.includes(lead?._id));
	}, [selectedValues, lead?._id]);

	const hiddenFields = JSON.parse(
		localStorage.getItem('userCustomColumns') || '[]',
	);

	return (
		<>
			<Box
				borderWidth='1px'
				borderRadius='lg'
				p={3}
				bg={localChecked ? 'bg.elevated' : 'bg.surface'}
				borderColor={localChecked ? 'border.focus' : 'border.default'}
				width='100%'
				flexBasis={cardWidth}
				boxShadow='card'
				_hover={{
					boxShadow: 'soft',
					bg: 'bg.elevated',
					borderColor: 'border.focus',
				}}
				transition='all 0.2s ease-in-out'
				position='relative'
			>
				{/* Top-right controls */}
				<Box
					position='absolute'
					top={2}
					right={2}
					display='flex'
					alignItems='center'
					gap={2}
					zIndex={1}
				>
					<Icon
						as={FaPen}
						boxSize='14px'
						onClick={() => setLeadNotes(true)}
						color='text.accent'
						cursor='pointer'
						_hover={{ color: 'accent.goldLight' }}
					/>

				<Checkbox
  isChecked={localChecked}
  onChange={handleCheckboxChange}
  size='sm'
  sx={{
    ".chakra-checkbox__control": {
      _focus: { boxShadow: "none" },
      borderRadius: "2px"  // ← Makes it almost square
    }
  }}
/>

					<LeadMenu
						editSecondary={editSecondary}
						setEditSecondary={setEditSecondary}
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
						refreshData={refreshLeads}
						setViewPhoneHistory={setViewPhoneHistory}
						setLeadAddtionalInfo={setLeadAddtionalInfo}
						setIsLeadCycle={setIsLeadCycle}
					/>
				</Box>

				<Flex
					justifyContent='space-between'
					align='stretch'
					wrap='wrap'
					gap={{ base: 2, md: 3, lg: 6 }}
				>
					<LeftCard
						lead={lead}
						hiddenFields={hiddenFields}
						setViewLead={setViewLead}
						refreshLeads={refreshLeads}
						role={userRoleName}
						user={user}
						queryParams={queryParams}
					/>
					<RightCard
						lead={lead}
						user={user}
						setViewLead={setViewLead}
						hiddenFields={hiddenFields}
					/>
				</Flex>

				{!hiddenFields.includes('createdDate') && (
					<Box
						textAlign='right'
						width='full'
						fontSize={leadlabelFontSize}
						color='text.muted'
						mt={2}
						pt={2}
						borderTop='1px solid'
						borderTopColor='border.subtle'
					>
						<span style={{ marginRight: '4px' }}>Lead time</span>
						{format(new Date(lead?.createdDate), 'MMM d, yyyy h:mm a')}
					</Box>
				)}
			</Box>

			{leadNotes && (
				<LeadNotesModal
					leadId={lead?._id}
					isOpen={leadNotes}
					onClose={() => setLeadNotes(false)}
				/>
			)}
		</>
	);
};

export default LeadCard;