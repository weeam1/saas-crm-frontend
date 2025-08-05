import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  Alert,
  AlertIcon,
  keyframes,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useDeleteItemMutation } from "api/apiSlice";
import CustomTooltip from "../../../../components/shared/CustomTooltip";

const colorTheme = {
  primary: "#B79045", 
  active: {
    bg: "#FFF9E6",
    accent: "#D4A017",
    border: "#E8D9A8", 
    status: "#38A169", 
    text: "#5F370E", 
  },
  inactive: {
    bg: "#FEF2F2", 
    accent: "#EF4444", 
    border: "#FECACA", 
    status: "#F59E0B", 
  },
  buttons: {
    primary: "#B79045", 
    hover: "#C9A158", 
    active: "#A57D3C", 
    disabled: "#EDF2F7", 
    text: "#FFFFFF",
  },
  modal: {
    header: "#B79045", 
    accent: "#D4A017", 
  }
};

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(183, 144, 69, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(183, 144, 69, 0); }
  100% { box-shadow: 0 0 0 0 rgba(183, 144, 69, 0); }
`;

const SurveyCard = ({ data, isActive, refetch, index }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const isAdmin = parsedUser?.role === "superAdmin";
  const currentUserId = parsedUser?._id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [securityPassword, setSecurityPassword] = useState("");
  const [surveyIdToDelete, setSurveyIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteItemMutation] = useDeleteItemMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  let isSurveyCompleted = false;
  if (Array.isArray(data.invitedUsers) && currentUserId) {
    const invitedUserObj = data.invitedUsers.find(
      (u) =>
        u.user &&
        u.user._id &&
        u.user._id.toString() === currentUserId.toString() &&
        u.status === "completed"
    );
    if (invitedUserObj) {
      isSurveyCompleted = true;
    }
  }

  const colors = isActive ? colorTheme.active : colorTheme.inactive;

  const handleDeleteClick = (e,id) => {
    setSurveyIdToDelete(id);
    setSecurityPassword("");
    onOpen();
  };

  const handleDeleteSurvey = async () => {
    if (!securityPassword.trim()) {
      toast.warning("Please enter your security password to proceed.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteItemMutation({
        path: `/surveys/${surveyIdToDelete}`,
        body: { securityPassword: securityPassword.trim() },
      }).unwrap();

      toast.success("The survey has been permanently deleted.");
      onClose();
      refetch();
    } catch (error) {
      console.log("error", error);

      toast.error(error?.data?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Box
        width="100%"
        height="100%"
        border="2px solid"
        borderColor={colors.border}
        borderRadius="12px"
        p={6}
        bg={"white"}
        position="relative"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        transition="all 0.3s ease"
        cursor="pointer"
        overflow="hidden"
        animation={`${hasAnimated ? floatAnimation : "none"} 0.5s ease-in-out`}
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          bg: "gray.100"
        }}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "6px",
          height: "100%",
          bg: colors.accent,
          borderRadius: "12px 0 0 12px",
        }}
      >
        <Flex justify="space-between" mb={4} zIndex={1}>
          <CustomTooltip label={isActive ? "Active" : "Inactive"}>
            <Box
              width="18px"
              height="18px"
              bg={colors.status}
              borderRadius="full"
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{ 
                transform: "scale(1.1)",
                animation: `${pulseAnimation} 1.5s infinite`
              }}
            />
          </CustomTooltip>

          {isAdmin && (
            <Tooltip label="Delete Survey" placement="top">
              <DeleteIcon
                color="red.500"
                boxSize={4}
                _hover={{ 
                  color: "red.400", 
                  transform: "scale(1.1)",
                  animation: `${pulseAnimation} 1.5s infinite`
                }}
                transition="all 0.2s"
                onClick={(e) => handleDeleteClick(e, data.id || data._id)}
              />
            </Tooltip>
          )}
        </Flex>

        <Box flex="1" zIndex={1}>
          <Text
            fontSize="lg"
            fontWeight="800"
            color={colorTheme.primary}
            mb={2}
            noOfLines={2}
          >
            {data.name || data.title || "Untitled Survey"}
          </Text>
          
          {data.description && (
            <Text fontSize="sm" color={colors.text} mb={4} noOfLines={3}>
              {data.description}
            </Text>
          )}

          <Flex direction="column" gap={3} mb={4}>
            <Flex justify="space-between">
              <Text fontSize="sm" color={colors.text}>Survey taken</Text>
              <Text fontSize="sm" fontWeight="600" color={colorTheme.primary}>
                {data.taken ?? data.submittedUsers ?? 0}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color={colors.text}>Total questions</Text>
              <Text fontSize="sm" fontWeight="600" color={colorTheme.primary}>
                {data.totalQuestions ?? data.questionsCount ?? 0}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="sm" color={colors.text}>Closing date</Text>
              <Text fontSize="sm" fontWeight="600" color={colorTheme.primary}>
                {data.closingDate || data.closesAt?.slice(0, 10) || "N/A"}
              </Text>
            </Flex>
          </Flex>
        </Box>

        <Button
          bg={colorTheme.buttons.primary}
          color={colorTheme.buttons.text}
          size="sm"
          _hover={{
            bg: colorTheme.buttons.hover,
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          _active={{
            bg: colorTheme.buttons.active,
            transform: "translateY(0)",
          }}
          _disabled={{
            bg: colorTheme.buttons.disabled,
            color: "gray.500",
            cursor: "not-allowed",
            _hover: {
              bg: colorTheme.buttons.disabled,
              transform: "none",
              boxShadow: "none"
            }
          }}
          isDisabled={isSurveyCompleted && !isAdmin}
          onClick={(e) => {
            e.stopPropagation();
            if (isAdmin) {
              navigate(`/survey/view-survey/${data.id || data._id}`);
            } else if (!isSurveyCompleted) {
              navigate(`/survey/take-survey/${data.id || data._id}`);
            }
          }}
        >
          {isAdmin ? "View" : isSurveyCompleted ? "Completed" : "Take Survey"}
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent borderRadius="xl" overflow="hidden">
          <ModalHeader bg={colorTheme.modal.header} color="brand.100">
            Delete Survey
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={4}>
            <Alert status="warning" mb={4} borderRadius="md">
              <AlertIcon />
              <Text fontWeight="medium">
                This will permanently delete the survey and all its data.
                Please confirm your security password to proceed.
              </Text>
            </Alert>
            <Input
              type="password"
              placeholder="Enter security password"
              value={securityPassword}
              onChange={(e) => setSecurityPassword(e.target.value)}
              focusBorderColor={colorTheme.modal.accent}
              borderRadius="md"
            />
          </ModalBody>
          <ModalFooter>
            <Button 
              mr={3} 
              onClick={onClose}
              variant="outline"
              borderColor={colorTheme.modal.accent}
            >
              Cancel
            </Button>
            <Button
              bg={colorTheme.buttons.primary}
              color="white"
              _hover={{
                bg: colorTheme.buttons.hover,
              }}
              _active={{
                bg: colorTheme.buttons.active,
              }}
              isLoading={isDeleting}
              onClick={handleDeleteSurvey}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SurveyCard;
