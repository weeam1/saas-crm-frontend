import { CalendarIcon } from '@chakra-ui/icons';
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

	const toggleCalendar = () => {
		setShowCalendar(!showCalendar);
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setShowCalendar(false); // Hide the calendar after selecting a date
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
						<FormControl mb={4}>
							<FormLabel>Select Date</FormLabel>
							{/* Input Wrapper */}
							<Box position='relative' width='100%'>
								<InputGroup>
									<Input
										value={
											selectedDate ? selectedDate.toLocaleDateString() : ''
										}
										placeholder='Select a date'
										readOnly
										bg='#F2F2F2'
										borderColor='gray.300'
										borderRadius='md'
										focusBorderColor='#E0B960'
									/>
									{/* Calendar Icon Inside Input */}
									<InputRightElement
										children={
											<FaRegCalendar
												size={16}
												cursor='pointer'
												onClick={toggleCalendar}
											/>
										}
									/>
								</InputGroup>

								{/* Calendar Component */}
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
						</FormControl>
						{/* Time Input */}
						<FormControl>
							<FormLabel>Select Time</FormLabel>
							<Input
								type='time'
								value={selectedTime}
								onChange={(e) => setSelectedTime(e.target.value)}
								focusBorderColor='#E0B960'
								bg='#F2F2F2'
								borderRadius='md'
								colorScheme='brand'
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
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='gray'
							onClick={onClose}
							variant='outline'
							size='sm'
							mr={2}
						>
							Cancel
						</Button>
						<Button
							bg='brand.500'
							color='white'
							_hover={{
								bg: 'brand.600',
								color: 'white',
							}}
							_active={{
								bg: 'brand.600',
							}}
							size='sm'
							px='1rem'
							onClick={handleScheduleInterview}
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
