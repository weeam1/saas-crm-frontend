import React from "react";
import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import AllItems from "../Leads/AllItems";
import PendingItems from "../Leads/PendingItems";
import RejectedItems from "../Leads/RejectedItems";
import ApprovedItems from "../Leads/ApprovedItems";

const TabContent = ({ activeTab, leadsdata, loading,approveChangeHandler }) => {
  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(320px, 1fr))",
    lg: "repeat(auto-fit, minmax(350px, 1fr))",
  });

  const filteredData =
    leadsdata && leadsdata.approvals ? leadsdata.approvals : [];

  const gridProps = {
    templateColumns,
    gap: { base: 2, md: 2, lg: 3 },
    p: { base: 2, md: 2 },
  };

  return (
    <Box>
      {loading ? (
        <Grid {...gridProps} minW="300px">
          {Array(filteredData.length > 0 ? filteredData.length : 1)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                height="320px"
                borderRadius="lg"
                startColor="gray.100"
                endColor="gray.200"
                width="100%"
              />
            ))}
        </Grid>
      ) : (
        <Grid {...gridProps}>
          {activeTab === "All" && <AllItems data={filteredData} approveChangeHandler={approveChangeHandler} />}
          {activeTab === "Pending" && <PendingItems data={filteredData} approveChangeHandler={approveChangeHandler} />}
          {activeTab === "Approved" && <ApprovedItems data={filteredData} />}
          {activeTab === "Rejected" && <RejectedItems data={filteredData} />}
        </Grid>
      )}
    </Box>
  );
};

export default TabContent;
