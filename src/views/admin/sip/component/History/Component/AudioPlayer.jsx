import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import {
  Box,
  Flex,
  IconButton,
  Text,
  Button,
  Spinner,
  Fade,
} from "@chakra-ui/react";
import { FaPlay, FaPause } from "react-icons/fa";
import CustomTooltip from "components/shared/CustomTooltip";
import { format } from "date-fns";

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const AudioPlayer = ({
  url,
  playerId,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  timestamp = new Date(),
}) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [shouldPlay, setShouldPlay] = useState(false);
  const isCurrentlyPlaying = currentlyPlayingId === playerId;

  const cyclePlaybackRate = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(nextRate);
    }
  };

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.pause();
        wavesurferRef.current.unAll();
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [url]);

  useEffect(() => {
    if (!isCurrentlyPlaying && isPlaying) {
      if (wavesurferRef.current) {
        wavesurferRef.current.pause();
        wavesurferRef.current.seekTo(0);
      }
      setIsPlaying(false);
    }
  }, [currentlyPlayingId]);

  const togglePlay = async () => {
    if (error || loading) return;

    if (isPlaying) {
      wavesurferRef.current?.pause();
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(playerId);
      if (!wavesurferRef.current) {
        setLoading(true);
        setError(null);
        setShouldPlay(true);
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to load audio");

          const blob = await response.blob();

          const audioContext = new AudioContext();
          const arrayBuffer = await blob.arrayBuffer();
          const decoded = await audioContext.decodeAudioData(arrayBuffer);
          await audioContext.close();

          if (!decoded.duration || decoded.duration === 0) {
            throw new Error("Audio duration is zero");
          }

          const wavesurfer = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#B0B3B8",
            progressColor: "#d99a36",
            cursorColor: "#d99a55",
            cursorWidth: 6,
            barWidth: 2,
            barRadius: 1,
            height: 8,
            responsive: true,
            normalize: true,
             backend: "MediaElement", 
            playbackRate,
            preservePitch: true,
          });

          wavesurferRef.current = wavesurfer;
          wavesurfer.load(url);

          wavesurfer.on("ready", () => {
            setDuration(wavesurfer.getDuration());
            setLoading(false);
            setError(null);
            wavesurfer.play();
            setIsPlaying(true);
          });

          wavesurfer.on("finish", () => {
            setIsPlaying(false);
            setCurrentlyPlayingId(null);
          });

          wavesurfer.on("error", (e) => {
            console.error("WaveSurfer error:", e);
            setError("WaveSurfer failed to load");
            setLoading(false);
          });
        } catch (err) {
          console.error("Audio load error:", err);
          setError("Unable to play audio");
          setLoading(false);
        }
      } else {
        wavesurferRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <Flex
      direction="column"
      bg="brand.100"
      p="12px 16px"
      borderRadius="20px"
      w="100%"
      maxW="1500px"
      gap={2}
    >
      <Flex align="center" gap={4}>
        <CustomTooltip
          label={error ? "No audio found" : ""}
          fontSize="sm"
          placement="top"
          hasArrow
        >
          <IconButton
            onClick={togglePlay}
            aria-label="Play/Pause"
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            size="sm"
            isDisabled={!!error || loading}
            bg="transparent"
            color="brand.500"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
          />
        </CustomTooltip>

        <Box flex="1" position="relative">
          <Box
            w="100%"
            position="relative"
            zIndex={1}
            cursor={error ? "not-allowed" : "pointer"}
          >
            {error ? (
              <Box h="2px" bg="#B0B3B8" borderRadius="2px" />
            ) : shouldPlay ? (
              <Box ref={waveformRef} h="7px" />
            ) : (
              <Box h="2px" bg="#B0B3B8" borderRadius="2px" />
            )}
          </Box>

          {loading && (
            <Fade in={loading}>
              <Flex
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                align="center"
                justify="center"
              >
                <Spinner color="brand.500" size="sm" />
              </Flex>
            </Fade>
          )}
        </Box>

        <Button
          size="sm"
          px={4}
          py={2}
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

      <Flex justify="space-between" px="44px">
        <Text fontSize="xs" color="brand.500">
          {formatTime(duration)}
        </Text>
        <Text fontSize="xs" color="brand.500">
          {format(timestamp, "h:mm a")}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AudioPlayer;
