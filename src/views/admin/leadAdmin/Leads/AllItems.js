import React from "react";
import LeadGrid from "../components/LeadGrid";
import leadsData from "../data/allitems";

const App = ({data,approveChangeHandler}) => {
  return <LeadGrid leads={data} approveChangeHandler={approveChangeHandler}/>;
};

export default App;
