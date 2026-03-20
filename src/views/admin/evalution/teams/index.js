import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

import TopPagination from "components/pagination/TopPagination";
import AgencyFilterModal from "../components/AgencyFilterModal";
import UserEvaluationTable from "./UserEvalutionTable";
import { useTeams } from "../hooks/useTeams";
import ViewEvaluation from "./components/ViewEvaluation";
import AdvancedSearchModal from "./components/AdvancedSearchModal";
import ActiveFiltersDisplay from "views/admin/payroll/components/ActiveFiltersDisplay";
import useUserSession from "hooks/useUserSession";
import SearchBox from "views/admin/payroll/components/SearchBox";
import RefreshButton from "components/refresh/RefreshButton";
import ViewToggle from "components/toggle/ViewToggle";
import UserEvaluationCards from "./UserEvaluationCard";
import TeamForm from "./TeamForm";
import { toast } from "react-toastify";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const navigate = useNavigate();
  const {
    refetchEvaluations,
    isAgenciesAllowed,
    agencies,
    queryParams,
    data,
    totalPages,
    totalRecords,
    agencyId,
    setAgencyId,
    isLoading,
    isFetching,
    confirmDelete,
    handlePageChange,
    handlePageSize,
    onDateFilterChange,
    setPagination,
    filters,
    handleSearchChange,
    setFilters,
    isSubmitting,
    // Add these from your hook
    createTeam,
    updateTeam,
    isCreatingTeam,
    isUpdatingTeam,
  } = useTeams();

  const { userRoleName } = useUserSession();

  const selectedAgency = useMemo(
    () => agencies.find((a) => a._id === agencyId) || null,
    [agencies, agencyId],
  );

  const [clearFilters, setClearFilters] = useState(false);
  const [viewEvaluation, setViewEvaluation] = useState({
    modal: false,
    data: null,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null); // Change to null instead of empty string

  const [modalType, setModalType] = useState("create");
  const {
    isOpen: teamFormIsOpen,
    onOpen: teamFormOnOpen,
    onClose: teamFormOnClose,
  } = useDisclosure();

  const handleCreateTeam = () => {
    setSelectedTeam(null); // Reset selected team
    setModalType("create");
    teamFormOnOpen();
  };

  const handleEditTeam = (team) => {
    // Transform API data to match what TeamForm expects
    const transformedTeam = {
      _id: team._id,
      name: team.name,
      description: team.description,
      leader: team.leader, // Keep as leader for internal use
      members: team.members,
      createdBy: team.createdBy,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      // Add any other fields you need
    };

    setSelectedTeam(transformedTeam);
    setModalType("edit");
    teamFormOnOpen();
  };
  const {
    isOpen: agencyFilterIsOpen,
    onOpen: agencyFilterOnOpen,
    onClose: agencyFilterOnClose,
  } = useDisclosure();

  const [view, setView] = useState(() => {
    return localStorage.getItem("evalView") || "table";
  });

  const handleAgencyFilter = (value) => {
    setAgencyId(value);
  };

  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null,
      ),
    );

    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters(cleanedFilters);
  };

  const handleClearFilters = (filterKey) => {
    if (filterKey) {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));

      if (filterKey === "search") {
        setSearchTerm("");
      }
    } else {
      setFilters({});
      setPagination((prev) => ({ ...prev, page: 1 }));
      setSearchTerm("");
    }
    setClearFilters(false);
  };

  // Updated handleTeamSubmit to use API calls
  const handleTeamSubmit = async (formData) => {
    try {
      if (modalType === "create") {
        await createTeam(formData);
      } else {
        if (!selectedTeam?._id) {
          toast.error("Team ID not found");
          return;
        }
        await updateTeam(selectedTeam._id, formData);
      }
      teamFormOnClose();
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error("Team operation failed:", error);
    }
  };

  const handleSearchTermChange = (searchQuery) => {
    const trimmed = searchQuery?.trim() || "";

    if (trimmed !== "") {
      setFilters((prev) => ({
        ...prev,
        search: trimmed,
      }));
      setClearFilters(true);
      setPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      setFilters((prev) => {
        const updated = { ...prev };
        delete updated.search;
        return updated;
      });
      setClearFilters(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("evalView", newView);
  };

  return (
    <>
      <AppButton mb="3" leftIcon={<IoArrowBack />} onClick={() => navigate(-1)}>
        Back
      </AppButton>
      <Box
        p={{ base: 4, md: 6 }}
        bg="white"
        minH="80vh"
        borderRadius="md"
        boxShadow="sm"
      >
        {/* Header */}
        <Flex
          flexDir={{ base: "column", md: "row" }}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
          mb={4}
          gap={{ base: 3, md: 0 }}
        >
          {/* Title + Count + Refresh button on mobile */}
          <Flex
            align="center"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            gap={2}
            flexWrap="wrap"
            justify={{ base: "center", md: "flex-start" }}
            w={{ base: "100%", md: "auto" }}
          >
            <Text textAlign={{ base: "center", md: "left" }}>Teams</Text>

            {/* Show refresh button next to text only on mobile */}
            <Box display={{ base: "inline-block", md: "none" }}>
              <RefreshButton
                aria-label="Refresh evaluations"
                isLoading={isLoading}
                isFetching={isFetching}
                onClick={refetchEvaluations}
              />
            </Box>
          </Flex>

          {/* Actions */}
          <HStack
            spacing={{ base: 2, md: 4 }}
            align="center"
            flexWrap="wrap"
            justify={{ base: "center", md: "flex-end" }}
            w={{ base: "100%", md: "auto" }}
            mt={{ base: 1, md: 0 }}
            gap={2}
          >
            {/* Hide refresh button here on mobile */}
            <Box display={{ base: "none", md: "inline-block" }}>
              <RefreshButton
                aria-label="Refresh evaluations"
                isLoading={isLoading}
                isFetching={isFetching}
                onClick={refetchEvaluations}
              />
            </Box>

            <Box w={{ base: "100%", sm: "auto" }} flexShrink={1}>
              <SearchBox
                onSearchTermChange={handleSearchTermChange}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
              />
            </Box>

            <ViewToggle
              moduleView="evalView"
              view={view}
              handleView={handleViewChange}
            />
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              size="sm"
              borderRadius="md"
              onClick={handleCreateTeam}
            >
              Add Team
            </Button>
          </HStack>
        </Flex>

        {/* Active Filters */}
        <ActiveFiltersDisplay
          filters={filters}
          onClearFilters={handleClearFilters}
        />

        {/* Pagination */}
        {!isLoading && (
          <TopPagination
            currentPage={queryParams.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalRecords}
            itemsPerPage={queryParams.limit}
            refetching={isFetching}
            loading={isLoading}
            handlePageSize={handlePageSize}
          />
        )}

        {/* Main Content */}
        {view !== "grid" ? (
          <UserEvaluationTable
            confirmDelete={confirmDelete}
            data={data || []}
            isLoading={isLoading || isFetching}
            setView={setViewEvaluation}
            onEdit={handleEditTeam} // You'll need to pass this to your table component
          />
        ) : (
          <UserEvaluationCards
            confirmDelete={confirmDelete}
            data={data || []}
            isLoading={isLoading || isFetching}
            setView={setViewEvaluation}
            onEdit={handleEditTeam} // You'll need to pass this to your cards component
          />
        )}

        {/* Modals */}
        {viewEvaluation?.modal && (
          <ViewEvaluation
            isOpen={viewEvaluation?.modal}
            onClose={() => setViewEvaluation({ modal: false, data: null })}
            data={viewEvaluation?.data}
          />
        )}

        {agencyFilterIsOpen && (
          <AgencyFilterModal
            isOpen={agencyFilterIsOpen}
            onClose={agencyFilterOnClose}
            handleFilter={handleAgencyFilter}
          />
        )}

        {isFilterOpen && (
          <AdvancedSearchModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilters={handleApplyFilters}
            initialFilters={filters}
          />
        )}

        <TeamForm
          isSubmitting={isSubmitting || isCreatingTeam || isUpdatingTeam}
          modalType={modalType}
          isOpen={teamFormIsOpen}
          onClose={teamFormOnClose}
          onSubmit={handleTeamSubmit}
          initialData={selectedTeam}
          isEditing={modalType === "edit"}
        />
      </Box>
    </>
  );
};

export default Team;
