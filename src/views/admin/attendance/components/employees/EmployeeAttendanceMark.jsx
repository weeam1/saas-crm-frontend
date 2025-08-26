import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { IoMdExit } from 'react-icons/io';
import moment from 'moment-timezone';
import { buttonStyle } from '../../constants';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import { FaBan, FaCalendarCheck } from 'react-icons/fa';
import LeaveNoteModal from '../myAttendance/LeaveNoteModal';
import NoteModal from '../myAttendance/NoteModal';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { usePermissions } from 'hooks/usePermissions';

const EmployeeAttendanceMark = ({ todayRecord, employeeId, officeSetting }) => {
	const { timezone } = officeSetting;

	const { hasPermission } = usePermissions();

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

	const [status, setStatus] = useState(null);
	const [checkinLoading, setCheckinLoading] = useState(false);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [absentLoading, setAbsentLoading] = useState(false);
	const [leaveLoading, setLeaveLoading] = useState(false);

	const todayIndex = moment().tz(timezone).day();
	const offDays = officeSetting?.offDays || [];

	const isOffDay = offDays.includes(todayIndex);

	useEffect(() => {
		if (todayRecord) {
			if (todayRecord?.status === 0 || todayRecord?.status === 3) {
				setStatus(-1);
			} else if (todayRecord?.checkin && todayRecord?.checkout) {
				setStatus(-1);
			} else if (todayRecord?.checkin) {
				setStatus(1);
			}
		} else setStatus(null);
	}, []);

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	// for check in and absent
	const [createItemMutation, { isLoading: isCreating }] =
		useCreateItemMutation();

	// for check out
	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleCheckIn = async ({ note = '' }) => {
		try {
			const bodyData = { employeeId, checkinNote: note };

			setCheckinLoading(true);
			await createItemMutation({
				path: '/attendance/checkin',
				body: bodyData,
			}).unwrap();

			toast.success('Employee Check in successfully');
			setStatus(1);

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entityType: 'Attendance',

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
				entityType: 'Attendance',
				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setCheckinLoading(false);
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
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				entityType: 'Attendance',
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
				entityType: 'Attendance',
				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setAbsentLoading(false);
		}
	};

	const handleCheckOut = async () => {
		try {
			const bodyData = { employeeId };

			setCheckoutLoading(true);
			const res = await updateItemMutation({
				path: '/attendance/checkout',
				body: bodyData,
			}).unwrap();

			toast.success('Employee checkout successfully');
			setStatus(-1);
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Attendance',
				entityType: 'Attendance',

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
				entityType: 'Attendance',

				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setCheckoutLoading(false);
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
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Attendance',
				entityType: 'Attendance',

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
				entityType: 'Attendance',

				status: e?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setLeaveLoading(false);
		}
	};

	const buttonVariants = {
		checkIn: { bg: 'green.400', onClick: checkinNoteOnOpen, text: 'In' },
		checkOut: { bg: '#D8A541', onClick: handleCheckOut, text: 'Out' },
		absent: { bg: 'red.400', onClick: absentNoteOnOpen, text: 'Absent' },
		leave: { bg: 'teal.400', onClick: noteOnOpen, text: 'On Leave' },
	};

	const shouldRender = useMemo(() => {
		return status !== -1;
	}, [status]);

	// Check logged in user has permission to perform this operations
	if (!hasPermission('attendance', 'operations')) return null;

	return shouldRender ? (
		<Box
			display='flex'
			justifyContent='center'
			alignItems='center'
			gap='2'
			textAlign='center'
		>
			{isOffDay ? (
				<Flex align='center' justify='center' gap={2}>
					<Icon as={FaBan} color='red.500' boxSize={4} />
					<Text fontSize='sm' fontWeight='medium' color='red.500'>
						Office is closed
					</Text>
				</Flex>
			) : (
				<>
					{status === 1 || status === 2 ? (
						<Button
							{...buttonStyle}
							{...buttonVariants.checkOut}
							isDisabled={checkoutLoading}
							fontSize='sm'
							py='2'
							px='4'
							leftIcon={<IoMdExit size={10} />}
						>
							{checkoutLoading ? 'Loading...' : buttonVariants.checkOut.text}
						</Button>
					) : (
						![-1, 1, 2].includes(status) && (
							<>
								<Button
									{...buttonStyle}
									{...buttonVariants.checkIn}
									isDisabled={leaveLoading || absentLoading || checkinLoading}
									fontSize='sm'
									py='2'
									px='4'
									leftIcon={<IoMdExit size={10} />}
								>
									{checkinLoading ? 'Loading...' : buttonVariants.checkIn.text}
								</Button>
								<Button
									{...buttonStyle}
									fontSize='sm'
									py='2'
									px='4'
									{...buttonVariants.absent}
									isDisabled={leaveLoading || absentLoading || checkinLoading}
								>
									{absentLoading ? 'Loading...' : buttonVariants.absent.text}
								</Button>
								<Button
									{...buttonStyle}
									fontSize='sm'
									py='2'
									px='4'
									{...buttonVariants.leave}
									isDisabled={leaveLoading || absentLoading || checkinLoading}
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
	) : (
		<Flex
			align='center'
			p='2'
			bg='gray.100'
			rounded='md'
			justify='center'
			gap={2}
		>
			<Icon as={FaCalendarCheck} color='green.500' boxSize={4} />
			<Text fontSize='sm' color='gray.600'>
				Attendance marked
			</Text>
		</Flex>
	);

	// return (
	// 	<Box
	// 		display={'flex'} // Hide completely when not needed
	// 		flexDirection='column'
	// 		justifyContent='center'
	// 		alignItems='center'
	// 		gap={3}
	// 		p={4}
	// 		textAlign='center'
	// 		borderWidth={shouldRender ? 0 : 1}
	// 		borderRadius='md'
	// 		borderColor='gray.100'
	// 		bg={shouldRender ? 'transparent' : 'gray.50'}
	// 		minH={shouldRender ? 'auto' : '120px'}
	// 	>
	// 		{!shouldRender ? (
	// 			<Flex
	// 				direction='column'
	// 				align='center'
	// 				justify='center'
	// 				h='full'
	// 				gap={2}
	// 			>
	// 				<Icon as={FaCalendarCheck} color='green.500' boxSize={6} />
	// 				<Text fontSize='sm' color='gray.600'>
	// 					Attendance already marked
	// 				</Text>
	// 			</Flex>
	// 		) : isOffDay ? (
	// 			<Flex direction='column' align='center' gap={2}>
	// 				<Icon as={FaBan} color='red.500' boxSize={6} />
	// 				<Text fontSize='md' fontWeight='semibold' color='red.500'>
	// 					Office Closed Today
	// 				</Text>
	// 			</Flex>
	// 		) : (
	// 			<>
	// 				{[1, 2].includes(status) ? (
	// 					<Button
	// 						{...buttonStyle}
	// 						{...buttonVariants.checkOut}
	// 						size='md' // Smaller button
	// 						width={{ base: '100%', md: '180px' }} // Reduced width
	// 						isLoading={checkoutLoading}
	// 						loadingText='Processing'
	// 						leftIcon={<IoMdExit size={18} />}
	// 					/>
	// 				) : (
	// 					![-1, 1, 2].includes(status) && (
	// 						<Flex direction='column' gap={3} width='full' align='center'>
	// 							<Button
	// 								{...buttonStyle}
	// 								{...buttonVariants.checkIn}
	// 								size='md'
	// 								width={{ base: '100%', md: '180px' }}
	// 								isLoading={checkinLoading}
	// 								loadingText='Processing'
	// 								leftIcon={<FaSignInAlt size={16} />} // Better icon
	// 							/>
	// 							<Button
	// 								{...buttonStyle}
	// 								{...buttonVariants.absent}
	// 								size='md'
	// 								width={{ base: '100%', md: '180px' }}
	// 								isLoading={absentLoading}
	// 								loadingText='Processing'
	// 								leftIcon={<FaUserTimes size={16} />} // Better icon
	// 								variant='outline' // Differentiate from primary button
	// 							/>
	// 						</Flex>
	// 					)
	// 				)}
	// 			</>
	// 		)}
	// 	</Box>
	// );
};

export default EmployeeAttendanceMark;
