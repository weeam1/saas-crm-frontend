import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "../components/LeadGrid";
import { pendingLeadsData } from "../data/pending";

const PendingItems = ({data}) => {
  return <LeadGrid leads={data}/>;
};

export default PendingItems;