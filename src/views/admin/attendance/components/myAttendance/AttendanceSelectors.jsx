import { Box, Text, HStack, useRadioGroup, useRadio } from '@chakra-ui/react';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';

// Custom radio button style
function CustomRadio(props) {
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
				boxShadow='md'
				_checked={{
					bg: 'brand.500',
					color: 'white',
					borderColor: 'brand.600',
				}}
				_focus={{
					boxShadow: 'outline',
				}}
				px={4}
				py={2}
				textAlign='center'
				minW='80px'
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
	const options = ['present', 'absent', 'leave'];

	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'attendance',
		defaultValue: 'present',
		onChange: setAttendanceStatus,
	});

	const group = getRootProps();

	return (
		<Box width='100%'>
			<Text mb={2} color='gray.700' fontWeight='600'>
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
					<Box bg='softGray.50' p={3} rounded='md' minW='200px'>
						<Text mb={2} fontWeight='500'>
							Check In
						</Text>
						<NormalTimePicker value={checkInTime} onChange={setCheckInTime} />
					</Box>

					{showCheckout && (
						<Box bg='softGray.50' p={3} rounded='md' minW='200px'>
							<Text mb={2} fontWeight='500'>
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
