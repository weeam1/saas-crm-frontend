import { Select } from '@chakra-ui/react';
import { useCallback } from 'react';
import {
	ATTENDANCE_STATUS_CONFIG,
	attendanceStatusFilters,
} from '../constants';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceStatusFilter = ({ onChange, status }) => {
	const colors = useModalColors();

	const handleStatusChange = useCallback(
		(e) => {
			const val = e.target.value;
			onChange(val === '' ? '' : Number(val));
		},
		[onChange]
	);

	const selectedConfig = ATTENDANCE_STATUS_CONFIG[status];

	return (
		<Select
			value={status}
			onChange={handleStatusChange}
			maxW='100px'
			size='sm'
			rounded='md'
			bg={selectedConfig?.bg || colors.bgInput}
			color={selectedConfig?.text || colors.headingText}
			borderColor={colors.borderColor}
			_hover={{ borderColor: colors.accentGold }}
			_focus={{
				borderColor: colors.accentGold,
				boxShadow: `0 0 0 1px ${colors.accentGold}`
			}}
		>
			{attendanceStatusFilters.map((option) => (
				<option
					key={option.value}
					value={option.value}
					style={{ background: colors.bg, color: colors.headingText }}
				>
					{option.label}
				</option>
			))}
		</Select>
	);
};

export default AttendanceStatusFilter;