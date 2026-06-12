// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Flex,
//   Heading,
//   Text,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   VStack,
//   HStack,
//   Divider,
//   useColorModeValue,
//   Icon,
//   Image,
//   Spinner,
// } from "@chakra-ui/react";
// import { FaBuilding } from "react-icons/fa";
// import DefaultAuth from "layouts/auth/Default";
// import Logo_CRM from "assets/logo-crm.png";
// import { getApi } from "services/api"; // Import getApi
// import { toast } from "react-toastify";
// import axios from "axios";
// import { constant } from "constant";

// function WorkspacePage() {
//   const navigate = useNavigate();
//   const [workspaceUrl, setWorkspaceUrl] = useState("");
//   const [workspaces, setWorkspaces] = useState([]);
//   const [isChecking, setIsChecking] = useState(false);

//   // Define color mode values at the top level of component
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const hoverBgColor = useColorModeValue("gray.50", "gray.700");

//   // Load workspaces from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("workspaces");
//     if (saved) {
//       try {
//         setWorkspaces(JSON.parse(saved));
//       } catch (e) {
//         console.error("Failed to parse workspaces", e);
//       }
//     }
//   }, []);

//   // Function to check if workspace exists
// //   const checkWorkspaceExists = async (workspaceName) => {
// //     try {
// //       setIsChecking(true);
// //       // Call the API to check if workspace exists
// //       const response = await getApi(`api/agencies/workspace/${workspaceName}`, null, "productBaseUrl");

// //       if (response?.status === 200) {
// //         // Workspace exists
// //         return true;
// //       } else {
// //         console.log("Workspace check response:", response);
// //         // Workspace doesn't exist
// //         toast.error(response?.message || "Workspace not found. Please check the URL.");
// //         return false;
// //       }
// //     } catch (error) {
// //       console.error("Error checking workspace:", error);
// //       if (error?.response?.status === 404) {
// //         toast.error("Workspace not found. Please check the URL.");
// //       } else {
// //         toast.error("Failed to verify workspace. Please try again.");
// //       }
// //       return false;
// //     } finally {
// //       setIsChecking(false);
// //     }
// //   };
// const checkWorkspaceExists = async (workspaceName) => {
//   try {
//     setIsChecking(true);
//     // Get token and tenantId from storage
//     const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
//     const tenantId = localStorage.getItem('tenantId') || sessionStorage.getItem('tenantId');

//     // Prepare headers
//     const headers = {};
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
//     if (tenantId) {
//       headers['x-tenant-id'] = tenantId;
//     }

//     // Make axios call directly
//     const response = await axios.get(`${constant.productBaseUrl}api/agencies/workspace/${workspaceName}`, {
//       headers: headers,
//     });

//     console.log("Workspace check response:", response);

//     if (response?.status === 200) {
//       // Workspace exists
//           const agencyName = response?.data?.data?.agencyName ||
//                         response?.data?.agencyName ||
//                         response?.data?.name ||
//                         workspaceName;

//       // Store agency name in localStorage
//       localStorage.setItem("workspaceAgencyName", agencyName);
//       toast.success("Workspace found!");
//       return true;
//     } else {
//       // Workspace doesn't exist
//       toast.error(response?.data?.message || "1 Workspace not found. Please check the URL.");
//       return false;
//     }
//   } catch (error) {
//     console.error("Error checking workspace:", error);
//     if (error?.response?.status === 404) {
//       toast.error(error?.response?.data?.message);
//     } else if (error?.response?.data?.message) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error("Failed to verify workspace. Please try again.");
//     }
//     return false;
//   } finally {
//     setIsChecking(false);
//   }
// };

//   // Save workspace to localStorage (only if doesn't exist)
//   const saveWorkspace = (url) => {
//     const saved = localStorage.getItem("workspaces");
//     let workspacesList = saved ? JSON.parse(saved) : [];

//     // Check if workspace already exists
//     const exists = workspacesList.some(w => w.url === url);

//     if (!exists) {
//       const newWorkspace = {
//         id: Date.now(),
//         url: url,
//         timestamp: Date.now(),
//       };
//       workspacesList.push(newWorkspace);
//       localStorage.setItem("workspaces", JSON.stringify(workspacesList));
//       setWorkspaces(workspacesList);
//     }
//   };

//   const handleContinue = async () => {
//     if (!workspaceUrl.trim()) return;

//     // Extract workspace name from URL
//     let workspaceName = workspaceUrl.trim();
//     workspaceName = workspaceName.replace(/^https?:\/\//, "");
//     workspaceName = workspaceName.split(".")[0];

//     // Check if workspace exists
//     const exists = await checkWorkspaceExists(workspaceName);

//     if (exists) {
//       // Save to workspaces list
//       saveWorkspace(workspaceName);
//          sessionStorage.setItem("cameFromWorkspace", "true");
//       // Store CURRENT workspace in localStorage
//       localStorage.setItem("currentWorkspace", workspaceName);

//       // Navigate to sign-in page
//       navigate("/auth/sign-in");
//     }
//   };

//   const handleSelectWorkspace = async (workspace) => {
//     // Check if workspace exists before proceeding
//     const exists = await checkWorkspaceExists(workspace.url);

//     if (exists) {
//            sessionStorage.setItem("cameFromWorkspace", "true");
//       // Store selected workspace as current
//       localStorage.setItem("currentWorkspace", workspace.url);
//       // Navigate to sign-in page
//       navigate("/auth/sign-in");
//     }
//   };

//   return (
//     <DefaultAuth>
//       <Flex
//         w="100%"
//         maxW="lg"
//         p={8}
//         direction="column"
//         align="center"
//         justify="center"
//         minH="100vh"
//         mx="auto"
//       >
//         <Box w="100%" textAlign="center" mb={8}>
//           <Flex justify="center" mb={4}>
//             <Image src={Logo_CRM} alt="Logo" w="48px" h="48px" />
//           </Flex>
//           <Heading fontSize="2xl" fontWeight="bold" mb={2}>
//             Sign in to your workspace
//           </Heading>
//           <Text fontSize="sm" color="gray.500">
//           Enter your workspace URL to continue. For example: your-workspace
//           </Text>
//         </Box>

//         <VStack w="100%" spacing={4} align="stretch">
//           <InputGroup size="lg">
//             <InputLeftElement>
//               <Icon as={FaBuilding} color="gray.400" />
//             </InputLeftElement>
//             <Input
//               placeholder="your-workspace"
//               value={workspaceUrl}
//               onChange={(e) => setWorkspaceUrl(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleContinue()}
//               _focus={{ borderColor: "brand.500" }}
//               fontSize="md"
//               py={6}
//               isDisabled={isChecking}
//             />
//           </InputGroup>

//           <Button
//             colorScheme="brand"
//             size="lg"
//             w="100%"
//             onClick={handleContinue}
//             isDisabled={!workspaceUrl.trim() || isChecking}
//             fontWeight="bold"
//           >
//             {isChecking ? <Spinner size="sm" mr={2} /> : null}
//             {isChecking ? "Checking..." : "Continue"}
//           </Button>

//           {workspaces.length > 0 && (
//             <>
//               <Text fontSize="sm" color="gray.500" mt={6}>
//                 You're already signed in to...
//               </Text>

//               <Divider my={2} />

//               <VStack spacing={0} align="stretch" divider={<Divider />}>
//                 {workspaces.map((workspace) => (
//                   <HStack
//                     key={workspace.id}
//                     py={4}
//                     px={2}
//                     cursor="pointer"
//                     onClick={() => handleSelectWorkspace(workspace)}
//                     _hover={{ bg: hoverBgColor }}
//                     justify="space-between"
//                   >
//                     <HStack spacing={3}>
//                       <Icon as={FaBuilding} color="brand.500" boxSize="5" />
//                       <Text fontWeight="medium">{workspace.url}</Text>
//                     </HStack>
//                   </HStack>
//                 ))}
//               </VStack>

//             </>
//           )}
//         </VStack>
//       </Flex>
//     </DefaultAuth>
//   );
// }

// export default WorkspacePage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Icon,
  Image,
  Spinner,
  chakra,
  keyframes,
} from "@chakra-ui/react";
import { FaBuilding, FaArrowRight, FaClock, FaTrash } from "react-icons/fa";
import DefaultAuth from "layouts/auth/Default";
import Logo_CRM from "assets/logo-crm.png";
import { toast } from "react-toastify";
import axios from "axios";
import { constant } from "constant";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  navy900: "#0B1C2C",
  navy800: "#10273A",
  black: "#000000",
  goldPri: "#D4AF37",
  goldLight: "#F5D67B",
  goldDark: "#C9A227",
  white: "#FFFFFF",
  gray300: "#B0B0B0",
  gray500: "#808080",
};

const goldGradient =
  "linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)";
const goldGlow = "0 0 20px rgba(212, 175, 55, 0.5)";
const cardShadow = "0px 10px 30px rgba(0,0,0,0.4)";

// ─── Keyframes ────────────────────────────────────────────────────────────────
const pulseGold = keyframes`
  0%,100% { box-shadow: 0 0 0px  rgba(212,175,55,0);    }
  50%      { box-shadow: 0 0 22px rgba(212,175,55,0.55); }
`;

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0);    }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────
const GoldRule = () => (
  <Box
    h="1px"
    w="100%"
    bg="linear-gradient(90deg, transparent, #D4AF37, transparent)"
    opacity={0.35}
    my={1}
  />
);

const CornerMark = ({ right }) => (
  <Box
    position="absolute"
    top="0"
    {...(right ? { right: 0, transform: "scaleX(-1)" } : { left: 0 })}
    opacity={0.15}
    pointerEvents="none"
  >
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path
        d="M4 4 L4 28 M4 4 L28 4"
        stroke="#D4AF37"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="4" r="3" fill="#D4AF37" />
    </svg>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
function WorkspacePage() {
  const navigate = useNavigate();
  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("workspaces");
    if (saved) {
      try {
        setWorkspaces(JSON.parse(saved));
      } catch {}
    }
  }, []);
  const handleDeleteWorkspace = (e, workspaceId) => {
    e.stopPropagation(); // Prevents triggering workspace selection
    const updatedWorkspaces = workspaces.filter((ws) => ws.id !== workspaceId);
    setWorkspaces(updatedWorkspaces);
    localStorage.setItem("workspaces", JSON.stringify(updatedWorkspaces));
    toast.info("Workspace removed");
  };
  const checkWorkspaceExists = async (workspaceName) => {
    try {
      setIsChecking(true);

      const res = await axios.get(
        `${constant.productBaseUrl}api/agencies/workspace/${workspaceName}`,
      );

      if (res?.status === 200) {
        const agencyName =
          res?.data?.data?.agencyName ||
          res?.data?.agencyName ||
          res?.data?.name ||
          workspaceName;
        localStorage.setItem("workspaceAgencyName", agencyName);
        localStorage.setItem("AgencyLogo", res?.data?.data?.agencyLogo);
        const tenantId = res.data.data?.tenantId;
        if (tenantId) localStorage.setItem("tenantId", tenantId);
        toast.success("Workspace found!");
        return true;
      }
      toast.error(res?.data?.message || "Workspace not found.");
      return false;
    } catch (err) {
      console.log(err);
      if (err?.response?.status === 404)
        toast.error(err.response.data?.message);
      else if (err?.response?.data?.message)
        toast.error(err.response.data.message);
      else toast.error("Failed to verify workspace. Please try again.");
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const saveWorkspace = (url) => {
    const saved = localStorage.getItem("workspaces");
    let list = saved ? JSON.parse(saved) : [];
    if (!list.some((w) => w.url === url)) {
      list.push({ id: Date.now(), url, timestamp: Date.now() });
      localStorage.setItem("workspaces", JSON.stringify(list));
      setWorkspaces(list);
    }
  };

  const handleContinue = async () => {
    if (!workspaceUrl.trim()) return;
    let name = workspaceUrl
      .trim()
      .replace(/^https?:\/\//, "")
      .split(".")[0];
    const exists = await checkWorkspaceExists(name);
    if (exists) {
      saveWorkspace(name);
      sessionStorage.setItem("cameFromWorkspace", "true");
      localStorage.setItem("currentWorkspace", name);
      navigate("/auth/sign-in");
    }
  };

  const handleSelectWorkspace = async (workspace) => {
    if (isChecking) return;
    const exists = await checkWorkspaceExists(workspace.url);
    if (exists) {
      sessionStorage.setItem("cameFromWorkspace", "true");
      localStorage.setItem("currentWorkspace", workspace.url);
      navigate("/auth/sign-in");
    }
  };

  return (
    <DefaultAuth>
      <Box
        w="100%"
        maxW="460px"
        bg={C.navy800}
        borderRadius="20px"
        border="1px solid rgba(212,175,55,0.18)"
        boxShadow={cardShadow}
        px={{ base: 6, md: 10 }}
        py={10}
        position="relative"
        overflow="hidden"
        animation={`${fadeUp} 0.5s ease both`}
      >
        {/* Corner ornaments */}
        <CornerMark />
        <CornerMark right />

        {/* Top accent bar */}
        <Box
          position="absolute"
          top={0}
          left="12%"
          right="12%"
          h="2px"
          bg={goldGradient}
          borderRadius="0 0 4px 4px"
        />

        {/* ── Header ── */}
        <VStack spacing={3} mb={8} align="center">
          {/* Logo with gold ring */}
          <Box
            p="3px"
            borderRadius="full"
            bg={goldGradient}
            animation={`${pulseGold} 3.2s ease-in-out infinite`}
          >
            <Flex
              w="52px"
              h="52px"
              bg={C.navy900}
              borderRadius="full"
              align="center"
              justify="center"
            >
              <Image src={Logo_CRM} alt="Logo" w="30px" h="30px" />
            </Flex>
          </Box>

          <Heading
            fontSize={{ base: "21px", md: "25px" }}
            fontWeight="700"
            color={C.white}
            textAlign="center"
            letterSpacing="-0.3px"
            lineHeight="1.3"
          >
            Sign in to your{" "}
            <chakra.span
              bg={goldGradient}
              bgClip="text"
              backgroundSize="200% auto"
              animation={`${shimmer} 4.5s linear infinite`}
            >
              Workspace
            </chakra.span>
          </Heading>

          <Text
            fontSize="13px"
            color={C.gray300}
            textAlign="center"
            lineHeight="1.65"
          >
            Enter your workspace URL to continue.{" "}
            <chakra.span color={C.gray500}>e.g. your-workspace</chakra.span>
          </Text>
        </VStack>

        <GoldRule />

        {/* ── Form ── */}
        <VStack spacing="14px" mt={6}>
          <InputGroup size="lg">
            <InputLeftElement h="52px" pl={1}>
              <Icon
                as={FaBuilding}
                color={focused ? C.goldPri : C.gray500}
                fontSize="15px"
                transition="color 0.2s"
              />
            </InputLeftElement>

            <Input
              placeholder="your-workspace"
              value={workspaceUrl}
              onChange={(e) => setWorkspaceUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleContinue()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              isDisabled={isChecking}
              h="52px"
              fontSize="15px"
              bg={C.navy900}
              border="1px solid"
              borderColor={focused ? C.goldPri : "rgba(176,176,176,0.13)"}
              borderRadius="12px"
              color={C.white}
              _placeholder={{ color: C.gray500 }}
              _hover={{ borderColor: "rgba(212,175,55,0.38)" }}
              _focus={{
                borderColor: C.goldPri,
                boxShadow: "0 0 0 2px rgba(212,175,55,0.15)",
                bg: C.navy900,
              }}
              _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
              transition="all 0.2s"
            />
          </InputGroup>

          {/* Primary CTA */}
          <Button
            w="100%"
            h="52px"
            bg={goldGradient}
            color={C.black}
            fontSize="15px"
            fontWeight="700"
            borderRadius="12px"
            letterSpacing="0.2px"
            onClick={handleContinue}
            isDisabled={!workspaceUrl.trim() || isChecking}
            rightIcon={
              isChecking ? undefined : (
                <Icon as={FaArrowRight} fontSize="13px" />
              )
            }
            _hover={{
              boxShadow: goldGlow,
              transform: "translateY(-1px)",
            }}
            _active={{ transform: "translateY(0)", opacity: 0.92 }}
            _disabled={{
              opacity: 0.3,
              cursor: "not-allowed",
              boxShadow: "none",
              transform: "none",
            }}
            transition="all 0.2s"
          >
            {isChecking ? (
              <HStack spacing={2}>
                <Spinner size="sm" color={C.black} />
                <Text fontWeight="700">Checking…</Text>
              </HStack>
            ) : (
              "Continue"
            )}
          </Button>
        </VStack>

        {/* ── Recent Workspaces ── */}
        {workspaces.length > 0 && (
          <Box mt={8}>
            <GoldRule />

            <HStack spacing={2} mt={5} mb={2}>
              <Icon as={FaClock} color={C.goldDark} fontSize="11px" />
              <Text
                fontSize="11px"
                fontWeight="600"
                color={C.gray300}
                letterSpacing="0.9px"
                textTransform="uppercase"
              >
                Recent Workspaces
              </Text>
            </HStack>

            {/* SCROLLABLE CONTAINER */}
            <Box
              maxH="120px"
              overflowY="auto"
              pr="4px"
              sx={{
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-track": {
                  bg: "rgba(212,175,55,0.05)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  bg: C.goldPri,
                  borderRadius: "4px",
                  opacity: 0.5,
                },
              }}
            >
              <VStack spacing="2px" align="stretch">
                {workspaces.map((ws, idx) => (
                  <HStack
                    key={ws.id}
                    py="11px"
                    px="12px"
                    cursor={isChecking ? "not-allowed" : "pointer"}
                    borderRadius="10px"
                    border="1px solid transparent"
                    justify="space-between"
                    role="group"
                    onClick={() => handleSelectWorkspace(ws)}
                    animation={`${fadeUp} ${0.5 + idx * 0.07}s ease both`}
                    _hover={{
                      bg: "rgba(212,175,55,0.07)",
                      borderColor: "rgba(212,175,55,0.22)",
                    }}
                    transition="all 0.18s"
                  >
                    <HStack spacing={3}>
                      <Flex
                        w="32px"
                        h="32px"
                        borderRadius="8px"
                        bg="rgba(212,175,55,0.08)"
                        border="1px solid rgba(212,175,55,0.18)"
                        align="center"
                        justify="center"
                        _groupHover={{ bg: "rgba(212,175,55,0.16)" }}
                        transition="all 0.18s"
                        flexShrink={0}
                      >
                        <Icon
                          as={FaBuilding}
                          color={C.goldPri}
                          fontSize="12px"
                        />
                      </Flex>

                      <Text
                        fontWeight="500"
                        fontSize="14px"
                        color={C.gray300}
                        _groupHover={{ color: C.white }}
                        transition="color 0.18s"
                      >
                        {ws.url}
                      </Text>
                    </HStack>

                    <HStack spacing={4}>
                      {/* DELETE ICON */}
                      <Icon
                        as={FaTrash}
                        fontSize="15px"
                        color="#e53e3e"
                        opacity={0}
                        _groupHover={{ opacity: 0.7 }}
                        _hover={{ opacity: 1, transform: "scale(1.3)" }}
                        onClick={(e) => handleDeleteWorkspace(e, ws.id)}
                        transition="all 0.18s"
                        cursor="pointer"
                      />

                      {/* ARROW ICON */}
                      <Icon
                        as={FaArrowRight}
                        fontSize="15px"
                        color={C.goldPri}
                        opacity={0}
                        _hover={{ opacity: 1, transform: "scale(1.3)" }}
                        _groupHover={{ opacity: 1 }}
                        transition="opacity 0.18s"
                      />
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>
        )}
        {/* Bottom accent line */}
        <Box
          position="absolute"
          bottom={0}
          left="28%"
          right="28%"
          h="1px"
          bg={goldGradient}
          opacity={0.28}
        />
      </Box>
    </DefaultAuth>
  );
}

export default WorkspacePage;
