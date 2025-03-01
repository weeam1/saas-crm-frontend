import React, { useState, useEffect } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import AllItems from "./AllItems";
import PendingItems from "./PendingItems";
import RejectedItems from "./RejectedItems";

const TabContent = ({ activeTab }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <Box>
      {isLoading ? (
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      ) : (
        <>
          {activeTab === "All" && <AllItems />}
          {activeTab === "Pending" && <PendingItems />}
          {activeTab === "Rejected" && <RejectedItems />}
        </>
      )}
    </Box>
  );
};

export default TabContent;
