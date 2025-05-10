"use client";
import { useState, useEffect } from "react";
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

import IncomingTable from "./Component/IncomingTable";
import OutgoingTable from "./Component/OutgoingTable";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";
import { useFetchItemsQuery } from "api/apiSlice";

const DEFAULT_TAB = "incoming-cash";

const Expenses = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [month, setMonth] = useState(moment().format("M"));
  const [year, setYear] = useState(moment().format("YYYY"));
  const [selectionMonth, setSelectionMonth] = useState(moment().format("M"));
  const [selectionYear, setSelectionYear] = useState(moment().format("YYYY"));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;

  const tabsList = ["incoming-cash", "outgoing-cash"];
  const initialIndex = tabsList.indexOf(tabFromParams.toLowerCase());
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  const [tabKey, setTabKey] = useState(0);

  const {
    data: SummaryData,
    isLoading,
    isError,
    refetch,
  } = useFetchItemsQuery(
    { path: `/expenses/summary`, params: { month, year } },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const tabsData = [
    {
      label: "Incoming Cash",
      component: (
        <IncomingTable
          key={tabKey}
          month={selectionMonth}
          year={selectionYear}
          refetchSummary={refetch}
        />
      ),
    },
    {
      label: "Outgoing Cash",
      component: (
        <OutgoingTable
          key={tabKey}
          month={selectionMonth}
          year={selectionYear}
          refetchSummary={refetch}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, []);

  const handleTabChange = (index) => {
    const newTab = tabsData[index].label.toLowerCase().replace(/\s/g, "-");
    setSearchParams({ tab: newTab });

    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1);
    } else {
      setActiveTabIndex(index);
    }

    const currentMonth = moment().format("M");
    const currentYear = moment().format("YYYY");
    setSelectionMonth(currentMonth);
    setSelectionYear(currentYear);
    setMonth(currentMonth);
    setYear(currentYear);
  };

  const getMonthName = (monthNumber) => {
    return moment().month(monthNumber - 1).format("MMMM");
  };

  const HandlerDateFilter = () => {
    if (month && year) {
      setSelectionMonth(month);
      setSelectionYear(year);
      onClose();
      refetch();
    }
  };

  return (
    <Box>
      {/* Date Filter UI */}
      <Box display={"flex"} justifyContent={"flex-end"} mr={"15px"}>
        <HStack>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={1}
            px={2}
            py={1}
            borderRadius={"10px"}
            border={"1px solid #D5D9DD"}
            cursor={"pointer"}
            onClick={onOpen}
          >
            <IconButton
              icon={<CalendarIcon />}
              aria-label="Open date filter"
              color={"lightgray"}
              bg={"transparent"}
              _hover={"transparent"}
              _focus={"transparent"}
              size="sm"
            />
            <Text color={"lightgray"}>
              {selectionMonth && selectionYear && getMonthName(selectionMonth)}{" "}
              {selectionYear}
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* Tabs */}
      <Box mt={"-4%"}>
        <TabNavigationDisplay
          tabsData={tabsData}
          activeTab={activeTabIndex}
          onTabChange={handleTabChange}
        />
      </Box>

      {/* Summary Cards */}
      <Flex justifyContent={"end"} mx={4}>
        <Box
          p={1}
          borderRadius="md"
          w={"600px"}
          maxWidth={"650px"}
          bg={"white"}
        >
          <VStack align="center" p={2} fontSize={"23px"}>
            <HStack w="100%">
              <Text color="green.500" fontWeight="bold">
                Incoming Cash
              </Text>
              <Spacer />
              <Text color="green.500">
                {SummaryData?.data?.totalIncomingAmount || 0}
              </Text>
            </HStack>
            <Divider />
            <HStack w="100%">
              <Text color="red.500" fontWeight="bold">
                Outgoing Cash
              </Text>
              <Spacer />
              <Text color="red.500">
                {SummaryData?.data?.totalOutgoingAmount || 0}
              </Text>
            </HStack>
            <Divider />
            <HStack w="100%">
              <Text fontWeight="bold">Total Profit</Text>
              <Spacer />
              <Text fontWeight="bold">
                {SummaryData?.data?.totalProfit || 0}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>

      {/* Date Filter Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Month and Year</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Select
                placeholder="Select Month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                focusBorderColor="goldenrod"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </Select>

              <Select
                placeholder="Select Year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                focusBorderColor="goldenrod"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </Select>

              <Button
                bg="goldenrod"
                color="white"
                w="100%"
                _hover={{ bg: "goldenrod", opacity: 0.9 }}
                onClick={HandlerDateFilter}
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

export default Expenses;
