import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Input,
  InputGroup,
  Button,
  Flex,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import { buttonStyle } from "../constants";
import { BiX } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import DateFilter from "./DateFilter";
import ViewToggle from "components/toggle/ViewToggle";
import useUserSession from "hooks/useUserSession";
import { FiRefreshCw } from "react-icons/fi";

const AttendanceHeader = ({
  title,
  totalDocs,
  handleSearch,
  searchTermRef,
  handleClear,
  searchClear,
  filterOpen,
  queryParams,
  onDateFilterChange,
  content,
  view,
  handleView,
  isLoading,
  isFetching,
  refetch,
}) => {
  const handleInputChange = (event) => {
    searchTermRef.current = event.target.value;
  };

  const { user, isSuperAdmin } = useUserSession();

  return (
    <Box
      px={{ base: 4, md: 6 }}
      py={4}
      display="flex"
      bg="white"
      borderRadius="md"
      justifyContent="space-between"
      gap="2"
      alignItems={{ base: "stretch", md: "center" }}
      flexDirection={{ base: "column", md: "row" }}
    >
      <Heading fontSize="24px" fontWeight="600">
        {queryParams.agency && (
          <span style={{ paddingRight: "5px" }}>{queryParams.agency}</span>
        )}
        {title}
        <span style={{ marginLeft: "6px" }}>
          ({<CountUpComponent targetNumber={totalDocs || 0} />})
        </span>
      </Heading>

      <HStack
        gap="2"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-end", md: "center" }}
      >
        <IconButton
          icon={<FiRefreshCw />}
          aria-label="Refresh"
          onClick={() => refetch()}
          isLoading={isLoading || isFetching}
          variant="outline"
          size="sm"
        />
        {/* Search Input & Button */}
        <InputGroup
          bg="white"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          width={{ base: "100%", md: "18rem" }}
          overflow="hidden"
        >
          <Input
            id="searchInput"
            placeholder="Search"
            border="none"
            fontSize="xs"
            height="2.2rem"
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            _focus={{ boxShadow: "none" }}
          />
          <Button
            size="md"
            bg="softGray.700"
            borderLeft="1px solid"
            borderColor="softGray.600"
            px={4}
            borderRadius="0"
            fontSize="xs"
            display="flex"
            alignItems="center"
            _hover={{ bg: "gray.50" }}
            _active={{ bg: "gray.100" }}
            onClick={handleSearch}
          >
            <Flex align="center">
              Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
            </Flex>
          </Button>
        </InputGroup>

        <HStack>
          {content.includes("agencyFilter") && isSuperAdmin && (
            <IconButton
              icon={<FiFilter />}
              onClick={filterOpen}
              aria-label="Filter Date"
              colorScheme="brand"
              variant="solid"
              size="sm"
              borderRadius="full"
              boxShadow="md"
            />
          )}

          {content.includes("date") && (
            <DateFilter onFilterChange={onDateFilterChange} />
          )}

          {content.includes("view") && (
            <ViewToggle
              view={view}
              handleView={handleView}
              moduleView="employeesView"
            />
          )}

          {searchClear && (
            <Button
              {...buttonStyle}
              variant="solid"
              bg="softGray.100"
              w="fit-content"
              color="gray.800"
              sx={{
                svg: {
                  fill: "gray.800",
                },
              }}
              _active={{ bg: "gray.200" }}
              leftIcon={<BiX />}
              aria-label="Clear"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default AttendanceHeader;
