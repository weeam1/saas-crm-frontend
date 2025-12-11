import { useSelector } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import SettingsForm from './SettingsForm';

const DialerSettings = () => {
	const userSettings = useSelector((state) => state.webrtc?.userSettings);

	return (
		<Box p={2}>
			<Text fontSize='md' mb={4} fontWeight='bold'>
				Dialer Settings
			</Text>
			<SettingsForm userSettings={userSettings} />
		</Box>
	);
};

export default DialerSettings;
