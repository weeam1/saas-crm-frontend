import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useDisclosure, IconButton } from "@chakra-ui/react";
import CandidateStatusHistory from "../../_components/CandidateStatusHistory";

import { FaWhatsapp, FaPhone, FaEye } from "react-icons/fa6";
import { useState } from "react";
import { constant } from "constant";
import CandidateView from "./CandidateView";
import StatusBadge from "components/shared/StatusBadge";
import { toast } from "react-toastify";
import FlagBadge from "../../_components/FlagBadge";
import { useDispatch, useSelector } from "react-redux";
import { addMissingFile } from "./../../../../../redux/missingFilesSlice";
import { FaBriefcase, FaUser } from "react-icons/fa";
import { formatName } from "utils/helpers";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { useModalColors } from "hooks/useModalColors";

const CandidateCard = ({ candidate, refetch, mode }) => {
  const colors = useModalColors();
  const {
    name,
    position,
    email,
    whatsApp,
    phone,
    resume,
    status,
    invited,
    interviewDate,
    interviewTime,
    gender,
    experienceYears,
    createdAt,
  } = candidate;
  const [isApplicationOpen, setApplicationOpen] = useState(false);
  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  const dispatch = useDispatch();
  const missingFiles = useSelector((state) => state.missingFiles.missingFiles);

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

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
        entityId: candidate._id,
        status: "success",
        message: `Candidate ${candidate.name}’s CV viewed by ${user?.fullName}.`,
      });
    } catch (error) {
      console.error("Error viewing CV:", error);
      toast.error("Failed to retrieve the CV. Please try again later.");
    }
  };

  const handleDownloadCV = async (resume) => {
    try {
      const pdfURL = `${constant["baseUrl"]}${resume}`;
      if (missingFiles.includes(resume)) {
        toast.error("CV could not be downloaded");
        return;
      }

      const response = await fetch(pdfURL, { method: "HEAD" });

      if (!response.ok) {
        dispatch(addMissingFile(resume));
        toast.error("CV could not be downloaded");
        return;
      }

      const link = document.createElement("a");
      link.href = pdfURL;
      link.download = pdfURL.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Hiring",
        entityType: "Application",
        entityId: candidate._id,
        status: "success",
        message: `Candidate ${candidate.name}’s CV downloaded by ${user?.fullName}.`,
      });
    } catch (error) {
      console.error("Error viewing CV:", error);
      toast.error("Failed to retrieve the CV. Please try again later.");
    }
  };

  const handleViewApplication = () => {
    setApplicationOpen(true);
    createUserLog({
      userId: user?._id,
      action: "VIEW",
      entity: "Hiring",
      entityType: "Application",
      entityId: candidate?._id,
      status: "success",
      message: `Candidate ${candidate.name}’s details viewed by ${user?.fullName}.`,
    });
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

  const statusColor = getStatusColor(status);

  return (
    <>
      <Box
        border="1px solid"
        borderColor={colors.borderColor}
        bg={colors.bg}
        borderRadius="lg"
        p={4}
        boxShadow={colors.cardShadow}
        width="full"
        minW={0}
        maxW="100%"
        overflow="hidden"
        alignSelf="stretch"
        transition="all 0.2s ease"
        _hover={{
          borderColor: colors.accentGold,
          transform: "translateY(-2px)",
          boxShadow: colors.modalShadow,
        }}
      >
        <Box mb="4">
          <Flex alignItems="flex-start" gap="2" justifyContent="space-between">
            <Box>
              <Heading
                width="10rem"
                size="sm"
                isTruncated
                color={colors.headingText}
              >
                {formatName(name)}
              </Heading>

              <Text
                color={colors.mutedText}
                textDecoration="underline"
                fontSize="0.8rem"
                mb="4"
                isTruncated
                width={{ base: "12rem", lg: "10rem" }}
              >
                {email}
              </Text>
            </Box>

            <Button
              bg={colors.accentGold}
              color={colors.headerText}
              py="6px"
              px="12px"
              fontSize="0.85rem"
              fontWeight="medium"
              shadow="sm"
              rounded="full"
              _hover={{
                bg: colors.goldLight,
                transform: "translateY(-1px)",
                boxShadow: colors.goldGlow,
              }}
              _active={{ bg: colors.goldDark }}
              w="83px"
              h="30px"
              display="flex"
              gap="4px"
              alignItems="center"
              justifyContent="center"
              disabled={missingFiles.includes(resume)}
              onClick={() => handleViewCV(resume)}
              transition="all 0.2s ease"
            >
              <FaEye size={14} />
              <span>CV</span>
            </Button>
          </Flex>

          <HStack justifyContent="space-between">
            <Flex flexDirection="column" gap="1" py="10px">
              {mode !== "interview" && (
                <Flex gap="2" alignItems="center">
                  <StatusBadge status={status} color={statusColor} size={8} />
                  <FlagBadge item={candidate} />
                </Flex>
              )}

              <HStack justifyContent="space-between">
                <Box>
                  <Flex
                    alignItems="center"
                    gap="1"
                    fontSize="0.8rem"
                    fontWeight="semibold"
                    color={colors.bodyText}
                  >
                    <FaWhatsapp style={{ marginRight: "4px" }} color={colors.accentGold} />
                    <p>{whatsApp}</p>
                  </Flex>
                  <Flex
                    alignItems="center"
                    gap="1"
                    fontSize="0.8rem"
                    fontWeight="semibold"
                    color={colors.bodyText}
                  >
                    <FaPhone color={colors.accentGold} />
                    {phone}
                  </Flex>
                </Box>

                <Flex flexDir="column">
                  <Flex
                    alignItems="center"
                    gap="1"
                    fontSize="0.8rem"
                    fontWeight="semibold"
                    color={colors.bodyText}
                  >
                    <Icon as={FaUser} boxSize="3" color={colors.accentGold} />
                    <Text>{gender || "N/A"}</Text>
                  </Flex>
                  <Flex
                    alignItems="center"
                    gap="1"
                    fontSize="0.8rem"
                    fontWeight="semibold"
                    color={colors.bodyText}
                  >
                    <Icon as={FaBriefcase} boxSize="3" color={colors.accentGold} />
                    <Text>{experienceYears} years</Text>
                  </Flex>
                </Flex>
              </HStack>
            </Flex>
          </HStack>

          <Flex alignItems="center" gap="1" fontSize="sm" color={colors.bodyText} mb={2}>
            <span style={{ color: colors.mutedText, marginRight: "4px", fontWeight: "lighter" }}>
              Job Role
            </span>
            <Text fontWeight="semibold" color={colors.headingText}>
              <span>{position?.name}</span>
            </Text>
          </Flex>

          <Flex justify="space-between">
            <Button
              bg={colors.accentGold}
              color={colors.headerText}
              py="6px"
              px="12px"
              fontSize="0.85rem"
              fontWeight="medium"
              shadow="md"
              rounded="full"
              _hover={{
                bg: colors.goldLight,
                transform: "translateY(-1px)",
                boxShadow: colors.goldGlow,
              }}
              _active={{ bg: colors.goldDark }}
              w="83px"
              h="30px"
              onClick={handleViewApplication}
              transition="all 0.2s ease"
            >
              View
            </Button>
            <Button
              bg={colors.accentGold}
              color={colors.headerText}
              h="6"
              py="6px"
              px="12px"
              fontSize="xs"
              fontWeight="normal"
              shadow="sm"
              rounded="md"
              _hover={{
                bg: colors.goldLight,
                transform: "translateY(-1px)",
                boxShadow: colors.goldGlow,
              }}
              _active={{ bg: colors.goldDark }}
              onClick={() => onHistoryOpen()}
              transition="all 0.2s ease"
            >
              <FaClockRotateLeft />
            </Button>
          </Flex>
        </Box>

        <Box textAlign="right" fontSize="sm" color={colors.bodyText}>
          {invited || mode === "interview" ? (
            <Flex fontSize="xs" alignItems="center" justifyContent="flex-end" gap={1}>
              <Text color={colors.mutedText} fontWeight="light">
                interview on
              </Text>
              <Text color={colors.headingText}>
                {format(new Date(interviewDate), "EEE, MMM d, yyyy")}
              </Text>
              <span>{interviewTime}</span>
            </Flex>
          ) : (
            <Flex fontSize="xs" alignItems="center" justifyContent="flex-end" gap={1}>
              <Text color={colors.mutedText} fontWeight="light">
                applied on
              </Text>
              <Text color={colors.headingText}>
                {format(new Date(createdAt), "EEE, MMM d, yyyy h:mm a")}
              </Text>
            </Flex>
          )}
        </Box>
      </Box>

      {isApplicationOpen && (
        <CandidateView
          isOpen={isApplicationOpen}
          onClose={() => setApplicationOpen(false)}
          candidate={candidate}
          onViewCV={handleViewCV}
          onDownloadCV={handleDownloadCV}
          missingFiles={missingFiles}
          refetch={refetch}
        />
      )}
      {isHistoryOpen && (
        <CandidateStatusHistory
          isOpen={isHistoryOpen}
          onClose={onHistoryClose}
          candidate={candidate}
        />
      )}
    </>
  );
};

export default CandidateCard;