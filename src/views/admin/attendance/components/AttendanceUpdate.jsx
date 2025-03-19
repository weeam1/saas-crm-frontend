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
	Box,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { buttonStyle } from '../constants';
import CustomTimePicker from 'components/customDatePicker/CustomDatePicker';

const AttendanceUpdate = ({ isOpen, onClose, data, refetch }) => {
	const [checkInTime, setCheckInTime] = useState(data.checkin ?? '09:00 AM');

	const [checkOutTime, setCheckOutTime] = useState(data.checkout ?? '06:00 PM');

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleSave = async () => {
		try {
			if (data?._id) {
				await updateItemMutation({
					path: `/attendance/${data?._id}`,
					body: { checkin: checkInTime, checkout: checkOutTime },
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
					<VStack justify='space-between' gap={4}>
						<Box flex='1'>
							<Text mb={2} fontWeight='400' fontSize='lg'>
								Check In
							</Text>
							<CustomTimePicker value={checkInTime} onChange={setCheckInTime} />
						</Box>

						<Box flex='1'>
							<Text mb={2} fontWeight='400' fontSize='lg'>
								Check Out
							</Text>
							<CustomTimePicker
								value={checkOutTime}
								onChange={setCheckOutTime}
							/>
						</Box>
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
					>
						{isUpdating ? 'Updating...' : 'Update'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AttendanceUpdate;
