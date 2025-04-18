"use client"
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
} from "@chakra-ui/react";
import IncomingTable from "./Component/IncomingTable"
import OutgoingTable from "./Component/OutgoingTable"
import { useFetchItemsQuery } from "api/apiSlice";

const Expenses = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const { data: SummaryData, isLoading, isError,refetch } = useFetchItemsQuery( { path: `/expenses/summary`, params:{month:4,year:2025} },
    { refetchOnMountOrArgChange: true, skip: !user._id });
  
    return (
      <Box p={2}>
        <Tabs variant="unstyled">
          <TabList gap={3} mx={3}>
            <Tab _selected={{ bg: "goldenrod", color: "white" }} bg={"white"} borderRadius={10}>Incoming Cash</Tab>
            <Tab _selected={{ bg: "goldenrod", color: "black" }} bg={"white"} borderRadius={10}>Outgoing Cash</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <IncomingTable />
            </TabPanel>
            <TabPanel>
              <OutgoingTable />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex justifyContent={"end"} m={5}>
          <Box mt={10} p={1}  borderRadius="md" w={"500px"} maxWidth={"500px"} bg={"white"}>
            <VStack align="center" p={5}>
              <HStack w="100%">
                <Text color="green.500" fontWeight="bold">Incoming Cash</Text>
                <Spacer />
                <Text color="green.500">{SummaryData && SummaryData?.data?.totalIncomingAmount ? SummaryData.data.totalIncomingAmount : 0}</Text>
              </HStack>
              <Divider />
              <HStack w="100%">
                <Text color="red.500" fontWeight="bold">Outgoing Cash</Text>
                <Spacer />
                <Text color="red.500">{SummaryData && SummaryData?.data?.totalOutgoingAmount ? SummaryData.data.totalOutgoingAmount : 0}</Text>
              </HStack>
              <Divider />
              <HStack w="100%">
                <Text fontWeight="bold">Total Profit</Text>
                <Spacer />
                <Text fontWeight="bold">{SummaryData && SummaryData?.data?.totalProfit ? SummaryData.data.totalProfit : 0}</Text>
              </HStack>
            </VStack>
          </Box>
        </Flex>
      </Box>
    );
  };
  
  export default Expenses;