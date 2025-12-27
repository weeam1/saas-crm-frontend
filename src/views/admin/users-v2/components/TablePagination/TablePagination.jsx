// Pagination Code

<Flex
  bg="white"
  py={4}
  mt={4}
  justify="space-between"
  align="center"
  borderTop="1px solid"
  borderColor="gray.100"
  zIndex={15}
  px={2}
  gap={4}
  flexWrap="wrap"
>
  {/* Left: Page Size */}
  <Flex align="center" gap={2} flex="0 0 auto">
    <Text fontSize="sm" color="gray.600" fontWeight="500">
      Rows per page:
    </Text>

    <Select
      size="md"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setPage(1);
      }}
      w="80px"
      borderRadius="14px"
      borderColor="gray.300"
      bg="gray.50"
      fontSize="sm"
      _hover={{ borderColor: "gray.400" }}
      _focus={{
        borderColor: "gray.500",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
      }}
    >
      {[10, 20, 30, 50].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </Select>
  </Flex>

  {/* Middle: Navigation Controls */}
  <Flex
    align="center"
    gap={1}
    bg="gray.50"
    px={3}
    py={2}
    borderRadius="12px"
    boxShadow="sm"
    flex="0 0 auto" // prevent stretching
    mx="auto" // center horizontally
    mt={{ base: 2, md: 0 }} // spacing for small screens
  >
    <Tooltip label="First Page">
      <IconButton
        aria-label="First Page"
        icon={<ChevronLeft size={18} />}
        size="sm"
        onClick={() => setPage(1)}
        isDisabled={page === 1}
        variant="ghost"
      />
    </Tooltip>
    <Tooltip label="Previous Page">
      <IconButton
        aria-label="Prev Page"
        icon={<ChevronLeft size={18} />}
        size="sm"
        onClick={() => setPage((p) => p - 1)}
        isDisabled={page === 1}
        variant="ghost"
      />
    </Tooltip>

    <Text fontSize="sm" color="gray.700" fontWeight="600" px={2}>
      Page {page} of {totalPages}
    </Text>

    <Tooltip label="Next Page">
      <IconButton
        aria-label="Next Page"
        icon={<ChevronRight size={18} />}
        size="sm"
        onClick={() => setPage((p) => p + 1)}
        isDisabled={page === totalPages}
        variant="ghost"
      />
    </Tooltip>
    <Tooltip label="Last Page">
      <IconButton
        aria-label="Last Page"
        icon={<ChevronRight size={18} />}
        size="sm"
        onClick={() => setPage(totalPages)}
        isDisabled={page === totalPages}
        variant="ghost"
      />
    </Tooltip>
  </Flex>

  {/* Right: Jump To Page */}
  <Flex
    align="center"
    gap={2}
    flex="0 0 auto"
    justify={{ base: "flex-start", md: "flex-end" }}
    mt={{ base: 2, md: 0 }}
  >
    <Text fontSize="sm" color="gray.600" fontWeight="500">
      Jump to:
    </Text>

    <Input
      type="number"
      size="sm"
      w="70px"
      min={1}
      max={totalPages}
      value={jumpPage}
      onChange={(e) => setJumpPage(e.target.value)}
      borderRadius="14px"
      borderColor="gray.300"
      bg="gray.50"
      fontSize="sm"
      _hover={{ borderColor: "gray.400" }}
      _focus={{
        borderColor: "gray.500",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
      }}
    />

    <Button
      size="sm"
      bg="gray.50"
      color="gray.800"
      border="1px solid #D0D5DD"
      borderRadius="12px"
      fontWeight="600"
      px={4}
      _hover={{ bg: "gray.100" }}
      boxShadow="0px 1px 3px rgba(0,0,0,0.08)"
      onClick={() => {
        const num = Number(jumpPage);
        if (num >= 1 && num <= totalPages) setPage(num);
      }}
    >
      Go
    </Button>
  </Flex>
</Flex>;
