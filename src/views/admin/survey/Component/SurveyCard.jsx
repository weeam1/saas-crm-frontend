import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Tooltip,
  useBreakpointValue,
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useDeleteItemMutation } from "api/apiSlice";
import CustomTooltip from "../../../../components/shared/CustomTooltip";

const SurveyCard = ({ data, isActive, refetch }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const isAdmin = parsedUser?.role === "superAdmin";
  const currentUserId = parsedUser?._id;

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

  const cardWidth = useBreakpointValue({
    base: "95%",
    sm: "220px",
    md: "240px",
    lg: "260px",
  });

  const cardPadding = useBreakpointValue({
    base: 2,
    md: 3,
    lg: 3,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [securityPassword, setSecurityPassword] = useState("");
  const [surveyIdToDelete, setSurveyIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteItemMutation] = useDeleteItemMutation();

  const handleDeleteClick = (id) => {
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
      toast.error("Unable to delete the survey. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Box
      width="100%"
      height="100%"
      borderWidth="1px"
      borderRadius="lg"
      p={cardPadding}
      bg="#FFFFFF"
      position="relative"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
        <Box
          display="flex"
          justifyContent={isAdmin ? "space-between" : "flex-end"}
          alignItems="center"
          mb={2}
        >
          <CustomTooltip label={isActive ? "Active" : "Complete"}>
            <Box
              width="18px"
              height="18px"
              minWidth="18px"
              minHeight="18px"
              bg={isActive ? "green.600" : "red.600"}
              borderRadius="full"
              cursor="pointer"
              tabIndex={0}
              aria-label={isActive ? "Active" : "Complete"}
            />
          </CustomTooltip>

          {isAdmin && (
            <Tooltip
              label="Delete Survey"
              fontSize="sm"
              placement="top"
              hasArrow
            >
              <DeleteIcon
                color="red.500"
                boxSize={4}
                cursor="pointer"
                transition="color 0.2s, opacity 0.2s"
                _hover={{ color: "red.400", opacity: 0.8 }}
                onClick={() => handleDeleteClick(data.id || data._id)}
              />
            </Tooltip>
          )}
        </Box>

        <Box flex="1">
          <Box mb={1}>
            <Text
              fontSize="sm"
              fontWeight={"700"}
              noOfLines={2}
              lineHeight="1.3em"
              wordBreak="break-word"
              textOverflow="ellipsis"
              display="-webkit-box"
              sx={{
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {data.name
                ? data.name.charAt(0).toUpperCase() + data.name.slice(1).toLowerCase()
                : "" || data.title
                  ? data.title.charAt(0).toUpperCase() + data.title.slice(1).toLowerCase()
                  : ""}
            </Text>
          </Box>
          {data.description && (
            <Box mb={2}>
              <Text fontSize="xs" color="gray.600" fontWeight={"700"}>
                {data.description}
              </Text>
            </Box>
          )}

          {/* Survey Details */}
          <Flex direction="column" gap={2} mb={3} width="80%" mt="20px">
            <Flex justify="space-between">
              <Text color="#666666" fontSize="xs" fontWeight="700">
                Survey taken
              </Text>
              <Text color="#666666" fontSize="xs" fontWeight="700">
                {data.taken ?? data.submittedUsers}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="#666666" fontSize="xs" fontWeight="700">
                Total questions
              </Text>
              <Text color="#666666" fontSize="xs" fontWeight="700">
                {data.totalQuestions ?? data.questionsCount}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="#666666" fontSize="xs" fontWeight="700">
                Closing date
              </Text>
              <Text color="#666666" fontSize="xs" fontWeight="700">
                {data.closingDate ?? data.closesAt?.slice(0, 10)}
              </Text>
            </Flex>
            <Button
              bg={
                isAdmin ? "#D8A541" : isSurveyCompleted ? "gray.300" : "#D8A541"
              }
              borderRadius="4px"
              color={
                isAdmin ? "white" : isSurveyCompleted ? "gray.600" : "white"
              }
              mt="10px"
              fontSize="xs"
              size="sm"
              width="100%"
              isDisabled={isSurveyCompleted && !isAdmin}
              _disabled={{ opacity: 1, cursor: "not-allowed" }}
              _hover={
                isSurveyCompleted && !isAdmin
                  ? {}
                  : { bg: "brand.400", color: "white" }
              }
              _active = {{
                bg: "brand.300"
              }}
              onClick={() => {
                if (isAdmin) {
                  navigate(`/survey/view-survey/${data.id || data._id}`);
                } else if (!isSurveyCompleted) {
                  navigate(`/survey/take-survey/${data.id || data._id}`);
                }
              }}
            >
              {isAdmin
                ? "View"
                : isSurveyCompleted
                  ? "Survey Completed"
                  : "Take Survey"}
            </Button>
          </Flex>
        </Box>
        <Flex justify="flex-end">
          <Text
            fontSize="xs"
            color="black"
            alignSelf="flex-end"
            fontWeight={"700"}
          >
            {data.surveyDate || data.createdAt?.slice(0, 10)}
          </Text>
        </Flex>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="900px">
          {" "}
          {/* Increased width */}
          <ModalHeader>Delete Survey</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <Text fontWeight="bold">
                This action is irreversible. Deleting this survey will
                permanently remove all associated data. Please confirm your
                security password to proceed.
              </Text>
            </Alert>
            <Input
              type="password"
              placeholder="Enter security password"
              value={securityPassword}
              onChange={(e) => setSecurityPassword(e.target.value)}
              mb={2}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} borderRadius="4px">
              Cancel
            </Button>
            <Button
              colorScheme="red"
              bg="red.500"
              color="white"
              onClick={handleDeleteSurvey}
              isLoading={isDeleting}
              borderRadius="4px"
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
