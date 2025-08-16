import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";
import { 
  FaChrome, 
  FaFirefox, 
  FaSafari, 
  FaEdge, 
  FaOpera,
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaMobile,
  FaDesktop,
  FaTablet
} from "react-icons/fa";
import { SiIos } from "react-icons/si";

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const BrowserIcon = ({ name }) => {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("chrome")) return <FaChrome />;
  if (lowerName.includes("firefox")) return <FaFirefox />;
  if (lowerName.includes("safari")) return <FaSafari />;
  if (lowerName.includes("edge")) return <FaEdge />;
  if (lowerName.includes("opera")) return <FaOpera />;
  
  return null;
};

const OsIcon = ({ name }) => {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("windows")) return <FaWindows />;
  if (lowerName.includes("mac") || lowerName.includes("os x")) return <FaApple />;
  if (lowerName.includes("linux")) return <FaLinux />;
  if (lowerName.includes("android")) return <FaAndroid />;
  if (lowerName.includes("ios")) return <SiIos />;
  
  return null;
};

const DeviceIcon = ({ name }) => {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("mobile")) return <FaMobile />;
  if (lowerName.includes("tablet")) return <FaTablet />;
  if (lowerName.includes("desktop")) return <FaDesktop />;
  
  return null;
};

const DeviceInfoRow = ({ value, label, iconColor = "gray.600" }) => {
  const getIcon = () => {
    if (label.toLowerCase().includes("browser")) {
      return <BrowserIcon name={value} />;
    }
    if (label.toLowerCase().includes("os")) {
      return <OsIcon name={value} />;
    }
    if (label.toLowerCase().includes("device")) {
      return <DeviceIcon name={value} />;
    }
    return null;
  };

  const formatValue = (val) => {
    if (!val) return "Unknown";

    if (val.toLowerCase().includes("os x")) return "macOS";
    if (val.toLowerCase().includes("windows")) return "Windows";
    if (val.toLowerCase().includes("linux")) return "Linux";
    if (val.toLowerCase().includes("android")) return "Android";
    if (val.toLowerCase().includes("ios")) return "iOS";
    
    if (val.toLowerCase().includes("chrome")) return "Chrome";
    if (val.toLowerCase().includes("firefox")) return "Firefox";
    if (val.toLowerCase().includes("safari")) return "Safari";
    if (val.toLowerCase().includes("edge")) return "Edge";
    if (val.toLowerCase().includes("opera")) return "Opera";
    
    return capitalize(val);
  };

  return (
    <Box>
      <Text fontSize="sm" color="gray.500" mb={1}>
        {label}
      </Text>
      <Flex align="center" gap={2}>
        <Box color={iconColor} fontSize="lg">
          {getIcon()}
        </Box>
        <Text fontWeight="medium" fontSize="xs">
          {formatValue(value)}
        </Text>
      </Flex>
    </Box>
  );
};

export default DeviceInfoRow;