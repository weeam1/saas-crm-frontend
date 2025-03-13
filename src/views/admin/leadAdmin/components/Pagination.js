<<<<<<< HEAD
// import React, { useState } from "react";
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
// import { leadValueFontSize } from "./constants";
// import LeadsProgress from "./LeadProgress";
// import ClearAdvancedSearchButton from "./ClearButton";

// const Pagination = ({
//   leads,
//   currentPage,
//   setCurrentPage,
//   totalPages,
//   totalItems,
//   pageSize,
//   onPageSizeChange,
//   activeTab,
//   setActiveTab,
//   loading,
//   searchQuery,
//   setSearchQuery,
//   fetchAdvancedSearch,
//   setSearchClear,
//   setFormValues,
//   isFormReset,
//   setIsFormReset,
//   setGetTagValues,
//   clearAdvancedSearch,
//   approveChangeHandler,
//   formValues = {},
//   isAgent,
//   isSuperAdmin,
// }) => {
//   const [gotoPage, setGotoPage] = useState(currentPage || "");

//   const totalPagesForTab = Math.max(1, totalPages);
//   const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
//   const endIndex = Math.min(currentPage * pageSize, totalItems);

//   const isSearchActive = !!searchQuery || Object.keys(formValues).length > 0;

//   const handleFirst = () => {
//     setCurrentPage(1);
//     setGotoPage(1);
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       setGotoPage(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPagesForTab) {
//       setCurrentPage(currentPage + 1);
//       setGotoPage(currentPage + 1);
//     }
//   };

//   const handleLast = () => {
//     setCurrentPage(totalPagesForTab);
//     setGotoPage(totalPagesForTab);
//   };

//   const handleGoToChange = (value) => {
//     setGotoPage(value);
//   };

//   const handleGoToBlur = () => {
//     const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPagesForTab));
//     setCurrentPage(page);
//     setGotoPage(page);
//   };

//   const buttonStyle = {
//     size: "sm",
//     borderRadius: "lg",
//     _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
//     _active: { bg: "softGray.500" },
//     sx: { svg: { fill: "brand.500" } },
//   };

//   return (
//     <Box width="100%" bg="white" p={5} borderRadius="10px">
//       <LeadsProgress
//         totalLeads={totalItems}
//         searchQuery={searchQuery}
//         formValues={formValues}
//         isSearchActive={isSearchActive}
//       />
//       <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

//       <Flex
//         direction={{ base: "column", md: "column", lg: "row" }}
//         justifyContent={{ base: "center", md: "space-between" }}
//         alignItems="center"
//         gap={{ base: 2, lg: 3 }}
//         width="100%"
//         flexWrap={{ base: "wrap", lg: "nowrap" }}
//       >
//         <Box
//           bg="softGray.50"
//           border="1px solid"
//           borderColor="softGray.600"
//           borderRadius="md"
//           p={{ base: 2, md: 3 }}
//           width={{ base: "100%", md: "100%", lg: "auto" }}
//           flex={{ base: "none", md: "none", lg: "1" }}
//           minWidth={{ base: "100%", md: "100%", lg: "300px" }}
//         >
//           <Flex
//             direction={{ base: "column", md: "row" }}
//             justifyContent={{ base: "center", md: "space-between" }}
//             alignItems="center"
//             width="100%"
//             gap={{ base: 2, md: 3 }}
//             flexWrap={{ base: "wrap", md: "wrap" }}
//           >
//             <HStack spacing={2} flexShrink={0}>
//               <Button
//                 {...buttonStyle}
//                 onClick={handleFirst}
//                 isDisabled={loading || currentPage === 1}
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py={{ base: 1, md: 2 }}
//                 px={{ base: 2, md: 4 }}
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
//                 isDisabled={loading || currentPage === 1}
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py={{ base: 1, md: 2 }}
//                 px={{ base: 2, md: 4 }}
//                 leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
//                 aria-label="Previous Page"
//               >
//                 Previous
//               </Button>
//             </HStack>

//             <Flex
//               direction={{ base: "column", md: "row" }}
//               flex="1"
//               justifyContent={{ base: "center", md: "space-around" }}
//               alignItems="center"
//               gap={{ base: 2, md: 3 }}
//               width={{ base: "100%", md: "auto" }}
//               flexWrap={{ md: "wrap" }}
//             >
//               <HStack spacing={1} fontWeight="medium" color="gray.800">
//                 <Text fontSize={{ base: "xs", md: "sm" }}>Go to</Text>
//                 <NumberInput
//                   value={gotoPage}
//                   onChange={handleGoToChange}
//                   onBlur={handleGoToBlur}
//                   min={1}
//                   max={totalPagesForTab}
//                   size="sm"
//                   borderRadius="md"
//                   width="5rem"
//                   bg="softGray.50"
//                   border="1px solid softGray.600"
//                   allowMouseWheel={false}
//                   clampValueOnBlur={false}
//                 >
//                   <NumberInputField
//                     aria-label="Go to page"
//                     textAlign="center"
//                     borderRadius="md"
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         handleGoToBlur();
//                       }
//                     }}
//                     border="2px solid"
//                     borderColor="softGray.600"
//                     _focus={{
//                       outline: "none",
//                       bg: "softGray.50",
//                       border: "1px solid",
//                       borderColor: "brand.500",
//                     }}
//                     _active={{ bg: "softGray.400" }}
//                     fontSize={leadValueFontSize}
//                   />
//                 </NumberInput>
//                 <Text fontSize={{ base: "xs", md: "sm" }}>
//                   of {Number(totalPagesForTab).toLocaleString()}
//                 </Text>
//               </HStack>

//               <HStack>
//                 <Text fontSize={{ base: "xs", md: "sm" }}>Items per page:</Text>
//                 <Select
//                   size="sm"
//                   value={pageSize}
//                   onChange={(e) => onPageSizeChange(Number(e.target.value))}
//                   width="70px"
//                 >
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </Select>
//               </HStack>

//               <Text
//                 fontSize={{ base: "xs", md: "sm" }}
//                 fontWeight="medium"
//                 color="gray.800"
//                 textAlign={{ base: "center", md: "left" }}
//               >
//                 Showing {startIndex} - {endIndex} of {totalItems}
//               </Text>
//             </Flex>

//             <HStack spacing={2} flexShrink={0}>
//               <Button
//                 {...buttonStyle}
//                 onClick={handleNext}
//                 isDisabled={
//                   loading ||
//                   currentPage === totalPagesForTab ||
//                   totalItems === 0
//                 }
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py={{ base: 1, md: 2 }}
//                 px={{ base: 2, md: 4 }}
//                 rightIcon={<FaPlay />}
//                 aria-label="Next Page"
//               >
//                 Next
//               </Button>
//               <Button
//                 {...buttonStyle}
//                 onClick={handleLast}
//                 isDisabled={
//                   loading ||
//                   currentPage === totalPagesForTab ||
//                   totalItems === 0
//                 }
//                 variant="solid"
//                 bg="softGray.600"
//                 color="black"
//                 py={{ base: 1, md: 2 }}
//                 px={{ base: 2, md: 4 }}
//                 rightIcon={<IoPlaySkipForwardSharp />}
//                 aria-label="Last Page"
//               >
//                 Last
//               </Button>
//             </HStack>
//           </Flex>
//         </Box>

//         <Box
//           bg="softGray.50"
//           border="1px solid"
//           borderColor="softGray.600"
//           borderRadius="md"
//           p={{ base: 2, md: 3 }}
//           width={{ base: "100%", md: "100%", lg: "auto" }}
//           flex={{ base: "none", md: "none", lg: "1" }}
//           minWidth={{ base: "100%", md: "100%", lg: "200px" }}
//           maxWidth={{ lg: "470px" }}
//           mt={{ base: 2, lg: 0 }}
//         >
//           <SearchBox
//             onSearch={setSearchQuery}
//             searchQuery={searchQuery}
//             fetchAdvancedSearch={fetchAdvancedSearch}
//             setSearchClear={setSearchClear}
//             setFormValues={setFormValues}
//             isFormReset={isFormReset}
//             setIsFormReset={setIsFormReset}
//             pageSize={pageSize}
//             setGetTagValues={setGetTagValues}
//             loading={loading}
//             clearAdvancedSearch={clearAdvancedSearch}
//           />
//         </Box>
//       </Flex>

//       {isSearchActive && (
//         <ClearAdvancedSearchButton
//           clearAdvancedSearch={clearAdvancedSearch}
//           loading={loading}
//           searchQuery={searchQuery}
//           formValues={formValues}
//         />
//       )}
//       <Divider borderColor="#E7E7E7" borderWidth="1px" my={4} />

//       <Box mt={4}>
//         <TabContent
//           activeTab={activeTab}
//           leadsdata={leads}
//           loading={loading || !leads} // Keep this to ensure skeletons on initial load
//           approveChangeHandler={approveChangeHandler}
//           pageSize={pageSize} // Pass pageSize to TabContent
//         />
//       </Box>
//     </Box>
//   );
// };

// export default Pagination;

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
<<<<<<< HEAD
  const [gotoPage, setGotoPage] = useState(currentPage || "");

  const totalPagesForTab = Math.max(1, totalPages);
  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

=======
  const [gotoPage, setGotoPage] = useState(currentPage || 1);

  useEffect(() => {
    setGotoPage(currentPage);
  }, [currentPage, activeTab, pageSize]);

  const totalPagesForTab = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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

<<<<<<< HEAD
  const buttonStyle = {
    size: "sm",
=======
  const handlePageSizeChange = (event) => {
    if (loading) return;
    const newPageSize = Number(event.target.value);
    onPageSizeChange(newPageSize);
  };

  const buttonStyle = {
    size: { base: "xs", md: "sm" }, // xs for base, sm for md and up
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
    borderRadius: "lg",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "softGray.500" },
    sx: { svg: { fill: "brand.500" } },
<<<<<<< HEAD
  };

  return (
    <Box width="100%" bg="white" p={5} borderRadius="10px">
=======
    px: { base: 1, md: 2 },
  };

  return (
    <Box width="100%" bg="white" p={5} borderRadius="10px" minHeight="100%">
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
      <LeadsProgress
        totalLeads={totalItems}
        searchQuery={searchQuery}
        formValues={formValues}
        isSearchActive={isSearchActive}
      />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <Flex
<<<<<<< HEAD
        direction={{ base: "column", md: "column", lg: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        gap={{ base: 2, lg: 3 }}
        width="100%"
        flexWrap={{ base: "wrap", lg: "nowrap" }}
=======
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
                isDisabled={loading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
<<<<<<< HEAD
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
=======
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
                p="8px"
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
=======
                p="8px"
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
                fontSize={{ base: "xs", md: "sm" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
              >
                Previous
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
=======
              justifyContent="space-around"
              alignItems="center"
              gap={1}
              width={{ base: "100%", md: "auto" }}
              flexWrap="wrap"
            >
              <HStack spacing={0.5} fontWeight="medium" color="gray.800">
                <Text fontSize={{ base: "2xs", md: "xs" }}>Go to</Text>
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
                <NumberInput
                  value={gotoPage}
                  onChange={handleGoToChange}
                  onBlur={handleGoToBlur}
                  min={1}
                  max={totalPagesForTab}
<<<<<<< HEAD
                  size="sm"
                  borderRadius="md"
                  width="5rem"
                  bg="softGray.50"
                  border="1px solid softGray.600"
                  allowMouseWheel={false}
                  clampValueOnBlur={false}
=======
                  size="xs"
                  width="4rem"
                  bg="softGray.50"
                  border="1px solid softGray.600"
                  isDisabled={loading}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
                >
                  <NumberInputField
                    aria-label="Go to page"
                    textAlign="center"
                    borderRadius="md"
<<<<<<< HEAD
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
=======
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
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
                  of {Number(totalPagesForTab).toLocaleString()}
                </Text>
              </HStack>

<<<<<<< HEAD
              <HStack>
                <Text fontSize={{ base: "xs", md: "sm" }}>Items per page:</Text>
                <Select
                  size="sm"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  width="70px"
=======
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
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Select>
              </HStack>

              <Text
<<<<<<< HEAD
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="medium"
                color="gray.800"
                textAlign={{ base: "center", md: "left" }}
              >
                Showing {startIndex} - {endIndex} of {totalItems}
              </Text>
            </Flex>

            <HStack spacing={2} flexShrink={0}>
=======
                fontSize={{ base: "2xs", md: "xs" }}
                fontWeight="medium"
                color="gray.800"
              >
                {startIndex}-{endIndex} of {totalItems}
              </Text>
            </Flex>

            <HStack spacing={1} flexShrink={0}>
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                rightIcon={<FaPlay />}
                aria-label="Next Page"
=======
                rightIcon={<FaPlay />}
                aria-label="Next Page"
                fontSize={{ base: "xs", md: "sm" }}
                p="8px"
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
                py={{ base: 1, md: 2 }}
                px={{ base: 2, md: 4 }}
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
=======
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
                fontSize={{ base: "xs", md: "sm" }}
                p="8px"
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
          maxWidth={{ base: "auto", lg: "470px" }}
=======
          flex="1"
          minWidth={{ base: "100%", lg: "200px" }}
          maxWidth={{ lg: "470px" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
      <Divider borderColor="#E7E7E7" borderWidth="1px" my={4} />

      {/* <Box mt={4}>
        <TabContent
          activeTab={activeTab}
          leadsdata={leads}
          loading={loading || !leads}
          approveChangeHandler={approveChangeHandler}
          pageSize={pageSize}
        />
      </Box> */}
      <Box mt={4}>
=======
      <Divider borderColor="#E7E7E7" my={4} />

      <Box mt={4} flex="1" overflow="auto">
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
