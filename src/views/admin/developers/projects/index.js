import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Text, useDisclosure } from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import ErrorMessage from "components/Message/ErrorMessage";
import { useNavigate, useSearchParams } from "react-router-dom";

import TopPagination from "components/pagination/TopPagination";
import ProjectsTable from "./ProjectsTable";
import ProjectHeader from "./ProjectHeader";
import AddProject from "./AddProject";

export default function Projects() {
  const [isLoader, setIsLoader] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchClear, setSearchClear] = useState(false);
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const navigate = useNavigate();
  const searchTermRef = useRef("");

  const user = JSON.parse(localStorage.getItem("user"));

  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles[0]?.roleName;

  useEffect(() => {
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100
    );

    const search = searchParams.get("search") || "";

    setSearchParams(
      (prev) => {
        const newParams = {
          tab: "projects",
          page,
          limit: pageSize,
          ...(search && { search }),
        };

        return newParams;
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setSearchParams]);

  const queryParams = useMemo(() => {
    const search = searchParams.get("search") || "";

    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      ...(search && { search }),
    };
  }, [searchParams]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: projectsRefetch,
  } = useFetchItemsQuery(
    { path: "/developer/projects", params: queryParams },
    { refetchOnMountOrArgChange: true }
  );

  const updateFilters = (newFilters) => {
    setSearchParams(
      (prev) => {
        const prevParams = Object.fromEntries(prev.entries());
        const updatedParams = { ...prevParams, ...newFilters };

        if (updatedParams.page) updatedParams.page = Number(updatedParams.page);
        if (updatedParams.limit)
          updatedParams.limit = Number(updatedParams.limit);

        // Prevent updating if nothing has changed
        if (JSON.stringify(prevParams) === JSON.stringify(updatedParams)) {
          return prevParams;
        }

        return updatedParams;
      },
      { replace: true }
    );
  };

  const handlePageSize = (size) => {
    updateFilters({ page: 1, limit: Number(size) });
  };

  const handlePageChange = (page) => {
    updateFilters({ page: Number(page) });
  };

  useEffect(() => {
    projectsRefetch();
    setIsLoader(true);

    if (!queryParams.search) {
      setSearchClear(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!isFetching) {
      setIsLoader(false);
    } else if (isLoader) {
      const timeout = setTimeout(() => {
        setIsLoader(false);
      }, 1000); // 1 second delay

      return () => clearTimeout(timeout);
    }
  }, [isFetching, isLoader]);

  const handleSearch = () => {
    const term = searchTermRef.current.trim();
    if (!term) return;

    updateFilters({ search: term, page: 1 });
    setSearchClear(true);
  };

  const handleClear = () => {
    searchTermRef.current = "";
    document.getElementById("searchInput").value = "";
    updateFilters({ page: 1 });

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("search");
      return newParams;
    });
    setSearchClear(false);
  };

  if (error) {
    return (
      <ErrorMessage message={error?.data.message || "Something went wrong!"} />
    );
  }

  return (
    <Box minH="100vh" fontFamily="'DM Sans', sans-serif">
      <ProjectHeader
        title="Projects"
        totalDocs={data?.totalDocs}
        handleClear={handleClear}
        handleSearch={handleSearch}
        searchTermRef={searchTermRef}
        searchClear={searchClear}
        queryParams={queryParams}
        handleCreate={onCreateOpen}
        isLoading={isLoading}
        refetch={projectsRefetch}
        isFetching={isFetching}
      />
      <Box Box bg="white" p={5} borderRadius="md" shadow="sm">
        {!isLoading && (
          <TopPagination
            currentPage={queryParams.page}
            totalPages={data?.totalPages}
            onPageChange={handlePageChange}
            totalItems={data?.totalDocs}
            itemsPerPage={queryParams.limit}
            refetching={isFetching}
            loading={isLoading}
            handlePageSize={handlePageSize}
          />
        )}

        <ProjectsTable
          data={data}
          isLoading={isLoading}
          isFetching={isLoader || isFetching}
          refetch={projectsRefetch}
        />

        {isCreateOpen && (
          <AddProject
            isOpen={isCreateOpen}
            onClose={onCreateClose}
            refetch={projectsRefetch}
          />
        )}
      </Box>
    </Box>
  );
}
