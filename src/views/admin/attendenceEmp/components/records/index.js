import React from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Input,
  Icon,
  Text,
  Flex,
  IconButton,
  Select,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from "@chakra-ui/icons";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiEqualizerLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
const attendanceData = [
  {
    id: "2341421",
    employee: "Ahmed Roshdan",
    role: "Help Desk Executive",
    type: "Web",
    location: "Dubai",
    date: "1 Jun 2025",
    status: "Office",
    checkIn: "09:00",
    checkOut: "18:00",
    workHours: "10h 2m",
  },
  {
    id: "3411421",
    employee: "Ali Alhamdan",
    role: "Senior Executive",
    type: "Fingerprint",
    location: "Dubai",
    date: "2 Jun 2025",
    status: "Absent",
    checkIn: "00:00",
    checkOut: "00:00",
    workHours: "0m",
  },
  {
    id: "2341121",
    employee: "Mona Alghafar",
    role: "Senior Manager",
    type: "Web",
    location: "Dubai",
    date: "3 Jun 2025",
    status: "Late arrival",
    checkIn: "10:30",
    checkOut: "18:00",
    workHours: "8h 30m",
  },
  {
    id: "2341422",
    employee: "Moustafa Adel",
    role: "Manager",
    type: "Web",
    location: "Dubai",
    date: "4 Jun 2025",
    status: "Office",
    checkIn: "08:45",
    checkOut: "18:00",
    workHours: "9h 15m",
  },
  {
    id: "2341423",
    employee: "Jhon Neleson",
    role: "IT Support Specialist",
    type: "Web",
    location: "Dubai",
    date: "5 Jun 2025",
    status: "Office",
    checkIn: "09:00",
    checkOut: "18:00",
    workHours: "9h 0m",
  },
  {
    id: "2341424",
    employee: "Kadi Manela",
    role: "Database Administrator",
    type: "Fingerprint",
    location: "Dubai",
    date: "6 Jul 2025",
    status: "Office",
    checkIn: "09:00",
    checkOut: "18:00",
    workHours: "10h 12m",
  },
];

export default function Records() {
  return (
    <>
      <Box display="flex" alignItems="center" mb={4} bg="white" p={4}>
        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
          Attendance Records
        </Text>
      </Box>

      <Box bg="white" p={5} borderRadius="md" shadow="sm" h="1289px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
        >
          <Text
            fontWeight="bold"
            fontSize={{ base: "18px", md: "20px" }}
            fontFamily="Antic"
          >
            Attendance Overview
          </Text>
          <Box
            gap={4}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            w={{ base: "100%", md: "auto" }}
          >
            <Box
              display="flex"
              alignItems="center"
              bg="#F6F6F6"
              w={{ base: "100%", sm: "100%", md: "270px", lg: "470px" }}
              h="48px"
              px={3}
              borderRadius="md"
              border="1px solid #E2E8F0"
            >
              <Icon as={CiSearch} color="gray.500" mr={2} />
              <Input
                variant="unstyled"
                placeholder="Quick Search..."
                w="100%"
                fontSize="14px"
                fontWeight="400"
                color="gray.700"
              />
            </Box>
            <Button
              h="48px"
              leftIcon={<CalendarIcon />}
              bg="#D5D9DD"
              borderRadius="md"
              w={{ base: "100%", md: "auto", lg: "133px" }}
            >
              Jan 2025
            </Button>

            <Button
              h="48px"
              w={{ base: "100%", md: "160px", lg: "214px" }}
              leftIcon={<RiEqualizerLine />}
              bgGradient="linear(to-r, #4B74FF, #0043FF)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, #3A5FCC, #0033CC)" }}
              borderRadius="md"
            >
              Advanced Filters
            </Button>
          </Box>
        </Box>

        <Divider color="#D5D9DD" mb={4} />
        <Box overflowX="auto">
          <Table variant="simple" size="sm" bg="white" borderRadius="md">
            <Thead>
              <Tr>
                {[
                  "ID",
                  "Employee",
                  "Role",
                  "Type",
                  "Location",
                  "Date",
                  "Status",
                  "Check-in",
                  "Check-out",
                  "Work hours",
                ].map((header, index) => (
                  <Th key={index} whiteSpace="nowrap">
                    <Box display="flex" alignItems="center">
                      <Text
                        fontFamily="Antic"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                      >
                        {header}
                      </Text>
                      {[
                        "Type",
                        "Location",
                        "Status",
                        "Check-in",
                        "Check-out",
                        "Work hours",
                      ].includes(header) && <IoMdArrowDropdown />}
                    </Box>
                  </Th>
                ))}
              </Tr>
              <Tr>
                <Td colSpan={9} py={0}>
                  <Divider borderColor="gray.400" w="100%" my={2} />
                </Td>
              </Tr>
            </Thead>

            <Tbody>
              {attendanceData.map((entry, index) => {
                let textColor = "black";
                let rowBgGradient = "none";
                let statusBgColor = "transparent";

                if (entry.status === "Absent") {
                  statusBgColor = "#FFE5EE";
                  textColor = "#AA0000";
                } else if (entry.status === "Late arrival") {
                  statusBgColor = "#FFF8E7";
                  textColor = "#D5B500";
                  rowBgGradient = "linear(to-r, #E0F7FF, white)";
                } else if (entry.status === "Office") {
                  statusBgColor = "#E6EFFC";
                  textColor = "#0764E6";
                }

                return (
                  <Tr
                    key={entry.id}
                    _hover={{ bg: "gray.50" }}
                    borderBottom={
                      index === attendanceData.length - 1 ? "none" : "1px solid"
                    }
                    borderColor="gray.200"
                    bgGradient={rowBgGradient}
                  >
                    <Td
                      borderBottom="none"
                      py={4}
                      fontFamily="Anybody"
                      fontSize={{ base: "12px", md: "15px" }}
                      fontWeight="500"
                    >
                      {entry.id}
                    </Td>
                    <Td
                      borderBottom="none"
                      py={4}
                      fontFamily="Anybody"
                      fontSize={{ base: "12px", md: "15px" }}
                      fontWeight="500"
                    >
                      {entry.employee}
                    </Td>
                    <Td
                      borderBottom="none"
                      py={4}
                      fontFamily="Anybody"
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                    >
                      {entry.role}
                    </Td>
                    <Td
                      borderBottom="none"
                      py={4}
                      fontFamily="Anybody"
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                    >
                      {entry.type}
                    </Td>
                    <Td
                      borderBottom="none"
                      py={4}
                      fontFamily="Anybody"
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                    >
                      {entry.location}
                    </Td>
                    <Td borderBottom="none" py={4}>
                      {entry.date}
                    </Td>
                    <Td borderBottom="none" py={4}>
                      <Box
                        bg={statusBgColor}
                        color={textColor}
                        fontWeight="bold"
                        px={2}
                        py={1}
                        borderRadius="md"
                        display="inline-block"
                      >
                        {entry.status}
                      </Box>
                    </Td>
                    <Td
                      borderBottom="none"
                      py={4}
                      color={entry.checkIn === "00:00" ? "red.500" : "blue.500"}
                    >
                      {entry.checkIn}
                    </Td>
                    <Td
                      borderBottom="none"
                      py={4}
                      color={
                        entry.checkOut === "00:00" ? "red.500" : "blue.500"
                      }
                    >
                      {entry.checkOut}
                    </Td>
                    <Td
                      borderBottom="none"
                      py={4}
                      fontFamily="Anybody"
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                    >
                      {entry.workHours}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Divider borderColor="gray.400" w="100%" my={2} />
        </Box>
        <Flex justify="space-between" align="center" p={4} bg="white">
          <Text fontSize="sm" color="gray.600">
            Page 1 of 1
          </Text>
          <Flex align="center">
            <Flex align="center" mr={4}>
              <IconButton
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                size="sm"
                variant="ghost"
              />
              <Text mx={2} fontSize="sm">
                Page No
              </Text>
              <Input
                size="sm"
                width="40px"
                textAlign="center"
                value="01"
                readOnly
                fontSize="sm"
                color="gray.800"
              />
              <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                size="sm"
                variant="ghost"
              />
            </Flex>

            <Select
              size="sm"
              width="80px"
              bg="beige"
              borderRadius="md"
              w="105px"
            >
              <option value="30">Show 30</option>
              <option value="50">Show 50</option>
              <option value="100">Show 100</option>
            </Select>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
