import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { getUserNameById } from "utils";
import { useSelector } from "react-redux";

const ClearAdvancedSearchButton = ({
  clearAdvancedSearch,
  loading,
  searchQuery,
  formValues,
}) => {
  const handleClear = () => {
    clearAdvancedSearch();
  };

  const users = useSelector((state) => state.user?.users) || [];
  const getSearchLabel = () => {
    const agentName = formValues?.agentAssigned
      ? getUserNameById(formValues.agentAssigned, users) ||
        formValues.agentAssigned
      : null;

    if (searchQuery && Object.keys(formValues).length === 0) {
      return `Lead Name: ${searchQuery}`;
    }

    // Advanced search
    if (Object.keys(formValues).length > 0) {
      const searchFields = Object.entries(formValues)
        .filter(
          ([key, value]) =>
            value !== "" &&
            value !== undefined &&
            key !== "agentAssigned" &&
            key !== "managerAssigned"
        )
        .map(([key, value]) => {
          switch (key) {
            case "leadName":
              return `Lead Name: ${value}`;
            case "nationality":
              return `Nationality: ${value}`;
            case "leadStatus":
              return `Lead Status: ${value === "active" ? "Interested" : value === "pending" ? "Not Interested" : value}`;
            case "eLeadStatus":
              return `E. Lead Status: ${value === "-1" ? "No E.Status" : value}`;
            case "leadEmail":
              return `Email: ${value}`;
            case "leadPhoneNumber":
              return `Phone: ${value}`;
            case "leadWhatsappNumber":
              return `WhatsApp: ${value}`;
            case "agentName":
              return `Agent: ${value}`; // Use agentName if provided (unlikely in this case)
            case "managerName":
              return `Manager: ${value}`;
            case "ip":
              return `IP: ${value}`;
            case "leadAddress":
              return `Address: ${value}`;
            case "leadCampaign":
              return `Campaign: ${value}`;
            case "leadSourceDetails":
              return `Source Details: ${value}`;
            case "leadSourceMedium":
              return `Source Medium: ${value}`;
            case "pageUrl":
              return `Page URL: ${value}`;
            case "r_u_in_uae":
              return `In UAE: ${value}`;
            case "timetocall":
              return `Time to Call: ${value}`;
            case "leadLang":
              return `Language: ${value}`;
            case "lastNote":
              return `Last Note: ${value}`;
            case "budget":
              return `Budget: ${value}`;
            default:
              return `${key}: ${value}`; // Fallback for other fields
          }
        });

      // Add agent name if agentAssigned exists, using getUserNameById result
      if (formValues.agentAssigned && agentName) {
        searchFields.push(`Agent: ${agentName}`);
      }
      // Add manager name if needed (assuming similar utility exists, or fallback to ID)
      if (formValues.managerAssigned) {
        const managerName =
          getUserNameById(formValues.managerAssigned) ||
          formValues.managerAssigned;
        searchFields.push(`Manager: ${managerName}`);
      }

      return searchFields.join(", ") || null;
    }

    return null; // No search criteria available
  };

  const searchLabel = getSearchLabel();

  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      mt="4px"
    >
      {searchLabel ? (
        <Text fontSize="sm" color="gray.600" fontFamily="DM Sans">
          {searchLabel}
        </Text>
      ) : (
        <Box /> // Placeholder to maintain layout when no search
      )}
      <Button
        border="1px solid"
        borderColor="softGray.600"
        bg="white"
        borderRadius="md"
        p={4}
        fontSize="xs"
        w="100px"
        minW="max-content"
        height="2.2rem"
        onClick={handleClear}
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
        isDisabled={loading}
        leftIcon={<BiX />}
      >
        Clear
      </Button>
    </Flex>
  );
};

export default ClearAdvancedSearchButton;
