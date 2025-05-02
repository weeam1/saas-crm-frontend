import { Box, Text, Flex, useBreakpointValue, Button } from '@chakra-ui/react';
import { ReactComponent as ClockIcon } from '../../../../assets/icons/Clock.svg';
import { buttonStyle } from 'views/admin/attendance/constants';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';

const AdminSetting = ({
	agencyId,
	checkinTime,
	setCheckinTime,
	checkoutTime,
	setCheckoutTime,
	selectedUser,
	setSpecialUsers,
	setSelectedUser,
}) => {
	const fontSize = useBreakpointValue({ base: '14px', md: '17px' });

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleSave = async () => {
		if (!selectedUser) return;

		const checkIn = moment(checkinTime, 'hh:mm A');
		const checkOut = moment(checkoutTime, 'hh:mm A');

		if (checkOut.isBefore(checkIn)) {
			toast.error('Check-Out time must be greater than Check-In time!');
			return;
		}

		let updatedSpecialUsers;
		setSpecialUsers((prev) => {
			const exists = prev.some((su) => su.user === selectedUser._id);
			updatedSpecialUsers = exists
				? prev.map((su) =>
						su.user === selectedUser._id
							? { ...su, specialTiming: { checkinTime, checkoutTime } }
							: su
					)
				: [
						...prev,
						{
							user: selectedUser._id,
							specialTiming: { checkinTime, checkoutTime },
						},
					];
			return updatedSpecialUsers;
		});

		try {
			await updateItemMutation({
				path: `/attendance/office-settings/${agencyId}`,
				body: { specialUsers: updatedSpecialUsers },
			}).unwrap();

			toast.success('Special Users updated successfully');
			setSelectedUser(null);
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.message || 'Special Users not updated!');
		}
	};

	return (
		<Box borderRadius='lg' p={5}>
			<Flex justify='space-between' align='center' mb={4}>
				<Text
					as='h2'
					display='flex'
					alignItems='center'
					gap={2}
					fontWeight='400'
					fontSize={fontSize}
				>
					<ClockIcon color='blue.400' />{' '}
					{`${selectedUser?.fullName ?? 'Special'}`} Timing
				</Text>
			</Flex>
			<Flex
				flexDirection='column'
				justifyContent='space-between'
				// alignItems={{ base: 'flex-start', md: 'flex-end' }}
				opacity={!selectedUser ? 0.5 : 1}
				pointerEvents={!selectedUser ? 'none' : 'auto'}
			>
				<Flex justify='space-between' mb={4} flexDirection='column' gap={4}>
					<Box flex='1' maxW='200px' bg='softGray.50' rounded='md' p='2'>
						<Text mb={2} fontWeight='400' fontSize={fontSize}>
							In timing
						</Text>
						{/* <CustomTimePicker
							value={checkinTime}
							onChange={setCheckinTime}
							isDisabled={!selectedUser}
						/> */}

						<NormalTimePicker value={checkinTime} onChange={setCheckinTime} />
					</Box>

					<Box flex='1' maxW='200px' bg='softGray.50' rounded='md' p='2'>
						<Text mb={2} fontWeight='400' fontSize={fontSize}>
							Out timing
						</Text>
						<NormalTimePicker value={checkoutTime} onChange={setCheckoutTime} />
					</Box>
				</Flex>

				<Button
					{...buttonStyle}
					variant='solid'
					bg='brand.400'
					py='5'
					px='8'
					fontSize='lg'
					aria-label='update'
					isDisabled={!selectedUser}
					onClick={handleSave}
					width='fit-content'
				>
					{isUpdating ? 'Updating...' : 'Update'}
				</Button>
			</Flex>
		</Box>
	);
};

export default AdminSetting;
