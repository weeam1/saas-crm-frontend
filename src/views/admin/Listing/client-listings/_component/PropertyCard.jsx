import React, { useState } from 'react';
import {
	Box,
	Flex,
	Text,
	Badge,
	Icon,
	Image,
	HStack,
	useColorModeValue,
	Divider,
	Grid,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	FaRulerCombined,
	FaCalendarAlt,
	FaPhone,
	FaEnvelope,
	FaTag,
	FaHome,
	FaEye,
	FaUser,
	FaBuilding,
} from 'react-icons/fa';
import { MdMeetingRoom, MdLandscape, MdOutlineNumbers } from 'react-icons/md';
import { formatCurrency } from '../propertyUtils';
import { safeValue } from 'utils';
import CustomTooltip from 'components/shared/CustomTooltip';
import InfoItem from './InfoItem';
import { formatPostDate } from 'utils/helpers';
import ImageSlider from './ImageSlider';
import PropertyViewModal from './PropertyViewModal';
import { GiModernCity } from 'react-icons/gi';
import { FaBuildingShield } from 'react-icons/fa6';

const MotionBox = motion(Box);

const PropertyCard = ({ property }) => {
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const textColor = useColorModeValue('gray.600', 'gray.300');
	const hoverShadow = useColorModeValue('xl', 'dark-lg');

	const [isViewModalOpen, setIsViewModalOpen] = useState(false);

	return (
		<>
			<Box
				bg={cardBg}
				w='100%'
				// maxW='500px'
				borderRadius='xl'
				borderWidth='1px'
				borderColor={borderColor}
				overflow='hidden'
				position='relative'
				_hover={{ shadow: 'sm', background: 'gray.100' }}
			>
				{/* Listing number */}
				<Badge
					position='absolute'
					top='2'
					left='3'
					zIndex='1'
					bg='teal.100'
					color='teal.800'
					borderRadius='md'
					// px={1}
					py={1}
					fontSize='xs'
					fontWeight='bold'
					shadow='sm'
				>
					{property?.listingNumber}
				</Badge>

				<Badge
					position='absolute'
					top='2'
					right='3'
					zIndex='1'
					bg='purple.100'
					color='purple.600'
					borderRadius='md'
					px={2}
					py={1}
					fontSize='xs'
					fontWeight='bold'
					shadow='sm'
				>
					{property.listingType?.name}
				</Badge>

				<MotionBox role='group' position='relative'>
					{/* Image slider */}
					<ImageSlider
						images={property.images}
						projectName={property.projectName}
					/>

					{/* View action */}
					<Box
						as={Link}
						to={`/listing/client-listings/${property?._id}`}
						position='absolute'
						bottom='3'
						left='3'
						// zIndex='5'
						w='32px'
						h='32px'
						p={2}
						// onClick={() => setIsViewModalOpen(true)}
						display='flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='full'
						backdropFilter='blur(6px)'
						bg='blackAlpha.600'
						color='white'
						cursor='pointer'
						pointerEvents='none'
						_groupHover={{
							opacity: 1,
							pointerEvents: 'auto',
						}}
						initial={{ opacity: 0, y: -6 }}
						whileHover={{ scale: 1.1 }}
						transition={{ duration: 0.25, ease: 'easeOut' }}
					>
						<Icon as={FaEye} boxSize={4} />
					</Box>
				</MotionBox>

				{/* Card content */}
				<Box p={2}>
					{/* Property title and price */}
					<Flex justifyContent='space-between' alignItems='flex-start' mb={4}>
						<Text
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight='semibold'
							maxW='150px'
							isTruncated
							color={useColorModeValue('gray.800', 'white')}
						>
							{safeValue(property.projectName)}
						</Text>
						<Text
							fontSize='xl'
							fontWeight='bold'
							color={useColorModeValue('greenish.600', 'greenish.400')}
						>
							{formatCurrency(property.sellingPrice, property.currency)}
						</Text>
					</Flex>

					<HStack spacing={2}>
						{property.country?.flags && (
							<Box>
								<CustomTooltip label={property.country?.name}>
									<Box cursor='pointer'>
										<Image
											src={
												property?.country.flags?.svg ||
												property?.country.flags?.png
											}
											alt={property.country.name}
											w='24px'
											h='14px'
											objectFit='cover'
											borderRadius='sm'
										/>
									</Box>
								</CustomTooltip>
							</Box>
						)}
						<Text fontSize={'xs'} fontWeight='500' color='navy.500' isTruncated>
							{property.location || 'N/A'}
						</Text>
					</HStack>

					<InfoItem
						icon={FaBuildingShield}
						label='City'
						value={property?.city}
						color='blue.500'
					/>

					{/* <InfoItem
					icon={FaMapMarkerAlt}
					value={property.location}
					color='navy.500'
					maxW='300px'
					mb='2'
				/> */}

					{/* Property details */}
					<Grid templateColumns='repeat(2, 1fr)' gap={1} mb={2}>
						<InfoItem
							icon={MdOutlineNumbers}
							label='Unit'
							value={property.unitNumber}
							color='brand.500'
						/>

						<InfoItem
							icon={FaHome}
							label='Unit Type'
							value={property.unitType?.name}
							color='green.500'
						/>

						<InfoItem
							icon={MdLandscape}
							label='Sub Unit'
							value={property.subUnitType?.name}
							color='green.500'
						/>

						{/* <InfoItem
							icon={FaTag}
							label='Listing Type'
							value={property.listingType?.name}
							color='purple.500'
						/> */}

						<InfoItem
							icon={FaRulerCombined}
							label='Area'
							value={`${property.area} sq. ft`}
							color='orange.500'
						/>

						<InfoItem
							icon={FaCalendarAlt}
							label='Building Age'
							value={`${property?.buildingAge ? `${property?.buildingAge} Years` : 'N/A'}`}
							color='teal.500'
							maxW='140px'
						/>
						<InfoItem
							icon={GiModernCity}
							color='red.500'
							label='Developer'
							value={property.developer}
						/>
					</Grid>

					{/* Description */}
					{/* <Box mb={4}>
					<Text fontSize='sm' color={textColor} noOfLines={2}>
						{truncateText(property.description, 120)}
					</Text>
				</Box> */}

					<Divider mb={4} />

					{/* Landlord info */}
					<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={1}>
						<InfoItem
							icon={FaUser}
							label='Landlord'
							color='secondaryGray.900'
							value={property.landlordName}
						/>

						<InfoItem
							icon={FaPhone}
							label='Phone'
							color='secondaryGray.900'
							// value={formatPhoneNumber(property.landlordPhone)}
							value={property.landlordPhone}
							href={`tel:${property.landlordPhone}`}
						/>

						<InfoItem
							icon={FaEnvelope}
							label='Email'
							color='secondaryGray.900'
							value={property.email}
							href={`mailto:${property.email}`}
							maxW='100%'
						/>
					</Grid>

					{/* Created date */}
					<Flex justifyContent='flex-end'>
						<Text fontSize='xs' color={textColor}>
							Listed {formatPostDate(property.createdAt)}
						</Text>
					</Flex>
				</Box>
			</Box>

			{/*  Add the modal at the end of the component: */}
			{isViewModalOpen && (
				<PropertyViewModal
					isOpen={isViewModalOpen}
					onClose={() => setIsViewModalOpen(false)}
					property={property}
				/>
			)}
		</>
	);
};

export default PropertyCard;
