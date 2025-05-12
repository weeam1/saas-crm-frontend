import { Select } from '@chakra-ui/react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	ATTENDANCE_STATUS_CONFIG,
	attendanceStatusFilters,
} from '../constants';

const AttendanceStatusFilter = ({ onChange }) => {
	const [searchParams] = useSearchParams();
	const currentStatus = searchParams.get('status') || '';
	const [status, setStatus] = useState(currentStatus);

	const handleStatusChange = (e) => {
		const val = e.target.value;
		setStatus(val);
		onChange(val === '' ? '' : Number(val));
	};

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
