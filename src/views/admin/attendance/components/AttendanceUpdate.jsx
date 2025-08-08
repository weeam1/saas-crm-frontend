import { useState } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { buttonStyle } from '../constants';
import moment from 'moment';
import AttendanceSelector from './myAttendance/AttendanceSelectors';
import LeaveNoteModal from './myAttendance/LeaveNoteModal';
import NoteModal from './myAttendance/NoteModal';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const AttendanceUpdate = ({ isOpen, onClose, data, refetch, updateKey }) => {
	const [checkInTime, setCheckInTime] = useState(data.checkin ?? '09:00 AM');
	const [checkOutTime, setCheckOutTime] = useState(data.checkout ?? '06:00 PM');
	const [attendanceStatus, setAttendanceStatus] = useState('present');

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

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

	const today = new Date().toISOString().split('T')[0];

	const isToday = data?.date === today;

	const showCheckout = isToday ? data?.checkout : true;

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleSave = async (values) => {
		let updatedData = {};

		if (attendanceStatus === 'leave') {
			updatedData = {
				status: 3,
				leaveNote: values.note,
				leaveType: values.leaveType,
			};
		} else if (attendanceStatus === 'absent') {
			updatedData = { status: 0, absentNote: values.note };
		} else {
			updatedData = {
				status: 1,
				checkinNote: values.note,
				checkin: checkInTime,
				...(showCheckout && {
					checkout: checkOutTime,
				}),
			};

			const checkIn = moment(checkInTime, 'hh:mm A');
			const checkOut = moment(checkOutTime, 'hh:mm A');

			if (checkOut.isBefore(checkIn)) {
				toast.error('Check-Out time must be greater than Check-In time!');
				return;
			}
		}

		try {
			if (data?._id) {
				const res = await updateItemMutation({
					path: `/attendance/${data?._id}`,
					body: updatedData,
				}).unwrap();

				toast.success('Attendance record update successfully');
				if (updateKey === 'record') {
					const updated = res?.doc;
					const updatedFields = {
						checkin: updated?.checkin,
						checkout: showCheckout ? updated?.checkout : null,
						status: updated?.status,
						updatedAt: updated?.updatedAt,
						totalWorkingHours: updated?.totalWorkingHours,
						leaveNote: updated?.leaveNote,
						leaveType: updated?.leaveType,
						checkinNote: updated?.checkinNote,
						absentNote: updated?.absentNote,
					};

					refetch(data?._id, updatedFields);
				} else refetch({ force: true });

				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Attendance',
					entityType: 'Attendance',

					entityId: res?.doc?._id,
					status: 'success',
					message: `${user?.fullName || ''} updated attendance record`,
				});
			}
		} catch (e) {
			console.log(e);
			const errorMsg = e?.data?.message || 'Error in attendance update';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Attendance',
				entityType: 'Attendance',

				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
		onClose();
	};

	const onSaveClick = () => {
		if (attendanceStatus === 'leave') {
			noteOnOpen();
		} else if (attendanceStatus === 'absent') {
			absentNoteOnOpen();
		} else {
			checkinNoteOnOpen();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Update Attendance</ModalHeader>
				<ModalBody>
					<AttendanceSelector
						checkInTime={checkInTime}
						checkOutTime={checkOutTime}
						setCheckInTime={setCheckInTime}
						setCheckOutTime={setCheckOutTime}
						attendanceStatus={attendanceStatus}
						setAttendanceStatus={setAttendanceStatus}
						showCheckout={showCheckout}
					/>
					{/* <HStack
						flexDir={{ base: 'column', md: 'row' }}
						justifyContent='center'
						alignItems='center'
						gap={2}
						// width='100%'
						width='fit-content'
					>
						<Box
							flex='1'
							bg='softGray.50'
							p='2'
							width='fit-content'
							rounded='md'
						>
							<Text mb={2} fontWeight='400' fontSize='lg'>
								Check In
							</Text>
							<NormalTimePicker value={checkInTime} onChange={setCheckInTime} />
						</Box>

						{showCheckout && (
							<Box flex='1' bg='softGray.50' p='2' rounded='md'>
								<Text mb={2} fontWeight='400' fontSize='lg'>
									Check Out
								</Text>
								<NormalTimePicker
									value={checkOutTime}
									onChange={setCheckOutTime}
								/>
							</Box>
						)}
					</HStack> */}
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
						aria-label='update'
						onClick={onSaveClick}
					>
						{isUpdating ? 'Updating...' : 'Save'}
					</Button>
				</ModalFooter>

				{noteIsOpen && (
					<LeaveNoteModal
						isOpen={noteIsOpen}
						onClose={noteOnClose}
						onSubmit={(values) => {
							noteOnClose();
							handleSave(values);
						}}
						isLoading={isUpdating}
					/>
				)}

				{checkinNoteIsOpen && (
					<NoteModal
						title='Check In Note'
						isOpen={checkinNoteIsOpen}
						onClose={checkinNoteOnClose}
						onSubmit={(values) => {
							checkinNoteOnClose();
							handleSave(values);
						}}
						isLoading={isUpdating}
					/>
				)}

				{absentNoteIsOpen && (
					<NoteModal
						title='Absent Note'
						isOpen={absentNoteIsOpen}
						onClose={absentNoteOnClose}
						onSubmit={(values) => {
							absentNoteOnClose();
							handleSave(values);
						}}
						isLoading={isUpdating}
					/>
				)}
			</ModalContent>
		</Modal>
	);
};

export default AttendanceUpdate;
