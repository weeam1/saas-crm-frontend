// import React, { useState, useEffect } from "react";
// import {
//   HStack,
//   Button,
//   NumberInput,
//   NumberInputField,
//   Text,
//   Flex,
//   Box,
//   Divider,
//   Select,
// } from "@chakra-ui/react";
// import { FaPlay } from "react-icons/fa";
// import { IoPlaySkipForwardSharp } from "react-icons/io5";
// import SearchBox from "./Search";
// import Tabs from "./Tabs";
// import TabContent from "./TabContent";
// import LeadsProgress from "./LeadProgress";
// import { CloseIcon } from "@chakra-ui/icons";

// const Pagination = ({
//   data,
//   totalPages,
//   totalLeads,
//   isLoading,
//   fetchData,
//   fetchSearchedData,
//   fetchAdvancedSearch,
//   setCurrentState,
//   currentState,
//   pageSize,
//   userData,
//   user,
//   dateTime,
//   activeTab,
//   setActiveTab,
//   currentPage,
//   setCurrentPage,
//   setPageSize,
//   setData,
//   setTotalPages,
//   setTotalLeads,
//   setIsLoading,
//   displaySearchData,
//   setDisplaySearchData,
//   sendRequest,
//   cancelRequest,
//   buyLoading,
// }) => {
//   const [gotoPage, setGotoPage] = useState(currentPage || 1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [tags, setTags] = useState([]);
//   const pageSizeOptions = [10, 25, 50, 100];

//   useEffect(() => {
//     if (!data && !isLoading) {
//       setIsLoading(true);
//       fetchData(activeTab || "Buy Leads", currentPage || 1, pageSize || 50);
//     }
//   }, [
//     data,
//     isLoading,
//     fetchData,
//     activeTab,
//     currentPage,
//     pageSize,
//     setIsLoading,
//   ]);

//   useEffect(() => {
//     setGotoPage(currentPage);
//   }, [currentPage]);

//   const startIndex = totalLeads > 0 ? (currentPage - 1) * pageSize + 1 : 0;
//   const endIndex = Math.min(currentPage * pageSize, totalLeads);
//   const totalPagesForTab = Math.max(1, Math.ceil(totalLeads / pageSize));

//   const handleNavigation = async (page, fetchFn) => {
//     if (isLoading) return;
//     setIsLoading(true);
//     setCurrentPage(page);
//     setGotoPage(page);
//     try {
//       await fetchFn();
//     } catch (error) {
//       console.error("Navigation error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFirst = () =>
//     handleNavigation(1, () =>
//       displaySearchData
//         ? fetchSearchedData(searchTerm, 1, pageSize)
//         : fetchData(activeTab, 1, pageSize)
//     );

//   const handlePrevious = () =>
//     currentPage > 1 &&
//     handleNavigation(currentPage - 1, () =>
//       displaySearchData
//         ? fetchSearchedData(searchTerm, currentPage - 1, pageSize)
//         : fetchData(activeTab, currentPage - 1, pageSize)
//     );

//   const handleNext = () =>
//     currentPage < totalPagesForTab &&
//     handleNavigation(currentPage + 1, () =>
//       displaySearchData
//         ? fetchSearchedData(searchTerm, currentPage + 1, pageSize)
//         : fetchData(activeTab, currentPage + 1, pageSize)
//     );

//   const handleLast = () =>
//     handleNavigation(totalPagesForTab, () =>
//       displaySearchData
//         ? fetchSearchedData(searchTerm, totalPagesForTab, pageSize)
//         : fetchData(activeTab, totalPagesForTab, pageSize)
//     );

//   const handleGoToChange = (value) => {
//     const numValue = Number(value);
//     if (!isNaN(numValue)) {
//       setGotoPage(numValue);
//     }
//   };

//   const handleGoToBlur = () => {
//     if (isLoading) return;
//     const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPagesForTab));
//     handleNavigation(page, () =>
//       displaySearchData
//         ? fetchSearchedData(searchTerm, page, pageSize)
//         : fetchData(activeTab, page, pageSize)
//     );
//   };

//   const handlePageSizeChange = (event) => {
//     if (isLoading) return;
//     const newPageSize = Number(event.target.value);
//     setPageSize(newPageSize);
//     handleNavigation(1, () =>
//       displaySearchData
//         ? fetchSearchedData(searchTerm, 1, newPageSize)
//         : fetchData(activeTab, 1, newPageSize)
//     );
//   };

//   const handleClearSearch = () => {
//     if (isLoading) return;
//     setData([]);
//     setTotalPages(0);
//     setSearchTerm("");
//     setTotalLeads(0);
//     setDisplaySearchData(false);
//     setSearchTerm("");
//     setTags([]);
//     setCurrentPage(1);
//     setPageSize(50);
//     setActiveTab("Buy Leads");
//     handleNavigation(1, () => fetchData("Buy Leads", 1, 50));
//   };

//   const buttonStyle = {
//     size: "sm",
//     borderRadius: "lg",
//     _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
//     _active: { bg: "softGray.500" },
//     sx: { svg: { fill: "brand.500" } },
//     fontFamily: "DM Sans",
//     fontSize: { base: "xs", md: "sm", lg: "14px" },
//   };

//   return (
//     <Box width="100%" bg="white" p={5} borderRadius="10px">
//       <LeadsProgress totalLeads={totalLeads} userData={userData} />
//       <Tabs
//         userData={userData}
//         activeTab={activeTab}
//         setActiveTab={(tab) => {
//           // Only proceed if the tab is different and not loading
//           if (tab !== activeTab && !isLoading) {
//             setData([]);
//             setActiveTab(tab);
//             setCurrentPage(1);
//             setDisplaySearchData(false);
//             handleNavigation(1, () => fetchData(tab, 1, pageSize));
//           }
//         }}
//         isLoading={isLoading}
//       />

//       <Flex
//         direction={{ base: "column", lg: "row" }}
//         justifyContent="space-between"
//         alignItems="center"
//         gap={3}
//         width="100%"
//         flexWrap="wrap"
//       >
//         <Box
//           bg="softGray.50"
//           border="1px solid"
//           borderColor="softGray.600"
//           borderRadius="md"
//           p={{ base: 1, md: 2 }}
//           flex="1"
//           minWidth={{ base: "100%", lg: "300px" }}
//           overflow="auto"
//           fontFamily="DM Sans"
//         >
//           <HStack
//             spacing={3}
//             p={2}
//             gap="2"
//             flexDirection={{ base: "row", md: "row", lg: "row" }}
//             flexWrap="wrap"
//             bg="softGray.50"
//             borderRadius="md"
//             align="center"
//             justifyContent={{
//               base: "center",
//               md: "space-between",
//               lg: "space-between",
//             }}
//             width="100%"
//             maxWidth="100%"
//           >
//             <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
//               <Button
//                 {...buttonStyle}
//                 onClick={handleFirst}
//                 isDisabled={isLoading || currentPage === 1}
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py="1"
//                 px="3"
//                 leftIcon={
//                   <IoPlaySkipForwardSharp
//                     style={{ transform: "rotate(180deg)" }}
//                   />
//                 }
//                 aria-label="First Page"
//               >
//                 First
//               </Button>

//               <Button
//                 {...buttonStyle}
//                 onClick={handlePrevious}
//                 isDisabled={isLoading || currentPage === 1}
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py="1"
//                 px="3"
//                 leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
//                 aria-label="Previous Page"
//               >
//                 Previous
//               </Button>
//             </HStack>

//             <HStack fontWeight="medium" color="gray.800" spacing={1}>
//               <Text fontSize="12px">Go to</Text>
//               <NumberInput
//                 value={gotoPage}
//                 onChange={handleGoToChange}
//                 onBlur={handleGoToBlur}
//                 min={1}
//                 max={totalPagesForTab}
//                 size="sm"
//                 borderRadius="md"
//                 width="5rem"
//                 bg="softGray.50"
//                 border="1px solid softGray.600"
//                 allowMouseWheel={false}
//                 clampValueOnBlur={false}
//                 isDisabled={isLoading}
//               >
//                 <NumberInputField
//                   aria-label="Go to page"
//                   textAlign="center"
//                   borderRadius="md"
//                   onKeyDown={(e) => e.key === "Enter" && handleGoToBlur()}
//                   border="2px solid"
//                   borderColor="softGray.600"
//                   _focus={{
//                     outline: "none",
//                     bg: "softGray.50",
//                     border: "1px solid",
//                     borderColor: "brand.500",
//                   }}
//                   _active={{ bg: "softGray.400" }}
//                   isDisabled={isLoading}
//                 />
//               </NumberInput>
//               <Text fontSize="12px">
//                 of {totalPagesForTab.toLocaleString()}
//               </Text>
//             </HStack>

//             <Text color="gray.800" fontWeight="medium" fontSize="12px">
//               Showing {startIndex.toLocaleString()} -{" "}
//               {endIndex.toLocaleString()} of {totalLeads.toLocaleString()}
//             </Text>

//             <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
//               <Select
//                 size="sm"
//                 w={{ base: "32" }}
//                 value={pageSize}
//                 color="gray.800"
//                 bg="softGray.400"
//                 borderRadius="md"
//                 border="2px solid"
//                 _focus={{ boxShadow: "0 0 0 1px softGray.500" }}
//                 onChange={handlePageSizeChange}
//                 isDisabled={isLoading || totalLeads === 0}
//               >
//                 {pageSizeOptions.map((size) => (
//                   <option key={size} value={size}>
//                     Show {size}
//                   </option>
//                 ))}
//               </Select>

//               <Button
//                 {...buttonStyle}
//                 onClick={handleNext}
//                 isDisabled={isLoading || currentPage >= totalPagesForTab}
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py="1"
//                 px="3"
//                 rightIcon={<FaPlay />}
//                 aria-label="Next Page"
//               >
//                 Next
//               </Button>

//               <Button
//                 {...buttonStyle}
//                 onClick={handleLast}
//                 isDisabled={isLoading || currentPage >= totalPagesForTab}
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py="1"
//                 px="3"
//                 rightIcon={<IoPlaySkipForwardSharp />}
//                 aria-label="Last Page"
//               >
//                 Last
//               </Button>
//             </HStack>
//           </HStack>
//         </Box>

//         <Box
//           bg="softGray.50"
//           border="1px solid"
//           borderColor="softGray.600"
//           borderRadius="md"
//           p={{ base: 2, md: 3 }}
//           flex="1"
//           minWidth={{ base: "100%", lg: "200px" }}
//           maxWidth={{ lg: "470px" }}
//           mt={{ base: 2, lg: 0 }}
//         >
//           <SearchBox
//             fetchSearchedData={fetchSearchedData}
//             fetchAdvancedSearch={fetchAdvancedSearch}
//             pageSize={pageSize}
//             setData={setData}
//             setTotalPages={setTotalPages}
//             setTotalLeads={setTotalLeads}
//             setIsLoading={setIsLoading}
//             setDisplaySearchData={setDisplaySearchData}
//             onClearSearch={handleClearSearch}
//             isLoading={isLoading}
//             setSearchTerm={setSearchTerm}
//             setTags={setTags}
//             searchTerm={searchTerm}
//           />
//         </Box>
//       </Flex>

//       {displaySearchData && (
//         <Flex justifyContent="space-between" alignItems="center" p={3}>
//           <HStack spacing={2}>
//             <Text
//               fontFamily="DM Sans"
//               fontSize={{ base: "sm", md: "md", lg: "14px" }}
//               fontWeight="medium"
//               color="gray.800"
//             >
//               Lead Search:
//             </Text>
//             <Text
//               fontFamily="DM Sans"
//               fontSize={{ base: "xs", md: "sm", lg: "14px" }}
//               color="gray.600"
//             >
//               {searchTerm ||
//                 (tags.length > 0 ? tags.join(", ") : "No filters applied")}
//             </Text>
//           </HStack>
//           <Button
//             bg="#f56565"
//             color="white"
//             w="80px"
//             h="35px"
//             borderRadius="5px"
//             _hover={{
//               bg: "#e53e3e",
//             }}
//             fontWeight="normal"
//             variant="solid"
//             size="sm"
//             onClick={handleClearSearch}
//             isDisabled={isLoading}
//             fontFamily="DM Sans"
//             fontSize={{ base: "xs", md: "sm", lg: "14px" }}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             lineHeight="1"
//           >
//             <CloseIcon fontSize="9px" color="white" mr={2} />
//             Clear
//           </Button>
//         </Flex>
//       )}

//       <Divider borderColor="#E7E7E7" my={4} />
//       <TabContent
//         activeTab={activeTab}
//         data={data || []}
//         isLoading={isLoading}
//         pageSize={pageSize}
//         sendRequest={sendRequest}
//         cancelRequest={cancelRequest}
//         buyLoading={buyLoading}
//         displaySearchData={displaySearchData}
//       />
//     </Box>
//   );
// };

// export default Pagination;

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
import { CloseIcon } from "@chakra-ui/icons";

const Pagination = ({
  data,
  totalPages,
  totalLeads,
  isLoading,
  hasFetched, // Receive hasFetched from Index
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
    if (!data && !isLoading && hasFetched) {
      setIsLoading(true);
      fetchData(activeTab || "Buy Leads", currentPage || 1, pageSize || 50);
    }
  }, [
    data,
    isLoading,
    fetchData,
    activeTab,
    currentPage,
    pageSize,
    setIsLoading,
    hasFetched,
  ]);

  useEffect(() => {
    setGotoPage(currentPage);
  }, [currentPage]);

  const startIndex = totalLeads > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalLeads);
  const totalPagesForTab = Math.max(1, Math.ceil(totalLeads / pageSize));

  const handleNavigation = async (page, fetchFn) => {
    if (isLoading) return;
    setIsLoading(true);
    setCurrentPage(page);
    setGotoPage(page);
    try {
      await fetchFn();
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
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

  const handleGoToChange = (value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setGotoPage(numValue);
    }
  };

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
    setSearchTerm("");
    setTotalLeads(0);
    setDisplaySearchData(false);
    setSearchTerm("");
    setTags([]);
    setCurrentPage(1);
    setPageSize(50);
    setActiveTab("Buy Leads");
    handleNavigation(1, () => fetchData("Buy Leads", 1, 50));
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
      <LeadsProgress totalLeads={totalLeads} userData={userData} />
      <Tabs
        userData={userData}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== activeTab && !isLoading) {
            setData([]);
            setActiveTab(tab);
            setCurrentPage(1);
            setDisplaySearchData(false);
            handleNavigation(1, () => fetchData(tab, 1, pageSize));
          }
        }}
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
                max={totalPagesForTab}
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
                  isDisabled={isLoading}
                />
              </NumberInput>
              <Text fontSize="12px">
                of {totalPagesForTab.toLocaleString()}
              </Text>
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
                isDisabled={isLoading || currentPage >= totalPagesForTab}
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
                isDisabled={isLoading || currentPage >= totalPagesForTab}
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
            searchTerm={searchTerm}
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
            bg="#f56565"
            color="white"
            w="80px"
            h="35px"
            borderRadius="5px"
            _hover={{
              bg: "#e53e3e",
            }}
            fontWeight="normal"
            variant="solid"
            size="sm"
            onClick={handleClearSearch}
            isDisabled={isLoading}
            fontFamily="DM Sans"
            fontSize={{ base: "xs", md: "sm", lg: "14px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            lineHeight="1"
          >
            <CloseIcon fontSize="9px" color="white" mr={2} />
            Clear
          </Button>
        </Flex>
      )}

      <Divider borderColor="#E7E7E7" my={4} />
      <TabContent
        activeTab={activeTab}
        data={data || []}
        isLoading={isLoading}
        hasFetched={hasFetched} // Pass hasFetched to TabContent
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