import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Select,
	Box,
	Text,
	Stack,
	Menu,
	Spinner,
	Badge,
	Flex,
	IconButton,
	Icon,
	Progress,
	FormControl,
	FormLabel,
	MenuItem,
	MenuList,
	MenuButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { setAudioTranscription } from '../../../../../../../redux/sipSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon, CopyIcon, TimeIcon } from '@chakra-ui/icons';
import { FaAudioDescription, FaPlay } from 'react-icons/fa6';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { useModalColors } from 'hooks/useModalColors';

const TranscribeModal = ({ isOpen, onClose, data }) => {
	const colors = useModalColors();
	const [language, setLanguage] = useState('default');
	const [transcription, setTranscription] = useState(null);
	const [createTranscribe, { isLoading }] = useCreateItemMutation();

	const storedTranscriptions = useSelector((state) => state.sip.transcriptions);

	const dispatch = useDispatch();

	const user = JSON.parse(localStorage.getItem('user'));
	const { createUserLog } = useUserActivityLog();

	const handleGenerateTranscribe = async () => {
		try {
			const bodyData = {
				voiceId: data.uniqueid,
				file: data.recording,
				language: language,
			};

			const key = `${data.uniqueid}_${language}`;
			const cachedData = storedTranscriptions[key];

			if (cachedData && cachedData.language === language) {
				setTranscription(cachedData);
				toast.success('Transcription generated.');
				return;
			}

			const res = await createTranscribe({
				path: '/sipSetting/transcriptions',
				body: bodyData,
			}).unwrap();
			if (res?.doc?.segments?.length) {
				setTranscription(res?.doc);
				dispatch(
					setAudioTranscription({
						id: bodyData.voiceId,
						data: res?.doc,
					})
				);
				toast.success('Transcription generated.');
			} else {
				throw new Error('Empty transcription received');
			}
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Call_Logs',
				entityType: 'VoiceTranscription',
				entityId: res?.doc?._id,
				status: 'success',
				message: `"${user?.fullName}" generated transcription.`,
			});
		} catch (error) {
			toast.error('Failed to generate transcription.');
			const errorMsg =
				error?.data?.message ||
				'Failed to generate the transcription. Please try again.';
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Call_Logs',
				entityType: 'VoiceTranscription',
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const formatRecordingTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	};

	const renderSegments = () => {
		if (!transcription?.segments?.length) return null;

		return (
			<Box mt={4} maxH={{ base: '400px', md: '500px' }} p='2' overflowY='auto'>
				<Stack spacing={2}>
					{transcription.segments.map((seg, idx) => (
						<Flex
							key={idx}
							bg={colors.bgInput}
							rounded='md'
							p='2'
							gap={3}
							align='center'
							border="1px solid"
							borderColor={colors.borderColor}
						>
							<Flex
								direction='row'
								gap='2'
								color={colors.accentGold}
								align='center'
								p={2}
								rounded='md'
								flexShrink={0}
							>
								<Icon as={FaPlay} boxSize={4} />
								<Text fontSize='xs' mt={1} color={colors.bodyText}>
									{formatRecordingTime(seg.start)}
								</Text>
							</Flex>

							<Box
								flex={1}
								borderBottom={
									idx < transcription.segments.length - 1 ? '1px solid' : 'none'
								}
								borderColor={colors.borderColor}
							>
								<Text fontSize='md' lineHeight='tall' color={colors.bodyText}>
									{seg.text}
								</Text>
							</Box>
						</Flex>
					))}
				</Stack>
			</Box>
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='4xl'
			blockScrollOnMount={false}
			isCentered
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				borderRadius={{ base: 'none', md: 'xl' }}
				boxShadow={colors.modalShadow}
				m='2'
				bg={colors.bg}
				border="1px solid"
				borderColor={colors.borderColor}
			>
				<ModalHeader
					bg={colors.headerBg}
					color={colors.headerText}
					borderTopRadius='xl'
					py={3}
					fontSize='md'
					fontWeight='bold'
					borderBottom="1px solid"
					borderColor={colors.borderColor}
				>
					Audio Transcription
				</ModalHeader>
				<ModalCloseButton color={colors.headerText} _hover={{ bg: colors.closeBtnHoverBg }} />

				<ModalBody p={{ base: 4, md: 8 }} bg={colors.bg}>
					<Box mb={6} mx='auto' maxWidth={{ base: 'full', md: '500px' }}>
						<Text fontSize='sm' color={colors.mutedText} mb={2}>
							Select language and generate transcription
						</Text>

						<Flex
							direction={{ base: 'column', md: 'row' }}
							align='center'
							gap={4}
						>
							<Menu>
								<MenuButton
									as={Button}
									isDisabled={isLoading}
									rightIcon={<ChevronDownIcon />}
									variant='outline'
									borderColor={colors.borderColor}
									bg={colors.bgInput}
									color={colors.headingText}
									_focus={{ borderColor: colors.accentGold, outline: 'none' }}
									_hover={{ borderColor: colors.accentGold }}
									onClick={(e) => e.stopPropagation()}
									w={{ base: 'full', md: '300px' }}
									size='sm'
								>
									<Flex align='center'>
										{language === 'default' && 'Auto-detect (Native)'}
										{language === 'en' && 'English'}
										{language === 'ar' && 'Arabic'}
									</Flex>
								</MenuButton>
								<MenuList
									onClick={(e) => e.stopPropagation()}
									zIndex='modal'
									bg={colors.bg}
									borderColor={colors.borderColor}
								>
									<MenuItem
										onClick={(e) => {
											e.preventDefault();
											setLanguage('default');
										}}
										bg={language === 'default' ? colors.bgDeep : 'transparent'}
										fontWeight={language === 'default' ? 'bold' : 'normal'}
										color={colors.bodyText}
										_hover={{ bg: colors.bgDeep, color: colors.accentGold }}
									>
										Auto-detect (Native)
									</MenuItem>
									<MenuItem
										onClick={(e) => {
											e.preventDefault();
											setLanguage('en');
										}}
										bg={language === 'en' ? colors.bgDeep : 'transparent'}
										fontWeight={language === 'en' ? 'bold' : 'normal'}
										color={colors.bodyText}
										_hover={{ bg: colors.bgDeep, color: colors.accentGold }}
									>
										English
									</MenuItem>
									<MenuItem
										onClick={(e) => {
											e.preventDefault();
											setLanguage('ar');
										}}
										bg={language === 'ar' ? colors.bgDeep : 'transparent'}
										fontWeight={language === 'ar' ? 'bold' : 'normal'}
										color={colors.bodyText}
										_hover={{ bg: colors.bgDeep, color: colors.accentGold }}
									>
										Arabic
									</MenuItem>
								</MenuList>
							</Menu>
							<Button
								onClick={handleGenerateTranscribe}
								variant='brand'
								isDisabled={isLoading}
								size='md'
								px={6}
								flexShrink={0}
							>
								Generate
							</Button>
						</Flex>
					</Box>

					{isLoading && (
						<Box textAlign='center' py={10}>
							<Spinner size='xl' thickness='3px' color={colors.accentGold} />
							<Text mt={4} fontSize='md' color={colors.bodyText}>
								Processing audio content...
							</Text>
							<Progress
								mt={4}
								size='xs'
								isIndeterminate
								colorScheme='yellow'
								maxW='400px'
								mx='auto'
							/>
						</Box>
					)}

					{!isLoading && transcription && (
						<>
							{renderSegments()}
						</>
					)}
				</ModalBody>

				<ModalFooter
					bg={colors.footerBg}
					borderTop="1px solid"
					borderColor={colors.borderColor}
				>
					<Button onClick={onClose} variant='ghost'>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default TranscribeModal;