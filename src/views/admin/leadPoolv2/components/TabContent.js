import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, Skeleton } from "@chakra-ui/react";
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Skeleton
              key={item}
              height="300px"
              borderRadius="lg"
              startColor="gray.100"
              endColor="gray.200"
            />
          ))}
        </SimpleGrid>
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
