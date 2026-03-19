import {
  Icon,
  Box,
  useColorModeValue,
  Text,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaEnvelopeOpenText, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LeadSettings = () => {
  const navigate = useNavigate();

  const iconBg = useColorModeValue(
    "linear-gradient(135deg, #E6F0FF, #B8D9FF)",
    "linear-gradient(135deg, #1A4C8C, #0A2A4A)",
  );
  const iconColor = useColorModeValue("#1A4C8C", "#90CDFF");
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const shadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.05)",
    "rgba(255, 255, 255, 0.06)",
  );

  // Array of card objects - just add new objects here
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
    <Box w="100%" px={{ base: 2, md: 4 }} py={4}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {cards.map((card) => (
          <Box
            key={card.id}
            onClick={() => handleCardClick(card.path)}
            bg={cardBg}
            borderRadius="2xl"
            p={{ base: 4, md: 5 }}
            cursor="pointer"
            boxShadow={`0 1px 3px ${shadowColor}`}
            transition="all 0.25s ease-in-out"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: `0 6px 12px ${shadowColor}`,
              bg: hoverBg,
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
                color={textColor}
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
