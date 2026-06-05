import {
  Icon,
  Box,
  Text,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";
import { FaEnvelopeOpenText, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Lead-specific gradient tokens
const leadIconBg = {
  light: "linear-gradient(135deg, #E6F0FF, #B8D9FF)",
  dark: "linear-gradient(135deg, #1A4C8C, #0A2A4A)",
};

const leadIconColor = {
  light: "#1A4C8C",
  dark: "#90CDFF",
};

const LeadSettings = () => {
  const navigate = useNavigate();
  const colors = useModalColors();

  // Detect if dark mode (based on navy backgrounds)
  const isDarkMode = colors.bgDeep === "#0B1C2C";

  const iconBg = isDarkMode ? leadIconBg.dark : leadIconBg.light;
  const iconColor = isDarkMode ? leadIconColor.dark : leadIconColor.light;

  const cards = [
    {
      id: 1,
      title: "Lead Invitation",
      icon: FaEnvelopeOpenText,
      path: "/lead_settings/invitation",
    },
    {
      id: 2,
      title: "Lead Status",
      icon: FaUserPlus,
      path: "/lead_settings/status",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box w="100%" px={{ base: 2, md: 4 }} py={4} bg={colors.bgDeep}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {cards.map((card) => (
          <Box
            key={card.id}
            onClick={() => handleCardClick(card.path)}
            bg={colors.bg}
            borderRadius="2xl"
            p={{ base: 4, md: 5 }}
            cursor="pointer"
            boxShadow={colors.cardShadow}
            transition="all 0.25s ease-in-out"
            border="1px solid"
            borderColor={colors.borderColor}
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: colors.modalShadow,
              bg: colors.bgInput,
              borderColor: colors.borderFocus,
            }}
          >
            <Flex direction="column" align="center" justify="center" gap={3}>
              <Box
                bg={iconBg}
                w="58px"
                h="58px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                shadow="sm"
                transition="all 0.2s ease-in-out"
                _hover={{ transform: "scale(1.08)" }}
              >
                <Icon as={card.icon} boxSize="24px" color={iconColor} />
              </Box>
              <Text
                fontSize="clamp(0.9rem, 2vw, 1rem)"
                fontWeight="600"
                color={colors.headingText}
                textAlign="center"
              >
                {card.title}
              </Text>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default LeadSettings;