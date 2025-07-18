import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
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
    base: "repeat(1, minmax(0, 1fr))",
    sm: "repeat(1, minmax(0, 1fr))",
    md: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
    xl: "repeat(4, minmax(0, 1fr))",
  }}
  autoRows="minmax(360px, auto)" 
  gap={4}
  p={4}
  width="100%"
>
  {calls.map((call, index) => (
    <GridItem key={call.id || call.uniqueid || index}>
      <CallCard
        call={call}
        currentlyPlayingId={currentlyPlayingId}
        handleSetCurrentlyPlaying={handleSetCurrentlyPlaying}
        handleCopy={handleCopy}
        index={index}
      />
    </GridItem>
  ))}
</Grid>
  );
};

export default CallGrid;