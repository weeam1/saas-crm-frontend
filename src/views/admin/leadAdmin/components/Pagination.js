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
}) => {
  const [gotoPage, setGotoPage] = useState(currentPage || "");

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

  const buttonStyle = {
    size: "sm",
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
  };

  return (
    <Box width="100%" bg="white" p={5} borderRadius="10px">
      <LeadsProgress totalLeads={totalItems} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <Flex
        direction={{ base: "column", md: "column", lg: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        gap={{ base: 2, lg: 3 }}
        width="100%"
        flexWrap={{ base: "wrap", lg: "nowrap" }}
      >
        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          p={{ base: 2, md: 3 }}
          width={{ base: "100%", md: "100%", lg: "auto" }}
          flex={{ base: "none", md: "none", lg: "1" }}
          minWidth={{ base: "100%", md: "100%", lg: "300px" }}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent={{ base: "center", md: "space-between" }}
            alignItems="center"
            width="100%"
            gap={{ base: 2, md: 3 }}
            flexWrap={{ base: "wrap", md: "wrap" }}
          >
            <HStack spacing={2} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleFirst}
                isDisabled={currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
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
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
              >
                Previous
              </Button>
            </HStack>

            <Flex
              direction={{ base: "column", md: "row" }}
              flex="1"
              justifyContent={{ base: "center", md: "space-around" }}
              alignItems="center"
              gap={{ base: 2, md: 3 }}
              width={{ base: "100%", md: "auto" }}
              flexWrap={{ md: "wrap" }}
            >
              <HStack spacing={1} fontWeight="medium" color="gray.800">
                <Text fontSize={{ base: "xs", md: "sm" }}>Go to</Text>
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
                >
                  <NumberInputField
                    aria-label="Go to page"
                    textAlign="center"
                    borderRadius="md"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleGoToBlur();
                      }
                    }}
                    border="2px solid"
                    borderColor="softGray.600"
                    _focus={{
                      outline: "none",
                      bg: "softGray.50",
                      border: "1px solid",
                      borderColor: "brand.500",
                    }}
                    _active={{ bg: "softGray.400" }}
                    fontSize={leadValueFontSize}
                  />
                </NumberInput>
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  of {Number(totalPagesForTab).toLocaleString()}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize={{ base: "xs", md: "sm" }}>Items per page:</Text>
                <Select
                  size="sm"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  width="70px"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Select>
              </HStack>

              <Text
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="medium"
                color="gray.800"
                textAlign={{ base: "center", md: "left" }}
              >
                Showing {startIndex} - {endIndex} of {totalItems}
              </Text>
            </Flex>

            <HStack spacing={2} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={
                  currentPage === totalPagesForTab || totalItems === 0
                }
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                rightIcon={<FaPlay />}
                aria-label="Next Page"
              >
                Next
              </Button>
              <Button
                {...buttonStyle}
                onClick={handleLast}
                isDisabled={
                  currentPage === totalPagesForTab || totalItems === 0
                }
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
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
          width={{ base: "100%", md: "100%", lg: "auto" }}
          flex={{ base: "none", md: "none", lg: "1" }}
          minWidth={{ base: "100%", md: "100%", lg: "200px" }}
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
        />
      )}
      <Divider borderColor="#E7E7E7" borderWidth="1px" my={4} />

      <Box mt={4}>
        <TabContent
          activeTab={activeTab}
          leadsdata={leads}
          loading={loading}
          approveChangeHandler={approveChangeHandler}
          isSearchActive={isSearchActive}
        />
      </Box>
    </Box>
  );
};

export default Pagination;
