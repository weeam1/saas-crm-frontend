"use client";
import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Divider,
  Spacer,
  IconButton,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

import OutgoingTable from "./Component/OutgoingTable";
import { useFetchItemsQuery } from "api/apiSlice";

const DEFAULT_TAB = "balance";

const ExpenseBalanceScreen = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;
  const monthFromParams = searchParams.get("month") || moment().format("M");
  const yearFromParams = searchParams.get("year") || moment().format("YYYY");

  const [tempMonth, setTempMonth] = useState(monthFromParams);
  const [tempYear, setTempYear] = useState(yearFromParams);

  const { data: SummaryData, refetch } = useFetchItemsQuery(
    {
      path: `/expensev2/outgoing-cash/summary`,
      params: { month: monthFromParams, year: yearFromParams },
    },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const getMonthName = (monthNumber) => {
    return moment()
      .month(monthNumber - 1)
      .format("MMMM");
  };

  const handleDateFilter = () => {
    const params = {
      tab: tabFromParams,
      month: tempMonth,
      year: tempYear,
    };
    setSearchParams(params);
    onClose();
    refetch();
  };

  const handleOpenModal = () => {
    setTempMonth(monthFromParams);
    setTempYear(yearFromParams);
    onOpen();
  };

  return (
    <Box>
      <Flex justifyContent="flex-end" mr={4}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          px={3}
          py={1}
          borderRadius="10px"
          bg="gray.500"
          color="white"
          boxShadow="md"
          cursor="pointer"
          transition="all 0.2s"
          border="none"
          onClick={handleOpenModal}
          _hover={{
            boxShadow: "lg",
            bg: "gray.600",
            transform: "scale(1.04)",
          }}
        >
          <IconButton
            icon={<CalendarIcon />}
            aria-label="Open date filter"
            color="white"
            bg="transparent"
            _hover={{ bg: "transparent", color: "white" }}
            _focus={{ bg: "transparent" }}
            size="sm"
          />
          <Text color="white" fontWeight="bold">
            {getMonthName(monthFromParams)} {yearFromParams}
          </Text>
        </Box>
      </Flex>

      <Box my={4}>
        <OutgoingTable
          month={monthFromParams}
          year={yearFromParams}
          refetchSummary={refetch}
        />
      </Box>

      <Flex justifyContent="end" mx={4}>
        <Box p={1} borderRadius="md" w="600px" maxWidth="650px" bg="white">
          <VStack align="center" p={2} fontSize="23px">
            <HStack w="100%">
              <Text color="green.500" fontWeight="bold">
                Balance
              </Text>
              <Spacer />
              <Text color="green.500">{SummaryData?.totalBalance || 0}</Text>
            </HStack>
            <Divider />
            <HStack w="100%">
              <Text color="red.500" fontWeight="bold">
                Outgoing Cash
              </Text>
              <Spacer />
              <Text color="red.500">{SummaryData?.totalExpenses || 0}</Text>
            </HStack>
            <Divider />
            <HStack w="100%">
              <Text fontWeight="bold">Total Remaining</Text>
              <Spacer />
              <Text fontWeight="bold">{SummaryData?.closingBalance || 0}</Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Month and Year</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Select
                placeholder="Select Month"
                value={tempMonth}
                onChange={(e) => setTempMonth(e.target.value)}
                focusBorderColor="goldenrod"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {moment().month(i).format("MMMM")}
                  </option>
                ))}
              </Select>

              <Select
                placeholder="Select Year"
                value={tempYear}
                onChange={(e) => setTempYear(e.target.value)}
                focusBorderColor="goldenrod"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = moment().year() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Select>

              <Button
                bg="goldenrod"
                color="white"
                w="100%"
                _hover={{ bg: "goldenrod", opacity: 0.9 }}
                onClick={handleDateFilter}
              >
                Apply
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExpenseBalanceScreen;
