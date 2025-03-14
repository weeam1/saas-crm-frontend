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
  cancelRequest,
  buyLoading,
}) => {
  const [gotoPage, setGotoPage] = useState(currentPage || 1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const pageSizeOptions = [10, 25, 50, 100];

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
    setData([]);
    setTotalPages(0);
    setTotalLeads(0);
    setDisplaySearchData(false);
    setSearchTerm("");
    setTags([]);
    setCurrentPage(1);
    setPageSize(50);
    setActiveTab("Buy Leads"); // Changed from "All" to "Buy Leads"
    setIsLoading(true);
    fetchData("Buy Leads", 1, 50); // Changed from "All" to "Buy Leads"
  };

  const buttonStyle = {
    size: "sm",
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
    fontFamily: "DM Sans",
    fontSize: { base: "xs", md: "sm", lg: "14px" }, // Smaller font for base/md, 14px for lg+
  };

  return (
    <Box width="100%" bg="white" p={5} borderRadius="10px">
      <LeadsProgress totalLeads={totalLeads} userData={userData} />
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
                isDisabled={isLoading || currentPage === 1}
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
                px={{ base: 1, md: 2 }}
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
              >
                Prev
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
                  fontFamily="DM Sans"
                  fontSize={{ base: "xs", md: "sm", lg: "14px" }}
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
                  isDisabled={isLoading}
                >
                  <NumberInputField
                    aria-label="Go to page"
                    textAlign="center"
                    borderRadius="md"
                    onKeyDown={(e) =>
                      e.key === "Enter" && !isLoading && handleGoToBlur()
                    }
                    border="1px solid"
                    borderColor="softGray.600"
                    _focus={{ borderColor: "brand.500" }}
                    fontFamily="DM Sans"
                    fontSize={{ base: "xs", md: "sm", lg: "14px" }}
                    p={1}
                  />
                </NumberInput>
                <Text
                  fontFamily="DM Sans"
                  fontSize={{ base: "xs", md: "sm", lg: "14px" }}
                >
                  of {Number(totalPagesForTab).toLocaleString()}
                </Text>
              </HStack>

              <HStack spacing={0.5} fontWeight="medium" color="gray.800">
                <Text
                  fontFamily="DM Sans"
                  fontSize={{ base: "xs", md: "sm", lg: "14px" }}
                >
                  Per page:
                </Text>
                <Select
                  size="xs"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  width="70px" // Changed from 60px to 100px
                  borderRadius="5px"
                  bg="white"
                  border="2px solid" // Added border thickness
                  borderColor="softGray.600" // Kept existing border color
                  isDisabled={isLoading}
                  fontFamily="DM Sans"
                  fontSize={{ base: "xs", md: "sm", lg: "14px" }}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </HStack>

              <Text
                fontFamily="DM Sans"
                fontSize={{ base: "xs", md: "sm", lg: "14px" }}
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
              >
                Next
              </Button>
              <Button
                {...buttonStyle}
                onClick={handleLast}
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
        <Flex justifyContent="space-between" alignItems="center" p={3}>
          <HStack spacing={2}>
            <Text
              fontFamily="DM Sans"
              fontSize={{ base: "sm", md: "md", lg: "14px" }}
              fontWeight="medium"
              color="gray.800"
            >
              Lead Search:
            </Text>
            <Text
              fontFamily="DM Sans"
              fontSize={{ base: "xs", md: "sm", lg: "14px" }}
              color="gray.600"
            >
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
            fontFamily="DM Sans"
            fontSize={{ base: "xs", md: "sm", lg: "14px" }}
          >
            Clear
          </Button>
        </Flex>
      )}

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
    </Box>
  );
};

export default Pagination;
