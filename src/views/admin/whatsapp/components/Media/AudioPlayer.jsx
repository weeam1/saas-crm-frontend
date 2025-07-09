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
	}, [isPlaying, dispatch]);

	// useEffect(() => {
	// 	const audio = audioRef.current;
	// 	if (isPlaying) {
	// 		audio.play().catch((error) => console.error('Play error:', error));
	// 		audioInstances.clear();
	// 		audioInstances.set(id, audioRef);
	// 	} else {
	// 		audio.pause();
	// 		// Remove from instances map
	// 		audioInstances.clear();
	// 	}

	// 	// Cleanup to pause audio when isPlaying changes or component unmounts
	// 	return () => {
	// 		audio.pause();
	// 		audioInstances.clear();
	// 	};
	// }, [id, isPlaying]);

	// const handlePlayPause = () => {
	// 	onPlayPause(isPlaying ? null : id);
	// };

	const handlePlayPause = () => {
		if (isPlaying) {
			dispatch(setCurrentAudio(null)); // pause
		} else {
			dispatch(setCurrentAudio(id)); // play this audio
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
				<Flex alignItems='center' gap={4}>
					<IconButton
						bg='transparent'
						border='none'
						outline='none'
						boxShadow='none'
						_hover={{ bg: 'transparent', boxShadow: 'none' }}
						_focus={{ boxShadow: 'none', outline: 'none' }}
						_active={{
							bg: 'transparent',
							boxShadow: 'none',
							outline: 'none',
							border: 'none',
						}}
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
								<SliderFilledTrack />
							</SliderTrack>
							<SliderThumb />
						</Slider>

						<Flex justifyContent='space-between'>
							<Text fontSize='sm'>{formatTime(currentTime)}</Text>
							<Text fontSize='sm'>{formatTime(duration)}</Text>
						</Flex>
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
};

export default AudioPlayer;
