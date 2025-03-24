import React, { useEffect, useState } from "react";
import {
  HStack,
  Button,
  NumberInput,
  NumberInputField,
  Text,
  Select,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { leadValueFontSize } from "./constants";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  refetching,
  loading,
  handlePageSize,
}) => {
  const [gotoPage, setGotoPage] = useState(currentPage ?? 1);

  // Ensure totalPages, currentPage, and itemsPerPage are valid numbers
  const safeTotalPages = totalPages && !isNaN(totalPages) ? totalPages : 1;
  const safeCurrentPage = currentPage && !isNaN(currentPage) ? currentPage : 1;
  const safeItemsPerPage =
    itemsPerPage && !isNaN(itemsPerPage) ? itemsPerPage : 6; // Default to 6 if undefined

  useEffect(() => {
    setGotoPage(safeCurrentPage);
  }, [safeCurrentPage]);

  // Calculate startIndex and endIndex with safe values
  const startIndex = (safeCurrentPage - 1) * safeItemsPerPage + 1;
  const endIndex = Math.min(
    safeCurrentPage * safeItemsPerPage,
    totalItems || 0
  );

  const handleFirst = () => {
    onPageChange(1);
    setGotoPage(1);
  };

  const handlePrevious = () => {
    if (safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
      setGotoPage(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < safeTotalPages) {
      onPageChange(safeCurrentPage + 1);
      setGotoPage(safeCurrentPage + 1);
    }
  };

  const handleLast = () => {
    onPageChange(safeTotalPages);
    setGotoPage(safeTotalPages);
  };

  const handleGoToChange = (value) => {
    setGotoPage(value);
  };

  const handleGoToBlur = () => {
    const page = Math.max(1, Math.min(Number(gotoPage) || 1, safeTotalPages));
    onPageChange(page);
    setGotoPage(page);
  };

  const buttonStyle = {
    size: "xs",
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
  };

  const pageSizeOptions = [25, 50, 100];

  return (
    <HStack
      spacing={3}
      p={2}
      gap="2"
      flexDirection={{ base: "row", md: "row", lg: "row" }}
      flexWrap="wrap"
      bg="softGray.50"
      border="1px solid"
      borderColor="softGray.600"
      borderRadius="md"
      align="center"
      justifyContent={{
        base: "center",
        md: "space-between",
        lg: "space-between",
      }}
      width="100%"
      maxWidth="100%"
      fontSize={leadValueFontSize}
    >
      <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
        <Button
          {...buttonStyle}
          onClick={handleFirst}
          isDisabled={safeCurrentPage === 1 || refetching}
          variant="solid"
          bg="softGray.600"
          color="black"
          py="2"
          px="5"
          leftIcon={
            <IoPlaySkipForwardSharp style={{ transform: "rotate(180deg)" }} />
          }
          aria-label="First Page"
        >
          First
        </Button>

        <Button
          {...buttonStyle}
          onClick={handlePrevious}
          isDisabled={safeCurrentPage === 1 || refetching}
          variant="solid"
          bg="softGray.600"
          color="black"
          leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
          aria-label="Previous Page"
        >
          Previous
        </Button>
      </HStack>

      <HStack fontWeight="medium" color="gray.800" spacing={1}>
        <Text>Go to</Text>
        <NumberInput
          value={gotoPage ?? 1}
          onChange={(valueString) => {
            const value = Number(valueString) || "";
            if (value <= (safeTotalPages ?? 999999999)) {
              setGotoPage(value);
            }
          }}
          onBlur={handleGoToBlur}
          min={1}
          max={safeTotalPages ?? 999999999}
          size="sm"
          borderRadius="md"
          width="5rem"
          bg="softGray.50"
          border="1px solid softGray.600"
          allowMouseWheel={false}
          clampValueOnBlur={false}
          isDisabled={refetching || loading}
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
            isDisabled={refetching || loading}
          />
        </NumberInput>

        <Text>of {Number(safeTotalPages).toLocaleString()}</Text>
      </HStack>

      <Text color="gray.800" fontSize={leadValueFontSize} fontWeight="medium">
        Showing {startIndex} - {endIndex} of {totalItems || 0}
      </Text>

      <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
        <Select
          size="sm"
          w={{ base: "32" }}
          value={safeItemsPerPage}
          color="gray.800"
          bg="softGray.400"
          borderRadius="md"
          border="2px solid"
          _focus={{ boxShadow: "0 0 0 1px softGray.500" }}
          onChange={handlePageSize}
          isDisabled={!totalItems || loading || refetching}
        >
          {totalItems > 0 ? (
            pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))
          ) : (
            <option value="0">No items</option>
          )}
        </Select>

        <Button
          {...buttonStyle}
          onClick={handleNext}
          isDisabled={safeCurrentPage >= safeTotalPages || refetching}
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
          isDisabled={safeCurrentPage >= safeTotalPages || refetching}
          variant="solid"
          bg="softGray.600"
          color="black"
          py="2"
          px="5"
          rightIcon={<IoPlaySkipForwardSharp />}
          aria-label="Last Page"
        >
          Last
        </Button>
      </HStack>
    </HStack>
  );
};

export default Pagination;
