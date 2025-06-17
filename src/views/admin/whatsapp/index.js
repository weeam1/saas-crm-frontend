import React, { useState, useRef, useEffect } from "react";
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
} from "@chakra-ui/react";
import { FiMic, FiImage, FiSend, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { IoMdMic } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Whatsapp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Sample users data
  const users = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      lastMessage: "Hey, how are you doing?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      lastMessage: "Meeting at 3 PM",
      time: "9:15 AM",
      unread: 0,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      lastMessage: "Please send the files",
      time: "Yesterday",
      unread: 5,
    },
    {
      id: 4,
      name: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      lastMessage: "Thanks for your help!",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 5,
      name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      lastMessage: "Let's catch up soon",
      time: "Monday",
      unread: 1,
    },
  ];

  // Current user data
  const currentUser = {
    id: 0,
    name: "You",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  };

  // Sample initial messages for each chat
  const allMessages = {
    1: [
      {
        id: 1,
        sender: users[0],
        text: "Hey there!",
        type: "text",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: 2,
        sender: currentUser,
        text: "Hi! How are you?",
        type: "text",
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: 3,
        sender: users[0],
        text: "I'm good, thanks for asking!",
        type: "text",
        timestamp: new Date(Date.now() - 1200000),
      },
    ],
    2: [
      {
        id: 1,
        sender: users[1],
        text: "Hi, don't forget our meeting",
        type: "text",
        timestamp: new Date(Date.now() - 7200000),
      },
    ],
    3: [
      {
        id: 1,
        sender: currentUser,
        text: "I've sent the files",
        type: "text",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: 2,
        sender: users[2],
        text: "Please send them again",
        type: "text",
        timestamp: new Date(Date.now() - 43200000),
      },
    ],
  };

  useEffect(() => {
    setMessages(allMessages[activeChat] || []);
  }, [activeChat]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && !selectedImage) return;

    setIsSending(true);

    setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        sender: currentUser,
        text: inputMessage,
        image: selectedImage,
        type: selectedImage ? "image" : "text",
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputMessage("");
      setSelectedImage(null);
      setIsSending(false);

      allMessages[activeChat] = updatedMessages;

      setTimeout(() => {
        const replyMessage = {
          id: messages.length + 2,
          sender: users.find((u) => u.id === activeChat),
          text: selectedImage
            ? "Nice picture!"
            : `Reply to: ${inputMessage || "your image"}`,
          type: "text",
          timestamp: new Date(),
        };
        const updatedWithReply = [...updatedMessages, replyMessage];
        setMessages(updatedWithReply);
        allMessages[activeChat] = updatedWithReply;
      }, Math.random() * 2000 + 1000);
    }, 500);

    toast.success("Message sent!");
  };

  const handleImageUpload = (e) => {
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
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          chunksRef.current = [];

          const newMessage = {
            id: messages.length + 1,
            sender: currentUser,
            audioUrl,
            type: "voice",
            timestamp: new Date(),
          };

          const updatedMessages = [...messages, newMessage];
          setMessages(updatedMessages);
          allMessages[activeChat] = updatedMessages;
          toast.success("Voice message sent!");

          setTimeout(() => {
            const replyMessage = {
              id: messages.length + 2,
              sender: users.find((u) => u.id === activeChat),
              text: "Thanks for the voice message!",
              type: "text",
              timestamp: new Date(),
            };
            const updatedWithReply = [...updatedMessages, replyMessage];
            setMessages(updatedWithReply);
            allMessages[activeChat] = updatedWithReply;
          }, 2000);
        };

        mediaRecorderRef.current.start();
      })
      .catch((err) => {
        toast.error("Error accessing microphone: " + err.message);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getActiveUser = () => users.find((user) => user.id === activeChat) || users[0];

  const sidebarBg = useColorModeValue("gray.100", "gray.800");
  const chatBg = useColorModeValue("gray.50", "gray.700");

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const UserList = () => (
    <Box overflowY="auto" h="100%">
      {users.map((user) => (
        <Flex
          key={user.id}
          p={3}
          align="center"
          cursor="pointer"
          bg={activeChat === user.id ? "brand.200" : "transparent"}
          _hover={{ bg: "brand.100" }}
          onClick={() => {
            setActiveChat(user.id);
            if (isMobile) setShowSidebar(false);
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
          </Box>
        </Flex>
      ))}
    </Box>
  );

  return (
    <Flex h="80vh" overflow="hidden" position="relative">
      {/* Sidebar Toggle Button (when sidebar is hidden) */}
      {!showSidebar && (
        <IconButton
          icon={<FiChevronRight />}
          aria-label="Show sidebar"
          position="absolute"
          left={0}
          top="50%"
          transform="translateY(-50%)"
          zIndex={1}
          onClick={toggleSidebar}
          borderRadius="full"
          boxShadow="md"
        />
      )}

      {/* Sidebar */}
      <Box
        w={showSidebar ? "300px" : "0"}
        bg={sidebarBg}
        transition="width 0.3s ease"
        overflow="hidden"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        {showSidebar && (
          <>
            {/* Sidebar Header */}
            <Flex p={3} align="center" justify="space-between" borderBottom="1px solid" borderColor="gray.200">
              <Flex align="center">
                <Avatar src={currentUser.avatar} size="sm" mr={2} />
                <Text fontWeight="bold">Chats</Text>
              </Flex>
              <IconButton
                icon={<FiChevronLeft />}
                aria-label="Hide sidebar"
                size="sm"
                variant="ghost"
                onClick={toggleSidebar}
              />
            </Flex>
            
            <UserList />
          </>
        )}
      </Box>

      {/* Chat Area */}
      <Box flex={1} display="flex" flexDirection="column" bg={chatBg}>
        {/* Chat Header */}
        <Flex
          bg="#b79045"
          color="white"
          p={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            {isMobile && !showSidebar && (
              <IconButton
                icon={<FiChevronRight />}
                aria-label="Show sidebar"
                mr={2}
                onClick={toggleSidebar}
              />
            )}
            <Avatar src={getActiveUser().avatar} size="sm" mr={2} />
            <Box>
              <Text fontWeight="bold">{getActiveUser().name}</Text>
              <Text fontSize="xs">Online</Text>
            </Box>
          </Flex>
        </Flex>

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
            {messages.map((message) => (
              <Flex
                key={message.id}
                direction="column"
                align={message.sender.id === currentUser.id ? "flex-end" : "flex-start"}
              >
                <Flex align="center" mb={1}>
                  <Avatar
                    src={message.sender.avatar}
                    size="xs"
                    mr={2}
                    display={message.sender.id === currentUser.id ? "none" : "block"}
                  />
                  <Text fontSize="xs" color="gray.500">
                    {message.sender.name} • {formatTime(message.timestamp)}
                  </Text>
                </Flex>
                
                {message.type === "text" && (
                  <Box
                    bg={message.sender.id === currentUser.id ? "brand.200" : "white"}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    maxW="80%"
                  >
                    <Text>{message.text}</Text>
                  </Box>
                )}
                
                {message.type === "image" && (
                  <Box
                    bg={message.sender.id === currentUser.id ? "brand.200" : "white"}
                    p={2}
                    borderRadius="lg"
                    maxW="80%"
                  >
                    <img
                      src={message.image}
                      alt="shared"
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                  </Box>
                )}
                
                {message.type === "voice" && (
                  <Box
                    bg={message.sender.id === currentUser.id ? "brand.200" : "white"}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    maxW="80%"
                  >
                    <HStack spacing={2}>
                      <audio
                        ref={audioRef}
                        src={message.audioUrl}
                        controls
                        style={{ width: "150px" }}
                      />
                      <Text fontSize="xs" color="gray.500">
                        Voice message
                      </Text>
                    </HStack>
                  </Box>
                )}
              </Flex>
            ))}
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
              <img src={selectedImage} alt="preview" style={{ width: "100%" }} />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
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
            //   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              _focus={{borderColor: "brand"}}
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
              colorScheme="brand"
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