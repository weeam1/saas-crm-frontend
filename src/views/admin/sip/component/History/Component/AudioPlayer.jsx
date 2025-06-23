import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Box, Flex, IconButton, Text, Button } from "@chakra-ui/react";
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
  const [playbackRate, setPlaybackRate] = useState(1);

  const isCurrentlyPlaying = currentlyPlayingId === playerId;

  const cyclePlaybackRate = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(nextRate);
    }
  };

  useEffect(() => {
    let wavesurfer;

    const initialize = async () => {
      if (!url || !waveformRef.current) return;

      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        audioContext.close();

        if (!decoded.duration || decoded.duration === 0) {
          throw new Error("Zero duration");
        }
      } catch (err) {
        console.error("Audio validation failed:", err);
        setError("Audio is not available");
        return;
      }

      if (!waveformRef.current) return;

      wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#B0B3B8",
        progressColor: "#1C63D5",
        cursorColor: "#1C63D5",
        cursorWidth: 6,
        barWidth: 2,
        barRadius: 1,
        height: 6,
        responsive: true,
        normalize: true,
        backend: "WebAudio",
        playbackRate: playbackRate,
        preservePitch: true,
      });

      wavesurferRef.current = wavesurfer;
      wavesurfer.load(url);

      wavesurfer.on("ready", () => {
        setDuration(wavesurfer.getDuration());
        setError(null);
        wavesurfer.setPlaybackRate(playbackRate, true);
      });

      wavesurfer.on("finish", () => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      });

      wavesurfer.on("interaction", () => {
        if (!isPlaying) {
          wavesurfer.play();
          setIsPlaying(true);
          setCurrentlyPlayingId(playerId);
        }
      });

      wavesurfer.on("error", (err) => {
        console.error("WaveSurfer error:", err);
        setError("Audio is not available");
      });
    };

    initialize();

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.pause(); 
        wavesurferRef.current.destroy(); 
        wavesurferRef.current = null;
      }
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
  }, [currentlyPlayingId]);

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
      direction="column"
      bg="#242626"
      p="12px 16px"
      borderRadius="20px"
      w="100%"
      maxW="1500px"
      gap={2}
    >
      <Flex align="center" gap={4}>
        {/* Play / Pause Button */}
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
            bg="transparent"
            color="#1C63D5"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
          />
        </CustomTooltip>
        {/* Waveform  */}
        <Box flex="1" position="relative">
          {/* Wave Container */}
          <Box
            ref={waveformRef}
            w="100%"
            cursor={error ? "not-allowed" : "pointer"}
            position="relative"
            zIndex={1}
          >
            {error && (
              <CustomTooltip
                label={"No audio found"}
                fontSize="sm"
                placement="top"
                hasArrow
              >
                <Text color="red.400" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              </CustomTooltip>
            )}
          </Box>
        </Box>

        {/* Speed Toggle  */}
        <Button
          size="sm"
          px={4}
          py={2}
          fontSize="13px"
          onClick={cyclePlaybackRate}
          bg="gray.600"
          _hover={{ bg: "gray.500" }}
          color="white"
          borderRadius="full"
          minW="60px"
        >
          {playbackRate}x
        </Button>
      </Flex>

      {/* Time & Timestamp */}
      <Flex justify="space-between" px="44px">
        <Text fontSize="xs" color="gray.300">
          {formatTime(duration)}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {format(timestamp, "h:mm a")}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AudioPlayer;
