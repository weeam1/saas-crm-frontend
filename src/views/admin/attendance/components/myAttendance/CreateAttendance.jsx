import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import moment from 'moment';

// Custom components
import { useCreateItemMutation } from 'api/apiSlice';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import { toast } from 'react-toastify';
import { buttonStyle } from 'utils/btn';
import LeaveNoteModal from './LeaveNoteModal';
import AttendanceSelector from './AttendanceSelectors';
import NoteModal from './NoteModal';

const CreateAttendance = ({ isOpen, onClose, employeeId, refetch }) => {
	const [checkInTime, setCheckInTime] = useState('09:00 AM');
	const [checkOutTime, setCheckOutTime] = useState('06:00 PM');
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [openCalendar, setOpenCalendar] = useState(null);
	const [leaveLoading, setLeaveLoading] = useState(false);

	const [attendanceStatus, setAttendanceStatus] = useState('present');

	const [initialPayload, setInitialPayload] = useState({
		employeeId: '',
		date: '',
	});

	const {
		isOpen: noteIsOpen,
		onOpen: noteOnOpen,
		onClose: noteOnClose,
	} = useDisclosure();

	const {
		isOpen: checkinNoteIsOpen,
		onOpen: checkinNoteOnOpen,
		onClose: checkinNoteOnClose,
	} = useDisclosure();

	const {
		isOpen: absentNoteIsOpen,
		onOpen: absentNoteOnOpen,
		onClose: absentNoteOnClose,
	} = useDisclosure();

	const [createItemMutation, { isLoading: isUpdating }] =
		useCreateItemMutation();

	const handleSave = async () => {
		const basePayload = {
			employeeId,
			date: moment(selectedDate).format('YYYY-MM-DD'),
		};

		setInitialPayload(basePayload);

		const actionHandlers = {
			absent: absentNoteOnOpen,
			leave: noteOnOpen,
			present: checkinNoteOnOpen,
		};

		if (actionHandlers[attendanceStatus]) {
			await actionHandlers[attendanceStatus]();
		}
	};

	const handlePresent = async ({ note }) => {
		const checkIn = moment(checkInTime, 'hh:mm A');
		const checkOut = moment(checkOutTime, 'hh:mm A');

		if (checkOut.isBefore(checkIn)) {
			toast.error('Check-Out time must be after Check-In!');
			return;
		}

		checkinNoteOnClose();

		await handleAttendanceAction('present', {
			...initialPayload,
			checkinNote: note,
			checkin: checkInTime,
			checkout: checkOutTime,
		});
	};

	const handleAttendanceAction = async (type, payload) => {
		const endpointMap = {
			present: '/attendance',
			absent: '/attendance/absent',
			leave: '/attendance/leave',
		};

		try {
			await createItemMutation({
				path: endpointMap[type],
				body: payload,
			}).unwrap();

			toast.success('Attendance record added successfully');
			refetch({ force: true });
			onClose();
		} catch (error) {
			console.error(error);
			toast.error(error?.data?.message || `Error in employee ${type}`);
		}
	};

	const handleLeave = async (values) => {
		noteOnClose();
		await handleAttendanceAction('leave', {
			...values,
			...initialPayload,
		});
	};

	const handleAbsent = async ({ note = '' }) => {
		absentNoteOnClose();

		handleAttendanceAction('absent', {
			...initialPayload,
			absentNote: note || '',
		});
	};

	const toggleCalendar = (target) => {
		setOpenCalendar((prev) => (prev === target ? null : target));
	};

	return (
		<>
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

						{/* <HStack
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
								<NormalTimePicker
									value={checkInTime}
									onChange={setCheckInTime}
								/>
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
						</HStack> */}

						<AttendanceSelector
							checkInTime={checkInTime}
							checkOutTime={checkOutTime}
							setCheckInTime={setCheckInTime}
							setCheckOutTime={setCheckOutTime}
							attendanceStatus={attendanceStatus}
							setAttendanceStatus={setAttendanceStatus}
						/>
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
							fontSize='md'
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
							fontSize='md'
							aria-label='add'
							onClick={handleSave}
							isLoading={isUpdating}
						>
							{isUpdating ? 'Loading...' : 'Add'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			{noteIsOpen && (
				<LeaveNoteModal
					isOpen={noteIsOpen}
					onClose={noteOnClose}
					onSubmit={handleLeave}
					isLoading={isUpdating}
				/>
			)}

			{checkinNoteIsOpen && (
				<NoteModal
					title='Check In Note'
					isOpen={checkinNoteIsOpen}
					onClose={checkinNoteOnClose}
					onSubmit={handlePresent}
					isLoading={isUpdating}
				/>
			)}

			{absentNoteIsOpen && (
				<NoteModal
					title='Absent Note'
					isOpen={absentNoteIsOpen}
					onClose={absentNoteOnClose}
					onSubmit={handleAbsent}
					isLoading={isUpdating}
				/>
			)}
		</>
	);
};

export default CreateAttendance;
