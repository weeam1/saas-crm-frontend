import React, { useEffect, useState } from 'react';
import {
	Box,
	Text,
	Flex,
	useDisclosure,
	HStack,
	VStack,
	Button,
	IconButton,
} from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import TimeInput from './TimeInput';

const CustomTimePicker = ({ value, onChange }) => {
	const parseTime = (timeStr) => {
		if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
		const [time, period] = timeStr.split(' ');
		const [hour, minute] = time.split(':').map(Number);
		return { hour, minute, period };
	};

	useEffect(() => {
		const initialTime = parseTime(value);
		setHour(initialTime.hour);
		setMinute(initialTime.minute);
		setPeriod(initialTime.period);
	}, [value]);

	const initialTime = parseTime(value || '12:00 PM');
	const [hour, setHour] = useState(initialTime.hour);
	const [minute, setMinute] = useState(initialTime.minute);
	const [period, setPeriod] = useState(initialTime.period);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isSelectingHours, setIsSelectingHours] = useState(true);

	const clockHours = Array.from({ length: 12 }, (_, i) => i + 1);
	const clockMinutes = Array.from({ length: 60 }, (_, i) => i);

	const handleHourSelect = (selectedHour) => {
		setHour(selectedHour);
		setIsSelectingHours(false);
		updateTime(selectedHour, minute, period);
	};

	const handleMinuteSelect = (selectedMinute) => {
		setMinute(selectedMinute);
		updateTime(hour, selectedMinute, period);
	};

	const handlePeriodToggle = (newPeriod) => {
		setPeriod(newPeriod);
		updateTime(hour, minute, newPeriod);
	};

	const handleHourInputChange = (e) => {
		const inputValue = e.target.value.replace(/[^0-9]/g, '');
		if (inputValue === '') {
			setHour('');
		} else {
			const numValue = parseInt(inputValue, 10);
			if (numValue >= 1 && numValue <= 12) {
				setHour(numValue);
				updateTime(numValue, minute || 0, period);
			}
		}
	};

	const handleMinuteInputChange = (e) => {
		const inputValue = e.target.value.replace(/[^0-9]/g, '');
		if (inputValue === '') {
			setMinute('');
		} else {
			const numValue = parseInt(inputValue, 10);
			if (numValue >= 0 && numValue <= 59) {
				setMinute(numValue);
				updateTime(hour || 12, numValue, period);
			}
		}
	};

	const updateTime = (h, m, p) => {
		const validHour = h === '' ? 12 : h;
		const validMinute = m === '' ? 0 : m;
		const timeString = `${validHour.toString().padStart(2, '0')}:${validMinute.toString().padStart(2, '0')} ${p}`;
		onChange(timeString);
	};

	const handleHourConfirm = () => {
		updateTime(hour, minute, period);
		onClose();
	};

	const handleHourCancel = () => {
		setIsSelectingHours(true);
		onClose();
	};

	const handleMinuteConfirm = () => {
		updateTime(hour, minute, period);
		onClose();
	};

	const handleMinuteCancel = () => {
		setIsSelectingHours(false);
		onClose();
	};

	const handleClose = () => {
		setIsSelectingHours(true);
		onClose();
	};

	return (
		<Box
			fontFamily='DM Sans'
			bg='softGray.100'
			p={2}
			borderRadius='8px'
			position='relative'
			w='fit-content'
			boxShadow='sm'
		>
			<Flex alignItems='center' mb={1} justify='center' gap={1}>
				<HStack spacing={1} alignItems='center'>
					<TimeInput
						value={hour}
						onChange={handleHourInputChange}
						placeholder='HH'
						bgColor='brand.200'
						isHour={true}
						clockItems={clockHours}
						selectedValue={hour}
						onSelect={handleHourSelect}
						onConfirm={handleHourConfirm}
						onCancel={handleHourCancel}
						isOpen={isOpen && isSelectingHours}
						onOpen={() => {
							setIsSelectingHours(true);
							onOpen();
						}}
						onClose={handleClose}
					/>
					<Text fontSize='xl' fontWeight='bold' color='#333333'>
						:
					</Text>
					<TimeInput
						value={minute}
						onChange={handleMinuteInputChange}
						placeholder='MM'
						bgColor='brand.200'
						isHour={false}
						clockItems={clockMinutes}
						selectedValue={minute}
						onSelect={handleMinuteSelect}
						onConfirm={handleMinuteConfirm}
						onCancel={handleMinuteCancel}
						isOpen={isOpen && !isSelectingHours}
						onOpen={() => {
							setIsSelectingHours(false);
							onOpen();
						}}
						onClose={handleClose}
					/>
					<VStack
						spacing={0}
						ml={1}
						borderRadius='6px'
						overflow='hidden'
						border='1px solid brand.300'
						w='30px'
					>
						<Button
							borderRadius='0'
							w='100%'
							size='xs'
							bg={period === 'AM' ? 'brand.400' : 'brand.200'}
							color='white'
							onClick={() => handlePeriodToggle('AM')}
							_hover={{ bg: 'brand.400' }}
							_active={{ bg: 'brand.400' }}
							borderTopRadius='6px'
							fontSize='xs'
							py={1}
						>
							AM
						</Button>
						<Button
							borderRadius='0'
							w='100%'
							size='xs'
							bg={period === 'PM' ? 'brand.400' : 'brand.200'}
							color='white'
							onClick={() => handlePeriodToggle('PM')}
							_hover={{ bg: 'brand.400' }}
							_active={{ bg: 'brand.400' }}
							borderBottomRadius='6px'
							fontSize='xs'
							py={1}
						>
							PM
						</Button>
					</VStack>
				</HStack>
			</Flex>

			<Flex
				color='#6B7280'
				justify='space-around'
				px='2'
				width='fit-content'
				gap={4}
				mb={1}
			>
				<Text fontSize='xs'>Hour</Text>
				<Text fontSize='xs'>Minute</Text>
			</Flex>

			{/* <IconButton
				aria-label='Select time with clock'
				icon={<FaClock />}
				size='9px'
				position='absolute'
				bottom='4px'
				left='4px'
				color='black'
				borderRadius='6px'
				onClick={onOpen}
				_hover={{ bg: 'gray.100' }}
			/> */}
		</Box>
	);
};

export default CustomTimePicker;
