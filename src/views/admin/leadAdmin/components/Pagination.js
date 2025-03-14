import React, { useState, useEffect } from "react";
import {
  HStack,
  Button,
  NumberInput,
  NumberInputField,
  Text,
  Flex,
  Box,
  Divider,
  Select,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import SearchBox from "./Search";
import Tabs from "./Tabs";
import TabContent from "./TabContent";
import { leadValueFontSize } from "./constants";
import LeadsProgress from "./LeadProgress";
import ClearAdvancedSearchButton from "./ClearButton";

const Pagination = ({
  leads,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageSizeChange,
  activeTab,
  setActiveTab,
  loading,
  searchQuery,
  setSearchQuery,
  fetchAdvancedSearch,
  setSearchClear,
  setFormValues,
  isFormReset,
  setIsFormReset,
  setGetTagValues,
  clearAdvancedSearch,
  approveChangeHandler,
  formValues = {},
  isAgent,
  searchNotFound,
  isSuperAdmin,
}) => {
  const [gotoPage, setGotoPage] = useState(currentPage || 1);

  // Sync gotoPage with currentPage when it changes
  useEffect(() => {
    setGotoPage(currentPage);
  }, [currentPage, activeTab, pageSize]);

  // Calculate total pages based on totalItems and pageSize
  const totalPagesForTab = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const isSearchActive = !!searchQuery || Object.keys(formValues).length > 0;

  // Pagination handlers
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
    if (currentPage < totalPagesForTab) {
      setCurrentPage(currentPage + 1);
      setGotoPage(currentPage + 1);
    }
  };

  const handleLast = () => {
    setCurrentPage(totalPagesForTab);
    setGotoPage(totalPagesForTab);
  };

  const handleGoToChange = (value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setGotoPage(numValue);
    }
  };

  const handleGoToBlur = () => {
    const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPagesForTab));
    setCurrentPage(page);
    setGotoPage(page);
  };

  const handlePageSizeChange = (event) => {
    if (loading) return;
    const newPageSize = Number(event.target.value);
    onPageSizeChange(newPageSize);
    // Reset to first page when page size changes
    setCurrentPage(1);
    setGotoPage(1);
  };

  const buttonStyle = {
    size: { base: "xs", sm: "xs", md: "sm" },
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
    px: { base: 1, sm: 1, md: 2 },
    fontFamily: "DM Sans",
    fontSize: { base: "sm", sm: "xs", md: "sm" },
  };

  return (
    <Box
      width="100%"
      bg="white"
      p={5}
      borderRadius="10px"
      minHeight="100%"
      fontFamily="DM Sans"
    >
      <LeadsProgress
        totalLeads={totalItems}
        searchQuery={searchQuery}
        formValues={formValues}
        isSearchActive={isSearchActive}
      />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
            justifyContent={{
              base: "center",
              md: "space-between",
              lg: "space-between",
            }}
            width="100%"
            maxWidth="100%"
            fontSize={leadValueFontSize}
          >
            {/* First & Previous Buttons */}
            <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
              <Button
                {...buttonStyle}
                onClick={handleFirst}
                isDisabled={loading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                py="2"
                px="5"
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
                isDisabled={loading || currentPage === 1}
                variant="solid"
                  py="2"
                px="5"
                bg="softGray.600"
                color="black"
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
              >
                Previous
              </Button>
            </HStack>

            {/* Go To Page */}
            <HStack fontWeight="medium" color="gray.800" spacing={1}>
              <Text>Go to</Text>
              <NumberInput
                value={gotoPage}
                onChange={handleGoToChange}
                onBlur={handleGoToBlur}
                min={1}
                max={totalPagesForTab}
                size="sm"
                borderRadius="md"
                width="5rem"
                bg="softGray.50"
                border="1px solid softGray.600"
                allowMouseWheel={false}
                clampValueOnBlur={false}
                isDisabled={loading}
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
                  isDisabled={loading}
                />
              </NumberInput>
              <Text>of {totalPagesForTab.toLocaleString()}</Text>
            </HStack>

            {/* Showing range */}
            <Text
              color="gray.800"
              fontSize={leadValueFontSize}
              fontWeight="medium"
            >
              Showing {startIndex.toLocaleString()} -{" "}
              {endIndex.toLocaleString()} of {totalItems.toLocaleString()}
            </Text>

            {/* Page Size Selector and Next/Last Buttons */}
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
                isDisabled={loading || !totalItems}
              >
                {totalItems > 0 ? (
                  [25, 50, 80, 100]
                    .filter((size) => size <= totalItems)
                    .map((size) => (
                      <option key={size} value={size}>
                        Show {size}
                      </option>
                    ))
                ) : (
                  <option value={pageSize}>Show {pageSize}</option>
                )}
              </Select>

              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={loading || currentPage === totalPagesForTab}
                variant="solid"
                bg="softGray.600"
                py="2"
                px="5"
                color="black"
                rightIcon={<FaPlay />}
                aria-label="Next Page"
              >
                Next
              </Button>

              <Button
                {...buttonStyle}
                onClick={handleLast}
                isDisabled={loading || currentPage === totalPagesForTab}
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
        </Box>

        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          p={{ base: 2, md: 3 }}
          flex="1"
          minWidth={{ base: "100%", lg: "200px" }}
          maxWidth={{ lg: "470px" }}
          mt={{ base: 2, lg: 0 }}
          fontFamily="DM Sans"
        >
          <SearchBox
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
            fetchAdvancedSearch={fetchAdvancedSearch}
            setSearchClear={setSearchClear}
            setFormValues={setFormValues}
            isFormReset={isFormReset}
            setIsFormReset={setIsFormReset}
            pageSize={pageSize}
            setGetTagValues={setGetTagValues}
            loading={loading}
            clearAdvancedSearch={clearAdvancedSearch}
          />
        </Box>
      </Flex>

      {isSearchActive && (
        <ClearAdvancedSearchButton
          clearAdvancedSearch={clearAdvancedSearch}
          loading={loading}
          searchQuery={searchQuery}
          formValues={formValues}
        />
      )}
      <Divider borderColor="#E7E7E7" my={4} borderWidth="1.5px" />

      <Box mt={4} flex="1" overflow="auto" fontFamily="DM Sans">
        {searchNotFound && !loading ? (
          <Text
            color="red.500"
            fontSize={{ base: "sm", sm: "sm", md: "md" }}
            textAlign="center"
            fontFamily="DM Sans"
          >
            {searchNotFound}
          </Text>
        ) : (
          <TabContent
            activeTab={activeTab}
            leadsdata={leads}
            loading={loading || !leads}
            approveChangeHandler={approveChangeHandler}
            pageSize={pageSize}
          />
        )}
      </Box>
    </Box>
  );
};

export default Pagination;
