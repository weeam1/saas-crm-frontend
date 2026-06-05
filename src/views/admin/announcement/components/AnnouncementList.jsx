import { Box, Text, Button, HStack, VStack, Flex, IconButton } from '@chakra-ui/react';
import AnnouncementCard from './AnnouncementCard';
import useFetchUserHierarchy from 'hooks/useFetchUserHierarchy';
import Loader from 'components/loading/Loader';
import CardShimmer from 'components/loading/CardShimmer';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import TopPagination from 'components/pagination/TopPagination';
import CustomTooltip from 'components/shared/CustomTooltip';
import { HiSpeakerphone } from 'react-icons/hi';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

const AnnouncementList = ({
	list,
	loading,
	handleCopy,
	handleViewMore,
	totalPages,
	totalResults,
	currentPage,
	pageSize,
	handlePageChange,
	handlePageSizeChange,
	refetch,
	isRefetching,
}) => {
	const colors = useModalColors();
	const { allUsers } = useFetchUserHierarchy();

	// Handle page change
	const onPageChange = (page) => {
		handlePageChange(page);
	};

	// Handle page size change
	const onPageSizeChange = (newSize) => {
		handlePageSizeChange(newSize);
	};

	// Handle refresh
	const handleRefresh = () => {
		refetch();
	};

	return (
		<Box
			bg={colors.bg}
			padding={6}
			marginTop={'-16px'}
			marginLeft={'-3px'}
			border="1px solid"
			borderColor={colors.borderColor}
			borderRadius="lg"
		>
			{loading && list.length === 0 ? (
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
					{/* Header with Total Announcements and Refresh Button */}
					<Flex
						justifyContent='space-between'
						alignItems='center'
						mb={4}
						flexWrap='wrap'
						gap={2}
					>
						<HStack
							gap='1'
							color={colors.headingText}
							fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
							fontWeight='600'
						>
							<HiSpeakerphone color={colors.accentGold} />
							<Text color={colors.headingText}>Total Announcements</Text>
							<CountUpComponent targetNumber={totalResults} />
						</HStack>

						<RefreshButton
	label='Refresh Announcements'
	onClick={handleRefresh}
	isLoading={loading || isRefetching}
	isFetching={isRefetching}
	size='sm'
/>
					</Flex>

					{/* Top Pagination */}
					{totalPages > 0 && (
						<Box mb={4}>
							<TopPagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={onPageChange}
								totalItems={totalResults}
								itemsPerPage={pageSize}
								handlePageSize={onPageSizeChange}
								refetching={isRefetching}
								loading={loading}
								pageLimit={true}
							/>
						</Box>
					)}

					{/* Announcements List */}
					<Box height='70vh' p='2' overflowY='auto'>
						{list.map((item, index) => (
							<AnnouncementCard
								users={allUsers}
								key={index}
								item={item}
								handleCopy={handleCopy}
							/>
						))}

						{/* Loading indicator for additional data while paginating */}
						{loading && list.length > 0 && (
							<Box display='flex' justifyContent='center' mt={2} py={2} mb={2}>
								<Loader />
							</Box>
						)}
					</Box>
				</Box>
			) : (
				<Text color={colors.mutedText} textAlign='center' padding='10'>
					No Announcements found!
				</Text>
			)}
		</Box>
	);
};

export default AnnouncementList;