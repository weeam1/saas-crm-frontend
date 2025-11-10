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
	Grid,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import {
	FaReceipt,
	FaTag,
	FaLayerGroup,
	FaUser,
	FaBuilding,
	FaCalendar,
} from 'react-icons/fa';
import { useModalColors } from 'hooks/useModalColors';
import { formatCurrency } from 'utils/helpers';
import { DataView, DataViewGroup } from '../components/DateView';

const ViewExpense = ({ isOpen, onClose, data }) => {
	const {
		expenseNumber,
		amount,
		category,
		subCategory,
		vatPercent,
		vatAmount,
		totalAmount,
		date: expenseDate,
		description,
		addedBy,
		agency,
		createdAt,
	} = data;

	const { headerBg, headerText } = useModalColors();

	// Responsive values
	const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });
	const headerPadding = useBreakpointValue({ base: 3, md: 6 });
	const bodyPadding = useBreakpointValue({ base: 4, md: 6 });

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={modalSize}
			isCentered
			motionPreset='slideInBottom'
			scrollBehavior='inside'
		>
			<ModalOverlay backdropFilter='blur(8px)' bg='blackAlpha.600' />
			<ModalContent
				mx='2'
				borderRadius={{ base: 'xl', md: '2xl' }}
				boxShadow={{ base: 'xl', md: '2xl' }}
				maxH={{ base: '70vh', md: '90vh' }}
				overflow='hidden'
			>
				<ModalHeader
					bg={headerBg}
					color={headerText}
					borderTopRadius={{ base: 'xl', md: '2xl' }}
					py={headerPadding}
					position='relative'
				>
					<Flex align='center' justify='space-between'>
						<Flex align='center' gap={3}>
							<Icon as={FaReceipt} boxSize={6} />
							<Box>
								<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
									Expense Details
								</Text>
								<Text fontSize='sm' opacity={0.9} fontWeight='normal'>
									{expenseNumber || 'Expense Information'}
								</Text>
							</Box>
						</Flex>
					</Flex>
				</ModalHeader>

				<ModalCloseButton
					size='lg'
					top={{ base: 4, md: 5 }}
					right={{ base: 4, md: 5 }}
					color='white'
				/>

				<ModalBody px={bodyPadding} py={4}>
					{/* Amount Breakdown */}
					<Box
						bg='white'
						border='1px'
						borderColor='gray.200'
						borderRadius='xl'
						p={4}
						mb={6}
						boxShadow='sm'
					>
						<Text fontSize='lg' fontWeight='semibold' color='gray.700' mb={4}>
							Amount Details
						</Text>

						<Grid templateColumns={{ base: '1fr', md: '1fr' }} gap={4}>
							<Box>
								<Flex justify='space-between' mb={2}>
									<Text fontSize='sm' color='gray.600'>
										Base Amount
									</Text>
									<Text fontSize='sm' fontWeight='medium'>
										{formatCurrency(amount, agency?.currency || 'AED')}
									</Text>
								</Flex>

								<Flex justify='space-between' mb={2}>
									<Text fontSize='sm' color='gray.600'>
										VAT %
									</Text>
									<Text fontSize='sm' fontWeight='medium'>
										{vatPercent || 0}%
									</Text>
								</Flex>
								<Flex justify='space-between' mb={2}>
									<Text fontSize='sm' color='gray.600'>
										VAT Amount
									</Text>
									<Text fontSize='sm' fontWeight='medium'>
										{formatCurrency(vatAmount, agency?.currency || 'AED')}
									</Text>
								</Flex>
							</Box>

							<Box
								bg='blue.50'
								border='2px'
								borderColor='blue.200'
								borderRadius='lg'
								p={3}
								gridColumn={{ md: 'span 2' }}
							>
								<Flex justify='space-between' align='center'>
									<Text fontSize='sm' fontWeight='bold' color='blue.800'>
										Total Amount
									</Text>
									<Text fontSize='lg' fontWeight='bold' color='blue.900'>
										{formatCurrency(totalAmount, agency?.currency || 'AED')}
									</Text>
								</Flex>
							</Box>
						</Grid>
					</Box>

					{/* Basic Information */}
					<DataViewGroup columns={{ base: 1, md: 2 }} spacing={4}>
						<DataView
							label='Category'
							value={category?.name || category}
							isBadge
							badgeColor='green'
							icon={FaTag}
						/>
						<DataView
							label='Sub Category'
							value={subCategory?.name || 'Others'}
							icon={FaLayerGroup}
						/>
						<DataView
							label='Expense Date'
							value={
								expenseDate ? format(new Date(expenseDate), 'MMM d, yyyy') : '—'
							}
							icon={FaCalendar}
						/>
						<DataView label='Agency' value={agency?.name} icon={FaBuilding} />
					</DataViewGroup>

					<Divider my={4} />

					{/* Description & Notes */}
					<Box>
						<DataView
							label='Description'
							value={description}
							truncate={false}
						/>
					</Box>

					<Divider my={4} />

					{/* Audit Information */}
					<Box
						bg='gray.50'
						borderRadius='lg'
						p={4}
						border='1px solid'
						borderColor='gray.200'
					>
						<Text fontSize='sm' fontWeight='semibold' color='gray.700' mb={3}>
							Audit Information
						</Text>
						<DataViewGroup columns={{ base: 1, md: 2 }} spacing={3}>
							<DataView
								label='Added By'
								value={addedBy?.fullName || addedBy?.username}
								icon={FaUser}
							/>
							<DataView
								label='Role'
								value={addedBy?.roles?.[0]?.roleName}
								isBadge
								badgeColor='blue'
							/>
							<DataView
								label='Created At'
								value={format(new Date(createdAt), 'MMM d, yyyy h:mm a')}
							/>
							{addedBy?.department && (
								<DataView label='Department' value={addedBy?.department} />
							)}
						</DataViewGroup>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ViewExpense;
