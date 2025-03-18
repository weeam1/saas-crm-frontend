import React, { useState } from "react";
import LeadGrid from "./LeadGrid";

const AllItems = ({ data, isLoading, sendRequest, pageSize }) => {
  const [buyLoading, setBuyLoading] = useState({});

  const handleSendRequest = async (leadId) => {
    setBuyLoading((prev) => ({ ...prev, [leadId]: true }));
    await sendRequest(leadId);
    setBuyLoading((prev) => ({ ...prev, [leadId]: false }));
  };

  return (
    <LeadGrid
      leads={data}
      sendRequest={handleSendRequest}
      buyLoading={buyLoading}
      isLoading={isLoading}
      pageSize={pageSize}
    />
  );
};

export default AllItems;
