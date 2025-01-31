import { Box, Select } from '@chakra-ui/react';
import React from 'react';

const ApplicationStatus = ({ candidate, newStatus, setNewStatus }) => {
	const disabledOption =
		candidate.status === 'Eligible' && candidate.inviteAccepted;
	return (
		<Box mt='2' fontSize='sm'>
			<Box
				htmlFor='status'
				color='gray.800'
				px='1'
				mb='1'
				fontWeight='500'
				fontSize='md'
			>
				Change Status
			</Box>
			<Select
				onChange={(e) => setNewStatus(e.target.value)}
				name='status'
				defaultValue={newStatus || ''}
				width='200px'
				rounded='md'
				fontSize='sm'
				shadow='sm'
				borderColor='gray.300'
				_focus={{
					borderColor: 'brand.500', // Apply brand color on focus
					boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', // Highlight with brand color
				}}
				_hover={{
					borderColor: 'brand.500', // Apply brand color on hover
				}}
			>
				<option disabled value='Pending'>
					Select status
				</option>
				<option value='Eligible' disabled={disabledOption}>
					Eligible
				</option>
				<option value='Not Eligible' disabled={disabledOption}>
					Not Eligible
				</option>
			</Select>
		</Box>
	);
};

export default ApplicationStatus;
