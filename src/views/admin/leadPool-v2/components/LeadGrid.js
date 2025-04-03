import React from "react";
import { Box, Grid, Skeleton } from "@chakra-ui/react";
import LeadCard from "./LeadCard";

const LeadGrid = ({
  leads,
  isLoading,
  approveChangeHandler,
  buyLoading,
  sendRequest,
  pageSize,
  cancelRequest,
}) => {
  if (isLoading || !leads) {
    const skeletonCount = pageSize || 3;
    return (
      <Grid
        sx={{
          gridTemplateColumns: {
            base: "repeat(auto-fit, minmax(280px, 1fr))",
            md: "repeat(auto-fit, minmax(320px, 1fr))",
            lg: "repeat(auto-fit, minmax(350px, 1fr))",
          },
          gap: { base: 3, md: 4, lg: 4 },
          p: { base: 2, md: 4 },
          width: "100%",
          maxW: "100%",
          overflowX: "hidden",
        }}
      >
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

  const gridColumns =
    leads?.length === 1
      ? {
          base: "minmax(280px, 350px)",
          md: "minmax(320px, 350px)",
          lg: "minmax(350px, 350px)",
        }
      : leads?.length === 2
        ? {
            base: "repeat(auto-fit, minmax(280px, 1fr))",
            md: "repeat(2, minmax(320px, 1fr))",
            lg: "repeat(2, minmax(350px, 350px))",
          }
        : {
            base: "repeat(auto-fit, minmax(280px, 1fr))",
            md: "repeat(auto, minmax(320px, 1fr))",
            lg: "repeat(auto-fit, minmax(340px, 1fr))",
          };

  return (
    <Box minH="100vh" overflowX="hidden">
      <Grid
        sx={{
          gridTemplateColumns: gridColumns,
          gap: { base: 2 },
          p: { base: 2, md: 4 },
          width: "100%",
          maxW: "100%",
          overflowX: "hidden",
          alignItems: "start",
          justifyContent: leads?.length === 1 ? "start" : "start",
        }}
      >
        {leads?.length > 0 &&
          leads.map((lead, index) => (
            <Box key={lead._id || index} w="100%" minW="0">
              <LeadCard
                cancelRequest={cancelRequest}
                {...lead}
                approveChangeHandler={approveChangeHandler}
                sendRequest={sendRequest}
                buyLoading={buyLoading || false}
              />
            </Box>
          ))}
      </Grid>
    </Box>
  );
};

export default LeadGrid;