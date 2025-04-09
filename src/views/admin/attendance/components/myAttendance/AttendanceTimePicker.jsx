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
	VStack,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import CustomTimePicker from 'components/customDatePicker/CustomDatePicker';
import moment from 'moment';
import { buttonStyle } from '../../constants';
import { useCreateItemMutation } from 'api/apiSlice';

const AttendanceTimePicker = ({
	isOpen,
	onClose,
	employeeId,
	data,
	refetch,
	type,
	setStatus,
}) => {
	console.log({ employeeId, data, refetch, type });
	const [selectedTime, setSelectedTime] = useState(
		data?.checkin ? '06:00 PM' : '09:00 AM'
	);

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const [createItemMutation, { isLoading: isCreating }] =
		useCreateItemMutation();

	const handleSave = async () => {
		if (type === 'checkout') {
			const checkIn = moment(data?.checkin, 'hh:mm A');
			const checkOut = moment(selectedTime, 'hh:mm A');

			if (checkOut.isBefore(checkIn)) {
				toast.error('Check-Out time must be greater than Check-In time!');
				return;
			}
		}

		try {
			if (type === 'checkin') {
				await createItemMutation({
					path: `/attendance/checkin`,
					body: { selectedTime, employeeId },
				}).unwrap();

				toast.success('Employee Check in successfully');
				setStatus(1);
			} else {
				await updateItemMutation({
					path: `/attendance/checkout`,
					body: { selectedTime, employeeId },
				}).unwrap();

				toast.success('Employee checkout successfully');
				setStatus(-1);
			}

			refetch();
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee update');
		}
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='sm' isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Attendance Timing</ModalHeader>
				<ModalBody>
					<VStack justifyContent='center' alignItems='center'>
						<Text mb={2} fontWeight='400' fontSize='lg'>
							Select Time
						</Text>
						<CustomTimePicker value={selectedTime} onChange={setSelectedTime} />
					</VStack>
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
						disabled={isCreating || isUpdating}
					>
						{isUpdating || isCreating
							? 'Updating...'
							: type === 'checkin'
								? 'Check In'
								: type === 'checkout'
									? 'Check Out'
									: 'Update'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AttendanceTimePicker;
