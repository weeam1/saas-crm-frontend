import React from 'react';
import { Box, Text, Button, Spinner } from '@chakra-ui/react';
import AnnouncementCard from './AnnouncementCard';
import useFetchUserHierarchy from 'hooks/useFetchUserHierarchy';

const AnnouncementList = ({
	list,
	loading,
	handleCopy,
	handleViewMore,
	totalPages,
	currentPage,
}) => {
	const hideViewMoreBtn = currentPage === totalPages;

	const { allUsers } = useFetchUserHierarchy();

	return (
		<Box
			height='420px'
			overflowY='auto'
			// border="1px solid"
			// borderColor="gray.100"
			backgroundColor='white'
			padding={2}
			marginTop={"-1.1%"}
			marginLeft={"-0.2%"}
		>
			{loading && list.length === 0 ? ( // Loading spinner when no data has been loaded yet
				<Box
					display='flex'
					alignItems='center'
					justifyContent='center'
					height='full'
				>
					<Spinner color='brand.500' />
				</Box>
			) : list?.length > 0 ? (
				<Box>
					{list.map((item, index) => (
						<AnnouncementCard
							users={allUsers}
							key={index}
							item={item}
							handleCopy={handleCopy}
						/>
					))}
				</Box>
			) : (
				<Text color='gray.500' textAlign='center' padding='10'>
					No Announcements found!
				</Text>
			)}
			{loading && list.length > 0 ? ( // Show loading only if data is already available
				<Box display='flex' justifyContent='center' mt={2} py={2} mb={2}>
					<Spinner color='brand.500' />
				</Box>
			) : (
				!hideViewMoreBtn && (
					<Box display='flex' justifyContent='center' mt={4} py={2} mb={2}>
						{/* View More Button */}
						<Button
							color='brand.500' // Background color
							size='sm'
							onClick={handleViewMore}
							isDisabled={loading}
						>
							View More
						</Button>
					</Box>
				)
			)}
		</Box>
	);
};

export default AnnouncementList;
