import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Text,
	Box,
	useColorModeValue,
} from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import ClockContainer from './ClockContainer';

const DigitalClockDropdown = () => {
	const [currentTime, setCurrentTime] = useState(moment());
	const [timezone, setTimezone] = useState(moment.tz.guess());

	// Format using moment-timezone
	const formattedDate = currentTime.tz(timezone).format('DD MMMM YYYY');
	const formattedTime = currentTime.tz(timezone).format('hh:mm:ss A');
	const timezoneAbbr = currentTime.tz(timezone).format('z');
	const dayName = currentTime.tz(timezone).format('dddd'); // Returns full day name (e.g., "Monday")

	const bgColor = useColorModeValue('white', 'gray.800');
	const textColor = useColorModeValue('gray.600', 'white');
	const accentColor = useColorModeValue('blue.500', 'blue.300');

	// const allTimezones = moment.tz.names();

	return (
		<Menu closeOnSelect={false}>
			<MenuButton
				as={Box}
				bg='brand.500'
				boxSize={10}
				borderRadius='full'
				p='2.5'
				cursor='pointer'
				aria-label='Current time dropdown'
				_hover={{ opacity: 0.9 }}
				display='flex'
				alignItems='center'
				justifyContent='center'
			>
				<TimeIcon boxSize={5} color='white' />
			</MenuButton>

			<MenuList
				minWidth='260px'
				p={4}
				bg={bgColor}
				boxShadow='xl'
				border='none'
				borderRadius='lg'
			>
				<MenuItem
					as={Box}
					_hover={{ bg: 'transparent' }}
					_focus={{ bg: 'transparent' }}
				>
					<ClockContainer
						formattedDate={formattedDate}
						formattedTime={formattedTime}
						textColor={textColor}
						accentColor={accentColor}
						timezone={timezone}
						timezoneAbbr={timezoneAbbr}
						setTimezone={setTimezone}
						dayName={dayName}
					/>
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default DigitalClockDropdown;
