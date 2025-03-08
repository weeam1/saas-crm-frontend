// import React from "react";
// import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
// import AllItems from "./AllItems";
// import PendingItems from "./PendingItems";
// import RejectedItems from "./RejectedItems";

// const TabContent = ({
//   activeTab,
//   data,
//   isLoading,
//   pageSize,
//   sendRequest,
//   buyLoading,
// }) => {
//   const templateColumns = useBreakpointValue({
//     base: "repeat(1, 1fr)", // 1 column on mobile
//     sm: "repeat(1, 1fr)",
//     md: "repeat(auto-fit, minmax(320px, 1fr))", // Multiple columns on medium
//     lg: "repeat(auto-fit, minmax(350px, 1fr))", // Multiple columns on large
//   });

//   const gridProps = {
//     templateColumns,
//     gap: { base: 2, md: 2, lg: 2 },
//     p: { base: 2, md: 2 },
//   };

//   // Skeleton count: use data.length if available, otherwise fall back to pageSize or 3
//   const skeletonCount = data.length > 0 ? data.length : pageSize || 3;

//   if (isLoading) {
//     return (
//       <Grid {...gridProps} minW="300px">
//         {Array(skeletonCount)
//           .fill(0)
//           .map((_, index) => (
//             <Skeleton
//               key={index}
//               height="320px"
//               borderRadius="lg"
//               startColor="gray.100"
//               endColor="gray.200"
//               width="100%"
//             />
//           ))}
//       </Grid>
//     );
//   }

//   return (
//     <Box>
//       <Grid {...gridProps}>
//         {activeTab === "All" && (
//           <AllItems
//             data={data}
//             isLoading={isLoading}
//             sendRequest={sendRequest}
//             buyLoading={buyLoading}
//           />
//         )}
//         {activeTab === "Pending" && <PendingItems data={data} />}
//         {activeTab === "Rejected" && <RejectedItems data={data} />}
//       </Grid>
//     </Box>
//   );
// };

// export default TabContent;

import React from "react";
import { Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import AllItems from "./AllItems";
import PendingItems from "./PendingItems";
import RejectedItems from "./RejectedItems";

const TabContent = ({
  activeTab,
  data,
  isLoading,
  pageSize,
  sendRequest,
  buyLoading,
}) => {
  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)", // 1 column on mobile
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(320px, 1fr))", // Multiple columns on medium
    lg: "repeat(auto-fit, minmax(350px, 1fr))", // Multiple columns on large
  });

  const gridProps = {
    templateColumns,
    gap: { base: 2, md: 2, lg: 2 },
    p: { base: 2, md: 2 },
  };

  // Show skeletons if isLoading is true or data is not yet available
  if (isLoading || !data || data.length === 0) {
    const skeletonCount = pageSize || 3; // Default to 3 if pageSize is undefined
    return (
      <Grid {...gridProps} minW="300px">
        {Array(skeletonCount)
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
    );
  }

  return (
    <Grid {...gridProps}>
      {activeTab === "All" && (
        <AllItems
          data={data}
          isLoading={isLoading}
          sendRequest={sendRequest}
          buyLoading={buyLoading}
          pageSize={pageSize}
        />
      )}
      {activeTab === "Pending" && <PendingItems data={data} />}
      {activeTab === "Rejected" && <RejectedItems data={data} />}
    </Grid>
  );
};

export default TabContent;