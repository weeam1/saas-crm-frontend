import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Input,
	FormControl,
	FormLabel,
	Spinner,
	Box,
	InputRightElement,
	InputGroup,
	Text,
} from '@chakra-ui/react';
import './date.css';
import { FaRegCalendar } from 'react-icons/fa';
import { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ArrangeInterview = ({
	isOpen,
	onClose,
	selectedTime,
	setSelectedTime,
	selectedDate,
	setSelectedDate,
	isLoading,
	handleScheduleInterview,
}) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const [showTime, setShowTime] = useState('');
	const [errors, setErrors] = useState({});

	const toggleCalendar = () => {
		setShowCalendar(!showCalendar);
	};

	const handleDateChange = (date) => {
		if (!(date instanceof Date)) {
			console.error('Invalid date:', date);
			return;
		}

		const formattedDate = date.toDateString(); // Example: "Thu Jan 30 2025"
		console.log('Formatted Date:', formattedDate);
		setErrors((prev) => ({ ...prev, selectedDate: '' }));
		setSelectedDate(date); // Store Date object, not a formatted string
		setShowCalendar(false); // Hide the calendar after selecting a date
	};

	const handleTimeChange = (e) => {
		const time = e.target.value;

		console.log(time);

		setShowTime(time);

		if (time !== '') {
			let hours = time.split(':')[0];
			let minutes = time.split(':')[1];
			let suffix = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12 || 12;
			hours = hours < 10 ? '0' + hours : hours;

			const displayTime = hours + ':' + minutes + ' ' + suffix;

			setErrors((prev) => ({ ...prev, showTime: '' }));
			setSelectedTime(displayTime);
		}
	};

	const handleSubmit = () => {
		const newErrors = {};
		if (!selectedDate) newErrors.selectedDate = 'Date is required';
		if (!showTime) newErrors.showTime = 'Time is required';

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			handleScheduleInterview();
		}
	};

	return (
		<>
			{/* Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
				<ModalOverlay />
				<ModalContent p='1rem'>
					<ModalHeader>Interview Invite</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{/* Date Input */}
						<FormControl mb={4} isInvalid={errors?.selectedDate}>
							<FormLabel>Select Date</FormLabel>
							<Box position='relative' width='100%'>
								<InputGroup>
									<Input
										value={
											selectedDate ? selectedDate.toLocaleDateString() : ''
										}
										placeholder='Select a date'
										readOnly
										required
										bg='#F2F2F2'
										borderColor={errors?.selectedDate ? 'red.500' : 'gray.300'}
										borderRadius='md'
										focusBorderColor={
											errors?.selectedDate ? 'red.500' : '#E0B960'
										}
									/>
									<InputRightElement>
										<FaRegCalendar
											size={16}
											cursor='pointer'
											onClick={toggleCalendar}
										/>
									</InputRightElement>
								</InputGroup>
								{showCalendar && (
									<Box
										position='absolute'
										top='50px'
										zIndex='10'
										bg='white'
										border='1px solid #e2e8f0'
										borderRadius='md'
										boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)'
									>
										<Calendar
											onChange={handleDateChange}
											value={selectedDate}
											minDate={new Date()}
											className='custom-calendar'
										/>
									</Box>
								)}
							</Box>
							{errors?.selectedDate && (
								<Text color='red.500' fontSize='sm'>
									{errors?.selectedDate}
								</Text>
							)}
						</FormControl>

						{/* Time Input */}
						<FormControl isInvalid={errors?.showTime}>
							<FormLabel>Select Time</FormLabel>
							<Input
								type='time'
								value={showTime}
								onChange={handleTimeChange}
								focusBorderColor={errors?.showTime ? 'red.500' : '#E0B960'}
								bg='#F2F2F2'
								required
								borderRadius='md'
								borderColor={errors?.showTime ? 'red.500' : 'gray.300'}
								placeholder='Select a time'
								shadow='sm'
								pl='1rem'
								pr='.5rem'
								sx={{
									'&::-webkit-calendar-picker-indicator': {
										cursor: 'pointer',
									},
								}}
							/>
							{errors?.showTime && (
								<Text color='red.500' fontSize='sm'>
									{errors?.showTime}
								</Text>
							)}
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='gray'
							onClick={onClose}
							letiant='outline'
							size='sm'
							mr={2}
						>
							Cancel
						</Button>
						<Button
							bg='brand.400'
							color='white'
							_hover={{
								bg: 'brand.500',
							}}
							size='sm'
							px='1rem'
							rounded='full'
							_active={{ bg: '#D4AC50' }}
							onClick={handleSubmit}
						>
							{isLoading ? <Spinner /> : 'Invite'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ArrangeInterview;
