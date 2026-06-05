import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Box,
	Flex,
	Icon,
	Divider,
	useBreakpointValue,
	Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaCreditCard, FaMoneyBillWave, FaBuilding } from 'react-icons/fa';
import { paymentColors } from '../helpers';
import { useModalColors } from 'hooks/useModalColors';
import { DataView, DataViewGroup } from '../components/DateView';
import { formatCurrency } from 'utils/helpers';

// const ViewBalance = ({ isOpen, onClose, data }) => {
// 	const { paymentMethod, amount, description, addedBy, agency, createdAt } =
// 		data;

// 	const { headerBg, headerText } = useModalColors();

// 	// Responsive values
// 	const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });
// 	const headerPadding = useBreakpointValue({ base: 3, md: 6 });
// 	const bodyPadding = useBreakpointValue({ base: 4, md: 6 });

// 	// Payment method icon mapping
// 	const getPaymentIcon = (method) => {
// 		const icons = {
// 			cash: FaMoneyBillWave,
// 			card: FaCreditCard,
// 			transfer: FaBuilding,
// 			default: FaCreditCard,
// 		};
// 		return icons[method] || icons.default;
// 	};

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={onClose}
// 			size={modalSize}
// 			isCentered
// 			motionPreset='slideInBottom'
// 			scrollBehavior='inside'
// 		>
// 			<ModalOverlay backdropFilter='blur(8px)' bg='blackAlpha.600' />
// 			<ModalContent
// 				mx='2'
// 				borderRadius={{ base: 'xl', md: '2xl' }}
// 				boxShadow={{ base: 'xl', md: '2xl' }}
// 				maxH={{ base: '70vh', md: '90vh' }}
// 				overflow='hidden'
// 			>
// 				<ModalHeader
// 					bg={headerBg}
// 					color={headerText}
// 					borderTopRadius={{ base: 'none', md: '2xl' }}
// 					py={headerPadding}
// 					position='relative'
// 				>
// 					<Flex align='center' gap={3}>
// 						<Icon
// 							as={getPaymentIcon(paymentMethod?.toLowerCase())}
// 							boxSize={5}
// 						/>
// 						<Box>
// 							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
// 								Payment Details
// 							</Text>
// 							<Text fontSize='sm' opacity={0.9} fontWeight='normal'>
// 								Complete incoming cash information
// 							</Text>
// 						</Box>
// 					</Flex>
// 				</ModalHeader>

// 				<ModalCloseButton
// 					size='lg'
// 					top={{ base: 3, md: 4 }}
// 					right={{ base: 3, md: 4 }}
// 				/>

// 				<ModalBody px={bodyPadding} py={4}>
// 					{/* Amount Highlight */}
// 					<Box
// 						bg='blue.50'
// 						border='1px'
// 						borderColor='blue.100'
// 						borderRadius='xl'
// 						p={4}
// 						mb={6}
// 						textAlign='center'
// 					>
// 						<Text fontSize='xs' color='blue.600' fontWeight='medium' mb={1}>
// 							TOTAL AMOUNT
// 						</Text>
// 						<Text fontSize='2xl' fontWeight='bold' color='blue.900'>
// 							{formatCurrency(amount, agency?.currency || 'AED')}
// 						</Text>
// 					</Box>

// 					<DataViewGroup columns={{ base: 1, md: 2 }} spacing={4}>
// 						<DataView
// 							label='Payment Method'
// 							value={paymentMethod}
// 							isBadge
// 							badgeColor={paymentColors[paymentMethod] || 'gray'}
// 							badgeVariant='subtle'
// 						/>
// 						<DataView
// 							label='Agency'
// 							value={agency?.name}
// 							// customStyles={{ display: 'flex', alignItems: 'center', gap: 2 }}
// 						/>
// 						<DataView
// 							label='Added By'
// 							value={addedBy?.fullName || addedBy?.username}
// 						/>
// 						<DataView
// 							label='Role'
// 							value={addedBy?.roles?.[0]?.roleName}
// 							isBadge
// 							badgeColor='purple'
// 						/>
// 					</DataViewGroup>

// 					<Divider my={4} />

// 					{/* Description - Full Width */}
// 					<DataView
// 						label='Description'
// 						value={description}
// 						customStyles={{ gridColumn: '1 / -1' }}
// 						truncate
// 					/>

// 					<Divider my={4} />

// 					<DataView
// 						label='Created At'
// 						value={format(new Date(createdAt), 'MMM d, yyyy h:mm a')}
// 					/>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

const ViewBalance = ({ isOpen, onClose, data }) => {
	const { paymentMethod, amount, description, addedBy, agency, createdAt } =
		data;
	const mc = useModalColors();

	// Responsive values
	const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });
	const headerPadding = useBreakpointValue({ base: 3, md: 6 });
	const bodyPadding = useBreakpointValue({ base: 4, md: 6 });

	// Payment method icon mapping
	const getPaymentIcon = (method) => {
		const icons = {
			cash: FaMoneyBillWave,
			card: FaCreditCard,
			transfer: FaBuilding,
			default: FaCreditCard,
		};
		return icons[method] || icons.default;
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={modalSize}
			isCentered
			motionPreset='slideInBottom'
			scrollBehavior='inside'
		>
			<ModalOverlay backdropFilter='blur(8px)' bg={mc.overlayBg} />
			<ModalContent
				mx='2'
				borderRadius={{ base: 'xl', md: '2xl' }}
				boxShadow={mc.modalShadow}
				maxH={{ base: '70vh', md: '90vh' }}
				overflow='hidden'
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
			>
				{/* Header — Gold Gradient */}
				<ModalHeader
					bg={mc.headerBg}
					color={mc.headerText}
					borderTopRadius={{ base: 'none', md: '2xl' }}
					py={headerPadding}
					px={6}
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
				>
					<Flex align='center' gap={3}>
						<Icon
							as={getPaymentIcon(paymentMethod?.toLowerCase())}
							boxSize={5}
						/>
						<Box>
							<Text
								fontSize={{ base: 'lg', md: 'xl' }}
								color='inherit'
								fontWeight='bold'
							>
								Payment Details
							</Text>
							<Text
								fontSize='sm'
								opacity={0.8}
								color='inherit'
								fontWeight='normal'
							>
								Complete incoming cash information
							</Text>
						</Box>
					</Flex>
				</ModalHeader>

				<ModalCloseButton
					top={{ base: 3, md: 4 }}
					right={{ base: 3, md: 4 }}
					bg={mc.closeBtnBg}
					color={mc.closeBtnColor}
					borderRadius='full'
					_hover={{ bg: mc.closeBtnHoverBg }}
					_focus={{ boxShadow: 'none' }}
				/>

				<ModalBody px={bodyPadding} py={4}>
					{/* Amount Highlight — Gold themed */}
					<Box
						bg='rgba(212, 175, 55, 0.08)'
						border='1px solid'
						borderColor='rgba(212, 175, 55, 0.3)'
						borderRadius='xl'
						p={4}
						mb={6}
						textAlign='center'
					>
						<Text
							fontSize='xs'
							color={mc.labelColor}
							fontWeight='semibold'
							mb={1}
							textTransform='uppercase'
							letterSpacing='wider'
						>
							Total Amount
						</Text>
						<Text fontSize='2xl' fontWeight='bold' color='accent.gold'>
							{formatCurrency(amount, agency?.currency || 'AED')}
						</Text>
					</Box>

					<DataViewGroup columns={{ base: 1, md: 2 }} spacing={4}>
						<DataView
							label='Payment Method'
							value={paymentMethod}
							isBadge
							badgeColor={paymentColors[paymentMethod] || 'gray'}
							badgeVariant='subtle'
						/>
						<DataView label='Agency' value={agency?.name} />
						<DataView
							label='Added By'
							value={addedBy?.fullName || addedBy?.username}
						/>
						<DataView
							label='Role'
							value={addedBy?.roles?.[0]?.roleName}
							isBadge
							badgeColor='purple'
						/>
					</DataViewGroup>

					<Divider my={4} borderColor={mc.divider} />

					{/* Description - Full Width */}
					<DataView
						label='Description'
						value={description}
						customStyles={{ gridColumn: '1 / -1' }}
						truncate
					/>

					<Divider my={4} borderColor={mc.divider} />

					<DataView
						label='Created At'
						value={format(new Date(createdAt), 'MMM d, yyyy h:mm a')}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ViewBalance;
