import React, { useState } from "react";
import {
  HStack,
  Button,
  NumberInput,
  NumberInputField,
  Text,
  Flex,
  Box,
  Divider,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import SearchBox from "./Search";
import Tabs from "./Tabs";
import TabContent from "./TabContent";
import { leadValueFontSize } from "./constants";
import LeadsProgress from "./LeadProgress";

const Pagination = () => {
  const totalPages = 10;
  const totalItems = 100;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [gotoPage, setGotoPage] = useState(currentPage || "");
  const [activeTab, setActiveTab] = useState("All");
  const [totalLeads, setTotalLeads] = useState(0);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handleFirst = () => {
    setCurrentPage(1);
    setGotoPage(1);
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setGotoPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setGotoPage(currentPage + 1);
    }
  };
  const handleLast = () => {
    setCurrentPage(totalPages);
    setGotoPage(totalPages);
  };

  const handleGoToChange = (value) => {
    setGotoPage(value);
  };

  const handleGoToBlur = () => {
    const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPages));
    setCurrentPage(page);
    setGotoPage(page);
  };

  const buttonStyle = {
    size: "sm",
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
  };

  return (
    <Box width="100%" bg="white" borderRadius="8px">
      <LeadsProgress totalLeads={totalLeads} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <Flex
        direction={{ base: "column", md: "column", lg: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        gap={{ base: 2, lg: 3 }}
        width="100%"
        flexWrap={{ base: "wrap", lg: "nowrap" }}
      >
        {/* Pagination Controls Box */}
        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          p={{ base: 2, md: 3, lg: 5 }} // Increased padding on lg
          width={{ base: "100%", md: "100%", lg: "auto" }}
          flex={{ base: "none", md: "none", lg: "1" }}
          minWidth={{ base: "100%", md: "100%", lg: "300px" }}
          minHeight={{ lg: "80px" }} // Added minHeight for lg screens
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent={{ base: "center", md: "space-between" }}
            alignItems="center"
            width="100%"
            gap={{ base: 2, md: 3, lg: 4 }} // More spacing on lg
            flexWrap={{ base: "wrap", md: "wrap" }}
          >
            {/* Left Side: First and Previous Buttons */}
            <HStack spacing={2} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleFirst}
                isDisabled={currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2, lg: 3 }} // Increased padding for lg
                px={{ base: 2, md: 4, lg: 6 }} // Increased width for lg
                leftIcon={
                  <IoPlaySkipForwardSharp
                    style={{ transform: "rotate(180deg)" }}
                  />
                }
                aria-label="First Page"
              >
                First
              </Button>
              <Button
                {...buttonStyle}
                onClick={handlePrevious}
                isDisabled={currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2, lg: 3 }} // Increased padding for lg
                px={{ base: 2, md: 4, lg: 6 }} // Increased width for lg
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
              >
                Previous
              </Button>
            </HStack>

            {/* Middle: Go To and Showing */}
            <Flex
              direction={{ base: "column", md: "row" }}
              flex="1"
              justifyContent={{ base: "center", md: "space-around" }}
              alignItems="center"
              gap={{ base: 2, md: 3, lg: 4 }}
              width={{ base: "100%", md: "auto" }}
              flexWrap={{ md: "wrap" }}
            >
              <HStack spacing={1} fontWeight="medium" color="gray.800">
                <Text fontSize={{ base: "xs", md: "sm", lg: "md" }}>Go to</Text>
                <NumberInput
                  value={gotoPage}
                  onChange={(valueString) =>
                    setGotoPage(Number(valueString) || "")
                  }
                  onBlur={handleGoToBlur}
                  min={1}
                  size="sm"
                  borderRadius="md"
                  width="6rem"
                  bg="softGray.50"
                  border="1px solid softGray.600"
                >
                  <NumberInputField
                    aria-label="Go to page"
                    textAlign="center"
                    borderRadius="md"
                    border="2px solid"
                    borderColor="softGray.600"
                    _focus={{ outline: "none", borderColor: "brand.500" }}
                    fontSize={{ base: "sm", md: "md", lg: "lg" }} // Increased font size for lg
                  />
                </NumberInput>
                <Text fontSize={{ base: "xs", md: "sm", lg: "md" }}>
                  of {Number(totalPages).toLocaleString()}
                </Text>
              </HStack>

              <Text
                fontSize={{ base: "xs", md: "sm", lg: "md" }}
                fontWeight="medium"
                color="gray.800"
                textAlign={{ base: "center", md: "left" }}
              >
                Showing {startIndex} - {endIndex} of {totalItems}
              </Text>
            </Flex>

            {/* Right Side: Next and Last Buttons */}
            <HStack spacing={2} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={currentPage === totalPages}
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2, lg: 3 }}
                px={{ base: 2, md: 4, lg: 6 }}
                rightIcon={<FaPlay />}
                aria-label="Next Page"
              >
                Next
              </Button>
              <Button
                {...buttonStyle}
                onClick={handleLast}
                isDisabled={currentPage === totalPages}
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2, lg: 3 }}
                px={{ base: 2, md: 4, lg: 6 }}
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
              >
                Last
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* Search Box */}
        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          p={{ base: 2, md: 3 }}
          width={{ base: "100%", md: "100%", lg: "auto" }}
          flex={{ base: "none", md: "none", lg: "1" }}
          minWidth={{ base: "100%", md: "100%", lg: "200px" }}
          maxWidth={{ lg: "470px" }}
          mt={{ base: 2, lg: 0 }}
        >
          <SearchBox />
        </Box>
      </Flex>

      <Divider borderColor="#E7E7E7" borderWidth="1px" my={4} />

      <Box mt={4}>
        <TabContent activeTab={activeTab} onTotalLeadsChange={setTotalLeads} />
      </Box>
    </Box>
  );
};

export default Pagination;
