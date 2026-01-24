import React, { useCallback, useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Spinner,
  Button,
  Image,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";

import WhatsappQRLogin from "../_components/WhatsappQRLogin";
import WAConnectionSuccess from "../_components/WAConnectionSuccess";
import ChatList from "../_components/ChatList";
import Chat from "../_components/Chat";
import Loader from "components/loading/Loader";
import { useNavigate } from "react-router-dom";
import ErrorState from "../_components/ErrorState";
import BrandLogo from "assets/logo/logo.png";
import { useSelector } from "react-redux";
import { useWhatsapp } from "hooks/whatsapp/useWhatsapp";
import { FiMenu, FiMessageSquare } from "react-icons/fi";

const CHATS_LIMIT_PER_PAGE = 30;

const WhatsappScreen = ({ sessionId, loadingChats }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  const [fetchingChats, setFetchingChats] = useState(false);
  const [page, setPage] = useState(1);
  const [categroy, setCategory] = useState("all");
  // check whatsapp user account is authenticated or login pervoius session exisit
  const isWhatsappAuth = localStorage.getItem("whatsapp_auth") || false;

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // when a chat is selected, close drawer automatically on mobile
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    onClose(); // auto-close drawer
  };

  const {
    // values
    getChats,
    userChats,
    qr,
    isReady,
    allConversations,
    error,
    fail,
    logoutWhatsapp,
    getChat,
    hasMoreChats,
  } = useWhatsapp();

  const getMoreChats = useCallback(() => {
    if (allConversations?.length >= CHATS_LIMIT_PER_PAGE * page) {
      const nextPage = page + 1;
      setPage(nextPage);
      // setFetchingChats(true);
      getChats(sessionId, nextPage, CHATS_LIMIT_PER_PAGE);
    }
  }, [allConversations?.length, getChats, page, sessionId]);

  const logoutHandler = () => {
    logoutWhatsapp(sessionId);
    navigate("/");
  };

  // ---- State Handling ----
  const renderContent = () => {
    // Usage
    if (error || fail) {
      return <ErrorState message={error || fail} type="error" />;
    }

    // if (whatsapp_disconnect) {
    // 	return (
    // 		<ErrorState
    // 			message='WhatsApp disconnected. Please reconnect.'
    // 			type='warning'
    // 		/>
    // 	);
    // }

    if (!loadingChats && isReady && allConversations?.length > 0) {
      return (
        <Flex h="95%" bg="white" color="gray.700" rounded="md">
          {/* WhatsApp-style Floating Chat Button */}
          <Box
            display={{ base: "flex", md: "none" }}
            alignItems="center"
            justifyContent="center"
            position="fixed"
            top="6rem"
            right="2rem"
            zIndex="999"
          >
            <IconButton
              onClick={onOpen}
              icon={<FiMessageSquare size="18" />}
              aria-label="Open chats"
              color="white"
              rounded="full"
              bg="#25D366" // WhatsApp green
              _hover={{ bg: "#1DA955" }}
              boxShadow="lg"
              p={4}
            />
          </Box>
          {/* Left Sidebar (Chats List) */}
          <Box
            w="25%"
            display={{ base: "none", md: "block" }}
            borderRight="1px solid #ddd"
          >
            <ChatList
              allConversations={allConversations}
              sessionId={sessionId}
              setSelectedChat={setSelectedChat}
              selectedChat={selectedChat}
              logoutHandler={logoutHandler}
              getChat={getChat}
              getMoreChats={getMoreChats}
              fetchingChats={fetchingChats}
              hasMoreChats={hasMoreChats}
            />
          </Box>

          {/* Mobile Drawer */}
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent maxW="80%">
              <DrawerCloseButton />
              <DrawerBody p={0}>
                <ChatList
                  allConversations={allConversations}
                  sessionId={sessionId}
                  setSelectedChat={handleChatSelect}
                  selectedChat={selectedChat}
                  logoutHandler={logoutHandler}
                  getChat={getChat}
                  getMoreChats={getMoreChats}
                  fetchingChats={fetchingChats}
                  hasMoreChats={hasMoreChats}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          {/* Right Chat Screen */}
          <Box
            w={{ base: "100%", md: "75%" }}
            // h='100%'
            bg="linear-gradient(135deg, rgba(250, 247, 231, 0.4), rgba(237, 209, 153, 0.4))"
            backdropFilter="blur(16px) saturate(180%)"
            webkitbackdropfilter="blur(16px) saturate(180%)"
            border="1px solid rgba(255, 255, 255, 0.3)"
            boxShadow="0 8px 32px rgba(31, 38, 135, 0.1)"
            borderRadius="xl"
            // overflowY='auto'
            // bg='#f7f7f7'
          >
            {userChats[selectedChat?.id] ? (
              <Chat chatId={selectedChat?.id} sessionId={sessionId} />
            ) : selectedChat ? (
              <Loader />
            ) : (
              <Flex
                align="center"
                justify="center"
                direction="column"
                h="full"
                color="gray.800"
              >
                {/* Illustration */}
                <Image src={BrandLogo} alt="Weam CRM" maxW="60px" mb={6} />
                {/* Title */}
                <Text fontSize="xl" fontWeight="medium" mb={2}>
                  Manage Your Customer Chats Seamlessly
                </Text>

                {/* Subtitle */}
                <Text
                  fontSize="sm"
                  color="gray.600"
                  maxW="500px"
                  textAlign="center"
                  mb={6}
                >
                  Stay connected with clients, track conversations, and boost
                  productivity by handling all customer chats directly from your
                  CRM Whatsapp.
                </Text>

                {/* Footer note */}
                <Text fontSize="xs" color="gray.500" mt={12}>
                  🔒 Your personal messages are end-to-end encrypted
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>
      );
    }

    if (isReady) {
      return <WAConnectionSuccess loadingChats={loadingChats} />;
    }

    if (qr) {
      return <WhatsappQRLogin qr={qr} />;
    }
  };

  // const thumbnail =
  // 	'/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAKAMBIgACEQEDEQH/xAAvAAACAwEBAAAAAAAAAAAAAAAAAgEDBAUGAQEBAQEAAAAAAAAAAAAAAAABAAID/9oADAMBAAIQAxAAAADz7dCTXOXsU1zC4X0OyjXYRM98ZSS6arSLmkMlZikOi1c/QLvhviSotjhrjnAGsAf/xAAlEAACAwACAgEDBQAAAAAAAAABAgADEQQhEjFBBRUiJDRCUVL/2gAIAQEAAT8AnU+J7hEXjuS6qmmDgX/4n2yyH6baPiPSVOGcLusuwwsYFw9nZ5kD1DrjVnMVBSz+I2cEfp0hA9xLna8qF/GaBYV/sTl/t2BlCotVYGhcjAht+Jo+B7ijWLETmEikmFDWoUegMhwYNE/EfyGxscYHycy5VrCL2Zx+Ze5ALy3kObSCehG5TbgETlaD5DJbYbAAFyVOw7BgbwRiw3ZVYqvrCW3UMJ5KwGHuVAAdiWWL4wAEbGVR2YAJ/8QAGBEBAAMBAAAAAAAAAAAAAAAAAQAQETD/2gAIAQIBAT8A4MdrWJf/xAAdEQEAAgIDAQEAAAAAAAAAAAABAAIQESExURJi/9oACAEDAQE/ANHs1+ifFvJbtxSyDmlLJxFqpxEruFg6IZ//2Q==';

  return (
    <Flex h="90vh" w="100%">
      {/* <img
				src={`data:image/jpeg;base64,${thumbnail}`}
				alt='Chat thumbnail'
				style={{ width: 100, height: 100, borderRadius: 8 }}
			/> */}
      <Box w="100%" h="100%">
        {renderContent()}
      </Box>
    </Flex>
  );
};

export default WhatsappScreen;
