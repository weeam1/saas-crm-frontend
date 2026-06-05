
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import TopPagination from "components/pagination/TopPagination";
import { buttonStyle } from "utils/btn";
import { BiX } from "react-icons/bi";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import { useFetchUsers } from "./hooks/useFetchUsers";
import UserTable from "./components/UserTable";
import SearchBox from "../payroll/components/SearchBox";
import UserModal from "./components/AddUserModal";
import UserFilterDrawer from "./components/UserFilterDrawer";
import ActiveFilters from "../Listing/client-listings/_component/ActiveFilters";
import { usePermissions } from "hooks/usePermissions";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import RefreshButton from "components/refresh/RefreshButton";
import { useModalColors } from "hooks/useModalColors";

const User = () => {
  const colors = useModalColors();
  const {
    agencies,
    queryParams,
    data,
    refetch: refetchUsers,
    totalPages,
    totalRecords,
    isLoading,
    isFetching,
    handlePageChange,
    handlePageSize,
    updateData,
    filters,
    setFilters,
    setPagination,
  } = useFetchUsers();

  const [clearFilters, setClearFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [activeFilters, setActiveFilters] = useState({});

  const { hasPermission } = usePermissions();

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname;

  useEffect(() => {
    if (!hasPermission("users")) return navigate("/default");
  }, []);

  const {
    isOpen: userIsOpen,
    onClose: userOnClose,
    onOpen: userOpen,
  } = useDisclosure();

  const handleAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    userOpen();
  };

  const handleEditUser = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    userOpen();
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
      setPagination((prev) => ({ ...prev, page: 1 }));
      setClearFilters(false);
    }
  };

  const handleApplyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleReset = () => {
    setFilters({});
    setActiveFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchTerm("");
  };

  return (
    <Box p={6} bg={colors.bg} borderRadius="md" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
      {pathname.includes("admin-setting") && (
        <IconButton
          aria-label="Go back"
          icon={<FiChevronLeft />}
          onClick={() => navigate("/admin-setting")}
          size="md"
          isRound
          variant="ghost"
          color={colors.bodyText}
          _hover={{
            color: colors.accentGold,
            bg: colors.secondaryBtnHoverBg,
          }}
        />
      )}

      <Flex
        flexDir={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        mb={2}
      >
        <Flex alignSelf="flex-start" fontSize="lg" fontWeight="bold" gap="2">
          <Text color={colors.headingText}>Users</Text>
          <CountUpComponent key={totalRecords} targetNumber={totalRecords} />
        </Flex>

        <HStack gap="2" alignItems="center">
          <Flex
            justify={{ base: "flex-start", md: "flex-end" }}
            align="center"
            mb={2}
            gap={3}
            flexWrap="wrap"
          >
            <SearchBox
              onSearchTermChange={handleSearchTermChange}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
            />

            {hasPermission("users", "create") && (
              <Button
                leftIcon={<FaPlus size={14} />}
                                size="md"
                borderRadius="12px"
                fontWeight="600"
                px={5}
                mt={{ base: 2, md: 0 }}
                variant="brand"
                onClick={handleAddUser}
                transition="all 0.2s ease"
              >
                New User
              </Button>
            )}
            <UserFilterDrawer
              onApply={handleApplyFilters}
              agencies={agencies}
              filters={filters}
              setActiveFilters={setActiveFilters}
              onReset={handleReset}
            />

            <RefreshButton
              aria-label="Refresh users"
              isLoading={isLoading}
              isFetching={isFetching}
              onClick={refetchUsers}
            />
          </Flex>
        </HStack>
      </Flex>

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

      <ActiveFilters activeFilters={activeFilters} handleReset={handleReset} />

      <UserTable
        data={data || []}
        handleEditUser={handleEditUser}
        isLoading={isLoading || isFetching}
        updateData={updateData}
        refetchUsers={refetchUsers}
      />

      {userIsOpen && (
        <UserModal
          isOpen={userIsOpen}
          onClose={userOnClose}
          mode={modalMode}
          userData={selectedUser}
          agencies={agencies}
          updateData={updateData}
        />
      )}
    </Box>
  );
};

export default User;