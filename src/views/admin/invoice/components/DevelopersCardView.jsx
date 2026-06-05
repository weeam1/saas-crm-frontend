// import { useState } from "react";
// import {
//   Grid,
//   Box,
//   Text,
//   Flex,
//   IconButton,
//   Link,
//   useColorModeValue,
//   Avatar,
//   Button,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { FaEdit, FaFileInvoice, FaUser } from "react-icons/fa";
// import { format } from "date-fns";
// import { Link as RouterLink } from "react-router-dom";
// import DataNotFound from "components/notFoundData";
// import DevelopersCardLoading from "./DevelopersCardLoading";
// import ContactDetailsModal from "./ContactDetailsModal";
// import { buttonStyle } from "utils/btn";

// const DevelopersCardView = ({
//   data,
//   handleRowClick,
//   setEdit,
//   setSelectedId,
//   setEditData,
//   selectedValues,
//   handleCheckboxChange,
//   isLoading,
//   isInitialLoading,
// }) => {
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const hoverBorder = useColorModeValue("brand.300", "brand.200");
//   const textColor = useColorModeValue("gray.600", "gray.200");
//   const headingColor = useColorModeValue("brand.600", "brand.200");
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [developerName, setDeveloperName] = useState("");
//   const [developerImageUrl, setDeveloperImageUrl] = useState("");

//   const handleContactClick = (contacts, developer_name, imageUrl, e) => {
//     e.stopPropagation();
//     setSelectedContacts(contacts);
//     setDeveloperName(developer_name);
//     setDeveloperImageUrl(imageUrl);
//     onOpen();
//   };

//   if (isLoading || isInitialLoading) {
//     return <DevelopersCardLoading />;
//   }

//   if (data?.length === 0) {
//     return <DataNotFound />;
//   }

//   const capitalizeFirstLetter = (str) => {
//     if (!str) return "N/A";
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   };
//   return (
//     <>
//       <Grid
//         sx={{
//           width: "100%",
//           gap: 3,
//           marginTop: { base: 4, md: 6 },
//           justifyItems: "center",
//           "@media (min-width: 0px)": {
//             gridTemplateColumns: "1fr",
//           },
//           "@media (min-width: 600px)": {
//             gridTemplateColumns: "repeat(2, 1fr)",
//           },
//           "@media (min-width: 1040px)": {
//             gridTemplateColumns: "repeat(3, 1fr)",
//           },
//           "@media (min-width: 1564px)": {
//             gridTemplateColumns: "repeat(4, 1fr)",
//           },
//           "@media (min-width: 2120px)": {
//             gridTemplateColumns: "repeat(5, 1fr)",
//           },
//           "@media (min-width: 2560px)": {
//             gridTemplateColumns: "repeat(6, 1fr)",
//           },
//           "@media (min-width: 3840px)": {
//             gridTemplateColumns: "repeat(7, 1fr)",
//           },
//         }}
//       >
//         {data.map((developer) => (
//           <Box key={developer._id} minWidth="240px" width="100%">
//             <Box
//               p={{ base: 3, md: 5 }}
//               borderWidth="1px"
//               borderRadius="lg"
//               boxShadow="md"
//               bg="white"
//               borderColor={borderColor}
//               position="relative"
//               transition="all 0.2s"
//               _hover={{
//                 borderColor: hoverBorder,
//                 transform: "translateY(-2px)",
//                 boxShadow: "lg",
//               }}
//               minHeight={{ base: "220px", md: "260px" }}
//             >
//               <Box
//                 onClick={() => handleRowClick(developer._id)}
//                 cursor="pointer"
//               >
//                 <Flex align="center" gap={3} mt={1}>
//                   <Avatar
//                     size="sm"
//                     name={developer.developer_name}
//                     src={developer.imageUrl || ""}
//                   />
//                   <Text
//                     fontWeight="bold"
//                     fontSize={{ base: "md", md: "lg" }}
//                     color={headingColor}
//                     isTruncated
//                     maxW="70%"
//                   >
//                     {capitalizeFirstLetter(developer.developer_name) || "N/A"}
//                   </Text>
//                 </Flex>

//                 <Flex direction="column" gap={2} mt={3}>
//                   <Flex align="center">
//                     <Text fontSize="sm" fontWeight="600" minW="70px">
//                       TRN:
//                     </Text>
//                     <Text fontSize="sm" color={textColor} isTruncated>
//                       {developer.trn || "N/A"}
//                     </Text>
//                   </Flex>

//                   <Flex align="center">
//                     <Text fontSize="sm" fontWeight="600" minW="70px">
//                       Email:
//                     </Text>
//                     <Text fontSize="sm" color={textColor} isTruncated>
//                       {developer.email || "N/A"}
//                     </Text>
//                   </Flex>

//                   <Flex align="center">
//                     <Text fontSize="sm" fontWeight="600" minW="70px">
//                       Address:
//                     </Text>
//                     <Text fontSize="sm" color={textColor} isTruncated>
//                       {developer.address || "N/A"}
//                     </Text>
//                   </Flex>

//                   <Flex align="center">
//                     <Text fontSize="sm" fontWeight="600" minW="70px">
//                       Country:
//                     </Text>
//                     <Text fontSize="sm" color={textColor} isTruncated>
//                       {capitalizeFirstLetter(developer.country) || "N/A"}
//                     </Text>
//                   </Flex>
//                   <Flex align="center">
//                     <Text fontSize="sm" fontWeight="600" minW="70px">
//                       Phone Number:
//                     </Text>
//                     <Text fontSize="sm" color={textColor} isTruncated>
//                       {developer.phoneNumber || "N/A"}
//                     </Text>
//                   </Flex>
//                 </Flex>

//                 <Text fontSize="xs" color="gray.500" mt={3} fontStyle="italic">
//                   Created:{" "}
//                   {developer.createdAt
//                     ? format(
//                         new Date(developer.createdAt),
//                         "MMM d, yyyy h:mm a"
//                       )
//                     : "N/A"}
//                 </Text>

//                 <Flex justify="space-between" mt={4}>
//                   <Flex gap={2}>
//                     <Link
//                       as={RouterLink}
//                       to={`/invoice/developers/invoices/${developer._id}`}
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <IconButton
//                         icon={<FaFileInvoice />}
//                         size="sm"
//                         aria-label="View Invoices"
//                         colorScheme="brand"
//                         variant="outline"
//                       />
//                     </Link>
//                     <IconButton
//                       icon={<FaEdit />}
//                       size="sm"
//                       aria-label="Edit Developer"
//                       colorScheme="brand"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setEdit(true);
//                         setSelectedId(developer._id);
//                         setEditData(developer);
//                       }}
//                     />
//                   </Flex>
//                   <Button
//                     size="sm"
//                     leftIcon={<FaUser />}
//                     onClick={(e) =>
//                       handleContactClick(
//                         developer.contactDetails,
//                         developer.developer_name,
//                         developer.imageUrl,
//                         e
//                       )
//                     }
//                     {...buttonStyle}
//                     colorScheme="brand"
//                     _hover={{ bg: "brand.400" }}
//                     _active={{ bg: "brand.400" }}
//                   >
//                     Contacts
//                   </Button>
//                 </Flex>
//               </Box>
//             </Box>
//           </Box>
//         ))}
//       </Grid>
//       <ContactDetailsModal
//         isOpen={isOpen}
//         onClose={onClose}
//         contacts={selectedContacts}
//         developerName={developerName}
//         developerImageUrl={developerImageUrl}
//       />
//     </>
//   );
// };

// export default DevelopersCardView;

import { useState } from 'react';
import {
	Grid,
	Box,
	Text,
	Flex,
	IconButton,
	Link,
	Avatar,
	Button,
	useDisclosure,
	HStack,
	Badge,
	Divider,
} from '@chakra-ui/react';
import {
	FaEdit,
	FaFileInvoice,
	FaUser,
	FaMapMarkerAlt,
	FaEnvelope,
	FaPhone,
	FaIdCard,
} from 'react-icons/fa';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import DataNotFound from 'components/notFoundData';
import DevelopersCardLoading from './DevelopersCardLoading';
import ContactDetailsModal from './ContactDetailsModal';

const DevelopersCardView = ({
	data,
	handleRowClick,
	setEdit,
	setSelectedId,
	setEditData,
	selectedValues,
	handleCheckboxChange,
	isLoading,
	isInitialLoading,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedContacts, setSelectedContacts] = useState([]);
	const [developerName, setDeveloperName] = useState('');
	const [developerImageUrl, setDeveloperImageUrl] = useState('');

	const handleContactClick = (contacts, developer_name, imageUrl, e) => {
		e.stopPropagation();
		setSelectedContacts(contacts);
		setDeveloperName(developer_name);
		setDeveloperImageUrl(imageUrl);
		onOpen();
	};

	if (isLoading || isInitialLoading) {
		return <DevelopersCardLoading />;
	}

	if (data?.length === 0) {
		return <DataNotFound />;
	}

	const capitalizeFirstLetter = (str) => {
		if (!str) return 'N/A';
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	};

	const getInitials = (name) => {
		if (!name) return 'D';
		return name.charAt(0).toUpperCase();
	};

	return (
		<>
			<Grid
				templateColumns={{
					base: '1fr',
					sm: 'repeat(2, 1fr)',
					lg: 'repeat(3, 1fr)',
					xl: 'repeat(4, 1fr)',
					'2xl': 'repeat(5, 1fr)',
				}}
				gap={5}
				p={4}
				mt={{ base: 2 }}
			>
				{data.map((developer) => (
					<Box
						key={developer._id}
						minWidth='260px'
						width='100%'
						cursor='pointer'
						onClick={() => handleRowClick(developer._id)}
					>
						<Box
							p={{ base: 4, md: 5 }}
							borderWidth='1px'
							borderRadius='xl'
							boxShadow='card'
							bg='bg.surface'
							borderColor='border.default'
							position='relative'
							transition='all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
							_hover={{
								borderColor: 'gold.primary',
								transform: 'translateY(-4px)',
								boxShadow: 'goldGlow',
							}}
							minHeight={{ base: 'auto', md: '280px' }}
							overflow='hidden'
						>
							{/* Decorative top bar */}
							<Box
								position='absolute'
								top='0'
								left='0'
								right='0'
								h='3px'
								bgGradient='linear-gradient(90deg, #D4AF37, #F5D67B, #D4AF37)'
							/>

							{/* Header Section */}
							<Flex align='center' gap={3} mb={4}>
								<Avatar
									size='md'
									name={developer.developer_name}
									src={developer.imageUrl || ''}
									border='2px solid'
									borderColor='rgba(212, 175, 55, 0.3)'
								/>
								<Box flex='1'>
									<Text
										fontWeight='bold'
										fontSize={{ base: 'md', lg: 'lg' }}
										color='text.heading'
										noOfLines={1}
									>
										{capitalizeFirstLetter(developer.developer_name) || 'N/A'}
									</Text>
								</Box>
							</Flex>

							<Divider borderColor='border.subtle' my={3} />

							{/* Details Section */}
							<Flex direction='column' gap={2.5}>
								<Flex align='center' gap={2}>
									<FaIdCard size={12} color='var(--chakra-colors-text-muted)' />
									<Text
										fontSize='12px'
										fontWeight='600'
										color='text.muted'
										minW='70px'
									>
										TRN:
									</Text>
									<Text
										fontSize='13px'
										color='text.body'
										fontFamily='mono'
										noOfLines={1}
									>
										{developer.trn || 'N/A'}
									</Text>
								</Flex>

								<Flex align='center' gap={2}>
									<FaEnvelope
										size={12}
										color='var(--chakra-colors-text-muted)'
									/>
									<Text
										fontSize='12px'
										fontWeight='600'
										color='text.muted'
										minW='70px'
									>
										Email:
									</Text>
									<Text fontSize='13px' color='text.accent' noOfLines={1}>
										{developer.email || 'N/A'}
									</Text>
								</Flex>

								<Flex align='center' gap={2}>
									<FaPhone size={12} color='var(--chakra-colors-text-muted)' />
									<Text
										fontSize='12px'
										fontWeight='600'
										color='text.muted'
										minW='70px'
									>
										Phone:
									</Text>
									<Text fontSize='13px' color='text.body' noOfLines={1}>
										{developer.phoneNumber || 'N/A'}
									</Text>
								</Flex>

								<Flex align='center' gap={2}>
									<FaMapMarkerAlt
										size={12}
										color='var(--chakra-colors-text-muted)'
									/>
									<Text
										fontSize='12px'
										fontWeight='600'
										color='text.muted'
										minW='70px'
									>
										Address:
									</Text>
									<Text
										fontSize='13px'
										color='text.body'
										noOfLines={1}
										maxW='200px'
										isTruncated
									>
										{developer.address || 'N/A'}
									</Text>
								</Flex>

								<Flex align='center' gap={2}>
									<Text
										fontSize='12px'
										fontWeight='600'
										color='text.muted'
										minW='70px'
									>
										Country:
									</Text>
									<Text fontSize='13px' color='text.body' noOfLines={1}>
										{capitalizeFirstLetter(developer.country) || 'N/A'}
									</Text>
								</Flex>
							</Flex>

							{/* Created Date */}
							<Text
								fontSize='10px'
								color='text.muted'
								mt={3}
								pt={2}
								borderTop='1px solid'
								borderTopColor='border.subtle'
							>
								Added on{' '}
								{developer.createdAt
									? format(new Date(developer.createdAt), 'MMM d, yyyy')
									: 'N/A'}
							</Text>

							{/* Action Buttons */}
							<Flex justify='space-between' align='center' mt={3}>
								<HStack spacing={2}>
									<Link
										as={RouterLink}
										to={`/invoice/developers/invoices/${developer._id}`}
										onClick={(e) => e.stopPropagation()}
									>
										<IconButton
											icon={<FaFileInvoice />}
											size='sm'
											aria-label='View Invoices'
											variant='ghost'
											color='gold.400'
											_hover={{
												bg: 'rgba(212, 175, 55, 0.1)',
												transform: 'scale(1.05)',
											}}
											transition='all 0.15s'
										/>
									</Link>

									<IconButton
										icon={<FaEdit />}
										size='sm'
										aria-label='Edit Developer'
										variant='ghost'
										color='green.400'
										onClick={(e) => {
											e.stopPropagation();
											setEdit(true);
											setSelectedId(developer._id);
											setEditData(developer);
										}}
										_hover={{
											bg: 'rgba(212, 175, 55, 0.1)',
											transform: 'scale(1.05)',
										}}
										transition='all 0.15s'
									/>
								</HStack>

								<Button
									size='sm'
									leftIcon={<FaUser />}
									onClick={(e) =>
										handleContactClick(
											developer.contactDetails,
											developer.developer_name,
											developer.imageUrl,
											e,
										)
									}
									variant='outline'
									borderRadius='lg'
									borderColor='border.default'
									color='text.body'
									_hover={{
										bg: 'bg.elevated',
										borderColor: 'gold.primary',
										color: 'gold.primary',
										transform: 'translateY(-1px)',
									}}
									_active={{ transform: 'translateY(0)' }}
									transition='all 0.15s'
								>
									Contacts
								</Button>
							</Flex>
						</Box>
					</Box>
				))}
			</Grid>

			<ContactDetailsModal
				isOpen={isOpen}
				onClose={onClose}
				contacts={selectedContacts}
				developerName={developerName}
				developerImageUrl={developerImageUrl}
			/>
		</>
	);
};

export default DevelopersCardView;
