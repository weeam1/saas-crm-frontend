import { Box, Text, HStack, useRadioGroup, useRadio } from '@chakra-ui/react';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';
import { useModalColors } from 'hooks/useModalColors';

// Custom radio button style
function CustomRadio(props) {
	const colors = useModalColors();
	const { getInputProps, getCheckboxProps } = useRadio(props);
	const input = getInputProps();
	const checkbox = getCheckboxProps();

	return (
		<Box as='label'>
			<input {...input} hidden />
			<Box
				{...checkbox}
				cursor='pointer'
				borderWidth='1px'
				borderRadius='md'
				boxShadow='sm'
				_checked={{
					bg: colors.accentGold,
					color: colors.headerText,
					borderColor: colors.accentGold,
				}}
				_focus={{
					boxShadow: 'none',
				}}
				_hover={{
					borderColor: colors.accentGold,
				}}
				px={4}
				py={2}
				textAlign='center'
				minW='80px'
				bg={colors.bgInput}
				color={colors.bodyText}
				transition='all 0.2s ease'
			>
				{props.children}
			</Box>
		</Box>
	);
}

function AttendanceSelector({
	checkInTime,
	setCheckInTime,
	checkOutTime,
	setCheckOutTime,
	attendanceStatus,
	setAttendanceStatus,
	showCheckout = true,
}) {
	const colors = useModalColors();
	const options = ['present', 'absent', 'leave'];

	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'attendance',
		defaultValue: 'present',
		onChange: setAttendanceStatus,
	});

	const group = getRootProps();

	return (
		<Box width='100%'>
			<Text mb={2} fontWeight='600' color={colors.headingText}>
				Attendance Status
			</Text>

			<HStack {...group} mb={4}>
				{options.map((value) => {
					const radio = getRadioProps({ value });
					return (
						<CustomRadio key={value} {...radio}>
							{value.charAt(0).toUpperCase() + value.slice(1)}
						</CustomRadio>
					);
				})}
			</HStack>

			{attendanceStatus === 'present' && (
				<HStack
					flexDir={{ base: 'column', md: 'row' }}
					justifyContent='center'
					alignItems='center'
					gap={3}
					width='100%'
				>
					<Box bg={colors.bgInput} p={3} rounded='md' minW='200px' border="1px solid" borderColor={colors.borderColor}>
						<Text mb={2} fontWeight='500' color={colors.headingText}>
							Check In
						</Text>
						<NormalTimePicker value={checkInTime} onChange={setCheckInTime} />
					</Box>

					{showCheckout && (
						<Box bg={colors.bgInput} p={3} rounded='md' minW='200px' border="1px solid" borderColor={colors.borderColor}>
							<Text mb={2} fontWeight='500' color={colors.headingText}>
								Check Out
							</Text>
							<NormalTimePicker
								value={checkOutTime}
								onChange={setCheckOutTime}
							/>
						</Box>
					)}
				</HStack>
			)}
		</Box>
	);
}

export default AttendanceSelector;