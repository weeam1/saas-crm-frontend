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
import { buttonStyle } from "utils/btn";
import FlagBadge from "../../_components/FlagBadge";
import StatusBadge from "components/shared/StatusBadge";
import CandidateStatusHistory from "../../_components/CandidateStatusHistory";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useState } from "react";
import { useModalColors } from "hooks/useModalColors";

const ShortListedTable = ({
  headers,
  data,
  loading,
  isFetching,
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
              {headers.map((header) => (
                <Th
                  key={header.key}
                  textAlign="center"
                  color={colors.headingText}
                  width={header.width || "150px"}
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
            ) : data?.length > 0 ? (
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
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                  >
                    <HStack
                      gap="1"
                      alignItems="center"
                      justifyContent="space-between"
                    >
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
                        onClick={() => handleOpenFeedbackNote(item._id)}
                      >
                        Add Note
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
                      {item.isInterviewed ? (
                        <StatusBadge
                          status="Interviewed"
                          color={"green"}
                          size={4}
                        />
                      ) : (
                        <Button
                          bg={colors.accentGold}
                          color={colors.headerText}
                          flex={1}
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
                      )}
                      <MailIcon isRead={item.inviteAccepted} />
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              !loading && (
                <Tr>
                  <Td colSpan={headers.length} py={10} textAlign="center" borderColor={colors.borderColor}>
                    <Text color={colors.mutedText} fontSize="sm" fontWeight="600">
                      No data found
                    </Text>
                  </Td>
                </Tr>
              )
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

export default ShortListedTable;