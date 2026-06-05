// // integrations/LeadsIntegration.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Heading,
//   Text,
//   Button,
//   SimpleGrid,
//   Tabs,
//   TabList,
//   Tab,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Code,
//   Badge,
//   Flex,
//   Icon,
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
//   HStack,
//   VStack,
//   Accordion,
//   AccordionItem,
//   AccordionButton,
//   AccordionPanel,
//   AccordionIcon,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Tooltip,
// } from '@chakra-ui/react';
// import { FaArrowLeft, FaPlug, FaCopy } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { ALL_FIELDS, PAYLOAD_EXAMPLE } from 'data/fieldsData';
// import { toast } from 'react-toastify';

// const LeadsIntegration = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [tenantId, setTenantId] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Get tenant ID from localStorage
//     const storedTenantId = localStorage.getItem('tenantId') || localStorage.getItem('tenant_id') || 'TENANT_ID_HERE';
//     setTenantId(storedTenantId);
//   }, []);

//   const getFilteredFields = () => {
//     if (activeTab === 0) return ALL_FIELDS;
//     if (activeTab === 1) return ALL_FIELDS.filter(f => f.required);
//     if (activeTab === 2) return ALL_FIELDS.filter(f => f.category === 'contact');
//     if (activeTab === 3) return ALL_FIELDS.filter(f => f.category === 'utm');
//     return ALL_FIELDS.filter(f => f.category === 'technical');
//   };

//   const copyToClipboard = (text, message) => {
//     navigator.clipboard.writeText(text);
//     toast.success(message || 'Copied to clipboard', {
//       position: 'top-right',
//       autoClose: 2000,
//     });
//   };

//   const copyPayload = () => {
//     copyToClipboard(JSON.stringify(PAYLOAD_EXAMPLE, null, 2), 'Payload copied to clipboard');
//   };

//   const copyApiUrl = () => {
//     const apiUrl = `${baseUrl}api/campaign/lead`;
//     copyToClipboard(apiUrl, 'API URL copied to clipboard');
//   };

//   const copyTenantId = () => {
//     copyToClipboard(tenantId, 'Tenant ID copied to clipboard');
//   };

//   const copyCurlCommand = () => {
//     const curlCommand = `curl -X POST ${baseUrl}api/campaign/lead \\
//   -H "X-Tenant-ID: ${tenantId}" \\
//   -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
//   -H "Content-Type: application/json" \\
//   -d '${JSON.stringify(PAYLOAD_EXAMPLE, null, 2).replace(/'/g, "'\\''")}'`;
//     copyToClipboard(curlCommand, 'cURL command copied to clipboard');
//   };

//   const tabLabels = ['All Fields', 'Required', 'Contact Info', 'UTM Tracking', 'Technical'];
//   const formattedPayload = JSON.stringify(PAYLOAD_EXAMPLE, null, 2);

//   // Get base URL from env or use default
//   const baseUrl = process.env.REACT_APP_API_URL || 'https://api.yourcrm.com';

//   // FAQ Data
//   const faqs = [

//     {
//       question: 'What happens if I don\'t send the Tenant ID in headers?',
//       answer: 'The API will reject your request with a 401 Unauthorized error. Tenant ID is required to identify which organization the leads belong to.'
//     },
//     {
//       question: 'Can I test the API without sending real leads?',
//       answer: 'Yes, you can use our staging environment with test API keys. Contact support to get access to our sandbox environment.'
//     },
//     {
//       question: 'How are duplicate leads handled?',
//       answer: 'Duplicate leads are identified by email address and phone number. If a duplicate is found, the existing lead will be updated with new information rather than creating a duplicate.'
//     },
//     {
//       question: 'What is the rate limit for the API?',
//       answer: 'The API has a rate limit of 100 requests per minute per tenant. If you exceed this limit, you will receive a 429 Too Many Requests response.'
//     },
//     {
//       question: 'How long does it take for leads to appear in the CRM?',
//       answer: 'Leads appear in real-time. Once the API returns a success response, the lead is immediately available in your CRM dashboard.'
//     }
//   ];

//   return (
//     <Box bg="gray.50" minH="100vh">
//       {/* Header with Back Button */}
//       {/* <Box bg="white" borderBottom="1px" borderColor="gray.100" position="sticky" top={0} zIndex={10} shadow="sm"> */}
//         <Container maxW="container.xl" py={4}>
//           <Flex align="center">
//             <Button
//               variant="ghost"
//               leftIcon={<FaArrowLeft />}
//               onClick={() => navigate('/admin-setting/integrations')}
//               size="sm"
//             >
//               Back
//             </Button>
//           </Flex>
//         </Container>
//       {/* </Box> */}

//       {/* Hero Section */}
//       <Box bgGradient="linear(to-br, blue.50, white, purple.50)">
//         <Container maxW="container.md" py={12} textAlign="center">
//           <Box
//             w={16}
//             h={16}
//             bg="white"
//             borderRadius="2xl"
//             shadow="lg"
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             mx="auto"
//             mb={5}
//           >
//             <Icon as={FaPlug} boxSize={8} color="blue.600" />
//           </Box>
//           <Heading size="xl" mb={3}>
//             Leads Campaign Integration Guide
//           </Heading>
//           <Text color="gray.600" maxW="2xl" mx="auto">
//             Learn how to send lead data to our CRM. Map your form fields to our API structure.
//           </Text>
//         </Container>
//       </Box>

//       <Container maxW="container.xl" py={10}>
//         {/* API Endpoint - Full Width */}
//         <Box mb={6}>
//           <Heading size="md" mb={4}>API Endpoint</Heading>
//           <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden">
//             <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} p={4} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
//               <Text fontWeight="semibold" mb={{ base: 2, md: 0 }}>POST Request</Text>
//               <Button size="xs" variant="outline" leftIcon={<FaCopy />} onClick={copyApiUrl}>
//                 Copy URL
//               </Button>
//             </Flex>
//             <Box p={4} bg="gray.900">
//               <pre style={{
//                 margin: 0,
//                 padding: 0,
//                 fontFamily: 'monospace',
//                 fontSize: '14px',
//                 color: '#e2e8f0',
//                 overflowX: 'auto',
//                 whiteSpace: 'pre-wrap',
//                 wordBreak: 'break-all'
//               }}>
//                 {baseUrl}api/campaign/lead
//               </pre>
//             </Box>
//           </Box>
//           <Text fontSize="sm" color="gray.500" mt={2}>Send a POST request with JSON body containing your lead data. All fields are optional except name is recommended.</Text>
//         </Box>

//         {/* Headers Section - Tenant ID */}
//         <Box mb={10}>
//           <Heading size="md" mb={4}>Required Headers</Heading>
//           <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden">
//             <Box p={4} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
//               <Text fontWeight="semibold">Authentication Headers</Text>
//             </Box>
//             <Box overflowX="auto">
//               <Table variant="simple" size="sm">
//                 <Thead bg="gray.50">
//                   <Tr>
//                     <Th>Header Name</Th>
//                     <Th>Value</Th>
//                     <Th>Required</Th>
//                     <Th>Description</Th>
//                   </Tr>
//                 </Thead>
//                 <Tbody>
//                   <Tr>
//                     <Td fontFamily="monospace" fontSize="sm">X-Tenant-ID</Td>
//                     <Td>
//                       <InputGroup size="sm" maxW="300px">
//                         <Input
//                           value={tenantId}
//                           isReadOnly
//                           fontFamily="monospace"
//                           fontSize="sm"
//                           bg="gray.50"
//                         />
//                         <InputRightElement>
//                           <Tooltip label="Copy Tenant ID">
//                             <Button size="xs" variant="ghost" onClick={copyTenantId}>
//                               <FaCopy />
//                             </Button>
//                           </Tooltip>
//                         </InputRightElement>
//                       </InputGroup>
//                     </Td>
//                     <Td><Badge colorScheme="red">Required</Badge></Td>
//                     <Td fontSize="sm" color="gray.600">Your organization's unique identifier</Td>
//                   </Tr>

//                 </Tbody>
//               </Table>
//             </Box>
//           </Box>
//         </Box>

//         {/* Tabs */}
//         <Box mb={8}>
//           <Tabs variant="soft-rounded" colorScheme="blue" onChange={setActiveTab}>
//             <TabList flexWrap="wrap" gap={2}>
//               {tabLabels.map(label => (
//                 <Tab key={label} _selected={{ bg: 'blue.600', color: 'white' }}>
//                   {label}
//                 </Tab>
//               ))}
//             </TabList>
//           </Tabs>
//         </Box>

//         {/* Field Cards Grid */}
//         <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={12}>
//           {getFilteredFields().map((field, idx) => (
//             <Box
//               key={idx}
//               bg="white"
//               borderRadius="xl"
//               border="1px solid"
//               borderColor={'gray.200'}
//               bgColor={'white'}
//               p={4}
//               transition="all 0.2s"
//               _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
//             >
//               <Flex justify="space-between" align="start" mb={2}>
//                 <Box>
//                   <Code fontSize="sm" fontWeight="bold" color="gray.800">
//                     {field.name}
//                     {field.required && <Text as="span" color="red.500" ml={1}>*</Text>}
//                   </Code>
//                   {/* <Text fontSize="xs" color="gray.500" mt={0.5}>→ {field.field}</Text> */}
//                 </Box>
//                 <Badge colorScheme="gray" fontSize="xs" px={2} py={1} borderRadius="full">
//                   {field.type}
//                 </Badge>
//               </Flex>
//               <Text fontSize="xs" color="gray.600" mt={2}>{field.description}</Text>
//               <Box mt={2} pt={2} borderTop="1px solid" borderColor="gray.100">
//                 <Text fontSize="xs" color="gray.400">Example:</Text>
//                 <Code fontSize="xs" color="gray.700" display="block" mt={1}>"{field.example}"</Code>
//               </Box>
//             </Box>
//           ))}
//         </SimpleGrid>

//         {/* Example Payload */}
//         <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden" mb={10}>
//           <Flex bg="gray.800" px={6} py={4} justify="space-between" align="center">
//             <HStack>
//               <Icon as={FaPlug} color="white" />
//               <Text color="white" fontWeight="semibold">Example Request Payload</Text>
//             </HStack>
//             <Button size="sm" variant="ghost" color="gray.400" _hover={{ color: 'white' }} onClick={copyPayload}>
//               Copy
//             </Button>
//           </Flex>
//           <Box p={6} bg="gray.900">
//             <pre style={{
//               margin: 0,
//               padding: 0,
//               fontFamily: 'monospace',
//               fontSize: '13px',
//               color: '#e2e8f0',
//               overflowX: 'auto',
//               whiteSpace: 'pre-wrap',
//               wordBreak: 'break-word'
//             }}>
//               {formattedPayload}
//             </pre>
//           </Box>
//         </Box>

//         <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden" mb={10}>
//           <Box bg="gray.50" px={6} py={4} borderBottom="1px solid" borderColor="gray.200">
//             <Heading size="sm">Complete Field Reference</Heading>
//           </Box>
//           <Box overflowX="auto">
//             <Table variant="simple" size="sm">
//               <Thead bg="gray.50">
//                 <Tr>
//                   <Th>Field Name</Th>
//                   <Th>Type</Th>
//                   <Th>Required</Th>
//                   <Th>Description</Th>
//                   <Th>Example</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {ALL_FIELDS.map((field, idx) => (
//                   <Tr key={idx} _hover={{ bg: 'gray.50' }}>
//                     <Td fontFamily="monospace" fontSize="sm">{field.name}</Td>
//                     <Td><Badge colorScheme="gray">{field.type}</Badge></Td>
//                     <Td>
//                       {field.required
//                         ? <Badge colorScheme="red">Required</Badge>
//                         : <Text color="gray.400" fontSize="xs">Optional</Text>
//                       }
//                     </Td>
//                     <Td fontSize="sm" color="gray.600">{field.description}</Td>
//                     <Td><Code fontSize="xs">{field.example}</Code></Td>
//                   </Tr>
//                 ))}
//               </Tbody>
//             </Table>
//           </Box>
//         </Box>

//         {/* Tips Section */}
//         <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
//           <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" p={5}>
//             <Flex align="center" mb={3}>
//               <Box w={8} h={8} bg="green.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mr={3}>
//                 <Icon as={FaPlug} boxSize={4} color="green.600" />
//               </Box>
//               <Heading size="sm">Best Practices</Heading>
//             </Flex>
//             <VStack align="start" spacing={2}>
//               <HStack><Text color="green.500">✓</Text><Text fontSize="sm">Always include at least the lead's name for identification</Text></HStack>
//               <HStack><Text color="green.500">✓</Text><Text fontSize="sm">Use UTM parameters to track campaign performance</Text></HStack>
//               <HStack><Text color="green.500">✓</Text><Text fontSize="sm">Include both phone and WhatsApp numbers when available</Text></HStack>
//               <HStack><Text color="green.500">✓</Text><Text fontSize="sm">Send UTC timestamps for createdDate field</Text></HStack>
//             </VStack>
//           </Box>

//           <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" p={5}>
//             <Flex align="center" mb={3}>
//               <Box w={8} h={8} bg="yellow.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mr={3}>
//                 <Icon as={FaPlug} boxSize={4} color="yellow.600" />
//               </Box>
//               <Heading size="sm">Common Mistakes</Heading>
//             </Flex>
//             <VStack align="start" spacing={2}>
//               <HStack><Text color="red.500">✗</Text><Text fontSize="sm">Sending incorrect field name format</Text></HStack>
//               <HStack><Text color="red.500">✗</Text><Text fontSize="sm">Missing required name field in request</Text></HStack>
//               <HStack><Text color="red.500">✗</Text><Text fontSize="sm">Not URL-encoding special characters</Text></HStack>
//               <HStack><Text color="red.500">✗</Text><Text fontSize="sm">Using wrong content-type header</Text></HStack>
//             </VStack>
//           </Box>
//         </SimpleGrid>

//         {/* FAQ Section */}
//         <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden">
//           <Box bg="gray.50" px={6} py={4} borderBottom="1px solid" borderColor="gray.200">
//             <Heading size="sm">Frequently Asked Questions</Heading>
//           </Box>
//           <Accordion allowMultiple>
//             {faqs.map((faq, index) => (
//               <AccordionItem key={index}>
//                 <AccordionButton py={4} _hover={{ bg: 'gray.50' }}>
//                   <Box flex="1" textAlign="left" fontWeight="medium">
//                     {faq.question}
//                   </Box>
//                   <AccordionIcon />
//                 </AccordionButton>
//                 <AccordionPanel pb={4} color="gray.600">
//                   {faq.answer}
//                 </AccordionPanel>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default LeadsIntegration;

// integrations/LeadsIntegration.jsx
import React, { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Heading,
	Text,
	Button,
	SimpleGrid,
	Tabs,
	TabList,
	Tab,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Code,
	Badge,
	Flex,
	Icon,
	HStack,
	VStack,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Input,
	InputGroup,
	InputRightElement,
	Tooltip,
} from '@chakra-ui/react';
import { FaArrowLeft, FaPlug, FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ALL_FIELDS, PAYLOAD_EXAMPLE } from 'data/fieldsData';
import { toast } from 'react-toastify';

const LeadsIntegration = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [tenantId, setTenantId] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const storedTenantId =
			localStorage.getItem('tenantId') ||
			localStorage.getItem('tenant_id') ||
			'TENANT_ID_HERE';
		setTenantId(storedTenantId);
	}, []);

	const getFilteredFields = () => {
		if (activeTab === 0) return ALL_FIELDS;
		if (activeTab === 1) return ALL_FIELDS.filter((f) => f.required);
		if (activeTab === 2)
			return ALL_FIELDS.filter((f) => f.category === 'contact');
		if (activeTab === 3) return ALL_FIELDS.filter((f) => f.category === 'utm');
		return ALL_FIELDS.filter((f) => f.category === 'technical');
	};

	const copyToClipboard = (text, message) => {
		navigator.clipboard.writeText(text);
		toast.success(message || 'Copied to clipboard', {
			position: 'top-right',
			autoClose: 2000,
		});
	};

	const copyPayload = () => {
		copyToClipboard(
			JSON.stringify(PAYLOAD_EXAMPLE, null, 2),
			'Payload copied to clipboard',
		);
	};

	const copyApiUrl = () => {
		const apiUrl = `${baseUrl}api/campaign/lead`;
		copyToClipboard(apiUrl, 'API URL copied to clipboard');
	};

	const copyTenantId = () => {
		copyToClipboard(tenantId, 'Tenant ID copied to clipboard');
	};

	const copyCurlCommand = () => {
		const curlCommand = `curl -X POST ${baseUrl}api/campaign/lead \\
  -H "X-Tenant-ID: ${tenantId}" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(PAYLOAD_EXAMPLE, null, 2).replace(/'/g, "'\\''")}'`;
		copyToClipboard(curlCommand, 'cURL command copied to clipboard');
	};

	const tabLabels = [
		'All Fields',
		'Required',
		'Contact Info',
		'UTM Tracking',
		'Technical',
	];
	const formattedPayload = JSON.stringify(PAYLOAD_EXAMPLE, null, 2);
	const baseUrl = process.env.REACT_APP_API_URL || 'https://api.yourcrm.com';

	const faqs = [
		{
			question: "What happens if I don't send the Tenant ID in headers?",
			answer:
				'The API will reject your request with a 401 Unauthorized error. Tenant ID is required to identify which organization the leads belong to.',
		},
		{
			question: 'Can I test the API without sending real leads?',
			answer:
				'Yes, you can use our staging environment with test API keys. Contact support to get access to our sandbox environment.',
		},
		{
			question: 'How are duplicate leads handled?',
			answer:
				'Duplicate leads are identified by email address and phone number. If a duplicate is found, the existing lead will be updated with new information rather than creating a duplicate.',
		},
		{
			question: 'What is the rate limit for the API?',
			answer:
				'The API has a rate limit of 100 requests per minute per tenant. If you exceed this limit, you will receive a 429 Too Many Requests response.',
		},
		{
			question: 'How long does it take for leads to appear in the CRM?',
			answer:
				'Leads appear in real-time. Once the API returns a success response, the lead is immediately available in your CRM dashboard.',
		},
	];

	return (
		<Box bg='bg.app' minH='100vh'>
			{/* Header with Back Button */}
			<Container maxW='container.xl' py={4}>
				<Flex align='center'>
					<Button
						variant='ghost'
						leftIcon={<FaArrowLeft />}
						onClick={() => navigate('/admin-setting/integrations')}
						size='sm'
						color='text.body'
						_hover={{ bg: 'bg.elevated', color: 'gold.primary' }}
					>
						Back
					</Button>
				</Flex>
			</Container>

			{/* Hero Section */}
			<Box
				bgGradient='linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(11, 28, 44, 0) 100%)'
				borderBottom='1px solid'
				borderBottomColor='border.default'
			>
				<Container maxW='container.md' py={12} textAlign='center'>
					<Box
						w={16}
						h={16}
						bg='bg.surface'
						borderRadius='xl'
						boxShadow='card'
						display='flex'
						alignItems='center'
						justifyContent='center'
						mx='auto'
						mb={5}
						border='1px solid'
						borderColor='border.default'
					>
						<Icon as={FaPlug} boxSize={8} color='gold.primary' />
					</Box>
					<Heading size='xl' mb={3} color='text.heading'>
						Leads Campaign Integration Guide
					</Heading>
					<Text color='text.muted' maxW='2xl' mx='auto'>
						Learn how to send lead data to our CRM. Map your form fields to our
						API structure.
					</Text>
				</Container>
			</Box>

			<Container maxW='container.xl' py={10}>
				{/* API Endpoint */}
				<Box mb={6}>
					<Heading size='md' mb={4} color='text.heading'>
						API Endpoint
					</Heading>
					<Box
						bg='bg.surface'
						borderRadius='xl'
						border='1px solid'
						borderColor='border.default'
						overflow='hidden'
					>
						<Flex
							direction={{ base: 'column', md: 'row' }}
							justify='space-between'
							align={{ base: 'stretch', md: 'center' }}
							p={4}
							bg='bg.elevated'
							borderBottom='1px solid'
							borderColor='border.default'
						>
							<Text
								fontWeight='semibold'
								color='text.body'
								mb={{ base: 2, md: 0 }}
							>
								POST Request
							</Text>
							<Button
								size='xs'
								variant='outline'
								leftIcon={<FaCopy />}
								onClick={copyApiUrl}
								borderColor='border.default'
								_hover={{ borderColor: 'gold.primary', color: 'gold.primary' }}
							>
								Copy URL
							</Button>
						</Flex>
						<Box p={4} bg='navy.900'>
							<pre
								style={{
									margin: 0,
									padding: 0,
									fontFamily: 'monospace',
									fontSize: '14px',
									color: '#e2e8f0',
									overflowX: 'auto',
									whiteSpace: 'pre-wrap',
									wordBreak: 'break-all',
								}}
							>
								{baseUrl}api/campaign/lead
							</pre>
						</Box>
					</Box>
					<Text fontSize='sm' color='text.muted' mt={2}>
						Send a POST request with JSON body containing your lead data. All
						fields are optional except name is recommended.
					</Text>
				</Box>

				{/* Headers Section - Tenant ID */}
				<Box mb={10}>
					<Heading size='md' mb={4} color='text.heading'>
						Required Headers
					</Heading>
					<Box
						bg='bg.surface'
						borderRadius='xl'
						border='1px solid'
						borderColor='border.default'
						overflow='hidden'
					>
						<Box
							p={4}
							bg='bg.elevated'
							borderBottom='1px solid'
							borderColor='border.default'
						>
							<Text fontWeight='semibold' color='text.body'>
								Authentication Headers
							</Text>
						</Box>
						<Box overflowX='auto'>
							<Table variant='simple' size='sm'>
								<Thead bg='bg.elevated'>
									<Tr>
										<Th color='gold.primary' fontSize='xs'>
											Header Name
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Value
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Required
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Description
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr _hover={{ bg: 'bg.elevated' }}>
										<Td fontFamily='monospace' fontSize='sm' color='text.body'>
											X-Tenant-ID
										</Td>
										<Td>
											<InputGroup size='sm' maxW='300px'>
												<Input
													value={tenantId}
													isReadOnly
													fontFamily='monospace'
													fontSize='sm'
													bg='bg.input'
													borderColor='border.default'
													color='text.body'
												/>
												<InputRightElement>
													<Tooltip
														label='Copy Tenant ID'
														placement='top'
														hasArrow
													>
														<Button
															size='xs'
															variant='ghost'
															onClick={copyTenantId}
															_hover={{ color: 'gold.primary' }}
														>
															<FaCopy />
														</Button>
													</Tooltip>
												</InputRightElement>
											</InputGroup>
										</Td>
										<Td>
											<Badge variant='gold' fontSize='10px'>
												Required
											</Badge>
										</Td>
										<Td fontSize='sm' color='text.muted'>
											Your organization's unique identifier
										</Td>
									</Tr>
								</Tbody>
							</Table>
						</Box>
					</Box>
				</Box>

				{/* Tabs */}
				<Box mb={8}>
					<Tabs variant='soft-rounded' onChange={setActiveTab}>
						<TabList flexWrap='wrap' gap={2} borderBottom='none'>
							{tabLabels.map((label) => (
								<Tab
									key={label}
									_selected={{ bg: 'brand.300', color: 'brand.800' }}
									_hover={{ color: 'gold.primary' }}
									borderRadius='full'
								>
									{label}
								</Tab>
							))}
						</TabList>
					</Tabs>
				</Box>

				{/* Field Cards Grid */}
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={12}>
					{getFilteredFields().map((field, idx) => (
						<Box
							key={idx}
							bg='bg.surface'
							borderRadius='lg'
							border='1px solid'
							borderColor='border.default'
							p={4}
							transition='all 0.2s'
							_hover={{
								transform: 'translateY(-2px)',
								borderColor: 'gold.primary',
								boxShadow: 'goldGlow',
							}}
						>
							<Flex justify='space-between' align='start' mb={2}>
								<Box>
									<Code
										fontSize='sm'
										fontWeight='bold'
										bg='bg.elevated'
										color='gold.primary'
										p={1}
										borderRadius='md'
									>
										{field.name}
										{field.required && (
											<Text as='span' color='red.400' ml={1}>
												*
											</Text>
										)}
									</Code>
								</Box>
								<Badge
									variant='subtle'
									fontSize='xs'
									px={2}
									py={1}
									borderRadius='full'
								>
									{field.type}
								</Badge>
							</Flex>
							<Text fontSize='xs' color='text.muted' mt={2}>
								{field.description}
							</Text>
							<Box
								mt={2}
								pt={2}
								borderTop='1px solid'
								borderColor='border.subtle'
							>
								<Text fontSize='xs' color='text.muted'>
									Example:
								</Text>
								<Code
									fontSize='xs'
									bg='bg.elevated'
									color='text.body'
									display='block'
									mt={1}
								>
									"{field.example}"
								</Code>
							</Box>
						</Box>
					))}
				</SimpleGrid>

				{/* Example Payload */}
				<Box
					bg='bg.surface'
					borderRadius='xl'
					border='1px solid'
					borderColor='border.default'
					overflow='hidden'
					mb={10}
				>
					<Flex
						bg='bg.elevated'
						px={6}
						py={4}
						justify='space-between'
						align='center'
					>
						<HStack>
							<Icon as={FaPlug} color='gold.primary' />
							<Text color='text.heading' fontWeight='semibold'>
								Example Request Payload
							</Text>
						</HStack>
						<Button
							size='sm'
							variant='ghost'
							color='text.muted'
							_hover={{ color: 'gold.primary' }}
							onClick={copyPayload}
						>
							<FaCopy /> <Text ml={1}>Copy</Text>
						</Button>
					</Flex>
					<Box p={6} bg='navy.900'>
						<pre
							style={{
								margin: 0,
								padding: 0,
								fontFamily: 'monospace',
								fontSize: '13px',
								color: '#e2e8f0',
								overflowX: 'auto',
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word',
							}}
						>
							{formattedPayload}
						</pre>
					</Box>
				</Box>

				{/* Complete Field Reference Table */}
				<Box
					bg='bg.surface'
					borderRadius='xl'
					border='1px solid'
					borderColor='border.default'
					overflow='hidden'
					mb={10}
				>
					<Box
						bg='bg.elevated'
						px={6}
						py={4}
						borderBottom='1px solid'
						borderColor='border.default'
					>
						<Heading size='sm' color='text.heading'>
							Complete Field Reference
						</Heading>
					</Box>
					<Box overflowX='auto'>
						<Table variant='simple' size='sm'>
							<Thead bg='bg.elevated'>
								<Tr>
									<Th color='gold.primary' fontSize='xs'>
										Field Name
									</Th>
									<Th color='gold.primary' fontSize='xs'>
										Type
									</Th>
									<Th color='gold.primary' fontSize='xs'>
										Required
									</Th>
									<Th color='gold.primary' fontSize='xs'>
										Description
									</Th>
									<Th color='gold.primary' fontSize='xs'>
										Example
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								{ALL_FIELDS.map((field, idx) => (
									<Tr key={idx} _hover={{ bg: 'bg.elevated' }}>
										<Td fontFamily='monospace' fontSize='sm' color='text.body'>
											{field.name}
										</Td>
										<Td>
											<Badge variant='subtle' fontSize='10px'>
												{field.type}
											</Badge>
										</Td>
										<Td>
											{field.required ? (
												<Badge variant='gold' fontSize='10px'>
													Required
												</Badge>
											) : (
												<Text color='text.muted' fontSize='xs'>
													Optional
												</Text>
											)}
										</Td>
										<Td fontSize='sm' color='text.muted'>
											{field.description}
										</Td>
										<Td>
											<Code fontSize='xs' bg='bg.elevated' color='text.body'>
												{field.example}
											</Code>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				</Box>

				{/* Tips Section */}
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
					<Box
						bg='bg.surface'
						borderRadius='xl'
						border='1px solid'
						borderColor='border.default'
						p={5}
					>
						<Flex align='center' mb={3}>
							<Box
								w={8}
								h={8}
								bg='rgba(72, 187, 120, 0.1)'
								borderRadius='lg'
								display='flex'
								alignItems='center'
								justifyContent='center'
								mr={3}
							>
								<Icon as={FaPlug} boxSize={4} color='green.400' />
							</Box>
							<Heading size='sm' color='text.heading'>
								Best Practices
							</Heading>
						</Flex>
						<VStack align='start' spacing={2}>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Always include at least the lead's name for identification
								</Text>
							</HStack>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Use UTM parameters to track campaign performance
								</Text>
							</HStack>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Include both phone and WhatsApp numbers when available
								</Text>
							</HStack>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Send UTC timestamps for createdDate field
								</Text>
							</HStack>
						</VStack>
					</Box>

					<Box
						bg='bg.surface'
						borderRadius='xl'
						border='1px solid'
						borderColor='border.default'
						p={5}
					>
						<Flex align='center' mb={3}>
							<Box
								w={8}
								h={8}
								bg='rgba(245, 158, 11, 0.1)'
								borderRadius='lg'
								display='flex'
								alignItems='center'
								justifyContent='center'
								mr={3}
							>
								<Icon as={FaPlug} boxSize={4} color='orange.400' />
							</Box>
							<Heading size='sm' color='text.heading'>
								Common Mistakes
							</Heading>
						</Flex>
						<VStack align='start' spacing={2}>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Sending incorrect field name format
								</Text>
							</HStack>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Missing required name field in request
								</Text>
							</HStack>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Not URL-encoding special characters
								</Text>
							</HStack>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Using wrong content-type header
								</Text>
							</HStack>
						</VStack>
					</Box>
				</SimpleGrid>

				{/* FAQ Section */}
				<Box
					bg='bg.surface'
					borderRadius='xl'
					border='1px solid'
					borderColor='border.default'
					overflow='hidden'
				>
					<Box
						bg='bg.elevated'
						px={6}
						py={4}
						borderBottom='1px solid'
						borderColor='border.default'
					>
						<Heading size='sm' color='text.heading'>
							Frequently Asked Questions
						</Heading>
					</Box>
					<Accordion allowMultiple>
						{faqs.map((faq, index) => (
							<AccordionItem key={index} borderColor='border.subtle'>
								<AccordionButton py={4} _hover={{ bg: 'bg.elevated' }}>
									<Box
										flex='1'
										textAlign='left'
										fontWeight='medium'
										color='text.body'
									>
										{faq.question}
									</Box>
									<AccordionIcon color='text.muted' />
								</AccordionButton>
								<AccordionPanel pb={4} color='text.muted'>
									{faq.answer}
								</AccordionPanel>
							</AccordionItem>
						))}
					</Accordion>
				</Box>
			</Container>
		</Box>
	);
};

export default LeadsIntegration;
