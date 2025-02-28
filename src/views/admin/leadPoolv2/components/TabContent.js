import { Box } from "@chakra-ui/react";
import AllItems from "./AllItems";
import PendingItems from "./PendingItems";
import RejectedItems from "./RejectedItems";

const TabContent = ({ activeTab }) => {
  return (
    <Box mt={4}>
      {activeTab === "All" && <AllItems />}
      {activeTab === "Pending" && <PendingItems />}
      {activeTab === "Rejected" && <RejectedItems />}
    </Box>
  );
};

export default TabContent;
