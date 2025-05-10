import { useState } from 'react';
import {
	Button,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Box,
	HStack,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { buttonStyle } from '../constants';
import CustomTimePicker from 'components/customDatePicker/CustomDatePicker';
import moment from 'moment';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';

const AttendanceUpdate = ({ isOpen, onClose, data, refetch, updateKey }) => {
	const [checkInTime, setCheckInTime] = useState(data.checkin ?? '09:00 AM');
	const [checkOutTime, setCheckOutTime] = useState(data.checkout ?? '06:00 PM');

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleSave = async () => {
		const checkIn = moment(checkInTime, 'hh:mm A');
		const checkOut = moment(checkOutTime, 'hh:mm A');

		if (checkOut.isBefore(checkIn)) {
			toast.error('Check-Out time must be greater than Check-In time!');
			return;
		}

		try {
			if (data?._id) {
				const res = await updateItemMutation({
					path: `/attendance/${data?._id}`,
					body: { checkin: checkInTime, checkout: checkOutTime },
				}).unwrap();

				toast.success('Attendance record update successfully');
				if (updateKey === 'record') {
					const updatedFields = {
						checkin: checkInTime,
						checkout: checkOutTime,
						status: res?.doc?.status,
						updatedAt: res?.doc?.updatedAt,
						totalWorkingHours: res?.doc?.totalWorkingHours,
					};

					refetch(data?._id, updatedFields);
				} else refetch({ force: true });
			}
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee update');
		}
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Attendance Timing</ModalHeader>
				<ModalBody>
					<HStack
						flexDir={{ base: 'column', md: 'row' }}
						justify='space-around'
						alignItems='center'
						gap={2}
					>
						<Box flex='1' bg='softGray.50' p='2' rounded='md'>
							<Text mb={2} fontWeight='400' fontSize='lg'>
								Check In
							</Text>
							{/* <CustomTimePicker value={checkInTime} onChange={setCheckInTime} /> */}
							<NormalTimePicker value={checkInTime} onChange={setCheckInTime} />
						</Box>

						<Box flex='1' bg='softGray.50' p='2' rounded='md'>
							<Text mb={2} fontWeight='400' fontSize='lg'>
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
						aria-label='update'
						onClick={handleSave}
					>
						{isUpdating ? 'Updating...' : 'Update'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AttendanceUpdate;
