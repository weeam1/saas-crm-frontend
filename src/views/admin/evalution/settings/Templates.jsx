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
import TemplateModal from "./components/TemplateModal";

const Templates = () => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      roleName: "Sales Agent",
      description: "Template for sales performance evaluation",
      questions: [
        "Puntual",
        "Active",
      ],
    },
    {
      id: 2,
      roleName: "HR Manager",
      description: "Template for HR department evaluation",
      questions: ["Performance"],
    },
    {
      id: 3,
      roleName: "Marketing Officer",
      description: "Template for campaign management review",
      questions: [
        "How successful was your latest campaign?",
        "Was ROI achieved as planned?",
      ],
    },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAddTemplate = (role) => {
    setSelectedRole(role);
    onOpen();
  };

  const handleSaveTemplate = (updatedTemplate) => {
    setTableData((prev) =>
      prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
    );
    onClose();
  };

  const columns = ["SR.No", "Role Name", "Description", "Action"];

  return (
    <Box overflowY="auto" scrollBehavior="smooth" boxShadow="sm" bg="white" px={2} mt={"-16px"}> 
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "normal", sm: "normal", md: "center" }}
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Evaluation Templates
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
          />
        </Box>
      </Flex>

      <Box borderRadius="lg" boxShadow="sm" bg="white" maxH="85vh" overflowY="auto">
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
                  <Box display="flex" alignItems="center" justifyContent="center">
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
          <Tbody>
            {tableData.map((template, index) => (
              <Tr key={template.id}>
                <Td textAlign="center">{index + 1}</Td>
                <Td textAlign="center">{template.roleName}</Td>
                <Td textAlign="center">{template.description}</Td>
                <Td textAlign="center">
                  <Button
                    colorScheme="brand"
                    borderRadius={"md"}
                    size="xs"
                    onClick={() => handleAddTemplate(template)}
                  >
                    Add Template
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {selectedRole && (
        <TemplateModal
          isOpen={isOpen}
          onClose={onClose}
          role={selectedRole}
          onSave={handleSaveTemplate}
        />
      )}
    </Box>
  );
};

export default Templates;
