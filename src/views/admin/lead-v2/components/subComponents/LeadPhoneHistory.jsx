import {
	Box,
	Text,
	Flex,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Badge,
	VStack,
	Icon,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import CardShimmer from 'components/loading/CardShimmer';
import NoData from 'components/Message/NoData';
import { FiArrowRight } from 'react-icons/fi';
import { formatPostDate } from 'utils/helpers';

const LeadPhoneHistory = ({ isOpen, onClose, leadId }) => {
	const { data: phoneHistory, isLoading } = useFetchItemsQuery(
		{
			path: '/lead/phone_history',
			params: { leadId },
		},
		{
			skip: !leadId,
			refetchOnMountOrArgChange: true,
		}
	);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='xl' isCentered>
			<ModalOverlay />
			<ModalContent m='2'>
				<ModalHeader>Phone Number History</ModalHeader>
				<ModalCloseButton _focus={{ outline: 'none' }} />

				<ModalBody>
					{isLoading ? (
						<CardShimmer
							count={4}
							height='80px'
							columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
						/>
					) : phoneHistory?.doc && phoneHistory?.results > 0 ? (
						<VStack
							p={2}
							w='full'
							overflowY='auto'
							scrollBehavior='smooth'
							maxH='60vh'
						>
							{phoneHistory?.doc?.map((item, index) => (
								<Box
									key={`${item._id}-${index}`}
									p={4}
									bg='white'
									borderRadius='lg'
									boxShadow='sm'
									borderLeft='4px solid'
									borderColor='brand.400'
									w='full'
								>
									<Flex justify='space-between' mb={2}>
										<Text fontSize='xs' color='gray.500'>
											{formatPostDate(item.createdAt)}
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
						</VStack>
					) : (
						<NoData label='phone history' />
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default LeadPhoneHistory;
