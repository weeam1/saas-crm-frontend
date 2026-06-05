// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import {
// 	Box,
// 	Input,
// 	InputGroup,
// 	InputRightElement,
// 	FormControl,
// 	FormLabel,
// 	Text,
// 	useBreakpointValue,
// 	useTheme,
// } from '@chakra-ui/react';
// import { FaRegCalendar } from 'react-icons/fa';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './style.css';

// const CustomDatePicker = ({
// 	selectedDate,
// 	handleDateChange,
// 	errors,
// 	errorKey,
// 	label,
// 	minDate,
// 	maxDate,
// 	placeholder = 'Select a date',
// 	isCalendarOpen,
// 	toggleCalendar,
// 	inputStyles,
// 	containerProps,
// }) => {
// 	const errorMessage = errors?.[errorKey];
// 	const containerRef = useRef();
// 	const popupRef = useRef();
// 	const [popupStyle, setPopupStyle] = useState({
// 		opacity: 0,
// 		visibility: 'hidden',
// 		position: 'fixed',
// 		zIndex: 9999,
// 	});

// 	const isMobile = useBreakpointValue({ base: true, md: false });
// 	const theme = useTheme();

// 	const calendarWidth = useBreakpointValue({
// 		base: 280,
// 		sm: 300,
// 		md: 320,
// 	});

// 	const calendarHeight = useBreakpointValue({
// 		base: 280,
// 		sm: 300,
// 		md: 320,
// 	});

// 	const calculatePosition = useCallback(() => {
// 		if (!containerRef.current) return {};

// 		const containerRect = containerRef.current.getBoundingClientRect();
// 		const viewportHeight = window.innerHeight;
// 		const viewportWidth = window.innerWidth;

// 		const spaceBelow = viewportHeight - containerRect.bottom;
// 		const spaceAbove = containerRect.top;

// 		let leftPos = containerRect.left;
// 		const rightEdge = leftPos + calendarWidth;

// 		if (rightEdge > viewportWidth) {
// 			leftPos = viewportWidth - calendarWidth - 10;
// 		}

// 		if (leftPos < 0) {
// 			leftPos = 10;
// 		}

// 		if (isMobile) {
// 			return {
// 				position: 'fixed',
// 				zIndex: 9999,
// 				width: `calc(100% - 40px)`,
// 				maxWidth: '350px',
// 				left: '50%',
// 				top: '50%',
// 				transform: 'translate(-50%, -50%)',
// 				backgroundColor: 'white',
// 				boxShadow:
// 					'0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)',
// 				borderRadius: '12px',
// 				border: '1px solid #E2E8F0',
// 			};
// 		} else {
// 			const hasSpaceBelow = spaceBelow >= calendarHeight + 20;
// 			const hasSpaceAbove = spaceAbove >= calendarHeight + 20;

// 			let topPosition;
// 			if (hasSpaceBelow) {
// 				topPosition = `${containerRect.bottom + 8}px`;
// 			} else if (hasSpaceAbove) {
// 				topPosition = `${containerRect.top - calendarHeight - 8}px`;
// 			} else {
// 				return {
// 					position: 'fixed',
// 					zIndex: 9999,
// 					width: `${calendarWidth}px`,
// 					backgroundColor: 'white',
// 					boxShadow:
// 						'0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)',
// 					borderRadius: '12px',
// 					border: '1px solid #E2E8F0',
// 					top: '50%',
// 					left: '50%',
// 					transform: 'translate(-50%, -50%)',
// 				};
// 			}

// 			return {
// 				position: 'fixed',
// 				zIndex: 9999,
// 				width: `${calendarWidth}px`,
// 				backgroundColor: 'white',
// 				boxShadow:
// 					'0 10px 25px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)',
// 				borderRadius: '12px',
// 				border: '1px solid #E2E8F0',
// 				top: topPosition,
// 				left: `${leftPos}px`,
// 				transform: 'none',
// 			};
// 		}
// 	}, [isMobile, calendarWidth, calendarHeight]);

// 	useEffect(() => {
// 		const handleClickOutside = (e) => {
// 			if (
// 				containerRef.current &&
// 				!containerRef.current.contains(e.target) &&
// 				popupRef.current &&
// 				!popupRef.current.contains(e.target)
// 			) {
// 				if (isCalendarOpen) toggleCalendar(null);
// 			}
// 		};

// 		document.addEventListener('mousedown', handleClickOutside);
// 		return () => document.removeEventListener('mousedown', handleClickOutside);
// 	}, [isCalendarOpen, toggleCalendar]);

// 	useEffect(() => {
// 		if (isCalendarOpen && containerRef.current) {
// 			const position = calculatePosition();

// 			setPopupStyle({
// 				...position,
// 				opacity: 0,
// 				visibility: 'visible',
// 				transition: 'opacity 0.15s ease-in-out',
// 			});

// 			requestAnimationFrame(() => {
// 				setPopupStyle((prev) => ({
// 					...prev,
// 					opacity: 1,
// 				}));
// 			});

// 			const handleScrollOrResize = () => {
// 				const newPosition = calculatePosition();
// 				setPopupStyle((prev) => ({
// 					...prev,
// 					...newPosition,
// 				}));
// 			};

// 			window.addEventListener('scroll', handleScrollOrResize, true);
// 			window.addEventListener('resize', handleScrollOrResize);

// 			return () => {
// 				window.removeEventListener('scroll', handleScrollOrResize, true);
// 				window.removeEventListener('resize', handleScrollOrResize);
// 			};
// 		} else {
// 			setPopupStyle({
// 				opacity: 0,
// 				visibility: 'hidden',
// 				transition: 'opacity 0.15s ease-in-out, visibility 0s linear 0.15s',
// 			});
// 		}
// 	}, [isCalendarOpen, calculatePosition]);

// 	const formatDate = (date) => {
// 		if (!date) return '';
// 		return date.toLocaleDateString('en-US', {
// 			year: 'numeric',
// 			month: 'short',
// 			day: 'numeric',
// 		});
// 	};

// 	const handleDateSelect = (date) => {
// 		handleDateChange(date);
// 		toggleCalendar(null);
// 	};

// 	const handleCalendarClick = (e) => {
// 		e.stopPropagation();
// 	};

// 	const handleToggleCalendar = () => {
// 		toggleCalendar();
// 	};

// 	return (
// 		<FormControl
// 			mb={4}
// 			isInvalid={!!errorMessage}
// 			ref={containerRef}
// 			{...containerProps}
// 		>
// 			{label && <FormLabel>{label}</FormLabel>}
// 			<Box position='relative' width='100%'>
// 				<InputGroup>
// 					<Input
// 						value={formatDate(selectedDate)}
// 						placeholder={placeholder}
// 						readOnly
// 						required
// 						bg='gray.100'
// 						borderColor={errorMessage ? 'red.500' : 'gray.200'}
// 						focusBorderColor={errorMessage ? 'red.500' : 'brand.500'}
// 						_hover={{ borderColor: errorMessage ? 'red.500' : 'gray.300' }}
// 						cursor='pointer'
// 						onClick={handleToggleCalendar}
// 						{...inputStyles}
// 					/>
// 					<InputRightElement>
// 						<FaRegCalendar
// 							size={16}
// 							cursor='pointer'
// 							onClick={handleToggleCalendar}
// 							color={
// 								errorMessage ? theme.colors.red[500] : theme.colors.gray[500]
// 							}
// 						/>
// 					</InputRightElement>
// 				</InputGroup>

// 				{isCalendarOpen && (
// 					<Box
// 						ref={popupRef}
// 						style={popupStyle}
// 						className='date-picker-calendar'
// 						onClick={handleCalendarClick}
// 					>
// 						<Calendar
// 							onChange={handleDateSelect}
// 							value={selectedDate}
// 							minDate={minDate}
// 							maxDate={maxDate}
// 							className='custom-calendar'
// 						/>
// 					</Box>
// 				)}
// 			</Box>
// 			{errorMessage && (
// 				<Text color='red.500' fontSize='sm' mt={1}>
// 					{errorMessage}
// 				</Text>
// 			)}
// 		</FormControl>
// 	);
// };

// export default CustomDatePicker;
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
	Box,
	Input,
	InputGroup,
	InputRightElement,
	FormControl,
	FormLabel,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';
import { FaRegCalendar } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style.css';

// Actual color values from your theme
const themeColors = {
	surface: '#10273A',
	borderDefault: '#1E3D5C',
	deepShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
};

const CustomDatePicker = ({
	selectedDate,
	handleDateChange,
	errors,
	errorKey,
	label,
	minDate,
	maxDate,
	placeholder = 'Select a date',
	isCalendarOpen,
	toggleCalendar,
	inputStyles,
	containerProps,
}) => {
	const errorMessage = errors?.[errorKey];
	const containerRef = useRef();
	const popupRef = useRef();
	const [popupStyle, setPopupStyle] = useState({
		opacity: 0,
		visibility: 'hidden',
		position: 'fixed',
		zIndex: 9999,
	});

	const isMobile = useBreakpointValue({ base: true, md: false });

	const calendarWidth = useBreakpointValue({
		base: 280,
		sm: 300,
		md: 320,
	});

	const calendarHeight = useBreakpointValue({
		base: 280,
		sm: 300,
		md: 320,
	});

	const calculatePosition = useCallback(() => {
		if (!containerRef.current) return {};

		const containerRect = containerRef.current.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;

		const spaceBelow = viewportHeight - containerRect.bottom;
		const spaceAbove = containerRect.top;

		let leftPos = containerRect.left;
		const rightEdge = leftPos + calendarWidth;

		if (rightEdge > viewportWidth) {
			leftPos = viewportWidth - calendarWidth - 10;
		}

		if (leftPos < 0) {
			leftPos = 10;
		}

		if (isMobile) {
			return {
				position: 'fixed',
				zIndex: 9999,
				width: `calc(100% - 40px)`,
				maxWidth: '350px',
				left: '50%',
				top: '50%',
				transform: 'translate(-50%, -50%)',
				backgroundColor: themeColors.surface,
				boxShadow: themeColors.deepShadow,
				borderRadius: '12px',
				border: `1px solid ${themeColors.borderDefault}`,
			};
		} else {
			const hasSpaceBelow = spaceBelow >= calendarHeight + 20;
			const hasSpaceAbove = spaceAbove >= calendarHeight + 20;

			let topPosition;
			if (hasSpaceBelow) {
				topPosition = `${containerRect.bottom + 8}px`;
			} else if (hasSpaceAbove) {
				topPosition = `${containerRect.top - calendarHeight - 8}px`;
			} else {
				return {
					position: 'fixed',
					zIndex: 9999,
					width: `${calendarWidth}px`,
					backgroundColor: themeColors.surface,
					boxShadow: themeColors.deepShadow,
					borderRadius: '12px',
					border: `1px solid ${themeColors.borderDefault}`,
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				};
			}

			return {
				position: 'fixed',
				zIndex: 9999,
				width: `${calendarWidth}px`,
				backgroundColor: themeColors.surface,
				boxShadow: themeColors.deepShadow,
				borderRadius: '12px',
				border: `1px solid ${themeColors.borderDefault}`,
				top: topPosition,
				left: `${leftPos}px`,
				transform: 'none',
			};
		}
	}, [isMobile, calendarWidth, calendarHeight]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target) &&
				popupRef.current &&
				!popupRef.current.contains(e.target)
			) {
				if (isCalendarOpen) toggleCalendar(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isCalendarOpen, toggleCalendar]);

	useEffect(() => {
		if (isCalendarOpen && containerRef.current) {
			const position = calculatePosition();

			setPopupStyle({
				...position,
				opacity: 0,
				visibility: 'visible',
				transition: 'opacity 0.15s ease-in-out',
			});

			requestAnimationFrame(() => {
				setPopupStyle((prev) => ({
					...prev,
					opacity: 1,
				}));
			});

			const handleScrollOrResize = () => {
				const newPosition = calculatePosition();
				setPopupStyle((prev) => ({
					...prev,
					...newPosition,
				}));
			};

			window.addEventListener('scroll', handleScrollOrResize, true);
			window.addEventListener('resize', handleScrollOrResize);

			return () => {
				window.removeEventListener('scroll', handleScrollOrResize, true);
				window.removeEventListener('resize', handleScrollOrResize);
			};
		} else {
			setPopupStyle({
				opacity: 0,
				visibility: 'hidden',
				transition: 'opacity 0.15s ease-in-out, visibility 0s linear 0.15s',
			});
		}
	}, [isCalendarOpen, calculatePosition]);

	const formatDate = (date) => {
		if (!date) return '';
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const handleDateSelect = (date) => {
		handleDateChange(date);
		toggleCalendar(null);
	};

	const handleCalendarClick = (e) => {
		e.stopPropagation();
	};

	const handleToggleCalendar = () => {
		toggleCalendar();
	};

	return (
		<FormControl
			mb={4}
			isInvalid={!!errorMessage}
			ref={containerRef}
			{...containerProps}
		>
			{label && (
				<FormLabel fontSize='sm' fontWeight='600' color='text.body'>
					{label}
				</FormLabel>
			)}

			<Box position='relative' width='100%'>
				<InputGroup>
					<Input
						value={formatDate(selectedDate)}
						placeholder={placeholder}
						readOnly
						required
						bg='bg.input'
						borderColor={errorMessage ? 'red.500' : 'border.default'}
						color='text.body'
						_placeholder={{ color: 'text.muted' }}
						_focus={{
							borderColor: errorMessage ? 'red.500' : 'border.focus',
							boxShadow: errorMessage ? '0 0 0 1px red.500' : 'goldGlow',
						}}
						_hover={{ borderColor: errorMessage ? 'red.500' : 'border.focus' }}
						cursor='pointer'
						onClick={handleToggleCalendar}
						{...inputStyles}
					/>
					<InputRightElement>
						<FaRegCalendar
							size={16}
							cursor='pointer'
							onClick={handleToggleCalendar}
							color={errorMessage ? 'red.500' : 'text.accent'}
						/>
					</InputRightElement>
				</InputGroup>

				{isCalendarOpen && (
					<Box
						ref={popupRef}
						style={popupStyle}
						className='date-picker-calendar'
						onClick={handleCalendarClick}
					>
						<Calendar
							onChange={handleDateSelect}
							value={selectedDate}
							minDate={minDate}
							maxDate={maxDate}
							className='custom-calendar'
						/>
					</Box>
				)}
			</Box>

			{errorMessage && (
				<Text color='red.500' fontSize='xs' mt={1}>
					{errorMessage}
				</Text>
			)}
		</FormControl>
	);
};

export default CustomDatePicker;