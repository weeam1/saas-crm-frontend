import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "./LeadGrid";
import { approvedLeadData } from "../data/approved";

const ApprovedItems = () => {
  return <LeadGrid leads={approvedLeadData} />;
};

export default ApprovedItems;
