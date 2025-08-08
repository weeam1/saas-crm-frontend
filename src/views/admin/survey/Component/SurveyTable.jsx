import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  Tooltip,
  Flex,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteItemMutation } from "api/apiSlice";
import TableLoading from "components/loading/TableLoading";
import NoData from "components/Message/NoData";
import { buttonStyle } from "utils/btn";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const SurveyTable = ({ data, isLoading, isFetching, viewLoading, refetch }) => {
  const columns = [
    "SR.No",
    "Survey",
    "Status",
    "Questions",
    "Survey Taken",
    "Closing Date",
    "Created Date",
    "Actions",
  ];

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";
  const currentUserId = user?._id;

  const { createUserLog } = useUserActivityLog();

  // Delete modal state
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
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Survey",
        entityType: "Survey",
        entityId: surveyIdToDelete,
        status: "success",
        message: `"${user?.fullName}" deleted survey.`,
      });
      toast.success("The survey has been permanently deleted.");
      onClose();
      refetch();
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        "Failed to delete the survey. Please try again.";
      console.log("error", error);
      toast.error(error?.data?.message);
      createUserLog({
        userId: user?._id,
        action: "DELETE_FAIL",
        entity: "Survey",
        entityType: "Survey",
        entityId: surveyIdToDelete,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const checkSurveyCompletion = (survey) => {
    if (!Array.isArray(survey.invitedUsers) || !currentUserId) return false;

    const invitedUserObj = survey.invitedUsers.find(
      (u) =>
        u.user &&
        u.user._id &&
        u.user._id.toString() === currentUserId.toString() &&
        u.status === "completed"
    );
    return !!invitedUserObj;
  };

  return (
    <>
      <Box
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        overflowY="auto"
        maxH={"85vh"}
      >
        <Table variant="striped" size="lg">
          <Thead position="sticky" top={0} bg="white" zIndex={2}>
            <Tr>
              {columns.map((header, index) => (
                <Th key={index} bg="brand.200" whiteSpace="nowrap" py={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="600"
                      color="gray.700"
                      textTransform="capitalize"
                      textAlign="center"
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isFetching || isLoading || viewLoading ? (
              <TableLoading columns={columns} length={11} py="4" />
            ) : data && data?.doc?.surveys?.length > 0 ? (
              data?.doc?.surveys.map((survey, index) => {
                const isActive = survey.status === "active";
                const isSurveyCompleted = checkSurveyCompletion(survey);
                const submittedCount = survey.submittedUsers || 0;
                const invitedCount = survey.invitedUsersCount || 0;

                return (
                  <Tr
                    key={survey._id}
                    _hover={{ bg: "gray.50" }}
                    border="gray.200"
                  >
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "15px" }}
                      fontWeight="500"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {index + 1}
                    </Td>
                    {/* Survey Name */}
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "15px" }}
                      fontWeight="500"
                      minWidth="200px"
                      textAlign={"center"}
                    >
                      <Text
                        fontWeight="700"
                        noOfLines={1}
                        wordBreak="break-word"
                      >
                        {survey.title?.charAt(0).toUpperCase() +
                          survey.title?.slice(1).toLowerCase()}
                      </Text>
                    </Td>

                    {/* Status */}
                    <Td py={4} textAlign="center">
                      <Badge
                        colorScheme={isActive ? "green" : "red"}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {isActive ? "Active" : "Completed"}
                      </Badge>
                    </Td>

                    {/* Questions */}
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      textAlign="center"
                    >
                      {survey.questionsCount}
                    </Td>

                    {/* Participants */}
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      textAlign="center"
                    >
                      {`${submittedCount}/${invitedCount}`}
                    </Td>

                    {/* Closing Date */}
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      textAlign="center"
                    >
                      {new Date(survey.closesAt).toLocaleDateString()}
                    </Td>

                    {/* Created Date */}
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      textAlign="center"
                    >
                      {new Date(survey.createdAt).toLocaleDateString()}
                    </Td>

                    {/* Actions */}
                    <Td py={4} textAlign="center">
                      <Flex gap={2} justify="center">
                        {isAdmin && (
                          <Tooltip label="Delete Survey" hasArrow>
                            <Button
                              variant="ghost"
                              colorScheme="red"
                              size="sm"
                              onClick={() => handleDeleteClick(survey._id)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Tooltip>
                        )}

                        <Button
                          {...buttonStyle}
                          variant="solid"
                          bg={
                            isAdmin
                              ? "#D8A541"
                              : isSurveyCompleted
                                ? "gray.300"
                                : "#D8A541"
                          }
                          color={
                            isAdmin
                              ? "white"
                              : isSurveyCompleted
                                ? "gray.600"
                                : "white"
                          }
                          fontSize="sm"
                          size="sm"
                          isDisabled={isSurveyCompleted && !isAdmin}
                          _disabled={{ opacity: 1, cursor: "not-allowed" }}
                          onClick={() => {
                            if (isAdmin) {
                              navigate(`/survey/view-survey/${survey._id}`);
                            } else if (!isSurveyCompleted) {
                              navigate(`/survey/take-survey/${survey._id}`);
                            }
                          }}
                        >
                          {isAdmin
                            ? "View"
                            : isSurveyCompleted
                              ? "Completed"
                              : "Take Survey"}
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr borderColor="gray.200" textAlign="center">
                <Td
                  py={4}
                  colSpan={columns.length}
                  fontSize={{ base: "12px", md: "15px" }}
                  fontWeight="500"
                  color="gray.500"
                  textAlign="center"
                >
                  <NoData label="surveys" />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          mx={{ base: 2, sm: 4, md: 8 }}
          w={{ base: "95vw", sm: "90vw", md: "500px" }}
          maxW="100vw"
        >
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

export default SurveyTable;
