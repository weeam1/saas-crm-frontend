import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { IoMdExit } from 'react-icons/io';
import moment from 'moment-timezone';
import { buttonStyle } from '../../constants';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';
import { FaBan } from 'react-icons/fa';

const AttendanceMark = ({
	timezone,
	data,
	refetch,
	officeSettings,
	employeeId,
}) => {
	const [status, setStatus] = useState(null);
	const [time, setTime] = useState(moment().tz(timezone));

	const [selectedTime, setSelectedTime] = useState(time.format('hh:mm A'));

	const [lastRecord, setLastRecord] = useState(null);

	const [checkinLoading, setCheckinLoading] = useState(false);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [absentLoading, setAbsentLoading] = useState(false);

	const today = moment().tz(timezone).format('YYYY-MM-DD');

	const todayIndex = moment().tz(timezone).day();
	const offDays = officeSettings?.offDays || [];

	const isOffDay = offDays.includes(todayIndex);

	const currentDate = moment().tz(timezone);
	const currentMonth = currentDate.format('MM');
	const currentYear = currentDate.format('YYYY');

	useEffect(() => {
		if (data?.total > 0) {
			const todayRecord = data?.doc?.find((item) => item.date === today);

			if (todayRecord) {
				setLastRecord(todayRecord);

				if (todayRecord?.status === 0) {
					setStatus(-1);
				} else if (todayRecord?.checkin && todayRecord?.checkout) {
					setStatus(-1);
				} else if (todayRecord?.checkin) {
					setStatus(1);
				}
			}
		} else setStatus(null);
	}, [data]);

	// for check in and absent
	const [createItemMutation, { isLoading: isCreating }] =
		useCreateItemMutation();

	// for check out
	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleCheckIn = async () => {
		try {
			// if (timePicker) {
			const bodyData = { employeeId, selectedTime };
			// } else bodyData = { employeeId: data.employee._id };

			setCheckinLoading(true);
			await createItemMutation({
				path: '/attendance/checkin',
				body: bodyData,
			}).unwrap();

			toast.success('Employee Check in successfully');
			setStatus(1);
			refetch({ force: true });
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee check in');
		} finally {
			setCheckinLoading(false);
		}
	};

	const handleAbsence = async () => {
		try {
			setAbsentLoading(true);
			await createItemMutation({
				path: '/attendance/absent',
				body: { employeeId },
			}).unwrap();

			toast.success('Employee Absent successfully');
			setStatus(-1);
			refetch({ force: true });
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee absent');
		} finally {
			setAbsentLoading(false);
		}
	};

	const handleCheckOut = async () => {
		try {
			if (lastRecord) {
				const checkIn = moment(lastRecord?.checkin, 'hh:mm A');
				const checkOut = moment(selectedTime, 'hh:mm A');

				if (checkOut.isBefore(checkIn)) {
					toast.error('Check-Out time must be greater than Check-In time!');
					return;
				}
			}

			const bodyData = { employeeId, selectedTime };

			setCheckoutLoading(true);
			await updateItemMutation({
				path: '/attendance/checkout',
				body: bodyData,
			}).unwrap();

			toast.success('Employee checkout successfully');
			setStatus(-1);
			refetch({ force: true });
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee checkout');
		} finally {
			setCheckoutLoading(false);
		}
	};

	const buttonVariants = {
		checkIn: { bg: 'green.500', onClick: handleCheckIn, text: 'Check In' },
		checkOut: { bg: '#D8A541', onClick: handleCheckOut, text: 'Check Out' },
		absent: { bg: 'red.500', onClick: handleAbsence, text: 'Absent' },
	};

	const shouldRender = useMemo(() => {
		return (
			status !== -1 &&
			Number(data.month) === Number(currentMonth) &&
			Number(data.year) === Number(currentYear)
		);
	}, [status, data, currentMonth, currentYear]);

	return shouldRender && data ? (
		<Box
			display='flex'
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			gap='2'
			// h='263px'
			mt={4}
			p={4}
			bg='white'
			borderRadius='md'
			shadow='sm'
			textAlign='center'
		>
			{isOffDay ? (
				<Flex align='center' justify='center' gap={2}>
					<Icon as={FaBan} color='red.500' boxSize={6} />
					<Text fontSize='md' fontWeight='semibold' color='red.500'>
						Office is closed today
					</Text>
				</Flex>
			) : (
				<>
					<Text fontWeight='medium' fontSize={{ base: '20px', md: '24px' }}>
						Mark Attendance
					</Text>

					<NormalTimePicker value={selectedTime} onChange={setSelectedTime} />

					{/* <Text
						fontWeight='medium'
						textColor='#A07723'
						fontSize={{ base: '20px', md: '24px' }}
					>
						{timeString}
					</Text> */}
					{status === 1 || status === 2 ? (
						<Button
							{...buttonStyle}
							{...buttonVariants.checkOut}
							w={{ base: '100%', md: '208px' }}
							h='43px'
							isDisabled={checkoutLoading}
							leftIcon={<IoMdExit size={20} />}
						>
							{checkoutLoading ? 'Loading...' : buttonVariants.checkOut.text}
						</Button>
					) : (
						![-1, 1, 2].includes(status) && (
							<>
								<Button
									{...buttonStyle}
									{...buttonVariants.checkIn}
									w={{ base: '100%', md: '208px' }}
									h='43px'
									mb='4'
									isDisabled={absentLoading || checkinLoading}
									leftIcon={<IoMdExit size={20} />}
								>
									{checkinLoading ? 'Loading...' : buttonVariants.checkIn.text}
								</Button>
								<Button
									{...buttonStyle}
									{...buttonVariants.absent}
									w={{ base: '100%', md: '208px' }}
									h='43px'
									mb='4'
									isDisabled={absentLoading || checkinLoading}
								>
									{absentLoading ? 'Loading...' : buttonVariants.absent.text}
								</Button>
							</>
						)
					)}
				</>
			)}
		</Box>
	) : null;
};

export default AttendanceMark;

// {isTimePickerOpen && (
// 	<AttendanceTimePicker
// 		data={lastRecord}
// 		type={lastRecord ? 'checkout' : 'checkin'}
// 		onClose={onTimePickerClose}
// 		isOpen={isTimePickerOpen}
// 		refetch={refetch}
// 		employeeId={employeeId}
// 		setStatus={setStatus}
// 	/>
// )}
