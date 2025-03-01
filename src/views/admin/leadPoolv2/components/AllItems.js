import React from "react";
import LeadGrid from "./LeadGrid";
import leadsData from "../data/utils";

const App = () => {
  return <LeadGrid leads={leadsData} />;
};

export default App;
