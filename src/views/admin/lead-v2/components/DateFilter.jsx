import React, { useState } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	HStack,
	Input,
} from '@chakra-ui/react';
// import { RangeDatepicker, SingleDatepicker } from 'chakra-dayzed-datepicker';
import { buttonStyle, customDatepickerStyles } from './constants';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formattedDate } from 'utils/helpers';

const DateFilter = ({
	setQueryParams,
	setRefetchLoading,
	setCurrentPage,
	onClose,
	isOpen,
	setSearchTags,
	setSearchClear,
}) => {
	// const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	// const [selectedDate, setSelectedDate] = useState(new Date());
	// const [isRange, setIsRange] = useState(true);

	const toUTCString = (date) => (date ? new Date(date).toISOString() : null);

	const handleApply = () => {
		const from = toUTCString(startDate);
		const to = toUTCString(endDate);

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
	};

	return (
		// <VStack spacing={4} p={4}>
		// 	{/* <Button onClick={() => setIsRange(!isRange)}>
		// 		{isRange ? 'Switch to Single Date' : 'Switch to Date Range'}
		// 	</Button> */}

		// 	{/* {isRange ? ( */}
		// 	<RangeDatepicker
		// 		selectedDates={selectedDates}
		// 		onDateChange={setSelectedDates}
		// 		propsConfigs={{
		// 			inputProps: {
		// 				placeholder: 'Select date range',
		// 				sx: {
		// 					background: 'white !important', // Forces white background
		// 					color: 'black !important', // Ensures text is visible
		// 					_placeholder: { color: 'gray.500 !important' }, // Placeholder color
		// 					border: '1px solid #ccc !important', // Ensures border visibility
		// 				},import { formattedDate } from 'utils/helpers';

		// 			},
		// 		}}
		// 	/>

		// 	{/* ) : (
		// 		<SingleDatepicker
		// 			date={selectedDate}
		// 			onDateChange={setSelectedDate}
		// 			propsConfigs={{ inputProps: { placeholder: 'Select a date' } }}
		// 		/>
		// 	)} */}

		// 	<Button
		// 		{...buttonStyle}
		// 		variant='solid'
		// 		bg='brand.400'
		// 		py='2'
		// 		px='5'
		// 		aria-label='New lead'
		// 		colorScheme='blue'
		// 		onClick={handleApply}
		// 	>
		// 		Apply Filter
		// 	</Button>

		// 	{/* <Text>
		// 		{isRange
		// 			? `Selected Range: ${selectedDates[0]?.toLocaleDateString()} - ${selectedDates[1]?.toLocaleDateString()}`
		// 			: `Selected Date: ${selectedDate?.toLocaleDateString()}`}
		// 	</Text> */}
		// </VStack>

		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Select Date Range</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<HStack p={4} width='100%' spacing={4} alignItems='flex-end'>
						<style>{customDatepickerStyles.styles}</style>

						{/* Start Date */}
						<FormControl>
							<FormLabel fontSize='sm' fontWeight='600' color='gray.700' mb={1}>
								Start Date
							</FormLabel>
							<DatePicker
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								dateFormat='MM/dd/yyyy'
								placeholderText='Select start date'
								customInput={<Input />}
							/>
						</FormControl>

						{/* End Date */}
						<FormControl>
							<FormLabel fontSize='sm' fontWeight='600' color='gray.700' mb={1}>
								End Date
							</FormLabel>
							<DatePicker
								selected={endDate}
								onChange={(date) => setEndDate(date)}
								dateFormat='MM/dd/yyyy'
								placeholderText='Select end date'
								customInput={<Input />}
							/>
						</FormControl>
					</HStack>
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
						onClick={handleApply}
					>
						Apply Filter
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DateFilter;
