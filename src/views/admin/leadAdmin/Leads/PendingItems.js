import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "../components/LeadGrid";

const PendingItems = ({data,approveChangeHandler}) => {
  return <LeadGrid leads={data} approveChangeHandler={approveChangeHandler}/>;
};

export default PendingItems;