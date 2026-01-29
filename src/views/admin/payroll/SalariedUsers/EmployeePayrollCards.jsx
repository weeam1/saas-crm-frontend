import {
  Box,
  Flex,
  Icon,
  Button,
  Text,
  Center,
  SimpleGrid,
  Stack,
  Badge,
  useDisclosure,
  Skeleton,
  SkeletonText,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  HStack,
  Progress,
} from "@chakra-ui/react";
import { constant } from "constant";
import {
  FiEye,
  FiPrinter,
  FiMoreVertical,
  FiAlertTriangle,
  FiAlertCircle,
  FiTrash2,
} from "react-icons/fi";
import { FaClockRotateLeft } from "react-icons/fa6";
import NoData from "components/Message/NoData";
import { useEffect, useState, useCallback } from "react";
import { formatCurrency } from "utils/helpers";
import PayslipDownloadModal from "../components/PayslipDownloadModal";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const EmployeePayrollCards = ({
  onViewHistoryModalOpen,
  onAddHistoryModalOpen,
  setPayRollData,
  onDelete,
  data = [],
  isLoading,
  month,
  year,
  refetchPayslips,
}) => {
  const monthName = new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
  });
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployeeForDelete, setSelectedEmployeeForDelete] =
    useState(null);
  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] =
    useState(null);
  const handleDeleteConfirm = useCallback(() => {
    if (selectedEmployeeForDelete && onDelete) {
      onDelete(selectedEmployeeForDelete);
    }
    onDeleteModalClose();
  }, [selectedEmployeeForDelete, onDelete, onDeleteModalClose]);
  useEffect(() => {
    let timer;
    if (isLoading) setDelayedLoading(true);
    else timer = setTimeout(() => setDelayedLoading(false), 600);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handlePayslipGenerate = useCallback(
    (employee) => {
      setSelectedEmployeeForModal(employee);
      onOpen();
    },
    [onOpen],
  );

  return (
    <>
      <Box my={4}>
        {delayedLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={2}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Box
                minH="240px"
                key={i}
                bg="white"
                p={6}
                rounded="2xl"
                boxShadow="md"
              >
                <Skeleton height="60px" mb={4} />
                <SkeletonText noOfLines={5} spacing={3} />
              </Box>
            ))}
          </SimpleGrid>
        ) : data.length === 0 ? (
          <Center py={10}>
            <NoData label="payroll records" />
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={2}>
            {data.map((row, index) => {
              const imgSrc = row?.profileImage
                ? `${constant.baseUrl}${row.profileImage}`
                : undefined;
              return (
                <Box
                  key={row._id || index}
                  rounded="2xl"
                  border="1px solid"
                  borderColor="gray.200"
                  position="relative"
                  transition="all .2s"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "lg",
                  }}
                >
                  {/* Header */}
                  <Box p={2}>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Flex align="center" gap={3}>
                        <Avatar
                          size="md"
                          src={imgSrc}
                          name={row?.fullName}
                          borderWidth="3px"
                        />

                        <Box>
                          <Flex align="center" justify="space-between">
                            <Tooltip
                              label={row?.fullName}
                              placement="top"
                              hasArrow
                            >
                              <Text
                                fontWeight="bold"
                                isTruncated
                                fontSize={{
                                  base: "10px",
                                  sm: "11px",
                                  md: "12px",
                                  lg: "13px",
                                  xl: "14px",
                                }}
                                maxW={{
                                  base: "110px",
                                  sm: "150px",
                                  lg: "80px",
                                  xl: "100px",

                                  "2xl": "150px",
                                  //   "2lg": "80px",
                                }}
                              >
                                {row?.fullName}
                              </Text>
                            </Tooltip>
                            <Flex
                              position="absolute"
                              top="5px"
                              right="10px"
                              align="center"
                              gap={1}
                            >
                              <Badge
                                px={2}
                                py={0.5}
                                rounded="full"
                                fontSize="xs"
                                colorScheme={
                                  row?.payslip?.status === "paid"
                                    ? "green"
                                    : "orange"
                                }
                                textTransform="uppercase"
                              >
                                {row?.payslip?.status === "paid"
                                  ? "Paid"
                                  : "Unpaid"}
                              </Badge>

                              <Menu placement="bottom-end">
                                <MenuButton
                                  as={IconButton}
                                  aria-label="More actions"
                                  icon={<FiMoreVertical />}
                                  size="xs"
                                  variant="ghost"
                                  _hover={{ bg: "gray.200" }}
                                />
                                <MenuList minW="150px" fontSize="sm">
                                  <MenuItem
                                    icon={<FiAlertTriangle />}
                                    onClick={() => {
                                      onAddHistoryModalOpen();
                                      setPayRollData(row);
                                    }}
                                  >
                                    Add Warning
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FaClockRotateLeft />}
                                    onClick={() => {
                                      onViewHistoryModalOpen();
                                      setPayRollData(row);
                                    }}
                                  >
                                    View Warning History
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Flex>

                            {/* <Badge
                                position="absolute"
                                top="10px"
                                right="10px"
                                px={2}
                                py={0.5}
                                rounded="full"
                                fontSize="xs"
                                colorScheme={
                                  row?.payslip?.status === "paid"
                                    ? "green"
                                    : "orange"
                                }
                                textTransform="uppercase"
                                flexShrink={0}
                              >
                                {row?.payslip?.status === "paid"
                                  ? "Paid"
                                  : "Unpaid"}
                              </Badge>
                              <Menu
                                placement="bottom-end"
                                position="absolute"
                                top="10px"
                                right="10px"
                              >
                                <MenuButton
                                  as={IconButton}
                                  aria-label="More actions"
                                  icon={<FiMoreVertical />}
                                  variant="ghost"
                                  size="xs"
                                  colorScheme="gray"
                                  _hover={{ bg: "gray.200" }}
                                />
                                <MenuList
                                  minW="150px"
                                  fontSize="sm"
                                  zIndex={9999}
                                >

                                  <MenuItem
                                    icon={<FiAlertTriangle />}
                                    onClick={onAddHistoryModalOpen}
                                    _hover={{ bg: "yellow.50" }}
                                  >
                                    <Text color="yellow.600">Warning</Text>
                                  </MenuItem>


                                  <MenuItem
                                    icon={<FiAlertCircle />}
                                    onClick={onViewHistoryModalOpen}
                                    _hover={{ bg: "orange.50" }}
                                  >
                                    <Text color="orange.600">
                                      Warning History
                                    </Text>
                                  </MenuItem>


                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    onClick={onDeleteModalOpen}
                                    _hover={{ bg: "red.50" }}
                                  >
                                    <Text color="red.600">Delete</Text>
                                  </MenuItem>
                                </MenuList>
                              </Menu> */}
                          </Flex>

                          <Text fontSize="10px" color="gray.500">
                            {row.roles?.[0]?.roleName}
                          </Text>
                          <Text
                            fontSize="10px"
                            color="gray.500"
                            fontWeight={"bold"}
                          >
                            {row.agency.name || "No Agency"}
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>

                    {/* Payroll Period */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text
                          fontWeight="medium"
                          fontSize={"12px"}
                          color="gray.600"
                        >
                          Performance Score
                        </Text>
                        <Text
                          fontWeight="bold"
                          fontSize={"12px"}
                          color={
                            row?.evaluation?.finalPercentage > 70
                              ? "green.500"
                              : row?.evaluation?.finalPercentage >= 50
                                ? "yellow.500"
                                : "red.500"
                          }
                        >
                          {row?.evaluation?.finalPercentage || 0}%
                        </Text>
                      </HStack>
                      <Progress
                        value={row?.evaluation?.finalPercentage || 0}
                        colorScheme={
                          row?.evaluation?.finalPercentage > 70
                            ? "green"
                            : row?.evaluation?.finalPercentage >= 50
                              ? "yellow"
                              : "red"
                        }
                        size="xs"
                        w="100%"
                        borderRadius="full"
                      />
                    </Box>

                    <Divider mb={3} />

                    {/* Salary Info */}
                    <Stack spacing={2} fontSize="sm">
                      <Flex justify="space-between">
                        <Text color="gray.600" fontSize={"12px"}>
                          Basic
                        </Text>
                        <Text
                          fontWeight="semibold"
                          color="green.500"
                          fontSize={"12px"}
                        >
                          {row.payrollSummary?.basicSalary || 0}
                        </Text>
                      </Flex>

                      <Flex justify="space-between">
                        <Text color="gray.600" fontSize={"12px"}>
                          Deductions
                        </Text>
                        <Text
                          fontWeight="semibold"
                          color="red.500"
                          fontSize={"12px"}
                        >
                          -{row.payrollSummary?.totalDeductions || 0}
                        </Text>
                      </Flex>
                    </Stack>

                    <Divider my={2} />

                    {/* Net Salary */}
                    <Flex justify="space-between">
                      <Text fontWeight="bold" fontSize={"12px"}>
                        Net Salary
                      </Text>
                      <Text
                        fontSize={"12px"}
                        fontWeight="bold"
                        color="black.500"
                      >
                        {formatCurrency(row.payrollSummary?.netSalary || 0)}
                      </Text>
                    </Flex>
                    <Divider mt={2} color={"blackAlpha.900"} />
                  </Box>
                  <Flex
                    roundedBottom="2xl"
                    p={2}
                    justify="space-between"
                    align="center"
                    bg="gray.100"
                  >
                    <Button
                      variant="ghost"
                      bgColor="purple.200"
                      bgOpacity={0.6}
                      leftIcon={<FiEye />}
                      size="xs"
                      _hover={{ bg: "purple.300" }}
                      onClick={() =>
                        navigate(
                          `/payroll/payslip/${row._id}?month=${month}&year=${year}`,
                        )
                      }
                    >
                      Details
                    </Button>

                    <Button
                      size="xs"
                      bgOpacity={0.6}
                      leftIcon={<FiPrinter />}
                      bg="green.200"
                      _hover={{ bg: "green.300" }}
                      onClick={() => handlePayslipGenerate(row)}
                    >
                      Generate
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Box>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Payroll Record"
        itemName={
          selectedEmployeeForDelete?.name ||
          selectedEmployeeForDelete?.user?.name
        }
        extraText={`payroll record for ${month}/${year}`}
      />
      {isOpen && selectedEmployeeForModal && (
        <PayslipDownloadModal
          isOpen={isOpen}
          onClose={onClose}
          employee={selectedEmployeeForModal}
          month={month}
          year={year}
          refetchPayslips={refetchPayslips}
        />
      )}
    </>
  );
};

export default EmployeePayrollCards;
