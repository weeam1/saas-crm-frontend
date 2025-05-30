import {
  Box,
  Heading,
  Image,
  Text,
  useBreakpointValue,
  Button,
  Flex,
} from "@chakra-ui/react";
// import DashboardHeader from '../../../../assets/img/dashboard-header.jpeg';
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/img/logo-crm.png";

const Header = () => {
  // Dynamically adjust text alignment based on screen size
  const textAlign = useBreakpointValue({ base: "center", md: "left" });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";
  return (
    // <>
    // 	<Box
    // 		mb={8}
    // 		style={{
    // 			// backgroundImage: `url(${DashboardHeader})`,
    // 			backgroundSize: 'cover',
    // 			backgroundPosition: 'center',
    // 			backgroundColor: 'white',
    // 			backgroundBlendMode: 'overlay',
    // 			display: 'flex',
    // 			width: '100%',
    // 		}}
    // 		mt={'-15px'}
    // 		h={270}
    // 		w={'100%'}
    // 		px={10}
    // 		py={2}
    // 		fontSize={42}
    // 		flexDir={'column'}
    // 		justifyContent='center'
    // 		color={'white'}
    // 		fontWeight={'bold'}
    // 	>
    // 		<img src={logo} alt='CRM' />
    // 		<Heading size='2xl' color='brand.500' fontWeight='semibold'>
    // 			Weeam Real Estate CRM
    // 		</Heading>
    // 		<Text fontSize='md' color='gray.700' fontWeight='normal'>
    // 			Welcome to the future of real state
    // 		</Text>
    // 	</Box>
    // </>
    <>
      {/* Reminder Bar */}
      {!isAdmin && (
        <Box
          w="100%"
          bg="#EDC270"
          py={2}
          px={{ base: 4, md: 8 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          rounded="xl"
          mb={10}
        >
          <Text
            fontWeight="medium"
            fontSize={{ base: "md", md: "lg" }}
            color={"#FFFFFF"}
          >
            🚨 Reminder! You have pending surveys to complete before time runs
            out. Don’t miss your chance!
          </Text>
          <Button
            bg="#FFFFFFC9"
            color="black"
            borderRadius="10px"
            ml={4}
            onClick={() => navigate("/survey")}
            _hover={{ bg: "#fff" }}
            fontWeight="bold"
            size="md"
            px={70}
          >
            Go
          </Button>
        </Box>
      )}
      <Box
        mb={8}
        mt="-15px"
        // h={{ base: 'auto', md: '270px' }}
        w="100%"
        px={{ base: 6, md: 10 }}
        py={6}
        bg="white"
        // bg='linear-gradient(90deg, #EDD199 0%, rgb(221, 184, 92) 100%)'
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundBlendMode="overlay"
        display="flex"
        rounded={"2xl"}
        flexDir="column"
        justifyContent="center"
        alignItems={{ base: "center", md: "flex-start" }}
        textAlign={textAlign} // Apply responsive text alignment
      >
        {/* Logo at the top */}
        <Image
          src={logo}
          alt="CRM"
          boxSize={{ base: "50px", md: "80px" }}
          objectFit="contain"
          mb={2}
        />

        {/* Main Heading */}
        <Heading
          fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
          // color='gray.800'
          color="brand.500"
          fontWeight="semibold"
        >
          Weeam Real Estate CRM
        </Heading>

        {/* Subtext */}
        <Text
          fontSize={{ base: "sm", md: "md" }}
          color="gray.500"
          ml="2"
          fontWeight="normal"
        >
          Welcome to the future of real estate
        </Text>
      </Box>
    </>
  );
};

export default Header;
