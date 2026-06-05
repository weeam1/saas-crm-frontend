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
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import CardShimmer from 'components/loading/CardShimmer';
import NoData from 'components/Message/NoData';
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
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
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay bg='bg.overlay' backdropFilter='blur(2px)' />
			<ModalContent
				bg='bg.surface'
				borderRadius='xl'
				boxShadow='deep'
				mx='2'
				overflow='hidden'
			>
				<ModalHeader
					bg='bg.elevated'
					color='text.heading'
					borderTopRadius='xl'
					py={4}
					px={6}
					borderBottom='1px solid'
					borderColor='border.default'
					w='100%'
				>
					Phone Number History
				</ModalHeader>

				<ModalCloseButton
					color='text.muted'
					_focus={{ outline: 'none' }}
				/>

				<ModalBody bg='bg.app'>
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
									background: 'accent.gold',
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
		bg='bg.surface'
		rounded='lg'
		shadow='card'
		borderLeft='4px solid'
		borderColor='accent.gold'
		w='full'
		mb={4}
		transition='all 0.2s'
		_hover={{
			transform: 'translateY(-2px)',
			shadow: 'soft',
		}}
	>
		<Flex justify='space-between' align='center' mb={3}>
			<Text fontSize='xs' color='text.muted'>
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

		<Text fontSize='sm' justifySelf='flex-end' color='text.body'>
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
			{icon && <Icon as={icon} mr={1} boxSize={3} />}
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