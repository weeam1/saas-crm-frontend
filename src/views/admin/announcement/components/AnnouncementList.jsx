import { Box, Text, Button, HStack, VStack } from '@chakra-ui/react';
import AnnouncementCard from './AnnouncementCard';
import useFetchUserHierarchy from 'hooks/useFetchUserHierarchy';
import Loader from 'components/loading/Loader';
import CardShimmer from 'components/loading/CardShimmer';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { buttonStyle } from 'utils/btn';
import { HiSpeakerphone } from 'react-icons/hi';

const AnnouncementList = ({
	list,
	loading,
	handleCopy,
	handleViewMore,
	totalPages,
	totalResults,
	currentPage,
}) => {
	const hideViewMoreBtn = currentPage === totalPages;

	const { allUsers } = useFetchUserHierarchy();

	return (
		<Box
			// border="1px solid"
			// borderColor="gray.100"
			backgroundColor='white'
			padding={6}
			marginTop={'-16px'}
			marginLeft={'-3px'}
		>
			{loading && list.length === 0 ? ( // Loading spinner when no data has been loaded yet
				<VStack gap='2' p='2'>
					<CardShimmer
						count={1}
						height='40px'
						width='20%'
						columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
					/>
					<CardShimmer
						count={5}
						height='120px'
						columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
					/>
				</VStack>
			) : list?.length > 0 ? (
				<Box>
					<HStack
						gap='1'
						color='gray.800'
						fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
						fontWeight='600'
						mb='4'
					>
						<HiSpeakerphone />
						<Text>Total Announcements</Text>
						<CountUpComponent targetNumber={totalResults} />
					</HStack>

					<Box height='70vh' p='2' overflowY='auto'>
						{list.map((item, index) => (
							<AnnouncementCard
								users={allUsers}
								key={index}
								item={item}
								handleCopy={handleCopy}
							/>
						))}

						{loading && list.length > 0 ? (
							// Show loading only if data is already available
							<Box display='flex' justifyContent='center' mt={2} py={2} mb={2}>
								<Loader />
							</Box>
						) : (
							!hideViewMoreBtn && (
								<Box
									display='flex'
									justifyContent='center'
									mt={4}
									py={2}
									mb={2}
								>
									{/* View More Button */}
									<Button
										{...buttonStyle}
										bg='brand.200'
										color='gray.800'
										_active={{ bg: 'brand.300' }}
										size='sm'
										shadow='md'
										px='8'
										py='4'
										onClick={handleViewMore}
										isDisabled={loading}
									>
										View More
									</Button>
								</Box>
							)
						)}
					</Box>
				</Box>
			) : (
				<Text color='gray.500' textAlign='center' padding='10'>
					No Announcements found!
				</Text>
			)}
		</Box>
	);
};

export default AnnouncementList;
