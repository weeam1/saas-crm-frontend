import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "./LeadGrid";
import { rejectedLeadsData } from "../data/rejected";

const RejectedItems = () => {
  return <LeadGrid leads={rejectedLeadsData} />;
};

export default RejectedItems;
