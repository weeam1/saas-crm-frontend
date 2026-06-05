import { Text, Box, Icon } from '@chakra-ui/react';
import AnalogClock from 'components/datetime/analog-clock/AnalogClock';
import { FiClock, FiGlobe } from 'react-icons/fi';

const ClockContainer = ({
	formattedTime,
	formattedDate,
	textColor,
	accentColor,
	timezone,
	setTimezone,
	dayName,
	timezoneAbbr,
}) => {
	// const onTimezoneChange = (value) => {
	// 	setTimezone(value);
	// };

	return (
		<Box width='100%' color={textColor}>
			<Box rounded='md' p='2'>
				<Text fontSize='sm'>{dayName}</Text>
				<Text fontSize='md' fontWeight='bold'>
					{formattedDate}
				</Text>
			</Box>

			{/* <Text
					fontSize='2xl'
					fontWeight='bold'
					color={accentColor}
					letterSpacing='tight'
				>
					{formattedTime}
				</Text> */}

			<AnalogClock timezone={timezone} />

			<Box
				display='flex'
				alignItems='center'
				justify='center'
				mt={2}
				p='1'
				mx='auto'
				color={textColor}
				fontWeight='medium'
				// bg='brand.300'
				rounded='md'
				maxWidth='fit-content'
				fontSize={{ base: 'xs', md: 'sm' }}
			>
				<Icon as={FiGlobe} mr={1.5} boxSize={3} />
				<Text as='span'>
					{timezone}{' '}
					<Text as='span' fontWeight='semibold'>
						({timezoneAbbr})
					</Text>
				</Text>
			</Box>
		</Box>
	);
};

export default ClockContainer;
