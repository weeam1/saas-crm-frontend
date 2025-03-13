import React from "react";
import { Box, Text } from "@chakra-ui/react";
import LeadGrid from "./LeadGrid";

<<<<<<< HEAD
const PendingItems = ({data}) => {
  return <LeadGrid leads={data} />;
=======
const PendingItems = ({data,cancelRequest}) => {
  return <LeadGrid leads={data} cancelRequest={cancelRequest}  />;
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
};

export default PendingItems;
