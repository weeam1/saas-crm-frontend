import React, { useState } from "react";
import { HStack, Button, Text, Flex, Box } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import SearchBox from "./Search";
import Tabs from "./Tabs";
import TabContent from "./TabContent"; // Component to show selected tab content

const Pagination = () => {
  const totalPages = 10;
  const totalItems = 100;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All"); // Manage active tab

  // Calculate indices for the summary
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Handlers
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
    <Box width="100%">
      {/* Tabs Menu at the Top */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Pagination Controls */}
      <Flex justifyContent="space-between" alignItems="center" p={3} width="100%">
        {/* Pagination Controls (Left) */}
        <Box bg="softGray.50" border="1px solid" borderColor="softGray.600" borderRadius="md" p={3}>
          <HStack spacing={3}>
            <Button {...buttonStyle} onClick={handleFirst} isDisabled={currentPage === 1} variant="solid"
              bg="softGray.600" color="black" py="2" px="5"
              leftIcon={<IoPlaySkipForwardSharp style={{ transform: "rotate(180deg)" }} />}
              aria-label="First Page"
            >
              First
            </Button>
            <Button {...buttonStyle} onClick={handlePrevious} isDisabled={currentPage === 1} variant="solid"
              bg="softGray.600" color="black" leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
              aria-label="Previous Page"
            >
              Previous
            </Button>
            <Text>Page {currentPage} of {totalPages}</Text>
            <Text>Showing {startIndex} - {endIndex} of {totalItems}</Text>
            <Button {...buttonStyle} onClick={handleNext} isDisabled={currentPage === totalPages} variant="solid"
              bg="softGray.600" color="black" rightIcon={<FaPlay />}
              aria-label="Next Page"
            >
              Next
            </Button>
            <Button {...buttonStyle} onClick={handleLast} isDisabled={currentPage === totalPages} variant="solid"
              bg="softGray.600" color="black" py="2" px="5"
              rightIcon={<IoPlaySkipForwardSharp />}
              aria-label="Last Page"
            >
              Last
            </Button>
          </HStack>
        </Box>

        {/* Space between Pagination and Search */}
        <Box width="20px" />

        {/* Search Box (Right) */}
        <Box bg="softGray.50" border="1px solid" borderColor="softGray.600" borderRadius="md" p={3}>
          <SearchBox />
        </Box>
      </Flex>

      {/* Component Below Pagination (Dynamic Based on Active Tab) */}
      <TabContent activeTab={activeTab} />
    </Box>
  );
};

export default Pagination;
