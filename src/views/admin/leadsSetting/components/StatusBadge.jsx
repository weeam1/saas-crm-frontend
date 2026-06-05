import React from "react";
import { Badge } from "@chakra-ui/react";

const StatusBadge = ({ status, generateBgColor }) => (
  <Badge
    px={3}
    py={1}
    borderRadius="full"
    bg={status.bgColor || generateBgColor(status.color)}
    color={status.textColor || status.color}
    fontWeight="500"
    fontSize="sm"
    whiteSpace="nowrap"
    textTransform="none"
  >
    {status.label}
  </Badge>
);

export default StatusBadge;
