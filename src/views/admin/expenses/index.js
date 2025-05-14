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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;
  const monthFromParams = searchParams.get("month") || moment().format("M");
  const yearFromParams = searchParams.get("year") || moment().format("YYYY");
  
  const [tempMonth, setTempMonth] = useState(monthFromParams);
  const [tempYear, setTempYear] = useState(yearFromParams);

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
    { path: `/expenses/summary`, params: { month: monthFromParams, year: yearFromParams } },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const tabsData = [
    {
      label: "Incoming Cash",
      component: (
        <IncomingTable
          key={tabKey}
          month={monthFromParams}
          year={yearFromParams}
          refetchSummary={refetch}
        />
      ),
    },
    {
      label: "Outgoing Cash",
      component: (
        <OutgoingTable
          key={tabKey}
          month={monthFromParams}
          year={yearFromParams}
          refetchSummary={refetch}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!searchParams.get("tab") || !searchParams.get("month") || !searchParams.get("year")) {
      const params = {
        tab: tabFromParams,
        month: monthFromParams,
        year: yearFromParams
      };
      setSearchParams(params);
    }
  }, []);

  const handleTabChange = (index) => {
    const newTab = tabsList[index];
    const params = {
      tab: newTab,
      month: monthFromParams,
      year: yearFromParams
    };
    setSearchParams(params);
    
    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1);
    } else {
      setActiveTabIndex(index);
    }
  };

  const getMonthName = (monthNumber) => {
    return moment().month(monthNumber - 1).format("MMMM");
  };

  const HandlerDateFilter = () => {
    const params = {
      tab: tabFromParams,
      month: tempMonth,
      year: tempYear
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
            onClick={handleOpenModal}
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
              {getMonthName(monthFromParams)} {yearFromParams}
            </Text>
          </Box>
        </HStack>
      </Box>

      <Box mt={"-4%"}>
        <TabNavigationDisplay
          tabsData={tabsData}
          activeTab={activeTabIndex}
          onTabChange={handleTabChange}
        />
      </Box>

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
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
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