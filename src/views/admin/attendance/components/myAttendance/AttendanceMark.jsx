import React, { useState, useEffect } from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { IoMdExit } from 'react-icons/io';
import moment from 'moment-timezone';
import { buttonStyle } from '../../constants';

const AttendanceMark = ({ timezone }) => {
	const [status, setStatus] = useState(null);
	const [currentTime, setCurrentTime] = useState('');
	const toast = useToast();

	useEffect(() => {
		const updateTime = () => {
			const now = moment().tz(timezone);
			setCurrentTime(now.format('hh:mm:ss A'));
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	const handleCheckIn = () => {
		setStatus('checkedIn');
	};

	const handleAbsence = () => {
		setStatus('absent');
		toast({
			title: 'Attendance',
			description: 'Today employee is absent.',
			status: 'info',
			duration: 5000,
			isClosable: true,
		});
	};

	const handleCheckOut = () => {
		setStatus(null);
		toast({
			title: 'Attendance',
			description: 'Checked out successfully.',
			status: 'success',
			duration: 5000,
			isClosable: true,
		});
	};

	const buttonVariants = {
		checkIn: { bg: '#D8A541', onClick: handleCheckIn, text: 'Check In' },
		checkOut: { bg: '#D8A541', onClick: handleCheckOut, text: 'Check Out' },
		absent: { bg: 'red.500', onClick: handleAbsence, text: 'Absent' },
	};

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
			{status === 'checkedIn' ? (
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
					{['checkIn', 'absent'].map((type) => (
						<Button
							key={type}
							{...buttonStyle}
							{...buttonVariants[type]}
							w={{ base: '100%', md: '208px' }}
							h='43px'
							mb='4'
							leftIcon={type === 'checkIn' ? <IoMdExit size={20} /> : undefined}
						>
							{buttonVariants[type].text}
						</Button>
					))}
				</>
			)}
		</Box>
	);
};

export default AttendanceMark;
