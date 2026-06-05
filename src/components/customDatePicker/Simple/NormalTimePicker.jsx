// import React, { useEffect, useState } from 'react';
// import {
// 	Box,
// 	Text,
// 	Flex,
// 	useDisclosure,
// 	HStack,
// 	VStack,
// 	Button,
// 	Input,
// } from '@chakra-ui/react';
// import TimeInput from './TimeInput';


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
// 	const [hourInput, setHourInput] = useState(
// 		initialTime.hour.toString().padStart(2, '0')
// 	);
// 	const [minuteInput, setMinuteInput] = useState(
// 		initialTime.minute.toString().padStart(2, '0')
// 	);

// 	useEffect(() => {
// 		const newTime = parseTime(value);
// 		setHour(newTime.hour);
// 		setMinute(newTime.minute);
// 		setPeriod(newTime.period);
// 		setHourInput(newTime.hour.toString().padStart(2, '0'));
// 		setMinuteInput(newTime.minute.toString().padStart(2, '0'));
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
// 		setHourInput(inputValue);

// 		if (inputValue.length === 2) {
// 			const numValue = parseInt(inputValue, 10);
// 			if (numValue >= 1 && numValue <= 12) {
// 				setHour(numValue);
// 				updateTime(numValue, minute, period);
// 			} else if (numValue > 12) {
// 				// Handle cases like 13-19 by taking the second digit
// 				const adjustedValue = parseInt(inputValue[1], 10) || 1;
// 				setHour(adjustedValue);
// 				setHourInput(adjustedValue.toString().padStart(2, '0'));
// 				updateTime(adjustedValue, minute, period);
// 			}
// 		}
// 	};

// 	const handleMinuteChange = (e) => {
// 		const inputValue = e.target.value.replace(/[^0-9]/g, '');
// 		setMinuteInput(inputValue);

// 		if (inputValue.length === 2) {
// 			const numValue = parseInt(inputValue, 10);
// 			if (numValue >= 0 && numValue <= 59) {
// 				setMinute(numValue);
// 				updateTime(hour, numValue, period);
// 			} else if (numValue > 59) {
// 				// Handle cases like 60-99 by taking the second digit
// 				const adjustedValue = parseInt(inputValue[1], 10) || 0;
// 				setMinute(adjustedValue);
// 				setMinuteInput(adjustedValue.toString().padStart(2, '0'));
// 				updateTime(hour, adjustedValue, period);
// 			}
// 		}
// 	};

// 	const handleHourBlur = () => {
// 		let numValue = parseInt(hourInput, 10);

// 		if (isNaN(numValue)) {
// 			numValue = 12;
// 		} else if (numValue < 1) {
// 			numValue = 1;
// 		} else if (numValue > 12) {
// 			numValue = 12;
// 		}

// 		setHour(numValue);
// 		setHourInput(numValue.toString().padStart(2, '0'));
// 		updateTime(numValue, minute, period);
// 	};

// 	const handleMinuteBlur = () => {
// 		let numValue = parseInt(minuteInput, 10);

// 		if (isNaN(numValue)) {
// 			numValue = 0;
// 		} else if (numValue < 0) {
// 			numValue = 0;
// 		} else if (numValue > 59) {
// 			numValue = 59;
// 		}

// 		setMinute(numValue);
// 		setMinuteInput(numValue.toString().padStart(2, '0'));
// 		updateTime(hour, numValue, period);
// 	};

// 	const handleHourKeyDown = (e) => {
// 		if (e.key === 'ArrowUp') {
// 			e.preventDefault();
// 			const newHour = hour === 12 ? 1 : hour + 1;
// 			setHour(newHour);
// 			setHourInput(newHour.toString().padStart(2, '0'));
// 			updateTime(newHour, minute, period);
// 		} else if (e.key === 'ArrowDown') {
// 			e.preventDefault();
// 			const newHour = hour === 1 ? 12 : hour - 1;
// 			setHour(newHour);
// 			setHourInput(newHour.toString().padStart(2, '0'));
// 			updateTime(newHour, minute, period);
// 		}
// 	};

// 	const handleMinuteKeyDown = (e) => {
// 		if (e.key === 'ArrowUp') {
// 			e.preventDefault();
// 			const newMinute = minute === 59 ? 0 : minute + 1;
// 			setMinute(newMinute);
// 			setMinuteInput(newMinute.toString().padStart(2, '0'));
// 			updateTime(hour, newMinute, period);
// 		} else if (e.key === 'ArrowDown') {
// 			e.preventDefault();
// 			const newMinute = minute === 0 ? 59 : minute - 1;
// 			setMinute(newMinute);
// 			setMinuteInput(newMinute.toString().padStart(2, '0'));
// 			updateTime(hour, newMinute, period);
// 		}
// 	};

// 	const handlePeriodToggle = (newPeriod) => {
// 		setPeriod(newPeriod);
// 		updateTime(hour, minute, newPeriod);
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
// 						value={hourInput}
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
// 						_placeholder={{ color: 'gray.600' }}
// 					/>
// 					<Text fontSize='xl' fontWeight='bold' color='#333333'>
// 						:
// 					</Text>
// 					<Input
// 						value={minuteInput}
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
// 						_placeholder={{ color: 'gray.600' }}
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

// export default NormalTimePicker;

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
import { useModalColors } from 'hooks/useModalColors';
import TimeInput from './TimeInput';

const NormalTimePicker = ({ value, onChange }) => {
	const colors = useModalColors();

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
						bgColor={colors.bgInput}
						borderColor={colors.borderColor}
						color={colors.headingText}
						maxLength={2}
						w='60px'
						textAlign='center'
						fontSize='md'
						_hover={{ borderColor: colors.accentGold }}
						_focus={{ borderColor: colors.accentGold, boxShadow: `0 0 0 1px ${colors.accentGold}` }}
						_placeholder={{ color: colors.mutedText }}
					/>
					<Text fontSize='xl' fontWeight='bold' color={colors.headingText}>
						:
					</Text>
					<Input
						value={minuteInput}
						onChange={handleMinuteChange}
						onBlur={handleMinuteBlur}
						onKeyDown={handleMinuteKeyDown}
						placeholder='MM'
						bgColor={colors.bgInput}
						borderColor={colors.borderColor}
						color={colors.headingText}
						maxLength={2}
						w='60px'
						textAlign='center'
						fontSize='md'
						_hover={{ borderColor: colors.accentGold }}
						_focus={{ borderColor: colors.accentGold, boxShadow: `0 0 0 1px ${colors.accentGold}` }}
						_placeholder={{ color: colors.mutedText }}
					/>
					<VStack
						spacing={0}
						ml={1}
						borderRadius='6px'
						overflow='hidden'
						border={`1px solid ${colors.borderColor}`}
						w='30px'
					>
						<Button
							borderRadius='0'
							w='100%'
							size='xs'
							bg={period === 'AM' ? colors.accentGold : colors.bgInput}
							color={period === 'AM' ? colors.headerText : colors.bodyText}
							onClick={() => handlePeriodToggle('AM')}
							_hover={{ bg: colors.accentGold, color: colors.headerText }}
							_active={{ bg: colors.accentGold }}
							borderTopRadius='6px'
							fontSize='xs'
							py={1}
							transition='all 0.2s ease'
						>
							AM
						</Button>
						<Button
							borderRadius='0'
							w='100%'
							size='xs'
							bg={period === 'PM' ? colors.accentGold : colors.bgInput}
							color={period === 'PM' ? colors.headerText : colors.bodyText}
							onClick={() => handlePeriodToggle('PM')}
							_hover={{ bg: colors.accentGold, color: colors.headerText }}
							_active={{ bg: colors.accentGold }}
							borderBottomRadius='6px'
							fontSize='xs'
							py={1}
							transition='all 0.2s ease'
						>
							PM
						</Button>
					</VStack>
				</HStack>
			</Flex>
		</Box>
	);
};

export default NormalTimePicker;