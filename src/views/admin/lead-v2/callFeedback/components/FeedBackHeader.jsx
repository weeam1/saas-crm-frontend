// import React, { useRef, useState, useEffect } from "react";
// import { useBreakpointValue } from "@chakra-ui/react";
// import {
//   Box,
//   Button,
//   Text,
//   useDisclosure,
//   useColorModeValue,
//   Flex,
//   VStack,
//   HStack,
//   Select,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
// } from "@chakra-ui/react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import moment from "moment";

// import dayjs from "dayjs";
// import { FiCalendar } from "react-icons/fi";
// import TopPagination from "components/pagination/TopPagination";
// import { SearchBarV2 } from "components/search/SearchBarV2";
// import AdvancedSearch from "./AdvanceSearch";
// import ActiveFiltersDisplay from "./ActiveFiltersDIsplay";
// import DateFilter from "views/admin/attendance/components/DateFilter";

// export const CallFeedbackHeader = ({
//   search,
//   setSearch,
//   onSearch,
//   onAdvancedSearch,
//   onClear,
//   setAppliedSearch,
//   setAdvancedFilters,
//   setMonth, // we'll store YYYY-MM here
//   month,
//   advancedFilters,
//   filters,
//   setFilters,
//   currentPage,
//   totalPages,
//   onPageChange,
//   totalItems,
//   itemsPerPage,
//   refetching,
//   loading,
//   handlePageSize,
// }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [advanceSearch, setAdvanceSearch] = React.useState(false);

//   const currentMonth = dayjs().format("MM");
//   const currentYear = dayjs().year();

//   const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
//   const [selectedYear, setSelectedYear] = React.useState(currentYear);

//   // Check if any filters are active
//   const hasActiveFilters = React.useMemo(() => {
//     // Check if search has value
//     const hasSearch = search && search.trim() !== "";

//     // Check if any advanced filter has value
//     const hasAdvancedFilters = Object.values(advancedFilters || {}).some(
//       (value) => value && value.trim() !== "",
//     );

//     // Check if month is different from current month
//     const isCurrentMonth = month === `${currentYear}-${currentMonth}`;
//     const hasMonthFilter = !isCurrentMonth;

//     return hasSearch || hasAdvancedFilters || hasMonthFilter;
//   }, [search, advancedFilters, month, currentYear, currentMonth]);

//   // Set default month-year as YYYY-MM
//   React.useEffect(() => {
//     if (!month) {
//       setMonth?.(`${currentYear}-${currentMonth}`);
//     }
//   }, [currentMonth, currentYear, setMonth, month]);

//   const handleClearAll = () => {
//     // Clear search
//     setSearch?.("");
//     onSearch?.("");

//     // Call parent's clear function
//     onClear?.();

//     // Reset month to current
//     setMonth?.(`${currentYear}-${currentMonth}`);
//     setSelectedMonth(currentMonth);
//     setSelectedYear(currentYear);
//   };

//   return (
//     <>
//       <Box
//         p={4}
//         borderWidth="1px"
//         borderRadius="lg"
//         bg={useColorModeValue("white", "gray.800")}
//       >
//         <Box
//           display="grid"
//           gridTemplateColumns={{
//             base: "1fr", // mobile: 1 per row
//             md: "1fr 1fr", // tablet: 2 per row
//             lg: " 1fr 1fr 1fr", // desktop: full layout
//             xl: "5fr  1fr 1fr", // desktop: full layout
//           }}
//           gap={3}
//           alignItems="center"
//         >
//           {/* Search Bar */}
//           <Box>
//             <SearchBarV2
//               value={search}
//               onSearchTermChange={onSearch}
//               onClear={() => {
//                 setSearch?.("");
//                 onSearch?.("");
//               }}
//             />
//           </Box>

//           {/* Advanced Search Button */}
//           <Button
//             colorScheme="brand"
//             borderRadius="md"
//             size="md"
//             onClick={() => setAdvanceSearch(true)}
//           >
//             Advanced Search
//           </Button>

//           {/* Month-Year Picker */}
//           <Box>
//             <Button
//               onClick={onOpen}
//               variant="outline"
//               size="md"
//               leftIcon={<FiCalendar />}
//               width="100%"
//               borderRadius="md"
//             >
//               {dayjs(month || `${selectedYear}-${selectedMonth}-01`).format(
//                 "MMMM YYYY",
//               )}
//             </Button>
//           </Box>

//           {/* Clear Filters Button - Disabled when no filters are active */}
//           {/* <Button
//             bg={hasActiveFilters ? "gray.300" : "gray.200"}
//             color={hasActiveFilters ? "gray.800" : "gray.600"}
//             borderRadius="md"
//             size="md"
//             onClick={handleClearAll}
//             disabled={!hasActiveFilters}
//             _hover={
//               hasActiveFilters
//                 ? { bg: "gray.400", cursor: "pointer" }
//                 : { bg: "gray.200", cursor: "not-allowed" }
//             }
//             _active={hasActiveFilters ? { bg: "gray.500" } : { bg: "gray.100" }}
//             cursor={hasActiveFilters ? "pointer" : "not-allowed"}
//           >
//             Clear Filters
//           </Button> */}
//         </Box>
//         <ActiveFiltersDisplay
//           filters={filters}
//           onClearFilters={(key) => {
//             if (key) {
//               setFilters((prev) => {
//                 const updated = { ...prev };
//                 delete updated[key];
//                 return updated;
//               });

//               // Also clear corresponding local state
//               setAdvancedFilters((prev) => ({ ...prev, [key]: "" }));
//               if (key === "q") setAppliedSearch("");
//               if (key === "month") setMonth(dayjs().format("YYYY-MM"));
//             } else {
//               // Clear all
//               onClear();
//             }
//           }}
//         />

//         {/* Month-Year Modal */}
//         <MonthYearModal
//           isOpen={isOpen}
//           onClose={onClose}
//           month={selectedMonth}
//           year={selectedYear}
//           setMonth={setSelectedMonth}
//           setYear={setSelectedYear}
//           onApply={(month, year) => {
//             setSelectedMonth(month.padStart(2, "0"));
//             setSelectedYear(year);
//             setMonth?.(`${year}-${month.padStart(2, "0")}`);
//           }}
//         />
//       </Box>

//       <TopPagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={onPageChange}
//         totalItems={totalItems}
//         itemsPerPage={itemsPerPage}
//         refetching={refetching}
//         loading={loading}
//         handlePageSize={handlePageSize}
//       />

//       {advanceSearch && (
//         <AdvancedSearch
//           isOpen={advanceSearch}
//           onClose={() => setAdvanceSearch(false)}
//           onSearch={onAdvancedSearch}
//           initialValues={advancedFilters}
//         />
//       )}
//     </>
//   );
// };

// // const MonthYearModal = ({
// //   isOpen,
// //   onClose,
// //   onApply,
// //   month,
// //   year,
// //   setMonth,
// //   setYear,
// // }) => {
// //   const bgColor = useColorModeValue("white", "gray.800");
// //   const headerBg = useColorModeValue("brand.300", "brand.100");
// //   const headerText = useColorModeValue("brand.700", "brand.900");
// //   const borderColor = useColorModeValue("gray.200", "gray.600");

// //   const months = [
// //     { label: "January", value: "01" },
// //     { label: "February", value: "02" },
// //     { label: "March", value: "03" },
// //     { label: "April", value: "04" },
// //     { label: "May", value: "05" },
// //     { label: "June", value: "06" },
// //     { label: "July", value: "07" },
// //     { label: "August", value: "08" },
// //     { label: "September", value: "09" },
// //     { label: "October", value: "10" },
// //     { label: "November", value: "11" },
// //     { label: "December", value: "12" },
// //   ];

// //   const currentYear = dayjs().year();
// //   const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

// //   const handleApply = () => {
// //     onApply(month, year);
// //     onClose();
// //   };
// //   const handleDateFilterChange = ({ month, year }) => {
// //     setMonth(month);
// //     setYear(year);

// //     // Apply immediately (same behavior as clicking Apply)
// //     onApply(month, year);
// //     onClose();
// //   };

// //   const selectedDate = moment(`${year}-${month}-01`).toDate();

// //   return (
// //     <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
// //       <ModalOverlay />
// //       <ModalContent borderRadius="xl" overflow="hidden">
// //         <ModalBody p={4}>

// //           <Calendar
// //             value={selectedDate}
// //             view="year"
// //             onClickMonth={(date) => {
// //               const m = moment(date).format("MM");
// //               const y = moment(date).format("YYYY");

// //               setMonth(m);
// //               setYear(y);
// //               onApply(m, y);
// //               onClose();
// //             }}
// //             maxDate={moment().endOf("month").toDate()}
// //             tileDisabled={({ date }) => date.getDate() !== 1}
// //             className="custom-calendar"
// //           />
// //         </ModalBody>

// //         {/* 👇 SAME styles from DateFilter */}
// //         <style jsx global>{`
// //           .react-calendar {
// //             width: 100%;
// //             border: none !important;
// //             font-size: 0.9rem;
// //           }
// //           @media (max-width: 768px) {
// //             .react-calendar {
// //               font-size: 0.8rem;
// //             }
// //           }
// //           .react-calendar__tile--active {
// //             background: #3182ce !important;
// //             color: white !important;
// //             border-radius: 8px;
// //           }
// //           .react-calendar__navigation button {
// //             color: #2d3748;
// //           }
// //         `}</style>
// //       </ModalContent>
// //     </Modal>
// //   );
// // };
// const MonthYearModal = ({
//   isOpen,
//   onClose,
//   onApply,
//   month,
//   year,
//   setMonth,
//   setYear,
// }) => {
//   const modalRef = useRef(null);
//   const isMobile = useBreakpointValue({ base: true, md: false });

//   // Calculate popup style for desktop
//   const [popupStyle, setPopupStyle] = useState({});
//   const buttonRef = useRef(null);

//   // Get the position of the trigger button (simulated for modal)
//   useEffect(() => {
//     if (!isMobile && isOpen) {
//       // For modal, we'll use centered positioning
//       setPopupStyle({
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//       });
//     }
//   }, [isOpen, isMobile]);

//   const selectedDate = moment(`${year}-${month}-01`).toDate();

//   const handleDateChange = (date) => {
//     const m = moment(date).format("MM");
//     const y = moment(date).format("YYYY");

//     setMonth(m);
//     setYear(y);
//     onApply(m, y);
//     onClose();
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       isCentered
//       size="sm"
//       closeOnOverlayClick={true}
//     >
//       <ModalOverlay bg="rgba(0,0,0,0.4)" />
//       <ModalContent
//         borderRadius="xl"
//         overflow="hidden"
//         boxShadow="none"
//         border="none"
//         background="transparent"
//       >
//         <ModalBody p={0}>
//           {/* Mobile Overlay is handled by ModalOverlay */}

//           {/* Calendar Container - matches the exact styling from first component */}
//           <Box
//             ref={modalRef}
//             zIndex="999"
//             bg="white"
//             borderRadius="xl"
//             boxShadow="0 10px 25px rgba(0,0,0,0.25)"
//             border="1px solid rgba(0,0,0,0.2)"
//             p={{ base: 3, md: 4 }}
//             w={{ base: "90vw", sm: "80vw", md: "350px" }}
//             maxW="420px"
//             transition="all 0.3s ease"
//             {...(isMobile
//               ? {
//                   position: "fixed",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                 }
//               : popupStyle)}
//           >
//             <Calendar
//               onChange={handleDateChange}
//               value={selectedDate}
//               view="year"
//               onClickMonth={handleDateChange}
//               maxDate={moment().endOf("month").toDate()}
//               tileDisabled={({ date }) => date.getDate() !== 1}
//               className="custom-calendar"
//             />
//           </Box>

//           {/* Custom Styles - matches exactly from first component */}
//           <style jsx global>{`
//             .react-calendar {
//               width: 100%;
//               border: none !important;
//               font-size: 0.9rem;
//             }
//             @media (max-width: 768px) {
//               .react-calendar {
//                 font-size: 0.8rem;
//               }
//             }
//             .react-calendar__tile--active {
//               background: #3182ce !important;
//               color: white !important;
//               border-radius: 8px;
//             }
//             .react-calendar__navigation button {
//               color: #2d3748;
//             }

//             /* Additional styles for better mobile experience */
//             .react-calendar__tile {
//               padding: 0.75em 0.5em;
//             }

//             @media (max-width: 480px) {
//               .react-calendar__tile {
//                 padding: 0.5em 0.25em;
//               }
//             }
//           `}</style>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

import React, { useRef, useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import {
  Box,
  Button,
  Text,
  useDisclosure,
  useColorModeValue,
  Flex,
  VStack,
  HStack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

import dayjs from "dayjs";
import { FiCalendar } from "react-icons/fi";
import TopPagination from "components/pagination/TopPagination";
import { SearchBarV2 } from "components/search/SearchBarV2";
import AdvancedSearch from "./AdvanceSearch";
import ActiveFiltersDisplay from "./ActiveFiltersDIsplay";
import DateFilter from "views/admin/attendance/components/DateFilter";

export const CallFeedbackHeader = ({
  search,
  setSearch,
  onSearch,
  onAdvancedSearch,
  onClear,
  setAppliedSearch,
  setAdvancedFilters,
  setMonth, // we'll store YYYY-MM here
  month,
  advancedFilters,
  filters,
  setFilters,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  refetching,
  loading,
  handlePageSize,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [advanceSearch, setAdvanceSearch] = React.useState(false);

  const currentMonth = dayjs().format("MM");
  const currentYear = dayjs().year();

  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  // Check if any filters are active
  const hasActiveFilters = React.useMemo(() => {
    // Check if search has value
    const hasSearch = search && search.trim() !== "";

    // Check if any advanced filter has value
    const hasAdvancedFilters = Object.values(advancedFilters || {}).some(
      (value) => value && value.trim() !== "",
    );

    // Check if month is different from current month
    const isCurrentMonth = month === `${currentYear}-${currentMonth}`;
    const hasMonthFilter = !isCurrentMonth;

    return hasSearch || hasAdvancedFilters || hasMonthFilter;
  }, [search, advancedFilters, month, currentYear, currentMonth]);

  // Set default month-year as YYYY-MM
  React.useEffect(() => {
    if (!month) {
      setMonth?.(`${currentYear}-${currentMonth}`);
    }
  }, [currentMonth, currentYear, setMonth, month]);

  const handleClearAll = () => {
    // Clear search
    setSearch?.("");
    onSearch?.("");

    // Call parent's clear function
    onClear?.();

    // Reset month to current
    setMonth?.(`${currentYear}-${currentMonth}`);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  };
  const triggerButtonRef = useRef(null);
  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr", // mobile: 1 per row
            md: "1fr 1fr", // tablet: 2 per row
            lg: " 1fr 1fr 1fr", // desktop: full layout
            xl: "5fr  1fr 1fr", // desktop: full layout
          }}
          gap={3}
          alignItems="center"
        >
          {/* Search Bar */}
          <Box>
            <SearchBarV2
              value={search}
              onSearchTermChange={onSearch}
              onClear={() => {
                setSearch?.("");
                onSearch?.("");
              }}
            />
          </Box>

          {/* Advanced Search Button */}
          <Button
            colorScheme="brand"
            borderRadius="md"
            size="md"
            onClick={() => setAdvanceSearch(true)}
          >
            Advanced Search
          </Button>

          {/* Month-Year Picker */}
          <Box>
            <Button
              ref={triggerButtonRef}
              onClick={() => {
                if (isOpen) {
                  onClose();
                } else {
                  onOpen();
                }
              }}
              variant="outline"
              size="md"
              leftIcon={<FiCalendar />}
              width="100%"
              borderRadius="md"
            >
              {dayjs(month || `${selectedYear}-${selectedMonth}-01`).format(
                "MMMM YYYY",
              )}
            </Button>
          </Box>

          {/* Clear Filters Button - Disabled when no filters are active */}
          {/* <Button
            bg={hasActiveFilters ? "gray.300" : "gray.200"}
            color={hasActiveFilters ? "gray.800" : "gray.600"}
            borderRadius="md"
            size="md"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            _hover={
              hasActiveFilters
                ? { bg: "gray.400", cursor: "pointer" }
                : { bg: "gray.200", cursor: "not-allowed" }
            }
            _active={hasActiveFilters ? { bg: "gray.500" } : { bg: "gray.100" }}
            cursor={hasActiveFilters ? "pointer" : "not-allowed"}
          >
            Clear Filters
          </Button> */}
        </Box>
        <ActiveFiltersDisplay
          filters={filters}
          onClearFilters={(key) => {
            if (key) {
              setFilters((prev) => {
                const updated = { ...prev };
                delete updated[key];
                return updated;
              });

              // Also clear corresponding local state
              setAdvancedFilters((prev) => ({ ...prev, [key]: "" }));
              if (key === "q") setAppliedSearch("");
              if (key === "month") setMonth(dayjs().format("YYYY-MM"));
            } else {
              // Clear all
              onClear();
            }
          }}
        />

        {/* Month-Year Modal */}
        <MonthYearModal
          triggerRef={triggerButtonRef}
          isOpen={isOpen}
          onClose={onClose}
          month={selectedMonth}
          year={selectedYear}
          setMonth={setSelectedMonth}
          setYear={setSelectedYear}
          onApply={(month, year) => {
            setSelectedMonth(month.padStart(2, "0"));
            setSelectedYear(year);
            setMonth?.(`${year}-${month.padStart(2, "0")}`);
          }}
        />
      </Box>

      <TopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        refetching={refetching}
        loading={loading}
        handlePageSize={handlePageSize}
      />

      {advanceSearch && (
        <AdvancedSearch
          isOpen={advanceSearch}
          onClose={() => setAdvanceSearch(false)}
          onSearch={onAdvancedSearch}
          initialValues={advancedFilters}
        />
      )}
    </>
  );
};

// const MonthYearModal = ({
//   isOpen,
//   onClose,
//   onApply,
//   month,
//   year,
//   setMonth,
//   setYear,
// }) => {
//   const modalRef = useRef(null);
//   const isMobile = useBreakpointValue({ base: true, md: false });

//   // Calculate popup style for desktop
//   const [popupStyle, setPopupStyle] = useState({});
//   const buttonRef = useRef(null);

//   // Get the position of the trigger button (simulated for modal)
//   useEffect(() => {
//     if (!isMobile && isOpen) {
//       // For modal, we'll use centered positioning
//       setPopupStyle({
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//       });
//     }
//   }, [isOpen, isMobile]);

//   const selectedDate = moment(`${year}-${month}-01`).toDate();

//   const handleDateChange = (date) => {
//     const m = moment(date).format("MM");
//     const y = moment(date).format("YYYY");

//     setMonth(m);
//     setYear(y);
//     onApply(m, y);
//     onClose();
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       isCentered
//       size="sm"
//       closeOnOverlayClick={true}
//     >
//       <ModalContent
//         borderRadius="xl"
//         overflow="hidden"
//         boxShadow="none"
//         border="none"
//         background="transparent"
//       >
//         <ModalBody p={0}>
//           {/* Mobile Overlay is handled by ModalOverlay */}

//           {/* Calendar Container - matches the exact styling from first component */}
//           <Box
//             ref={modalRef}
//             zIndex="999"
//             bg="white"
//             borderRadius="xl"
//             boxShadow="0 10px 25px rgba(0,0,0,0.25)"
//             border="1px solid rgba(0,0,0,0.2)"
//             p={{ base: 3, md: 4 }}
//             w={{ base: "90vw", sm: "80vw", md: "350px" }}
//             maxW="420px"
//             transition="all 0.3s ease"
//             {...(isMobile
//               ? {
//                   position: "fixed",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                 }
//               : popupStyle)}
//           >
//             <Calendar
//               onChange={handleDateChange}
//               value={selectedDate}
//               view="year"
//               onClickMonth={handleDateChange}
//               maxDate={moment().endOf("month").toDate()}
//               tileDisabled={({ date }) => date.getDate() !== 1}
//               className="custom-calendar"
//             />
//           </Box>

//           {/* Custom Styles - matches exactly from first component */}
//           <style jsx global>{`
//             .react-calendar {
//               width: 100%;
//               border: none !important;
//               font-size: 0.9rem;
//             }
//             @media (max-width: 768px) {
//               .react-calendar {
//                 font-size: 0.8rem;
//               }
//             }
//             .react-calendar__tile--active {
//               background: #3182ce !important;
//               color: white !important;
//               border-radius: 8px;
//             }
//             .react-calendar__navigation button {
//               color: #2d3748;
//             }

//             /* Additional styles for better mobile experience */
//             .react-calendar__tile {
//               padding: 0.75em 0.5em;
//             }

//             @media (max-width: 480px) {
//               .react-calendar__tile {
//                 padding: 0.5em 0.25em;
//               }
//             }
//           `}</style>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };
const MonthYearModal = ({
  isOpen,
  onClose,
  onApply,
  month,
  year,
  setMonth,
  setYear,
  triggerRef, // We need a reference to the trigger button
}) => {
  const modalRef = useRef(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [popupStyle, setPopupStyle] = useState({});
  // Add this useEffect after your positioning useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        !isMobile
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, isMobile]);
  // Calculate position based on trigger button
  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const modalWidth = 350; // Same as your calendar width

      if (isMobile) {
        // Mobile: center on screen
        setPopupStyle({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        });
      } else {
        // Desktop: position relative to trigger button
        // Calculate available space
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Default: position below the button, aligned to left
        let top = triggerRect.bottom + 8; // 8px gap
        let left = triggerRect.left;

        // Check if there's enough space below
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const modalHeight = 250; // Approximate calendar height

        // If not enough space below, position above
        if (spaceBelow < modalHeight && triggerRect.top > modalHeight) {
          top = triggerRect.top - modalHeight - 8; // 8px gap above
        }

        // Check if modal would overflow to the right
        if (left + modalWidth > viewportWidth) {
          left = viewportWidth - modalWidth - 46; // Add some margin from right edge
        }

        // Ensure left is not negative
        left = Math.max(16, left);

        setPopupStyle({
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
        });
      }
    }
  }, [isOpen, triggerRef, isMobile]);

  const selectedDate = moment(`${year}-${month}-01`).toDate();

  const handleDateChange = (date) => {
    const m = moment(date).format("MM");
    const y = moment(date).format("YYYY");

    setMonth(m);
    setYear(y);
    onApply(m, y);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0,0,0,0.4)"
          zIndex="998"
          onClick={onClose}
        />
      )}

      {/* Calendar Container */}
      <Box
        ref={modalRef}
        zIndex="999"
        bg="white"
        borderRadius="xl"
        boxShadow="0 10px 25px rgba(0,0,0,0.25)"
        border="1px solid rgba(0,0,0,0.2)"
        p={{ base: 3, md: 4 }}
        w={{ base: "90vw", sm: "80vw", md: "350px" }}
        maxW="350px"
        transition="all 0.3s ease"
        {...popupStyle}
      >
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          view="year"
          onClickMonth={handleDateChange}
          maxDate={moment().endOf("month").toDate()}
          tileDisabled={({ date }) => date.getDate() !== 1}
          className="custom-calendar"
        />
      </Box>

      {/* Custom Styles */}
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none !important;
          font-size: 0.9rem;
          height: auto;
          max-height: 280px;
        }
        @media (max-width: 768px) {
          .react-calendar {
            font-size: 0.8rem;
          }
        }
        .react-calendar__tile {
          padding: 0.25em 0.25em !important; /* smaller padding */
          line-height: 4.2 !important; /* reduce line height */
          font-size: 0.75rem; /* optional smaller font */
        }

        .react-calendar__navigation button {
          color: #2d3748;
        }

        /* Additional styles for better mobile experience */
        .react-calendar__tile {
          padding: 0.5em 0.5em;
        }

        @media (max-width: 480px) {
          .react-calendar__tile {
            padding: 0.5em 0.5em;
          }
        }
      `}</style>
    </>
  );
};
