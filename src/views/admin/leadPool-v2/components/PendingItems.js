import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "./LeadGrid";

const PendingItems = ({data,cancelRequest}) => {
  return <LeadGrid leads={data} cancelRequest={cancelRequest}  />;
};

export default PendingItems;
