import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { getApi } from "services/api";

const TopSearch = ({
  filters,
  setFilters,
  onFilterChange,
  handleClear,
}) => {
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    async function fetchRole() {
      try {
        let result = await getApi("api/role-access");
        const roles = result.data.map(item => ({
          value: item.roleName,
          label: item.roleName
        }));
        setRoleOptions(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
    fetchRole();
  }, []);

  const statusOptions = [
    { value: true, label: "Online" },
    { value: false, label: "Offline" },
  ];

  const accountStatusOptions = [
    { value: true, label: "Enable" },
    { value: false, label: "Disable" },
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };

    if (newFilters[filterType] === value) {
      delete newFilters[filterType];
    } else if (value === "") {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = value;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getFilterLabel = (type, value) => {
    switch (type) {
      case "role":
        return `role: ${roleOptions.find((r) => r.value === value)?.label || value}`;
      case "status":
        return `status: ${statusOptions.find((s) => s.value === value)?.label || value}`;
      case "accountStatus":
        return `account: ${accountStatusOptions.find((a) => a.value === value)?.label || value}`;
      default:
        return `${type}: ${value}`;
    }
  };

  const handleClearAll = () => {
    setFilters({});
    onFilterChange({});
    if (handleClear) {
      handleClear();
    }
  };

  return (
    <Box
      mb={4}
      p={4}
      position="relative"
      zIndex={2}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={3}
        align={{ base: "stretch", md: "center" }}
      >
        {/* Role Dropdown */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            size="sm"
            borderRadius="md"
            bg={filters.role ? "brand.100" : "brand.50"}
            color={filters.role ? "brand.700" : "brand.600"}
            _hover={{ bg: "brand.200", color: "brand.800" }}
            _expanded={{ bg: "brand.100", color: "brand.800" }}
          >
            Role: {filters.role ? getFilterLabel("role", filters.role).replace("role: ", "") : "All"}
          </MenuButton>
          <MenuList borderRadius="md" zIndex={20} maxH="300px" overflowY="auto" bg="brand.50">
            <MenuItem 
              onClick={() => handleFilterChange("role", "")}
              bg={!filters.role ? "brand.100" : "brand.50"}
              color="brand.700"
              _hover={{ bg: "brand.200", color: "brand.800" }}
            >
              All Roles
            </MenuItem>
            {roleOptions.map((role) => (
              <MenuItem
                key={role.value}
                onClick={() => handleFilterChange("role", role.value)}
                bg={filters.role === role.value ? "brand.100" : "brand.50"}
                color={filters.role === role.value ? "brand.700" : "brand.600"}
                _hover={{ bg: "brand.200", color: "brand.800" }}
              >
                {role.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Status Dropdown */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            size="sm"
            borderRadius="md"
            bg={filters.status !== undefined ? "brand.100" : "brand.50"}
            color={filters.status !== undefined ? "brand.700" : "brand.600"}
            _hover={{ bg: "brand.200", color: "brand.800" }}
            _expanded={{ bg: "brand.100", color: "brand.800" }}
          >
            Status:{" "}
            {filters.status !== undefined ? getFilterLabel("status", filters.status).replace("status: ", "") : "All"}
          </MenuButton>
          <MenuList borderRadius="md" zIndex={20} bg="brand.50">
            <MenuItem 
              onClick={() => handleFilterChange("status", "")}
              bg={filters.status === undefined ? "brand.100" : "brand.50"}
              color="brand.700"
              _hover={{ bg: "brand.200", color: "brand.800" }}
            >
              All Status
            </MenuItem>
            {statusOptions.map((status) => (
              <MenuItem
                key={status.value}
                onClick={() => handleFilterChange("status", status.value)}
                bg={filters.status === status.value ? "brand.100" : "brand.50"}
                color={filters.status === status.value ? "brand.700" : "brand.600"}
                _hover={{ bg: "brand.200", color: "brand.800" }}
              >
                {status.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Account Status Dropdown */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            size="sm"
            borderRadius="md"
            bg={filters.accountStatus !== undefined ? "brand.100" : "brand.50"}
            color={filters.accountStatus !== undefined ? "brand.700" : "brand.600"}
            _hover={{ bg: "brand.200", color: "brand.800" }}
            _expanded={{ bg: "brand.100", color: "brand.800" }}
          >
            Account:{" "}
            {filters.accountStatus !== undefined
              ? getFilterLabel("accountStatus", filters.accountStatus).replace("account: ", "")
              : "All"}
          </MenuButton>
          <MenuList borderRadius="md" zIndex={20} bg="brand.50">
            <MenuItem 
              onClick={() => handleFilterChange("accountStatus", "")}
              bg={filters.accountStatus === undefined ? "brand.100" : "brand.50"}
              color="brand.700"
              _hover={{ bg: "brand.200", color: "brand.800" }}
            >
              All Accounts
            </MenuItem>
            {accountStatusOptions.map((account) => (
              <MenuItem
                key={account.value}
                onClick={() =>
                  handleFilterChange("accountStatus", account.value)
                }
                bg={
                  filters.accountStatus === account.value
                    ? "brand.100"
                    : "brand.50"
                }
                color={filters.accountStatus === account.value ? "brand.700" : "brand.600"}
                _hover={{ bg: "brand.200", color: "brand.800" }}
              >
                {account.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Clear All Button - Only show when filters are active */}
        {(filters.role || filters.status !== undefined || filters.accountStatus !== undefined) && (
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default TopSearch;