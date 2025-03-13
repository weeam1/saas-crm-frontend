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

  useEffect(() => {
    setGotoPage(currentPage);
  }, [currentPage, activeTab]);

  const totalPagesForTab = Math.max(1, totalPages);
  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const isSearchActive = !!searchQuery || Object.keys(formValues).length > 0;

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
    setGotoPage(value);
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
    setCurrentPage(1);
    setGotoPage(1);
  };

  const buttonStyle = {
    size: "sm",
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
  };

  return (
    <Box width="100%" bg="white" p={5} borderRadius="10px">
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
          maxHeight={{ md: "100px" }}
          overflow="auto"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            gap={1.5}
            flexWrap="wrap"
          >
            <HStack spacing={1} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleFirst}
                isDisabled={loading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                px={{ base: 1, md: 2 }}
                leftIcon={
                  <IoPlaySkipForwardSharp
                    style={{ transform: "rotate(180deg)" }}
                  />
                }
                aria-label="First Page"
                fontSize={{ base: "xs", md: "sm" }}
              >
                First
              </Button>
              <Button
                {...buttonStyle}
                onClick={handlePrevious}
                isDisabled={loading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                px={{ base: 1, md: 2 }}
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
                fontSize={{ base: "xs", md: "sm" }}
              >
                Previous
              </Button>
            </HStack>

            <Flex
              direction={{ base: "column", md: "row" }}
              flex="1"
              justifyContent="space-around"
              alignItems="center"
              gap={1}
              width={{ base: "100%", md: "auto" }}
              flexWrap="wrap"
            >
              <HStack spacing={0.5} fontWeight="medium" color="gray.800">
                <Text fontSize={{ base: "2xs", md: "xs" }}>Go to</Text>
                <NumberInput
                  value={gotoPage}
                  onChange={handleGoToChange}
                  onBlur={handleGoToBlur}
                  min={1}
                  max={totalPagesForTab}
                  size="xs"
                  width="4rem"
                  bg="softGray.50"
                  border="1px solid softGray.600"
                  isDisabled={loading}
                >
                  <NumberInputField
                    aria-label="Go to page"
                    textAlign="center"
                    borderRadius="md"
                    onKeyDown={(e) =>
                      e.key === "Enter" && !loading && handleGoToBlur()
                    }
                    border="1px solid"
                    borderColor="softGray.600"
                    _focus={{ borderColor: "brand.500" }}
                    fontSize={{ base: "2xs", md: "xs" }}
                    p={1}
                  />
                </NumberInput>
                <Text fontSize={{ base: "2xs", md: "xs" }}>
                  of {Number(totalPagesForTab).toLocaleString()}
                </Text>
              </HStack>

              <HStack spacing={0.5} fontWeight="medium" color="gray.800">
                <Text fontSize={{ base: "2xs", md: "xs" }}>Per page:</Text>
                <Select
                  size="xs"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  width="60px"
                  bg="softGray.50"
                  border="1px solid softGray.600"
                  isDisabled={loading}
                  fontSize={{ base: "2xs", md: "xs" }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Select>
              </HStack>

              <Text
                fontSize={{ base: "2xs", md: "xs" }}
                fontWeight="medium"
                color="gray.800"
              >
                {startIndex}-{endIndex} of {totalItems}
              </Text>
            </Flex>

            <HStack spacing={1} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={
                  loading ||
                  currentPage === totalPagesForTab ||
                  totalItems === 0
                }
                variant="solid"
                bg="softGray.600"
                color="black"
                px={{ base: 1, md: 2 }}
                rightIcon={<FaPlay />}
                aria-label="Next Page"
                fontSize={{ base: "xs", md: "sm" }}
              >
                Next
              </Button>
              <Button
                {...buttonStyle}
                onClick={handleLast}
                isDisabled={
                  loading ||
                  currentPage === totalPagesForTab ||
                  totalItems === 0
                }
                variant="solid"
                bg="softGray.600"
                color="black"
                px={{ base: 1, md: 2 }}
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
                fontSize={{ base: "xs", md: "sm" }}
              >
                Last
              </Button>
            </HStack>
          </Flex>
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
      <Divider borderColor="#E7E7E7" my={4} />

      <Box mt={4}>
        {searchNotFound && !loading ? (
          <Text color="red.500" fontSize="md" textAlign="center">
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
