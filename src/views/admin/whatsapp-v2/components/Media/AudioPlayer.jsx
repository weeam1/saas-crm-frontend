import React, { useState, useRef, useEffect } from 'react';
import {
	Box,
	IconButton,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Text,
	Flex,
} from '@chakra-ui/react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FiMusic } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAudio } from '../../../../../redux/whatsappSlice';

const formatTime = (seconds) => {
	if (!seconds) return '0:00';
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioPlayer = ({ id, audioSrc, onPlayPause }) => {
	const audioRef = useRef(null);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	const currentAudioId = useSelector(
		(state) => state.whatsapp.currentAudioId || null
	);

	const dispatch = useDispatch();

	const audio = audioRef.current;
	const isPlaying = currentAudioId === id;

	useEffect(() => {
		if (!audio) return;

		audio.src = audioSrc;
		audio.load();

		const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
		const handleLoadedMetadata = () => setDuration(audio.duration);
		const handleEnded = () => dispatch(setCurrentAudio(null));

		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.pause();
			audio.src = '';
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('ended', handleEnded);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioSrc, dispatch]);

	useEffect(() => {
		if (!audio) return;

		if (isPlaying) {
			audio.play().catch((error) => {
				console.error('Play error:', error);
				dispatch(setCurrentAudio(null));
			});
		} else {
			audio.pause();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPlaying, dispatch]);

	const handlePlayPause = () => {
		if (isPlaying) {
			dispatch(setCurrentAudio(null));
		} else {
			dispatch(setCurrentAudio(id));
		}
	};

	const handleTimeUpdate = () => {
		setCurrentTime(audioRef.current.currentTime);
	};

	const handleLoadedMetadata = () => {
		setDuration(audioRef.current.duration);
	};

	const handleSeek = (value) => {
		audioRef.current.currentTime = value;
		setCurrentTime(value);
	};

	return (
		<Box width={{ base: '220px', md: '250px', lg: '350px' }}>
			<audio
				ref={audioRef}
				src={audioSrc}
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				onEnded={() => dispatch(setCurrentAudio(null))}
			/>

			<Flex direction='column' gap={3}>
				{/* Play/Pause and Progress */}
				<Flex justify='flex-start' gap={4}>
					<IconButton
						bg='transparent'
						border='none'
						outline='none'
						boxShadow='none'
						_hover={{ bg: 'transparent', boxShadow: 'none' }}
						_focus={{ boxShadow: 'none', outline: 'none', border: 'none' }}
						_active={{
							bg: 'transparent',
							boxShadow: 'none',
							outline: 'none',
							border: 'none',
						}}
						h='fit-content'
						color='brand.400'
						p='4px'
						icon={isPlaying ? <FaPause /> : <FaPlay />}
						onClick={handlePlayPause}
						aria-label={isPlaying ? 'Pause' : 'Play'}
					/>

					<Box flex={1}>
						<Slider
							value={currentTime}
							max={duration}
							onChange={handleSeek}
							focusThumbOnChange={false}
						>
							<SliderTrack>
								<SliderFilledTrack bg='brand.400' />
							</SliderTrack>
							<SliderThumb />
						</Slider>

						<Flex justifyContent='space-between'>
							<Text fontSize='xs'>{formatTime(currentTime)}</Text>
							<Text fontSize='xs'>{formatTime(duration)}</Text>
						</Flex>
					</Box>
					{/* Music Icon at End */}
					<Flex
						justifyContent='center'
						alignItems='center'
						bg='brand.400'
						w='10'
						h='10'
						p='2'
						borderRadius='full'
						boxShadow='md'
					>
						<FiMusic color='white' size={16} />
					</Flex>
				</Flex>
			</Flex>
		</Box>
	);
};

export default AudioPlayer;
