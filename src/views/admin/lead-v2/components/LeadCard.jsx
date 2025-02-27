import { formattedDate } from 'utils/helpers';
import { leadlabelFontSize } from './constants';
import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import LeadMenu from './subComponents/card/LeadMenu';
import { memo, useCallback, useEffect, useState } from 'react';

import './checkbox.css';

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
		queryParams,
	}) => {
		const cardWidth = useBreakpointValue({
			base: '100%', // Full width on mobile
			// sm: '48%', // Two cards per row on small screens
			md: '33.33%', // Three cards per row on medium screens
			lg: '25%', // Three cards per row on larger screens
		});

		const user = JSON.parse(localStorage.getItem('user'));

		const [localChecked, setLocalChecked] = useState(
			selectedValues.includes(lead?._id)
		);

		const handleCheckboxChange = useCallback(
			(event) => {
				const isChecked = event.target.checked;

				// ✅ Instant UI update
				setLocalChecked(isChecked);

				// ✅ Background state update (does not block UI)
				setTimeout(() => {
					setSelectedValues((prev = []) =>
						isChecked
							? [...prev, lead?._id]
							: prev.filter((id) => id !== lead?._id)
					);
				}, 0); // Runs in the background immediately
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
						{/* <Checkbox
							colorScheme='brand'
							value={selectedValues}
							isChecked={isChecked}
							onChange={(event) => handleCheckboxChange(event, lead?._id)}
						/> */}

						<label className='custom-checkbox'>
							<input
								type='checkbox'
								checked={localChecked}
								onChange={handleCheckboxChange}
							/>
							<span className='checkmark'></span>
						</label>
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
							refreshData={refreshLeads}
						/>
					</Box>
					<Flex
						justify='space-between'
						align='stretch'
						wrap='wrap'
						// gap={{ base: 2, md: 3 }}
						gap={2}
					>
						<LeftCard
							lead={lead}
							setViewLead={setViewLead}
							refreshLeads={refreshLeads}
							role={role}
							queryParams={queryParams}
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
