import {
  Box,
  Text,
  IconButton,
  useClipboard,
  useColorModeValue,
  HStack,
  Icon,
  Button,
  Image,
  Flex,
} from "@chakra-ui/react";
import { CopyIcon, InfoIcon } from "@chakra-ui/icons";
import {
  leadIconSize,
  leadlabelFontSize,
  leadValueFontSize,
} from "../../constants";
import CustomTooltip from "components/shared/CustomTooltip";
import { Link } from "react-router-dom";
import { createCountryFinder } from "utils/helpers";

const EntityField = ({
  label,
  value,
  isCopy = false,
  isInfo = false,
  labelProps = {},
  valueProps = {},
  iconProps = {},
  countries = [],
  ...boxProps
}) => {
  const { hasCopied, onCopy } = useClipboard(value || "");

  const labelColor = useColorModeValue("softGray.200", "gray.300");
  const valueColor = useColorModeValue("green.600", "green.300");

  const isPhoneNumber = label === "Phone";
  const isWhatsapp = label === "WhatsApp";

  let country = null;

  const onEntityClick = () => {
    if (!value || (!isPhoneNumber && !isWhatsapp)) return null;

    if (isPhoneNumber) {
      window.location.href = `tel:${value}`;
    }
    // Whatsapp redirect
    else window.open(`https://wa.me/${value}`);
  };

  if (countries?.length > 0) {
    const findCountry = createCountryFinder(countries);

    country = findCountry(value);
  }

  return (
    <Box
      display="flex"
      width="fit-content"
      maxWidth={{
        base: isInfo || isCopy ? "100px" : "160px", // mobile
        lg: isInfo || isCopy ? "100px" : "200px", // desktop
      }}
      flexDir="column"
      justifyContent="flex-start"
      justifySelf="stretch"
      {...boxProps}
    >
      {/* Label + Copy Icon*/}
      <HStack alignItems="center" justifyContent="space-between" flex="1" m={0}>
        {label && (
          <Text
            fontSize={leadlabelFontSize}
            mb="0"
            color={labelColor}
            {...labelProps}
          >
            {label}
          </Text>
        )}

        {isCopy && value && (
          <CustomTooltip
            label={hasCopied ? "Copied!" : "Copy"}
            closeOnClick={false}
            hasArrow
          >
            <IconButton
              icon={<CopyIcon />}
              size="xs"
              fontSize={leadIconSize}
              variant="ghost"
              onClick={onCopy}
              aria-label="Copy text"
              {...iconProps}
            />
          </CustomTooltip>
        )}
        {isInfo && value && (
          <CustomTooltip label={value || "N/A"}>
            <Icon
              as={InfoIcon}
              boxSize={leadIconSize}
              color="blue.300"
              cursor="pointer"
            />
          </CustomTooltip>
        )}
      </HStack>

      {/* Value */}
      {isPhoneNumber || isWhatsapp ? (
        <Button
          as="a"
          onClick={onEntityClick}
          target="_blank"
          rel="noopener noreferrer"
          variant="link"
          cursor="pointer"
        >
          <Text
            fontSize={leadValueFontSize}
            fontWeight="medium"
            color={valueColor}
            textTransform="capitalize"
            isTruncated={isInfo || isCopy}
            {...valueProps}
          >
            {value || "N/A"}
          </Text>
        </Button>
      ) : (
        <Flex align="center" gap="1">
          {country?.flags?.svg && (
            <Image
              src={country.flags?.svg || country.flags?.png}
              alt={value}
              w="16px"
              h="10px"
              objectFit="cover"
              borderRadius="2px"
              shadow="md"
            />
          )}

          <Text
            fontSize={leadValueFontSize}
            fontWeight="medium"
            color={valueColor}
            // textTransform='capitalize'
            isTruncated={isInfo || isCopy}
            {...valueProps}
          >
            {value || "N/A"}
          </Text>
        </Flex>
      )}
    </Box>
  );
};
export default EntityField;
