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
import LeadsProgress from "./LeadProgress";

const Pagination = ({
  data,
  totalPages,
  totalLeads,
  isLoading,
  fetchData,
  fetchSearchedData,
  fetchAdvancedSearch,
  setCurrentState,
  currentState,
  pageSize,
  userData,
  user,
  dateTime,
  activeTab,
  setActiveTab,
  currentPage,
  setCurrentPage,
  setPageSize,
  setData,
  setTotalPages,
  setTotalLeads,
  setIsLoading,
  displaySearchData,
  setDisplaySearchData,sendRequest, buyLoading,
}) => {
  
  const [gotoPage, setGotoPage] = useState(currentPage || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const pageSizeOptions = [10, 25, 50, 100];

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalLeads);

  const handleFirst = () => {
    setCurrentPage(1);
    setGotoPage(1);
    if (displaySearchData) {
      fetchSearchedData(searchTerm, 1, pageSize);
    } else {
      fetchData(activeTab, 1, pageSize);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setGotoPage(currentPage - 1);
      if (displaySearchData) {
        fetchSearchedData(searchTerm, currentPage - 1, pageSize);
      } else {
        fetchData(activeTab, currentPage - 1, pageSize);
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setGotoPage(currentPage + 1);
      if (displaySearchData) {
        fetchSearchedData(searchTerm, currentPage + 1, pageSize);
      } else {
        fetchData(activeTab, currentPage + 1, pageSize);
      }
    }
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
    setGotoPage(totalPages);
    if (displaySearchData) {
      fetchSearchedData(searchTerm, totalPages, pageSize);
    } else {
      fetchData(activeTab, totalPages, pageSize);
    }
  };

  const handleGoToChange = (value) => {
    setGotoPage(value);
  };

  const handleGoToBlur = () => {
    const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPages));
    setCurrentPage(page);
    setGotoPage(page);
    if (displaySearchData) {
      fetchSearchedData(searchTerm, page, pageSize);
    } else {
      fetchData(activeTab, page, pageSize);
    }
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1);
    setGotoPage(1);
    if (displaySearchData) {
      fetchSearchedData(searchTerm, 1, newPageSize);
    } else {
      fetchData(activeTab, 1, newPageSize);
    }
  };

  const handleClearSearch = () => {
    setData([]);
    setTotalPages(0);
    setTotalLeads(0);
    setDisplaySearchData(false);
    setSearchTerm("");
    setTags([]);
    fetchData(activeTab, 1, pageSize);
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
      <LeadsProgress totalLeads={totalLeads} userData={userData} />
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
          {/* Pagination controls */}
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
                leftIcon={<IoPlaySkipForwardSharp style={{ transform: "rotate(180deg)" }} />}
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
                  onChange={(valueString) => setGotoPage(Number(valueString) || "")}
                  onBlur={handleGoToBlur}
                  min={1}
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
                  />
                </NumberInput>
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  of {Number(totalPages).toLocaleString()}
                </Text>
              </HStack>

              <HStack spacing={1} fontWeight="medium" color="gray.800">
                <Text fontSize={{ base: "xs", md: "sm" }}>Items per page:</Text>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  size="sm"
                  width="5rem"
                  bg="softGray.50"
                  border="1px solid softGray.600"
                  borderRadius="md"
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </HStack>

              <Text
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="medium"
                color="gray.800"
                textAlign={{ base: "center", md: "left" }}
              >
                Showing {startIndex} - {endIndex} of {totalLeads}
              </Text>
            </Flex>

            <HStack spacing={2} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={currentPage === totalPages}
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
                isDisabled={currentPage === totalPages}
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
            fetchSearchedData={fetchSearchedData}
            fetchAdvancedSearch={fetchAdvancedSearch}
            pageSize={pageSize}
            setData={setData}
            setTotalPages={setTotalPages}
            setTotalLeads={setTotalLeads}
            setIsLoading={setIsLoading}
            setDisplaySearchData={setDisplaySearchData}
            onClearSearch={handleClearSearch}
            isLoading={isLoading}
            setSearchTerm={setSearchTerm}
            setTags={setTags}
          />
        </Box>
      </Flex>
      {displaySearchData && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.800">
              Lead Search:
            </Text>
            <Text fontSize="sm" color="gray.600">
              {searchTerm || (tags.length > 0 ? tags.join(", ") : "No filters applied")}
            </Text>
          </HStack>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        </Flex>
      )}
      <Divider borderColor="#E7E7E7" borderWidth="1px" my={4} />
      <Box mt={4}>
        <TabContent activeTab={activeTab} data={data} isLoading={isLoading} pageSize={pageSize} sendRequest={sendRequest} buyLoading={buyLoading}  />
      </Box>

    </Box>
  );
};

export default Pagination;