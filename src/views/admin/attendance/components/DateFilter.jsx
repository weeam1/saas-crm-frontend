import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Button } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';

const DateFilter = ({ onFilterChange }) => {
	const [searchParams] = useSearchParams();
	const currentDate = moment();

	const month = searchParams.get('month') || currentDate.format('MM');
	const year = searchParams.get('year') || currentDate.format('YYYY');

	const [date, setDate] = useState(moment(`${year}-${month}-01`).toDate());
	const [showCalendar, setShowCalendar] = useState(false);
	const minSelectableDate = new Date(2025, 2, 28);

	const handleDateChange = (selectedDate) => {
		setDate(selectedDate);
		setShowCalendar(false);
		onFilterChange({
			month: moment(selectedDate).format('MM'),
			year: moment(selectedDate).format('YYYY'),
		});
	};

	return (
		<Box position='relative'>
			<Button
				leftIcon={<CalendarIcon />}
				bg='softGray.50'
				color='gray.800'
				borderRadius='md'
				onClick={() => setShowCalendar(!showCalendar)}
			>
				{moment(date).format('MMM YYYY')}
			</Button>

			{showCalendar && (
				<Box
					position='absolute'
					right='50%'
					zIndex='100'
					bg='white'
					boxShadow='md'
				>
					<Calendar
						onChange={handleDateChange}
						value={date}
						view='year'
						minDate={minSelectableDate}
						onClickMonth={handleDateChange}
						tileDisabled={({ date }) => date.getDate() !== 1}
					/>
				</Box>
			)}
		</Box>
	);
};

export default DateFilter;
