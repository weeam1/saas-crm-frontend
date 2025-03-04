import React from "react";
import LeadGrid from "../components/LeadGrid";
import leadsData from "../data/allitems";

const App = ({data}) => {
  return <LeadGrid leads={data} />;
};

export default App;
