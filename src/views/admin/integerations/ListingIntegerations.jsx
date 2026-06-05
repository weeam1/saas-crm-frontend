// import React, { useState, useEffect } from 'react';
// import {
// 	Box,
// 	Container,
// 	Heading,
// 	Text,
// 	Button,
// 	SimpleGrid,
// 	Tabs,
// 	TabList,
// 	Tab,
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	Code,
// 	Badge,
// 	Flex,
// 	Icon,
// 	Alert,
// 	AlertIcon,
// 	AlertTitle,
// 	AlertDescription,
// 	HStack,
// 	VStack,
// 	Accordion,
// 	AccordionItem,
// 	AccordionButton,
// 	AccordionPanel,
// 	AccordionIcon,
// 	Input,
// 	InputGroup,
// 	InputRightElement,
// 	Tooltip,
// 	Tabs as ChakraTabs,
// 	TabPanel,
// 	TabPanels,
// } from '@chakra-ui/react';
// import {
// 	FaBuilding,
// 	FaMapMarkerAlt,
// 	FaUserAlt,
// 	FaPlug,
// 	FaArrowLeft,
// 	FaCopy,
// 	FaFileUpload,
// 	FaTable,
// 	FaTerminal,
// } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import {
// 	LISTING_FIELDS,
// 	LISTING_PAYLOAD_EXAMPLE,
// } from 'data/ListingFieldsData';
// import { toast } from 'react-toastify';

// const ListingsIntegration = () => {
// 	const [activeTab, setActiveTab] = useState(0);
// 	const [tenantId, setTenantId] = useState('');
// 	const [viewMode, setViewMode] = useState('table'); // 'table' or 'curl'
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		// Get tenant ID from localStorage
// 		const storedTenantId =
// 			localStorage.getItem('tenantId') ||
// 			localStorage.getItem('tenant_id') ||
// 			'TENANT_ID_HERE';
// 		setTenantId(storedTenantId);
// 	}, []);

// 	const getFilteredFields = () => {
// 		if (activeTab === 0) return LISTING_FIELDS;
// 		if (activeTab === 1) return LISTING_FIELDS.filter((f) => f.required);
// 		if (activeTab === 2)
// 			return LISTING_FIELDS.filter((f) => f.category === 'property');
// 		if (activeTab === 3)
// 			return LISTING_FIELDS.filter((f) => f.category === 'location');
// 		return LISTING_FIELDS.filter((f) => f.category === 'contact');
// 	};

// 	const copyToClipboard = (text, message) => {
// 		navigator.clipboard.writeText(text);
// 		toast.success(message || 'Copied to clipboard', {
// 			position: 'top-right',
// 			autoClose: 2000,
// 		});
// 	};

// 	const copyCurlCommand = () => {
// 		const curlCommand = getCurlCommand();
// 		copyToClipboard(
// 			curlCommand,
// 			'cURL command copied! Paste it directly into Postman',
// 		);
// 	};

// 	const getCurlCommand = () => {
// 		return `curl -X POST "${baseUrl}api/listing/clients?isClient=true" \\
//   -H "X-Tenant-ID: ${tenantId}" \\
//   -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
//   -F "projectName=John Davis" \\
//   -F "unitNumber=99611" \\
//   -F 'country={"name":"Åland Islands","code":"AX","flags":{"png":"https://flagcdn.com/w320/ax.png","svg":"https://flagcdn.com/ax.svg"}}' \\
//   -F "unitType=694a8aad1e717eebde38030a" \\
//   -F "subUnitType=" \\
//   -F "listingType=682b1a448a5ba638b6c8de8b" \\
//   -F "buildingAge=26367" \\
//   -F "developer=Chris Johnson" \\
//   -F "location=Test Sampl" \\
//   -F "area=28349" \\
//   -F "city=Indianapolis" \\
//   -F "sellingPrice=51402" \\
//   -F 'currency={"value":"AED","label":"AED - United Arab Emirates Dirham","symbol":"AED","name":"United Arab Emirates Dirham"}' \\
//   -F "landlordName=Sarah Garcia" \\
//   -F "landlordPhone=+6828509418" \\
//   -F "email=mock@yahoo.com" \\
//   -F "description=Content Sample Content Text Data Example Placehold" \\
//   -F "phoneCountry=ae" \\
//   -F 'metaData={"source":"ip","ip":"223.123.88.24","city":"Islamabad","country":"Pakistan","zip":"44000"}' \\
//   -F "images=@/path/to/dummy-image.webp" \\
//   -F "documents=@/path/to/pdf-sample_0.pdf"`;
// 	};

// 	const copyApiUrl = () => {
// 		const apiUrl = `${baseUrl}api/listing/clients?isClient=true`;
// 		copyToClipboard(apiUrl, 'API URL copied to clipboard');
// 	};

// 	const copyTenantId = () => {
// 		copyToClipboard(tenantId, 'Tenant ID copied to clipboard');
// 	};

// 	const tabLabels = [
// 		'All Fields',
// 		'Required',
// 		'Property Info',
// 		'Location',
// 		'Contact Info',
// 	];

// 	// Form data key-value pairs for Postman-style display
// 	const formDataFields = [
// 		{ key: 'projectName', value: 'John Davis', type: 'text' },
// 		{ key: 'unitNumber', value: '99611', type: 'text' },
// 		{
// 			key: 'country',
// 			value:
// 				'{"name":"Åland Islands","code":"AX","flags":{"png":"https://flagcdn.com/w320/ax.png","svg":"https://flagcdn.com/ax.svg"}}',
// 			type: 'text',
// 		},
// 		{ key: 'unitType', value: '694a8aad1e717eebde38030a', type: 'text' },
// 		{ key: 'subUnitType', value: '', type: 'text' },
// 		{ key: 'listingType', value: '682b1a448a5ba638b6c8de8b', type: 'text' },
// 		{ key: 'buildingAge', value: '26367', type: 'text' },
// 		{ key: 'developer', value: 'Chris Johnson', type: 'text' },
// 		{ key: 'location', value: 'Test Sampl', type: 'text' },
// 		{ key: 'area', value: '28349', type: 'text' },
// 		{ key: 'city', value: 'Indianapolis', type: 'text' },
// 		{ key: 'sellingPrice', value: '51402', type: 'text' },
// 		{
// 			key: 'currency',
// 			value:
// 				'{"value":"AED","label":"AED - United Arab Emirates Dirham","symbol":"AED","name":"United Arab Emirates Dirham"}',
// 			type: 'text',
// 		},
// 		{ key: 'landlordName', value: 'Sarah Garcia', type: 'text' },
// 		{ key: 'landlordPhone', value: '+6828509418', type: 'text' },
// 		{ key: 'email', value: 'mock@yahoo.com', type: 'text' },
// 		{
// 			key: 'description',
// 			value: 'Content Sample Content Text Data Example Placehold',
// 			type: 'text',
// 		},
// 		{ key: 'phoneCountry', value: 'ae', type: 'text' },
// 		{
// 			key: 'metaData',
// 			value:
// 				'{"source":"ip","ip":"223.123.88.24","city":"Islamabad","country":"Pakistan","zip":"44000"}',
// 			type: 'text',
// 		},
// 		{ key: 'images', value: 'dummy-image.webp', type: 'file' },
// 		{ key: 'documents', value: 'pdf-sample_0.pdf', type: 'file' },
// 	];

// 	// Get base URL from env or use default
// 	const baseUrl = process.env.REACT_APP_API_URL || 'https://api.yourcrm.com';

// 	// FAQ Data for Listings
// 	const faqs = [
// 		{
// 			question: 'How do I import the cURL command into Postman?',
// 			answer:
// 				'1. Open Postman\n2. Click "Import" button (top left)\n3. Select "Raw text" tab\n4. Paste the cURL command\n5. Click "Continue" and then "Import"\n6. The request will be automatically configured with all headers and form-data fields!',
// 		},
// 		{
// 			question: 'How do I test file uploads in Postman?',
// 			answer:
// 				'In Postman, after importing the cURL command, go to the "Body" tab, select "form-data", find the "images" and "documents" fields, change the type from "Text" to "File", and select your actual files.',
// 		},
// 		{
// 			question: "What happens if I don't send the Tenant ID in headers?",
// 			answer:
// 				'The API will reject your request with a 401 Unauthorized error. Tenant ID is required to identify which organization the listings belong to.',
// 		},
// 		{
// 			question: 'What image formats are supported?',
// 			answer:
// 				'We support JPEG, PNG, WEBP, and GIF formats. Maximum file size is 10MB per image.',
// 		},
// 		{
// 			question: 'How long does it take for listings to appear in the CRM?',
// 			answer:
// 				'Listings appear in real-time. Once the API returns a success response, the listing is immediately available in your CRM dashboard.',
// 		},
// 		{
// 			question: 'Can I update an existing listing?',
// 			answer:
// 				'Yes, send the same listing number or use the PUT method with the listing ID to update existing listings.',
// 		},
// 	];

// 	return (
// 		<Box bg='gray.50' minH='100vh'>
// 			<Container maxW='container.xl' py={4}>
// 				<Flex align='center'>
// 					<Button
// 						variant='ghost'
// 						leftIcon={<FaArrowLeft />}
// 						onClick={() => navigate('/admin-setting/integrations')}
// 						size='sm'
// 					>
// 						Back
// 					</Button>
// 				</Flex>
// 			</Container>

// 			{/* Hero Section */}
// 			<Box bgGradient='linear(to-br, green.50, white, teal.50)'>
// 				<Container maxW='container.md' py={12} textAlign='center'>
// 					<Box
// 						w={16}
// 						h={16}
// 						bg='white'
// 						borderRadius='2xl'
// 						shadow='lg'
// 						display='flex'
// 						alignItems='center'
// 						justifyContent='center'
// 						mx='auto'
// 						mb={5}
// 					>
// 						<Icon as={FaBuilding} boxSize={8} color='green.600' />
// 					</Box>
// 					<Heading size='xl' mb={3}>
// 						Listings Integration Guide
// 					</Heading>
// 					<Text maxW='2xl' mx='auto'>
// 						Learn how to send property listing data to our CRM using
// 						multipart/form-data
// 					</Text>
// 				</Container>
// 			</Box>

// 			<Container maxW='container.xl' py={10}>
// 				{/* API Endpoint */}
// 				<Box mb={6}>
// 					<Heading size='md' mb={4}>
// 						API Endpoint
// 					</Heading>
// 					<Box
// 						bg='white'
// 						borderRadius='xl'
// 						border='1px solid'
// 						borderColor='gray.200'
// 						overflow='hidden'
// 					>
// 						<Flex
// 							direction={{ base: 'column', md: 'row' }}
// 							justify='space-between'
// 							align={{ base: 'stretch', md: 'center' }}
// 							p={4}
// 							bg='gray.50'
// 							borderBottom='1px solid'
// 							borderColor='gray.200'
// 						>
// 							<Text fontWeight='semibold' mb={{ base: 2, md: 0 }}>
// 								POST Request (multipart/form-data)
// 							</Text>
// 							<Button
// 								size='xs'
// 								variant='outline'
// 								leftIcon={<FaCopy />}
// 								onClick={copyApiUrl}
// 							>
// 								Copy URL
// 							</Button>
// 						</Flex>
// 						<Box p={4} bg='gray.900'>
// 							<pre
// 								style={{
// 									margin: 0,
// 									padding: 0,
// 									fontFamily: 'monospace',
// 									fontSize: '14px',
// 									color: '#e2e8f0',
// 									overflowX: 'auto',
// 									whiteSpace: 'pre-wrap',
// 									wordBreak: 'break-all',
// 								}}
// 							>
// 								{`${baseUrl}api/listing/clients?isClient=true`}
// 							</pre>
// 						</Box>
// 					</Box>
// 					<Text fontSize='sm' color='gray.500' mt={2}>
// 						Send a POST request with multipart/form-data containing your
// 						property listing data. Supports text fields and file uploads
// 						(images, documents).
// 					</Text>
// 				</Box>

// 				{/* Headers Section */}
// 				<Box mb={10}>
// 					<Heading size='md' mb={4}>
// 						Required Headers
// 					</Heading>
// 					<Box
// 						bg='white'
// 						borderRadius='xl'
// 						border='1px solid'
// 						borderColor='gray.200'
// 						overflow='hidden'
// 					>
// 						<Box
// 							p={4}
// 							bg='gray.50'
// 							borderBottom='1px solid'
// 							borderColor='gray.200'
// 						>
// 							<Text fontWeight='semibold'>Authentication Headers</Text>
// 						</Box>
// 						<Box overflowX='auto'>
// 							<Table variant='simple' size='sm'>
// 								<Thead bg='gray.50'>
// 									<Tr>
// 										<Th>Header Name</Th>
// 										<Th>Value</Th>
// 										<Th>Required</Th>
// 										<Th>Description</Th>
// 									</Tr>
// 								</Thead>
// 								<Tbody>
// 									<Tr>
// 										<Td fontFamily='monospace' fontSize='sm'>
// 											X-Tenant-ID
// 										</Td>
// 										<Td>
// 											<InputGroup size='sm' maxW='300px'>
// 												<Input
// 													value={tenantId}
// 													isReadOnly
// 													fontFamily='monospace'
// 													fontSize='sm'
// 													bg='gray.50'
// 												/>
// 												<InputRightElement>
// 													<Tooltip label='Copy Tenant ID'>
// 														<Button
// 															size='xs'
// 															variant='ghost'
// 															onClick={copyTenantId}
// 														>
// 															<FaCopy />
// 														</Button>
// 													</Tooltip>
// 												</InputRightElement>
// 											</InputGroup>
// 										</Td>
// 										<Td>
// 											<Badge colorScheme='red'>Required</Badge>
// 										</Td>
// 										<Td fontSize='sm' color='gray.600'>
// 											Your organization's unique identifier
// 										</Td>
// 									</Tr>
// 									{/* <Tr>
//                     <Td fontFamily="monospace" fontSize="sm">Content-Type</Td>
//                     <Td><Code fontSize="sm">multipart/form-data</Code></Td>
//                     <Td><Badge colorScheme="green">Auto-set</Badge></Td>
//                     <Td fontSize="sm" color="gray.600">Set automatically when using form-data</Td>
//                   </Tr> */}
// 								</Tbody>
// 							</Table>
// 						</Box>
// 					</Box>
// 				</Box>

// 				{/* Tabs for Fields */}
// 				<Box mb={8}>
// 					<Tabs variant='ghost' onChange={setActiveTab}>
// 						<TabList flexWrap='wrap' gap={2}>
// 							{tabLabels.map((label) => (
// 								<Tab
// 									key={label}
// 									_selected={{ bg: 'brand.600', color: 'white' }}
// 								>
// 									{label}
// 								</Tab>
// 							))}
// 						</TabList>
// 					</Tabs>
// 				</Box>

// 				{/* Reference Data Note */}
// 				<Alert
// 					status='info'
// 					mb={6}
// 					borderRadius='md'
// 					bg='blue.50'
// 					borderLeft='4px solid'
// 					borderLeftColor='blue.500'
// 				>
// 					<AlertIcon color='blue.600' />
// 					<Box>
// 						<Text fontWeight='semibold' color='blue.800'>
// 							Reference Data from CRM
// 						</Text>
// 						<Text fontSize='sm' color='blue.700'>
// 							Values for <Code fontSize='xs'>listingType</Code>,{' '}
// 							<Code fontSize='xs'>unitType</Code>, and{' '}
// 							<Code fontSize='xs'>subUnitType</Code> come from your CRM
// 							database. Manage them at:{' '}
// 							<strong>Settings → Listing Settings</strong> (Listing Types & Unit
// 							Types tabs)
// 						</Text>
// 					</Box>
// 				</Alert>

// 				{/* Field Cards Grid */}
// 				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={12}>
// 					{getFilteredFields().map((field, idx) => (
// 						<Box
// 							key={idx}
// 							bg='white'
// 							borderRadius='xl'
// 							border='1px solid'
// 							borderColor={'gray.200'}
// 							bgColor={'white'}
// 							p={4}
// 							transition='all 0.2s'
// 							_hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
// 						>
// 							<Flex justify='space-between' align='start' mb={2}>
// 								<Box>
// 									<Code fontSize='sm' fontWeight='bold' color='gray.800'>
// 										{field.name}
// 										{field.required && (
// 											<Text as='span' color='red.500' ml={1}>
// 												*
// 											</Text>
// 										)}
// 									</Code>
// 								</Box>
// 								<Badge
// 									colorScheme='gray'
// 									fontSize='xs'
// 									px={2}
// 									py={1}
// 									borderRadius='full'
// 								>
// 									{field.type}
// 								</Badge>
// 							</Flex>
// 							<Text fontSize='xs' color='gray.600' mt={2}>
// 								{field.description}
// 							</Text>
// 							<Box mt={2} pt={2} borderTop='1px solid' borderColor='gray.100'>
// 								<Text fontSize='xs' color='gray.400'>
// 									Example:
// 								</Text>
// 								<Code fontSize='xs' color='gray.700' display='block' mt={1}>
// 									"{field.example}"
// 								</Code>
// 							</Box>
// 						</Box>
// 					))}
// 				</SimpleGrid>

// 				{/* Form Data Example - Postman Style */}
// 				<Box
// 					bg='white'
// 					borderRadius='xl'
// 					border='1px solid'
// 					borderColor='gray.200'
// 					overflow='hidden'
// 					mb={10}
// 				>
// 					<Flex
// 						bg='gray.800'
// 						px={6}
// 						py={4}
// 						justify='space-between'
// 						align='center'
// 						flexWrap='wrap'
// 						gap={4}
// 					>
// 						<HStack>
// 							<Icon as={FaFileUpload} color='white' />
// 							<Text color='white' fontWeight='semibold'>
// 								multipart/form-data Example
// 							</Text>
// 						</HStack>
// 						<HStack spacing={3}>
// 							<Button
// 								size='sm'
// 								variant={viewMode === 'table' ? 'solid' : 'outline'}
// 								colorScheme='green'
// 								leftIcon={<FaTable />}
// 								onClick={() => setViewMode('table')}
// 							>
// 								Form-Data Table
// 							</Button>
// 							<Button
// 								size='sm'
// 								variant={viewMode === 'curl' ? 'solid' : 'outline'}
// 								colorScheme='green'
// 								leftIcon={<FaTerminal />}
// 								onClick={() => setViewMode('curl')}
// 							>
// 								cURL Command
// 							</Button>
// 						</HStack>
// 					</Flex>

// 					{viewMode === 'table' ? (
// 						<Box overflowX='auto'>
// 							<Table variant='simple' size='md'>
// 								<Thead bg='gray.100'>
// 									<Tr>
// 										<Th width='30%'>Key (Field Name)</Th>
// 										<Th width='50%'>Value</Th>
// 										<Th width='20%'>Type</Th>
// 									</Tr>
// 								</Thead>
// 								<Tbody>
// 									{formDataFields.map((field, idx) => (
// 										<Tr key={idx} _hover={{ bg: 'gray.50' }}>
// 											<Td>
// 												<Code fontSize='sm' fontWeight='bold'>
// 													{field.key}
// 												</Code>
// 											</Td>
// 											<Td>
// 												{field.type === 'file' ? (
// 													<HStack>
// 														<Icon as={FaFileUpload} color='green.500' />
// 														<Text fontSize='sm' color='gray.600'>
// 															{field.value}
// 														</Text>
// 														<Badge colorScheme='orange' size='sm'>
// 															File
// 														</Badge>
// 													</HStack>
// 												) : (
// 													<Text
// 														fontSize='sm'
// 														fontFamily='monospace'
// 														wordBreak='break-all'
// 													>
// 														{field.value || (
// 															<Text as='span' color='gray.400'>
// 																(empty)
// 															</Text>
// 														)}
// 													</Text>
// 												)}
// 											</Td>
// 											<Td>
// 												<Badge
// 													colorScheme={
// 														field.type === 'file' ? 'orange' : 'blue'
// 													}
// 												>
// 													{field.type === 'file' ? 'File' : 'Text'}
// 												</Badge>
// 											</Td>
// 										</Tr>
// 									))}
// 								</Tbody>
// 							</Table>
// 						</Box>
// 					) : (
// 						<Box bg='gray.900' p={6}>
// 							<Flex justify='flex-end' mb={4}>
// 								<Button
// 									size='sm'
// 									variant='ghost'
// 									color='gray.400'
// 									_hover={{ color: 'white' }}
// 									leftIcon={<FaCopy />}
// 									onClick={copyCurlCommand}
// 								>
// 									Copy cURL
// 								</Button>
// 							</Flex>
// 							<pre
// 								style={{
// 									margin: 0,
// 									padding: 0,
// 									fontFamily: 'monospace',
// 									fontSize: '13px',
// 									color: '#e2e8f0',
// 									overflowX: 'auto',
// 									whiteSpace: 'pre-wrap',
// 									wordBreak: 'break-word',
// 								}}
// 							>
// 								{getCurlCommand()}
// 							</pre>

// 							{/* Postman Import Instructions */}
// 							<Alert
// 								status='success'
// 								mt={6}
// 								borderRadius='md'
// 								bg='green.900'
// 								borderLeftColor='green.500'
// 							>
// 								<AlertIcon />
// 								<Box>
// 									<Text fontWeight='semibold' color='white'>
// 										📌 How to use in Postman:
// 									</Text>
// 									<Text fontSize='sm' color='gray.300'>
// 										1. Open Postman → Click <strong>"Import"</strong> (top left)
// 										<br />
// 										2. Select <strong>"Raw text"</strong> tab
// 										<br />
// 										3. <strong>Paste the cURL command</strong> above
// 										<br />
// 										4. Click <strong>"Continue"</strong> →{' '}
// 										<strong>"Import"</strong>
// 										<br />
// 										5. The request will be automatically configured with all
// 										headers and form-data fields!
// 										<br />
// 										<br />
// 										<strong>💡 For file uploads:</strong> Go to Body → form-data
// 										→ change "images" and "documents" from Text to File
// 									</Text>
// 								</Box>
// 							</Alert>
// 						</Box>
// 					)}
// 				</Box>

// 				{/* Complete Field Reference Table */}
// 				<Box
// 					bg='white'
// 					borderRadius='xl'
// 					border='1px solid'
// 					borderColor='gray.200'
// 					overflow='hidden'
// 					mb={10}
// 				>
// 					<Box
// 						bg='gray.50'
// 						px={6}
// 						py={4}
// 						borderBottom='1px solid'
// 						borderColor='gray.200'
// 					>
// 						<Heading size='sm'>Complete Field Reference</Heading>
// 					</Box>
// 					<Box overflowX='auto'>
// 						<Table variant='simple' size='sm'>
// 							<Thead bg='gray.50'>
// 								<Tr>
// 									<Th>Field Name</Th>
// 									<Th>Type</Th>
// 									<Th>Required</Th>
// 									<Th>Description</Th>
// 									<Th>Example</Th>
// 								</Tr>
// 							</Thead>
// 							<Tbody>
// 								{LISTING_FIELDS.map((field, idx) => (
// 									<Tr key={idx} _hover={{ bg: 'gray.50' }}>
// 										<Td fontFamily='monospace' fontSize='sm'>
// 											{field.name}
// 										</Td>
// 										<Td>
// 											<Badge colorScheme='gray'>{field.type}</Badge>
// 										</Td>
// 										<Td>
// 											{field.required ? (
// 												<Badge colorScheme='red'>Required</Badge>
// 											) : (
// 												<Text color='gray.400' fontSize='xs'>
// 													Optional
// 												</Text>
// 											)}
// 										</Td>
// 										<Td fontSize='sm' color='gray.600'>
// 											{field.description}
// 										</Td>
// 										<Td>
// 											<Code fontSize='xs'>{field.example}</Code>
// 										</Td>
// 									</Tr>
// 								))}
// 							</Tbody>
// 						</Table>
// 					</Box>
// 				</Box>

// 				{/* Tips Section */}
// 				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
// 					<Box
// 						bg='white'
// 						borderRadius='xl'
// 						border='1px solid'
// 						borderColor='gray.200'
// 						p={5}
// 					>
// 						<Flex align='center' mb={3}>
// 							<Box
// 								w={8}
// 								h={8}
// 								bg='green.100'
// 								borderRadius='lg'
// 								display='flex'
// 								alignItems='center'
// 								justifyContent='center'
// 								mr={3}
// 							>
// 								<Icon as={FaBuilding} boxSize={4} color='green.600' />
// 							</Box>
// 							<Heading size='sm'>Best Practices</Heading>
// 						</Flex>
// 						<VStack align='start' spacing={2}>
// 							<HStack>
// 								<Text color='green.500'>✓</Text>
// 								<Text fontSize='sm'>
// 									Always include accurate property details for better search
// 									results
// 								</Text>
// 							</HStack>
// 							<HStack>
// 								<Text color='green.500'>✓</Text>
// 								<Text fontSize='sm'>
// 									Use high-quality images to showcase properties
// 								</Text>
// 							</HStack>
// 							<HStack>
// 								<Text color='green.500'>✓</Text>
// 								<Text fontSize='sm'>Keep listing information up to date</Text>
// 							</HStack>
// 							<HStack>
// 								<Text color='green.500'>✓</Text>
// 								<Text fontSize='sm'>
// 									Include complete location details for accurate mapping
// 								</Text>
// 							</HStack>
// 						</VStack>
// 					</Box>

// 					<Box
// 						bg='white'
// 						borderRadius='xl'
// 						border='1px solid'
// 						borderColor='gray.200'
// 						p={5}
// 					>
// 						<Flex align='center' mb={3}>
// 							<Box
// 								w={8}
// 								h={8}
// 								bg='yellow.100'
// 								borderRadius='lg'
// 								display='flex'
// 								alignItems='center'
// 								justifyContent='center'
// 								mr={3}
// 							>
// 								<Icon as={FaBuilding} boxSize={4} color='yellow.600' />
// 							</Box>
// 							<Heading size='sm'>Common Mistakes</Heading>
// 						</Flex>
// 						<VStack align='start' spacing={2}>
// 							<HStack>
// 								<Text color='red.500'>✗</Text>
// 								<Text fontSize='sm'>
// 									Missing required fields like project name or location
// 								</Text>
// 							</HStack>
// 							<HStack>
// 								<Text color='red.500'>✗</Text>
// 								<Text fontSize='sm'>
// 									Incorrect price format or missing currency
// 								</Text>
// 							</HStack>
// 							<HStack>
// 								<Text color='red.500'>✗</Text>
// 								<Text fontSize='sm'>Invalid area measurements</Text>
// 							</HStack>
// 							<HStack>
// 								<Text color='red.500'>✗</Text>
// 								<Text fontSize='sm'>
// 									Duplicate listing submissions without unique identifiers
// 								</Text>
// 							</HStack>
// 						</VStack>
// 					</Box>
// 				</SimpleGrid>

// 				{/* FAQ Section */}
// 				<Box
// 					bg='white'
// 					borderRadius='xl'
// 					border='1px solid'
// 					borderColor='gray.200'
// 					overflow='hidden'
// 				>
// 					<Box
// 						bg='gray.50'
// 						px={6}
// 						py={4}
// 						borderBottom='1px solid'
// 						borderColor='gray.200'
// 					>
// 						<Heading size='sm'>Frequently Asked Questions</Heading>
// 					</Box>
// 					<Accordion allowMultiple>
// 						{faqs.map((faq, index) => (
// 							<AccordionItem key={index}>
// 								<AccordionButton py={4} _hover={{ bg: 'gray.50' }}>
// 									<Box flex='1' textAlign='left' fontWeight='medium'>
// 										{faq.question}
// 									</Box>
// 									<AccordionIcon />
// 								</AccordionButton>
// 								<AccordionPanel pb={4} color='gray.600'>
// 									{faq.answer}
// 								</AccordionPanel>
// 							</AccordionItem>
// 						))}
// 					</Accordion>
// 				</Box>
// 			</Container>
// 		</Box>
// 	);
// };

// export default ListingsIntegration;

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
	Alert,
	AlertIcon,
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
import {
	FaBuilding,
	FaArrowLeft,
	FaCopy,
	FaFileUpload,
	FaTable,
	FaTerminal,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
	LISTING_FIELDS,
	LISTING_PAYLOAD_EXAMPLE,
} from 'data/ListingFieldsData';
import { toast } from 'react-toastify';

const ListingsIntegration = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [tenantId, setTenantId] = useState('');
	const [viewMode, setViewMode] = useState('table');
	const navigate = useNavigate();

	useEffect(() => {
		const storedTenantId =
			localStorage.getItem('tenantId') ||
			localStorage.getItem('tenant_id') ||
			'TENANT_ID_HERE';
		setTenantId(storedTenantId);
	}, []);

	const getFilteredFields = () => {
		if (activeTab === 0) return LISTING_FIELDS;
		if (activeTab === 1) return LISTING_FIELDS.filter((f) => f.required);
		if (activeTab === 2)
			return LISTING_FIELDS.filter((f) => f.category === 'property');
		if (activeTab === 3)
			return LISTING_FIELDS.filter((f) => f.category === 'location');
		return LISTING_FIELDS.filter((f) => f.category === 'contact');
	};

	const copyToClipboard = (text, message) => {
		navigator.clipboard.writeText(text);
		toast.success(message || 'Copied to clipboard', {
			position: 'top-right',
			autoClose: 2000,
		});
	};

	const copyCurlCommand = () => {
		const curlCommand = getCurlCommand();
		copyToClipboard(
			curlCommand,
			'cURL command copied! Paste it directly into Postman',
		);
	};

	const getCurlCommand = () => {
		return `curl -X POST "${baseUrl}api/listing/clients?isClient=true" \\
  -H "X-Tenant-ID: ${tenantId}" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "projectName=John Davis" \\
  -F "unitNumber=99611" \\
  -F 'country={"name":"Åland Islands","code":"AX","flags":{"png":"https://flagcdn.com/w320/ax.png","svg":"https://flagcdn.com/ax.svg"}}' \\
  -F "unitType=694a8aad1e717eebde38030a" \\
  -F "subUnitType=" \\
  -F "listingType=682b1a448a5ba638b6c8de8b" \\
  -F "buildingAge=26367" \\
  -F "developer=Chris Johnson" \\
  -F "location=Test Sampl" \\
  -F "area=28349" \\
  -F "city=Indianapolis" \\
  -F "sellingPrice=51402" \\
  -F 'currency={"value":"AED","label":"AED - United Arab Emirates Dirham","symbol":"AED","name":"United Arab Emirates Dirham"}' \\
  -F "landlordName=Sarah Garcia" \\
  -F "landlordPhone=+6828509418" \\
  -F "email=mock@yahoo.com" \\
  -F "description=Content Sample Content Text Data Example Placehold" \\
  -F "phoneCountry=ae" \\
  -F 'metaData={"source":"ip","ip":"223.123.88.24","city":"Islamabad","country":"Pakistan","zip":"44000"}' \\
  -F "images=@/path/to/dummy-image.webp" \\
  -F "documents=@/path/to/pdf-sample_0.pdf"`;
	};

	const copyApiUrl = () => {
		const apiUrl = `${baseUrl}api/listing/clients?isClient=true`;
		copyToClipboard(apiUrl, 'API URL copied to clipboard');
	};

	const copyTenantId = () => {
		copyToClipboard(tenantId, 'Tenant ID copied to clipboard');
	};

	const tabLabels = [
		'All Fields',
		'Required',
		'Property Info',
		'Location',
		'Contact Info',
	];

	const formDataFields = [
		{ key: 'projectName', value: 'John Davis', type: 'text' },
		{ key: 'unitNumber', value: '99611', type: 'text' },
		{
			key: 'country',
			value:
				'{"name":"Åland Islands","code":"AX","flags":{"png":"https://flagcdn.com/w320/ax.png","svg":"https://flagcdn.com/ax.svg"}}',
			type: 'text',
		},
		{ key: 'unitType', value: '694a8aad1e717eebde38030a', type: 'text' },
		{ key: 'subUnitType', value: '', type: 'text' },
		{ key: 'listingType', value: '682b1a448a5ba638b6c8de8b', type: 'text' },
		{ key: 'buildingAge', value: '26367', type: 'text' },
		{ key: 'developer', value: 'Chris Johnson', type: 'text' },
		{ key: 'location', value: 'Test Sampl', type: 'text' },
		{ key: 'area', value: '28349', type: 'text' },
		{ key: 'city', value: 'Indianapolis', type: 'text' },
		{ key: 'sellingPrice', value: '51402', type: 'text' },
		{
			key: 'currency',
			value:
				'{"value":"AED","label":"AED - United Arab Emirates Dirham","symbol":"AED","name":"United Arab Emirates Dirham"}',
			type: 'text',
		},
		{ key: 'landlordName', value: 'Sarah Garcia', type: 'text' },
		{ key: 'landlordPhone', value: '+6828509418', type: 'text' },
		{ key: 'email', value: 'mock@yahoo.com', type: 'text' },
		{
			key: 'description',
			value: 'Content Sample Content Text Data Example Placehold',
			type: 'text',
		},
		{ key: 'phoneCountry', value: 'ae', type: 'text' },
		{
			key: 'metaData',
			value:
				'{"source":"ip","ip":"223.123.88.24","city":"Islamabad","country":"Pakistan","zip":"44000"}',
			type: 'text',
		},
		{ key: 'images', value: 'dummy-image.webp', type: 'file' },
		{ key: 'documents', value: 'pdf-sample_0.pdf', type: 'file' },
	];

	const baseUrl = process.env.REACT_APP_API_URL || 'https://api.yourcrm.com';

	const faqs = [
		{
			question: 'How do I import the cURL command into Postman?',
			answer:
				'1. Open Postman\n2. Click "Import" button (top left)\n3. Select "Raw text" tab\n4. Paste the cURL command\n5. Click "Continue" and then "Import"\n6. The request will be automatically configured with all headers and form-data fields!',
		},
		{
			question: 'How do I test file uploads in Postman?',
			answer:
				'In Postman, after importing the cURL command, go to the "Body" tab, select "form-data", find the "images" and "documents" fields, change the type from "Text" to "File", and select your actual files.',
		},
		{
			question: "What happens if I don't send the Tenant ID in headers?",
			answer:
				'The API will reject your request with a 401 Unauthorized error. Tenant ID is required to identify which organization the listings belong to.',
		},
		{
			question: 'What image formats are supported?',
			answer:
				'We support JPEG, PNG, WEBP, and GIF formats. Maximum file size is 10MB per image.',
		},
		{
			question: 'How long does it take for listings to appear in the CRM?',
			answer:
				'Listings appear in real-time. Once the API returns a success response, the listing is immediately available in your CRM dashboard.',
		},
		{
			question: 'Can I update an existing listing?',
			answer:
				'Yes, send the same listing number or use the PUT method with the listing ID to update existing listings.',
		},
	];

	return (
		<Box bg='bg.app' minH='100vh'>
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
						<Icon as={FaBuilding} boxSize={8} color='gold.primary' />
					</Box>
					<Heading size='xl' mb={3} color='text.heading'>
						Listings Integration Guide
					</Heading>
					<Text color='text.muted' maxW='2xl' mx='auto'>
						Learn how to send property listing data to our CRM using
						multipart/form-data
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
								POST Request (multipart/form-data)
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
								{`${baseUrl}api/listing/clients?isClient=true`}
							</pre>
						</Box>
					</Box>
					<Text fontSize='sm' color='text.muted' mt={2}>
						Send a POST request with multipart/form-data containing your
						property listing data. Supports text fields and file uploads
						(images, documents).
					</Text>
				</Box>

				{/* Headers Section */}
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

				{/* Tabs for Fields */}
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

				{/* Reference Data Note */}
				<Alert
					status='info'
					mb={6}
					borderRadius='lg'
					bg='rgba(212, 175, 55, 0.08)'
					borderLeft='4px solid'
					borderLeftColor='gold.primary'
				>
					<AlertIcon color='gold.primary' />
					<Box>
						<Text fontWeight='semibold' color='text.accent'>
							Reference Data from CRM
						</Text>
						<Text fontSize='sm' color='text.muted'>
							Values for{' '}
							<Code fontSize='xs' bg='bg.elevated' color='text.accent'>
								listingType
							</Code>
							,{' '}
							<Code fontSize='xs' bg='bg.elevated' color='text.accent'>
								unitType
							</Code>
							, and{' '}
							<Code fontSize='xs' bg='bg.elevated' color='text.accent'>
								subUnitType
							</Code>{' '}
							come from your CRM database. Manage them at:{' '}
							<strong>Settings → Listing Settings</strong> (Listing Types & Unit
							Types tabs)
						</Text>
					</Box>
				</Alert>

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

				{/* Form Data Example - Postman Style */}
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
						flexWrap='wrap'
						gap={4}
					>
						<HStack>
							<Icon as={FaFileUpload} color='gold.primary' />
							<Text color='text.heading' fontWeight='semibold'>
								multipart/form-data Example
							</Text>
						</HStack>
						<HStack spacing={3}>
							<Button
								size='sm'
								variant={viewMode === 'table' ? 'brand' : 'outline'}
								leftIcon={<FaTable />}
								onClick={() => setViewMode('table')}
							>
								Form-Data Table
							</Button>
							<Button
								size='sm'
								variant={viewMode === 'curl' ? 'brand' : 'outline'}
								leftIcon={<FaTerminal />}
								onClick={() => setViewMode('curl')}
							>
								cURL Command
							</Button>
						</HStack>
					</Flex>

					{viewMode === 'table' ? (
						<Box overflowX='auto'>
							<Table variant='simple' size='md'>
								<Thead bg='bg.elevated'>
									<Tr>
										<Th color='gold.primary' fontSize='xs'>
											Key (Field Name)
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Value
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Type
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{formDataFields.map((field, idx) => (
										<Tr key={idx} _hover={{ bg: 'bg.elevated' }}>
											<Td>
												<Code
													fontSize='sm'
													fontWeight='bold'
													bg='bg.elevated'
													color='gold.primary'
												>
													{field.key}
												</Code>
											</Td>
											<Td>
												{field.type === 'file' ? (
													<HStack>
														<Icon as={FaFileUpload} color='gold.primary' />
														<Text fontSize='sm' color='text.body'>
															{field.value}
														</Text>
														<Badge variant='gold' fontSize='xs'>
															File
														</Badge>
													</HStack>
												) : (
													<Text
														fontSize='sm'
														fontFamily='monospace'
														wordBreak='break-all'
														color='text.body'
													>
														{field.value || (
															<Text as='span' color='text.muted'>
																(empty)
															</Text>
														)}
													</Text>
												)}
											</Td>
											<Td>
												<Badge
													variant={field.type === 'file' ? 'gold' : 'subtle'}
													fontSize='xs'
												>
													{field.type === 'file' ? 'File' : 'Text'}
												</Badge>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</Box>
					) : (
						<Box bg='navy.900' p={6}>
							<Flex justify='flex-end' mb={4}>
								<Button
									size='sm'
									variant='ghost'
									color='text.muted'
									_hover={{ color: 'gold.primary' }}
									leftIcon={<FaCopy />}
									onClick={copyCurlCommand}
								>
									Copy cURL
								</Button>
							</Flex>
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
								{getCurlCommand()}
							</pre>

							{/* Postman Import Instructions */}
							<Alert
								status='success'
								mt={6}
								borderRadius='lg'
								bg='rgba(72, 187, 120, 0.1)'
								borderLeftColor='green.500'
							>
								<AlertIcon color='green.400' />
								<Box>
									<Text fontWeight='semibold' color='text.heading'>
										📌 How to use in Postman:
									</Text>
									<Text fontSize='sm' color='text.muted'>
										1. Open Postman → Click <strong>"Import"</strong> (top left)
										<br />
										2. Select <strong>"Raw text"</strong> tab
										<br />
										3. <strong>Paste the cURL command</strong> above
										<br />
										4. Click <strong>"Continue"</strong> →{' '}
										<strong>"Import"</strong>
										<br />
										5. The request will be automatically configured with all
										headers and form-data fields!
										<br />
										<br />
										<strong>💡 For file uploads:</strong> Go to Body → form-data
										→ change "images" and "documents" from Text to File
									</Text>
								</Box>
							</Alert>
						</Box>
					)}
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
								{LISTING_FIELDS.map((field, idx) => (
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
								<Icon as={FaBuilding} boxSize={4} color='green.400' />
							</Box>
							<Heading size='sm' color='text.heading'>
								Best Practices
							</Heading>
						</Flex>
						<VStack align='start' spacing={2}>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Always include accurate property details for better search
									results
								</Text>
							</HStack>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Use high-quality images to showcase properties
								</Text>
							</HStack>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Keep listing information up to date
								</Text>
							</HStack>
							<HStack>
								<Text color='green.400'>✓</Text>
								<Text fontSize='sm' color='text.body'>
									Include complete location details for accurate mapping
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
								<Icon as={FaBuilding} boxSize={4} color='orange.400' />
							</Box>
							<Heading size='sm' color='text.heading'>
								Common Mistakes
							</Heading>
						</Flex>
						<VStack align='start' spacing={2}>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Missing required fields like project name or location
								</Text>
							</HStack>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Incorrect price format or missing currency
								</Text>
							</HStack>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Invalid area measurements
								</Text>
							</HStack>
							<HStack>
								<Text color='red.400'>✗</Text>
								<Text fontSize='sm' color='text.body'>
									Duplicate listing submissions without unique identifiers
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

export default ListingsIntegration;
