import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react';
import * as Yup from 'yup';

import 'react-datepicker/dist/react-datepicker.css';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import { toUTCString } from 'utils/helpers';

const DateRangeFilter = ({ dateFilterHandler }) => {
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [openCalendar, setOpenCalendar] = useState(null);
	const [errors, setErrors] = useState({});

	const toggleCalendar = (calendar) => {
		setOpenCalendar(openCalendar === calendar ? null : calendar);
	};

	const validateAndSend = (start, end) => {
		const schema = Yup.object({
			startDate: Yup.date().required(),
			endDate: Yup.date()
				.required()
				.min(start, 'End date must be after start date'),
		});

		schema
			.validate({ startDate: start, endDate: end }, { abortEarly: false })
			.then(() => {
				setErrors({});
				dateFilterHandler(toUTCString(start), toUTCString(end));
			})
			.catch((validationError) => {
				const errs = {};
				validationError.inner.forEach((e) => {
					errs[e.path] = e.message;
				});
				setErrors(errs);
			});
	};

	const handleStartChange = (date) => {
		console.log('Start selected:', date);
		setStartDate(date);

		dateFilterHandler({ start: toUTCString(date) });

		// if (date) validateAndSend(date, endDate);
	};

	const handleEndChange = (date) => {
		console.log('End selected:', date);
		setEndDate(date);
		dateFilterHandler({ end: toUTCString(date) });

		// if (date) validateAndSend(startDate, date);
	};

	return (
		<VStack width='100%' alignItems='flex-end'>
			<CustomDatePicker
				selectedDate={startDate}
				handleDateChange={handleStartChange}
				errors={errors.startDate || ''}
				label='Start Date'
				placeholder='Select start date'
				maxDate={endDate || new Date()}
				isCalendarOpen={openCalendar === 'start'}
				toggleCalendar={() => toggleCalendar('start')}
			/>

			<CustomDatePicker
				selectedDate={endDate}
				handleDateChange={handleEndChange}
				errors={errors.endDate || ''}
				label='End Date'
				placeholder='Select end date'
				minDate={startDate}
				maxDate={new Date()}
				isCalendarOpen={openCalendar === 'end'}
				toggleCalendar={() => toggleCalendar('end')}
			/>
		</VStack>
	);
};

export default DateRangeFilter;
