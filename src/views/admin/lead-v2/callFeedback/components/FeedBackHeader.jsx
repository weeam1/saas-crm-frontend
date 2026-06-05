
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import {
  Box,
  Text,
  useDisclosure,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import dayjs from "dayjs";
import TopPagination from "components/pagination/TopPagination";
import AdvancedSearch from "./AdvanceSearch";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import SearchBox from "../../components/SearchBox";
import DateFilterButton from "../../components/DateFilterButton";
import SearchTags from "components/shared/SearchTags";
import CustomTooltip from "components/shared/CustomTooltip";
import ViewToggle from "components/toggle/ViewToggle";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

export const CallFeedbackHeader = ({
  search,
  onSearch,
  onAdvancedSearch,
  onClear,
  clearAllTags,
  removeTag,
  searchTags,
  setMonth,
  month,
  advancedFilters,
  setFilters,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  refetching,
  loading,
  handlePageSize,
  refetch,
  view,
  handleViewChange,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const searchTermRef = useRef(search || "");
  const dateButtonWrapperRef = useRef(null);

  useEffect(() => {
    searchTermRef.current = search;
  }, [search]);

  const currentMonth = dayjs().format("MM");
  const currentYear = dayjs().year();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    if (!month) {
      setMonth?.(`${currentYear}-${currentMonth}`);
    }
  }, [currentMonth, currentYear, setMonth, month]);

  const handleSearchByName = useCallback(() => {
    const term = searchTermRef.current.trim();
    onSearch?.(term);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    searchTermRef.current = "";
    onClear?.();
  }, [onClear]);

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg="bg.surface"
        borderColor="border.default"
      >
        <Flex
          mb="4"
          justifyContent="space-between"
          flexDirection={{ base: "column", xl: "row" }}
          alignItems={{ base: "flex-start", xl: "center" }}
          gap={{ base: 4, xl: 0 }}
        >
          <Text color="text.heading" fontSize="22px" fontWeight="600">
            <span style={{ marginRight: "4px" }}>Call Feedback</span>
            <CountUpComponent targetNumber={totalItems} />
          </Text>

          <Flex  gap={2} alignItems="center">
            <SearchBox
              setAdvanceSearch={setAdvanceSearch}
              handleSearchByName={handleSearchByName}
              searchTermRef={searchTermRef}
              onClear={handleClear}
            />

            <div ref={dateButtonWrapperRef}>
              <DateFilterButton onClick={onOpen} />
            </div>
  <RefreshButton
              label='Refresh'
              onClick={() => {
                  searchTermRef.current = "";
                  onClear?.();
                  refetch?.();
                }}
              isLoading={refetching}
              isFetching={refetching}
              size='sm'
              />



            <ViewToggle
              moduleView="callFeedbackView"
              view={view}
              handleView={handleViewChange}
            />
          </Flex>
        </Flex>

        {searchTags.length > 0 && (
          <SearchTags
            removeTag={removeTag}
            searchTags={searchTags}
            clearAllTags={clearAllTags}
          />
        )}

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
      </Box>

      <MonthYearModal
        triggerRef={dateButtonWrapperRef}
        isOpen={isOpen}
        onClose={onClose}
        month={selectedMonth}
        year={selectedYear}
        setMonth={setSelectedMonth}
        setYear={setSelectedYear}
        onApply={(month, year) => {
          const formattedMonth = month.padStart(2, "0");
          const formattedYear = year;
          const newMonth = `${formattedYear}-${formattedMonth}`;

          setSelectedMonth(formattedMonth);
          setSelectedYear(formattedYear);
          setMonth?.(newMonth);

          setFilters((prev) => ({
            ...prev,
            month: newMonth,
          }));
        }}
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

const MonthYearModal = ({
  isOpen,
  onClose,
  onApply,
  month,
  year,
  setMonth,
  setYear,
  triggerRef,
}) => {
  const modalRef = useRef(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [popupStyle, setPopupStyle] = useState({});
const colors= useModalColors();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        triggerRef?.current &&
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

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const modalWidth = 350;

      if (isMobile) {
        setPopupStyle({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        });
      } else {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let top = triggerRect.bottom + 8;
        let left = triggerRect.left;

        const spaceBelow = viewportHeight - triggerRect.bottom;
        const modalHeight = 250;

        if (spaceBelow < modalHeight && triggerRect.top > modalHeight) {
          top = triggerRect.top - modalHeight - 8;
        }

        if (left + modalWidth > viewportWidth) {
          left = viewportWidth - modalWidth - 46;
        }

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
      {isMobile && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="bg.overlay"
          zIndex="998"
          onClick={onClose}
        />
      )}

      <Box
        ref={modalRef}
        zIndex="999"
        bg="bg.surface"
        borderRadius="xl"
        boxShadow="deep"
        border="1px solid"
        borderColor="border.default"
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
<style jsx global>{`
  .react-calendar {
    width: 100%;
    border: none !important;
    font-size: 0.9rem;
    height: auto;
    max-height: 280px;
    background-color: ${colors.bg} !important;
  }
  @media (max-width: 768px) {
    .react-calendar {
      font-size: 0.8rem;
    }
  }

  /* Regular tiles */
  .react-calendar__tile {
    padding: 0.25em 0.25em !important;
    line-height: 3.2 !important;
    font-size: 0.75rem;
    color: ${colors.bodyText} !important;
    background-color: transparent !important;
  }

  /* Enabled tile hover */
  .react-calendar__tile:enabled:hover {
    background-color: ${colors.bgInput} !important;
    color: ${colors.accentGold} !important;
  }

  /* Active/Selected tile */
  .react-calendar__tile--active {
    background-color: ${colors.accentGold} !important;
    color: ${colors.headerText} !important;
  }

  /* DISABLED TILES - This is what you wanted to change */
  .react-calendar__tile:disabled {
    background-color: ${colors.bgDeep} !important;
    color: ${colors.mutedText} !important;
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  /* Disabled tile hover (no effect) */
  .react-calendar__tile:disabled:hover {
    background-color: ${colors.bgDeep} !important;
    color: ${colors.mutedText} !important;
  }

  /* Navigation buttons */
  .react-calendar__navigation button {
    color: ${colors.accentGold} !important;
    background: transparent !important;
  }
  .react-calendar__navigation button:enabled:hover {
    background-color: ${colors.bgInput} !important;
  }
  .react-calendar__navigation button:disabled {
    opacity: 0.4 !important;
    cursor: not-allowed !important;
  }

  /* Weekday headers */
  .react-calendar__month-view__weekdays {
    color: ${colors.labelColor} !important;
  }
  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none !important;
    color: ${colors.labelColor} !important;
  }

  /* Neighboring month tiles */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: ${colors.mutedText} !important;
    opacity: 0.6 !important;
  }

  /* Weekend tiles */
  .react-calendar__month-view__days__day--weekend {
    color: ${colors.bodyText} !important;
  }
`}</style>
    </>
  );
};