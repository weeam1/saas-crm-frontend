// components/CandidateTable.jsx
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Box,
  Text,
  Center,
  Badge,
  Button,
  HStack,
  useDisclosure,
  TableContainer,
} from "@chakra-ui/react";
import {
  FiEye,
  FiDownload,
  FiClock,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";
import { FaWhatsapp, FaPhone } from "react-icons/fa6";
import NoData from "components/Message/NoData";
import TableLoading from "components/loading/TableLoading";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import StatusBadge from "components/shared/StatusBadge";
import FlagBadge from "../../_components/FlagBadge";
import { constant } from "constant";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addMissingFile } from "../../../../../redux/missingFilesSlice";
import CandidateView from "./CandidateView";
import CandidateStatusHistory from "../../_components/CandidateStatusHistory";
import { formatName } from "utils/helpers";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";

const CandidateTable = ({ candidates = [], isLoading, refetch }) => {
  const colors = useModalColors();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();
  const dispatch = useDispatch();
  const missingFiles = useSelector((state) => state.missingFiles.missingFiles);
  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const [delayedLoading, setDelayedLoading] = useState(isLoading);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setDelayedLoading(true);
    } else {
      timer = setTimeout(() => setDelayedLoading(false), 1000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const columns = [
    { key: "name", label: "Name", width: "180px" },
    { key: "position", label: "Position", width: "120px" },
    { key: "contact", label: "Contact", width: "180px" },
    { key: "details", label: "Details", width: "150px" },
    { key: "status", label: "Status", width: "120px" },
    { key: "appliedOn", label: "Applied On", width: "160px" },
    { key: "actions", label: "Actions", width: "120px" },
  ];

  const handleViewCV = async (resume) => {
    try {
      const pdfURL = `${constant["baseUrl"]}${resume}`;
      if (missingFiles.includes(resume)) {
        toast.error("CV not found!");
        return;
      }
      const response = await fetch(pdfURL, { method: "HEAD" });
      if (!response.ok) {
        dispatch(addMissingFile(resume));
        toast.error("CV not found!");
        return;
      }
      window.open(pdfURL, "_blank");
      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Hiring",
        entityType: "Application",
        entityId: selectedCandidate?._id,
        status: "success",
        message: `Candidate CV viewed by ${user?.fullName}.`,
      });
    } catch (error) {
      console.error("Error viewing CV:", error);
      toast.error("Failed to retrieve the CV. Please try again later.");
    }
  };

  const handleViewApplication = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewOpen(true);
    createUserLog({
      userId: user?._id,
      action: "VIEW",
      entity: "Hiring",
      entityType: "Application",
      entityId: candidate._id,
      status: "success",
      message: `Candidate ${candidate.name}’s details viewed by ${user?.fullName}.`,
    });
  };

  const handleViewHistory = (candidate) => {
    setSelectedCandidate(candidate);
    onHistoryOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow";
      case "Eligible":
        return "green";
      case "Not Eligible":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <>
      <TableContainer
        overflowX="auto"
              maxHeight="70vh"
      minH="70vh"
        borderWidth="1px"
        borderColor={colors.borderColor}
        rounded="xl"
        boxShadow={colors.cardShadow}
        bg={colors.bg}
      >
        <Table variant="simple" size="sm">
          <Thead bg={colors.bgDeep} position="sticky" top={0} zIndex={1}>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.key}
                  whiteSpace="nowrap"
                  textTransform="capitalize"
                  fontSize="sm"
                  py={4}
                  fontWeight="semibold"
                  color={colors.headingText}
                  minW={column.width}
                  borderBottom={`2px solid ${colors.borderColor}`}
                >
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {delayedLoading ? (
              <TableLoading columns={columns} length={10} py="4" />
            ) : candidates.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} py={10}>
                  <Center>
                    <NoData label="candidates" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              candidates.map((candidate) => (
                <Tr
                  key={candidate._id}
                  _hover={{ bg: colors.secondaryBtnHoverBg }}
                  borderBottom={`1px solid ${colors.borderColor}`}
                >
                  <Td py={3} px={3} fontSize="sm" fontWeight="semibold">
                    <Box>
                      <Text fontWeight="bold" color={colors.headingText}>
                        {formatName(candidate.name)}
                      </Text>
                      <Text
                        fontSize="xs"
                        color={colors.mutedText}
                        isTruncated
                        maxW="150px"
                      >
                        {candidate.email}
                      </Text>
                    </Box>
                  </Td>

                  <Td py={3} px={3} fontSize="sm">
                    <Badge
                      bg={`rgba(212, 175, 55, 0.15)`}
                      color={colors.accentGold}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      {candidate.position?.name || "N/A"}
                    </Badge>
                  </Td>

                  <Td py={3} px={3} fontSize="sm">
                    <Flex direction="column" gap={1}>
                      <HStack spacing={1}>
                        <FaWhatsapp size={12} color={colors.accentGold} />
                        <Text fontSize="xs" color={colors.bodyText}>
                          {candidate.whatsApp || "N/A"}
                        </Text>
                      </HStack>
                      <HStack spacing={1}>
                        <FaPhone size={12} color={colors.accentGold} />
                        <Text fontSize="xs" color={colors.bodyText}>
                          {candidate.phone || "N/A"}
                        </Text>
                      </HStack>
                    </Flex>
                  </Td>

                  <Td py={3} px={3} fontSize="sm">
                    <Flex direction="column" gap={1}>
                      <HStack spacing={1}>
                        <FiUser size={12} color={colors.accentGold} />
                        <Text fontSize="xs" color={colors.bodyText}>
                          {candidate.gender || "N/A"}
                        </Text>
                      </HStack>
                      <HStack spacing={1}>
                        <FiBriefcase size={12} color={colors.accentGold} />
                        <Text fontSize="xs" color={colors.bodyText}>
                          {candidate.experienceYears || 0} years
                        </Text>
                      </HStack>
                    </Flex>
                  </Td>

                  <Td py={3} px={3}>
                    <HStack spacing={2}>
                      <StatusBadge
                        status={candidate.status}
                        color={getStatusColor(candidate.status)}
                        size={6}
                      />
                      <FlagBadge item={candidate} />
                    </HStack>
                  </Td>

                  <Td py={3} px={3} fontSize="sm" color={colors.bodyText}>
                    {candidate.createdAt
                      ? format(new Date(candidate.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </Td>

                  <Td py={3} px={3}>
                    <HStack spacing={2}>
                      <CustomTooltip label="View Application">
                        <IconButton
                          aria-label="View"
                          icon={<FiEye />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewApplication(candidate)}
                          color={colors.bodyText}
                          _hover={{
                            bg: colors.secondaryBtnHoverBg,
                            color: colors.accentGold,
                          }}
                          transition="all 0.2s ease"
                        />
                      </CustomTooltip>

                      <CustomTooltip label="View CV">
                        <Button
                          size="xs"
                          variant="ghost"
                          leftIcon={<FiDownload />}
                          onClick={() => handleViewCV(candidate.resume)}
                          isDisabled={missingFiles.includes(candidate.resume)}
                          color={colors.bodyText}
                          _hover={{
                            bg: colors.secondaryBtnHoverBg,
                            color: colors.accentGold,
                          }}
                          transition="all 0.2s ease"
                        >
                          CV
                        </Button>
                      </CustomTooltip>

                      <CustomTooltip label="Status History">
                        <IconButton
                          aria-label="History"
                          icon={<FiClock />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewHistory(candidate)}
                          color={colors.bodyText}
                          _hover={{
                            bg: colors.secondaryBtnHoverBg,
                            color: colors.accentGold,
                          }}
                          transition="all 0.2s ease"
                        />
                      </CustomTooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modals */}
      {isViewOpen && selectedCandidate && (
        <CandidateView
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          candidate={selectedCandidate}
          onViewCV={handleViewCV}
          missingFiles={missingFiles}
          refetch={refetch}
        />
      )}

      {isHistoryOpen && selectedCandidate && (
        <CandidateStatusHistory
          isOpen={isHistoryOpen}
          onClose={onHistoryClose}
          candidate={selectedCandidate}
        />
      )}
    </>
  );
};

export default CandidateTable;