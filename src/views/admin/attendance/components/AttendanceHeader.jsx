import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Button,
  Flex,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import { buttonStyle } from "../constants";
import { BiX } from "react-icons/bi";
import DateFilter from "./DateFilter";
import ViewToggle from "components/toggle/ViewToggle";
import useUserSession from "hooks/useUserSession";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";
import SearchBar from "components/search/SearchBar";
import { useState, useRef, useEffect } from "react";
import RefreshButton from "components/refresh/RefreshButton";
import FilterButton from "components/base/FilterButton";
const AttendanceHeader = ({
  title,
  totalDocs,
  handleSearch,
  searchTermRef,
  filterOpen,
  queryParams,
  onDateFilterChange,
  content,
  view,
  handleView,
  refetch = null,
  isLoading,
  handleClear, // Add this prop for clearing search
}) => {
  const colors = useModalColors();
  const { user, isSuperAdmin } = useUserSession();

  const onSearchTermChange = (term) => {
    if (searchTermRef) searchTermRef.current = term;
    if (handleSearch) handleSearch(term);
  };

  // Handle clear from SearchBar
  const handleClearSearch = () => {
    if (searchTermRef) searchTermRef.current = "";
    if (handleSearch) handleSearch("");
    if (handleClear) handleClear();
  };

  return (
    <Box
      px={{ base: 4, md: 6 }}
      py={4}
      display="flex"
      bg={colors.bg}
      borderRadius="md"
      justifyContent="space-between"
      gap="2"
      alignItems={{ base: "stretch", md: "center" }}
      flexDirection={{ base: "column", md: "row" }}
      border="1px solid"
      borderColor={colors.borderColor}
    >
      <Heading fontSize="24px" fontWeight="600" color={colors.headingText}>
        {queryParams.agency && (
          <span style={{ paddingRight: "5px" }}>{queryParams.agency}</span>
        )}
        {title}
        <span style={{ marginLeft: "6px" }}>
          (<CountUpComponent targetNumber={totalDocs || 0} />)
        </span>
      </Heading>

      <HStack
        gap="2"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-end", md: "center" }}
      >
        {/* Search Bar Component - with clear handler */}
        <SearchBar
          onSearchTermChange={onSearchTermChange}
          isLoading={isLoading}
          onClear={handleClearSearch}
        />

        <HStack>
          {content.includes("agencyFilter") && isSuperAdmin && (
<FilterButton
	label="Filter agency"
	onClick={filterOpen}
	size="sm"
/>
          )}

          {content.includes("date") && (
            <DateFilter onFilterChange={onDateFilterChange} />
          )}

         {refetch && (
	<RefreshButton
		label="Refresh"
		onClick={() => refetch()}
		isLoading={isLoading}
		isFetching={isLoading}
		size="sm"
	/>
)}

          {content.includes("view") && (
            <ViewToggle
              view={view}
              handleView={handleView}
              moduleView="employeesView"
            />
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default AttendanceHeader;