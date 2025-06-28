import { Box, Text } from '@chakra-ui/react';
import { format, isToday, isTomorrow } from 'date-fns';

const ChatDate = ({ date, prevDate }) => {
	// Check if this is a new date compared to previous message
	const currentDate = new Date(date);
	const previousDate = prevDate ? new Date(prevDate) : null;

	const isNewDate = !previousDate || !isSameDay(currentDate, previousDate);

	if (!isNewDate) return null;

	let label;
	if (isToday(currentDate)) {
		label = 'Today';
	} else if (isTomorrow(currentDate)) {
		label = 'Tomorrow';
	} else {
		label = format(currentDate, 'EEE d MMMM yyyy');
	}

	return (
		<Box textAlign='center' my={2}>
			<Text
				display='inline-block'
				bg='gray.200'
				px={3}
				py={1}
				borderRadius='full'
				fontSize='sm'
				color='gray.600'
			>
				{label}
			</Text>
		</Box>
	);
};

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
	return (
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	);
}

export default ChatDate;
