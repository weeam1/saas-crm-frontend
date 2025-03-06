import React from "react";
import { Box, Grid, Text, useBreakpointValue } from "@chakra-ui/react";
import LeadCard from "../Leads/LeadCard";
const LeadGrid = ({ leads, isLoading }) => {
  const templateColumns = useBreakpointValue({
    base: "repeat(1, minmax(280px, 400px))",
    sm: "repeat(1, minmax(320px, 450px))",
    md: "repeat(auto-fit, minmax(320px, 1fr))",
    lg: "repeat(auto-fit, minmax(350px, 1fr))",
  });

  const singleLeadMaxWidth = useBreakpointValue({
    base: "400px",
    sm: "450px",
    md: "320px",
    lg: "350px",
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="200px"
        p={4}
      >
        <Text
          fontSize="lg"
          color="gray.500"
          fontFamily="DM Sans"
          textAlign="center"
        >
          Loading...
        </Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      {leads.length > 0 ? (
        <Grid
          templateColumns={templateColumns}
          gap={{ base: 3, md: 4, lg: 4 }}
          p={{ base: 2, md: 4 }}
          justifyContent={leads.length === 1 ? "center" : "normal"}
        >
          {leads.map((lead, index) => (
            <Box
              key={index}
              w="100%"
              maxW={leads.length === 1 ? singleLeadMaxWidth : "none"}
            >
              <LeadCard {...lead} />
            </Box>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="200px"
          p={4}
        >
          <Text
            fontSize="lg"
            color="gray.500"
            fontFamily="DM Sans"
            textAlign="center"
          >
            No data found
          </Text>
        </Box>
      )}
    </Box>
  );
};
export default LeadGrid;

