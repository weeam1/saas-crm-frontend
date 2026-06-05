import {
	Grid,
	Box,
	Text,
	Button,
	Skeleton,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaSync } from 'react-icons/fa';
import PropertyCard from './PropertyCard';
import { useEffect, useState } from 'react';

const MotionGrid = motion(Grid);

const PropertyListingsGrid = ({
	data,
	isLoading,
	isFetching,
	isError,
	error,
	refetch,
	queryParams,
}) => {
	const containerBg = useColorModeValue('gray.50', 'gray.900');
	const [showSkeleton, setShowSkeleton] = useState(true);

	useEffect(() => {
		if (isLoading || isFetching) {
			setShowSkeleton(true);
			return;
		}

		const timer = setTimeout(() => {
			setShowSkeleton(false);
		}, 1000); // 1s minimum

		return () => clearTimeout(timer);
	}, [isLoading, isFetching]);

	if (showSkeleton) {
		return (
			<Grid templateColumns='repeat(auto-fill, minmax(300px, 1fr))' gap={2}>
				{[...Array(queryParams?.limit || 10)].map((_, i) => (
					<Skeleton key={i} height='500px' borderRadius='xl' />
				))}
			</Grid>
		);
	}

	if (isError) {
		return (
			<Alert status='error' borderRadius='lg'>
				<AlertIcon />
				<AlertTitle>Error loading properties!</AlertTitle>
				<AlertDescription>
					{error?.data?.message || 'Please try again later.'}
				</AlertDescription>
				<Button
					ml='auto'
					size='sm'
					leftIcon={<FaSync />}
					onClick={() => refetch()}
				>
					Retry
				</Button>
			</Alert>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Box textAlign='center' py={10} px={6}>
				<Text fontSize='xl' color='gray.500'>
					No properties found
				</Text>
				<Text color='gray.400' mt={2}>
					Try adjusting your filters or check back later
				</Text>
			</Box>
		);
	}

	return (
		<Box minH='60vh'>
			{/* Property Grid */}
			<MotionGrid
				templateColumns='repeat(auto-fill, minmax(320px, 1fr))'
				gap={2}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}

			>
				{data?.map((property) => (
					<PropertyCard key={property._id} property={property} />
				))}
			</MotionGrid>
		</Box>
	);
};

export default PropertyListingsGrid;
