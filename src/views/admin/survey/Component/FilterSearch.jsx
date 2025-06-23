import React, { useState } from "react";
import { Flex, Box, Text, Stack, useDisclosure } from "@chakra-ui/react";
import TopPagination from "components/pagination/TopPagination";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import DateFilterButton from "views/admin/lead-v2/components/DateFilterButton";
import DateFilter from "./FilterComponent/DateFilter";
import { formatDNS } from "utils/helpers";

const FilterSearch = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  setPageSize,
  handlePageSizeChange,
  isLoading,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setSearchTags,
}) => {
  const [openCalendar, setOpenCalendar] = useState(null);
  const [forceTooltip, setForceTooltip] = useState(false);

  const toggleCalendar = (calendar) => {
    setOpenCalendar((prev) => (prev === calendar ? null : calendar));
  };

  // const dateTimeOnOpen = (data) => {
  // 	console.log(data);
  // };
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const showTooltipBriefly = () => {
    setForceTooltip(true);
    setTimeout(() => setForceTooltip(false), 1500);
  };

  const handleModalClose = () => {
    closeModal();
    showTooltipBriefly();
  };

  const handleApply = ({ from, to }) => {
    setSearchTags([`Start: ${formatDNS(from)}`, `End: ${formatDNS(to)}`]);
    setStartDate(from);
    setEndDate(to);
    handleModalClose();
    onPageChange(1);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTags(null);
  };

  return (
    <Box
      bg="white"
      p={{ base: 3, md: 4 }}
      borderRadius="md"
      boxShadow="sm"
      mb={4}
      width="100%"
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify={{ base: "center", lg: "space-between" }}
        align={{ base: "flex-end", lg: "center" }}
        // align='center'
        gap={{ base: 3, lg: 1 }}
        width="100%"
      >
        <Box
          width={{ base: "100%", md: "auto" }}
          display="flex"
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <TopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            setPageSize={setPageSize}
            handlePageSize={handlePageSizeChange}
            refetching={isLoading}
            loading={isLoading}
          />
        </Box>

        <DateFilterButton onClick={openModal} isForceOpen={forceTooltip} />

        {isModalOpen && (
          <DateFilter
            isOpen={isModalOpen}
            onClose={handleModalClose}
            dateFitlerHanlder={handleApply}
          />
        )}
        {/* Date Filters */}
        {/* <Box
					display='flex'
					flexDirection={{ base: 'column', md: 'row' }}
					alignItems={{ base: 'center', md: 'flex-end' }}
					gap={2}
					width={{ base: '100%', md: 'auto' }}
					flexWrap='wrap'
					justifyContent={{ base: 'center', md: 'flex-end' }}
					marginTop={{ base: 3, md: 0 }}
				>
					<Flex align='center' gap={1} mb={{ base: 2, md: 0 }}>
						<Text fontSize='sm' fontWeight='medium' textAlign='center' mx={1}>
							Date
						</Text>
						<CustomDatePicker
							selectedDate={startDate}
							handleDateChange={setStartDate}
							placeholder='Select start date'
							maxDate={endDate || new Date()}
							isCalendarOpen={openCalendar === 'startFrom'}
							toggleCalendar={() => toggleCalendar('startFrom')}
							popperPlacement='bottom-start'
							popperModifiers={[
								{
									name: 'preventOverflow',
									options: {
										boundary: 'viewport',
										padding: 8,
									},
								},
							]}
						/>
					</Flex>
					<Flex align='center' gap={1}>
						<Text fontSize='sm' fontWeight='medium' textAlign='center' mx={1}>
							To
						</Text>
						<Box minW='160px' maxW='200px'>
							<CustomDatePicker
								selectedDate={endDate}
								handleDateChange={setEndDate}
								placeholder='Select end date'
								minDate={startDate}
								maxDate={new Date()}
								isCalendarOpen={openCalendar === 'endDate'}
								toggleCalendar={() => toggleCalendar('endDate')}
							/>
						</Box>
					</Flex>
				</Box> */}
      </Flex>

      <Flex justifyContent={"flex-end"} mt={3}>
        {/* Clear Button */}
        {(endDate || startDate) && (
          <Box>
            <Text
              as="button"
              fontSize="sm"
              color="red.500"
              fontWeight="medium"
              px={3}
              py={1}
              borderRadius="md"
              _hover={{ bg: "red.50" }}
              onClick={handleClear}
            >
              Clear
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default FilterSearch;
