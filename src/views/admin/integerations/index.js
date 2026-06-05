// import React from 'react';
// import {
// 	Box,
// 	Container,
// 	Heading,
// 	Text,
// 	SimpleGrid,
// 	Flex,
// 	HStack,
// 	Icon,
// 	Button,
// 	useColorModeValue,
// } from '@chakra-ui/react';
// import { FaUserAlt, FaBuilding, FaArrowLeft } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const IntegrationsGuide = () => {
// 	const navigate = useNavigate();
// 	const cardBg = useColorModeValue('white', 'gray.800');
// 	const shadowColor = useColorModeValue(
// 		'rgba(0, 0, 0, 0.05)',
// 		'rgba(255, 255, 255, 0.06)',
// 	);

// 	const modules = [
// 		{
// 			id: 'leads',
// 			name: 'Leads Integration',
// 			description:
// 				'Learn how to connect your lead sources like Facebook Ads, Google Ads, Webhooks, and more to automatically capture lead data.',
// 			route: '/admin-setting/integrations/leads',
// 			icon: FaUserAlt,
// 			iconBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
// 			iconColor: 'white',
// 			guideTopics: [
// 				'API Endpoint & Authentication',
// 				'Field Mapping Reference',
// 				'UTM Parameter Tracking',
// 				'Example Request Payload',
// 				'Best Practices',
// 			],
// 		},
// 		{
// 			id: 'listings',
// 			name: 'Listings Integration',
// 			description:
// 				'Learn how to sync property listings from various sources including property portals, CRM systems, and custom APIs.',
// 			route: '/admin-setting/integrations/listings',
// 			icon: FaBuilding,
// 			iconBg: 'linear-gradient(135deg, #10b981, #059669)',
// 			iconColor: 'white',
// 			guideTopics: [
// 				'API Endpoint & Authentication',
// 				'Property Field Mapping',
// 				'Location & Contact Data',
// 				'Example Request Payload',
// 				'Best Practices',
// 			],
// 		},
// 	];

// 	return (
// 		<Box bg='gray.50' minH='100vh'>
// 			{/* Header */}
// 			<Container maxW='container.xl' py={4}>
// 				<Flex align='center'>
// 					<Button
// 						variant='ghost'
// 						leftIcon={<FaArrowLeft />}
// 						onClick={() => navigate('/admin-setting')}
// 						size='sm'
// 					>
// 						Back
// 					</Button>
// 				</Flex>
// 			</Container>

// 			{/* Hero Section */}
// 			<Box bgGradient='linear(to-br, blue.50, white, purple.50)'>
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
// 						<Icon as={FaUserAlt} boxSize={8} color='blue.600' />
// 					</Box>
// 					<Heading size='2xl' mb={3}>
// 						Integration Guide
// 					</Heading>
// 					<Text color='gray.600' maxW='2xl' mx='auto'>
// 						Documentation and reference for connecting external services with
// 						our CRM.
// 					</Text>
// 				</Container>
// 			</Box>

// 			{/* Cards Grid */}
// 			<Container maxW='container.xl' py={10}>
// 				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
// 					{modules.map((module) => (
// 						<Box
// 							key={module.id}
// 							onClick={() => navigate(module.route)}
// 							bg={cardBg}
// 							borderRadius='2xl'
// 							overflow='hidden'
// 							cursor='pointer'
// 							boxShadow={`0 1px 3px ${shadowColor}`}
// 							transition='all 0.3s ease'
// 							_hover={{
// 								transform: 'translateY(-6px)',
// 								boxShadow: '0 20px 25px -12px rgba(0, 0, 0, 0.15)',
// 							}}
// 						>
// 							{/* Card Header with Gradient */}
// 							<Box h='4px' bgGradient={module.iconBg} />

// 							<Box p={6}>
// 								<Flex align='center' mb={4}>
// 									<Box
// 										w={14}
// 										h={14}
// 										bgGradient={module.iconBg}
// 										borderRadius='xl'
// 										display='flex'
// 										alignItems='center'
// 										justifyContent='center'
// 										mr={4}
// 									>
// 										<Icon as={module.icon} boxSize={7} color='white' />
// 									</Box>
// 									<Heading size='md'>{module.name}</Heading>
// 								</Flex>

// 								<Text color='gray.600' fontSize='sm' mb={4}>
// 									{module.description}
// 								</Text>

// 								{/* Guide Topics List */}
// 								<Box mt={4}>
// 									<Text
// 										fontSize='xs'
// 										fontWeight='semibold'
// 										color='gray.500'
// 										mb={2}
// 										textTransform='uppercase'
// 										letterSpacing='wide'
// 									>
// 										What's covered in this guide
// 									</Text>
// 									<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
// 										{module.guideTopics.map((topic, idx) => (
// 											<HStack key={idx} spacing={2}>
// 												<Box
// 													w={1.5}
// 													h={1.5}
// 													borderRadius='full'
// 													bgGradient={module.iconBg}
// 												/>
// 												<Text fontSize='xs' color='gray.600'>
// 													{topic}
// 												</Text>
// 											</HStack>
// 										))}
// 									</SimpleGrid>
// 								</Box>

// 								{/* View Guide Button */}
// 								<Button
// 									mt={6}
// 									w='100%'
// 									bgGradient={module.iconBg}
// 									color='white'
// 									_hover={{ opacity: 0.9 }}
// 									size='sm'
// 								>
// 									View Integration Guide
// 								</Button>
// 							</Box>
// 						</Box>
// 					))}
// 				</SimpleGrid>
// 			</Container>
// 		</Box>
// 	);
// };

// export default IntegrationsGuide;

import React from 'react';
import {
	Box,
	Container,
	Heading,
	Text,
	SimpleGrid,
	Flex,
	HStack,
	Icon,
	Button,
} from '@chakra-ui/react';
import {
	FaUserAlt,
	FaBuilding,
	FaArrowLeft,
	FaBookOpen,
	FaExternalLinkAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const IntegrationsGuide = () => {
	const navigate = useNavigate();

	const modules = [
		{
			id: 'leads',
			name: 'Leads Integration',
			description:
				'Learn how to connect your lead sources like Facebook Ads, Google Ads, Webhooks, and more to automatically capture lead data.',
			route: '/admin-setting/integrations/leads',
			icon: FaUserAlt,
			guideTopics: [
				'API Endpoint & Authentication',
				'Field Mapping Reference',
				'UTM Parameter Tracking',
				'Example Request Payload',
				'Best Practices',
			],
		},
		{
			id: 'listings',
			name: 'Listings Integration',
			description:
				'Learn how to sync property listings from various sources including property portals, CRM systems, and custom APIs.',
			route: '/admin-setting/integrations/listings',
			icon: FaBuilding,
			guideTopics: [
				'API Endpoint & Authentication',
				'Property Field Mapping',
				'Location & Contact Data',
				'Example Request Payload',
				'Best Practices',
			],
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
						onClick={() => navigate('/admin-setting')}
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
						<Icon as={FaBookOpen} boxSize={8} color='gold.primary' />
					</Box>
					<Heading size='2xl' mb={3} color='text.heading'>
						Integration Guide
					</Heading>
					<Text color='text.muted' maxW='2xl' mx='auto'>
						Documentation and reference for connecting external services with
						our CRM.
					</Text>
				</Container>
			</Box>

			{/* Cards Grid */}
			<Container maxW='container.xl' py={10}>
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
					{modules.map((module) => (
						<Box
							key={module.id}
							onClick={() => navigate(module.route)}
							bg='bg.surface'
							borderRadius='xl'
							overflow='hidden'
							cursor='pointer'
							boxShadow='card'
							transition='all 0.3s ease'
							border='1px solid'
							borderColor='border.default'
							_hover={{
								transform: 'translateY(-6px)',
								boxShadow: 'goldGlow',
								borderColor: 'gold.primary',
							}}
						>
							{/* Card Header with Gold Gradient */}
							<Box
								h='4px'
								bgGradient='linear-gradient(90deg, #D4AF37, #F5D67B, #D4AF37)'
							/>

							<Box p={6}>
								<Flex align='center' mb={4}>
									<Box
										w={14}
										h={14}
										bgGradient='linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)'
										borderRadius='lg'
										display='flex'
										alignItems='center'
										justifyContent='center'
										mr={4}
										boxShadow='sm'
									>
										<Icon as={module.icon} boxSize={7} color='#000000' />
									</Box>
									<Heading size='md' color='text.heading'>
										{module.name}
									</Heading>
								</Flex>

								<Text color='text.body' fontSize='sm' mb={4} lineHeight='1.6'>
									{module.description}
								</Text>

								{/* Guide Topics List */}
								<Box mt={4}>
									<Text
										fontSize='xs'
										fontWeight='semibold'
										color='text.accent'
										mb={2}
										textTransform='uppercase'
										letterSpacing='wide'
									>
										What's covered in this guide
									</Text>
									<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
										{module.guideTopics.map((topic, idx) => (
											<HStack key={idx} spacing={2}>
												<Box
													w={1.5}
													h={1.5}
													borderRadius='full'
													bg='gold.primary'
												/>
												<Text fontSize='xs' color='text.muted'>
													{topic}
												</Text>
											</HStack>
										))}
									</SimpleGrid>
								</Box>

								{/* View Guide Button */}
								<Button
									mt={6}
									w='100%'
									variant='brand'
									rightIcon={<FaExternalLinkAlt size='12px' />}
									size='sm'
									_hover={{ transform: 'translateY(-1px)' }}
									transition='all 0.2s'
								>
									View Integration Guide
								</Button>
							</Box>
						</Box>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default IntegrationsGuide;
