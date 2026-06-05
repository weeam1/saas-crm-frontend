import { Box, Select } from '@chakra-ui/react';
import React from 'react';
import { useModalColors } from 'hooks/useModalColors';

const ApplicationStatus = ({ candidate, newStatus, setNewStatus }) => {
	const colors = useModalColors();
	const disabledOption =
		candidate.status === 'Eligible' && candidate.inviteAccepted;

	return (
		<Box mt='2' fontSize='sm'>
			<Box
				htmlFor='status'
				color={colors.labelColor}
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
				bg={colors.bgInput}
				borderColor={colors.borderColor}
				color={colors.headingText}
				_focus={{
					borderColor: colors.accentGold,
					boxShadow: `0 0 0 1px ${colors.accentGold}`,
				}}
				_hover={{
					borderColor: colors.accentGold,
				}}
			>
				<option disabled value='Pending' style={{ background: colors.bg, color: colors.mutedText }}>
					Select status
				</option>
				<option value='Eligible' disabled={disabledOption} style={{ background: colors.bg, color: colors.headingText }}>
					Eligible
				</option>
				<option value='Not Eligible' disabled={disabledOption} style={{ background: colors.bg, color: colors.headingText }}>
					Not Eligible
				</option>
			</Select>
		</Box>
	);
};

export default ApplicationStatus;