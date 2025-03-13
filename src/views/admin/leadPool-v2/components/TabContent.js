<<<<<<< HEAD
// import React from "react";
// import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
=======

// import React from "react";
// import {
//   Grid,
//   Skeleton,
//   useBreakpointValue,
//   Text,
//   Box,
// } from "@chakra-ui/react";
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
//     base: "repeat(1, 1fr)", // 1 column on mobile
//     sm: "repeat(1, 1fr)",
//     md: "repeat(auto-fit, minmax(320px, 1fr))", // Multiple columns on medium
//     lg: "repeat(auto-fit, minmax(350px, 1fr))", // Multiple columns on large
=======
//     base: "repeat(1, 1fr)",
//     sm: "repeat(1, 1fr)",
//     md: "repeat(auto-fit, minmax(320px, 1fr))",
//     lg: "repeat(auto-fit, minmax(350px, 1fr))",
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
//   });

//   const gridProps = {
//     templateColumns,
//     gap: { base: 2, md: 2, lg: 2 },
//     p: { base: 2, md: 2 },
//   };

<<<<<<< HEAD
//   // Skeleton count: use data.length if available, otherwise fall back to pageSize or 3
//   const skeletonCount = data.length > 0 ? data.length : pageSize || 3;

//   if (isLoading) {
=======
//   // Show skeletons only when isLoading is true
//   if (isLoading) {
//     const skeletonCount = pageSize || 3;
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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

<<<<<<< HEAD
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
=======
//   // Show "No data found" when data is empty and not loading
//   if (!data || data.length === 0) {
//     return (
//       <Box textAlign="center" py={10}>
//         <Text fontSize="lg" color="gray.500">
//           No data found
//         </Text>
//       </Box>
//     );
//   }

//   // Render tab content when data is available
//   return (
//     <Grid {...gridProps}>
//       {activeTab === "All" && (
//         <AllItems
//           data={data}
//           isLoading={isLoading}
//           sendRequest={sendRequest}
//           buyLoading={buyLoading}
//           pageSize={pageSize}
//         />
//       )}
//       {activeTab === "Pending" && <PendingItems data={data} />}
//       {activeTab === "Rejected" && <RejectedItems data={data} />}
//     </Grid>
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
//   );
// };

// export default TabContent;

import React from "react";
<<<<<<< HEAD
import { Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
=======
import {
  Grid,
  Skeleton,
  useBreakpointValue,
  Text,
  Box,
} from "@chakra-ui/react";
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
import AllItems from "./AllItems";
import PendingItems from "./PendingItems";
import RejectedItems from "./RejectedItems";

const TabContent = ({
  activeTab,
  data,
  isLoading,
  pageSize,
  sendRequest,
<<<<<<< HEAD
  buyLoading,
}) => {
  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)", // 1 column on mobile
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(320px, 1fr))", // Multiple columns on medium
    lg: "repeat(auto-fit, minmax(350px, 1fr))", // Multiple columns on large
=======
  cancelRequest,
  buyLoading,
  displaySearchData, 
}) => {
  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    sm: "repeat(1, 1fr)",
    md: "repeat(auto-fit, minmax(320px, 1fr))",
    lg: "repeat(auto-fit, minmax(350px, 1fr))",
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
  });

  const gridProps = {
    templateColumns,
    gap: { base: 2, md: 2, lg: 2 },
    p: { base: 2, md: 2 },
  };

<<<<<<< HEAD
  // Show skeletons if isLoading is true or data is not yet available
  if (isLoading || !data || data.length === 0) {
    const skeletonCount = pageSize || 3; // Default to 3 if pageSize is undefined
=======
  // Show skeletons when isLoading is true
  if (isLoading) {
    const skeletonCount = pageSize || 3;
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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

<<<<<<< HEAD
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
=======
  // Show "No data found" only when it's a search result and no data is returned
  if (displaySearchData && (!data || data.length === 0)) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          No data found
        </Text>
      </Box>
    );
  }

  // Render tab content when data is available
  if (data && data.length > 0) {
    return (
      <Grid {...gridProps}>
        {activeTab === "All" && (
          <AllItems
          cancelRequest={cancelRequest}
            data={data}
            isLoading={isLoading}
            sendRequest={sendRequest}
            buyLoading={buyLoading}
            pageSize={pageSize}
          />
        )}
        {activeTab === "Pending" && <PendingItems data={data} cancelRequest={cancelRequest}/>}
        {activeTab === "Rejected" && <RejectedItems data={data} cancelRequest={cancelRequest}/>}
      </Grid>
    );
  }

  // If not loading, not a search, and no data, keep skeletons (this won't typically happen unless API fails silently)
  const skeletonCount = pageSize || 3;
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
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
    </Grid>
  );
};

export default TabContent;