import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "./LeadGrid";

const PendingItems = ({data,cancelRequest,isCancelling}) => {
  return <LeadGrid leads={data} cancelRequest={cancelRequest} isCancelling={isCancelling} />;
};

export default PendingItems;
