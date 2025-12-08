import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import { updateConferenceParticipantAction } from 'api/webrtc';
import OutlineBox from 'components/outline-box';
import { SipConstants } from 'lib/webrtc';
import {
	deleteConferenceSettings,
	getConferenceSettings,
	saveConferenceSettings,
} from 'storage';
import { toast } from 'react-toastify';

const JoinConference = ({
	conferenceId,
	callSid,
	callDuration,
	callStatus,
	handleCancel,
	call,
}) => {
	const [conferenceName, setConferenceName] = useState(conferenceId || '');
	const [appTitle, setAppTitle] = useState(
		conferenceId ? 'Joining Conference' : 'Start Conference'
	);
	const [submitTitle, setSubmitTitle] = useState(
		conferenceId ? 'Joining Conference' : 'Start Conference'
	);

	const [cancelTitle, setCancelTitle] = useState('Cancel');
	const [isLoading, setIsLoading] = useState(false);
	const confSettings = getConferenceSettings();
	const [speakOnlyTo, setSpeakOnlyTo] = useState(
		confSettings.speakOnlyTo || ''
	);
	const [tags, setTags] = useState(confSettings.tags || '');
	const [mode, setMode] = useState(confSettings.mode || 'full_participant');
	const [participantState, setParticipantState] = useState('Join as');

	const configureConferenceSession = async () => {
		const confSettings = getConferenceSettings();
		if (callSid) {
			if (confSettings.mode) {
				updateConferenceParticipantAction(callSid, {
					action: confSettings.mode === 'muted' ? 'mute' : 'unmute',
					tag: '',
				})
					.then(() => {
						updateConferenceParticipantAction(callSid, {
							action: mode === 'coach' ? 'coach' : 'uncoach',
							tag: confSettings.speakOnlyTo,
						}).catch((error) => {
							toast.error(error?.msg || 'Something went wrong');
						});
					})
					.catch((error) => {
						toast.error(error?.msg || 'Something went wrong');
					});
			}

			if (confSettings.tags) {
				updateConferenceParticipantAction(callSid, {
					action: tags ? 'tag' : 'untag',
					tag: tags,
				}).catch((error) => {
					toast.error(error?.msg || 'Something went wrong');
				});
			}
		}
	};

	useEffect(() => {
		switch (callStatus) {
			case SipConstants.SESSION_ANSWERED:
				setAppTitle('Conference');
				setSubmitTitle('Update');
				setCancelTitle('Hangup');
				setParticipantState('Participant state');
				setIsLoading(false);
				configureConferenceSession();
				break;
			case SipConstants.SESSION_ENDED:
			case SipConstants.SESSION_FAILED:
				setIsLoading(false);
				deleteConferenceSettings();
				break;
		}
	}, [callStatus]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (callStatus !== SipConstants.SESSION_ANSWERED) {
			call(conferenceName);
			if (!callSid) {
				setIsLoading(true);
			}
		} else {
			configureConferenceSession();
		}
	};

	return (
		<Box as='form' onSubmit={handleSubmit} w='full'>
			<VStack spacing={4} mt='20px' w='full'>
				<Text fontWeight='bold' fontSize='lg'>
					{appTitle}
				</Text>
				{callDuration > 0 && (
					<Text fontSize='15px'>
						{new Date(callDuration * 1000).toISOString().substr(11, 8)}
					</Text>
				)}
				<FormControl id='conference_name'>
					<FormLabel>Conference name</FormLabel>
					<Input
						type='text'
						placeholder='Name'
						isRequired
						value={conferenceName}
						onChange={(e) => setConferenceName(e.target.value)}
						disabled={!!conferenceId}
					/>
				</FormControl>

				<OutlineBox title={participantState}>
					<RadioGroup
						onChange={(e) => {
							setMode(e);
							saveConferenceSettings({
								mode: e,
								speakOnlyTo,
								tags,
							});
						}}
						value={mode}
						colorScheme='brand'
					>
						<VStack align='start'>
							<Radio value='full_participant' variant=''>
								Full participant
							</Radio>
							<Radio value='muted'>Muted</Radio>
							<Radio value='coach'>Coach mode</Radio>
						</VStack>
					</RadioGroup>

					<FormControl id='speak_only_to'>
						<FormLabel>Speak only to</FormLabel>
						<Input
							type='text'
							placeholder='tag'
							value={speakOnlyTo}
							onChange={(e) => {
								setSpeakOnlyTo(e.target.value);
								saveConferenceSettings({
									mode,
									speakOnlyTo: e.target.value,
									tags,
								});
							}}
							disabled={mode !== 'coach'}
							required={mode === 'coach'}
						/>
					</FormControl>

					<FormControl id='tag'>
						<FormLabel>Tag</FormLabel>
						<Input
							type='text'
							placeholder='tag'
							value={tags}
							onChange={(e) => {
								setTags(e.target.value);
								saveConferenceSettings({
									mode,
									speakOnlyTo,
									tags: e.target.value,
								});
							}}
						/>
					</FormControl>
				</OutlineBox>
				<HStack w='full'>
					<Button
						colorScheme='brand'
						type='submit'
						w='full'
						isLoading={isLoading}
					>
						{submitTitle}
					</Button>

					<Button
						colorScheme='grey'
						type='button'
						w='full'
						textColor='black'
						onClick={() => {
							deleteConferenceSettings();
							handleCancel();
						}}
					>
						{cancelTitle}
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};

export default JoinConference;
