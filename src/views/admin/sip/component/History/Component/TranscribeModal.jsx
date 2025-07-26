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
	Spinner,
	Badge,
	Flex,
	IconButton,
	Icon,
	Progress,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { setAudioTranscription } from '../../../../../../redux/sipSlice';
import { useDispatch, useSelector } from 'react-redux';
import { CopyIcon, TimeIcon } from '@chakra-ui/icons';
import { FaAudioDescription, FaPlay } from 'react-icons/fa6';

const TranscribeModal = ({ isOpen, onClose, data }) => {
	const [language, setLanguage] = useState('default');
	const [transcription, setTranscription] = useState(null);
	const [createTranscribe, { isLoading }] = useCreateItemMutation();

	const storedTranscriptions = useSelector((state) => state.sip.transcriptions);

	const dispatch = useDispatch();

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
		} catch (error) {
			toast.error('Failed to generate transcription.');
		}
	};

	const formatRecordingTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	};

	// const renderSegments = () => {
	// 	if (!transcription?.segments?.length) return null;

	// 	return (
	// 		<Box mt={6} maxH={{ base: '400px', md: '500px' }} overflowY='auto' pr={2}>
	// 			<Stack spacing={3} mt={3}>
	// 				{transcription.segments.map((seg, idx) => (
	// 					<Box
	// 						key={idx}
	// 						bg={idx % 2 === 0 ? 'white' : 'gray.50'}
	// 						p={4}
	// 						rounded='lg'
	// 						borderLeft='4px solid'
	// 						borderColor='blue.300'
	// 						transition='all 0.2s'
	// 						_hover={{
	// 							shadow: 'md',
	// 							transform: 'translateY(-1px)',
	// 						}}
	// 					>
	// 						<Flex align='center' mb={2} flexWrap='wrap' gap={2}>
	// 							<Badge
	// 								colorScheme='blue'
	// 								variant='subtle'
	// 								fontSize='xs'
	// 								px={2}
	// 								py={1}
	// 							>
	// 								{formatTime(seg.start)} → {formatTime(seg.end)}
	// 							</Badge>
	// 							{/* <Badge
	// 								colorScheme='green'
	// 								variant='subtle'
	// 								fontSize='xs'
	// 								px={2}
	// 								py={1}
	// 							>
	// 								Duration: {(seg.end - seg.start).toFixed(2)}s
	// 							</Badge> */}
	// 						</Flex>
	// 						<Text fontSize='md' lineHeight='tall'>
	// 							{seg.text}
	// 						</Text>
	// 						{/* <Flex justify='flex-end' mt={2}>
	// 							<IconButton
	// 								aria-label='Copy segment'
	// 								icon={<CopyIcon />}
	// 								size='sm'
	// 								variant='ghost'
	// 								onClick={() => navigator.clipboard.writeText(seg.text)}
	// 							/>
	// 						</Flex> */}
	// 					</Box>
	// 				))}
	// 			</Stack>
	// 		</Box>
	// 	);
	// };

	const renderSegments = () => {
		if (!transcription?.segments?.length) return null;

		return (
			<Box mt={4} maxH={{ base: '400px', md: '500px' }} p='2' overflowY='auto'>
				<Stack spacing={2}>
					{transcription.segments.map((seg, idx) => (
						<Flex
							key={idx}
							bg='gray.100'
							rounded='md'
							p='2'
							gap={3}
							align='center'
						>
							<Flex
								direction='row'
								gap='2'
								color='gray.500'
								align='center'
								p={2}
								rounded='md'
								flexShrink={0}
							>
								<Icon as={FaPlay} boxSize={4} />
								<Text fontSize='xs' mt={1}>
									{formatRecordingTime(seg.start)}
								</Text>
							</Flex>

							<Box
								flex={1}
								borderBottom={
									idx < transcription.segments.length - 1 ? '1px solid' : 'none'
								}
								borderColor='gray.100'
							>
								<Text fontSize='md' lineHeight='tall'>
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
		<Modal isOpen={isOpen} onClose={onClose} size='4xl' isCentered>
			<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />
			<ModalContent
				borderRadius={{ base: 'none', md: 'xl' }}
				boxShadow={{ base: 'none', md: '2xl' }}
				m='2'
			>
				<ModalHeader
					bg='brand.50'
					borderTopRadius='xl'
					py={3}
					fontSize='md'
					fontWeight='bold'
					color='brand.700'
				>
					Audio Transcription
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody p={{ base: 4, md: 8 }}>
					<Box mb={6} mx='auto' maxWidth={{ base: 'full', md: '500px' }}>
						<Text fontSize='sm' color='gray.500' mb={2}>
							Select language and generate transcription
						</Text>

						<Flex direction={{ base: 'column', md: 'row' }} gap={4}>
							<FormControl maxW={{ base: 'full', md: '300px' }} size='sm'>
								<Select
									value={language}
									onChange={(e) => setLanguage(e.target.value)}
									variant='outline'
									_focus={{ borderColor: 'brand.500' }}
								>
									<option value='default'>Auto-detect (Native)</option>
									<option value='en'>English</option>
									<option value='ar'>Arabic</option>
								</Select>
							</FormControl>

							<Button
								onClick={handleGenerateTranscribe}
								colorScheme='brand'
								// isLoading={isLoading}
								// loadingText='Transcribing...'
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
							<Spinner size='xl' thickness='3px' color='brand.500' />
							<Text mt={4} fontSize='md' color='gray.600'>
								Processing audio content...
							</Text>
							<Progress
								mt={4}
								size='xs'
								isIndeterminate
								colorScheme='brand'
								maxW='400px'
								mx='auto'
							/>
						</Box>
					)}

					{!isLoading && transcription && (
						<>
							{/* <Box
								bg='blue.50'
								p={4}
								rounded='md'
								border='1px solid'
								borderColor='blue.100'
								mb={6}
							>
								<Flex justify='space-between' align='center'>
									<Box>
										<Text fontWeight='medium'>Transcription Summary</Text>
										<Text fontSize='sm' color='gray.600'>
											{transcription.segments.length} segments •{' '}
											{transcription.segments.reduce(
												(acc, seg) => acc + seg.text.length,
												0
											)}{' '}
											characters
										</Text>
									</Box>
									<Button
										size='sm'
										variant='outline'
										colorScheme='blue'
										onClick={() =>
											navigator.clipboard.writeText(transcription.text)
										}
									>
										Copy Full Text
									</Button>
								</Flex>
							</Box> */}

							{renderSegments()}
						</>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
	// const renderSegments = () => {
	// 	if (!transcription?.segments?.length) return null;

	// 	return (
	// 		<Stack spacing={3} mt={4} maxH='300px' overflowY='auto'>
	// 			{transcription.segments.map((seg, idx) => (
	// 				<Box
	// 					key={idx}
	// 					bg='gray.50'
	// 					p={3}
	// 					rounded='md'
	// 					shadow='sm'
	// 					border='1px solid'
	// 					borderColor='gray.100'
	// 				>
	// 					<Text fontSize='sm' color='gray.600'>
	// 						⏱ {seg.start.toFixed(2)}s → {seg.end.toFixed(2)}s
	// 					</Text>
	// 					<Text fontWeight='medium' mt={1}>
	// 						{seg.text}
	// 					</Text>
	// 				</Box>
	// 			))}
	// 		</Stack>
	// 	);
	// };

	// return (
	// 	<Modal isOpen={isOpen} onClose={onClose} size='6xl' isCentered>
	// 		<ModalOverlay backdropFilter='blur(2px)' />
	// 		<ModalContent borderRadius='xl' boxShadow='xl' m='2'>
	// 			<ModalHeader
	// 				bg='brand.50'
	// 				borderTopRadius='xl'
	// 				py={3}
	// 				fontSize='md'
	// 				fontWeight='bold'
	// 				color='brand.700'
	// 			>
	// 				Transcribe Audio
	// 			</ModalHeader>
	// 			<ModalCloseButton />
	// 			<ModalBody>
	// 				<Select
	// 					value={language}
	// 					onChange={(e) => setLanguage(e.target.value)}
	// 					maxW='250px'
	// 					mt={2}
	// 				>
	// 					<option value='default'>Native</option>
	// 					<option value='en'>English</option>
	// 					<option value='ar'>Arabic</option>
	// 				</Select>

	// 				<Button
	// 					onClick={handleGenerateTranscribe}
	// 					mt={4}
	// 					colorScheme='blue'
	// 					isLoading={isLoading}
	// 					loadingText='Transcribing...'
	// 				>
	// 					Generate Transcription
	// 				</Button>

	// 				{isLoading && (
	// 					<Box mt={6} textAlign='center'>
	// 						<Spinner size='lg' />
	// 						<Text mt={2} fontSize='sm' color='gray.500'>
	// 							Processing audio...
	// 						</Text>
	// 					</Box>
	// 				)}

	// 				{transcription && renderSegments()}
	// 			</ModalBody>

	// 			<ModalFooter>
	// 				<Button onClick={onClose} variant='ghost'>
	// 					Close
	// 				</Button>
	// 			</ModalFooter>
	// 		</ModalContent>
	// 	</Modal>
	// );
};

export default TranscribeModal;
