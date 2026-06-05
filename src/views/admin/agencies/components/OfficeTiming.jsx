import React from 'react';
import {
	Box,
	Text,
	Flex,
	FormControl,
	FormLabel,
	Input,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	FormHelperText,
	HStack,
} from '@chakra-ui/react';
import { ReactComponent as ClockIcon } from '../../../../assets/icons/Clock.svg';
import { useBreakpointValue } from '@chakra-ui/react';
import TimeZoneSelect from './TimeZone';
import OffDaysCheckbox from './OffDaysCheckbox';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';
import { useModalColors } from 'hooks/useModalColors';

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
	monthlyLateLimit,
	setMonthlyLateLimit,
	monthlyEarlyCheckoutLimit,
	setMonthlyEarlyCheckoutLimit,
}) => {
	const colors = useModalColors();
	const fontSize = useBreakpointValue({ base: '14px', md: '17px' });
	const boxHeight = useBreakpointValue({ base: 'fit-content', lg: '560px' });

	return (
		<Box
			borderRadius='lg'
			p={5}
			py={10}
			w={{ base: '100%', lg: 'auto' }}
			minH={boxHeight}
			bg={colors.bg}
			border='1px solid'
			borderColor={colors.borderColor}
			boxShadow={colors.cardShadow}
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
					color={colors.headingText}
				>
					<ClockIcon color={colors.accentGold} /> Office Timing
				</Text>
			</Flex>

			<Flex mb={4} flexWrap='wrap' gap={4}>
				<Box flex='1' maxW='200px' bg={colors.bgInput} rounded='md' p='2' border='1px solid' borderColor={colors.borderColor}>
					<Text mb={2} fontWeight='400' fontSize={fontSize} color={colors.labelColor}>
						Check-in Time
					</Text>
					<NormalTimePicker value={checkinTime} onChange={setCheckinTime} />
				</Box>

				<Box flex='1' maxW='200px' bg={colors.bgInput} rounded='md' p='2' border='1px solid' borderColor={colors.borderColor}>
					<Text mb={2} fontWeight='400' fontSize={fontSize} color={colors.labelColor}>
						Check-out Time
					</Text>
					<NormalTimePicker value={checkoutTime} onChange={setCheckoutTime} />
				</Box>
			</Flex>

			<HStack flexDir={{ base: 'column', md: 'row' }} gap={2} mb={4}>
				<FormControl maxW='220px'>
					<FormLabel mb={1} fontWeight='500' fontSize={fontSize} color={colors.labelColor}>
						Grace Period (minutes)
					</FormLabel>

					<NumberInput
						value={gracePeriod}
						min={0}
						max={59}
						size='sm'
						isDisabled={isDisabled}
						onChange={(valueString, valueNumber) =>
							setGracePeriod(Number.isNaN(valueNumber) ? 0 : valueNumber)
						}
					>
						<NumberInputField
							borderRadius='6px'
							textAlign='center'
							pr='2.5rem'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</FormControl>
			</HStack>

			<HStack mb='2' gap={2} flexDir={{ base: 'column', md: 'row' }}>
				<FormControl>
					<FormLabel mb={1} fontWeight='500' fontSize={fontSize} color={colors.labelColor}>
						Late Limit
					</FormLabel>

					<NumberInput
						value={monthlyLateLimit}
						min={0}
						max={30}
						size='sm'
						isDisabled={isDisabled}
						onChange={(valueString, valueNumber) =>
							setMonthlyLateLimit(Number.isNaN(valueNumber) ? 0 : valueNumber)
						}
					>
						<NumberInputField
							borderRadius='6px'
							textAlign='center'
							pr='2.5rem'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</FormControl>
				<FormControl>
					<FormLabel mb={1} fontWeight='500' fontSize={fontSize} color={colors.labelColor}>
						Early Checkout Limit
					</FormLabel>

					<NumberInput
						value={monthlyEarlyCheckoutLimit}
						min={0}
						max={30}
						size='sm'
						isDisabled={isDisabled}
						onChange={(valueString, valueNumber) =>
							setMonthlyEarlyCheckoutLimit(
								Number.isNaN(valueNumber) ? 0 : valueNumber,
							)
						}
					>
						<NumberInputField
							borderRadius='6px'
							textAlign='center'
							pr='2.5rem'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</FormControl>
			</HStack>

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