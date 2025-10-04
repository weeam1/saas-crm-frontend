import React, { useState, useRef, useEffect } from "react";
import { Flex, Box, Text, Spinner, IconButton } from "@chakra-ui/react";
import { FaPlay, FaPause } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VoiceMessagePlayer = ({ url, isSelf, onPause }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let wavesurfer;
    let timeoutId;

    const initWaveSurfer = async () => {
      if (!url || !waveformRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        timeoutId = setTimeout(() => {
          if (isLoading) {
            setError("Audio loading timed out");
            setIsLoading(false);
          }
        }, 10000);

        wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#66778180",
          progressColor: "#008069",
          cursorColor: "transparent",
          barWidth: 2,
          barRadius: 2,
          barGap: 1,
          height: 32,
          responsive: true,
          backend: "WebAudio",
          normalize: true,
          interact: true,
        });

        wavesurferRef.current = wavesurfer;

        wavesurfer.load(url);

        wavesurfer.on("ready", () => {
          clearTimeout(timeoutId);
          setDuration(wavesurfer.getDuration());
          setError(null);
          setIsLoading(false);
        });

        wavesurfer.on("audioprocess", () => {
          setCurrentTime(wavesurfer.getCurrentTime());
        });

        wavesurfer.on("finish", () => {
          setIsPlaying(false);
          if (onPause) onPause(true);
        });

        wavesurfer.on("error", (err) => {
          clearTimeout(timeoutId);
          console.error("WaveSurfer error:", err);
          setError("Failed to load audio");
          setIsLoading(false);
        });

        wavesurfer.on("interaction", () => {
          setIsDragging(true);
        });

        wavesurfer.on("interaction-end", () => {
          setIsDragging(false);
        });
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("WaveSurfer init error:", err);
        setError("Audio error");
        setIsLoading(false);
      }
    };

    initWaveSurfer();

    return () => {
      clearTimeout(timeoutId);
      wavesurfer?.destroy();
    };
  }, [url, isSelf]);

  const togglePlay = () => {
    if (!wavesurferRef.current || error || isLoading) return;
    wavesurferRef.current.playPause();
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    if (onPause) {
      onPause(!newIsPlaying);
    }
  };

  return (
    <Flex align="center" gap={3} w="100%" mt={1}>
      <IconButton
        aria-label={isPlaying ? "Pause" : "Play"}
        icon={isPlaying ? <FaPause size="12px" /> : <FaPlay size="12px" />}
        size="sm"
        onClick={togglePlay}
        variant="ghost"
        color="#667781"
        bg="transparent"
        _hover={{ bg: "transparent" }}
        isDisabled={!!error || isLoading}
      />

      <Box
        ref={waveformRef}
        flex="1"
        h="32px"
        minW="120px"
        position="relative"
        cursor={error || isLoading ? "not-allowed" : "pointer"}
        onClick={togglePlay}
      >
        {(isLoading || error) && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            align="center"
            justify="center"
            bg={isSelf ? "rgba(0, 128, 105, 0.1)" : "rgba(255, 255, 255, 0.5)"}
          >
            {isLoading ? (
              <Spinner size="sm" color={isSelf ? "white" : "#008069"} />
            ) : (
              <Text fontSize="xs" color={"gray.500"}>
                Audio unavailable
              </Text>
            )}
          </Flex>
        )}
      </Box>

      <Text fontSize="xs" minW="40px" textAlign="right" color={"#66778180"}>
        {error ? "--:--" : formatTime(isPlaying ? duration - currentTime : duration)}
      </Text>
    </Flex>
  );
};

export default VoiceMessagePlayer;