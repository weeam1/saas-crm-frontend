import React from "react";
import {
  Box,
  Heading,
  Input,
  Icon,
  Grid,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";

const Employees = () => {
  const employees = [
    {
      name: "Employee 1",
      role: "Manager",
      salary: "AED 3000 /month",
      image: "/user1.jpg",
    },
    {
      name: "Employee 2",
      role: "Agent",
      salary: "AED 3000 /month",
      image: "/user2.jpg",
    },
    {
      name: "Employee 3",
      role: "Manager",
      salary: "AED 3000 /month",
      image: "/user1.jpg",
    },
    {
      name: "Employee 4",
      role: "Manager",
      salary: "AED 3000 /month",
      image: "/user1.jpg",
    },
    {
      name: "Employee 5",
      role: "Manager",
      salary: "AED 3000 /month",
      image: "/user1.jpg",
    },
    {
      name: "Employee 6",
      role: "Manager",
      salary: "AED 3000 /month",
      image: "/user1.jpg",
    },
  ];

  return (
    <Box minH="100vh">
      <Box
        px={{ base: 4, md: 6, lg: 12 }}
        py={4}
        display="flex"
        bg="white"
        borderRadius="md"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Heading fontSize="24px" fontWeight="600" fontFamily="Poppins">
          Employees
        </Heading>

        <Box display="flex" alignItems="center">
          <Box h="30px" w="1px" bg="#E3E3E3" mr={3} />

          <Box
            display="flex"
            alignItems="center"
            bg="#F6F6F6"
            w={{ base: "100%", sm: "287px" }}
            h="36px"
            px={3}
            borderRadius="md"
            border="1px solid #E2E8F0"
          >
            <Icon as={CiSearch} color="gray.500" mr={2} />
            <Input
              variant="unstyled"
              placeholder="Quick Search..."
              w="100%"
              fontSize="14px"
              fontWeight="400"
              color="gray.700"
            />
          </Box>
        </Box>
      </Box>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(auto-fill, minmax(360px, 1fr))",
        }}
        gap={4}
        // px={{ base: 4, md: 6, lg: 12 }}
      >
        {employees.map((emp, index) => (
          <Box
            key={index}
            p={4}
            borderRadius="lg"
            bg="white"
            border="1px solid #e2e8f0"
            h="202px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar src={emp.image} size="md" mr={3} />
              <Box>
                <Text fontWeight="medium" fontFamily="Poppins" fontSize="24px">
                  {emp.name}
                </Text>
                <Text
                  color="#C4C4C4"
                  fontWeight="medium"
                  fontFamily="Poppins"
                  fontSize="18px"
                >
                  {emp.role}
                </Text>
                <Text fontWeight="medium" fontFamily="Poppins" fontSize="16px">
                  {emp.salary}
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Employees;
