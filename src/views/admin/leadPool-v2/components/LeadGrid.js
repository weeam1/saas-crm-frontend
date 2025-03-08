// import React from "react";
// import { Box, Grid, Text } from "@chakra-ui/react";
// import LeadCard from "./LeadCard";

// const LeadGrid = ({
//   leads,
//   isLoading,
//   approveChangeHandler,
//   buyLoading,
//   sendRequest,
// }) => {
//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minH="200px"
//         p={4}
//       >
//         <Text
//           fontSize="lg"
//           color="gray.500"
//           fontFamily="DM Sans"
//           textAlign="center"
//         >
//           Loading...
//         </Text>
//       </Box>
//     );
//   }

//   // Define grid columns based on number of leads
//   const gridColumns =
//     leads.length === 1
//       ? {
//           base: "minmax(280px, 350px)", // Fixed width for single card
//           md: "minmax(320px, 350px)",
//           lg: "minmax(350px, 350px)",
//         }
//       : {
//           base: "repeat(auto-fit, minmax(280px, 1fr))",
//           md: "repeat(auto-fit, minmax(320px, 1fr))",
//           lg: "repeat(auto-fit, minmax(350px, 1fr))",
//         };

//   return (
//     <Box minH="100vh" overflowX="hidden">
//       {leads.length > 0 ? (
//         <Grid
//           sx={{
//             gridTemplateColumns: gridColumns,
//             gap: { base: 3, md: 4, lg: 4 },
//             p: { base: 2, md: 4 },
//             width: "100%",
//             maxW: "100%",
//             overflowX: "hidden",
//           }}
//         >
//           {leads.map((lead, index) => (
//             <Box key={index} w="100%" maxW="auto" minW="280px">
//               <LeadCard
//                 {...lead}
//                 approveChangeHandler={approveChangeHandler}
//                 sendRequest={sendRequest}
//                 buyLoading={buyLoading}
//               />
//             </Box>
//           ))}
//         </Grid>
//       ) : (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           minH="200px"
//           p={4}
//         >
//           <Text
//             fontSize="lg"
//             color="gray.500"
//             fontFamily="DM Sans"
//             textAlign="center"
//           >
//             No data found
//           </Text>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default LeadGrid;

import React from "react";
import { Box, Grid, Text, Skeleton } from "@chakra-ui/react";
import LeadCard from "./LeadCard";

const LeadGrid = ({
  leads,
  isLoading,
  approveChangeHandler,
  buyLoading,
  sendRequest,
  pageSize, // Add pageSize prop
}) => {
  // Show skeletons when loading or no data is available
  if (isLoading || !leads) {
    const skeletonCount = pageSize || 3; // Default to 3 if pageSize is undefined
    return (
      <Grid
        sx={{
          gridTemplateColumns: {
            base: "repeat(auto-fit, minmax(280px, 1fr))",
            md: "repeat(auto-fit, minmax(320px, 1fr))",
            lg: "repeat(auto-fit, minmax(350px, 1fr))",
          },
          gap: { base: 3, md: 4, lg: 4 },
          p: { base: 2, md: 4 },
          width: "100%",
          maxW: "100%",
          overflowX: "hidden",
        }}
      >
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

  // Define grid columns based on number of leads
  const gridColumns =
    leads.length === 1
      ? {
          base: "minmax(280px, 350px)", // Fixed width for single card
          md: "minmax(320px, 350px)",
          lg: "minmax(350px, 350px)",
        }
      : {
          base: "repeat(auto-fit, minmax(280px, 1fr))",
          md: "repeat(auto-fit, minmax(320px, 1fr))",
          lg: "repeat(auto-fit, minmax(350px, 1fr))",
        };

  return (
    <Box minH="100vh" overflowX="hidden">
      {leads.length > 0 ? (
        <Grid
          sx={{
            gridTemplateColumns: gridColumns,
            gap: { base: 3, md: 4, lg: 4 },
            p: { base: 2, md: 4 },
            width: "100%",
            maxW: "100%",
            overflowX: "hidden",
          }}
        >
          {leads.map((lead, index) => (
            <Box key={index} w="100%" maxW="auto" minW="280px">
              <LeadCard
                {...lead}
                approveChangeHandler={approveChangeHandler}
                sendRequest={sendRequest}
                buyLoading={buyLoading}
              />
            </Box>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="200px"
          p={4}
        >
          <Text
            fontSize="lg"
            color="gray.500"
            fontFamily="DM Sans"
            textAlign="center"
          >
            No data found
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default LeadGrid;