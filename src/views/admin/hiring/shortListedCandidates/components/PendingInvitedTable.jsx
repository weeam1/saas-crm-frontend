import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import TableLoading from "components/loading/TableLoading";
import MailIcon from "./MailIcon";
import FlagBadge from "../../_components/FlagBadge";
import { format } from "date-fns";
import { useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import CandidateStatusHistory from "../../_components/CandidateStatusHistory";
import { useModalColors } from "hooks/useModalColors";

const PendingInvitedTable = ({
  headers,
  data,
  loading,
  handleSort,
  sortConfig,
  handleViewCandidate,
  handleArrangeInterview,
  handleOpenFeedbackNote,
}) => {
  const colors = useModalColors();
  const {
    isOpen: isApplicationHistoryOpen,
    onOpen: onApplicationHistoryOpen,
    onClose: onApplicationHistoryClose,
  } = useDisclosure();

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <>
      <Box
              maxHeight="70vh"
      minH="70vh"
        overflowY="auto"
        scrollBehavior="smooth"
        borderRadius="xl"
        boxShadow={colors.cardShadow}
        bg={colors.bg}
        border="1px solid"
        borderColor={colors.borderColor}
      >
        <Table variant="simple" size="md" width="100%">
          <Thead position="sticky" top={0} bg={colors.bgDeep} zIndex={1}>
            <Tr>
              {headers?.map((header) => (
                <Th
                  key={header.key}
                  textAlign="center"
                  color={colors.headingText}
                  width={header.width || "150px"}
                  whiteSpace="nowrap"
                  py={4}
                  px={3}
                  fontSize="xs"
                  fontWeight="semibold"
                  letterSpacing="wider"
                  textTransform="capitalize"
                  borderBottom={`2px solid ${colors.borderColor}`}
                >
                  <Flex align="center" justify="space-evenly" gap="4">
                    <Text>{header.label}</Text>
                    {header.key !== "action" && (
                      <IconButton
                        aria-label="Sort"
                        size="xs"
                        icon={
                          sortConfig.key === header.key &&
                          sortConfig.direction === "asc" ? (
                            <TriangleUpIcon />
                          ) : (
                            <TriangleDownIcon />
                          )
                        }
                        onClick={() => handleSort(header.key)}
                        variant="ghost"
                        color={colors.bodyText}
                        _hover={{
                          color: colors.accentGold,
                          bg: colors.secondaryBtnHoverBg,
                        }}
                      />
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <TableLoading columns={headers} length={8} />
            ) : data && data?.length ? (
              data?.map((item, index) => (
                <Tr
                  key={index}
                  fontSize="sm"
                  _hover={{ bg: colors.bgInputHover }}
                  bg={colors.bg}
                  transition="background-color 0.2s ease-in-out"
                >
                  <Td
                    minWidth="300px"
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                  >
                    <HStack gap="1">
                      <span>{item.name}</span>
                      <FlagBadge item={item} />
                    </HStack>
                  </Td>
                  <Td
                    minWidth="250px"
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.email}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item?.agency?.name ?? "N/A"}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.position?.name}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.phone}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.whatsApp}
                  </Td>
                  <Td
                    display="flex"
                    alignItems="center"
                    gap="2"
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    <p>
                      {item.interviewDate
                        ? format(new Date(item.interviewDate), "EEE, MMM d, yyyy")
                        : "N/A"}
                    </p>
                    <p>{item.interviewTime || ""}</p>
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                  >
                    <HStack gap="1" alignItems="center">
                      <Button
                        bg={colors.accentGold}
                        color={colors.headerText}
                        h="6"
                        py="2"
                        px="4"
                        fontSize="xs"
                        fontWeight="normal"
                        shadow="sm"
                        rounded="md"
                        _hover={{ bg: colors.goldLight }}
                        _active={{ bg: colors.goldDark }}
                        onClick={() => {
                          setSelectedCandidate(item);
                          onApplicationHistoryOpen();
                        }}
                      >
                        <FaClockRotateLeft />
                      </Button>
                      <Button
                        bg={colors.accentGold}
                        color={colors.headerText}
                        h="6"
                        py="2"
                        px="4"
                        fontSize="xs"
                        fontWeight="normal"
                        shadow="sm"
                        rounded="md"
                        _hover={{ bg: colors.goldLight }}
                        _active={{ bg: colors.goldDark }}
                        onClick={() => handleViewCandidate(item._id)}
                      >
                        View
                      </Button>
                      <Button
                        bg={colors.accentGold}
                        color={colors.headerText}
                        h="6"
                        py="2"
                        px="4"
                        fontSize="xs"
                        fontWeight="normal"
                        shadow="sm"
                        rounded="md"
                        _hover={{ bg: colors.goldLight }}
                        _active={{ bg: colors.goldDark }}
                        onClick={() => handleArrangeInterview(item._id)}
                      >
                        {item.interviewDate ? "Reschedule" : "Arrange Interview"}
                      </Button>
                      <MailIcon isRead={item.inviteAccepted} />
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={headers.length} py={10} textAlign="center" borderColor={colors.borderColor}>
                  <Text color={colors.mutedText} fontSize="sm" fontWeight="600">
                    No data found
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      {isApplicationHistoryOpen && selectedCandidate && (
        <CandidateStatusHistory
          isOpen={isApplicationHistoryOpen}
          onClose={() => {
            onApplicationHistoryClose();
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
        />
      )}
    </>
  );
};

export default PendingInvitedTable;