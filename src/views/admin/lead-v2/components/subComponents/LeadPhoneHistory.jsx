import {
	Box,
	Text,
	Button,
	Flex,
	Spinner,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Badge,
	Icon,
	SimpleGrid,
	Center,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useFetchItemsQuery } from 'api/apiSlice';
import {
	FiChevronDown,
	FiPhone,
	FiFileText,
	FiArrowRight,
} from 'react-icons/fi';
import { formatPostDate } from 'utils/helpers';

const LeadPhoneHistory = ({ isOpen, onClose, leadId }) => {
	const [page, setPage] = useState(1);
	const [history, setHistory] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const {
		data: phoneHistory,
		isLoading,
		isFetching,
	} = useFetchItemsQuery(
		{
			path: '/lead/phone_history',
			params: { leadId, page, limit: 2 },
		},
		{
			skip: !leadId,
			refetchOnMountOrArgChange: true,
		}
	);

	// Reset state when leadId changes
	useEffect(() => {
		if (leadId) {
			setHistory([]);
			setPage(1);
			setHasMore(true);
			setIsInitialLoad(true);
		}
	}, [leadId]);

	// Handle new data
	useEffect(() => {
		if (phoneHistory?.doc) {
			setHistory((prev) =>
				page === 1 ? phoneHistory.doc : [...prev, ...phoneHistory.doc]
			);
			setHasMore(phoneHistory?.results === 2);
			setIsInitialLoad(false);
		}
	}, [phoneHistory, page]);

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
	};

	// Smooth closing animation
	const handleClose = () => {
		setHistory([]);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size='xl' isCentered>
			<ModalOverlay />
			<ModalContent m='2'>
				{/* <ModalHeader>Lead Cycle</ModalHeader> */}
				<ModalHeader
					bg='brand.400'
					color='white'
					roundedTop='md'
					borderTop='1px solid'
					borderColor='brand.600'
					py={4}
				>
					<Flex align='center'>
						<Icon as={FiPhone} mr={3} boxSize={5} />
						<Text fontSize='xl' fontWeight='semibold'>
							Phone Number History
						</Text>
					</Flex>
				</ModalHeader>
				<ModalCloseButton color='white' _focus={{ outline: 'none' }} />

				<ModalBody p={2}>
					{isInitialLoad && isLoading ? (
						<Center minH='200px'>
							<Spinner
								size='xl'
								color='brand.500'
								thickness='4px'
								speed='0.65s'
							/>
						</Center>
					) : history.length === 0 ? (
						<Center minH='200px' flexDirection='column'>
							<Icon as={FiFileText} boxSize={8} color='gray.400' mb={3} />
							<Text color='gray.500'>No phone number history found</Text>
						</Center>
					) : (
						<Box>
							<SimpleGrid
								columns={1}
								spacing={3}
								p={4}
								overflowY='auto'
								maxH='60vh'
							>
								{history.map((item, index) => (
									<Box
										key={`${item._id}-${index}`}
										p={4}
										bg='white'
										borderRadius='lg'
										boxShadow='sm'
										borderLeft='4px solid'
										borderColor='brand.400'
										transition='all 0.2s'
										_hover={{
											transform: 'translateY(-2px)',
											boxShadow: 'md',
										}}
									>
										<Flex justify='space-between' mb={2}>
											<Text fontSize='xs' color='gray.500'>
												{formatPostDate(item.createdAt)}
												{/* {format(new Date(item.createdAt), 'MMM dd, hh:mm a')} */}
											</Text>
										</Flex>

										<Flex align='center' mb={2}>
											<Badge
												colorScheme='red'
												variant='subtle'
												mr={2}
												px={2}
												py={1}
												fontSize={{ base: 'xs', lg: 'md' }}
											>
												{item.oldPhoneNumber || 'N/A'}
											</Badge>
											<Icon as={FiArrowRight} color='gray.400' mx={2} />
											<Badge
												colorScheme='green'
												variant='subtle'
												px={2}
												py={1}
												fontSize={{ base: 'xs', lg: 'md' }}
											>
												{item.newPhoneNumber || 'N/A'}
											</Badge>
										</Flex>

										<Text fontSize='sm' color='gray.600'>
											Updated by: <strong>{item.updatedBy?.fullName}</strong>
										</Text>
									</Box>
								))}

								{/* Loading indicator for additional items */}
								{isFetching && !isInitialLoad && (
									<Center py={4}>
										<Spinner color='brand.500' />
									</Center>
								)}

								{/* Load more button */}
								{hasMore && !isFetching && (
									<Flex justify='center' pb={4}>
										<Button
											onClick={handleLoadMore}
											colorScheme='brand'
											variant='outline'
											size='sm'
											rightIcon={<FiChevronDown />}
											isLoading={isFetching}
										>
											Load More
										</Button>
									</Flex>
								)}
							</SimpleGrid>
						</Box>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default LeadPhoneHistory;
