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
  console.log(data, "all data");

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

  // Show skeletons when isLoading is true
  if (isLoading) {
    const skeletonCount = pageSize || 3;
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

  // Show "No data found" only when it's a search result and no data is returned
  if (displaySearchData && (!data || data.length === 0)) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          No data found
        </Text>
      </Box>
    );
  }

  // Render tab content when data is available
  if (data && data?.length > 0) {
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
  }

  // If not loading, not a search, and no data, keep skeletons (this won't typically happen unless API fails silently)
  const skeletonCount = pageSize || 3;
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
};

export default TabContent;
