import React from "react";
import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import LeadCard from "./LeadCard";

const LeadGrid = ({ leads }) => {
  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(350px, 1fr))",
  });

  return (
    <Box minH="100vh">
      <Grid
        templateColumns={templateColumns}
        gap={{ base: 2, md: 2, lg: 2 }}
        p={{ base: 2, md: 2 }}
      >
        {leads.map((lead, index) => (
          <LeadCard key={index} {...lead} />
        ))}
      </Grid>
    </Box>
  );
};

export default LeadGrid;
