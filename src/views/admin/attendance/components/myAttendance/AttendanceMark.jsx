import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { IoMdExit } from 'react-icons/io';
import moment from 'moment-timezone';
import { buttonStyle } from '../../constants';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';

const AttendanceMark = ({ timezone, data, refetch, officeSettings }) => {
	const [status, setStatus] = useState(null);
	const [time, setTime] = useState(moment().tz(timezone));

	const [checkinLoading, setCheckinLoading] = useState(false);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [absentLoading, setAbsentLoading] = useState(false);

	const tick = useCallback(() => {
		setTime(moment().tz(timezone));
	}, [timezone]);

	useEffect(() => {
		if (status !== -1) {
			const timerID = setInterval(tick, 1000);
			return () => clearInterval(timerID);
		}
	}, [tick, status]);

	const timeString = useMemo(() => time.format('hh:mm:ss  A'), [time]);
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

			if (todayRecord?.status === 0) {
				setStatus(-1);
			} else if (todayRecord?.checkin && todayRecord?.checkout) {
				setStatus(-1);
			} else if (todayRecord?.checkin) {
				setStatus(1);
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
			setCheckinLoading(true);
			await createItemMutation({
				path: '/attendance/checkin',
				body: { employeeId: data.employee._id },
			}).unwrap();

			toast.success('Employee Check in successfully');
			setStatus(1);
			refetch();
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
				body: { employeeId: data.employee._id },
			}).unwrap();

			toast.success('Employee Absent successfully');
			setStatus(-1);
			refetch();
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee absent');
		} finally {
			setAbsentLoading(false);
		}
	};

	const handleCheckOut = async () => {
		try {
			setCheckoutLoading(true);
			await updateItemMutation({
				path: '/attendance/checkout',
				body: { employeeId: data.employee._id },
			}).unwrap();

			toast.success('Employee checkout successfully');
			setStatus(-1);
			refetch();
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee checkout');
		} finally {
			setCheckoutLoading(false);
		}
	};

	const buttonVariants = {
		checkIn: { bg: '#D8A541', onClick: handleCheckIn, text: 'Check In' },
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
			h='263px'
			mt={4}
			p={4}
			bg='white'
			borderRadius='md'
			shadow='sm'
			textAlign='center'
		>
			{isOffDay ? (
				<Text fontSize='lg' fontWeight='bold' color='red.500'>
					🚫 Office Closed Today!
				</Text>
			) : (
				<>
					<Text fontWeight='medium' fontSize={{ base: '20px', md: '24px' }}>
						Mark Attendance
					</Text>
					<Text
						fontWeight='medium'
						textColor='#A07723'
						fontSize={{ base: '20px', md: '24px' }}
					>
						{timeString}
					</Text>
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
