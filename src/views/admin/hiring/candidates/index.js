import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import ViewToggle from "components/toggle/ViewToggle";
import CandidateTable from "./components/CandidatesTable";
import Applications from "./components/Applications";
import AdvancedSearch from "./components/AdvancedSearch";
import Pagination from "./components/Pagination";
import ErrorMessage from "components/Message/ErrorMessage";
import NotFoundMessage from "components/Message/NotFoundMessage";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import { useNavigate } from "react-router-dom";
import Loader from "components/loading/Loader";
import SearchTags from "components/shared/SearchTags";
import { experienceYearsOptions } from "../helpers";
import useUserSession from "hooks/useUserSession";
import TopPagination from "components/pagination/TopPagination";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

const Candidates = () => {
  const colors = useModalColors();
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const navigate = useNavigate();

  const { user, isSuperAdmin } = useUserSession();
  const [view, setView] = useState(() => {
    return localStorage.getItem("candidateView") || "grid";
  });

  // Add view change handler
  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("candidateView", newView);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Items per page
  const [queryParams, setQueryParams] = useState({
    page: currentPage,
    limit: pageSize,
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

  const { data, error, isLoading, refetch, isFetching } = useFetchItemsQuery({
    path: "/applications",
    params: queryParams,
  });

  // Update queryParams only when necessary
  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      limit: pageSize,
    }));
  }, [pageSize]);

  // Automatically refetch when queryParams change
  useEffect(() => {
    refetch({
      path: "/applications",
      params: queryParams,
    });
  }, [queryParams, refetch]);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
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

    // Generate UI tags and update advancedSearch
    const tags = Object.entries(filteredParams).map(([key, value]) => {
      let formattedValue = value;
      let originalKey = key; // Keep original lowercase key

      // If key is "position", replace value with label for UI, but keep ID in search
      if (key === "position") {
        const matchedOption = positionOptions?.doc?.find(
          (option) => option._id === value,
        );

        if (matchedOption) {
          formattedValue = matchedOption.label; // Use label for UI
          advancedSearch.position = matchedOption._id; // Keep ID for actual search
        }
      }

      // If key is "agency", replace value with label for UI, but keep ID in search
      if (key === "agency") {
        const matchedOption = agencies?.doc?.find(
          (option) => option._id === value,
        );

        if (matchedOption) {
          formattedValue = matchedOption.name; // Use label for UI
          advancedSearch.agency = matchedOption._id; // Keep ID for actual search
        }
      }

      if (key === "experienceYears") {
        const matchedOption = experienceYearsOptions?.find(
          (option) => option.value === value,
        );

        if (matchedOption) {
          formattedValue = matchedOption.label; // Use label for UI
          advancedSearch.experienceYears = matchedOption.value; // Keep ID for actual search
        }
      }

      return {
        key: originalKey.charAt(0).toUpperCase() + originalKey.slice(1), // Capitalized for UI
        value: formattedValue,
        originalKey, // Store original key for removal reference
      };
    });

    setSearchTags(tags);

    // Prepare query parameters
    const queryParams = {
      advancedSearch: JSON.stringify(advancedSearch),
      page: 1,
      limit: pageSize,
    };

    // Update search query and pagination
    setQueryParams((prev) => ({ ...prev, ...queryParams }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const removeTag = (key) => {
    // Find the exact key (case-sensitive)
    const removedTag = searchTags.find((tag) => tag.key === key);
    if (!removedTag) return; // If tag is not found, exit

    const updatedTags = searchTags.filter((tag) => tag.key !== key);
    setSearchTags(updatedTags);

    // Rebuild search parameters after removal
    const updatedParams = updatedTags.reduce((acc, { originalKey, value }) => {
      acc[originalKey] = value; // Use originalKey to prevent case mismatches
      return acc;
    }, {});

    let advancedSearch = { ...updatedParams };

    // Ensure position stays as ID in search
    if (advancedSearch.position) {
      const matchedOption = positionOptions?.doc?.find(
        (option) => option.label === advancedSearch.position,
      );
      if (matchedOption) {
        advancedSearch.position = matchedOption._id;
      }
    }

    // Prepare updated query parameters
    const queryParams = {
      advancedSearch: JSON.stringify(advancedSearch),
      page: 1,
      limit: pageSize,
    };

    // Update query and reset pagination
    setQueryParams(queryParams);
    setCurrentPage(1);
  };

  const clearAllTags = () => {
    setSearchTags([]);

    const queryParams = {
      advancedSearch: JSON.stringify({}),
      page: 1,
      limit: pageSize,
    };

    setQueryParams(queryParams);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <ErrorMessage message={error?.data?.message || "Something went wrong!"} />
    );
  }

  return (
    <Box bg={colors.bgDeep} minH="100vh" p={4}>
      {/* Header */}
      <Box
        mb={6}
        bg={colors.bg}
        shadow={colors.cardShadow}
        p="1rem"
        gap="2"
        borderRadius="lg"
        border="1px solid"
        borderColor={colors.borderColor}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: "column", md: "row" }}
          gap={4}
          mb={4}
        >
          <Text size="20px" color={colors.headingText} fontWeight={"bold"}>
            Candidates
            {data && (
              <span style={{ marginLeft: "6px" }}>
                (<CountUpComponent targetNumber={data?.totalDocs} />)
              </span>
            )}
          </Text>
          <HStack>
            <Button
           variant="outline"
              rounded="md"
              size="sm"
              onClick={() => setAdvanceSearch(true)}

              _active={{ bg: colors.goldDark }}
              transition="all 0.2s ease"
            >
              Advanced Search
            </Button>
            <RefreshButton
                                label="Refresh"
                                onClick={() => refetch()}
                                isLoading={isLoading}
                                isFetching={isFetching}
                                size="sm"
                              />

            <ViewToggle
              moduleView="candidateView"
              view={view}
              handleView={handleViewChange}
            />
          </HStack>
        </Flex>

        <TopPagination
          currentPage={currentPage}
          totalPages={data?.totalPages || 1}
          onPageChange={handlePageChange}
          totalItems={data?.totalDocs || 0}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          refetching={isFetching}
          loading={isLoading}
          handlePageSize={handlePageSizeChange}
        />

        <SearchTags
          removeTag={removeTag}
          searchTags={searchTags}
          clearAllTags={clearAllTags}
        />
      </Box>

      {data?.doc?.length ? (
        view !== "grid" ? (
          <CandidateTable
            candidates={data?.doc || []}
            isLoading={isLoading || isFetching}
            refetch={refetch}
          />
        ) : (
          <Applications candidates={data?.doc || []} refetch={refetch} />
        )
      ) : (
        <NotFoundMessage message="No candidates found!" />
      )}

      {advanceSearch && (
        <AdvancedSearch
          isOpen={advanceSearch}
          onClose={() => setAdvanceSearch(false)}
          onSearch={handleSearch}
        />
      )}
    </Box>
  );
};

export default Candidates;