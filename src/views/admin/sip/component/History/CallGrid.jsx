import React from "react";
import { Grid, Box } from "@chakra-ui/react";
import CallCard from "./CallCard";
import { CallGridSkeleton } from "./CallCardSkeleton";

const CallGrid = ({ 
  calls, 
  currentlyPlayingId, 
  handleSetCurrentlyPlaying, 
  handleCopy,
  loading,
  pageSize
}) => {
  if (loading) {
    return <CallGridSkeleton count={pageSize} />;
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={4}
      p={4}
    >
      {calls.map((call, index) => (
        <CallCard
          key={call.id || call.uniqueid || index}
          call={call}
          currentlyPlayingId={currentlyPlayingId}
          handleSetCurrentlyPlaying={handleSetCurrentlyPlaying}
          handleCopy={handleCopy}
        />
      ))}
    </Grid>
  );
};

export default CallGrid;