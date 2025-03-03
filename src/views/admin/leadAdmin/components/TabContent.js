import React, { useState, useEffect } from "react";
import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import AllItems from "./AllItems";
import PendingItems from "./PendingItems";
import RejectedItems from "./RejectedItems";
import { leadsData } from "../data/allitems";
import { pendingLeadsData } from "../data/pending";
import { rejectedLeadsData } from "../data/rejected";
import { approvedLeadData } from "../data/approved";
import ApprovedItems from "./ApprovedItems";

const TabContent = ({ activeTab, onTotalLeadsChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);

  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(320px, 1fr))",
    lg: "repeat(auto-fit, minmax(350px, 1fr))",
  });

  useEffect(() => {
    setIsLoading(true);

    let count = 0;
    switch (activeTab) {
      case "All":
        count = leadsData.length;
        break;
      case "Pending":
        count = pendingLeadsData.length;
        break;
      case "Approved":
        count = approvedLeadData.length;
        break;
      case "Rejected":
        count = rejectedLeadsData.length;
        break;
      default:
        count = 0;
    }
    setItemCount(count);
    onTotalLeadsChange(count);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeTab, onTotalLeadsChange]);

  const gridProps = {
    templateColumns,
    gap: { base: 2, md: 2, lg: 2 },
    p: { base: 2, md: 2 },
  };

  return (
    <Box>
      {isLoading ? (
        <Grid {...gridProps} minW="300px">
          {Array(itemCount > 0 ? itemCount : 1)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                height="300px"
                borderRadius="lg"
                startColor="gray.100"
                endColor="gray.200"
                width="100%"
              />
            ))}
        </Grid>
      ) : (
        <Grid {...gridProps}>
          {activeTab === "All" && <AllItems data={leadsData} />}
          {activeTab === "Pending" && <PendingItems data={pendingLeadsData} />}
          {activeTab === "Approved" && (
            <ApprovedItems data={approvedLeadData} />
          )}
          {activeTab === "Rejected" && (
            <RejectedItems data={rejectedLeadsData} />
          )}
        </Grid>
      )}
    </Box>
  );
};

export default TabContent;
