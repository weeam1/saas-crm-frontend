import { Select } from '@chakra-ui/react';
import { useCallback } from 'react';
import {
	ATTENDANCE_STATUS_CONFIG,
	attendanceStatusFilters,
} from '../constants';

const AttendanceStatusFilter = ({ onChange, status }) => {
	const handleStatusChange = useCallback(
		(e) => {
			const val = e.target.value;
			// setStatus(val);
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
			bg={selectedConfig?.bg || 'white'}
			color={selectedConfig?.text || 'black'}
			borderColor='gray.300'
			_hover={{ borderColor: 'gray.100' }}
			_focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px brand.400' }}
		>
			{attendanceStatusFilters.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</Select>
	);
};

export default AttendanceStatusFilter;
