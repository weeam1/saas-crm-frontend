import React, { useRef, useState } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	VStack,
} from '@chakra-ui/react';
import { buttonStyle } from './constants';

import 'react-datepicker/dist/react-datepicker.css';
import CustomDatePicker from 'components/datetime/CustomDatePicker';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

const DateFilter = ({
	onClose,
	isOpen,
	setRefetchLoading,
	dateFitlerHanlder,
}) => {
	const [openCalendar, setOpenCalendar] = useState(null); // Track which calendar is open

	const toggleCalendar = (calendar) => {
		setOpenCalendar(openCalendar === calendar ? null : calendar);
	};

	const toUTCString = (date) => {
		return date
			? moment(date).utcOffset(0, true).startOf('day').toISOString()
			: null;
	};

	const formik = useFormik({
		initialValues: {
			startDate: '',
			endDate: '',
		},
		validationSchema: Yup.object({
			startDate: Yup.date().required('Start date is required'),
			endDate: Yup.date()
				.required('End date is required')
				.min(Yup.ref('startDate'), 'End date must be after start date'),
		}),
		onSubmit: (values) => {
			const from = toUTCString(values.startDate);
			const to = toUTCString(values.endDate);

			// // Update query params for RTK Query
			// setQueryParams((prev) => ({
			// 	...prev,
			// 	page: 1,
			// 	dateTime: from && to ? `${from}|${to}` : from || to,
			// }));

			// setCurrentPage(1);

			dateFitlerHanlder(from, to);

			// const searchValues = [
			// 	`Start: ${formattedDate(from)}`,
			// 	`End: ${formattedDate(to)}`,
			// ];
			// setSearchTags(searchValues);
			// setRefetchLoading(true);
			// setSearchClear(true);
			// onClose();
		},
	});

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Date Range Filter</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack p={4} width='100%' gap='2' alignItems='flex-end'>
						{/* Start Date */}
						<CustomDatePicker
							selectedDate={formik.values.startDate}
							handleDateChange={(date) =>
								formik.setFieldValue('startDate', date)
							}
							errors={formik.touched.startDate && formik.errors.startDate}
							label='Start Date'
							placeholder='Select start date'
							maxDate={formik.values.endDate || new Date()}
							isCalendarOpen={openCalendar === 'start'}
							toggleCalendar={() => toggleCalendar('start')}
						/>

						{/* End Date */}
						<CustomDatePicker
							selectedDate={formik.values.endDate}
							handleDateChange={(date) => formik.setFieldValue('endDate', date)}
							errors={formik.touched.endDate && formik.errors.endDate}
							label='End Date'
							placeholder='Select end date'
							minDate={formik.values.startDate} // Ensure the end date is after the start date
							maxDate={new Date()}
							isCalendarOpen={openCalendar === 'end'}
							toggleCalendar={() => toggleCalendar('end')}
						/>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button py='2' px='5' mr='2' variant='ghost' onClick={onClose}>
						Cancel
					</Button>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='brand.400'
						py='2'
						px='5'
						aria-label='New lead'
						onClick={formik.handleSubmit}
						isDisabled={!formik.dirty || !formik.isValid}
					>
						Apply Filter
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DateFilter;
