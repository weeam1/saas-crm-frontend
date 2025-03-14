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
	VStack,
} from '@chakra-ui/react';
import moment from 'moment-timezone';
import TimePicker from './TimePicker';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { buttonStyle } from '../constants';

const AttendanceUpdate = ({ isOpen, onClose, data, refetch }) => {
	const parseTime = (time) => {
		const momentTime = moment(time, 'hh:mm A');
		return {
			hour: momentTime.format('hh'),
			minute: momentTime.format('mm'),
			period: momentTime.format('A'),
		};
	};

	const [checkInTime, setCheckInTime] = useState(
		data.checkin
			? parseTime(data.checkin)
			: { hour: '09', minute: '00', period: 'AM' }
	);

	const [checkOutTime, setCheckOutTime] = useState(
		data.checkout
			? parseTime(data.checkout)
			: { hour: '06', minute: '00', period: 'PM' }
	);

	console.log({ checkInTime, checkOutTime });

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleSave = async () => {
		const checkin = `${checkInTime.hour}:${checkInTime.minute} ${checkInTime.period}`;
		const checkout = `${checkOutTime.hour}:${checkOutTime.minute} ${checkOutTime.period}`;

		try {
			if (data?._id) {
				await updateItemMutation({
					path: `/attendance/${data?._id}`,
					body: { checkin, checkout },
				}).unwrap();

				toast.success('Attendance record update successfully');
				refetch();
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
					<VStack spacing={4} p='4' alignItems='flex-start'>
						<Text fontSize='lg' fontWeight='semibold'>
							Check in
						</Text>
						<TimePicker value={checkInTime} onChange={setCheckInTime} />

						<Text fontSize='lg' fontWeight='semibold'>
							Check out
						</Text>
						<TimePicker value={checkOutTime} onChange={setCheckOutTime} />
					</VStack>
				</ModalBody>
				<ModalFooter>
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
