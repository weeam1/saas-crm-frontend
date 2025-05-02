import React, { useEffect, useState } from 'react';
import {
	Box,
	Text,
	Flex,
	useDisclosure,
	HStack,
	VStack,
	Button,
	Input,
} from '@chakra-ui/react';
import TimeInput from './TimeInput';

// const NormalTimePicker = ({ value, onChange }) => {
// 	const parseTime = (timeStr) => {
// 		if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
// 		const [time, period] = timeStr.split(' ');
// 		const [hour, minute] = time.split(':').map(Number);
// 		return { hour, minute, period };
// 	};

// 	// Parse initial time from value prop
// 	const initialTime = parseTime(value || '12:00 PM');
// 	const [hour, setHour] = useState(initialTime.hour);
// 	const [minute, setMinute] = useState(initialTime.minute);
// 	const [period, setPeriod] = useState(initialTime.period);

// 	useEffect(() => {
// 		const newTime = parseTime(value);
// 		setHour(newTime.hour);
// 		setMinute(newTime.minute);
// 		setPeriod(newTime.period);
// 	}, [value]);

// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const [isSelectingHours, setIsSelectingHours] = useState(true);

// 	const clockHours = Array.from({ length: 12 }, (_, i) => i + 1);
// 	const clockMinutes = Array.from({ length: 60 }, (_, i) => i);

// 	const updateTime = (h, m, p) => {
// 		const validHour = h === '' ? 12 : h;
// 		const validMinute = m === '' ? 0 : m;
// 		const timeString = `${validHour.toString().padStart(2, '0')}:${validMinute
// 			.toString()
// 			.padStart(2, '0')} ${p}`;
// 		onChange(timeString);
// 	};

// 	const handleHourSelect = (selectedHour) => {
// 		setHour(selectedHour);
// 		setIsSelectingHours(false);
// 		updateTime(selectedHour, minute, period);
// 	};

// 	const handleMinuteSelect = (selectedMinute) => {
// 		setMinute(selectedMinute);
// 		updateTime(hour, selectedMinute, period);
// 	};

// 	const handlePeriodToggle = (newPeriod) => {
// 		setPeriod(newPeriod);
// 		updateTime(hour, minute, newPeriod);
// 	};

// 	const handleHourInputChange = (e) => {
// 		const inputValue = e.target.value.replace(/[^0-9]/g, '');
// 		if (inputValue === '') {
// 			setHour('');
// 		} else {
// 			const numValue = parseInt(inputValue, 10);
// 			if (numValue >= 1 && numValue <= 12) {
// 				setHour(numValue);
// 				updateTime(numValue, minute || 0, period);
// 			}
// 		}
// 	};

// 	const handleMinuteInputChange = (e) => {
// 		const inputValue = e.target.value.replace(/[^0-9]/g, '');
// 		if (inputValue === '') {
// 			setMinute('');
// 		} else {
// 			const numValue = parseInt(inputValue, 10);
// 			if (numValue >= 0 && numValue <= 59) {
// 				setMinute(numValue);
// 				updateTime(hour || 12, numValue, period);
// 			}
// 		}
// 	};

// 	const handleHourConfirm = () => {
// 		updateTime(hour, minute, period);
// 		onClose();
// 	};

// 	const handleHourCancel = () => {
// 		setIsSelectingHours(true);
// 		onClose();
// 	};

// 	const handleMinuteConfirm = () => {
// 		updateTime(hour, minute, period);
// 		onClose();
// 	};

// 	const handleMinuteCancel = () => {
// 		setIsSelectingHours(false);
// 		onClose();
// 	};

// 	const handleClose = () => {
// 		setIsSelectingHours(true);
// 		onClose();
// 	};

// 	return (
// 		<Box
// 			fontFamily='DM Sans'
// 			p={2}
// 			borderRadius='8px'
// 			position='relative'
// 			w='fit-content'
// 		>
// 			<Flex alignItems='center' mb={1} justify='center' gap={1}>
// 				<HStack spacing={1} alignItems='center'>
// 					<TimeInput
// 						value={hour}
// 						onChange={handleHourInputChange}
// 						placeholder='HH'
// 						bgColor={'brand.200'}
// 						isHour={true}
// 						clockItems={clockHours}
// 						selectedValue={hour}
// 						onSelect={handleHourSelect}
// 						onConfirm={handleHourConfirm}
// 						onCancel={handleHourCancel}
// 						isOpen={isOpen && isSelectingHours}
// 						onOpen={() => {
// 							setIsSelectingHours(true);
// 							onOpen();
// 						}}
// 						onClose={handleClose}
// 					/>
// 					<Text fontSize='xl' fontWeight='bold' color='#333333'>
// 						:
// 					</Text>
// 					<TimeInput
// 						value={minute}
// 						onChange={handleMinuteInputChange}
// 						placeholder='MM'
// 						bgColor={'brand.200'}
// 						isHour={false}
// 						clockItems={clockMinutes}
// 						selectedValue={minute}
// 						onSelect={handleMinuteSelect}
// 						onConfirm={handleMinuteConfirm}
// 						onCancel={handleMinuteCancel}
// 						isOpen={isOpen && !isSelectingHours}
// 						onOpen={() => {
// 							setIsSelectingHours(false);
// 							onOpen();
// 						}}
// 						onClose={handleClose}
// 					/>
// 					<VStack
// 						spacing={0}
// 						ml={1}
// 						borderRadius='6px'
// 						overflow='hidden'
// 						border='1px solid brand.300'
// 						w='30px'
// 					>
// 						<Button
// 							borderRadius='0'
// 							w='100%'
// 							size='xs'
// 							bg={period === 'AM' ? 'brand.400' : 'brand.200'}
// 							color='white'
// 							onClick={() => handlePeriodToggle('AM')}
// 							_hover={{ bg: 'brand.400' }}
// 							_active={{ bg: 'brand.400' }}
// 							borderTopRadius='6px'
// 							fontSize='xs'
// 							py={1}
// 						>
// 							AM
// 						</Button>
// 						<Button
// 							borderRadius='0'
// 							w='100%'
// 							size='xs'
// 							bg={period === 'PM' ? 'brand.400' : 'brand.200'}
// 							color='white'
// 							onClick={() => handlePeriodToggle('PM')}
// 							_hover={{ bg: 'brand.400' }}
// 							_active={{ bg: 'brand.400' }}
// 							borderBottomRadius='6px'
// 							fontSize='xs'
// 							py={1}
// 						>
// 							PM
// 						</Button>
// 					</VStack>
// 				</HStack>
// 			</Flex>
// 		</Box>
// 	);
// };
const NormalTimePicker = ({ value, onChange }) => {
	const parseTime = (timeStr) => {
		if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
		const [time, period] = timeStr.split(' ');
		const [hour, minute] = time.split(':').map(Number);
		return { hour, minute, period };
	};

	// Parse initial time from value prop
	const initialTime = parseTime(value || '12:00 AM');
	const [hour, setHour] = useState(initialTime.hour);
	const [minute, setMinute] = useState(initialTime.minute);
	const [period, setPeriod] = useState(initialTime.period);
	const [hourInput, setHourInput] = useState(
		initialTime.hour.toString().padStart(2, '0')
	);
	const [minuteInput, setMinuteInput] = useState(
		initialTime.minute.toString().padStart(2, '0')
	);

	useEffect(() => {
		const newTime = parseTime(value);
		setHour(newTime.hour);
		setMinute(newTime.minute);
		setPeriod(newTime.period);
		setHourInput(newTime.hour.toString().padStart(2, '0'));
		setMinuteInput(newTime.minute.toString().padStart(2, '0'));
	}, [value]);

	const updateTime = (h, m, p) => {
		const validHour = h === '' ? 12 : Math.max(1, Math.min(12, h));
		const validMinute = m === '' ? 0 : Math.max(0, Math.min(59, m));
		const timeString = `${validHour.toString().padStart(2, '0')}:${validMinute
			.toString()
			.padStart(2, '0')} ${p}`;
		onChange(timeString);
	};

	const handleHourChange = (e) => {
		const inputValue = e.target.value.replace(/[^0-9]/g, '');
		setHourInput(inputValue);

		if (inputValue.length === 2) {
			const numValue = parseInt(inputValue, 10);
			if (numValue >= 1 && numValue <= 12) {
				setHour(numValue);
				updateTime(numValue, minute, period);
			} else if (numValue > 12) {
				// Handle cases like 13-19 by taking the second digit
				const adjustedValue = parseInt(inputValue[1], 10) || 1;
				setHour(adjustedValue);
				setHourInput(adjustedValue.toString().padStart(2, '0'));
				updateTime(adjustedValue, minute, period);
			}
		}
	};

	const handleMinuteChange = (e) => {
		const inputValue = e.target.value.replace(/[^0-9]/g, '');
		setMinuteInput(inputValue);

		if (inputValue.length === 2) {
			const numValue = parseInt(inputValue, 10);
			if (numValue >= 0 && numValue <= 59) {
				setMinute(numValue);
				updateTime(hour, numValue, period);
			} else if (numValue > 59) {
				// Handle cases like 60-99 by taking the second digit
				const adjustedValue = parseInt(inputValue[1], 10) || 0;
				setMinute(adjustedValue);
				setMinuteInput(adjustedValue.toString().padStart(2, '0'));
				updateTime(hour, adjustedValue, period);
			}
		}
	};

	const handleHourBlur = () => {
		let numValue = parseInt(hourInput, 10);

		if (isNaN(numValue)) {
			numValue = 12;
		} else if (numValue < 1) {
			numValue = 1;
		} else if (numValue > 12) {
			numValue = 12;
		}

		setHour(numValue);
		setHourInput(numValue.toString().padStart(2, '0'));
		updateTime(numValue, minute, period);
	};

	const handleMinuteBlur = () => {
		let numValue = parseInt(minuteInput, 10);

		if (isNaN(numValue)) {
			numValue = 0;
		} else if (numValue < 0) {
			numValue = 0;
		} else if (numValue > 59) {
			numValue = 59;
		}

		setMinute(numValue);
		setMinuteInput(numValue.toString().padStart(2, '0'));
		updateTime(hour, numValue, period);
	};

	const handleHourKeyDown = (e) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			const newHour = hour === 12 ? 1 : hour + 1;
			setHour(newHour);
			setHourInput(newHour.toString().padStart(2, '0'));
			updateTime(newHour, minute, period);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const newHour = hour === 1 ? 12 : hour - 1;
			setHour(newHour);
			setHourInput(newHour.toString().padStart(2, '0'));
			updateTime(newHour, minute, period);
		}
	};

	const handleMinuteKeyDown = (e) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			const newMinute = minute === 59 ? 0 : minute + 1;
			setMinute(newMinute);
			setMinuteInput(newMinute.toString().padStart(2, '0'));
			updateTime(hour, newMinute, period);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			const newMinute = minute === 0 ? 59 : minute - 1;
			setMinute(newMinute);
			setMinuteInput(newMinute.toString().padStart(2, '0'));
			updateTime(hour, newMinute, period);
		}
	};

	const handlePeriodToggle = (newPeriod) => {
		setPeriod(newPeriod);
		updateTime(hour, minute, newPeriod);
	};

	return (
		<Box
			fontFamily='DM Sans'
			p={2}
			borderRadius='8px'
			position='relative'
			w='fit-content'
		>
			<Flex alignItems='center' mb={1} justify='center' gap={1}>
				<HStack spacing={1} alignItems='center'>
					<Input
						value={hourInput}
						onChange={handleHourChange}
						onBlur={handleHourBlur}
						onKeyDown={handleHourKeyDown}
						placeholder='HH'
						bgColor={'brand.200'}
						maxLength={2}
						w='60px'
						textAlign='center'
						fontSize='md'
						color='#333333'
						_focus={{ borderColor: 'brand.400' }}
						_placeholder={{ color: 'gray.600' }}
					/>
					<Text fontSize='xl' fontWeight='bold' color='#333333'>
						:
					</Text>
					<Input
						value={minuteInput}
						onChange={handleMinuteChange}
						onBlur={handleMinuteBlur}
						onKeyDown={handleMinuteKeyDown}
						placeholder='MM'
						bgColor={'brand.200'}
						maxLength={2}
						w='60px'
						textAlign='center'
						fontSize='md'
						color='#333333'
						_focus={{ borderColor: 'brand.400' }}
						_placeholder={{ color: 'gray.600' }}
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
		</Box>
	);
};

// const NormalTimePicker = ({ value, onChange }) => {
// 	const parseTime = (timeStr) => {
// 		if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
// 		const [time, period] = timeStr.split(' ');
// 		const [hour, minute] = time.split(':').map(Number);
// 		return { hour, minute, period };
// 	};

// 	// Parse initial time from value prop
// 	const initialTime = parseTime(value || '12:00 AM');
// 	const [hour, setHour] = useState(initialTime.hour);
// 	const [minute, setMinute] = useState(initialTime.minute);
// 	const [period, setPeriod] = useState(initialTime.period);

// 	useEffect(() => {
// 		const newTime = parseTime(value);
// 		setHour(newTime.hour);
// 		setMinute(newTime.minute);
// 		setPeriod(newTime.period);
// 	}, [value]);

// 	const updateTime = (h, m, p) => {
// 		const validHour = h === '' ? 12 : Math.max(1, Math.min(12, h));
// 		const validMinute = m === '' ? 0 : Math.max(0, Math.min(59, m));
// 		const timeString = `${validHour.toString().padStart(2, '0')}:${validMinute
// 			.toString()
// 			.padStart(2, '0')} ${p}`;
// 		onChange(timeString);
// 	};

// 	const handleHourChange = (e) => {
// 		const inputValue = e.target.value.replace(/[^0-9]/g, '');
// 		if (inputValue === '') {
// 			setHour('');
// 			updateTime('', minute, period);
// 		} else {
// 			const numValue = parseInt(inputValue, 10);
// 			if (!isNaN(numValue)) {
// 				setHour(numValue);
// 				updateTime(numValue, minute, period);
// 			}
// 		}
// 	};

// 	const handleMinuteChange = (e) => {
// 		const inputValue = e.target.value.replace(/[^0-9]/g, '');
// 		if (inputValue === '') {
// 			setMinute('');
// 			updateTime(hour, '', period);
// 		} else {
// 			const numValue = parseInt(inputValue, 10);
// 			if (!isNaN(numValue)) {
// 				setMinute(numValue);
// 				updateTime(hour, numValue, period);
// 			}
// 		}
// 	};

// 	const handleHourBlur = () => {
// 		if (hour === '' || isNaN(hour)) {
// 			setHour(12);
// 			updateTime(12, minute, period);
// 		} else {
// 			const validatedHour = Math.max(1, Math.min(12, hour));
// 			setHour(validatedHour);
// 			updateTime(validatedHour, minute, period);
// 		}
// 	};

// 	const handleMinuteBlur = () => {
// 		if (minute === '' || isNaN(minute)) {
// 			setMinute(0);
// 			updateTime(hour, 0, period);
// 		} else {
// 			const validatedMinute = Math.max(0, Math.min(59, minute));
// 			setMinute(validatedMinute);
// 			updateTime(hour, validatedMinute, period);
// 		}
// 	};

// 	const handleHourKeyDown = (e) => {
// 		if (e.key === 'ArrowUp') {
// 			e.preventDefault();
// 			const newHour = hour === '' ? 1 : (hour % 12) + 1;
// 			setHour(newHour);
// 			updateTime(newHour, minute, period);
// 		} else if (e.key === 'ArrowDown') {
// 			e.preventDefault();
// 			const newHour = hour === '' ? 12 : ((hour + 10) % 12) + 1;
// 			setHour(newHour);
// 			updateTime(newHour, minute, period);
// 		}
// 	};

// 	const handleMinuteKeyDown = (e) => {
// 		if (e.key === 'ArrowUp') {
// 			e.preventDefault();
// 			const newMinute = minute === '' ? 0 : (minute + 1) % 60;
// 			setMinute(newMinute);
// 			updateTime(hour, newMinute, period);
// 		} else if (e.key === 'ArrowDown') {
// 			e.preventDefault();
// 			const newMinute = minute === '' ? 59 : (minute + 59) % 60;
// 			setMinute(newMinute);
// 			updateTime(hour, newMinute, period);
// 		}
// 	};

// 	const handlePeriodToggle = (newPeriod) => {
// 		setPeriod(newPeriod);
// 		updateTime(hour, minute, newPeriod);
// 	};

// 	const formatDisplayValue = (value, isHour) => {
// 		if (value === '' || isNaN(value)) return '';
// 		const numValue = parseInt(value, 10);
// 		if (isHour && (numValue < 1 || numValue > 12)) return '';
// 		if (!isHour && (numValue < 0 || numValue > 59)) return '';
// 		return numValue.toString().padStart(2, '0');
// 	};

// 	return (
// 		<Box
// 			fontFamily='DM Sans'
// 			p={2}
// 			borderRadius='8px'
// 			position='relative'
// 			w='fit-content'
// 		>
// 			<Flex alignItems='center' mb={1} justify='center' gap={1}>
// 				<HStack spacing={1} alignItems='center'>
// 					<Input
// 						value={formatDisplayValue(hour, true)}
// 						onChange={handleHourChange}
// 						onBlur={handleHourBlur}
// 						onKeyDown={handleHourKeyDown}
// 						placeholder='HH'
// 						bgColor={'brand.200'}
// 						maxLength={2}
// 						w='60px'
// 						textAlign='center'
// 						fontSize='md'
// 						color='#333333'
// 						_focus={{ borderColor: 'brand.400' }}
// 					/>
// 					<Text fontSize='xl' fontWeight='bold' color='#333333'>
// 						:
// 					</Text>
// 					<Input
// 						value={formatDisplayValue(minute, false)}
// 						onChange={handleMinuteChange}
// 						onBlur={handleMinuteBlur}
// 						onKeyDown={handleMinuteKeyDown}
// 						placeholder='MM'
// 						bgColor={'brand.200'}
// 						maxLength={2}
// 						w='60px'
// 						textAlign='center'
// 						fontSize='md'
// 						color='#333333'
// 						_focus={{ borderColor: 'brand.400' }}
// 					/>
// 					<VStack
// 						spacing={0}
// 						ml={1}
// 						borderRadius='6px'
// 						overflow='hidden'
// 						border='1px solid brand.300'
// 						w='30px'
// 					>
// 						<Button
// 							borderRadius='0'
// 							w='100%'
// 							size='xs'
// 							bg={period === 'AM' ? 'brand.400' : 'brand.200'}
// 							color='white'
// 							onClick={() => handlePeriodToggle('AM')}
// 							_hover={{ bg: 'brand.400' }}
// 							_active={{ bg: 'brand.400' }}
// 							borderTopRadius='6px'
// 							fontSize='xs'
// 							py={1}
// 						>
// 							AM
// 						</Button>
// 						<Button
// 							borderRadius='0'
// 							w='100%'
// 							size='xs'
// 							bg={period === 'PM' ? 'brand.400' : 'brand.200'}
// 							color='white'
// 							onClick={() => handlePeriodToggle('PM')}
// 							_hover={{ bg: 'brand.400' }}
// 							_active={{ bg: 'brand.400' }}
// 							borderBottomRadius='6px'
// 							fontSize='xs'
// 							py={1}
// 						>
// 							PM
// 						</Button>
// 					</VStack>
// 				</HStack>
// 			</Flex>
// 		</Box>
// 	);
// };

export default NormalTimePicker;
