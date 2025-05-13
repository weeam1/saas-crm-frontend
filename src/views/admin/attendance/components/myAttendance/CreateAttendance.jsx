import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	HStack,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import moment from 'moment';

// Custom components
import { useCreateItemMutation } from 'api/apiSlice';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';
import { toast } from 'react-toastify';
import { buttonStyle } from 'utils/btn';

const CreateAttendance = ({ isOpen, onClose, employeeId, refetch }) => {
	const [checkInTime, setCheckInTime] = useState('09:00 AM');
	const [checkOutTime, setCheckOutTime] = useState('06:00 PM');
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [openCalendar, setOpenCalendar] = useState(null);

	const [createItemMutation, { isLoading: isUpdating }] =
		useCreateItemMutation();

	const handleSave = async () => {
		const checkIn = moment(checkInTime, 'hh:mm A');
		const checkOut = moment(checkOutTime, 'hh:mm A');

		if (checkOut.isBefore(checkIn)) {
			toast.error('Check-Out time must be after Check-In!');
			return;
		}

		try {
			const payload = {
				checkin: checkInTime,
				date: moment(selectedDate).format('YYYY-MM-DD'),
				checkout: checkOutTime,
				employeeId,
			};

			await createItemMutation({
				path: `/attendance`,
				body: payload,
			}).unwrap();

			toast.success('Attendance record added successfully');
			refetch({ force: true });
			onClose();
		} catch (err) {
			toast.error(err?.data?.message || 'Record adding failed');
		}
	};

	const toggleCalendar = (target) => {
		setOpenCalendar((prev) => (prev === target ? null : target));
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Attendance</ModalHeader>
				<ModalBody>
					<Box mb={4}>
						<CustomDatePicker
							selectedDate={selectedDate}
							handleDateChange={(date) => setSelectedDate(date)}
							label='Date'
							placeholder='Select date'
							maxDate={new Date()}
							isCalendarOpen={openCalendar === 'start'}
							toggleCalendar={() => toggleCalendar('start')}
						/>
					</Box>

					<HStack
						flexDir={{ base: 'column', md: 'row' }}
						justifyContent='center'
						alignItems='center'
						gap={3}
						width='100%'
					>
						<Box bg='softGray.50' p='3' rounded='md' minW='200px'>
							<Text mb={2} fontWeight='500'>
								Check In
							</Text>
							<NormalTimePicker value={checkInTime} onChange={setCheckInTime} />
						</Box>

						<Box bg='softGray.50' p='3' rounded='md' minW='200px'>
							<Text mb={2} fontWeight='500'>
								Check Out
							</Text>
							<NormalTimePicker
								value={checkOutTime}
								onChange={setCheckOutTime}
							/>
						</Box>
					</HStack>
				</ModalBody>

				<ModalFooter>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='gray.200'
						color='gray.800'
						_active={{ bg: 'gray.300' }}
						py='5'
						px='8'
						mr='3'
						fontSize='lg'
						aria-label='close'
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='brand.400'
						py='5'
						px='8'
						fontSize='lg'
						aria-label='add'
						onClick={handleSave}
					>
						{isUpdating ? 'Loading...' : 'Add'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateAttendance;
