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
import { formattedDate } from 'utils/helpers';
import CustomDatePicker from 'components/datetime/CustomDatePicker';

// const DateFilter = ({
// 	setQueryParams,
// 	setRefetchLoading,
// 	setCurrentPage,
// 	onClose,
// 	isOpen,
// 	setSearchTags,
// 	setSearchClear,
// }) => {
// 	const [startDate, setStartDate] = useState();
// 	const [endDate, setEndDate] = useState();

// 	const [errors, setErrors] = useState({});
// 	const [openCalendar, setOpenCalendar] = useState(null); // Track which calendar is open

// 	const handleStartDateChange = (date) => {
// 		setStartDate(date);
// 		setErrors((prevErrors) => ({ ...prevErrors, startDate: '' }));
// 	};

// 	const handleEndDateChange = (date) => {
// 		setEndDate(date);
// 		setErrors((prevErrors) => ({ ...prevErrors, endDate: '' }));
// 	};

// 	const toggleCalendar = (calendar) => {
// 		setOpenCalendar(openCalendar === calendar ? null : calendar);
// 	};

// 	// const [selectedDate, setSelectedDate] = useState(new Date());
// 	// const [isRange, setIsRange] = useState(true);

// 	const toUTCString = (date) => (date ? new Date(date).toISOString() : null);

// 	const handleApply = () => {
// 		const from = toUTCString(startDate);
// 		const to = toUTCString(endDate);

// 		// Update query params for RTK Query
// 		setQueryParams((prev) => ({
// 			...prev,
// 			dateTime: from && to ? `${from}|${to}` : from || to,
// 			page: 1,
// 		}));
// 		setCurrentPage(1);

// 		const searchValues = [
// 			`Start: ${formattedDate(from)}`,
// 			`End: ${formattedDate(to)}`,
// 		];
// 		setSearchTags(searchValues);
// 		setRefetchLoading(true);
// 		setSearchClear(true);
// 		onClose();
// 	};

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} isCentered>
// 			<ModalOverlay />
// 			<ModalContent>
// 				<ModalHeader>Date Range Filter</ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody>
// 					<VStack p={4} width='100%' gap='2' alignItems='flex-end'>
// 						{/* Start Date */}
// 						<CustomDatePicker
// 							selectedDate={startDate}
// 							handleDateChange={handleStartDateChange}
// 							errors={errors}
// 							label='Start Date'
// 							placeholder='Select start date'
// 							maxDate={endDate || new Date()}
// 							isCalendarOpen={openCalendar === 'start'}
// 							toggleCalendar={() => toggleCalendar('start')}
// 						/>

// 						{/* End Date */}
// 						<CustomDatePicker
// 							selectedDate={endDate}
// 							handleDateChange={handleEndDateChange}
// 							errors={errors}
// 							label='End Date'
// 							placeholder='Select end date'
// 							minDate={startDate} // Ensure the end date is after the start date
// 							maxDate={new Date()}
// 							isCalendarOpen={openCalendar === 'end'}
// 							toggleCalendar={() => toggleCalendar('end')}
// 						/>
// 					</VStack>
// 				</ModalBody>

// 				<ModalFooter>
// 					<Button py='2' px='5' mr='2' variant='ghost' onClick={onClose}>
// 						Cancel
// 					</Button>
// 					<Button
// 						{...buttonStyle}
// 						variant='solid'
// 						bg='brand.400'
// 						py='2'
// 						px='5'
// 						aria-label='New lead'
// 						onClick={handleApply}
// 					>
// 						Apply Filter
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

import { useFormik } from 'formik';
import * as Yup from 'yup';

const DateFilter = ({
	setQueryParams,
	setRefetchLoading,
	setCurrentPage,
	onClose,
	isOpen,
	setSearchTags,
	setSearchClear,
}) => {
	const [openCalendar, setOpenCalendar] = useState(null); // Track which calendar is open

	const toggleCalendar = (calendar) => {
		setOpenCalendar(openCalendar === calendar ? null : calendar);
	};

	const toUTCString = (date) => (date ? new Date(date).toISOString() : null);

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

			// Update query params for RTK Query
			setQueryParams((prev) => ({
				...prev,
				dateTime: from && to ? `${from}|${to}` : from || to,
				page: 1,
			}));
			setCurrentPage(1);

			const searchValues = [
				`Start: ${formattedDate(from)}`,
				`End: ${formattedDate(to)}`,
			];
			setSearchTags(searchValues);
			setRefetchLoading(true);
			setSearchClear(true);
			onClose();
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
