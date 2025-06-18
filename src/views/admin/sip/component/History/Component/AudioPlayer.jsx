import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { FaPlay, FaPause } from "react-icons/fa";
import CustomTooltip from "components/shared/CustomTooltip";

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const AudioPlayer = ({
  url,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  playerId,
}) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(null);

  const isCurrentlyPlaying = currentlyPlayingId === playerId;

  const validateAudio = async (audioUrl) => {
    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      await audioContext.decodeAudioData(arrayBuffer);
      audioContext.close();
      return true;
    } catch (err) {
      console.error("Audio validation failed:", err);
      return false;
    }
  };

  useEffect(() => {
    let wavesurfer;

    (async () => {
      if (!url || !waveformRef.current) return;

      const isValid = await validateAudio(url);
      if (!isValid) {
        setError("No audio available");
        return;
      }

      wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#CBD5E0",
        progressColor: "#000",
        cursorColor: "transparent",
        barWidth: 2,
        barRadius: 2,
        height: 80,
        responsive: true,
        backend: "WebAudio",
      });

      wavesurferRef.current = wavesurfer;

      wavesurfer.load(url);

      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration());
        setError(null);
      });

      wavesurfer.on("audioprocess", () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      });

      wavesurfer.on("seek", () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      });

      wavesurfer.on("finish", () => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      });

      wavesurfer.on("error", (err) => {
        console.error("WaveSurfer error:", err);
        setError("Audio is corrupted or unsupported");
      });
    })();

    return () => {
      wavesurfer?.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!isCurrentlyPlaying && isPlaying) {
      const ws = wavesurferRef.current;
      if (ws) {
        ws.pause();
        ws.seekTo(0);
      }
      setIsPlaying(false);
    }
  }, [currentlyPlayingId, isCurrentlyPlaying, isPlaying]);

  const togglePlay = () => {
    if (!wavesurferRef.current || error) return;

    if (isPlaying) {
      wavesurferRef.current.pause();
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(playerId);
      wavesurferRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Flex
      align="center"
      gap={4}
      p={3}
      bg="transparent"
      borderRadius="md"
      minW="300px"
      maxW="600px"
      w="100%"
    >
      <CustomTooltip
        label={error ? "No audio found" : ""}
        fontSize="sm"
        placement="top"
        hasArrow
      >
        <IconButton
          aria-label={isPlaying ? "Pause" : "Play"}
          icon={isPlaying ? <FaPause size="18px" /> : <FaPlay size="18px" />}
          size="lg"
          onClick={togglePlay}
          bg="transparent"
          color="gray.500"
          borderRadius="full"
          w="40px"
          h="40px"
          minW="40px"
          _hover={{ bg: "gray.100" }}
        />
      </CustomTooltip>

      <Box
        ref={waveformRef}
        flex="1"
        h="80px"
        w="100%"
        minW="0"
        cursor={error ? "not-allowed" : "pointer"}
        position="relative"
        onClick={!error ? togglePlay : undefined}
      >
        {error && (
          <Box
            position="absolute"
            top="50%"
            left="0"
            right="0"
            height="2px"
            bg="gray.300"
            transform="translateY(-50%)"
          />
        )}
      </Box>

      <Text fontSize="sm" minW="50px" textAlign="right" color="gray.700">
        {formatTime(duration - currentTime)}
      </Text>
    </Flex>
  );
};

export default AudioPlayer;