// // import React, { useState } from 'react';
// // import PositionForm from './PositionForm';
// // import { Box, Button, Flex, Icon } from '@chakra-ui/react';
// // import { IoAdd, IoArrowBack } from 'react-icons/io5';
// // import { useNavigate } from 'react-router-dom';
// // import PositionsList from './PositionsList';
// // import { useFetchItemsQuery } from 'api/apiSlice';
// // import Loader from 'components/loading/Loader';

// // const Positions = () => {
// // 	const [mode, setMode] = useState('create');
// // 	const [viewForm, setViewForm] = useState(false);
// // 	const [initialData, setInitialData] = useState({});

// // 	const {
// // 		data: positions,
// // 		isLoading: positionsLoading,
// // 		refetch,
// // 	} = useFetchItemsQuery(
// // 		{
// // 			path: `/positions`,
// // 		},
// // 		{ refetchOnMountOrArgChange: true }
// // 	);

// // 	const navigate = useNavigate();

// // 	const handleEdit = (position) => {
// // 		setMode('edit');
// // 		setInitialData({});
// // 		setInitialData(position);

// // 		setViewForm(true);
// // 	};

// // 	return positionsLoading ? (
// // 		<Loader />
// // 	) : (
// // 		<Box>
// // 			<Flex justifyContent='flex-end' alignItems='center'>
// // 				{/* <Button
// // 					colorScheme='gray'
// // 					borderRadius='5px'
// // 					size={{ base: 'sm', md: 'md' }}
// // 					px={{ base: 4, md: 6 }}
// // 					py={{ base: 2, md: 3 }}
// // 					fontSize={{ base: 'sm', md: 'md' }}
// // 					leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
// // 					onClick={() => navigate('/hiring')}
// // 					mb={4}
// // 				>
// // 					Back
// // 				</Button> */}
// // 				<Button
// // 					colorScheme='brand'
// // 					borderRadius='md'
// // 					size={"md"}
// // 					px={{ base: 4, md: 6 }}
// // 					py={{ base: 2, md: 3 }}
// // 					leftIcon={<Icon as={IoAdd} boxSize={4} />}
// // 					onClick={() => setViewForm(true)}
// // 					mb={4}
// // 				>
// // 					Add Position
// // 				</Button>
// // 			</Flex>

// // 			{viewForm && (
// // 				<PositionForm
// // 					setViewForm={setViewForm}
// // 					initialData={initialData}
// // 					mode={mode}
// // 					refetch={refetch}
// // 					setMode={setMode}
// // 				/>
// // 			)}
// // 			<PositionsList positions={positions} onEdit={handleEdit} />
// // 		</Box>
// // 	);
// // };

// // export default Positions;

// import React, { useState, useMemo } from "react";
// import PositionForm from "./PositionForm";
// import {
//   Box,
//   Button,
//   Flex,
//   Icon,
//   HStack,
//   Text,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   useDisclosure,
//   IconButton,
// } from "@chakra-ui/react";
// import { IoAdd, IoArrowBack, IoSearch } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import PositionsList from "./PositionsList";
// import { useFetchItemsQuery } from "api/apiSlice";
// import Loader from "components/loading/Loader";
// import TopPagination from "components/pagination/TopPagination";
// import RefreshButton from "components/refresh/RefreshButton";
// import CountUpComponent from "components/countUpComponent/countUpComponent";
// import ActiveFiltersDisplay from "views/admin/payroll/components/ActiveFiltersDisplay";
// import CustomTooltip from "components/shared/CustomTooltip";

// const Positions = () => {
//   const [mode, setMode] = useState("create");
//   const [initialData, setInitialData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({});
//   const [queryParams, setQueryParams] = useState({
//     page: 1,
//     limit: 10,
//   });

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const navigate = useNavigate();

//   // Build query string for API
//   const queryString = useMemo(() => {
//     const params = new URLSearchParams();
//     params.append("page", queryParams.page);
//     params.append("limit", queryParams.limit);

//     if (filters.search) {
//       params.append("search", filters.search);
//     }

//     return params.toString();
//   }, [queryParams.page, queryParams.limit, filters.search]);

//   const {
//     data: positions,
//     isLoading: positionsLoading,
//     isFetching,
//     refetch,
//   } = useFetchItemsQuery(
//     {
//       path: `/positions${queryString ? `?${queryString}` : ""}`,
//     },
//     {
//       refetchOnMountOrArgChange: true,
//     },
//   );

//   const handleEdit = (position) => {
//     setMode("edit");
//     setInitialData(position);
//     onOpen();
//   };

//   const handleCreate = () => {
//     setMode("create");
//     setInitialData({});
//     onOpen();
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (value.trim()) {
//       setFilters({ search: value.trim() });
//     } else {
//       setFilters({});
//     }
//     setQueryParams((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleClearFilters = (filterKey) => {
//     if (filterKey === "search") {
//       setSearchTerm("");
//       setFilters({});
//       setQueryParams((prev) => ({ ...prev, page: 1 }));
//     }
//   };

//   const handlePageChange = (page) => {
//     setQueryParams((prev) => ({ ...prev, page }));
//   };

//   const handlePageSize = (size) => {
//     setQueryParams({ page: 1, limit: size });
//   };

//   const totalPages = positions?.totalPages || 1;
//   const totalRecords = positions?.totalDocs || 0;

//   if (positionsLoading && !positions) {
//     return <Loader />;
//   }

//   return (
//     <>
//       <Button
//         mb="3"
//         leftIcon={<Icon as={IoArrowBack} />}
//         onClick={() => navigate("/hiring")}
//         variant="ghost"
//         size="sm"
//       >
//         Back
//       </Button>

//       <Box
//         p={{ base: 4, md: 6 }}
//         bg="white"
//         minH="80vh"
//         borderRadius="md"
//         boxShadow="sm"
//       >
//         {/* Header */}
//         <Flex
//           flexDir={{ base: "column", md: "row" }}
//           justify="space-between"
//           align="center"
//           mb={4}
//           gap={3}
//         >
//           <Flex align="center" gap={2}>
//             <HStack gap="1" fontWeight="bold">
//               <Text fontSize="20px" fontWeight="bold">
//                 Positions
//               </Text>
//               <CountUpComponent
//                 key={totalRecords}
//                 targetNumber={totalRecords}
//               />
//             </HStack>
//           </Flex>

//           <HStack spacing={4} w={{ base: "100%", md: "auto" }} flexDirection={{base:"column",sm:"row"}} gap="3">
//             <InputGroup size="md" w={{ base: "60%", md: "300px" }}>
//               <InputLeftElement pointerEvents="none">
//                 <IoSearch color="gray.300" />
//               </InputLeftElement>
//               <Input
//                 placeholder="Search positions..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 borderRadius="md"
//                 bg="gray.50"
//                 _hover={{ bg: "gray.100" }}
//                 _focus={{ bg: "white", borderColor: "brand.500" }}
//               />
//             </InputGroup>
// <Flex  alignItems="center" gap="4">
//             <Button
//               leftIcon={<Icon as={IoAdd} />}
//               colorScheme="brand"
//               size="md"
//               borderRadius="md"
//               onClick={handleCreate}
//             >
//               Add Position
//             </Button>
//
//             </Flex>
//           </HStack>
//         </Flex>

//         {/* Active Filters */}
//         {Object.keys(filters).length > 0 && (
//           <ActiveFiltersDisplay
//             filters={filters}
//             onClearFilters={handleClearFilters}
//           />
//         )}

//         {/* Pagination Top */}
//         {!positionsLoading && totalRecords > 0 && (
//           <TopPagination
//             currentPage={queryParams.page}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//             totalItems={totalRecords}
//             itemsPerPage={queryParams.limit}
//             refetching={isFetching}
//             loading={positionsLoading}
//             handlePageSize={handlePageSize}
//           />
//         )}

//         {/* Positions Table */}
//         <PositionsList
//           positions={positions}
//           onEdit={handleEdit}
//           isLoading={positionsLoading || isFetching}
//         />
//       </Box>

//       {/* Position Form Modal */}
//       <PositionForm
//         isOpen={isOpen}
//         onClose={onClose}
//         initialData={initialData}
//         mode={mode}
//         setMode={setMode}
//         refetch={refetch}
//       />
//     </>
//   );
// };

// export default Positions;


import React, { useState, useMemo } from "react";
import PositionForm from "./PositionForm";
import {
  Box,
  Button,
  Flex,
  Icon,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { IoAdd, IoArrowBack, IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import PositionsList from "./PositionsList";
import { useFetchItemsQuery } from "api/apiSlice";
import Loader from "components/loading/Loader";
import TopPagination from "components/pagination/TopPagination";
import RefreshButton from "components/refresh/RefreshButton";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import ActiveFiltersDisplay from "views/admin/payroll/components/ActiveFiltersDisplay";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";

const Positions = () => {
  const colors = useModalColors();
  const [mode, setMode] = useState("create");
  const [initialData, setInitialData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Build query string for API
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", queryParams.page);
    params.append("limit", queryParams.limit);

    if (filters.search) {
      params.append("search", filters.search);
    }

    return params.toString();
  }, [queryParams.page, queryParams.limit, filters.search]);

  const {
    data: positions,
    isLoading: positionsLoading,
    isFetching,
    refetch,
  } = useFetchItemsQuery(
    {
      path: `/positions${queryString ? `?${queryString}` : ""}`,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const handleEdit = (position) => {
    setMode("edit");
    setInitialData(position);
    onOpen();
  };

  const handleCreate = () => {
    setMode("create");
    setInitialData({});
    onOpen();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setFilters({ search: value.trim() });
    } else {
      setFilters({});
    }
    setQueryParams((prev) => ({ ...prev, page: 1 }));
  };

const handleClearFilters = (filterKey) => {
  if (filterKey === "search") {
    // Clear just search
    setSearchTerm("");
    setFilters({});
    setQueryParams((prev) => ({ ...prev, page: 1 }));
  } else if (!filterKey) {
    // Clear ALL filters - reset everything
    setSearchTerm("");
    setFilters({});
    setQueryParams({
      page: 1,
      limit: queryParams.limit, // Keep the current limit
    });
  }
};

  const handlePageChange = (page) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handlePageSize = (size) => {
    setQueryParams({ page: 1, limit: size });
  };

  const totalPages = positions?.totalPages || 1;
  const totalRecords = positions?.length || 0;
console.log("Positions Data:", positions);
  if (positionsLoading && !positions) {
    return <Loader />;
  }

  return (
    <>
      <Button
        mb="3"
        leftIcon={<Icon as={IoArrowBack} />}
        onClick={() => navigate("/hiring")}
        variant="ghost"
        size="sm"
        color={colors.bodyText}
        _hover={{
          color: colors.accentGold,
          bg: colors.secondaryBtnHoverBg,
        }}
      >
        Back
      </Button>

      <Box
        p={{ base: 4, md: 6 }}
        bg={colors.bg}
        minH="80vh"
        borderRadius="md"
        boxShadow={colors.cardShadow}
        border="1px solid"
        borderColor={colors.borderColor}
      >
        {/* Header */}
        <Flex
          flexDir={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          mb={4}
          gap={3}
        >
          <Flex align="center" gap={2}>
            <HStack gap="1" fontWeight="bold">
              <Text fontSize="20px" fontWeight="bold" color={colors.headingText}>
                Positions
              </Text>
              <CountUpComponent
                key={totalRecords}
                targetNumber={totalRecords}
              />
            </HStack>
          </Flex>

          <HStack spacing={4} w={{ base: "100%", md: "auto" }} flexDirection={{ base: "column", sm: "row" }} gap="3">
            <InputGroup size="md" w={{ base: "60%", md: "300px" }}>
              <InputLeftElement pointerEvents="none">
                <IoSearch color={colors.mutedText} />
              </InputLeftElement>
              <Input
                placeholder="Search positions..."
                value={searchTerm}
                onChange={handleSearchChange}
                borderRadius="md"
                bg={colors.bgInput}
                borderColor={colors.borderColor}
                color={colors.headingText}
                _hover={{ bg: colors.bgInputHover, borderColor: colors.accentGold }}
                _focus={{ bg: colors.bg, borderColor: colors.accentGold, boxShadow: `0 0 0 1px ${colors.accentGold}` }}
                _placeholder={{ color: colors.mutedText }}
              />
            </InputGroup>

            <Flex alignItems="center" gap="4">
              <Button
                leftIcon={<Icon as={IoAdd} />}
                bg={colors.accentGold}
                color={colors.headerText}
                size="md"
                borderRadius="md"
                onClick={handleCreate}
                _hover={{
                  bg: colors.goldLight,
                  transform: "translateY(-1px)",
                  boxShadow: colors.goldGlow,
                }}
                _active={{ bg: colors.goldDark }}
                transition="all 0.2s ease"
              >
                Add Position
              </Button>

       <RefreshButton
                                      label="Refresh"
                                       onClick={() => {refetch();
                    }}
                                      isLoading={positionsLoading}
                                      isFetching={isFetching}
                                      size="sm"
                                    />
            </Flex>
          </HStack>
        </Flex>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <ActiveFiltersDisplay
            filters={filters}
            onClearFilters={handleClearFilters}
          />
        )}
{/* Pagination Top */}
{!positionsLoading && totalRecords > 0 && (
          <TopPagination
            currentPage={queryParams.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalRecords}
            itemsPerPage={queryParams.limit}
            refetching={isFetching}
            loading={positionsLoading}
            handlePageSize={handlePageSize}
          />
        )}

        {/* Positions Table */}
        <PositionsList
          positions={positions}
          onEdit={handleEdit}
          isLoading={positionsLoading || isFetching}
        />
      </Box>

      {/* Position Form Modal */}
      <PositionForm
        isOpen={isOpen}
        onClose={onClose}
        initialData={initialData}
        mode={mode}
        setMode={setMode}
        refetch={refetch}
      />
    </>
  );
};

export default Positions;