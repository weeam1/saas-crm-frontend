import { Box, Text, Flex, useBreakpointValue, Button } from '@chakra-ui/react';
import { ReactComponent as ClockIcon } from '../../../../assets/icons/Clock.svg';
import CustomTimePicker from 'components/customDatePicker/CustomDatePicker';
import { buttonStyle } from 'views/admin/attendance/constants';

const AdminSetting = ({
	checkinTime,
	setCheckinTime,
	checkoutTime,
	setCheckoutTime,
	selectedUser,
	setSpecialUsers,
	setSelectedUser,
}) => {
	const fontSize = useBreakpointValue({ base: '14px', md: '17px' });

	const handleSave = () => {
		if (!selectedUser) return;

		setSpecialUsers((prev) => {
			const exists = prev.some((su) => su.user === selectedUser._id);
			if (exists) {
				// Update existing special user timing
				return prev.map((su) =>
					su.user === selectedUser._id
						? { ...su, specialTiming: { checkinTime, checkoutTime } }
						: su
				);
			}

			// Add new special user
			return [
				...prev,
				{
					user: selectedUser._id,
					specialTiming: { checkinTime, checkoutTime },
				},
			];
		});

		// Reset selected user
		setSelectedUser(null);
	};

	return (
		<Box
			borderRadius='lg'
			p={5}
			maxW={{ base: '100%', md: '500px' }}
			bg='white'
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
					<ClockIcon color='blue.400' />{' '}
					{`${selectedUser?.fullName ?? 'Special'}`} Timing
				</Text>
			</Flex>
			<Flex
				flexDirection='column'
				justifyContent='space-between'
				alignItems='flex-end'
				opacity={!selectedUser ? 0.5 : 1}
				pointerEvents={!selectedUser ? 'none' : 'auto'}
			>
				<Flex justify='space-between' mb={4} flexWrap='wrap' gap={4}>
					<Box flex='1' minW='150px'>
						<Text mb={2} fontWeight='400' fontSize={fontSize}>
							In timing
						</Text>
						<CustomTimePicker
							value={checkinTime}
							onChange={setCheckinTime}
							isDisabled={!selectedUser}
						/>
					</Box>

					<Box flex='1' minW='150px'>
						<Text mb={2} fontWeight='400' fontSize={fontSize}>
							Out timing
						</Text>
						<CustomTimePicker value={checkoutTime} onChange={setCheckoutTime} />
					</Box>
				</Flex>

				<Button
					{...buttonStyle}
					variant='solid'
					bg='brand.400'
					py='5'
					px='8'
					fontSize='lg'
					aria-label='update'
					isDisabled={!selectedUser}
					onClick={handleSave}
					width='fit-content'
				>
					Update
				</Button>
			</Flex>
		</Box>
	);
};

export default AdminSetting;

/* <Box mb={4}>
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
      /> */
