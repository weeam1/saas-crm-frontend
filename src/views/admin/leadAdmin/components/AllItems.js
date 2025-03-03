import React from "react";
import LeadGrid from "./LeadGrid";
import leadsData from "../data/allitems";

const App = () => {
  return <LeadGrid leads={leadsData} />;
};

export default App;
