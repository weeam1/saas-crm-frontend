import React, { useEffect } from 'react';
import {
	Box,
	FormControl,
	FormLabel,
	Input,
	Grid,
	GridItem,
	Skeleton,
	Alert,
	AlertIcon,
	Text,
	Flex,
	Textarea,
	useBreakpointValue,
} from '@chakra-ui/react';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import { constant } from 'constant';
import { toast } from 'react-toastify';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const ViewListing = () => {
	const colors = useModalColors();
	const { id } = useParams();
	const navigate = useNavigate();

	const { user, isSuperAdmin } = useUserSession();

	const { createUserLog } = useUserActivityLog();
	const { hasPermission } = usePermissions();

	const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

	const {
		data: listing,
		isLoading,
		isError,
		isFetching,
	} = useFetchItemsQuery(
		{
			path: `listing/secondary/${id}/${hasPermission('listing', 'read:any') ? true : false}`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		if (listing?.data) {
			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Listing',
				entityType: 'SecondaryListing',
				entityId: listing.data._id,
				status: 'success',
				message: `${user?.fullName} viewed listing "${listing.data.projectName || 'Untitled'}".`,
			});
		}
		if (!listing?.data && !isLoading && !isFetching && isError) {
			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Listing',
				entityType: 'SecondaryListing',
				entityId: id,
				status: 'error',
				message: `${user?.fullName} attempted to view listing, but it was not found.`,
			});
		}
	}, [listing]);

	if (isLoading || isFetching) {
		return (
			<Box p={5}>
				<Skeleton height='40px' mb={4} />
				<Grid templateColumns='repeat(2, 1fr)' gap={6}>
					{Array.from({ length: 12 }).map((_, i) => (
						<GridItem key={i} colSpan={i % 3 === 0 ? 2 : colSpan}>
							<Skeleton height='40px' />
						</GridItem>
					))}
				</Grid>
			</Box>
		);
	}

	if (isError) {
		return (
			<Box p={5}>
				<AppButton
					leftIcon={<IoArrowBack />}
					onClick={() => navigate('/listing')}
				>
					Back to Listings
				</AppButton>
				<Alert status='error' mt={4} bg={colors.badgeErrorBg} color={colors.badgeErrorText}>
					<AlertIcon color={colors.badgeErrorText} />
					You are not authorized to view this listing
				</Alert>
			</Box>
		);
	}

	if (!listing?.data) {
		return (
			<Box p={5}>
				<AppButton
					leftIcon={<IoArrowBack />}
					onClick={() => navigate('/listing')}
				>
					Back to Listings
				</AppButton>
				<Alert status='info' mt={4} bg={colors.badgeInfoBg} color={colors.badgeInfoText}>
					<AlertIcon color={colors.badgeInfoText} />
					Listing not found.
				</Alert>
			</Box>
		);
	}

	const handleDownloadDocument = async (file) => {
		try {
			if (!file) {
				toast.error('No file specified for download.');
				return;
			}

			const fileURL = `${constant.baseUrl}fetch-files`;

			const response = await fetch(fileURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ file }),
			});

			if (!response.ok) {
				toast.error('File not found or failed to download.');
				return;
			}

			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;

			const decodedName = decodeURIComponent(file.split('/').pop());
			link.download = decodedName;

			document.body.appendChild(link);
			link.click();
			link.remove();

			window.URL.revokeObjectURL(downloadUrl);
			toast.success('File downloaded successfully.');
		} catch (error) {
			console.error('Download error:', error);
			toast.error('Failed to download the file.');
		}
	};

	return (
		<Box>
			<AppButton
				ml='2'
				leftIcon={<IoArrowBack />}
				onClick={() => navigate(-1)}
				mb={4}
			>
				Back
			</AppButton>

			<Grid
				templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
				gap={6}
				p={{ base: 2, sm: 5 }}
				bg={colors.bg}
				borderRadius='lg'
				boxShadow={colors.cardShadow}
				my={5}
				mx={{ base: 0, sm: 2 }}
				border='1px solid'
				borderColor={colors.borderColor}
			>
				{/* Project Name */}
				<GridItem colSpan={2}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Project Name</FormLabel>
						<Input
							value={listing.data?.projectName || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Unit Type */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Unit Type</FormLabel>
						<Input
							value={listing.data?.unitType?.name || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Unit Sub Type */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Unit Sub Type</FormLabel>
						<Input
							value={listing.data?.subUnitType?.name || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Listing Type */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Listing Type</FormLabel>
						<Input
							value={listing.data?.listingType?.name || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Developer */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Developer</FormLabel>
						<Input
							value={listing.data?.developer || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Area */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Area (sqft)</FormLabel>
						<Input
							value={listing.data?.area ? `${listing.data.area} sqft` : 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Price */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Price</FormLabel>
						<Input
							value={
								listing.data?.price
									? `${listing.data.price} ${listing.data.currency || 'AED'}`
									: 'N/A'
							}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Location */}
				<GridItem colSpan={1}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Location</FormLabel>
						<Input
							value={listing.data?.location || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Country */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Country</FormLabel>
						<Input
							value={listing.data?.country?.name || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Building Age */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Building Age</FormLabel>
						<Input
							value={
								listing.data?.buildingAge
									? `${listing.data.buildingAge} years`
									: 'N/A'
							}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Owner Name */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Owner name</FormLabel>
						<Input
							value={listing.data?.ownerName || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Owner Phone Number */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Owner Phone Number</FormLabel>
						<Input
							value={listing.data?.ownerPhoneNumber || 'N/A'}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{isSuperAdmin && (
					<>
						{/* Landlord */}
						<GridItem colSpan={colSpan}>
							<FormControl>
								<FormLabel fontWeight='bold' color={colors.labelColor}>Landlord</FormLabel>
								<Input
									value={listing.data?.landlord || 'N/A'}
									readOnly
									variant='filled'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
								/>
							</FormControl>
						</GridItem>

						{/* Phone Number */}
						<GridItem colSpan={colSpan}>
							<FormControl>
								<FormLabel fontWeight='bold' color={colors.labelColor}>Phone Number</FormLabel>
								<Input
									value={listing.data?.phoneNumber || 'N/A'}
									readOnly
									variant='filled'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
								/>
							</FormControl>
						</GridItem>

						{/* Email */}
						<GridItem colSpan={colSpan}>
							<FormControl>
								<FormLabel fontWeight='bold' color={colors.labelColor}>Email</FormLabel>
								<Input
									value={listing.data?.email || 'N/A'}
									readOnly
									variant='filled'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
								/>
							</FormControl>
						</GridItem>
					</>
				)}

				{/* Broker Commission Type */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Broker Commission Type</FormLabel>
						<Input
							value={
								listing.data?.brokerCommissionType === 'AED'
									? 'By AED'
									: listing.data?.brokerCommissionType === 'PERCENT'
										? 'By Percentage'
										: 'N/A'
							}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Commission Value */}
				<GridItem colSpan={colSpan}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Commission Value</FormLabel>
						<Input
							value={
								listing.data?.brokerCommissionValue
									? `${listing.data.brokerCommissionValue}${listing.data?.brokerCommissionType === '%' ? ' %' : listing.data?.brokerCommissionType === 'AED' ? ' AED' : ''}`
									: 'N/A'
							}
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Description */}
				<GridItem colSpan={2}>
					<FormControl>
						<FormLabel fontWeight='bold' color={colors.labelColor}>Description</FormLabel>
						<Textarea
							name='description'
							value={listing.data?.description}
							placeholder='Enter description'
							height='150px'
							resize='vertical'
							readOnly
							variant='filled'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
						/>
					</FormControl>
				</GridItem>

				{/* Documents */}
				<GridItem colSpan={2}>
					<FormLabel fontWeight='bold' color={colors.labelColor}>Documents</FormLabel>
					{listing.data?.documents?.length > 0 ? (
						<Box mt={2}>
							{listing.data.documents.map((doc, index) => {
								const fileName = doc.split('/').pop();
								return (
									<Flex
										key={index}
										justify='space-between'
										p={3}
										mb={2}
										bg={colors.bgInput}
										borderRadius='md'
										flexDir={{ base: 'column', sm: 'column', md: 'row' }}
										gap={{ base: '4', sm: '4', md: '0' }}
										border='1px solid'
										borderColor={colors.borderColor}
									>
										<Text color={colors.bodyText}>{fileName}</Text>
										<AppButton size='sm' onClick={() => handleDownloadDocument(doc)}>
											Download
										</AppButton>
									</Flex>
								);
							})}
						</Box>
					) : (
						<Text color={colors.mutedText}>No documents available</Text>
					)}
				</GridItem>
			</Grid>
		</Box>
	);
};

export default ViewListing;