import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "./LeadGrid";

const PendingItems = ({data}) => {
  return <LeadGrid leads={data} />;
};

export default PendingItems;
