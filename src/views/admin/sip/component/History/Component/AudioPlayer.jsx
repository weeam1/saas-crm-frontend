import { useEffect, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaArrowDown } from "react-icons/fa";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const formatTime = (seconds) => {
  const safe = isNaN(seconds) || !isFinite(seconds) ? 0 : Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const AudioPlayer = ({
  url,
  playerId,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  id,
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const isCurrent = currentlyPlayingId === playerId;
  const isDisabled = error || duration <= 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && !audio.src) {
      audio.src = url;
      audio.load();
    }
  }, [url]);

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

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    };

    const onError = () => {
      setError(true);
      setLoading(false);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isCurrent && isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentlyPlayingId]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || isDisabled) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(playerId);
      audio.playbackRate = playbackRate;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setError(false);
        })
        .catch(() => {
          setError(true);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    if (audio && !isDisabled) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  };

  const cyclePlaybackRate = () => {
    if (isDisabled) return;
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  return (
    <Flex
      direction="column"
      bg="brand.200"
      p="12px"
      borderRadius="md"
      w="100%"
      maxW="800px"
      gap={3}
      color="white"
      position="relative"
    >
      {/* Download Button Top-Right */}
      <IconButton
        as="a"
        href={url}
        download
        aria-label="Download Audio"
        icon={<FaArrowDown />}
        size="sm"
        variant="brand"
        colorScheme="whiteAlpha"
        position="absolute"
        bottom="5px"
        right="8px"
        _hover={{ bg: "whiteAlpha.300" }}
        isDisabled={isDisabled}
        onClick={() => {
          createUserLog({
            userId: user?._id,
            action: "DOWNLOAD",
            entity: "Call_Logs",
            status: "success",
            message: `"${user?.fullName}" download the audio .`,
          });
        }}
      />

      <audio ref={audioRef} preload="metadata" />

      <Flex align="center" gap={4}>
        <IconButton
          onClick={togglePlay}
          aria-label="Play/Pause"
          icon={
            loading ? (
              <Spinner size="xs" color="white" />
            ) : error || duration <= 0 ? (
              <FaPlay />
            ) : isPlaying ? (
              <FaPause />
            ) : (
              <FaPlay />
            )
          }
          size="sm"
          colorScheme={"brand"}
          isDisabled={isDisabled}
        />

        <Slider
          flex="1"
          value={currentTime}
          max={duration}
          min={0}
          step={1}
          onChange={handleSeek}
          isDisabled={loading}
          colorScheme="brand"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={3} />
        </Slider>

        <Button
          size="sm"
          fontSize="13px"
          onClick={cyclePlaybackRate}
          bg="brand.500"
          _hover={{ bg: "brand.400" }}
          color="white"
          borderRadius="full"
          minW="60px"
        >
          {playbackRate}x
        </Button>
      </Flex>

      <Flex justify="space-between" px={10}>
        <Text fontSize="xs" color="brand.500">
          {formatTime(currentTime)}
        </Text>
        <Text fontSize="xs" color="brand.500">
          {formatTime(duration)}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AudioPlayer;
