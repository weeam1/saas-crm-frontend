// import React from 'react';
// import { Box, Grid, Text, useBreakpointValue } from '@chakra-ui/react';
// import LeadCard from '../Leads/LeadCard';
// const LeadGrid = ({ leads, isLoading,approveChangeHandler }) => {
// 	// const templateColumns = useBreakpointValue({
// 	// 	base: 'repeat(1, minmax(280px, 400px))',
// 	// 	sm: 'repeat(1, minmax(320px, 450px))',
// 	// 	md: 'repeat(auto-fit, minmax(320px, 1fr))',
// 	// 	lg: 'repeat(auto-fit, minmax(350px, 1fr))',
// 	// });

// 	const singleLeadMaxWidth = useBreakpointValue({
// 		base: '100%',
// 		// sm: '48%', // Two cards per row on small screens
// 		md: '33.33%', // Three cards per row on medium screens
// 		lg: '25%', // Three cards per row on larger screens
// 	});

// 	if (isLoading) {
// 		return (
// 			<Box
// 				display='flex'
// 				justifyContent='center'
// 				alignItems='center'
// 				minH='200px'
// 				p={4}
// 			>
// 				<Text
// 					fontSize='lg'
// 					color='gray.500'
// 					fontFamily='DM Sans'
// 					textAlign='center'
// 				>
// 					Loading...
// 				</Text>
// 			</Box>
// 		);
// 	}

// 	return (
// 		<Box minH='100vh'>
// 			{leads.length > 0 ? (
// 				<Grid
// 					sx={{
// 						// >= 0px
// 						'@media (min-width: 0px)': {
// 							gridTemplateColumns: '1fr',
// 						},
// 						// >= 992px
// 						'@media (min-width: 700px)': {
// 							gridTemplateColumns: 'repeat(2, 1fr)',
// 						},
// 						// >= 1280px
// 						'@media (min-width: 1180px)': {
// 							gridTemplateColumns: 'repeat(3, 1fr)',
// 						},
// 						// >= 1664px
// 						'@media (min-width: 1664px)': {
// 							gridTemplateColumns: 'repeat(4, 1fr)',
// 						},
// 						// >= 1920px (e.g., Full HD+)
// 						'@media (min-width: 2120px)': {
// 							gridTemplateColumns: 'repeat(5, 1fr)',
// 						},
// 						// >= 2560px (2.5K / QHD)
// 						'@media (min-width: 2560px)': {
// 							gridTemplateColumns: 'repeat(6, 1fr)',
// 						},
// 						// >= 3840px (4K)
// 						'@media (min-width: 3840px)': {
// 							gridTemplateColumns: 'repeat(7, 1fr)',
// 						},
// 						// >= 7680px (8K)
// 						'@media (min-width: 7680px)': {
// 							gridTemplateColumns: 'repeat(8, 1fr)',
// 						},
// 					}}
// 					// templateColumns={templateColumns}
// 					gap={{ base: 3, md: 4, lg: 4 }}
// 					p={{ base: 2, md: 4 }}
// 					justifyContent={leads.length === 1 ? 'center' : 'normal'}
// 				>
// 					{leads.map((lead, index) => (
// 						<Box
// 							key={index}
// 							w='100%'
// 							// maxW={leads.length === 1 ? singleLeadMaxWidth : 'none'}
// 						>
// 							<LeadCard {...lead} approveChangeHandler={approveChangeHandler}/>
// 						</Box>
// 					))}
// 				</Grid>
// 			) : (
// 				<Box
// 					display='flex'
// 					justifyContent='center'
// 					alignItems='center'
// 					minH='200px'
// 					p={4}
// 				>
// 					<Text
// 						fontSize='lg'
// 						color='gray.500'
// 						fontFamily='DM Sans'
// 						textAlign='center'
// 					>
// 						No data found
// 					</Text>
// 				</Box>
// 			)}
// 		</Box>
// 	);
// };
// export default LeadGrid;
import React from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import LeadCard from "../Leads/LeadCard";

const LeadGrid = ({ leads, isLoading, approveChangeHandler }) => {
  if (isLoading) {
    return (
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
          Loading...
        </Text>
      </Box>
    );
  }

  // Define grid columns based on number of leads
  const gridColumns = leads.length === 1
    ? {
        base: "minmax(280px, 350px)", 
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
            <Box
              key={index}
              w="100%"
              maxW="auto" 
              minW="280px"
            >
              <LeadCard {...lead} approveChangeHandler={approveChangeHandler} />
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