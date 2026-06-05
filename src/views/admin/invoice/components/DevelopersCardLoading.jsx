// import { Grid, Box, Skeleton, Flex, Checkbox } from "@chakra-ui/react";
// import React from "react";

// const DevelopersCardLoading = () => {
//   return (
//     <Grid
//       sx={{
//         width: "100%",
//         gap: 3,
//         marginTop: { base: 4, md: 6 },
//         justifyItems: "center",
//         // >= 0px
//         "@media (min-width: 0px)": {
//           gridTemplateColumns: "1fr",
//         },
//         // >= 600px
//         "@media (min-width: 600px)": {
//           gridTemplateColumns: "repeat(2, 1fr)",
//         },
//         // >= 1040px
//         "@media (min-width: 1040px)": {
//           gridTemplateColumns: "repeat(3, 1fr)",
//         },
//         // >= 1564px
//         "@media (min-width: 1564px)": {
//           gridTemplateColumns: "repeat(4, 1fr)",
//         },
//         // >= 2120px
//         "@media (min-width: 2120px)": {
//           gridTemplateColumns: "repeat(5, 1fr)",
//         },
//         // >= 2560px
//         "@media (min-width: 2560px)": {
//           gridTemplateColumns: "repeat(6, 1fr)",
//         },
//         // >= 3840px
//         "@media (min-width: 3840px)": {
//           gridTemplateColumns: "repeat(7, 1fr)",
//         },
//       }}
//     >
//       {[...Array(6)].map((_, i) => (
//         <Box key={i} minWidth="240px" width="100%">
//           <Box
//             p={{ base: 3, md: 4 }}
//             borderWidth="1px"
//             borderRadius="md"
//             boxShadow="sm"
//             minHeight={{ base: "220px", md: "260px" }}
//             position="relative"
//           >
//             <Checkbox
//               position="absolute"
//               top={2}
//               left={2}
//               isDisabled
//             />
//             <Skeleton
//               height={{ base: "20px", md: "24px" }}
//               mb={3}
//             />
//             <Skeleton
//               height="16px"
//               mb={2}
//               width="80%"
//             />
//             <Skeleton
//               height="16px"
//               mb={2}
//               width="80%"
//             />
//             <Skeleton
//               height="16px"
//               mb={2}
//               width="80%"
//             />
//             <Skeleton
//               height="16px"
//               mb={3}
//               width="80%"
//             />
//             <Flex justify="flex-end" gap={2}>
//               <Skeleton
//                 height={{ base: "28px", md: "32px" }}
//                 width={{ base: "28px", md: "32px" }}
//                 rounded="md"
//               />
//               <Skeleton
//                 height={{ base: "28px", md: "32px" }}
//                 width={{ base: "28px", md: "32px" }}
//                 rounded="md"
//               />
//             </Flex>
//           </Box>
//         </Box>
//       ))}
//     </Grid>
//   );
// };

// export default DevelopersCardLoading;

import { Grid, Box, Skeleton, VStack, Flex } from '@chakra-ui/react';

const DevelopersCardLoading = () => {
	return (
		<Grid
			templateColumns={{
				base: '1fr',
				sm: 'repeat(2, 1fr)',
				lg: 'repeat(3, 1fr)',
				xl: 'repeat(4, 1fr)',
				'2xl': 'repeat(5, 1fr)',
			}}
			gap={5}
			mt={{ base: 4, md: 6 }}
		>
			{[...Array(10)].map((_, i) => (
				<Box key={i} width='100%'>
					<Box
						p={{ base: 4, md: 5 }}
						borderWidth='1px'
						borderRadius='xl'
						borderColor='border.default'
						bg='bg.surface'
						minHeight={{ base: 'auto', md: '280px' }}
						position='relative'
						overflow='hidden'
					>
						{/* Full card skeleton */}
						<Skeleton
							position='absolute'
							top={0}
							left={0}
							right={0}
							bottom={0}
							startColor='rgba(212, 175, 55, 0.1)'
							endColor='rgba(26, 53, 80, 0.3)'
							borderRadius='xl'
						/>

						{/* Content placeholder (invisible but maintains layout) */}
						<VStack align='stretch' spacing={4} opacity={0}>
							<Flex align='center' gap={3}>
								<Box boxSize='48px' borderRadius='full' bg='transparent' />
								<Box flex='1' h='24px' bg='transparent' />
							</Flex>
							<Box h='1px' bg='transparent' />
							<Flex gap={2}>
								<Box w='70px' h='16px' bg='transparent' />
								<Box flex='1' h='16px' bg='transparent' />
							</Flex>
							<Flex gap={2}>
								<Box w='70px' h='16px' bg='transparent' />
								<Box flex='1' h='16px' bg='transparent' />
							</Flex>
							<Flex gap={2}>
								<Box w='70px' h='16px' bg='transparent' />
								<Box flex='1' h='16px' bg='transparent' />
							</Flex>
						</VStack>
					</Box>
				</Box>
			))}
		</Grid>
	);
};

export default DevelopersCardLoading;
