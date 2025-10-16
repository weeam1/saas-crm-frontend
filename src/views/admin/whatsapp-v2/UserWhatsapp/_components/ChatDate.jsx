import { Box, Text } from '@chakra-ui/react';
import { format, isToday, isYesterday, isSameWeek } from 'date-fns';

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
	return (
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear()
	);
}

const ChatDate = ({ timestamp, prevMsg }) => {
	if (!timestamp) return null;

	// Convert seconds → milliseconds
	const currentDate = new Date(timestamp * 1000);
	const prevDate = new Date(prevMsg?.timestamp * 1000) || null;

	const showDate = !prevMsg || !isSameDay(currentDate, prevDate);

	if (!showDate) return null;

	let label;

	if (isToday(currentDate)) {
		label = 'Today';
	} else if (isYesterday(currentDate)) {
		label = 'Yesterday';
	} else if (isSameWeek(currentDate, new Date())) {
		label = format(currentDate, 'EEEE'); // e.g. "Monday"
	} else {
		label = format(currentDate, 'EEEE, MMM d, yyyy'); // e.g. "Saturday, Oct 4, 2025"
	}

	return (
		<Box textAlign='center' my={2}>
			<Text
				display='inline-block'
				bg='brand.200'
				px={3}
				py={1}
				borderRadius='full'
				fontSize='xs'
				shadow='sm'
				color='gray.600'
			>
				{label}
			</Text>
		</Box>
	);
};

export default ChatDate;
