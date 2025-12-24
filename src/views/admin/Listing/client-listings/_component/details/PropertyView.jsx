import { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Text,
	Badge,
	Heading,
	Icon,
	Stack,
	HStack,
	VStack,
	Grid,
	GridItem,
	useColorModeValue,
	Image,
	IconButton,
	Tooltip,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FaBuilding,
	FaMapMarkerAlt,
	FaTag,
	FaRulerCombined,
	FaDollarSign,
	FaFlag,
	FaCalendarAlt,
	FaUserTie,
	FaPhone,
	FaEnvelope,
	FaHome,
	FaFileAlt,
	FaDownload,
	FaEye,
	FaClock,
} from 'react-icons/fa';
import {
	MdDescription,
	MdApartment,
	MdLandscape,
	MdDateRange,
	MdOutlineNumbers,
} from 'react-icons/md';
import { GiModernCity } from 'react-icons/gi';
import {
	formatCurrency,
	formatPhoneNumber,
	getDocumentIcon,
	formatFileSize,
	getDocumentUrl,
	getFileName,
	getStatusColor,
	getStatusText,
	formatDate,
} from '../../propertyUtils';

// Import react-icons dynamically
import * as FaIcons from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatPostDate } from 'utils/helpers';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from 'components/loading/Loader';

import ImageSlider from '../ImageSlider';
import { FiChevronLeft } from 'react-icons/fi';
import { checkFileExists } from 'utils/file';

const MotionBox = motion(Box);

// Document item component
const DocumentItem = ({ document, index }) => {
	const [copied, setCopied] = useState(false);
	const [viewing, setViewing] = useState(false);

	const fileName = getFileName(document);
	const documentUrl = getDocumentUrl(document);
	const fileExtension = fileName?.split('.').pop().toLowerCase();
	const IconComponent = FaIcons[getDocumentIcon(fileName)] || FaFileAlt;

	// const handleCopyLink = () => {
	// 	navigator.clipboard
	// 		.writeText(documentUrl)
	// 		.then(() => {
	// 			setCopied(true);
	// 			toast.success('Link copied!');
	// 			setTimeout(() => setCopied(false), 2000);
	// 		})
	// 		.catch(() => {
	// 			toast.error('Failed to copy');
	// 		});
	// };

	// const handleViewDocument = () => {
	// 	if (fileExtension === 'pdf') {
	// 		window.open(documentUrl, '_blank');
	// 	} else {
	// 		// For non-PDF files, download instead
	// 		handleDownload();
	// 	}
	// };

	const handleViewDocument = async () => {
		if (!documentUrl) {
			toast.error('Document URL is missing.');
			return;
		}

		const exists = await checkFileExists(documentUrl);

		if (!exists) {
			toast.error('Document not found or no longer available.');
			return;
		}

		if (fileExtension === 'pdf') {
			window.open(documentUrl, '_blank', 'noopener,noreferrer');
		} else {
			handleDownload(); // reuse logic
		}
	};

	const handleDownload = async () => {
		if (!documentUrl) {
			toast.error('Document URL is missing.');
			return;
		}

		const exists = await checkFileExists(documentUrl);

		if (!exists) {
			toast.error('Document not found or download failed.');
			return;
		}

		try {
			const link = document.createElement('a');
			link.href = documentUrl;
			link.download = fileName || 'document';
			link.rel = 'noopener';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success('Download started...');
		} catch {
			toast.error('Unable to start download.');
		}
	};

	// const handleDownload = () => {
	// 	const link = document.createElement('a');
	// 	link.href = f;
	// 	link.download = fileName;
	// 	document.body.appendChild(link);
	// 	link.click();
	// 	document.body.removeChild(link);

	// 	toast.success('Download started...');
	// };

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Box
				p={4}
				borderRadius='lg'
				borderWidth='1px'
				borderColor='gray.200'
				bg='white'
				_dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
				_hover={{
					transform: 'translateY(-2px)',
					boxShadow: 'md',
					borderColor: 'blue.200',
					_dark: { borderColor: 'blue.500' },
				}}
				transition='all 0.2s'
			>
				<Flex align='center' justify='space-between'>
					<HStack spacing={3} flex={1}>
						<Box
							p={2}
							borderRadius='md'
							bg={`${getDocumentColor(fileExtension)}.100`}
							color={`${getDocumentColor(fileExtension)}.600`}
							_dark={{
								bg: `${getDocumentColor(fileExtension)}.900`,
								color: `${getDocumentColor(fileExtension)}.200`,
							}}
						>
							<Icon as={IconComponent} boxSize={5} />
						</Box>
						<VStack align='start' spacing={1}>
							<Text
								fontWeight='medium'
								fontSize='sm'
								noOfLines={1}
								maxW='200px'
							>
								{fileName}
							</Text>
							<Text fontSize='xs' color='gray.500'>
								{fileExtension.toUpperCase()} • {formatFileSize(100000)}{' '}
								{/* Replace with actual size if available */}
							</Text>
						</VStack>
					</HStack>

					<HStack spacing={2}>
						<Tooltip label='View document'>
							<IconButton
								icon={<FaEye />}
								size='sm'
								colorScheme='blue'
								variant='ghost'
								onClick={handleViewDocument}
								aria-label='View document'
							/>
						</Tooltip>

						<Tooltip label='Download'>
							<IconButton
								icon={<FaDownload />}
								size='sm'
								colorScheme='green'
								variant='ghost'
								onClick={handleDownload}
								aria-label='Download document'
							/>
						</Tooltip>

						{/* <Tooltip label={copied ? 'Copied!' : 'Copy link'}>
							<IconButton
								icon={copied ? <FaCheck /> : <FaCopy />}
								size='sm'
								colorScheme={copied ? 'green' : 'gray'}
								variant='ghost'
								onClick={handleCopyLink}
								aria-label='Copy document link'
							/>
						</Tooltip> */}
					</HStack>
				</Flex>
			</Box>
		</motion.div>
	);
};

// Helper function for document color
const getDocumentColor = (extension) => {
	const colorMap = {
		pdf: 'red',
		doc: 'blue',
		docx: 'blue',
		xls: 'green',
		xlsx: 'green',
		ppt: 'orange',
		pptx: 'orange',
		jpg: 'purple',
		jpeg: 'purple',
		png: 'purple',
		default: 'gray',
	};
	return colorMap[extension] || colorMap.default;
};

// Main modal component
const PropertyView = () => {
	// const [active, setActive] = useState('overview');

	const { id: propertyId } = useParams();
	const navigate = useNavigate();

	// Color values for light/dark mode
	const modalBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const textSecondary = useColorModeValue('gray.600', 'gray.400');
	const cardBg = useColorModeValue('gray.50', 'gray.900');
	const accentColor = useColorModeValue('blue.500', 'blue.300');

	const { data, isLoading } = useFetchItemsQuery(
		{
			path: `/listing/clients/${propertyId}`,
		},
		{
			refetchOnFocus: true,
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: false,
		}
	);

	const property = data?.doc || null;

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: property?.projectName,
					text: `Check out this property: ${property?.projectName}`,
					url: window.location.href,
				});
			} catch (error) {
				console.log('Sharing cancelled', error);
			}
		} else {
			navigator.clipboard.writeText(window.location.href);
			toast.success('Link copied to clipboard');
		}
	};

	return (
		<Box>
			{isLoading ? (
				<Loader />
			) : (
				property && (
					<MotionBox
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ duration: 0.2 }}
						bg={modalBg}
						borderRadius='2xl'
						p={4}
					>
						<IconButton
							aria-label='Go back'
							icon={<FiChevronLeft />}
							onClick={() => navigate(-1)}
							size='md'
							isRound
							mb='2'
						/>

						{/* Header */}
						<Box
							bgGradient='linear(to-r, blue.500, purple.500)'
							color='white'
							p={6}
							borderRadius='2xl'
						>
							<Flex
								justify='space-between'
								flexDir={{ base: 'column', md: 'row' }}
								align={{ base: 'flex-start', md: 'center' }}
							>
								<VStack align='start' spacing={1}>
									<Heading size='md'>{property?.projectName}</Heading>
									<HStack spacing={2}>
										<Badge
											bg='teal.100'
											color='teal.800'
											fontSize='xs'
											px={3}
											py={1}
											borderRadius='full'
											opacity={0.9}
										>
											{property?.listingNumber}
										</Badge>
									</HStack>
								</VStack>

								<VStack spacing={2} alignSelf='flex-end' align='flex-end'>
									{/* <IconButton
										icon={<FaEdit />}
										aria-label='Edit'
										variant='ghost'
										color='white'
										_hover={{ bg: 'whiteAlpha.200' }}
									/> */}
									<HStack spacing={1}>
										<FaClock />
										<Text fontSize={{ base: 'xs', md: 'md' }}>
											Listed: {formatPostDate(property?.createdAt)}
										</Text>
									</HStack>
								</VStack>
							</Flex>
						</Box>

						<Grid
							templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
							gap={6}
							py={4}
						>
							{/* Image slider */}
							<ImageSlider
								images={property?.images}
								projectName={property?.projectName}
								sliderHeight='450px'
							/>
							{/* Right Column - Location & Contact */}
							<GridItem>
								<VStack spacing={6} align='stretch'>
									{/* Price Card */}
									<Box
										p={6}
										borderRadius='xl'
										bgGradient='linear(to-r, blue.50, purple.50)'
										_dark={{ bgGradient: 'linear(to-r, blue.900, purple.900)' }}
										border='1px solid'
										borderColor='blue.100'
										// _dark={{ borderColor: 'blue.800' }}
									>
										<HStack justify='space-between' mb={4}>
											<Text
												fontSize='sm'
												fontWeight='bold'
												color='blue.600'
												_dark={{ color: 'blue.200' }}
											>
												PRICE
											</Text>
											<Badge colorScheme='green' fontSize='xs'>
												{property?.listingType?.name}
											</Badge>
										</HStack>

										<HStack spacing={4} align='center'>
											{/* <Box
								p={3}
								borderRadius='lg'
								bg='white'
								_dark={{ bg: 'gray.800' }}
								boxShadow='sm'
							>
								<Icon as={FaDollarSign} boxSize={6} color='green.500' />
							</Box> */}
											<VStack align='start' spacing={1}>
												<Heading
													size='lg'
													color='gray.800'
													_dark={{ color: 'white' }}
												>
													{formatCurrency(
														property?.sellingPrice,
														property?.currency
													)}
												</Heading>
												<Text fontSize='sm' color={textSecondary}>
													{property?.currency?.raw?.name ||
														property?.currency?.value}
												</Text>
											</VStack>
										</HStack>
									</Box>

									{/* Contact Card */}
									<Box
										p={6}
										borderRadius='xl'
										bg={cardBg}
										border='1px solid'
										borderColor='gray.200'
										_dark={{ borderColor: 'gray.700' }}
									>
										<HStack mb={6}>
											<Icon as={FaUserTie} color='blue.500' boxSize={5} />
											<Heading
												size='md'
												color='gray.700'
												_dark={{ color: 'white' }}
											>
												Landlord Contact
											</Heading>
										</HStack>

										<VStack spacing={4} align='stretch'>
											<ContactItem
												icon={FaUserTie}
												label='Name'
												value={property?.landlordName}
											/>
											<ContactItem
												icon={FaPhone}
												label='Phone'
												value={formatPhoneNumber(property?.landlordPhone)}
											/>
											<ContactItem
												icon={FaEnvelope}
												label='Email'
												value={property?.email}
											/>
										</VStack>
									</Box>
								</VStack>
							</GridItem>
							{/* Content Area */}
							<GridItem>
								{/* Property Details */}
								<Box
									p={6}
									borderRadius='xl'
									bg={cardBg}
									border='1px solid'
									borderColor='gray.200'
									_dark={{ borderColor: 'gray.700' }}
								>
									<Heading
										size='md'
										mb={4}
										color='gray.700'
										_dark={{ color: 'white' }}
									>
										Property Details
									</Heading>

									<Grid templateColumns='repeat(2, 1fr)' gap={6}>
										<DetailItem
											icon={MdOutlineNumbers}
											label='Unit'
											value={property?.unitNumber}
											color='brand'
										/>
										<DetailItem
											icon={FaHome}
											label='Unit Type'
											value={property?.unitType?.name}
											color='blue'
										/>
										<DetailItem
											icon={MdLandscape}
											label='Sub Unit Type'
											value={property?.subUnitType?.name}
											color='green'
										/>
										<DetailItem
											icon={FaRulerCombined}
											label='Area'
											value={`${property?.area} sq. ft`}
											color='orange'
										/>
										<DetailItem
											icon={FaCalendarAlt}
											label='Building Age'
											value={`${property?.buildingAge ? `${property?.buildingAge} Years` : 'N/A'}`}
											color='purple'
										/>
										<DetailItem
											icon={GiModernCity}
											label='Developer'
											value={property?.developer}
											color='teal'
										/>
										<DetailItem
											icon={MdApartment}
											label='Property Type'
											value={property?.listingType?.name}
											color='red'
										/>
									</Grid>
								</Box>
							</GridItem>

							<GridItem>
								{/* Location Card */}
								<Box
									p={6}
									borderRadius='xl'
									bg={cardBg}
									border='1px solid'
									borderColor='gray.200'
									_dark={{ borderColor: 'gray.700' }}
								>
									<HStack mb={4}>
										<Icon as={FaMapMarkerAlt} color='red.500' boxSize={5} />
										<Heading
											size='md'
											color='gray.700'
											_dark={{ color: 'white' }}
										>
											Location
										</Heading>
									</HStack>

									<VStack spacing={3} align='start'>
										<Text
											fontSize={{ base: 'sm', md: 'md' }}
											fontWeight='medium'
										>
											{property?.location}
										</Text>

										{property?.country && (
											<HStack
												spacing={3}
												p={3}
												bg='white'
												_dark={{ bg: 'gray.800' }}
												borderRadius='lg'
												w='full'
											>
												{property?.country.flags && (
													<Image
														src={
															property?.country.flags?.svg ||
															property?.country.flags?.png
														}
														alt={property?.country.name}
														// boxSize='30px'
														w='30px'
														h='20px'
														objectFit='cover'
														borderRadius='sm'
													/>
												)}
												<VStack align='start' spacing={0}>
													<Text fontSize='sm' fontWeight='medium'>
														{property?.country.name}
													</Text>
													{/* <Text fontSize='xs' color={textSecondary}>
											{property?.country.code}
										</Text> */}
												</VStack>
											</HStack>
										)}
									</VStack>
								</Box>
							</GridItem>

							{/* Description Card */}
							<GridItem>
								<Box
									p={6}
									borderRadius='xl'
									bg={cardBg}
									border='1px solid'
									borderColor='gray.200'
									_dark={{ borderColor: 'gray.700' }}
								>
									<HStack mb={4}>
										<Heading
											size='md'
											color='gray.700'
											_dark={{ color: 'white' }}
										>
											Description
										</Heading>
									</HStack>

									<Box
										p={4}
										bg='white'
										_dark={{ bg: 'gray.800' }}
										borderRadius='lg'
										border='1px solid'
										borderColor='gray.200'
									>
										<Text
											color='gray.700'
											lineHeight={2}
											fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
											fontWeight='semibold'
											whiteSpace='pre-wrap'
										>
											{property.description || 'No description provided.'}
										</Text>
									</Box>
								</Box>
							</GridItem>

							{/* Document Details */}
							<GridItem>
								<Documents property={property} />
							</GridItem>

							{/* <Overview property={property} /> */}
						</Grid>
					</MotionBox>
				)
			)}
		</Box>
	);
};

//  Components
const Overview = ({ property }) => {
	const textSecondary = useColorModeValue('gray.600', 'gray.400');
	const cardBg = useColorModeValue('gray.50', 'gray.900');

	return (
		<Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} py={4}>
			{/* Left Column - Main Info */}
			<GridItem>
				<VStack spacing={6} align='stretch'>
					{/* Price Card */}
					<Box
						p={6}
						borderRadius='xl'
						bgGradient='linear(to-r, blue.50, purple.50)'
						_dark={{ bgGradient: 'linear(to-r, blue.900, purple.900)' }}
						border='1px solid'
						borderColor='blue.100'
						// _dark={{ borderColor: 'blue.800' }}
					>
						<HStack justify='space-between' mb={4}>
							<Text
								fontSize='sm'
								fontWeight='bold'
								color='blue.600'
								_dark={{ color: 'blue.200' }}
							>
								PRICE
							</Text>
							<Badge colorScheme='green' fontSize='xs'>
								{property?.listingType?.name}
							</Badge>
						</HStack>

						<HStack spacing={4} align='center'>
							{/* <Box
								p={3}
								borderRadius='lg'
								bg='white'
								_dark={{ bg: 'gray.800' }}
								boxShadow='sm'
							>
								<Icon as={FaDollarSign} boxSize={6} color='green.500' />
							</Box> */}
							<VStack align='start' spacing={1}>
								<Heading size='lg' color='gray.800' _dark={{ color: 'white' }}>
									{formatCurrency(property?.sellingPrice, property?.currency)}
								</Heading>
								<Text fontSize='xs' color={textSecondary}>
									{property?.currency?.raw?.name || property?.currency?.value}
								</Text>
							</VStack>
						</HStack>
					</Box>

					{/* Property Details */}
					<Box
						p={6}
						borderRadius='xl'
						bg={cardBg}
						border='1px solid'
						borderColor='gray.200'
						_dark={{ borderColor: 'gray.700' }}
					>
						<Heading
							size='md'
							mb={4}
							color='gray.700'
							_dark={{ color: 'white' }}
						>
							Property Details
						</Heading>

						<Grid templateColumns='repeat(2, 1fr)' gap={4}>
							<DetailItem
								icon={FaHome}
								label='Unit Type'
								value={property?.unitType?.name}
								color='blue'
							/>
							<DetailItem
								icon={MdLandscape}
								label='Sub Unit Type'
								value={property?.subUnitType?.name}
								color='green'
							/>
							<DetailItem
								icon={FaRulerCombined}
								label='Area'
								value={`${property?.area} sq. ft`}
								color='orange'
							/>
							<DetailItem
								icon={FaCalendarAlt}
								label='Building Age'
								value={property?.buildingAge}
								color='purple'
							/>
							<DetailItem
								icon={GiModernCity}
								label='Developer'
								value={property?.developer}
								color='teal'
							/>
							<DetailItem
								icon={MdApartment}
								label='Property Type'
								value={property?.listingType?.name}
								color='red'
							/>
						</Grid>
					</Box>
				</VStack>
			</GridItem>

			{/* Right Column - Location & Contact */}
			<GridItem>
				<VStack spacing={6} align='stretch'>
					{/* Location Card */}
					<Box
						p={6}
						borderRadius='xl'
						bg={cardBg}
						border='1px solid'
						borderColor='gray.200'
						_dark={{ borderColor: 'gray.700' }}
					>
						<HStack mb={4}>
							<Icon as={FaMapMarkerAlt} color='red.500' boxSize={5} />
							<Heading size='md' color='gray.700' _dark={{ color: 'white' }}>
								Location
							</Heading>
						</HStack>

						<VStack spacing={3} align='start'>
							<Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='medium'>
								{property?.location}
							</Text>

							{property?.country && (
								<HStack
									spacing={3}
									p={3}
									bg='white'
									_dark={{ bg: 'gray.800' }}
									borderRadius='lg'
									w='full'
								>
									{property?.country.flags && (
										<Image
											src={
												property?.country.flags?.svg ||
												property?.country.flags?.png
											}
											alt={property?.country.name}
											// boxSize='30px'
											w='30px'
											h='20px'
											objectFit='cover'
											borderRadius='sm'
										/>
									)}
									<VStack align='start' spacing={0}>
										<Text fontSize='sm' fontWeight='medium'>
											{property?.country.name}
										</Text>
										{/* <Text fontSize='xs' color={textSecondary}>
											{property?.country.code}
										</Text> */}
									</VStack>
								</HStack>
							)}
						</VStack>
					</Box>

					{/* Contact Card */}
					<Box
						p={6}
						borderRadius='xl'
						bg={cardBg}
						border='1px solid'
						borderColor='gray.200'
						_dark={{ borderColor: 'gray.700' }}
					>
						<HStack mb={4}>
							<Icon as={FaUserTie} color='blue.500' boxSize={5} />
							<Heading size='md' color='gray.700' _dark={{ color: 'white' }}>
								Landlord Contact
							</Heading>
						</HStack>

						<VStack spacing={4} align='stretch'>
							<ContactItem
								icon={FaUserTie}
								label='Name'
								value={property?.landlordName}
							/>
							<ContactItem
								icon={FaPhone}
								label='Phone'
								value={formatPhoneNumber(property?.landlordPhone)}
							/>
							<ContactItem
								icon={FaEnvelope}
								label='Email'
								value={property?.email}
							/>
						</VStack>
					</Box>
				</VStack>
			</GridItem>
		</Grid>
	);
};

const Details = ({ property }) => {
	const textSecondary = useColorModeValue('gray.600', 'gray.400');
	const cardBg = useColorModeValue('gray.50', 'gray.900');

	return (
		<VStack spacing={6} align='stretch'>
			{/* Description Card */}
			<Box
				p={6}
				borderRadius='xl'
				bg={cardBg}
				border='1px solid'
				borderColor='gray.200'
				_dark={{ borderColor: 'gray.700' }}
			>
				<HStack mb={4}>
					<Icon as={MdDescription} color='blue.500' boxSize={5} />
					<Heading size='md' color='gray.700' _dark={{ color: 'white' }}>
						Description
					</Heading>
				</HStack>

				<Box
					p={4}
					bg='white'
					_dark={{ bg: 'gray.800' }}
					borderRadius='lg'
					border='1px solid'
					borderColor='gray.200'
					// _dark={{ borderColor: 'gray.700' }}
				>
					<Text color='gray.700' _dark={{ color: 'gray.300' }}>
						{property?.description || 'No description provided.'}
					</Text>
				</Box>
			</Box>

			{/* Additional Information */}
			<Grid
				templateColumns={{
					base: '1fr',
					md: 'repeat(2, 1fr)',
					lg: 'repeat(3, 1fr)',
				}}
				gap={6}
			>
				<InfoCard
					title='Listing Info'
					icon={FaTag}
					items={[
						{ label: 'Listing Number', value: property?.listingNumber },
						{ label: 'Status', value: getStatusText(property?.status) },
						{ label: 'Created', value: formatDate(property?.createdAt) },
						{ label: 'Updated', value: formatDate(property?.updatedAt) },
					]}
					color='purple'
				/>

				<InfoCard
					title='Property Info'
					icon={FaBuilding}
					items={[
						{ label: 'Unit Type', value: property?.unitType?.name },
						{ label: 'Sub Unit Type', value: property?.subUnitType?.name },
						{ label: 'Listing Type', value: property?.listingType?.name },
						{ label: 'Building Age', value: property?.buildingAge },
					]}
					color='green'
				/>

				<InfoCard
					title='Financial Info'
					icon={FaDollarSign}
					items={[
						{
							label: 'Price',
							value: formatCurrency(property?.sellingPrice, property?.currency),
						},
						{ label: 'Currency', value: property?.currency?.raw?.name },
						{ label: 'Area', value: `${property?.area} sq. ft` },
						{
							label: 'Price per sq. ft',
							value: `${(property?.sellingPrice / property?.area).toFixed(2)}`,
						},
					]}
					color='blue'
				/>
			</Grid>
		</VStack>
	);
};

const Documents = ({ property }) => {
	const textSecondary = useColorModeValue('gray.600', 'gray.400');
	const cardBg = useColorModeValue('gray.50', 'gray.900');

	if (!property?.documents || property?.documents.length === 0) {
		return (
			<Box textAlign='center' py={10}>
				<Icon as={FaFileAlt} boxSize={16} color='gray.300' mb={4} />
				<Heading size='md' color='gray.500' mb={2}>
					No Documents Available
				</Heading>
				<Text color={textSecondary}>
					No documents have been uploaded for this property yet.
				</Text>
			</Box>
		);
	}

	return (
		<VStack spacing={6} align='stretch'>
			{/* Document Statistics */}
			{/* <Box
				p={6}
				borderRadius='xl'
				bg={cardBg}
				border='1px solid'
				borderColor='gray.200'
				_dark={{ borderColor: 'gray.700' }}
			>
				<HStack justify='space-between' mb={4}>
					<Heading size='md' color='gray.700' _dark={{ color: 'white' }}>
						Documents ({property?.documents.length})
					</Heading>
			
				</HStack>

				<Grid templateColumns='repeat(4, 1fr)' gap={4} mb={6}>
					<StatCard
						label='Total Files'
						value={property?.documents.length}
						icon={FaFileAlt}
						color='blue'
					/>
					<StatCard
						label='PDF Files'
						value={property?.documents.filter((d) => d.endsWith('.pdf')).length}
						icon={FaFilePdf}
						color='red'
					/>
					<StatCard
						label='Image Files'
						value={
							property?.documents.filter((d) =>
								['.jpg', '.jpeg', '.png'].some((ext) => d.endsWith(ext))
							).length
						}
						icon={FaFileImage}
						color='purple'
					/>
					<StatCard
						label='Other Files'
						value={
							property?.documents.filter(
								(d) =>
									!d.endsWith('.pdf') &&
									!['.jpg', '.jpeg', '.png'].some((ext) => d.endsWith(ext))
							).length
						}
						icon={FaFileArchive}
						color='green'
					/>
				</Grid>
			</Box> */}

			{/* Document List */}
			<VStack spacing={4} align='stretch'>
				<HStack justify='space-between' align='center'>
					<Heading size='sm' color='gray.700' _dark={{ color: 'white' }}>
						All Documents
					</Heading>
					{/* <Button
						size='sm'
						colorScheme='blue'
						variant='outline'
						leftIcon={<FaDownload />}
						onClick={() => {
							// Implement bulk download
							console.log('Bulk download');
						}}
					>
						Download All
					</Button> */}
				</HStack>

				{property?.documents.map((doc, index) => (
					<DocumentItem key={index} document={doc} index={index} />
				))}
			</VStack>
		</VStack>
	);
};

// Reusable Components
const DetailItem = ({ icon, label, value, color }) => {
	const textSecondary = useColorModeValue('gray.600', 'gray.400');

	return (
		<HStack spacing={3}>
			<Box
				p={2}
				borderRadius='md'
				bg={`${color}.100`}
				color={`${color}.600`}
				_dark={{ bg: `${color}.900`, color: `${color}.200` }}
			>
				<Icon as={icon} boxSize={4} />
			</Box>
			<VStack align='start' spacing={0}>
				<Text fontSize='xs' color={textSecondary}>
					{label}
				</Text>
				<Text fontSize='sm' fontWeight='medium' textTransform='capitalize'>
					{value || 'N/A'}
				</Text>
			</VStack>
		</HStack>
	);
};

const ContactItem = ({ icon, label, value }) => {
	const textSecondary = useColorModeValue('gray.600', 'gray.400');

	return (
		<HStack spacing={3}>
			<Icon
				as={icon}
				color='gray.400'
				boxSize={4}
				transform={icon === FaPhone ? 'scaleX(-1)' : undefined}
			/>
			<VStack align='start' spacing={0} flex={1}>
				<Text fontSize='xs' color={textSecondary}>
					{label}
				</Text>
				<Text fontSize='sm' fontWeight='medium' noOfLines={1}>
					{value || 'N/A'}
				</Text>
			</VStack>
		</HStack>
	);
};

const InfoCard = ({ title, icon, items, color }) => {
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const textSecondary = useColorModeValue('gray.600', 'gray.400');

	return (
		<Box
			p={4}
			borderRadius='lg'
			bg={cardBg}
			border='1px solid'
			borderColor={borderColor}
		>
			<HStack mb={3}>
				<Icon as={icon} color={`${color}.500`} boxSize={5} />
				<Heading size='sm' color='gray.700' _dark={{ color: 'white' }}>
					{title}
				</Heading>
			</HStack>

			<VStack spacing={2} align='stretch'>
				{items.map((item, index) => (
					<HStack key={index} justify='space-between' py={1}>
						<Text fontSize='sm' color={textSecondary}>
							{item.label}:
						</Text>
						<Text fontSize='sm' fontWeight='medium' textAlign='right'>
							{item.value || 'N/A'}
						</Text>
					</HStack>
				))}
			</VStack>
		</Box>
	);
};

const StatCard = ({ label, value, icon, color }) => {
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	return (
		<Box
			p={4}
			borderRadius='lg'
			bg={cardBg}
			border='1px solid'
			borderColor={borderColor}
			textAlign='center'
		>
			<Icon as={icon} boxSize={6} color={`${color}.500`} mb={2} />
			<Text
				fontSize='2xl'
				fontWeight='bold'
				color='gray.800'
				_dark={{ color: 'white' }}
			>
				{value}
			</Text>
			<Text fontSize='xs' color='gray.500'>
				{label}
			</Text>
		</Box>
	);
};

export default PropertyView;
