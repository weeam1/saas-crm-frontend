// import React from "react";
// import LeadGrid from "./LeadGrid";
// import leadsData from "../data/allitems";

// const App = ({data}) => {
//   return <LeadGrid leads={data}  />;
// };

// export default App;

// import React from "react";
// import LeadGrid from "./LeadGrid";

// const AllItems = ({ data, isLoading, sendRequest, buyLoading, pageSize }) => {
//   return (
//     <LeadGrid
//       leads={data}
//       sendRequest={sendRequest}
//       buyLoading={buyLoading}
//       isLoading={isLoading}
//       pageSize={pageSize} 
//     />
//   );
// };

// export default AllItems;

import React, { useState } from "react";
import LeadGrid from "./LeadGrid";

const AllItems = ({ data, isLoading, sendRequest, pageSize }) => {
  const [buyLoading, setBuyLoading] = useState({});

  const handleSendRequest = async (leadId) => {
    setBuyLoading((prev) => ({ ...prev, [leadId]: true })); // Start loading for the specific lead
    await sendRequest(leadId);
    setBuyLoading((prev) => ({ ...prev, [leadId]: false })); // Stop loading
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
