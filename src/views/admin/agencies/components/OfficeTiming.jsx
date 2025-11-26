import React from 'react';
import {
	Box,
	Text,
	Flex,
	FormControl,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { ReactComponent as ClockIcon } from '../../../../assets/icons/Clock.svg';
import { useBreakpointValue } from '@chakra-ui/react';
import TimeZoneSelect from './TimeZone';
import OffDaysCheckbox from './OffDaysCheckbox';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';

const OfficeTiming = ({
	isDisabled,
	checkinTime,
	setCheckinTime,
	checkoutTime,
	setCheckoutTime,
	timezone,
	setTimezone,
	offDays,
	setOffDays,
	gracePeriod,
	setGracePeriod,
}) => {
	const fontSize = useBreakpointValue({ base: '14px', md: '17px' });
	const boxHeight = useBreakpointValue({ base: 'fit-content', lg: '560px' });

	const handleGracePeriodChange = (e) => {
		let { value } = e.target;

		// Allow clearing input (don't force "0" immediately)
		if (value === '') {
			setGracePeriod('');
			return;
		}

		// Convert to integer, ensuring it's within range 0-59
		let numValue = parseInt(value, 10) || 0;
		numValue = Math.max(0, Math.min(numValue, 59));

		setGracePeriod(numValue);
	};

	return (
		<Box
			borderRadius='md'
			p={5}
			py={10}
			w={{ base: '100%', lg: 'auto' }}
			height={boxHeight}
			bg='white'
			border='1px solid #cacaca'
			position='relative'
			opacity={isDisabled ? 0.5 : 1}
			pointerEvents={isDisabled ? 'none' : 'auto'}
		>
			<Flex justify='space-between' align='center' mb={4} flexWrap='wrap'>
				<Text
					as='h2'
					display='flex'
					alignItems='center'
					gap={2}
					fontWeight='400'
					fontSize={fontSize}
				>
					<ClockIcon color='blue.400' /> Office Timing
				</Text>
				{/* <EditIcon /> */}
			</Flex>

			<Flex mb={4} flexWrap='wrap' gap={4}>
				<Box flex='1' maxW='200px' bg='softGray.50' rounded='md' p='2'>
					<Text mb={2} fontWeight='400' fontSize={fontSize}>
						Check-in Time
					</Text>
					<NormalTimePicker value={checkinTime} onChange={setCheckinTime} />
				</Box>

				<Box flex='1' maxW='200px' bg='softGray.50' rounded='md' p='2'>
					<Text mb={2} fontWeight='400' fontSize={fontSize}>
						Check-out Time
					</Text>
					<NormalTimePicker value={checkoutTime} onChange={setCheckoutTime} />
				</Box>
			</Flex>

			<Box mb={4}>
				<FormControl>
					<FormLabel mb={2} fontWeight='400' fontSize={fontSize}>
						Grace Period (minutes)
					</FormLabel>
					<Input
						type='number'
						value={gracePeriod}
						onChange={handleGracePeriodChange}
						min='0'
						max='59'
						isDisabled={isDisabled}
						borderRadius='5px'
						size='sm'
						w='100%'
						maxW='150px'
						textAlign='center'
					/>
				</FormControl>
			</Box>

			<Box mb={4}>
				<TimeZoneSelect
					isDisabled={isDisabled}
					timezone={timezone}
					setTimezone={setTimezone}
				/>
			</Box>

			<OffDaysCheckbox
				isDisabled={isDisabled}
				offDays={offDays}
				setOffDays={setOffDays}
			/>
		</Box>
	);
};

export default OfficeTiming;
