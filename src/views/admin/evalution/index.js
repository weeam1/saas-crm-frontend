import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { FaClipboardCheck } from "react-icons/fa";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import EvaluteModal from "./components/EvaluteModal";

const Evalution = () => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      User: "John Doe",
      Avg: 7.5,
      noOfEvalution: 3,
      Agency: "Dubai",
      Role: "Sales Executive",
    },
    {
      id: 2,
      User: "Mary Smith",
      Avg: 9,
      noOfEvalution: 5,
      Agency: "Egypt",
      Role: "HR Manager",
    },
    {
      id: 3,
      User: "Ali Khan",
      Avg: 6.8,
      noOfEvalution: 2,
      Agency: "Qatar",
      Role: "Marketing Officer",
    },
    {
      id: 4,
      User: "Sophia Lee",
      Avg: 8.2,
      noOfEvalution: 4,
      Agency: "UAE",
      Role: "Admin Coordinator",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEvaluate = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleSaveEvaluation = (updatedData) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === updatedData.id
          ? {
              ...item,
              Avg: updatedData.Avg,
              noOfEvalution: item.noOfEvalution + 1,
            }
          : item
      )
    );
    onClose();
  };

  const columns = ["User", "Avg", "No.of.ev", "Agency", "Role", "Actions"];

  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
    >
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "normal", sm: "normal", md: "center" }}
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Evaluation
        </Text>

        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDir={{ base: "column", sm: "column", md: "row" }}
          justifyContent={{ base: "center", sm: "center", md: "normal" }}
        >
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh"
            variant="outline"
            size="sm"
            isLoading={isLoading || isFetching}
          />
        </Box>
      </Flex>

      <Box
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        maxH="85vh"
        overflowY="auto"
      >
        <Table variant="striped" size="lg" bg="white">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            fontSize="16px"
            borderRadius="lg"
          >
            <Tr>
              {columns.map((header, index) => (
                <Th key={index} bg="brand.200" whiteSpace="nowrap" py={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="600"
                      color="gray.700"
                      textTransform="capitalize"
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>

          {isLoading || isFetching ? (
            <TableLoading columns={columns} length={20} py="4" />
          ) : (
            <Tbody>
              {tableData && tableData.length > 0 ? (
                tableData.map((evalute, index) => (
                  <Tr key={index}>
                    <Td textAlign="center">{evalute.User}</Td>
                    <Td textAlign="center">{evalute.Avg || "N/A"}</Td>
                    <Td textAlign="center">{evalute.noOfEvalution || "N/A"}</Td>
                    <Td textAlign="center">{evalute.Agency || "N/A"}</Td>
                    <Td textAlign="center">{evalute.Role}</Td>
                    <Td textAlign="center">
                      <Button
                        colorScheme="brand"
                        borderRadius="md"
                        size="xs"
                        onClick={() => handleEvaluate(evalute)}
                      >
                        Evaluate
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr borderColor="gray.200" textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan={columns.length}
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
                    <NoData label="tasks" />
                  </Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </Box>

      {selectedUser && (
        <EvaluteModal
          isOpen={isOpen}
          onClose={onClose}
          user={selectedUser}
          onSave={handleSaveEvaluation}
        />
      )}
    </Box>
  );
};

export default Evalution;
