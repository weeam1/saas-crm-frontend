import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Input,
  Button,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Center,
  InputGroup,
  InputLeftElement,
  Divider,
} from "@chakra-ui/react";
import {
  FiMic,
  FiImage,
  FiSend,
  FiChevronRight,
  FiChevronLeft,
  FiSearch,
} from "react-icons/fi";
import { IoMdMic, IoMdClose } from "react-icons/io";
import { FaPlay, FaPause, FaCheck, FaCheckDouble } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WaveSurfer from "wavesurfer.js";

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = Math.floor(safeSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDateHeader = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const messageDate = new Date(date);
  
  if (messageDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }
};

const VoiceMessagePlayer = ({ url, isSelf }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          waveColor: isSelf ? "#ffffff80" : "#CBD5E0",
          progressColor: isSelf ? "#ffffff" : "#4a9eff",
          cursorColor: "transparent",
          barWidth: 2,
          barRadius: 2,
          barGap: 1,
          height: 32,
          responsive: true,
          backend: "WebAudio",
          normalize: true,
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
        });

        wavesurfer.on("error", (err) => {
          clearTimeout(timeoutId);
          console.error("WaveSurfer error:", err);
          setError("Failed to load audio");
          setIsLoading(false);
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
    setIsPlaying(!isPlaying);
  };

  return (
    <Flex align="center" gap={3} w="100%">
      <IconButton
        aria-label={isPlaying ? "Pause" : "Play"}
        icon={isPlaying ? <FaPause size="12px" /> : <FaPlay size="12px" />}
        size="sm"
        onClick={togglePlay}
        colorScheme={isSelf ? "whiteAlpha" : "blackAlpha"}
        variant="ghost"
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
            bg={isSelf ? "rgba(0, 92, 75, 0.1)" : "rgba(255, 255, 255, 0.5)"}
          >
            {isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Text
                fontSize="xs"
                color={isSelf ? "whiteAlpha.800" : "gray.500"}
              >
                Audio unavailable
              </Text>
            )}
          </Flex>
        )}
      </Box>

      <Text
        fontSize="xs"
        minW="40px"
        textAlign="right"
        color={isSelf ? "whiteAlpha.800" : "gray.600"}
      >
        {error ? "--:--" : formatTime(isPlaying ? duration - currentTime : duration)}
      </Text>
    </Flex>
  );
};

const Whatsapp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Users data
  const users = useRef([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      lastMessage: "Hey, how are you doing?",
      time: "10:30 AM",
      unread: 2,
      lastSeen: "10:30 AM",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      lastMessage: "Meeting at 3 PM",
      time: "9:15 AM",
      unread: 0,
      lastSeen: "9:15 AM",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      lastMessage: "Please send the files",
      time: "Yesterday",
      unread: 5,
      lastSeen: "Yesterday",
    },
    {
      id: 4,
      name: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      lastMessage: "Thanks for your help!",
      time: "Yesterday",
      unread: 0,
      lastSeen: "Yesterday",
    },
    {
      id: 5,
      name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      lastMessage: "Let's catch up soon",
      time: "Monday",
      unread: 1,
      lastSeen: "Monday",
    },
    {
      id: 6,
      name: "Zarak",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      lastMessage: "Let's catch up soon",
      time: "Tuesday",
      unread: 0,
      lastSeen: "Monday",
    },
  ]).current;

  // Current user data
  const currentUser = useRef({
    id: 0,
    name: "You",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  }).current;

  // Messages data with different dates for testing
  const allMessages = useRef({
    1: [
      {
        id: 1,
        sender: users[0],
        text: "Hey there!",
        type: "text",
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
        status: "read",
      },
      {
        id: 2,
        sender: currentUser,
        text: "Hi! How are you?",
        type: "text",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        status: "read",
      },
      {
        id: 3,
        sender: users[0],
        text: "I'm good, thanks for asking!",
        type: "text",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: "delivered",
      },
      {
        id: 4,
        sender: currentUser,
        text: "Great to hear!",
        type: "text",
        timestamp: new Date(), // Now
        status: "read",
      },
    ],
    2: [
      {
        id: 1,
        sender: users[1],
        text: "Hi, don't forget our meeting",
        type: "text",
        timestamp: new Date(Date.now() - 7200000),
        status: "read",
      },
    ],
    3: [
      {
        id: 1,
        sender: currentUser,
        text: "I've sent the files",
        type: "text",
        timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
        status: "read",
      },
      {
        id: 2,
        sender: users[2],
        text: "Please send them again",
        type: "text",
        timestamp: new Date(Date.now() - 43200000),
        status: "delivered",
      },
    ],
  }).current;

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  useEffect(() => {
    setMessages(allMessages[activeChat] || []);
  }, [activeChat]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() && !selectedImage) return;

    setIsSending(true);

    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        sender: currentUser,
        text: inputMessage,
        image: selectedImage,
        type: selectedImage ? "image" : "text",
        timestamp: new Date(),
        status: "sent",
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputMessage("");
      setSelectedImage(null);
      setIsSending(false);

      allMessages[activeChat] = updatedMessages;

      setTimeout(
        () => {
          const replyMessage = {
            id: Date.now() + 1,
            sender: users.find((u) => u.id === activeChat),
            text: selectedImage
              ? "Nice picture!"
              : `Reply to: ${inputMessage || "your image"}`,
            type: "text",
            timestamp: new Date(),
            status: "delivered",
          };
          const updatedWithReply = [...updatedMessages, replyMessage];
          setMessages(updatedWithReply);
          allMessages[activeChat] = updatedWithReply;

          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === newMessage.id ? { ...msg, status: "read" } : msg
              )
            );
            allMessages[activeChat] = allMessages[activeChat].map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: "read" } : msg
            );
          }, 1000);
        },
        Math.random() * 2000 + 1000
      );
    }, 500);

    toast.success("Message sent!");
  }, [inputMessage, selectedImage, messages, activeChat]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        toast.info("Image selected, click send to share");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingTime(0);
      setAudioLevel(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      toast.info("Recording cancelled");
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setRecordingTime(0);
    setAudioLevel(0);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        // Setup audio analyzer
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 32;
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyserRef.current);
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const analyzeAudio = () => {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setAudioLevel(Math.min(average / 50, 1)); // Normalize to 0-1 range
          animationRef.current = requestAnimationFrame(analyzeAudio);
        };

        analyzeAudio();

        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);

        mediaRecorderRef.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          clearInterval(timerRef.current);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }

          try {
            const audioBlob = new Blob(chunksRef.current, {
              type: "audio/webm",
            });
            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio();
            audio.src = audioUrl;

            await new Promise((resolve) => {
              audio.onloadedmetadata = resolve;
              audio.onerror = () => {
                console.error("Failed to load audio metadata");
                resolve();
              };
            });

            const duration = Math.round(audio.duration || recordingTime);

            const newMessage = {
              id: Date.now(),
              sender: currentUser,
              audioUrl,
              type: "voice",
              timestamp: new Date(),
              duration,
              status: "sent",
            };

            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            allMessages[activeChat] = updatedMessages;
            toast.success("Voice message sent!");

            setTimeout(() => {
              const replyMessage = {
                id: Date.now() + 1,
                sender: users.find((u) => u.id === activeChat),
                text: "Thanks for the voice message!",
                type: "text",
                timestamp: new Date(),
                status: "delivered",
              };
              const updatedWithReply = [...updatedMessages, replyMessage];
              setMessages(updatedWithReply);
              allMessages[activeChat] = updatedWithReply;

              setTimeout(() => {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === newMessage.id ? { ...msg, status: "read" } : msg
                  )
                );
                allMessages[activeChat] = allMessages[activeChat].map((msg) =>
                  msg.id === newMessage.id ? { ...msg, status: "read" } : msg
                );
              }, 1000);
            }, 2000);
          } catch (err) {
            console.error("Error processing voice message:", err);
            toast.error("Failed to send voice message");
          } finally {
            setIsRecording(false);
            setRecordingTime(0);
            setAudioLevel(0);
          }
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        toast.error("Microphone access denied: " + err.message);
        setIsRecording(false);
      });
  }, [messages, activeChat, recordingTime]);

  const formatMessageTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getActiveUser = useCallback(() => {
    return users.find((user) => user.id === activeChat) || users[0];
  }, [users, activeChat]);

  const sidebarBg = useColorModeValue("gray.100", "gray.800");
  const chatBg = useColorModeValue("gray.50", "gray.700");

  const UserList = useMemo(
    () => () => (
      <Box overflowY="auto" h="100%" >
        <Box p={3}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search contacts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
            />
          </InputGroup>
        </Box>
        <Divider />
        <Box mb={20}>
        {filteredUsers.map((user) => (
          <React.Fragment key={user.id}>
            <Flex
              p={3}
              align="center"
              cursor="pointer"
              bg={activeChat === user.id ? "whatsapp.300" : "transparent"}
              _hover={{ bg: "whatsapp.100" }}
              onClick={() => {
                setActiveChat(user.id);
                if (isMobile) onClose();
              }}
            >
              <Avatar src={user.avatar} size="md" mr={3} />
              <Box flex="1">
                <Flex justify="space-between">
                  <Text fontWeight="bold">{user.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {user.time}
                  </Text>
                </Flex>
                <Flex justify="space-between" mt={1}>
                  <Text fontSize="sm" color="gray.600" isTruncated maxW="180px">
                    {user.lastMessage}
                  </Text>
                  {user.unread > 0 && (
                    <Badge colorScheme="green" borderRadius="full" px={2}>
                      {user.unread}
                    </Badge>
                  )}
                </Flex>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Last seen: {user.lastSeen}
                </Text>
              </Box>
            </Flex>
            <Divider />
          </React.Fragment>
        ))}
        </Box>
      </Box>
    ),
    [filteredUsers, activeChat, searchQuery, isMobile, onClose]
  );

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;

    messages.forEach((message, index) => {
      const messageDate = formatDateHeader(message.timestamp);
      
      if (messageDate !== currentDate) {
        groups.push({
          type: 'date',
          date: messageDate,
          id: `date-${messageDate}-${index}`
        });
        currentDate = messageDate;
      }
      
      groups.push({
        type: 'message',
        message,
        id: message.id
      });
    });

    return groups;
  }, [messages]);

  return (
    <Flex h="80vh" overflow="hidden" position="relative">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          w="300px"
          bg={sidebarBg}
          borderRight="1px solid"
          borderColor="gray.200"
          display={{ base: "none", md: "block" }}
        >
          {/* Sidebar Header */}
          <Flex
            p={3}
            align="center"
            justify="space-between"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Flex align="center">
              <Avatar src={currentUser.avatar} size="sm" mr={2} />
              <Text fontWeight="bold">Chats</Text>
            </Flex>
          </Flex>
          <Divider />

          <UserList />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex align="center">
              <Avatar src={currentUser.avatar} size="sm" mr={2} />
              <Text>Chats</Text>
            </Flex>
          </DrawerHeader>
          <Divider />
          <DrawerBody p={0}>
            <UserList />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Chat Area */}
      <Box flex={1} display="flex" flexDirection="column" bg={chatBg}>
        {/* Chat Header */}
        <Flex
          bg="#005c4b"
          color="white"
          p={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            {isMobile && (
              <IconButton
                icon={<FiChevronRight />}
                aria-label="Show sidebar"
                mr={2}
                onClick={onOpen}
                color="white"
                background="transparent"
                ref={btnRef}
              />
            )}
            <Avatar src={getActiveUser().avatar} size="sm" mr={2} />
            <Box>
              <Text fontWeight="bold">{getActiveUser().name}</Text>
              <Text fontSize="xs">Online</Text>
            </Box>
          </Flex>
        </Flex>
        <Divider />

        {/* Chat messages */}
        <Box
          flex={1}
          p={4}
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "24px",
            },
          }}
        >
          <VStack spacing={4} align="stretch">
            {groupedMessages.map((item) => {
              if (item.type === 'date') {
                return (
                  <Flex key={item.id} justify="center" my={2}>
                    <Box
                      bg="gray.200"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      <Text fontSize="sm" color="gray.600">
                        {item.date}
                      </Text>
                    </Box>
                  </Flex>
                );
              }

              const message = item.message;
              return (
                <React.Fragment key={item.id}>
                  <Flex
                    direction="column"
                    align={
                      message.sender.id === currentUser.id
                        ? "flex-end"
                        : "flex-start"
                    }
                  >
                    <Flex align="center" mb={1}>
                      <Avatar
                        src={message.sender.avatar}
                        size="xs"
                        mr={2}
                        display={
                          message.sender.id === currentUser.id ? "none" : "block"
                        }
                      />
                      <Text fontSize="xs" color="gray.500">
                        {message.sender.name} •{" "}
                        {formatMessageTime(message.timestamp)}
                      </Text>
                    </Flex>

                    {message.type === "text" && (
                      <Box
                        position="relative"
                        bg={
                          message.sender.id === currentUser.id
                            ? "#005c4b"
                            : "white"
                        }
                        px={4}
                        py={2}
                        borderRadius="lg"
                        maxW="80%"
                        color={
                          message.sender.id === currentUser.id ? "white" : "black"
                        }
                      >
                        <Text>{message.text}</Text>
                        {message.sender.id === currentUser.id && (
                          <Box
                            position="absolute"
                            right="2"
                            bottom="1"
                            fontSize="10px"
                            color={
                              message.sender.id === currentUser.id
                                ? "whiteAlpha.700"
                                : "gray.500"
                            }
                          >
                            {message.status === "read" ? (
                              <FaCheckDouble color="#34B7F1" />
                            ) : message.status === "delivered" ? (
                              <FaCheckDouble />
                            ) : (
                              <FaCheck />
                            )}
                          </Box>
                        )}
                      </Box>
                    )}

                    {message.type === "image" && (
                      <Box
                        position="relative"
                        bg={
                          message.sender.id === currentUser.id
                            ? "#005c4b"
                            : "white"
                        }
                        color={
                          message.sender.id === currentUser.id ? "white" : "black"
                        }
                        p={2}
                        borderRadius="lg"
                        maxW="80%"
                      >
                        <img
                          src={message.image}
                          alt="shared"
                          style={{
                            maxWidth: "100%",
                            borderRadius: "8px",
                            maxHeight: "300px",
                            objectFit: "contain",
                          }}
                        />
                        {message.sender.id === currentUser.id && (
                          <Box
                            position="absolute"
                            right="2"
                            bottom="2"
                            fontSize="10px"
                            color={
                              message.sender.id === currentUser.id
                                ? "whiteAlpha.700"
                                : "gray.500"
                            }
                          >
                            {message.status === "read" ? (
                              <FaCheckDouble color="#34B7F1" />
                            ) : message.status === "delivered" ? (
                              <FaCheckDouble />
                            ) : (
                              <FaCheck />
                            )}
                          </Box>
                        )}
                      </Box>
                    )}

                    {message.type === "voice" && (
                      <Box
                        position="relative"
                        bg={
                          message.sender.id === currentUser.id
                            ? "#005c4b"
                            : "white"
                        }
                        px={4}
                        py={2}
                        borderRadius="lg"
                        maxW="80%"
                        minW="200px"
                        color={
                          message.sender.id === currentUser.id ? "white" : "black"
                        }
                      >
                        <VoiceMessagePlayer
                          url={message.audioUrl}
                          isSelf={message.sender.id === currentUser.id}
                        />
                        {message.sender.id === currentUser.id && (
                          <Box
                            position="absolute"
                            right="2"
                            bottom="2"
                            fontSize="10px"
                            color={
                              message.sender.id === currentUser.id
                                ? "whiteAlpha.700"
                                : "gray.500"
                            }
                          >
                            {message.status === "read" ? (
                              <FaCheckDouble color="#34B7F1" />
                            ) : message.status === "delivered" ? (
                              <FaCheckDouble />
                            ) : (
                              <FaCheck />
                            )}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Flex>
                  <Divider opacity={0.2} />
                </React.Fragment>
              );
            })}
            {isSending && (
              <Flex justify="flex-end">
                <Spinner size="sm" />
              </Flex>
            )}
          </VStack>
        </Box>

        {/* Image preview modal */}
        <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Image Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <img
                src={selectedImage}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="whatsapp"
                mr={3}
                onClick={() => {
                  handleSendMessage();
                  setSelectedImage(null);
                }}
              >
                Send
              </Button>
              <Button variant="ghost" onClick={() => setSelectedImage(null)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Input area */}
        <Box bg="gray.200" p={3}>
          {selectedImage && (
            <Flex
              bg="white"
              p={2}
              mb={2}
              borderRadius="md"
              justify="space-between"
              align="center"
            >
              <Text fontSize="sm">Image ready to send</Text>
              <Button size="sm" onClick={() => setSelectedImage(null)}>
                Cancel
              </Button>
            </Flex>
          )}
          {isRecording && (
            <Center>
              <Flex
                bg="white"
                p={3}
                mb={2}
                borderRadius="lg"
                justify="space-between"
                align="center"
                w="80%"
              >
                <HStack spacing={3} w="100%">
                  <Box
                    w="10px"
                    h="10px"
                    bg="red.500"
                    borderRadius="full"
                    animation="pulse 1s infinite"
                  />
                  <Box 
                    flex={1} 
                    h="2px" 
                    bg="gray.200" 
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="#4a9eff"
                      transformOrigin="left"
                      transform={`scaleX(${0.2 + audioLevel * 0.8})`}
                      transition="transform 0.1s ease-out"
                    />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" minW="40px">
                    {formatTime(recordingTime)}
                  </Text>
                </HStack>
                <HStack ml={2}>
                  <IconButton
                    icon={<IoMdClose />}
                    aria-label="Cancel recording"
                    size="sm"
                    onClick={cancelRecording}
                  />
                  <Button
                    size="sm"
                    colorScheme="whatsapp"
                    onClick={stopRecording}
                    leftIcon={<FiSend />}
                  >
                    Send
                  </Button>
                </HStack>
              </Flex>
            </Center>
          )}
          <Flex align="center">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <Tooltip label="Attach image">
              <IconButton
                icon={<FiImage />}
                aria-label="Attach image"
                mr={2}
                onClick={() => fileInputRef.current.click()}
              />
            </Tooltip>

            <Input
              flex={1}
              bg="white"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              _focus={{ borderColor: "brand" }}
            />

            {isRecording ? (
              <IconButton
                icon={<IoMdMic />}
                aria-label="Stop recording"
                colorScheme="red"
                ml={2}
                onClick={stopRecording}
              />
            ) : (
              <Tooltip label="Record voice message">
                <IconButton
                  icon={<FiMic />}
                  aria-label="Record voice message"
                  ml={2}
                  onClick={startRecording}
                />
              </Tooltip>
            )}

            <IconButton
              icon={<FiSend />}
              aria-label="Send message"
              colorScheme="whatsapp"
              ml={2}
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !selectedImage) || isSending}
            />
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default Whatsapp;