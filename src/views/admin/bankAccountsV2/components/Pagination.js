import React, { useState, useEffect } from "react";
import {
  HStack,
  Button,
  NumberInput,
  NumberInputField,
  Text,
  Flex,
  Box,
  Select,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";

const Pagination = ({
  data,
  totalPages,
  totalLeads,
  isLoading,
  fetchData,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  setData,
  setTotalPages,
  setTotalLeads,
}) => {
  const [gotoPage, setGotoPage] = useState(currentPage || 1);
  const pageSizeOptions = [10, 25, 50, 100];

  useEffect(() => {
    setGotoPage(currentPage);
  }, [currentPage]);

  const startIndex = totalLeads > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalLeads);

  const handleNavigation = (page) => {
    if (isLoading || page < 1 || page > totalPages) return;
    fetchData("", page, pageSize);
  };

  const handleFirst = () => handleNavigation(1);
  const handlePrevious = () => handleNavigation(currentPage - 1);
  const handleNext = () => handleNavigation(currentPage + 1);
  const handleLast = () => handleNavigation(totalPages);

  const handleGoToChange = (value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setGotoPage(numValue);
    }
  };

  const handleGoToBlur = () => {
    if (isLoading) return;
    const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPages));
    handleNavigation(page);
  };

  const handlePageSizeChange = (event) => {
    if (isLoading) return;
    const newPageSize = Number(event.target.value);
    fetchData("", 1, newPageSize); // Update state via fetchData
  };

  const buttonStyle = {
    size: "sm",
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
    fontFamily: "DM Sans",
    fontSize: { base: "xs", md: "sm", lg: "14px" },
  };

  return (
    <Box width="100%" bg="white" p={5} borderRadius="10px">
      <Flex
        direction={{ base: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems="center"
        gap={3}
        width="100%"
        flexWrap="wrap"
      >
        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          p={{ base: 1, md: 2 }}
          flex="1"
          minWidth={{ base: "100%", lg: "300px" }}
          overflow="auto"
          fontFamily="DM Sans"
        >
          <HStack
            spacing={3}
            p={2}
            gap="2"
            flexDirection={{ base: "row", md: "row", lg: "row" }}
            flexWrap="wrap"
            bg="softGray.50"
            borderRadius="md"
            align="center"
            justifyContent="space-between"
            width="100%"
            maxWidth="100%"
          >
            <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
              <Button
                {...buttonStyle}
                onClick={handleFirst}
                isDisabled={isLoading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                py="1"
                px="3"
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
                isDisabled={isLoading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                py="1"
                px="3"
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
              >
                Previous
              </Button>
            </HStack>

            <HStack fontWeight="medium" color="gray.800" spacing={1}>
              <Text fontSize="12px">Go to</Text>
              <NumberInput
                value={gotoPage}
                onChange={handleGoToChange}
                onBlur={handleGoToBlur}
                min={1}
                max={totalPages}
                size="sm"
                borderRadius="md"
                width="5rem"
                bg="softGray.50"
                border="1px solid softGray.600"
                allowMouseWheel={false}
                clampValueOnBlur={false}
                isDisabled={isLoading}
              >
                <NumberInputField
                  aria-label="Go to page"
                  textAlign="center"
                  borderRadius="md"
                  onKeyDown={(e) => e.key === "Enter" && handleGoToBlur()}
                  border="2px solid"
                  borderColor="softGray.600"
                  _focus={{
                    outline: "none",
                    bg: "softGray.50",
                    border: "1px solid",
                    borderColor: "brand.500",
                  }}
                  _active={{ bg: "softGray.400" }}
                />
              </NumberInput>
              <Text fontSize="12px">of {totalPages.toLocaleString()}</Text>
            </HStack>

            <Text color="gray.800" fontWeight="medium" fontSize="12px">
              Showing {startIndex.toLocaleString()} -{" "}
              {endIndex.toLocaleString()} of {totalLeads.toLocaleString()}
            </Text>

            <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
              <Select
                size="sm"
                w={{ base: "32" }}
                value={pageSize}
                color="gray.800"
                bg="softGray.400"
                borderRadius="md"
                border="2px solid"
                _focus={{ boxShadow: "0 0 0 1px softGray.500" }}
                onChange={handlePageSizeChange}
                isDisabled={isLoading || totalLeads === 0}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </Select>
              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={isLoading || currentPage >= totalPages}
                variant="solid"
                bg="softGray.600"
                color="black"
                py="1"
                px="3"
                rightIcon={<FaPlay />}
                aria-label="Next Page"
              >
                Next
              </Button>
              <Button
                {...buttonStyle}
                onClick={handleLast}
                isDisabled={isLoading || currentPage >= totalPages}
                variant="solid"
                bg="softGray.600"
                color="black"
                py="1"
                px="3"
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
              >
                Last
              </Button>
            </HStack>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default Pagination;
