import React, { useState } from "react";
import { Grid, GridItem, Box } from "@chakra-ui/react";
import CallCard from "./CallCard";
import { CallGridSkeleton } from "./CallCardSkeleton";
import TranscribeModal from "./Component/TranscribeModal";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

const CallGrid = ({
  getUserNameById,
  calls,
  currentlyPlayingId,
  handleSetCurrentlyPlaying,
  setCurrentlyPlayingId,
  handleCopy,
  loading,
  pageSize,
  openLogModal,
  openShareModal,
  openSharedDetailModal,
}) => {
  const [transcribeModal, setTranscribeModal] = useState(false);
  const [currentCall, setCurrentCall] = useState(false);

  if (loading) {
    return <CallGridSkeleton count={pageSize} />;
  }

  const handleOpenTranscribe = (data) => {
    setCurrentCall(data);
    setTranscribeModal(true);
    // setCurrentlyPlayingId(null);
  };

  const handleTranscribeClose = () => {
    setTranscribeModal(false);
    setCurrentCall(null);
  };

  return (
    <>
      {calls.length > 0 ? (
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
                handleOpenTranscribe={handleOpenTranscribe}
                index={index}
                openLogModal={openLogModal}
                openShareModal={openShareModal}
                openSharedDetailModal={openSharedDetailModal}
                getUserNameById={getUserNameById}
              />
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Box w="full" p="4" textAlign="center">
          <NoData label="call records" />
        </Box>
      )}
      {transcribeModal && (
        <TranscribeModal
          isOpen={transcribeModal}
          onClose={handleTranscribeClose}
          data={currentCall}
        />
      )}
    </>
  );
};

export default CallGrid;
