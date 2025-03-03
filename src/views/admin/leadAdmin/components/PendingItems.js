import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "./LeadGrid";
import { pendingLeadsData } from "../data/pending";

const PendingItems = () => {
  return <LeadGrid leads={pendingLeadsData}/>;
};

export default PendingItems;