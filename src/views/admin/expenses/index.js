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
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
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
import IncomingTable from "./Component/IncomingTable";
import OutgoingTable from "./Component/OutgoingTable";
import { useFetchItemsQuery } from "api/apiSlice";
import { CalendarIcon, CloseIcon } from "@chakra-ui/icons";
import moment from "moment";

const Expenses = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [month, setMonth] = useState(moment().format("M"));
  const[selectionMonth, setSelectionMonth] = useState(moment().format("M"));
  const [year, setYear] = useState(moment().format("YYYY"));
  const [selectionYear, setSelectionYear] = useState(moment().format("YYYY"));
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data: SummaryData,
    isLoading,
    isError,
    refetch,
  } = useFetchItemsQuery(
    { path: `/expenses/summary`, params: { month: 4, year: 2025 } },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );
  const handleTabChange = (index) => {
    setActiveTab(index);
    setSelectionMonth(moment().format("M"));
    setSelectionYear(moment().format("YYYY"));
    setMonth(moment().format("M"));
    setYear(moment().format("YYYY"));
  };

  const handleClear = () => {
    setSelectionMonth(null);
    setSelectionYear(null);
    setMonth(null);
    setYear(null);
  };

  const getMonthName = (monthNumber) => {
    return moment()
      .month(monthNumber - 1)
      .format("MMMM");
  };

  const HandlerDateFilter = () =>{
    if (month && year) {
      setSelectionMonth(month);
      setSelectionYear(year);
      onClose();
      refetch(); 
    }

  }
  return (
    <Box>
      <Tabs variant="unstyled" index={activeTab} onChange={handleTabChange}>
        <TabList gap={3} mx={3} display={"flex"} justifyContent="space-between">
          <Box display={"flex"} gap={3}>
            <Tab
              _selected={{ bg: "goldenrod", color: "white" }}
              bg={"white"}
              borderRadius={10}
            >
              Incoming Cash
            </Tab>
            <Tab
              _selected={{ bg: "goldenrod", color: "black" }}
              bg={"white"}
              borderRadius={10}
            >
              Outgoing Cash
            </Tab>
          </Box>
          <Box>
            <HStack>
              {selectionMonth && selectionYear && (
                <HStack>
                  <IconButton
                    icon={<CloseIcon />}
                    aria-label="Clear date"
                    size="sm"
                    onClick={handleClear}
                    outline
                  />
                </HStack>
              )}
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
                  {selectionMonth && selectionYear && getMonthName(selectionMonth)} {selectionYear}
                </Text>
              </Box>
            </HStack>
          </Box>
        </TabList>
        <TabPanels>
          <TabPanel>
            <IncomingTable month={selectionMonth} year={selectionYear} />
          </TabPanel>
          <TabPanel>
            <OutgoingTable month={selectionMonth} year={selectionYear} />
          </TabPanel>
        </TabPanels>
      </Tabs>
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
                {SummaryData && SummaryData?.data?.totalIncomingAmount
                  ? SummaryData.data.totalIncomingAmount
                  : 0}
              </Text>
            </HStack>
            <Divider />
            <HStack w="100%">
              <Text color="red.500" fontWeight="bold">
                Outgoing Cash
              </Text>
              <Spacer />
              <Text color="red.500">
                {SummaryData && SummaryData?.data?.totalOutgoingAmount
                  ? SummaryData.data.totalOutgoingAmount
                  : 0}
              </Text>
            </HStack>
            <Divider />
            <HStack w="100%">
              <Text fontWeight="bold">Total Profit</Text>
              <Spacer />
              <Text fontWeight="bold">
                {SummaryData && SummaryData?.data?.totalProfit
                  ? SummaryData.data.totalProfit
                  : 0}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>

      {/* Modal for Month and Year selection */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Month and Year</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Select
                placeholder="Select Month"
                value={month || ""}
                onChange={(e) => setMonth(Number(e.target.value))}
                focusBorderColor="goldenrod"
                _hover={{ borderColor: "goldenrod" }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                    _hover={{ backgroundColor: "goldenrod" }}
                  >
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </Select>

              <Select
                placeholder="Select Year"
                value={year || ""}
                onChange={(e) => setYear(Number(e.target.value))}
                focusBorderColor="goldenrod"
                _hover={{ borderColor: "goldenrod" }}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <option
                      key={y}
                      value={y}
                      _hover={{ backgroundColor: "goldenrod" }}
                    >
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
                _active={{ bg: "goldenrod" }}
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
