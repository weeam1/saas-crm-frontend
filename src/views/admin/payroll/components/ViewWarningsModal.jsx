import { useEffect, useState, useRef } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	VStack,
	HStack,
	Text,
	Box,
	Divider,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Flex,
	Button,
	useColorModeValue,
	Avatar,
	Icon,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Badge,
	Center,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';

import {
	FiAlertTriangle,
	FiCheckCircle,
	FiXCircle,
	FiUser,
	FiMessageSquare,
	FiClock,
	FiDollarSign,
	FiCalendar,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { formatPostDate } from 'utils/helpers';
import { constant } from 'constant';

const statusConfig = {
	active: {
		color: 'greenish',
		icon: FiAlertTriangle,
		label: 'Active',
		description: 'Warning is currently active',
	},
	revoked: {
		color: 'red',
		icon: FiXCircle,
		label: 'Revoked',
		description: 'Warning has been revoked',
	},
};

export const ViewWarningsModal = ({
	data,
	isOpen,
	onClose,
	employeeId,
	month,
	year,
}) => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [selectedWarningId, setSelectedWarningId] = useState(null);
	const cancelRef = useRef();

	const [revokingId, setRevokingId] = useState(null);
	const [warningsData, setWarningsData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const handleClose = () => {
		setWarningsData(null);
		setIsLoading(false);
		setRevokingId(null);
		onClose(); // call the parent onClose
	};

	const fetchWarnings = async (signal) => {
		try {
			setIsLoading(true);
			setWarningsData(null);

			const token =
				localStorage.getItem('accessToken') ||
				sessionStorage.getItem('accessToken');

			const res = await fetch(
				`${constant.baseUrl}api/payroll/employee-warnings/${employeeId}?month=${month}&year=${year}`,
				{
					headers: { Authorization: `Bearer ${token}` },
					signal,
				},
			);

			if (!res.ok) throw new Error('Failed to fetch warnings');

			const data = await res.json();
			setWarningsData(data);
		} catch (err) {
			if (err.name !== 'AbortError') {
				toast.error('Failed to load warnings');
			}
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (!isOpen || !employeeId || !month || !year) return;

		const controller = new AbortController();
		fetchWarnings(controller.signal);

		return () => {
			controller.abort();
			setWarningsData(null);
		};
	}, [isOpen, employeeId, month, year]);

	const [updateWarning, { isLoading: isRevoking }] = useUpdateItemMutation();

	const warningsList = warningsData?.data?.[0]?.warnings || [];
	const totalDeduction = warningsData?.data?.[0]?.totalWarningDeduction || 0;
	const monthYear = warningsData?.data?.[0]
		? `${warningsData.data[0].month}/${warningsData.data[0].year}`
		: `${month}/${year}`;

	const cardBg = useColorModeValue('white', 'gray.800');
	const subtleBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	// Sort warnings by issued date, most recent first
	const sortedWarnings = [...warningsList].sort(
		(a, b) => new Date(b.issuedAt) - new Date(a.issuedAt),
	);

	// Get current status info for the latest warning
	const currentStatus =
		sortedWarnings.length > 0
			? sortedWarnings[0].status.toLowerCase()
			: 'status';
	const statusInfo = statusConfig[currentStatus] || statusConfig.active;

	const handleRevokeWarning = async (warningId) => {
		try {
			setRevokingId(warningId); // start loader for this button
			await updateWarning({
				path: `/payroll/employee-warnings/${warningsData?.data[0]?._id}/revoke-warning`,
				body: { warningId },
				method: 'PUT',
			}).unwrap();
			await fetchWarnings();

			toast.success('Warning revoked successfully');
		} catch (error) {
			console.error('Failed to revoke warning:', error);
			toast.error(error?.data?.message || 'Failed to revoke warning');
		} finally {
			setRevokingId(null); // stop loader
		}
	};

	const payrollProcessed =
		data?.payslip?.status === 'paid' && sortedWarnings?.length > 0;

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				size='xl'
				isCentered
				scrollBehavior='inside'
				motionPreset='slideInBottom'
			>
				<ModalOverlay backdropFilter='blur(5px)' />
				<ModalContent rounded='xl' overflow='hidden' shadow='2xl'>
					<ModalHeader py={4} bg={subtleBg}>
						<VStack align='flex-start' spacing={1}>
							<HStack>
								<Text fontSize='lg' fontWeight='bold'>
									Employee Warnings
								</Text>
								<Badge colorScheme='blue' fontSize='sm'>
									{monthYear}
								</Badge>
							</HStack>
							<Text fontSize='sm' color='gray.500' fontWeight='normal'>
								Warning History and Deductions
							</Text>
						</VStack>
					</ModalHeader>
					<ModalCloseButton top={4} right={4} />

					<ModalBody py={4}>
						{isLoading || !warningsData ? (
							<>
								{Array.from({ length: 3 }).map((_, i) => (
									<WarningSkeleton key={i} />
								))}
							</>
						) : (
							<>
								{/* <Box
									p={4}
									mb={6}
									bg={cardBg}
									rounded='lg'
									borderWidth='1px'
									borderColor={borderColor}
									shadow='sm'
								>
									<Box>
										<HStack justify='space-between' mt={2}>
											<HStack spacing={2}>
												<Text fontSize='sm' color='gray.600'>
													Total Active Warning Deductions
												</Text>
											</HStack>
											<Text fontSize='lg' fontWeight='bold' color='orange.300'>
												{`${data?.agency?.currency} ${totalDeduction.toLocaleString()}`}
											</Text>
										</HStack>
									</Box>
								</Box> */}
								<Box p={5} mb={6} bg='cyan.50' rounded='lg'>
									<HStack justify='space-between' align='center'>
										{/* Label */}
										<HStack spacing={2}>
											<Box
												w='36px'
												h='36px'
												rounded='full'
												bg='cyan.50'
												display='flex'
												alignItems='center'
												justifyContent='center'
											>
												<Icon
													as={FiAlertTriangle}
													color='cyan.400'
													boxSize={4}
												/>
											</Box>

											<VStack align='start' spacing={0}>
												<Text fontSize='xs' color='gray.500'>
													Payroll Impact
												</Text>
												<Text fontSize='sm' fontWeight='500'>
													Active Warning Deductions
												</Text>
											</VStack>
										</HStack>

										{/* Amount */}
										<VStack align='end' spacing={0}>
											<Text fontSize='xs' color='gray.500'>
												Total
											</Text>
											<Text
												fontSize='xl'
												fontWeight='700'
												color='cyan.500'
												lineHeight='1'
											>
												{data?.agency?.currency}{' '}
												{totalDeduction.toLocaleString()}
											</Text>
										</VStack>
									</HStack>
								</Box>

								{payrollProcessed && (
									<Box
										display='flex'
										alignItems='center'
										gap={1}
										px={2}
										py={3}
										mb={4}
										bg='green.50'
										border='1px solid'
										borderColor='green.200'
										rounded='md'
									>
										<Icon as={FiCheckCircle} color='green.500' boxSize={4} />
										<Text fontSize='sm' fontWeight='medium' color='green.800'>
											All warning deductions have been successfully applied for
											this period.
										</Text>
									</Box>
								)}

								{/* History Timeline - Same structure as commented code */}

								<VStack align='stretch' spacing={0} position='relative'>
									<Box
										position='absolute'
										left='16px'
										top='0'
										bottom='0'
										width='2px'
										bg={borderColor}
										zIndex={1}
									/>

									{sortedWarnings.length === 0 ? (
										<Box
											p={6}
											minH='400px'
											textAlign='center'
											justify='center'
											bg={cardBg}
											rounded='lg'
											borderWidth='1px'
											borderColor={borderColor}
										>
											<Icon as={FiClock} boxSize={6} color='gray.400' mb={2} />
											<Text color='gray.500'>No warnings for this period</Text>
										</Box>
									) : (
										sortedWarnings.map((warning, idx) => {
											const statusKey = warning.status.toLowerCase();
											const config =
												statusConfig[statusKey] || statusConfig.active;
											const isLatest = true;
											return (
												<HStack
													key={warning._id}
													align='flex-start'
													spacing={4}
													py={2}
													position='relative'
													zIndex={2}
												>
													<Box flexShrink={0} position='relative'>
														<Box
															w='32px'
															h='32px'
															rounded='full'
															bg={
																isLatest ? `${config.color}.500` : 'transparent'
															}
															borderWidth={isLatest ? '0' : '2px'}
															borderColor={`${config.color}.500`}
															display='flex'
															alignItems='center'
															justifyContent='center'
														>
															<Icon
																as={config.icon}
																color={
																	isLatest ? 'white' : `${config.color}.500`
																}
																boxSize={4}
															/>
														</Box>
													</Box>

													<Box
														flex='1'
														bg={isLatest ? `${config.color}.50` : cardBg}
														p={4}
														rounded='lg'
														borderWidth='1px'
														borderColor={
															isLatest ? `${config.color}.200` : borderColor
														}
														shadow={isLatest ? 'sm' : 'none'}
													>
														<HStack justify='space-between' mb={2}>
															{warning.issuedBy && (
																<HStack spacing={2}>
																	<VStack align='start' spacing={0}>
																		<Text fontSize='xs' color='gray.600'>
																			Issued By
																		</Text>
																		<Text
																			fontSize='xs'
																			fontWeight='medium'
																			color='gray.600'
																		>
																			{warning.issuedBy.fullName}
																		</Text>
																	</VStack>
																</HStack>
															)}
															<Text fontSize='xs' color='gray.500'>
																{formatPostDate(warning.issuedAt)}
															</Text>
														</HStack>

														{/* Warning Amount */}
														<HStack justify='space-between' mb={3}>
															<HStack spacing={1}>
																<Text
																	fontSize='xs'
																	fontWeight='medium'
																	color='gray.600'
																>
																	Warning Deduction:
																</Text>
															</HStack>
															<Text
																fontSize='lg'
																fontWeight='bold'
																color='orange.300'
															>
																{`${data?.agency?.currency} ${warning.amount.toLocaleString()}`}
															</Text>
														</HStack>

														{/* Warning Note */}
														{warning.note && (
															<>
																<HStack spacing={1} mb={1}>
																	<Icon
																		as={FiMessageSquare}
																		boxSize={3}
																		color='gray.500'
																	/>
																	<Text
																		fontSize='xs'
																		fontWeight='medium'
																		color='gray.600'
																	>
																		Note
																	</Text>
																</HStack>

																<Box
																	bg={'gray.100'}
																	border='1px solid'
																	borderColor='gray.200'
																	rounded='md'
																	p={3}
																	fontSize='sm'
																	color='gray.700'
																	mb={3}
																>
																	{warning.note}
																</Box>
															</>
														)}

														{/* Revoke Button */}
														{!payrollProcessed &&
															warning.status === 'active' && (
																<Flex justify='right'>
																	<Button
																		size='sm'
																		colorScheme='blue'
																		variant='outline'
																		onClick={() => {
																			setSelectedWarningId(warning._id);
																			setIsConfirmOpen(true);
																		}}
																		isLoading={revokingId === warning._id} // only show loader for this button
																	>
																		Revoke
																	</Button>
																</Flex>
															)}
													</Box>
												</HStack>
											);
										})
									)}
								</VStack>
							</>
						)}
					</ModalBody>

					<Divider />

					<ModalFooter py={3}>
						<Button
							onClick={handleClose}
							rounded='lg'
							px={6}
							variant='outline'
							colorScheme='blue'
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<AlertDialog
				isOpen={isConfirmOpen}
				leastDestructiveRef={cancelRef}
				onClose={() => setIsConfirmOpen(false)}
				isCentered
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Revoke Warning Deduction
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to revoke this warning deduction?
							<br />
							<Text mt={2} fontSize='sm' color='gray.600'>
								If you confirm, it will not be applied in the payroll, and this
								action cannot be undone.
							</Text>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
								Cancel
							</Button>
							<Button
								colorScheme='red'
								ml={3}
								onClick={() => {
									setIsConfirmOpen(false);
									handleRevokeWarning(selectedWarningId);
								}}
							>
								Confirm Revoke
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

const WarningSkeleton = () => {
	return (
		<HStack align='flex-start' spacing={4} py={2}>
			{/* Timeline icon */}
			<SkeletonCircle size='8' />

			{/* Card */}
			<Box flex='1' p={4} rounded='lg' borderWidth='1px'>
				<HStack justify='space-between' mb={3}>
					<Skeleton height='10px' width='120px' />
					<Skeleton height='10px' width='80px' />
				</HStack>

				<HStack justify='space-between' mb={3}>
					<Skeleton height='12px' width='180px' />
					<Skeleton height='20px' width='80px' />
				</HStack>

				<SkeletonText mt='2' noOfLines={3} spacing='3' />
			</Box>
		</HStack>
	);
};
