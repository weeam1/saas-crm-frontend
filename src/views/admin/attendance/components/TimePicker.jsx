import { useState } from 'react';
import { HStack, Input, Button, Text } from '@chakra-ui/react';

const TimePicker = ({ value, onChange }) => {
	const [time, setTime] = useState(
		value || { hour: '09', minute: '00', period: 'AM' }
	);

	const handleChange = (field, val) => {
		let newTime = { ...time, [field]: val };

		if (field === 'hour') {
			let hour = parseInt(val) || 1;
			hour = Math.min(Math.max(1, hour), 12);
			newTime.hour = hour.toString().padStart(2, '0');
		}

		if (field === 'minute') {
			let minute = parseInt(val) || 0;
			minute = Math.min(Math.max(0, minute), 59);
			newTime.minute = minute.toString().padStart(2, '0');
		}

		setTime(newTime);
		onChange?.(newTime);
	};

	return (
		<HStack>
			<Input
				type='number'
				w='80px'
				value={time.hour}
				onChange={(e) => handleChange('hour', e.target.value)}
			/>
			<Text fontSize='xl'>:</Text>
			<Input
				type='number'
				w='80px'
				value={time.minute}
				onChange={(e) => handleChange('minute', e.target.value)}
			/>
			<HStack>
				<Button
					bg={time.period === 'AM' ? 'brand.500' : 'gray.300'}
					color='white'
					rounded='md'
					px={4}
					py={2}
					fontSize='lg'
					transition='all 0.2s ease-in-out'
					_hover={{ bg: time.period === 'AM' ? 'brand.600' : 'gray.400' }}
					_active={{ bg: time.period === 'AM' ? 'brand.700' : 'gray.500' }}
					onClick={() => handleChange('period', 'AM')}
				>
					AM
				</Button>
				<Button
					bg={time.period === 'PM' ? 'brand.500' : 'gray.300'}
					color='white'
					rounded='md'
					px={4}
					py={2}
					fontSize='lg'
					transition='all 0.2s ease-in-out'
					_hover={{ bg: time.period === 'PM' ? 'brand.600' : 'gray.400' }}
					_active={{ bg: time.period === 'PM' ? 'brand.700' : 'gray.500' }}
					onClick={() => handleChange('period', 'PM')}
				>
					PM
				</Button>
			</HStack>
		</HStack>
	);
};

export default TimePicker;
