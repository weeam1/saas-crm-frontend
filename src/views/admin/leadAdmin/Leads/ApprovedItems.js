import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "../components/LeadGrid";
import { approvedLeadData } from "../data/approved";

const ApprovedItems = ({data}) => {
  return <LeadGrid leads={data} />;
};

export default ApprovedItems;
