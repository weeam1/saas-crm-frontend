import {
	Badge,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Box,
	Text,
	VStack,
	HStack,
	useDisclosure,
	Icon,
	Flex,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useState } from 'react';
import { CheckIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';
import { FiAlertTriangle, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { formatCurrency } from 'utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';

const PayrollStatus = ({ initialStatus, payrollData }) => {
	const [status, setStatus] = useState(initialStatus);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [pendingStatus, setPendingStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const payslipId = payrollData?.payslip?._id;
	const isNegativeSalary = payrollData?.payrollSummary?.netSalary < 0;

	const [updatePaymentStatus] = useUpdateItemMutation();

	// Optimized base styles
	const baseStyles = {
		fontSize: '0.875rem',
		px: 4,
		py: 2,
		borderRadius: 'full',
		textTransform: 'uppercase',
		fontWeight: '700',
		display: 'inline-flex',
		alignItems: 'center',
		gap: 2,
		minWidth: '110px',
		justifyContent: 'center',
		cursor: status === 'paid' ? 'default' : 'pointer',
		transition: 'all 0.2s ease-in-out',
		lineHeight: '1',
	};

	const statusConfig = {
		paid: {
			bg: 'green.50',
			color: 'green.700',
			borderColor: 'green.200',
			icon: <CheckIcon boxSize={3} />,
			hover: {},
		},
		unpaid: {
			bg: 'orange.50',
			color: 'orange.700',
			borderColor: 'orange.300',
			icon: <TimeIcon boxSize={3} />,
			hover: {
				bg: 'orange.100',
				transform: 'translateY(-1px)',
				shadow: 'sm',
			},
		},
	};

	const handleStatusChange = (newStatus) => {
		if (status === 'paid') return;

		setPendingStatus(newStatus);
		onOpen(); // Direct call without setTimeout for faster opening
	};

	const confirmStatusChange = async () => {
		setIsLoading(true);
		try {
			await updatePaymentStatus({
				path: `/payroll/payslip/status/${payslipId}`,
				body: { status: pendingStatus },
			}).unwrap();

			setStatus(pendingStatus);
			toast.success('Payroll status updated successfully');
			onClose();
		} catch (error) {
			console.error('Failed to update status:', error);
			toast.error(
				error?.data?.message || 'Failed to update the payroll status!',
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Paid state - non-interactive
	if (status === 'paid') {
		return (
			<Flex
				align='center'
				bg='green.50'
				color='green.700'
				border='1px solid'
				borderColor='green.200'
				px={4}
				py={2}
				borderRadius='full'
				fontSize='0.875rem'
				fontWeight='700'
				textTransform='uppercase'
				gap={2}
				minWidth='110px'
				justify='center'
			>
				<CheckIcon boxSize={3} />
				PAID
			</Flex>
		);
	}
	const tooltipText = isNegativeSalary
		? 'User salary is negative!'
		: payslipId
			? 'Update the payment status'
			: 'Generate a payslip before changing the status';

	// Unpaid state - interactive button
	return (
		<>
			<CustomTooltip label={tooltipText}>
				<Button
					onClick={() => handleStatusChange('paid')}
					variant='unstyled'
					bg='orange.50'
					color='orange.700'
					border='1px solid'
					borderColor='orange.300'
					disabled={!payslipId || payrollData?.payrollSummary?.netSalary < 0}
					_hover={{
						bg: 'orange.100',
						transform: 'translateY(-1px)',
						shadow: 'sm',
					}}
					_active={{
						bg: 'orange.200',
						transform: 'translateY(0)',
					}}
					{...baseStyles}
				>
					<TimeIcon boxSize={3} />
					UNPAID
				</Button>
			</CustomTooltip>

			{/* Optimized Modal - Always rendered but conditionally shown */}
			<Modal
				isOpen={isOpen}
				onClose={!isLoading ? onClose : undefined}
				isCentered
				closeOnOverlayClick={!isLoading}
				closeOnEsc={!isLoading}
				size='md'
			>
				<ModalOverlay bg='blackAlpha.600' backdropFilter='blur(4px)' />
				<ModalContent borderRadius='xl' mx={4} shadow='xl'>
					<ModalHeader
						borderBottom='1px solid'
						borderColor='gray.100'
						pb={4}
						pt={6}
					>
						<HStack spacing={3}>
							<Flex bg='orange.50' color='orange.500' p={2} borderRadius='lg'>
								<Icon as={FiAlertTriangle} boxSize={5} />
							</Flex>
							<VStack align='start' spacing={0}>
								<Text fontSize='lg' fontWeight='700'>
									Confirm Payment
								</Text>
								<Text fontSize='sm' color='gray.600' fontWeight='normal'>
									Update payroll status to paid
								</Text>
							</VStack>
						</HStack>
					</ModalHeader>

					<ModalBody py={6}>
						<VStack spacing={5} align='start'>
							{/* Payroll Summary */}
							<Box
								bg='blue.50'
								p={4}
								borderRadius='lg'
								width='100%'
								border='1px solid'
								borderColor='blue.100'
							>
								<HStack spacing={3} mb={3}>
									<Icon as={FiDollarSign} color='blue.500' />
									<Text fontWeight='600' color='blue.900'>
										Payroll Summary
									</Text>
								</HStack>

								<VStack spacing={2} align='start' fontSize='sm'>
									<HStack justify='space-between' width='100%'>
										<Text color='gray.600'>Employee:</Text>
										<Text fontWeight='600'>
											{payrollData.fullName || 'N/A'}
										</Text>
									</HStack>
									<HStack justify='space-between' width='100%'>
										<Text color='gray.600'>Net Salary:</Text>
										<Text fontWeight='600' color='green.600'>
											{formatCurrency(
												payrollData?.payrollSummary?.netSalary,
												payrollData?.agency?.currency || 'AED',
											)}
										</Text>
									</HStack>
									{/* <HStack justify='space-between' width='100%'>
										<Text color='gray.600'>Period:</Text>
										<Text fontWeight='600'>
											{payrollData?.payslip?.craeatedAt || 'N/A'}
										</Text>
									</HStack> */}
								</VStack>
							</Box>

							{/* Warning Alert */}
							<Flex
								bg='orange.50'
								border='1px solid'
								borderColor='orange.200'
								borderRadius='lg'
								p={4}
								width='100%'
							>
								<HStack spacing={3} align='flex-start'>
									<Icon as={FiAlertTriangle} color='orange.500' mt={0.5} />
									<VStack spacing={1} align='start'>
										<Text fontSize='sm' fontWeight='600' color='orange.800'>
											Important Notice
										</Text>
										<Text fontSize='sm' color='orange.700' lineHeight='1.4'>
											This action is permanent. Once marked as paid, the status
											cannot be reverted to unpaid.
										</Text>
									</VStack>
								</HStack>
							</Flex>

							{/* Status Preview */}
							<Box
								bg='gray.50'
								p={3}
								borderRadius='md'
								width='100%'
								textAlign='center'
							>
								<Text fontSize='sm' color='gray.600' mb={1}>
									Status will change from:
								</Text>
								<HStack justify='center' spacing={3}>
									<Badge
										colorScheme='orange'
										variant='subtle'
										px={3}
										py={1}
										borderRadius='full'
									>
										UNPAID
									</Badge>
									<Text color='gray.400'>→</Text>
									<Badge
										colorScheme='green'
										variant='subtle'
										px={3}
										py={1}
										borderRadius='full'
									>
										PAID
									</Badge>
								</HStack>
							</Box>
						</VStack>
					</ModalBody>

					<ModalFooter
						borderTop='1px solid'
						borderColor='gray.100'
						pt={5}
						pb={6}
					>
						<HStack spacing={3} width='100%' justify='flex-end'>
							<Button
								variant='outline'
								onClick={onClose}
								isDisabled={isLoading}
								size='md'
								minW='100px'
							>
								Cancel
							</Button>
							<Button
								colorScheme='green'
								onClick={confirmStatusChange}
								leftIcon={<Icon as={FiCheckCircle} />}
								isLoading={isLoading}
								loadingText='Updating...'
								size='md'
								minW='140px'
								bg='green.500'
								_hover={{ bg: 'green.600' }}
							>
								Confirm Paid
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default PayrollStatus;
