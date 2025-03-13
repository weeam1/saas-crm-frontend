// import React from "react";
// import LeadGrid from "./LeadGrid";
<<<<<<< HEAD
// import leadsData from "../data/allitems";

// const App = ({data}) => {
//   return <LeadGrid leads={data}  />;
// };

// export default App;

import React from "react";
import LeadGrid from "./LeadGrid";

const AllItems = ({ data, isLoading, sendRequest, buyLoading, pageSize }) => {
  return (
    <LeadGrid
      leads={data}
      sendRequest={sendRequest}
      buyLoading={buyLoading}
      isLoading={isLoading}
      pageSize={pageSize} 
=======

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
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
    />
  );
};

<<<<<<< HEAD
export default AllItems;
=======
export default AllItems;
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
