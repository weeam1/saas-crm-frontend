import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Input,
	FormControl,
	FormLabel,
	Spinner,
	Box,
	InputRightElement,
	InputGroup,
	Text,
	Icon,
} from '@chakra-ui/react';
import './date.css';
import { FaRegCalendar, FaClock } from 'react-icons/fa';
import { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useModalColors } from 'hooks/useModalColors';

const ArrangeInterview = ({
	isOpen,
	onClose,
	selectedTime,
	setSelectedTime,
	selectedDate,
	setSelectedDate,
	isLoading,
	handleScheduleInterview,
}) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const [showTime, setShowTime] = useState('');
	const [errors, setErrors] = useState({});

	const colors = useModalColors();

	const toggleCalendar = () => {
		setShowCalendar(!showCalendar);
	};

	const handleDateChange = (date) => {
		if (!(date instanceof Date)) {
			console.error('Invalid date:', date);
			return;
		}

		const formattedDate = date.toDateString();
		setErrors((prev) => ({ ...prev, selectedDate: '' }));
		setSelectedDate(date);
		setShowCalendar(false);
	};

	const handleTimeChange = (e) => {
		const time = e.target.value;

		setShowTime(time);

		if (time !== '') {
			let hours = time.split(':')[0];
			let minutes = time.split(':')[1];
			let suffix = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12 || 12;
			hours = hours < 10 ? '0' + hours : hours;

			const displayTime = hours + ':' + minutes + ' ' + suffix;

			setErrors((prev) => ({ ...prev, showTime: '' }));
			setSelectedTime(displayTime);
		}
	};

	const handleSubmit = () => {
		const newErrors = {};
		if (!selectedDate) newErrors.selectedDate = 'Date is required';
		if (!showTime) newErrors.showTime = 'Time is required';

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			handleScheduleInterview();
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
				<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.bg}>
					<ModalHeader
						display='flex'
						gap='2'
						bg={colors.headerBg}
						color={colors.headerText}
						borderTopRadius='xl'
						py={4}
						px={6}
						alignItems='center'
						w='100%'
					>
						Interview Invite
					</ModalHeader>
					<ModalCloseButton
						color={colors.closeBtnColor}
						_hover={{ bg: colors.closeBtnHoverBg }}
					/>
					<ModalBody>
						{/* Date Input */}
						<FormControl mb={4} isInvalid={errors?.selectedDate}>
							<FormLabel color={colors.labelColor}>Select Date</FormLabel>
							<Box position='relative' width='100%'>
								<InputGroup>
									<Input
										value={
											selectedDate ? selectedDate.toLocaleDateString() : ''
										}
										placeholder='Select a date'
										readOnly
										required
										bg={colors.bgInput}
										borderColor={errors?.selectedDate ? colors.badgeErrorText : colors.borderColor}
										color={colors.headingText}
										borderRadius='md'
										_hover={{ borderColor: colors.accentGold }}
										_focus={{ borderColor: colors.accentGold, boxShadow: `0 0 0 1px ${colors.accentGold}` }}
									/>
									<InputRightElement>
										<FaRegCalendar
											size={16}
											cursor='pointer'
											onClick={toggleCalendar}
											color={colors.accentGold}
										/>
									</InputRightElement>
								</InputGroup>
								{showCalendar && (
									<Box
										position='absolute'
										top='50px'
										zIndex='10'
										bg={colors.bg}
										border={`1px solid ${colors.borderColor}`}
										borderRadius='md'
										boxShadow={colors.cardShadow}
									>
										<Calendar
											onChange={handleDateChange}
											value={selectedDate}
											minDate={new Date()}
											className='custom-calendar'
										/>
									</Box>
								)}
							</Box>
							{errors?.selectedDate && (
								<Text color={colors.badgeErrorText} fontSize='sm'>
									{errors?.selectedDate}
								</Text>
							)}
						</FormControl>

						{/* Time Input with Custom Icon */}
						<FormControl isInvalid={errors?.showTime}>
  <FormLabel color={colors.labelColor}>Select Time</FormLabel>
  <InputGroup>
    <Input
      type='time'
      value={showTime}
      onChange={handleTimeChange}
      bg={colors.bgInput}
      borderColor={errors?.showTime ? colors.badgeErrorText : colors.borderColor}
      color={colors.headingText}
      required
      borderRadius='md'
      placeholder='Select a time'
      shadow='sm'
      pl='1rem'
      pr='2.5rem'
      _hover={{ borderColor: colors.accentGold }}
      _focus={{
        borderColor: colors.accentGold,
        boxShadow: `0 0 0 1px ${colors.accentGold}`,
        outline: 'none',
      }}
      sx={{
        '&::-webkit-calendar-picker-indicator': {
          position: 'absolute',
          right: '0',
          width: '100%',
          height: '100%',
          margin: '0',
          padding: '0',
          opacity: '0',
          cursor: 'pointer',
        },
        '&::-webkit-datetime-edit-fields-wrapper': {
          color: colors.headingText,
        },
        '&::-webkit-datetime-edit-hour-field': {
          color: colors.headingText,
          '&:focus': {
            backgroundColor: colors.accentGold,
            color: colors.headerText,
            borderRadius: '4px',
          },
        },
        '&::-webkit-datetime-edit-minute-field': {
          color: colors.headingText,
          '&:focus': {
            backgroundColor: colors.accentGold,
            color: colors.headerText,
            borderRadius: '4px',
          },
        },
        '&::-webkit-datetime-edit-ampm-field': {
          color: colors.accentGold,
          '&:focus': {
            backgroundColor: colors.accentGold,
            color: colors.headerText,
            borderRadius: '4px',
          },
        },
      }}
    />
    <InputRightElement pointerEvents='none' pr='5px'>
      <Icon
        as={FaClock}
        color={errors?.showTime ? colors.badgeErrorText : colors.accentGold}
        boxSize={4}
      />
    </InputRightElement>
  </InputGroup>
  {errors?.showTime && (
    <Text color={colors.badgeErrorText} fontSize='sm' mt={1}>
      {errors?.showTime}
    </Text>
  )}
</FormControl>
					</ModalBody>
					<ModalFooter
						bg={colors.footerBg}
						borderTop={`1px solid ${colors.borderColor}`}
						gap={3}
						py={4}
					>
						<Button
							variant='ghost'
							onClick={onClose}
							size='sm'
							rounded='md'
							color={colors.bodyText}
							_hover={{
								bg: colors.secondaryBtnHoverBg,
								color: colors.headingText,
							}}
						>
							Cancel
						</Button>
						<Button
							bg={colors.accentGold}
							color={colors.headerText}
							size='sm'
							px='1rem'
							rounded='md'
							_hover={{
								bg: colors.goldLight,
								transform: 'translateY(-1px)',
								boxShadow: colors.goldGlow,
							}}
							_active={{ bg: colors.goldDark }}
							onClick={handleSubmit}
							transition='all 0.2s ease'
						>
							{isLoading ? <Spinner color={colors.headerText} /> : 'Invite'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ArrangeInterview;