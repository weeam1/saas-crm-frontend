// import React from "react";
// import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
// import AllItems from "../Leads/AllItems";
// import PendingItems from "../Leads/PendingItems";
// import RejectedItems from "../Leads/RejectedItems";
// import ApprovedItems from "../Leads/ApprovedItems";

// const TabContent = ({ activeTab, leadsdata, loading,approveChangeHandler }) => {
//   const templateColumns = useBreakpointValue({
//     base: "repeat(1, 1fr)",
//     sm: "repeat(1, 1fr)",
//     md: "repeat(auto-fit, minmax(320px, 1fr))",
//     lg: "repeat(auto-fit, minmax(350px, 1fr))",
//   });

//   const filteredData =
//     leadsdata && leadsdata.approvals ? leadsdata.approvals : [];

//   const gridProps = {
//     templateColumns,
//     gap: { base: 2, md: 2, lg: 2 },
//     p: { base: 2, md: 2 },
//   };

//   return (
//     <Box>
//       {loading ? (
//         <Grid {...gridProps} minW="300px">
//           {Array(filteredData.length > 0 ? filteredData.length : 1)
//             .fill(0)
//             .map((_, index) => (
//               <Skeleton
//                 key={index}
//                 height="320px"
//                 borderRadius="lg"
//                 startColor="gray.100"
//                 endColor="gray.200"
//                 width="100%"
//               />
//             ))}
//         </Grid>
//       ) : (
//         <Grid {...gridProps}>
//           {activeTab === "All" && <AllItems data={filteredData} approveChangeHandler={approveChangeHandler} />}
//           {activeTab === "Pending" && <PendingItems data={filteredData} approveChangeHandler={approveChangeHandler} />}
//           {activeTab === "Approved" && <ApprovedItems data={filteredData} />}
//           {activeTab === "Rejected" && <RejectedItems data={filteredData} />}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default TabContent;

import React from "react";
import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import AllItems from "../Leads/AllItems";
import PendingItems from "../Leads/PendingItems";
import RejectedItems from "../Leads/RejectedItems";
import ApprovedItems from "../Leads/ApprovedItems";

const TabContent = ({ activeTab, leadsdata, loading, approveChangeHandler, isSearchActive }) => {
  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(320px, 1fr))",
    lg: "repeat(auto-fit, minmax(350px, 1fr))",
  });

  const filteredData = leadsdata && leadsdata.approvals ? leadsdata.approvals : [];

  const gridProps = {
    templateColumns,
    gap: { base: 2, md: 2, lg: 2 },
    p: { base: 2, md: 2 },
  };

  const renderLeadItems = (data) => {
    if (isSearchActive) {
      return data.map((lead) => {
        const status = lead.approvalStatus?.toLowerCase();
        console.log(`Rendering search result: ${lead.leadName} with status: ${status}`);
        switch (status) {
          case "pending":
            return (
              <PendingItems
                key={lead._id}
                data={[lead]}
                approveChangeHandler={approveChangeHandler}
                isSearchActive={isSearchActive}
              />
            );
          case "accepted":
            return <ApprovedItems key={lead._id} data={[lead]} isSearchActive={isSearchActive} />;
          case "rejected":
            return <RejectedItems key={lead._id} data={[lead]} isSearchActive={isSearchActive} />;
          default:
            return (
              <PendingItems
                key={lead._id}
                data={[lead]}
                approveChangeHandler={approveChangeHandler}
                isSearchActive={isSearchActive}
              />
            );
        }
      });
    } else {
      switch (activeTab) {
        case "All":
          return <AllItems data={data} approveChangeHandler={approveChangeHandler} />;
        case "Pending":
          return <PendingItems data={data} approveChangeHandler={approveChangeHandler} />;
        case "Approved":
          return <ApprovedItems data={data} />;
        case "Rejected":
          return <RejectedItems data={data} />;
        default:
          return <AllItems data={data} approveChangeHandler={approveChangeHandler} />;
      }
    }
  };

  return (
    <Box>
      {loading ? (
        <Grid {...gridProps} minW="300px">
          {Array(filteredData.length > 0 ? filteredData.length : 1)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                height="320px"
                borderRadius="lg"
                startColor="gray.100"
                endColor="gray.200"
                width="100%"
              />
            ))}
        </Grid>
      ) : (
        <Grid {...gridProps}>
          {renderLeadItems(filteredData)}
        </Grid>
      )}
    </Box>
  );
};

export default TabContent;