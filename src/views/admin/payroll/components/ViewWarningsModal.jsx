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
import { useModalColors } from 'hooks/useModalColors';

const statusConfig = {
	active: {
		color: 'yellow',
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
	const colors = useModalColors();
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
		onClose();
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
			setRevokingId(warningId);
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
			setRevokingId(null);
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
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
				<ModalContent
					rounded='xl'
					overflow='hidden'
					boxShadow={colors.modalShadow}
					bg={colors.bg}
					border='1px solid'
					borderColor={colors.borderColor}
				>
					<ModalHeader py={4} bg={colors.bgInput} borderBottom='1px solid' borderColor={colors.borderColor}>
						<VStack align='flex-start' spacing={1}>
							<HStack>
								<Text fontSize='lg' fontWeight='bold' color={colors.headingText}>
									Employee Warnings
								</Text>
								<Badge
									bg={colors.badgeInfoBg}
									color={colors.badgeInfoText}
									fontSize='sm'
									px={2}
									py={1}
									borderRadius='full'
								>
									{monthYear}
								</Badge>
							</HStack>
							<Text fontSize='sm' color={colors.mutedText} fontWeight='normal'>
								Warning History and Deductions
							</Text>
						</VStack>
					</ModalHeader>
					<ModalCloseButton
						top={4}
						right={4}
						color={colors.mutedText}
						_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
					/>

					<ModalBody py={4}>
						{isLoading || !warningsData ? (
							<>
								{Array.from({ length: 3 }).map((_, i) => (
									<WarningSkeleton key={i} />
								))}
							</>
						) : (
							<>
								{/* Total Deductions Card */}
								<Box p={5} mb={6} bg={colors.badgeInfoBg} rounded='lg' border='1px solid' borderColor={colors.badgeInfoBorder}>
									<HStack justify='space-between' align='center'>
										<HStack spacing={2}>
											<Box
												w='36px'
												h='36px'
												rounded='full'
												bg={colors.badgeInfoBg}
												display='flex'
												alignItems='center'
												justifyContent='center'
											>
												<Icon
													as={FiAlertTriangle}
													color={colors.badgeInfoText}
													boxSize={4}
												/>
											</Box>

											<VStack align='start' spacing={0}>
												<Text fontSize='xs' color={colors.mutedText}>
													Payroll Impact
												</Text>
												<Text fontSize='sm' fontWeight='500' color={colors.bodyText}>
													Active Warning Deductions
												</Text>
											</VStack>
										</HStack>

										<VStack align='end' spacing={0}>
											<Text fontSize='xs' color={colors.mutedText}>
												Total
											</Text>
											<Text
												fontSize='xl'
												fontWeight='700'
												color={colors.accentGold}
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
										bg={colors.badgeSuccessBg}
										border='1px solid'
										borderColor={colors.badgeSuccessBorder}
										rounded='md'
									>
										<Icon as={FiCheckCircle} color={colors.badgeSuccessText} boxSize={4} />
										<Text fontSize='sm' fontWeight='medium' color={colors.badgeSuccessText}>
											All warning deductions have been successfully applied for
											this period.
										</Text>
									</Box>
								)}

								{/* History Timeline */}
								<VStack align='stretch' spacing={0} position='relative'>
									<Box
										position='absolute'
										left='16px'
										top='0'
										bottom='0'
										width='2px'
										bg={colors.borderColor}
										zIndex={1}
									/>

									{sortedWarnings.length === 0 ? (
										<Box
											p={6}
											minH='400px'
											textAlign='center'
											justify='center'
											bg={colors.bgInput}
											rounded='lg'
											borderWidth='1px'
											borderColor={colors.borderColor}
										>
											<Icon as={FiClock} boxSize={6} color={colors.mutedText} mb={2} />
											<Text color={colors.mutedText}>No warnings for this period</Text>
										</Box>
									) : (
										sortedWarnings.map((warning, idx) => {
											const statusKey = warning.status.toLowerCase();
											const config =
												statusConfig[statusKey] || statusConfig.active;
											const isLatest = true;
											const statusColor = statusKey === 'active' ? colors.badgeWarningText : colors.badgeErrorText;
											const statusBg = statusKey === 'active' ? colors.badgeWarningBg : colors.badgeErrorBg;
											const statusBorder = statusKey === 'active' ? colors.badgeWarningBorder : colors.badgeErrorBorder;

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
															bg={isLatest ? statusBg : 'transparent'}
															borderWidth={isLatest ? '0' : '2px'}
															borderColor={statusColor}
															display='flex'
															alignItems='center'
															justifyContent='center'
														>
															<Icon
																as={config.icon}
																color={isLatest ? colors.headerText : statusColor}
																boxSize={4}
															/>
														</Box>
													</Box>

													<Box
														flex='1'
														bg={isLatest ? statusBg : colors.bg}
														p={4}
														rounded='lg'
														borderWidth='1px'
														borderColor={isLatest ? statusBorder : colors.borderColor}
														shadow={isLatest ? colors.cardShadow : 'none'}
													>
														<HStack justify='space-between' mb={2}>
															{warning.issuedBy && (
																<HStack spacing={2}>
																	<VStack align='start' spacing={0}>
																		<Text fontSize='xs' color={colors.mutedText}>
																			Issued By
																		</Text>
																		<Text
																			fontSize='xs'
																			fontWeight='medium'
																			color={colors.bodyText}
																		>
																			{warning.issuedBy.fullName}
																		</Text>
																	</VStack>
																</HStack>
															)}
															<Text fontSize='xs' color={colors.mutedText}>
																{formatPostDate(warning.issuedAt)}
															</Text>
														</HStack>

														{/* Warning Amount */}
														<HStack justify='space-between' mb={3}>
															<HStack spacing={1}>
																<Text
																	fontSize='xs'
																	fontWeight='medium'
																	color={colors.mutedText}
																>
																	Warning Deduction:
																</Text>
															</HStack>
															<Text
																fontSize='lg'
																fontWeight='bold'
																color={colors.accentGold}
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
																		color={colors.mutedText}
																	/>
																	<Text
																		fontSize='xs'
																		fontWeight='medium'
																		color={colors.mutedText}
																	>
																		Note
																	</Text>
																</HStack>

																<Box
																	bg={colors.bgInput}
																	border='1px solid'
																	borderColor={colors.borderColor}
																	rounded='md'
																	p={3}
																	fontSize='sm'
																	color={colors.bodyText}
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
																		variant='outline'
																		onClick={() => {
																			setSelectedWarningId(warning._id);
																			setIsConfirmOpen(true);
																		}}
																		isLoading={revokingId === warning._id}
																		borderColor={colors.accentGold}
																		color={colors.accentGold}
																		_hover={{ bg: colors.bgDeep, color: colors.goldLight }}
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

					<Divider borderColor={colors.borderColor} />

					<ModalFooter py={3} bg={colors.footerBg} borderTop='1px solid' borderColor={colors.borderColor}>
						<Button
							onClick={handleClose}
							rounded='lg'
							px={6}
							variant='outline'
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
				<AlertDialogOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
				<AlertDialogContent bg={colors.bg} borderRadius='2xl' boxShadow={colors.modalShadow}>
					<AlertDialogHeader fontSize='lg' fontWeight='bold' bg={colors.headerBg} color={colors.headerText}>
						Revoke Warning Deduction
					</AlertDialogHeader>

					<AlertDialogBody color={colors.bodyText}>
						Are you sure you want to revoke this warning deduction?
						<br />
						<Text mt={2} fontSize='sm' color={colors.mutedText}>
							If you confirm, it will not be applied in the payroll, and this
							action cannot be undone.
						</Text>
					</AlertDialogBody>

					<AlertDialogFooter bg={colors.footerBg} borderTop='1px solid' borderColor={colors.borderColor}>
						<Button
							ref={cancelRef}
							onClick={() => setIsConfirmOpen(false)}
							variant='outline'
						>
							Cancel
						</Button>
						<Button
							variant='brand'
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
			</AlertDialog>
		</>
	);
};

const WarningSkeleton = () => {
	const colors = useModalColors();
	return (
		<HStack align='flex-start' spacing={4} py={2}>
			<SkeletonCircle size='8' />
			<Box flex='1' p={4} rounded='lg' borderWidth='1px' borderColor={colors.borderColor}>
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