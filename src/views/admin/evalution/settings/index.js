import {
  Icon,
  Box,
  Text,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaEnvelopeOpenText, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useModalColors } from "hooks/useModalColors";

const Setting = () => {
  const colors = useModalColors();
  const navigate = useNavigate();

  // Theme-based gradient for icon backgrounds
  const iconBg = `linear-gradient(135deg, ${colors.accentGold}20, ${colors.goldLight}40)`;
  const iconColor = colors.accentGold;
  const hoverBg = colors.bgDeep;
  const shadowColor = colors.cardShadow;

  const cards = [
    {
      id: 1,
      title: "Evaluation Templates",
      icon: FaEnvelopeOpenText,
      path: "/evaluation/templates",
    },
    {
      id: 2,
      title: "Teams",
      icon: FaUserPlus,
      path: "/evaluation/teams",
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
            bg={colors.bg}
            borderRadius="2xl"
            p={{ base: 4, md: 5 }}
            cursor="pointer"
            boxShadow={colors.cardShadow}
            border="1px solid"
            borderColor={colors.borderColor}
            transition="all 0.25s ease-in-out"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: colors.modalShadow,
              bg: hoverBg,
              borderColor: colors.accentGold,
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
                boxShadow={colors.cardShadow}
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

export default Setting;