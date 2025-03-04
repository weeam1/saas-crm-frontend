import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "../components/LeadGrid";
import { rejectedLeadsData } from "../data/rejected";

const RejectedItems = ({data}) => {
  return <LeadGrid leads={data} />;
};

export default RejectedItems;
