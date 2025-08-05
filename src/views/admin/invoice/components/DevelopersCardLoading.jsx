import { Grid, Box, Skeleton, Flex, Checkbox } from "@chakra-ui/react";
import React from "react";

const DevelopersCardLoading = () => {
  return (
    <Grid
      sx={{
        width: "100%",
        gap: 3,
        marginTop: { base: 4, md: 6 },
        justifyItems: "center",
        // >= 0px
        "@media (min-width: 0px)": {
          gridTemplateColumns: "1fr",
        },
        // >= 600px
        "@media (min-width: 600px)": {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        // >= 1040px
        "@media (min-width: 1040px)": {
          gridTemplateColumns: "repeat(3, 1fr)",
        },
        // >= 1564px
        "@media (min-width: 1564px)": {
          gridTemplateColumns: "repeat(4, 1fr)",
        },
        // >= 2120px
        "@media (min-width: 2120px)": {
          gridTemplateColumns: "repeat(5, 1fr)",
        },
        // >= 2560px
        "@media (min-width: 2560px)": {
          gridTemplateColumns: "repeat(6, 1fr)",
        },
        // >= 3840px
        "@media (min-width: 3840px)": {
          gridTemplateColumns: "repeat(7, 1fr)",
        },
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box key={i} minWidth="240px" width="100%">
          <Box
            p={{ base: 3, md: 4 }}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            minHeight={{ base: "220px", md: "260px" }}
            position="relative"
          >
            <Checkbox
              position="absolute"
              top={2}
              left={2}
              isDisabled
            />
            <Skeleton
              height={{ base: "20px", md: "24px" }}
              mb={3}
            />
            <Skeleton
              height="16px"
              mb={2}
              width="80%"
            />
            <Skeleton
              height="16px"
              mb={2}
              width="80%"
            />
            <Skeleton
              height="16px"
              mb={2}
              width="80%"
            />
            <Skeleton
              height="16px"
              mb={3}
              width="80%"
            />
            <Flex justify="flex-end" gap={2}>
              <Skeleton
                height={{ base: "28px", md: "32px" }}
                width={{ base: "28px", md: "32px" }}
                rounded="md"
              />
              <Skeleton
                height={{ base: "28px", md: "32px" }}
                width={{ base: "28px", md: "32px" }}
                rounded="md"
              />
            </Flex>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export default DevelopersCardLoading;