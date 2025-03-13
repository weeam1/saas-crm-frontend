import React, { useState, useEffect } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { IoMdExit } from 'react-icons/io';
import moment from 'moment-timezone';
import { buttonStyle } from '../../constants';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';

const AttendanceMark = ({ timezone, data, refetch }) => {
	const [status, setStatus] = useState(-1);
	const [currentTime, setCurrentTime] = useState('');

	const today = moment().tz(timezone).format('YYYY-MM-DD');

	useEffect(() => {
		if (data?.total > 0) {
			const todayRecord = data?.doc?.find((item) => item.date === today);

			setStatus(todayRecord.status ?? null);
		}
	}, [data, today]);

	// for check in and absent
	const [createItemMutation, { isLoading: isCreating }] =
		useCreateItemMutation();

	// for check out
	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	useEffect(() => {
		const updateTime = () => {
			const now = moment().tz(timezone);
			setCurrentTime(now.format('hh:mm:ss A'));
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	const handleCheckIn = async () => {
		setStatus(1);

		try {
			await createItemMutation({
				path: '/attendance/checkin',
				body: { employeeId: data.employee._id },
			}).unwrap();

			toast.success('Employee Check in successfully');
			refetch();
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee check in');
		}
	};

	const handleAbsence = async () => {
		setStatus(0);

		try {
			await createItemMutation({
				path: '/attendance/absent',
				body: { employeeId: data.employee._id },
			}).unwrap();

			toast.success('Employee Absent successfully');
			refetch();
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee absent');
		}
	};

	const handleCheckOut = async () => {
		setStatus(null);

		try {
			await updateItemMutation({
				path: '/attendance/checkout',
				body: { employeeId: data.employee._id },
			}).unwrap();

			toast.success('Employee checkout successfully');
			refetch();
		} catch (e) {
			console.log(e);
			toast.error(e?.data?.message || 'Error in employee checkout');
		}
	};

	const buttonVariants = {
		checkIn: { bg: '#D8A541', onClick: handleCheckIn, text: 'Check In' },
		checkOut: { bg: '#D8A541', onClick: handleCheckOut, text: 'Check Out' },
		absent: { bg: 'red.500', onClick: handleAbsence, text: 'Absent' },
	};

	if (status === null) {
		return null;
	}

	return (
		<Box
			display='flex'
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			h='263px'
			mt={4}
			p={4}
			bg='white'
			borderRadius='md'
			shadow='sm'
			textAlign='center'
		>
			<Text fontWeight='medium' fontSize={{ base: '20px', md: '24px' }}>
				Mark Attendance
			</Text>
			<Text
				fontWeight='medium'
				textColor='#A07723'
				fontSize={{ base: '20px', md: '24px' }}
			>
				{currentTime}
			</Text>
			{status === 1 ? (
				<Button
					{...buttonStyle}
					{...buttonVariants.checkOut}
					w={{ base: '100%', md: '208px' }}
					h='43px'
					leftIcon={<IoMdExit size={20} />}
				>
					{buttonVariants.checkOut.text}
				</Button>
			) : (
				<>
					<Button
						{...buttonStyle}
						{...buttonVariants.checkIn}
						w={{ base: '100%', md: '208px' }}
						h='43px'
						mb='4'
						leftIcon={<IoMdExit size={20} />}
					>
						{buttonVariants.checkIn.text}
					</Button>
					<Button
						{...buttonStyle}
						{...buttonVariants.absent}
						w={{ base: '100%', md: '208px' }}
						h='43px'
						mb='4'
					>
						{buttonVariants.absent.text}
					</Button>
				</>
			)}
		</Box>
	);
};

export default AttendanceMark;
