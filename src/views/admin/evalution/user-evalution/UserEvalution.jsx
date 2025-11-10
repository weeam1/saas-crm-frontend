import React, { useState, useEffect } from "react";
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
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import EvaluteModal from "./components/EvaluteModal";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";

const UserEvaluation = () => {
  const [mergedData, setMergedData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data: usersData,
    isFetching: usersFetching,
    refetch: refetchUsers,
  } = useFetchItemsQuery(
    { path: "/v2/user/search_users" },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: evaluationsData,
    isFetching: evalFetching,
    refetch: refetchEvaluations,
  } = useFetchItemsQuery(
    { path: "/evaluation/user-evaluation" },
    { refetchOnMountOrArgChange: true }
  );

  const [createEvaluation] = useCreateItemMutation();

  useEffect(() => {
    if (usersData?.doc) {
      const merged = usersData.doc.map((user) => {
        const evaluation = evaluationsData?.data?.find(
          (e) => e.userId?._id === user._id
        );
        return {
          ...user,
          Avg: evaluation?.avg?.toFixed(2) || "N/A",
          noOfEvaluations: evaluation?.noOfEvaluations || 0,
          feedback: evaluation?.feedback || "",
          agency: evaluation?.userId?.agency?.name || "",
          evaluations: evaluation?.evaluations || [],
        };
      });
      setMergedData(merged);
    }
  }, [usersData, evaluationsData]);

  const handleEvaluate = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleSaveEvaluation = async (payload) => {
    try {
      const res = await createEvaluation({
        path: "/evaluation/user-evaluation",
        body: payload,
      }).unwrap();

      if (res?.success) {
        await refetchEvaluations();
        onClose();
      }
    } catch (err) {
      console.error("Error saving evaluation:", err);
    }
  };

  const isLoading = usersFetching || evalFetching;

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
            onClick={() => {
              refetchUsers();
              refetchEvaluations();
            }}
            isLoading={isLoading}
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

          {isLoading ? (
            <TableLoading columns={columns} length={10} py="4" />
          ) : (
            <Tbody>
              {mergedData?.length > 0 ? (
                mergedData.map((user, index) => (
                  <Tr key={index}>
                    <Td textAlign="center">{user?.fullName}</Td>
                    <Td textAlign="center">{user?.Avg}</Td>
                    <Td textAlign="center">{user?.noOfEvaluations}</Td>
                    <Td textAlign="center">{user?.agency || "N/A"}</Td>
                    <Td textAlign="center">{user?.roles[0]?.roleName}</Td>
                    <Td textAlign="center">
                      <Button
                        colorScheme="brand"
                        borderRadius="md"
                        size="xs"
                        onClick={() => handleEvaluate(user)}
                      >
                        Evaluate
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td
                    colSpan={columns.length}
                    borderBottom="none"
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
                    <NoData label="evaluations" />
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

export default UserEvaluation;
