import React from "react";
import LeadGrid from "../components/LeadGrid";
const App = ({ data, approveChangeHandler }) => {
  return <LeadGrid leads={data} approveChangeHandler={approveChangeHandler} />;
};

export default App;
