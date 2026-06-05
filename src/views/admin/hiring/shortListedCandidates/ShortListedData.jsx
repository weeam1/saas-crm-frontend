import ShortListed from "./ShortListed";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import ErrorMessage from "components/Message/ErrorMessage";
import AdvancedSearch from "../candidates/components/AdvancedSearch";
import SearchTags from "components/shared/SearchTags";
import { experienceYearsOptions } from "../helpers";
import useUserSession from "hooks/useUserSession";
import { visaOptions, genderOptions } from "utils/options";

const ShortListedData = ({ invitedRefetch }) => {
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const { isSuperAdmin } = useUserSession();

  const [currentPage, setCurrentPage] = useState(1);
  const [gopageValue, setGopageValue] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryParams, setQueryParams] = useState({
    page: currentPage,
    limit: pageSize,
    sort: "-updatedAt",
  });

  const {
    data: shortListedData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useFetchItemsQuery({
    path: `/applications/short-listed`,
    params: queryParams,
  });

  const { data: allData } = useFetchItemsQuery({
    path: `/applications/short-listed`,
  });

  const { data: positionOptions } = useFetchItemsQuery({
    path: `/positions/options`,
  });

  const { data: agencies } = useFetchItemsQuery(
    {
      path: "/agencies",
    },
    {
      skip: !isSuperAdmin,
    },
  );

  const handleGotoPage = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Handle search from SearchBox - UPDATED: Don't create search tags
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    // REMOVED: No longer creating search tags
  };

  // Update queryParams when page, pageSize, or searchTerm changes
  useEffect(() => {
    const newParams = {
      page: currentPage,
      limit: pageSize,
      sort: "-updatedAt",
    };

    // Add search term to API call if present
    if (searchTerm) {
      newParams.search = searchTerm;
    }

    // Preserve advanced search if it exists
    const currentQueryParams = queryParams;
    if (
      currentQueryParams.advancedSearch &&
      currentQueryParams.advancedSearch !== "{}"
    ) {
      newParams.advancedSearch = currentQueryParams.advancedSearch;
    }

    setQueryParams(newParams);
  }, [currentPage, pageSize, searchTerm]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Update queryParams with sort
    setQueryParams((prev) => ({
      ...prev,
      sort: direction === "asc" ? key : `-${key}`,
    }));
  };

  const handleSearch = (params) => {
    // Filter out empty or undefined values
    const filteredParams = Object.entries(params)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    let advancedSearch = { ...filteredParams };

    // Generate UI tags with both display value and original value
    const tags = Object.entries(filteredParams).map(([key, value]) => {
      let displayValue = value;
      let originalValue = value;
      let label = key.charAt(0).toUpperCase() + key.slice(1);

      if (key === "position") {
        const matchedOption = positionOptions?.doc?.find(
          (option) => option._id === value,
        );
        if (matchedOption) {
          displayValue = matchedOption.value; // For display
          originalValue = matchedOption._id; // For API
          advancedSearch.position = matchedOption._id;
        }
      }

      if (key === "agency") {
        const matchedOption = agencies?.doc?.find(
          (option) => option._id === value,
        );
        if (matchedOption) {
          displayValue = matchedOption.name; // For display
          originalValue = matchedOption._id; // For API
          advancedSearch.agency = matchedOption._id;
        }
      }

      if (key === "experienceYears") {
        const matchedOption = experienceYearsOptions?.find(
          (option) => option.value === value,
        );
        if (matchedOption) {
          displayValue = matchedOption.label; // For display
          originalValue = matchedOption.value; // For API
          advancedSearch.experienceYears = matchedOption.value;
        }
      }

      if (key === "gender") {
        const matchedOption = genderOptions?.find(
          (option) => option.value === value,
        );
        if (matchedOption) {
          displayValue = matchedOption.label;
          originalValue = matchedOption.value;
        }
      }

      if (key === "visaType") {
        const matchedOption = visaOptions?.find(
          (option) => option.value === value,
        );
        if (matchedOption) {
          displayValue = matchedOption.label;
          originalValue = matchedOption.value;
        }
      }

      if (key === "status") {
        originalValue = value;
        displayValue = value;
      }

      if (key === "inviteAccepted") {
        originalValue = value;
        displayValue = value === "true" ? "Accepted" : "Not Accepted";
      }

      return {
        key: label,
        value: displayValue, // For UI display
        originalValue: originalValue, // For API calls
        originalKey: key,
      };
    });

    setSearchTags(tags);

    // Prepare query parameters for API
    const queryParams = {
      advancedSearch: JSON.stringify(advancedSearch),
      page: 1,
      limit: pageSize,
      sort: "-updatedAt",
    };

    // Clear regular search term when using advanced search
    setSearchTerm("");
    setQueryParams(queryParams);
    setCurrentPage(1);
  };

  const removeTag = (key) => {
    const removedTag = searchTags.find((tag) => tag.key === key);
    if (!removedTag) return;

    const updatedTags = searchTags.filter((tag) => tag.key !== key);
    setSearchTags(updatedTags);

    // Handle advanced search tags - USE originalValue, not value!
    const updatedParams = updatedTags.reduce((acc, tag) => {
      acc[tag.originalKey] = tag.originalValue;
      return acc;
    }, {});

    let advancedSearch = { ...updatedParams };

    const queryParams = {
      advancedSearch: JSON.stringify(advancedSearch),
      page: 1,
      limit: pageSize,
      sort: "-updatedAt",
    };

    // Preserve search term if it exists
    if (searchTerm) {
      queryParams.search = searchTerm;
    }

    setQueryParams(queryParams);
    setCurrentPage(1);
  };

  // Clear search function - clears only the search input
  const ClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);

    // Update query params to remove search
    setQueryParams((prev) => {
      const newParams = { ...prev };
      delete newParams.search;
      return newParams;
    });
  };

  // Clear all tags - only clears advanced search tags, not search term
  const clearAllTags = () => {
    setSearchTags([]);

    const queryParams = {
      page: 1,
      limit: pageSize,
      sort: "-updatedAt",
    };

    // Preserve search term if it exists
    if (searchTerm) {
      queryParams.search = searchTerm;
    }

    setQueryParams(queryParams);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <ErrorMessage message={error?.data?.message || "Something went wrong!"} />
    );
  }

  return (
    <Box>
      <ShortListed
        allData={allData}
        data={shortListedData?.doc || []}
        totalDocs={shortListedData?.totalDocs}
        loading={isLoading}
        isFetching={isFetching}
        handleSort={handleSort}
        sortConfig={sortConfig}
        refetch={refetch}
        totalPages={shortListedData?.totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handleGotoPage={handleGotoPage}
        gopageValue={gopageValue}
        setGopageValue={setGopageValue}
        setAdvanceSearch={setAdvanceSearch}
        invitedRefetch={invitedRefetch}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        searchTags={searchTags}
        removeTag={removeTag}
        clearAllTags={clearAllTags}
        onClear={ClearSearch}
      />

      {advanceSearch && (
        <AdvancedSearch
          isOpen={advanceSearch}
          onClose={() => setAdvanceSearch(false)}
          onSearch={handleSearch}
          type="short-listed"
        />
      )}
    </Box>
  );
};

export default ShortListedData;
