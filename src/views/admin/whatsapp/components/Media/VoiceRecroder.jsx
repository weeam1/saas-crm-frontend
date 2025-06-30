import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
	Box,
	HStack,
	IconButton,
	Text,
	Button,
	useColorModeValue,
} from '@chakra-ui/react';
import {
	FaTrash,
	FaMicrophone,
	FaPaperPlane,
	FaVolumeUp,
	FaStop,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const VoiceRecorder = ({ onSend, isRecording, setIsRecording }) => {
	const [recorded, setRecorded] = useState(false);
	const [mediaRecorder, setMediaRecorder] = useState(null);
	const [audioURL, setAudioURL] = useState('');
	const [audioBlob, setAudioBlob] = useState(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [waveform, setWaveform] = useState(new Array(20).fill(1));

	const audioRef = useRef(null);
	const intervalRef = useRef(null);
	const waveformRef = useRef(null);

	const bg = useColorModeValue('gray.100', 'gray.700');

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			const chunks = [];

			recorder.ondataavailable = (e) => {
				chunks.push(e.data);
			};

			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: 'audio/webm' });
				const url = URL.createObjectURL(blob);
				setAudioURL(url);
				setAudioBlob(blob);
				setRecorded(true);
				clearInterval(intervalRef.current);
			};

			recorder.start();
			setMediaRecorder(recorder);
			setIsRecording(true);
			setElapsedTime(0);

			intervalRef.current = setInterval(() => {
				setElapsedTime((prev) => prev + 1);
				setWaveform(
					Array.from({ length: 20 }, () => Math.floor(Math.random() * 8 + 1))
				);
			}, 300);
		} catch (err) {
			toast.error('Microphone access denied');
			setIsRecording(false);
		}
	};

	const stopRecording = useCallback(() => {
		mediaRecorder?.stop();
		// setIsRecording(false);
	}, []);

	useEffect(() => {
		if (isRecording) {
			startRecording();
		} else {
			stopRecording();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRecording]);

	const resetRecording = () => {
		setRecorded(false);
		setAudioURL('');
		setAudioBlob(null);
		setElapsedTime(0);
		setWaveform(new Array(20).fill(1));
		clearInterval(intervalRef.current);
		setIsRecording(false);
	};

	const handleSend = () => {
		if (onSend && audioBlob) {
			onSend(audioBlob);
			setIsRecording(false);
			toast.success('Voice message sent');
			resetRecording();
		}
	};

	const renderWaveform = () => (
		<HStack ref={waveformRef} spacing='2px' align='end' h='20px' flex='1'>
			{waveform.map((height, idx) => (
				<Box
					key={idx}
					w='2px'
					bg='gray.600'
					h={`${height * 2}px`}
					borderRadius='full'
					transition='height 0.2s'
				/>
			))}
		</HStack>
	);

	const formatTime = (s) => `0:${s.toString().padStart(2, '0')}`;

	return (
		<Box
			bg={bg}
			px={4}
			py={2}
			borderRadius='md'
			border='1px solid'
			borderColor='gray.300'
			display='flex'
			alignItems='center'
			gap={3}
			w='100%'
			maxW='500px'
		>
			{!isRecording && !recorded && (
				<Button
					size='sm'
					colorScheme='teal'
					onClick={startRecording}
					leftIcon={<FaMicrophone />}
				>
					Record
				</Button>
			)}

			{isRecording && (
				<>
					<IconButton
						icon={<FaTrash />}
						onClick={resetRecording}
						size='sm'
						aria-label='Delete'
					/>
					<Text fontSize='sm' color='red.500'>
						● {formatTime(elapsedTime)}
					</Text>
					{renderWaveform()}
					<IconButton
						icon={<FaStop />}
						onClick={stopRecording}
						size='sm'
						colorScheme='red'
						aria-label='Stop'
					/>
				</>
			)}

			{recorded && !isRecording && (
				<>
					<IconButton
						icon={<FaTrash />}
						onClick={resetRecording}
						size='sm'
						aria-label='Delete'
					/>
					<Text fontSize='sm'>{formatTime(elapsedTime)}</Text>
					{renderWaveform()}
					<IconButton
						icon={<FaVolumeUp />}
						onClick={() => audioRef.current?.play()}
						size='sm'
						aria-label='Play'
					/>
					<IconButton
						icon={<FaPaperPlane />}
						onClick={handleSend}
						size='sm'
						colorScheme='teal'
						aria-label='Send'
					/>
					<audio ref={audioRef} src={audioURL} hidden />
				</>
			)}
		</Box>
	);
};

export default VoiceRecorder;
