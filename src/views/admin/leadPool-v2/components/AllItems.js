// import React from "react";
// import LeadGrid from "./LeadGrid";
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
    />
  );
};

export default AllItems;