import {
	HStack,
	IconButton,
	Spacer,
	Text,
	Icon,
	Tooltip,
	VStack,
} from '@chakra-ui/react';

import {
	FaArrowRightFromBracket,
	FaArrowRightToBracket,
	FaPhone,
	FaTrash,
} from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';

import { useState } from 'react';

import dayjs from 'dayjs';
import { getSettings, isSaveCallHistory } from 'storage';
import { formatPhoneNumber } from 'utils/webrtc';

export const CallHistoryItem = ({
	call,
	onDataChange,
	onCallNumber,
	isSaved,
}) => {
	const [callEnable, setCallEnable] = useState(false);
	const getDirectionIcon = (direction) => {
		if (direction === 'outgoing') {
			return FaArrowRightFromBracket;
		} else if (direction === 'incoming') {
			return FaArrowRightToBracket;
		} else {
			return FaPhone;
		}
	};

	return (
		<HStack
			spacing={5}
			borderBottomWidth='1px'
			borderBottomColor='gray.200'
			p={2}
			onMouseEnter={() => setCallEnable(true)}
			onMouseLeave={() => setCallEnable(false)}
		>
			{callEnable ? (
				<Tooltip label='Call'>
					<IconButton
						aria-label='call recents'
						icon={<FaPhone />}
						onClick={() => {
							if (onCallNumber) {
								onCallNumber(call.number, call.name);
							}
						}}
						variant='unstyled'
						size='sm'
						color='green.500'
					/>
				</Tooltip>
			) : (
				<Icon
					as={getDirectionIcon(call.direction)}
					width='20px'
					height='20px'
				/>
			)}

			<VStack align='start'>
				<Text fontSize='12px' fontWeight='500'>
					{call.name || formatPhoneNumber(call.number)}
				</Text>
				<Text fontSize='10px'>{call.duration}</Text>
			</VStack>

			<Spacer />
			<VStack align='start'>
				<Text fontSize='11px'>
					{dayjs(call.timeStamp).format('MMM D, hh:mm A')}
				</Text>
			</VStack>
			<Tooltip label={isSaved && call.isSaved ? 'Delete' : 'Save'}>
				<IconButton
					aria-label='save recents'
					icon={isSaved && call.isSaved ? <FaTrash /> : <FiSave />}
					onClick={() => {
						if (!isSaved && call.isSaved) {
							return;
						}
						const settings = getSettings();
						const activeSettings = settings.find((el) => el.active);
						if (activeSettings?.decoded.sipUsername) {
							isSaveCallHistory(
								activeSettings?.decoded.sipUsername,
								call.callSid,
								!call.isSaved
							);
							if (onDataChange) {
								onDataChange(call);
							}
						}
					}}
					variant='unstyled'
					size='sm'
					color={call.isSaved ? 'greenish.500' : ''}
				/>
			</Tooltip>
		</HStack>
	);
};

export default CallHistoryItem;
