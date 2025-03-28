import React from "react";
import {
  Grid,
  Skeleton,
  useBreakpointValue,
  Text,
  Box,
} from "@chakra-ui/react";
import AllItems from "./AllItems";
import PendingItems from "./PendingItems";
import RejectedItems from "./RejectedItems";

const TabContent = ({
  activeTab,
  data,
  isLoading,
  pageSize,
  sendRequest,
  cancelRequest,
  buyLoading,
  displaySearchData,
}) => {
  console.log(isLoading, "all data");

  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(320px, 1fr))",
    lg: "repeat(auto-fit, minmax(350px, 1fr))",
  });

  const gridProps = {
    templateColumns,
    gap: { base: 2, md: 2, lg: 2 },
    p: { base: 2, md: 2 },
  };

  const skeletonCount = pageSize || 3;

  // Show skeletons while loading
  if (isLoading) {
    return (
      <Grid {...gridProps} minW="300px">
        {Array(skeletonCount)
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
    );
  }

  // After loading, check if there's data
  if (!data || data.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          No data found
        </Text>
      </Box>
    );
  }

  // Render tab content when data is available
  return (
    <Grid {...gridProps}>
      {activeTab === "Buy Leads" && (
        <AllItems
          cancelRequest={cancelRequest}
          data={data}
          isLoading={isLoading}
          sendRequest={sendRequest}
          buyLoading={buyLoading}
          pageSize={pageSize}
        />
      )}
      {activeTab === "Pending" && (
        <PendingItems data={data} cancelRequest={cancelRequest} />
      )}
      {activeTab === "Rejected" && (
        <RejectedItems data={data} cancelRequest={cancelRequest} />
      )}
    </Grid>
  );
};

export default TabContent;
