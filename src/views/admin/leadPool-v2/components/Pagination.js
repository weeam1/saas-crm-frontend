<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
  setDisplaySearchData,
  sendRequest,
<<<<<<< HEAD
  buyLoading,
}) => {
  const [gotoPage, setGotoPage] = useState(currentPage || "");
=======
  cancelRequest,
  buyLoading,
}) => {
  const [gotoPage, setGotoPage] = useState(currentPage || 1);
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const pageSizeOptions = [10, 25, 50, 100];

<<<<<<< HEAD
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalLeads);

  const handleFirst = () => {
    if (isLoading) return; // Prevent action while loading
    setCurrentPage(1);
    setGotoPage(1);
    if (displaySearchData) {
      fetchSearchedData(searchTerm, 1, pageSize);
    } else {
      fetchData(activeTab, 1, pageSize);
    }
  };

  const handlePrevious = () => {
    if (isLoading || currentPage <= 1) return; // Prevent action while loading or at first page
    setCurrentPage(currentPage - 1);
    setGotoPage(currentPage - 1);
    if (displaySearchData) {
      fetchSearchedData(searchTerm, currentPage - 1, pageSize);
    } else {
      fetchData(activeTab, currentPage - 1, pageSize);
    }
  };

  const handleNext = () => {
    if (isLoading || currentPage >= totalPages) return; // Prevent action while loading or at last page
    setCurrentPage(currentPage + 1);
    setGotoPage(currentPage + 1);
    if (displaySearchData) {
      fetchSearchedData(searchTerm, currentPage + 1, pageSize);
    } else {
      fetchData(activeTab, currentPage + 1, pageSize);
    }
  };

  const handleLast = () => {
    if (isLoading) return; // Prevent action while loading
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
    if (isLoading) return; // Prevent action while loading
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
    if (isLoading) return; // Prevent action while loading
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
    if (isLoading) return; // Prevent action while loading
=======
  useEffect(() => {
    setGotoPage(currentPage);
  }, [currentPage, activeTab]);

  const startIndex = totalLeads > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalLeads);
  const totalPagesForTab = Math.max(1, totalPages);

  const handleNavigation = (page, fetchFn) => {
    if (isLoading) return;
    setCurrentPage(page);
    setGotoPage(page);
    fetchFn();
  };

  const handleFirst = () =>
    handleNavigation(1, () =>
      displaySearchData
        ? fetchSearchedData(searchTerm, 1, pageSize)
        : fetchData(activeTab, 1, pageSize)
    );

  const handlePrevious = () =>
    currentPage > 1 &&
    handleNavigation(currentPage - 1, () =>
      displaySearchData
        ? fetchSearchedData(searchTerm, currentPage - 1, pageSize)
        : fetchData(activeTab, currentPage - 1, pageSize)
    );

  const handleNext = () =>
    currentPage < totalPagesForTab &&
    handleNavigation(currentPage + 1, () =>
      displaySearchData
        ? fetchSearchedData(searchTerm, currentPage + 1, pageSize)
        : fetchData(activeTab, currentPage + 1, pageSize)
    );

  const handleLast = () =>
    handleNavigation(totalPagesForTab, () =>
      displaySearchData
        ? fetchSearchedData(searchTerm, totalPagesForTab, pageSize)
        : fetchData(activeTab, totalPagesForTab, pageSize)
    );

  const handleGoToChange = (value) => setGotoPage(value);

  const handleGoToBlur = () => {
    if (isLoading) return;
    const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPagesForTab));
    handleNavigation(page, () =>
      displaySearchData
        ? fetchSearchedData(searchTerm, page, pageSize)
        : fetchData(activeTab, page, pageSize)
    );
  };

  const handlePageSizeChange = (event) => {
    if (isLoading) return;
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    handleNavigation(1, () =>
      displaySearchData
        ? fetchSearchedData(searchTerm, 1, newPageSize)
        : fetchData(activeTab, 1, newPageSize)
    );
  };

  const handleClearSearch = () => {
    if (isLoading) return;
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
    setData([]);
    setTotalPages(0);
    setTotalLeads(0);
    setDisplaySearchData(false);
    setSearchTerm("");
    setTags([]);
<<<<<<< HEAD
    fetchData(activeTab, 1, pageSize);
=======
    setCurrentPage(1);
    setPageSize(50);
    setActiveTab("All");
    setIsLoading(true);
    fetchData("All", 1, 50);
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <Flex
        direction={{ base: "column", md: "column", lg: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        gap={{ base: 2, lg: 3 }}
        width="100%"
        flexWrap={{ base: "wrap", lg: "nowrap" }}
=======
      <Tabs
        userData={userData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
      />

      <Flex
        direction={{ base: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems="center"
        gap={3}
        width="100%"
        flexWrap="wrap"
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
      >
        <Box
          bg="softGray.50"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
<<<<<<< HEAD
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
=======
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
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
              <Button
                {...buttonStyle}
                onClick={handleFirst}
                isDisabled={isLoading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
<<<<<<< HEAD
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
=======
                px={{ base: 1, md: 2 }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
                leftIcon={
                  <IoPlaySkipForwardSharp
                    style={{ transform: "rotate(180deg)" }}
                  />
                }
                aria-label="First Page"
<<<<<<< HEAD
=======
                fontSize={{ base: "xs", md: "sm" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
              >
                Previous
=======
                px={{ base: 1, md: 2 }}
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
                fontSize={{ base: "xs", md: "sm" }}
              >
                Prev
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
              </Button>
            </HStack>

            <Flex
              direction={{ base: "column", md: "row" }}
              flex="1"
<<<<<<< HEAD
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
                  onChange={(valueString) =>
                    handleGoToChange(Number(valueString) || "")
                  }
                  onBlur={handleGoToBlur}
                  min={1}
                  size="sm"
                  borderRadius="md"
                  width="5rem"
                  bg="softGray.50"
                  border="1px solid softGray.600"
                  allowMouseWheel={false}
                  clampValueOnBlur={false}
=======
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
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
                  isDisabled={isLoading}
                >
                  <NumberInputField
                    aria-label="Go to page"
                    textAlign="center"
                    borderRadius="md"
<<<<<<< HEAD
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
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
                  isDisabled={isLoading}
=======
                    onKeyDown={(e) =>
                      e.key === "Enter" && !isLoading && handleGoToBlur()
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
                  isDisabled={isLoading}
                  fontSize={{ base: "2xs", md: "xs" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </HStack>

              <Text
<<<<<<< HEAD
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
                isDisabled={isLoading || currentPage === totalPages}
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                rightIcon={<FaPlay />}
                aria-label="Next Page"
=======
                fontSize={{ base: "2xs", md: "xs" }}
                fontWeight="medium"
                color="gray.800"
              >
                {startIndex}-{endIndex} of {totalLeads}
              </Text>
            </Flex>

            <HStack spacing={1} flexShrink={0}>
              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={
                  isLoading ||
                  currentPage === totalPagesForTab ||
                  totalLeads === 0
                }
                variant="solid"
                bg="softGray.600"
                color="black"
                px={{ base: "1", md: "2" }}
                rightIcon={<FaPlay />}
                aria-label="Next Page"
                fontSize={{ base: "xs", md: "sm" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
              >
                Next
              </Button>
              <Button
                {...buttonStyle}
                onClick={handleLast}
<<<<<<< HEAD
                isDisabled={isLoading || currentPage === totalPages}
                variant="solid"
                bg="softGray.600"
                color="black"
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
=======
                isDisabled={
                  isLoading ||
                  currentPage === totalPagesForTab ||
                  totalLeads === 0
                }
                variant="solid"
                bg="softGray.600"
                color="black"
                px={{ base: 1, md: 2 }}
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
                fontSize={{ base: "xs", md: "sm" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
          width={{ base: "100%", md: "100%", lg: "auto" }}
          flex={{ base: "none", md: "none", lg: "1" }}
          minWidth={{ base: "100%", md: "100%", lg: "200px" }}
=======
          flex="1"
          minWidth={{ base: "100%", lg: "200px" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
=======

>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
      {displaySearchData && (
        <Flex justifyContent="space-between" alignItems="center" p={3}>
          <HStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.800">
              Lead Search:
            </Text>
            <Text fontSize="sm" color="gray.600">
              {searchTerm ||
                (tags.length > 0 ? tags.join(", ") : "No filters applied")}
            </Text>
          </HStack>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={handleClearSearch}
            isDisabled={isLoading}
          >
            Clear
          </Button>
        </Flex>
      )}
<<<<<<< HEAD
      <Divider borderColor="#E7E7E7" borderWidth="1px" my={4} />
      <Box mt={4}>
        <TabContent
          activeTab={activeTab}
          data={data}
          isLoading={isLoading}
          pageSize={pageSize}
          sendRequest={sendRequest}
          buyLoading={buyLoading}
        />
      </Box>
=======

      <Divider borderColor="#E7E7E7" my={4} />
      <TabContent
        activeTab={activeTab}
        data={data}
        isLoading={isLoading}
        pageSize={pageSize}
        sendRequest={sendRequest}
        cancelRequest={cancelRequest}
        buyLoading={buyLoading}
        displaySearchData={displaySearchData}
      />
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
    </Box>
  );
};

export default Pagination;
