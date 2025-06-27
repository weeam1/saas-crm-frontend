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
  const [loading, setLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const isMountedRef = useRef(true);
  const loadIdRef = useRef(0);

  const isCurrentlyPlaying = currentlyPlayingId === playerId;

  const cyclePlaybackRate = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(nextRate);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const thisLoadId = ++loadIdRef.current;
    isMountedRef.current = true;
    setLoading(true);

    const cleanupPrevious = () => {
      return new Promise((resolve) => {
        if (wavesurferRef.current) {
          wavesurferRef.current.pause();
          wavesurferRef.current.unAll();
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }
        resolve();
      });
    };

    const initWaveSurfer = async () => {
      await cleanupPrevious();

      if (!url || !waveformRef.current) return;

      try {
        // Simulate a delay of 1 second before loading
        await new Promise((res) => setTimeout(res, 1000));

        const response = await fetch(url, { signal: controller.signal });
        const arrayBuffer = await response.arrayBuffer();

        const audioContext = new AudioContext();
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        await audioContext.close();

        if (!decoded.duration || decoded.duration === 0) {
          throw new Error("Audio duration is zero");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn("Fetch/Decode aborted safely");
          return;
        }
        console.error("Validation error:", err);
        if (isMountedRef.current) {
          setError("Audio not available");
          setLoading(false);
        }
        return;
      }

      if (!isMountedRef.current || loadIdRef.current !== thisLoadId) return;

      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#B0B3B8",
        progressColor: "brand.500",
        cursorColor: "brand.500",
        cursorWidth: 6,
        barWidth: 2,
        barRadius: 1,
        height: 6,
        responsive: true,
        normalize: true,
        backend: "WebAudio",
        playbackRate,
        preservePitch: true,
      });

      wavesurferRef.current = wavesurfer;

      try {
        wavesurfer.load(url);
      } catch (e) {
        console.warn("WaveSurfer.load threw", e);
      }

      wavesurfer.on("ready", () => {
        if (isMountedRef.current && loadIdRef.current === thisLoadId) {
          setDuration(wavesurfer.getDuration());
          setError(null);
          setLoading(false);
          wavesurfer.setPlaybackRate(playbackRate, true);
        }
      });

      wavesurfer.on("finish", () => {
        if (isMountedRef.current && loadIdRef.current === thisLoadId) {
          setIsPlaying(false);
          setCurrentlyPlayingId(null);
        }
      });

      wavesurfer.on("error", (e) => {
        if (isMountedRef.current && loadIdRef.current === thisLoadId) {
          console.error("WaveSurfer error:", e);
          setError("Audio error");
          setLoading(false);
        }
      });

      wavesurfer.on("interaction", () => {
        if (
          !isPlaying &&
          isMountedRef.current &&
          loadIdRef.current === thisLoadId
        ) {
          wavesurfer.play();
          setIsPlaying(true);
          setCurrentlyPlayingId(playerId);
        }
      });
    };

    initWaveSurfer();

    return () => {
      isMountedRef.current = false;
      controller.abort();
      cleanupPrevious();
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
    if (!wavesurferRef.current || error || loading) return;

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
      bg="brand.100"
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
            isDisabled={!!error || loading}
            bg="transparent"
            color="brand.500"
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
          />
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
          {error && (
            <Text color="red.400" fontSize="xs" textAlign="center">
              {error}
            </Text>
          )}
        </Box>

        {/* Speed Toggle  */}
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

      {/* Time & Timestamp */}
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
