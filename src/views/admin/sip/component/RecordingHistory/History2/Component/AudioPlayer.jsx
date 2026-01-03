import { useEffect, useRef, useState, useCallback } from 'react';
import {
	Flex,
	IconButton,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Text,
	Button,
	Spinner,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaArrowDown } from 'react-icons/fa';
import { useCreateItemMutation } from 'api/apiSlice';
import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
import keys from 'config/keys';

const formatTime = (seconds) => {
	const safe = isNaN(seconds) || !isFinite(seconds) ? 0 : Math.max(0, seconds);
	const m = Math.floor(safe / 60);
	const s = Math.floor(safe % 60);
	return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const AudioPlayer = ({
	url,
	playerId,
	currentlyPlayingId,
	setCurrentlyPlayingId,
	id,
	call, // recording info
	billsec,
}) => {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [hasStartedLog, setHasStartedLog] = useState(false);
	const { hasPermission } = usePermissions();
	const { user } = useUserSession();
	const [createItemMutation] = useCreateItemMutation();

	const recordingId = call?.uniqueid || call?.recording;

	//  Log play in backend
	const handleLogPlay = useCallback(
		async (durationPlayed, totalDuration) => {
			try {
				await createItemMutation({
					path: `sipSetting/log/play`,
					body: {
						recordingId,
						durationPlayed,
						totalDuration,
						data: {
							callData: call,
						},
					},
				}).unwrap();
			} catch (err) {
				console.error('Failed to log play:', err);
			}
		},
		[createItemMutation, recordingId, call]
	);

	//  Setup audio on mount
	useEffect(() => {
		const audio = audioRef.current;
		if (audio && !audio.src) {
			// audio.src = url;
			audio.src = `${keys.sipApiUrl2}/file/${url}`;
			audio.load();
		}
	}, [url]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (currentlyPlayingId !== playerId) {
			audio.pause();
			setIsPlaying(false);
		}
	}, [currentlyPlayingId, playerId]);

	//  Audio event listeners
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onLoadedMetadata = () => {
			setDuration(audio.duration || 0);
			setLoading(false);
			if (audio.duration <= 0 || !isFinite(audio.duration)) {
				setError(true);
			}
		};

		const onTimeUpdate = () => setCurrentTime(audio.currentTime);

		const onEnded = async () => {
			setIsPlaying(false);
			setCurrentlyPlayingId(null);

			//  Log only when playback completes
			await handleLogPlay(audio.duration, audio.duration);

			// reset log flag so next full play logs again
			setHasStartedLog(false);
		};

		const onError = () => {
			setError(true);
			setLoading(false);
		};

		audio.addEventListener('loadedmetadata', onLoadedMetadata);
		audio.addEventListener('timeupdate', onTimeUpdate);
		audio.addEventListener('ended', onEnded);
		audio.addEventListener('error', onError);

		return () => {
			audio.pause();
			audio.removeEventListener('loadedmetadata', onLoadedMetadata);
			audio.removeEventListener('timeupdate', onTimeUpdate);
			audio.removeEventListener('ended', onEnded);
			audio.removeEventListener('error', onError);
		};
	}, [handleLogPlay, setCurrentlyPlayingId]);

	//  Pause other players if one is playing
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (!isPlaying && isPlaying === false) return;
		if (!isPlaying && currentlyPlayingId !== playerId) {
			audio.pause();
			audio.currentTime = 0;
			setIsPlaying(false);
		}
	}, [currentlyPlayingId]);

	//  Toggle play/pause with restricted logging
	const togglePlay = async () => {
		const audio = audioRef.current;
		if (!audio || error || duration <= 0) return;

		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
			setCurrentlyPlayingId(null);
		} else {
			setCurrentlyPlayingId(playerId);
			audio.playbackRate = playbackRate;

			try {
				await audio.play();
				setIsPlaying(true);
				setError(false);

				// Log only once per play session (first play)
				if (!hasStartedLog) {
					await handleLogPlay(0.01, audio.duration);
					setHasStartedLog(true);
				}
			} catch {
				setError(true);
				setIsPlaying(false);
			}
		}
	};

	//  Seek manually
	const handleSeek = (value) => {
		const audio = audioRef.current;
		if (audio && duration > 0) {
			audio.currentTime = value;
			setCurrentTime(value);
		}
	};

	//  Change playback speed
	const cyclePlaybackRate = () => {
		const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
		setPlaybackRate(nextRate);
		if (audioRef.current) audioRef.current.playbackRate = nextRate;
	};

	//  Reset log when URL changes
	useEffect(() => {
		setHasStartedLog(false);
	}, [url]);

	return (
		<Flex
			direction='column'
			bg='brand.200'
			p='12px'
			borderRadius='md'
			w='100%'
			maxW='800px'
			gap={3}
			color='white'
			position='relative'
		>
			{/* Download button */}
			{hasPermission('sip', 'download_recording') && (
				<IconButton
					as='a'
					href={`${keys.sipApiUrl2}/file/${url}`}
					download
					aria-label='Download Audio'
					icon={<FaArrowDown />}
					size='sm'
					variant='brand'
					colorScheme='whiteAlpha'
					position='absolute'
					bottom='5px'
					right='8px'
					_hover={{ bg: 'whiteAlpha.300' }}
					isDisabled={error || duration <= 0}
					onClick={async () => {
						try {
							await createItemMutation({
								path: '/sipSetting/log/download',
								body: {
									recordingId,
									data: call,
								},
							}).unwrap();
						} catch (error) {
							console.log(error);
						}
					}}
				/>
			)}
			<audio ref={audioRef} preload='metadata' />

			<Flex align='center' gap={4}>
				<IconButton
					onClick={togglePlay}
					aria-label='Play/Pause'
					icon={
						loading ? (
							<Spinner size='xs' color='white' />
						) : error ? (
							<FaPlay />
						) : isPlaying ? (
							<FaPause />
						) : (
							<FaPlay />
						)
					}
					size='sm'
					colorScheme='brand'
					isDisabled={error || duration <= 0}
				/>

				<Slider
					flex='1'
					value={currentTime}
					max={duration}
					min={0}
					step={1}
					onChange={handleSeek}
					colorScheme='brand'
				>
					<SliderTrack>
						<SliderFilledTrack />
					</SliderTrack>
					<SliderThumb boxSize={3} />
				</Slider>

				<Button
					size='sm'
					fontSize='13px'
					onClick={cyclePlaybackRate}
					bg='brand.500'
					_hover={{ bg: 'brand.400' }}
					color='white'
					borderRadius='full'
					minW='60px'
				>
					{playbackRate}x
				</Button>
			</Flex>

			<Flex justify='space-between' px={10}>
				<Text fontSize='xs' color='brand.500'>
					{formatTime(currentTime)}
				</Text>
				<Text fontSize='xs' color='brand.500'>
					{formatTime(billsec)}
				</Text>
			</Flex>
		</Flex>
	);
};

export default AudioPlayer;
