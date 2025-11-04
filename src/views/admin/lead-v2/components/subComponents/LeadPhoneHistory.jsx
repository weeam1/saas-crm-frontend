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
	Icon,
	Avatar,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import CardShimmer from 'components/loading/CardShimmer';
import NoData from 'components/Message/NoData';
import { useModalColors } from 'hooks/useModalColors';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight, FiMessageSquare, FiPhone } from 'react-icons/fi';
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

	const { headerBg, headerText } = useModalColors();

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
				<ModalHeader
					bg={headerBg}
					color={headerText}
					borderTopRadius='xl'
					py={4}
					w='100%'
				>
					Phone Number History
				</ModalHeader>
				<ModalCloseButton _focus={{ outline: 'none' }} />

				<ModalBody>
					{isLoading ? (
						<CardShimmer
							count={4}
							height='100px'
							columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
						/>
					) : phoneHistory?.doc && phoneHistory?.results > 0 ? (
						<Box
							p={2}
							w='full'
							overflowY='auto'
							scrollBehavior='smooth'
							maxH='60vh'
							css={{
								'&::-webkit-scrollbar': {
									width: '4px',
								},
								'&::-webkit-scrollbar-track': {
									width: '6px',
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'brand.200',
									borderRadius: '24px',
								},
							}}
						>
							{phoneHistory?.doc.map((item) => (
								<HistoryItem key={item._id} item={item} />
							))}
						</Box>
					) : (
						<NoData label='phone history' />
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default LeadPhoneHistory;

// Reusable HistoryItem component
const HistoryItem = ({ item }) => (
	<Box
		key={item._id}
		p={4}
		bg='gray.100'
		rounded='lg'
		shadow='md'
		borderLeft='4px solid'
		borderColor='brand.400'
		w='full'
		mb={4}
		transition='all 0.2s'
		_hover={{
			transform: 'translateY(-2px)',
			shadow: 'lg',
		}}
	>
		<Flex justify='space-between' align='center' mb={3}>
			<Text fontSize='xs' color='gray.500'>
				{formatPostDate(item.createdAt)}
			</Text>
		</Flex>

		<Box>
			{item.newPhoneNumber && (
				<>
					<BadgeWithLabel
						label='Old Phone'
						value={item.oldPhoneNumber}
						valueColorScheme='red'
						icon={FiPhone}
					/>

					<BadgeWithLabel
						label='New Phone'
						value={item.newPhoneNumber}
						valueColorScheme='blue'
						icon={FiPhone}
					/>
				</>
			)}

			{item.newWhatsappNumber && (
				<>
					<BadgeWithLabel
						label='Old WhatsApp'
						value={item.oldWhatsappNumber}
						valueColorScheme='red'
						icon={FaWhatsapp}
					/>

					<BadgeWithLabel
						label='New WhatsApp'
						value={item.newWhatsappNumber}
						valueColorScheme='green'
						icon={FaWhatsapp}
					/>
				</>
			)}
		</Box>

		<Text fontSize='sm' justifySelf='flex-end' color='gray.600'>
			Updated by: <strong>{item.updatedBy?.fullName}</strong>
		</Text>
	</Box>
);

// Reusable BadgeWithLabel component
const BadgeWithLabel = ({
	label,
	value,
	valueColorScheme = 'gray',
	labelColorScheme = 'gray',
	icon,
	...props
}) => (
	<Flex align='center' mb={2}>
		<Badge
			colorScheme={labelColorScheme}
			variant='subtle'
			mr={2}
			px={2}
			py={1}
			fontSize={{ base: 'xs', md: 'sm' }}
			display='flex'
			alignItems='center'
			textTransform='capitalize'
		>
			{icon && <Icon color={`${valueColorScheme}.400`} as={icon} mr={1} />}
			{label}
		</Badge>
		<Badge
			colorScheme={valueColorScheme}
			variant='subtle'
			px={2}
			py={1}
			fontSize={{ base: 'xs', md: 'sm' }}
			{...props}
		>
			{value || 'N/A'}
		</Badge>
	</Flex>
);
