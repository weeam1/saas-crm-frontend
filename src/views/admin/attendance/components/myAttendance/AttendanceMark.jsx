import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { IoMdExit } from 'react-icons/io';
import moment from 'moment-timezone';
import { buttonStyle } from '../../constants';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';
import { FaBan } from 'react-icons/fa';
import LeaveNoteModal from './LeaveNoteModal';
import NoteModal from './NoteModal';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const AttendanceMark = ({
	timezone,
	data,
	refetch,
	officeSettings,
	employeeId,
}) => {
	const [status, setStatus] = useState(null);

	const [time, setTime] = useState(moment().tz(timezone));

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

	const [selectedTime, setSelectedTime] = useState(time.format('hh:mm A'));

	const [lastRecord, setLastRecord] = useState(null);

	const [checkinLoading, setCheckinLoading] = useState(false);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [absentLoading, setAbsentLoading] = useState(false);
	const [leaveLoading, setLeaveLoading] = useState(false);

	const today = moment().tz(timezone).format('YYYY-MM-DD');

	const todayIndex = moment().tz(timezone).day();
	const offDays = officeSettings?.offDays || [];

	const isOffDay = offDays.includes(todayIndex);

	const currentDate = moment().tz(timezone);
	const currentMonth = currentDate.format('MM');
	const currentYear = currentDate.format('YYYY');

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	useEffect(() => {
		if (data?.total > 0) {
			const todayRecord = data?.doc?.find((item) => item.date == today);

			if (todayRecord) {
				setLastRecord(todayRecord);

				if (todayRecord?.status === 0 || todayRecord?.status === 3) {
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

	const handleCheckIn = async ({ note = '' }) => {
		try {
			// if (timePicker) {
			const bodyData = { employeeId, selectedTime, checkinNote: note };
			// } else bodyData = { employeeId: data.employee._id };

			setCheckinLoading(true);
			await createItemMutation({
				path: '/attendance/checkin',
				body: bodyData,
			}).unwrap();

			toast.success('Employee Check in successfully');
			setStatus(1);
			refetch({ force: true });

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				status: 'success',
				message: `${user?.fullName} added employee check in.`,
			});
		} catch (e) {
			console.log(e);
			const errorMsg = e?.data?.message || 'Error in employee check in';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setCheckinLoading(false);
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
			const res = await updateItemMutation({
				path: '/attendance/checkout',
				body: bodyData,
			}).unwrap();

			toast.success('Employee checkout successfully');
			setStatus(-1);
			refetch({ force: true });

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Attendance',
				entityId: res?.doc?._id,
				status: 'success',
				message: `${user?.fullName} added employee check out.`,
			});
		} catch (e) {
			console.log(e);

			const errorMsg = e?.data?.message || 'Error in employee checkout';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Attendance',
				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setCheckoutLoading(false);
		}
	};

	const handleAbsence = async ({ note = '' }) => {
		try {
			setAbsentLoading(true);
			await createItemMutation({
				path: '/attendance/absent',
				body: { employeeId, absentNote: note },
			}).unwrap();

			toast.success('Employee Absent successfully');
			setStatus(-1);
			refetch({ force: true });

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				status: 'success',
				message: `${user?.fullName} added employee absent.`,
			});
		} catch (e) {
			console.log(e);

			const errorMsg = e?.data?.message || 'Error in employee absent';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setAbsentLoading(false);
		}
	};

	const handleLeave = async (values) => {
		try {
			const bodyData = { ...values, employeeId };

			setLeaveLoading(true);
			await createItemMutation({
				path: '/attendance/leave',
				body: bodyData,
			}).unwrap();

			toast.success('Employee leave successfully');
			noteOnClose();
			setStatus(-1);
			refetch({ force: true });

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				status: 'success',
				message: `${user?.fullName} added employee leave.`,
			});
		} catch (e) {
			console.log(e);

			const errorMsg = e?.data?.message || 'Error in employee leave';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setLeaveLoading(false);
		}
	};

	const buttonVariants = {
		checkIn: {
			bgGradient: 'linear(to-r, green.400, green.300)',
			_hover: {
				bgGradient: 'linear(to-r, green.500, green.400)',
				transform: 'scale(1.03)',
				boxShadow: 'md',
			},
			_active: {
				bg: 'green.500',
				transform: 'scale(0.98)',
			},
			onClick: checkinNoteOnOpen,
			text: 'In',
			border: '2px',
			borderImage: 'linear-gradient(to right, #38A169, #68D391) 1',
			position: 'relative',
			overflow: 'hidden',
			_before: {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background:
					'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 55%)',
				backgroundSize: '300% 300%',
				transition: 'all 0.5s ease',
				opacity: 0,
			},
			_hoverBefore: {
				backgroundPosition: '100% 100%',
				opacity: 1,
			},
		},
		checkOut: {
			bgGradient: 'linear(to-r, #D8A541, #F6AD55)',
			_hover: {
				bgGradient: 'linear(to-r, #DD6B20, #ED8936)',
				transform: 'scale(1.03)',
				boxShadow: 'md',
			},
			_active: {
				bg: 'brand.400',
				transform: 'scale(0.98)',
			},
			onClick: handleCheckOut,
			text: 'Out',
			border: '2px',
			borderImage: 'linear-gradient(to right, #D69E2E, #ED8936) 1',
			position: 'relative',
			overflow: 'hidden',
			_before: {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background:
					'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 55%)',
				backgroundSize: '300% 300%',
				transition: 'all 0.5s ease',
				opacity: 0,
			},
			_hoverBefore: {
				backgroundPosition: '100% 100%',
				opacity: 1,
			},
		},
		absent: {
			bgGradient: 'linear(to-r, red.400, red.300)',
			_hover: {
				bgGradient: 'linear(to-r, red.500, red.400)',
				transform: 'scale(1.03)',
				boxShadow: 'md',
			},
			_active: {
				bg: 'red.400',
				transform: 'scale(0.98)',
			},
			onClick: absentNoteOnOpen,
			text: 'Absent',
			border: '2px',
			borderImage: 'linear-gradient(to right, #E53E3E, #FC8181) 1',
			position: 'relative',
			overflow: 'hidden',
			_before: {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background:
					'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 55%)',
				backgroundSize: '300% 300%',
				transition: 'all 0.5s ease',
				opacity: 0,
			},
			_hoverBefore: {
				backgroundPosition: '100% 100%',
				opacity: 1,
			},
		},
		leave: {
			bgGradient: 'linear(to-r, teal.400, teal.300)',
			_hover: {
				bgGradient: 'linear(to-r, teal.500, teal.400)',
				transform: 'scale(1.03)',
				boxShadow: 'md',
			},
			_active: {
				bg: 'teal.500',
				transform: 'scale(0.98)',
			},
			onClick: noteOnOpen,
			text: 'On Leave',
			border: '2px',
			borderImage: 'linear-gradient(to right, #319795, #4FD1C5) 1',
			position: 'relative',
			overflow: 'hidden',
			_before: {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background:
					'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 55%)',
				backgroundSize: '300% 300%',
				transition: 'all 0.5s ease',
				opacity: 0,
			},
			_hoverBefore: {
				backgroundPosition: '100% 100%',
				opacity: 1,
			},
		},
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
							className='glass-card'
							sx={{
								'&::before': buttonVariants.checkOut._before,
								'&:hover::before': buttonVariants.checkOut._hoverBefore,
							}}
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
									size='sm'
									isDisabled={leaveLoading || absentLoading || checkinLoading}
									leftIcon={<IoMdExit size={12} />}
									sx={{
										'&::before': buttonVariants.checkIn._before,
										'&:hover::before': buttonVariants.checkIn._hoverBefore,
									}}
								>
									{checkinLoading ? 'Loading...' : buttonVariants.checkIn.text}
								</Button>

								<Button
									{...buttonStyle}
									{...buttonVariants.absent}
									w={{ base: '100%', md: '208px' }}
									h='43px'
									isDisabled={leaveLoading || absentLoading || checkinLoading}
									sx={{
										'&::before': buttonVariants.absent._before,
										'&:hover::before': buttonVariants.absent._hoverBefore,
									}}
								>
									{absentLoading ? 'Loading...' : buttonVariants.absent.text}
								</Button>
								<Button
									{...buttonStyle}
									{...buttonVariants.leave}
									w={{ base: '100%', md: '208px' }}
									h='43px'
									isDisabled={leaveLoading || absentLoading || checkinLoading}
									sx={{
										'&::before': buttonVariants.leave._before,
										'&:hover::before': buttonVariants.leave._hoverBefore,
									}}
								>
									{leaveLoading ? 'Loading...' : buttonVariants.leave.text}
								</Button>

								{noteIsOpen && (
									<LeaveNoteModal
										isOpen={noteIsOpen}
										onClose={noteOnClose}
										onSubmit={handleLeave}
										isLoading={leaveLoading}
									/>
								)}

								{checkinNoteIsOpen && (
									<NoteModal
										title='Check In Note'
										isOpen={checkinNoteIsOpen}
										onClose={checkinNoteOnClose}
										onSubmit={handleCheckIn}
										isLoading={checkinLoading}
									/>
								)}

								{absentNoteIsOpen && (
									<NoteModal
										title='Absent Note'
										isOpen={absentNoteIsOpen}
										onClose={absentNoteOnClose}
										onSubmit={handleAbsence}
										isLoading={absentLoading}
									/>
								)}
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
