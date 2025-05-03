import { Box, Text, Select } from '@chakra-ui/react';
// import { useState, useEffect } from 'react';
import { useBreakpointValue } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

const TimeZoneSelect = ({ isDisabled, timezone, setTimezone }) => {
	const fontSize = useBreakpointValue({ base: '14px', md: '17px' });
	// const [timeZones, setTimeZones] = useState([]);
	// const [loading, setLoading] = useState(true);

	// useEffect(() => {
	// 	const fetchTimeZones = async () => {
	// 		try {
	// 			const response = await fetch(
	// 				'https://timeapi.io/api/timezone/availabletimezones'
	// 			);
	// 			const data = await response.json();
	// 			setTimeZones(data);
	// 			setLoading(false);
	// 		} catch (error) {
	// 			console.error('Error fetching time zones:', error);
	// 			setTimeZones([
	// 				'United Arab Emirates (GMT+4)',
	// 				'India (GMT+5:30)',
	// 				'United States (GMT-5)',
	// 			]);
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchTimeZones();
	// }, []);

	const { data: timezones, isLoading: loading } = useFetchItemsQuery(
		{ path: `/timezones` },
		{ refetchOnMountOrArgChange: true }
	);

	// console.log('Time zones:', timezone);

	return (
		<Box mb={4}>
			<Text mb={2} fontSize={fontSize}>
				Time zone
			</Text>
			<Select
				value={timezone}
				onChange={(e) => setTimezone(e.target.value)}
				size='sm'
				isDisabled={isDisabled || loading}
				placeholder={loading ? 'Loading time zones...' : 'Select a time zone'}
			>
				{timezones?.doc?.map((tz) => (
					<option key={tz.name} value={tz.name}>
						{tz.label}
					</option>
				))}
			</Select>
		</Box>
	);
};

export default TimeZoneSelect;
