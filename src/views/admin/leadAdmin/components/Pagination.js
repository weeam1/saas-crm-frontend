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
  }, [currentPage, activeTab, pageSize]);

  const totalPagesForTab = Math.max(1, Math.ceil(totalItems / pageSize));
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
  };

  const buttonStyle = {
    size: { base: "xs", sm: "xs", md: "sm" },
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
    px: { base: 1, sm: 1, md: 2 },
    fontFamily: "DM Sans",
    fontSize: { base: "sm", sm: "xs", md: "sm" }, // Changed base to "sm", adjusted sm to "xs"
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
          maxHeight={{ md: "100px" }}
          overflow="auto"
          fontFamily="DM Sans"
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
                leftIcon={
                  <IoPlaySkipForwardSharp
                    style={{ transform: "rotate(180deg)" }}
                  />
                }
                aria-label="First Page"
                p="8px"
                fontFamily="DM Sans"
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
                p="8px"
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
                fontFamily="DM Sans"
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
                <Text
                  fontSize={{ base: "sm", sm: "xs", md: "xs" }} // Changed base to "sm"
                  fontFamily="DM Sans"
                >
                  Go to
                </Text>
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
                  fontFamily="DM Sans"
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
                    fontSize={{ base: "sm", sm: "xs", md: "xs" }} // Changed base to "sm"
                    p={1}
                  />
                </NumberInput>
                <Text
                  fontSize={{ base: "sm", sm: "xs", md: "xs" }} // Changed base to "sm"
                  fontFamily="DM Sans"
                >
                  of {Number(totalPagesForTab).toLocaleString()}
                </Text>
              </HStack>

              <HStack spacing={0.5} fontWeight="medium" color="gray.800">
                <Text
                  fontSize={{ base: "sm", sm: "xs", md: "xs" }}
                  fontFamily="DM Sans"
                >
                  Per page:
                </Text>
                <Select
                  w="65px"
                  borderRadius="5px"
                  size="xs"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  width="60px"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  isDisabled={loading}
                  fontFamily="DM Sans"
                  fontSize={{ base: "sm", sm: "xs", md: "xs" }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Select>
              </HStack>

              <Text
                fontSize={{ base: "sm", sm: "xs", md: "xs" }}
                fontWeight="medium"
                color="gray.800"
                fontFamily="DM Sans"
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
                rightIcon={<FaPlay />}
                aria-label="Next Page"
                fontFamily="DM Sans"
                p="8px"
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
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
                p="8px"
                fontFamily="DM Sans"
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
