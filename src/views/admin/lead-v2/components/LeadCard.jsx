import { memo, useCallback, useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { format } from 'date-fns';
import { Box, Flex, Icon, useBreakpointValue } from '@chakra-ui/react';
import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';
import LeadMenu from './subComponents/card/LeadMenu';
import { leadlabelFontSize } from './constants';

import './checkbox.css';
import LeadNotesModal from './lead-note/LeadNotesModal';

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
		setSelectedLeads,
		setDeleteLead,
		setLeadDetails,
		queryParams,
	}) => {
		const cardWidth = useBreakpointValue({
			base: '100%', // Full width on mobile
			// sm: '48%', // Two cards per row on small screens
			md: '33.33%', // Three cards per row on medium screens
			lg: '25%', // Three cards per row on larger screens
		});

		const user = JSON.parse(localStorage.getItem('user'));

		const [leadNotes, setLeadNotes] = useState(false);

		const [localChecked, setLocalChecked] = useState(
			selectedValues.includes(lead?._id)
		);

		const handleCheckboxChange = useCallback(
			(event) => {
				const isChecked = event.target.checked;

				setLocalChecked(isChecked);

				setTimeout(() => {
					setSelectedValues((prev = []) =>
						isChecked
							? [...prev, lead?._id]
							: prev.filter((id) => id !== lead?._id)
					);
					setSelectedLeads((prev) => {
						if (!Array.isArray(prev)) prev = [];

						return isChecked
							? [...prev, lead] // Add the lead
							: prev.filter((item) => item._id !== lead._id);
					});
				}, 0);
			},
			[setSelectedValues, lead?._id]
		);

		useEffect(() => {
			setLocalChecked(selectedValues.includes(lead?._id));
		}, [selectedValues, lead?._id]);

		const role =
			user?.role === 'superAdmin'
				? 'superAdmin'
				: (user?.roles?.[0]?.roleName ?? 'unknown');

		const hiddenFields = JSON.parse(
			localStorage.getItem('userCustomColumns') || '[]'
		);

		return (
			<>
				<Box
					fontFamily="'DM Sans', sans-serif"
					borderWidth='1px'
					borderRadius='md'
					p={2}
					bg={localChecked ? 'brand.50' : 'white'}
					width='100%'
					flexBasis={cardWidth}
					boxShadow='sm'
					_hover={{ boxShadow: 'lg', bg: 'brand.50' }}
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
						<Icon
							as={FaPen}
							boxSize='14px'
							onClick={() => setLeadNotes(true)}
							color='gray.500'
							cursor='pointer'
						/>

						<label className='custom-checkbox'>
							<input
								type='checkbox'
								checked={localChecked}
								onChange={handleCheckboxChange}
							/>
							<span className='checkmark'></span>
						</label>

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
							refreshData={refreshLeads}
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
							setViewLead={setViewLead}
							refreshLeads={refreshLeads}
							role={role}
							user={user}
							queryParams={queryParams}
						/>
						<RightCard lead={lead} />
					</Flex>
					{!hiddenFields.includes('createdDate') && (
						<Box
							textAlign='right'
							width='full'
							fontSize={leadlabelFontSize}
							color='gray.900'
						>
							<span style={{ color: 'softGray.200', marginRight: '4px' }}>
								Lead time
							</span>
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
	}
);

export default LeadCard;
