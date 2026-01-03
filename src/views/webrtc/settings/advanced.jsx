import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Icon,
	Image,
	Input,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';

import { getApplications } from 'api/webrtc';

import PasswordInput from 'components/password-input';
import ResetIcon from 'assets/webrtc-imgs/icons/Reset.svg';
import { getAdvancedSettings, saveAddvancedSettings } from 'storage';
import { normalizeUrl } from 'utils/webrtc';

export const AdvancedSettings = () => {
	const [apiKey, setApiKey] = useState('');
	const [apiServer, setApiServer] = useState('');
	const [accountSid, setAccountSid] = useState('');
	const [isCredentialOk, setIsCredentialOk] = useState(false);
	const [isAdvancedMode, setIsAdvancedMode] = useState(false);

	useEffect(() => {
		const settings = getAdvancedSettings();
		const activeSettings = settings.find((el) => el.active);
		if (activeSettings?.decoded.apiServer) {
			setIsAdvancedMode(true);
			checkCredential();
			setApiServer(activeSettings?.decoded.apiServer);
		}
		if (activeSettings?.decoded.apiKey) {
			setApiKey(activeSettings?.decoded.apiKey);
		}
		if (activeSettings?.decoded.accountSid) {
			setAccountSid(activeSettings?.decoded.accountSid);
		}
	}, []);

	const checkCredential = () => {
		getApplications()
			.then(() => {
				setIsCredentialOk(true);
			})
			.catch(() => {
				setIsCredentialOk(false);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setApiServer(normalizeUrl(apiServer));
		const settings = {
			accountSid,
			apiKey,
			apiServer: normalizeUrl(apiServer),
		};

		saveAddvancedSettings(settings);
		setIsAdvancedMode(true);
		checkCredential();
	};
	const resetSetting = () => {
		saveAddvancedSettings({});
		setApiKey('');
		setApiServer('');
		setAccountSid('');
		setIsAdvancedMode(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<VStack spacing={2} w='full' h='full' p={0}>
				<VStack
					spacing={2}
					maxH='calc(100vh - 25em)'
					overflowY='auto'
					w='full'
					p={0}
				>
					<FormControl id='jambonz_api_server'>
						<FormLabel>jambonz API Server Base URL</FormLabel>
						<Input
							type='text'
							placeholder='https://jambonz.cloud/api'
							isRequired
							value={apiServer}
							onChange={(e) => setApiServer(e.target.value)}
						/>
					</FormControl>
					<FormControl id='jambonz_account_sid'>
						<FormLabel>jambonz Account Sid</FormLabel>
						<Input
							type='text'
							isRequired
							value={accountSid}
							onChange={(e) => setAccountSid(e.target.value)}
						/>
					</FormControl>
					<FormControl id='api_key'>
						<FormLabel>API Key</FormLabel>
						<PasswordInput password={[apiKey, setApiKey]} isRequired />
					</FormControl>
				</VStack>

				{isAdvancedMode && (
					<HStack w='full' mt={2} mb={2}>
						<Icon
							as={isCredentialOk ? FaCheckCircle : FaCircleXmark}
							color={isCredentialOk ? 'green.500' : 'red.500'}
						/>
						<Text
							fontSize='14px'
							color={isCredentialOk ? 'green.500' : 'red.500'}
						>
							Credential is {isCredentialOk ? 'valid' : 'invalid'}
						</Text>
					</HStack>
				)}

				<Button colorScheme='brand' type='submit' w='full'>
					Save
				</Button>
				<VStack w='full' align='center' mt={2}>
					{/* <HStack spacing={1}>
            <Image src={InfoIcon} w="30px" h="30px" />
            <Text fontSize="14px">Get help</Text>
          </HStack> */}

					{/* <Spacer /> */}
					<HStack spacing={1}>
						<Image src={ResetIcon} w='30px' h='30px' />
						<Text fontSize='14px' onClick={resetSetting} cursor='pointer'>
							Reset settings
						</Text>
					</HStack>
				</VStack>
			</VStack>
		</form>
	);
};

export default AdvancedSettings;
