import {
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
  Box,
} from "@chakra-ui/react";
import { useRoles } from "hooks/user/userRoles";
import { CloseIcon } from "@chakra-ui/icons";

const ActiveFiltersDisplay = ({ filters, onClearFilters, users = [] }) => {
  const hasFilters = Object.keys(filters).length > 0;
  const { roles } = useRoles();

  if (!hasFilters) return null;

  //   const getDisplayValue = (key, value) => {
  //     switch (key) {
  //       case "userId":
  //         const user = users?.doc?.find((u) => u._id === value);
  //         return user ? user.fullName : "Unknown User";
  //       case "role":
  //         const role = roles?.find((role) => role?._id === value);
  //         return role ? role.roleName : "Unknown Role";
  //       case "status":
  //         return value.charAt(0).toUpperCase() + value.slice(1);
  //       default:
  //         return value;
  //     }
  //   };
  const getDisplayValue = (key, value) => {
    const callMediumLabels = {
      external_sim: "External SIM",
      whatsapp: "WhatsApp",
      dialer: "Dialer",
    };

    const callQualityLabels = {
      very_bad: "Very Bad",
      bad: "Bad",
      average: "Average",
      good: "Good",
      excellent: "Excellent",
    };

    switch (key) {
      case "callMedium":
        return callMediumLabels[value] || value;

      case "callQuality":
        return callQualityLabels[value] || value;

      case "userId": {
        const user = users?.doc?.find((u) => u._id === value);
        return user ? user.fullName : "Unknown User";
      }

      case "role": {
        const role = roles?.find((role) => role?._id === value);
        return role ? role.roleName : "Unknown Role";
      }

      case "status":
        return value.charAt(0).toUpperCase() + value.slice(1);

      default:
        return value;
    }
  };

  const getTagLabel = (key) => {
    const labels = {
      q: "Search",
      leadName: "Lead Name",
      leadIntId: "Lead ID", // ✅ THIS is the important one
      callMedium: "Call Medium",
      callQuality: "Call Quality",
      reason: "Reason",
      extension: "Extension ID",

      month: "Month",
    };
    return labels[key] || key;
  };

  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      mb={4}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Active Filters ({Object.keys(filters).length})
        </Text>
        <Tag
          size="sm"
          variant="subtle"
          colorScheme="red"
          cursor="pointer"
          onClick={() => onClearFilters()}
          _hover={{ bg: "red.50" }}
          transition="all 0.2s"
        >
          <TagLabel fontSize="xs" fontWeight="medium">
            Clear All
          </TagLabel>
          <CloseIcon boxSize="10px" ml={1} />
        </Tag>
      </Flex>

      <Flex gap={2} wrap="wrap">
        {Object.entries(filters).map(([key, value]) => (
          <Tag
            key={key}
            size="md"
            colorScheme="brand"
            variant="subtle"
            borderRadius="full"
            py={2}
            px={3}
            boxShadow="xs"
            border="1px solid"
            borderColor="brand.100"
          >
            <Flex align="center" gap={2}>
              <Text fontSize="xs" fontWeight="medium" color="gray.600">
                {getTagLabel(key)}:
              </Text>
              <TagLabel fontWeight="semibold" fontSize="sm">
                {getDisplayValue(key, value)}
              </TagLabel>
              <TagCloseButton
                onClick={() => onClearFilters(key)}
                size="sm"
                borderRadius="full"
                _hover={{ bg: "brand.100" }}
              />
            </Flex>
          </Tag>
        ))}
      </Flex>
    </Box>
  );
};

export default ActiveFiltersDisplay;
