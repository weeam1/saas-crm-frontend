import React, { useState } from "react";
import { HStack, Button, Text, Flex, Box } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import SearchBox from "./Search";
import Tabs from "./Tabs";
import TabContent from "./TabContent";
import SearchTags from "./searchTags";

const Pagination = () => {
  const totalPages = 10;
  const totalItems = 100;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All");

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handleFirst = () => setCurrentPage(1);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLast = () => setCurrentPage(totalPages);

  const buttonStyle = {
    size: "sm",
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
  };

  return (
    <Box width="100%" bg="white" p={5} borderRadius="10px">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <Flex
        direction={{ base: "column", md: "column", lg: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        gap={{ base: 2, lg: 3 }}
        width="100%" // Ensure Flex takes full width
        flexWrap={{ base: "wrap", lg: "nowrap" }} // Prevent wrapping issues on lg
      >
        {/* Pagination Controls Box */}
        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          p={{ base: 2, md: 3 }}
          width={{ base: "100%", md: "100%", lg: "auto" }} // Auto width on lg to fit content
          flex={{ base: "none", md: "none", lg: "1" }} // Flex grow on lg
          minWidth={{ base: "100%", md: "100%", lg: "200px" }}
        >
          <HStack
            spacing={{ base: 1, md: 3 }}
            wrap="wrap"
            justifyContent="center"
          >
            <Button
              {...buttonStyle}
              onClick={handleFirst}
              isDisabled={currentPage === 1}
              variant="solid"
              bg="softGray.600"
              color="black"
              py={{ base: 1, md: 2 }}
              px={{ base: 2, md: 5 }}
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
              leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
              aria-label="Previous Page"
            >
              Previous
            </Button>
            <Text fontSize={{ base: "xs", md: "sm" }}>
              Page {currentPage} of {totalPages}
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }}>
              Showing {startIndex} - {endIndex} of {totalItems}
            </Text>
            <Button
              {...buttonStyle}
              onClick={handleNext}
              isDisabled={currentPage === totalPages}
              variant="solid"
              bg="softGray.600"
              color="black"
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
              py={{ base: 1, md: 2 }}
              px={{ base: 2, md: 5 }}
              rightIcon={<IoPlaySkipForwardSharp />}
              aria-label="Last Page"
            >
              Last
            </Button>
          </HStack>
        </Box>

        {/* Search Box */}
        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          p={{ base: 2, md: 3 }}
          width={{ base: "100%", md: "100%", lg: "auto" }} // Auto width on lg to fit content
          flex={{ base: "none", md: "none", lg: "1" }} // Flex grow on lg
          minWidth={{ base: "100%", md: "100%", lg: "200px" }}
          maxWidth={{ lg: "470px" }} 
          mt={{ base: 2, lg: 0 }}
        >
          <SearchBox />
        </Box>
      </Flex>

      <Box mt={4}>
        <TabContent activeTab={activeTab} />
      </Box>
    </Box>
  );
};

export default Pagination;
