import {
	Box,
	Flex,
	Avatar,
	Text,
	Badge,
	IconButton,
	Center,
	HStack,
	VStack,
	Tooltip,
	SimpleGrid,
	CircularProgress,
	Stack,
	Skeleton,
	MenuItem,
	MenuList,
	Icon,
	Menu,
	MenuButton,
} from '@chakra-ui/react';
import {
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
} from '@chakra-ui/react';
import { constant } from 'constant';
import { FiMoreVertical, FiEdit, FiTrash2,FiX } from 'react-icons/fi';
import { FiEye, FiClock, FiUsers, FiCheck, FiBarChart2 } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoData from 'components/Message/NoData';
import { getBadgeColors } from 'utils/colorUtils';
import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const CardSkeleton = () => {
	const colors = useModalColors();
	return (
		<Box
			bg={colors.bg}
			rounded='2xl'
			border='1px solid'
			borderColor={colors.borderColor}
			p={4}
			overflow='hidden'
			boxShadow={colors.cardShadow}
			position='relative'
			minH='240px'
		>
			<Skeleton height='4px' borderTopRadius='2xl' mb={4} />
			<Box
				position='absolute'
				top='4px'
				right={0}
				w='140px'
				h='140px'
				bg={colors.bgInput}
				opacity={0.3}
				borderRadius='0 0 0 100%'
			/>
			<Flex justify='space-between' align='flex-start' mb={4}>
				<Flex gap={3}>
					<Skeleton circle size='64px' />
					<Stack spacing={2}>
						<Skeleton height='18px' width='140px' />
						<Skeleton height='16px' width='90px' />
						<Skeleton height='16px' width='110px' />
					</Stack>
				</Flex>
				<Stack spacing={3}>
					<Skeleton height='32px' width='32px' />
					<Skeleton height='32px' width='32px' />
				</Stack>
			</Flex>
			<Flex gap={6} align='center'>
				<Stack spacing={2} flexShrink={0}>
					<Skeleton height='16px' width='90px' />
					<Skeleton height='16px' width='90px' />
					<Skeleton height='20px' width='110px' />
				</Stack>
				<Skeleton circle size='90px' />
			</Flex>
		</Box>
	);
};

const UserEvaluationCards = ({
	data = [],
	isLoading,
	setView,
	month,
	year,
	confirmDelete,
}) => {
	const colors = useModalColors();
	const navigate = useNavigate();
	const { user: loggedInUser } = useUserSession();
	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		let timer;
		if (isLoading) setDelayedLoading(true);
		else timer = setTimeout(() => setDelayedLoading(false), 400);
		return () => clearTimeout(timer);
	}, [isLoading]);

	const { hasPermission } = usePermissions();

	return (
		<Box my={4}>
			{delayedLoading ? (
				<SimpleGrid
					columns={{ base: 1, md: 2, lg: 2, xl: 3, '2xl': 4 }}
					spacing={4}
				>
					{Array.from({ length: 12 }).map((_, i) => (
						<CardSkeleton key={i} />
					))}
				</SimpleGrid>
			) : data.length === 0 ? (
				<Center py={10}>
					<NoData label='user evaluation' />
				</Center>
			) : (
				<SimpleGrid
					columns={{ base: 1, md: 2, lg: 2, xl: 3, '2xl': 4 }}
					spacing={4}
				>
					{data.map((user) => {
						const evaluation = user?.evaluation?.[0] || {};
						const roleName = user?.roles?.[0]?.roleName || 'Unknown';
						const agencyName = user?.agency?.name || 'No Agency';

						const { bg: roleBg, text: roleText } = getBadgeColors(roleName);
						const { bg: agencyBg, text: AgencyText } =
							getBadgeColors(agencyName);

						const isPayrollPaid =
							user?.payslip?.paymentStatus === 'paid' ?? false;
						const isEvaluated = user?.hasEvaluated ?? false;

						const canAddEvaluation =
							!evaluation?.evaluations?.find(
								(e) => e?.evaluator === loggedInUser?._id,
							) && !isPayrollPaid;

						const getPerfColor = (percentage = 0) => {
							if (percentage >= 70) return 'green';
							if (percentage >= 50) return 'yellow';
							return 'red';
						};

						const isMenuAllowed =
							!isPayrollPaid &&
							(hasPermission('evaluation', 'edit') ||
								hasPermission('evaluation', 'delete_monthly'));

						const perfColor = getPerfColor(evaluation?.finalPercentage);
						const imgSrc = user?.profileImage
							? `${constant.baseUrl}${user.profileImage}`
							: undefined;

						return (
							<Box
								key={user?._id}
								bg={colors.bg}
								rounded='2xl'
								border='1px solid'
								borderColor={colors.borderColor}
								p={3}
								overflow='hidden'
								boxShadow={colors.cardShadow}
								transition='transform .2s, box-shadow .2s'
								_hover={{ transform: 'translateY(-3px)', boxShadow: colors.modalShadow }}
								position='relative'
							>
								{/* Top bar */}
								<Box
									position='absolute'
									left={0}
									top={0}
									w='100%'
									h='4px'
									bgGradient={`linear(to-r, ${perfColor}.400, ${perfColor}.600, ${perfColor}.400)`}
									borderTopRadius='2xl'
								/>

								{/* Glow box */}
								<Box
									position='absolute'
									top='4px'
									right={0}
									w='140px'
									h='140px'
									// bgGradient={`linear(45deg, transparent 30%, ${perfColor}.50 100%)`}
  bgGradient={`linear(135deg, transparent 30%, ${perfColor}.200 100%)`}

									opacity={0.1}
									borderRadius='0 0 0 100%'
									transition='all 0.3s ease'
								/>

								<Flex justify='space-between' align='flex-start' mb={4}>
									<Flex gap={3}>
										<Avatar size='lg' name={user?.fullName} src={imgSrc} />
										<Stack spacing={1}>
											<Text isTruncated maxW='145px' fontWeight='bold' color={colors.headingText}>
												{user?.fullName}
											</Text>

											<Badge
												bg={roleBg}
												color={roleText}
												rounded='full'
												px={2}
												py={0.5}
												fontSize='xs'
												width='fit-content'
											>
												{roleName}
											</Badge>

											<Badge
												bg={agencyBg}
												color={AgencyText}
												rounded='full'
												px={2}
												py={0.5}
												fontSize='xs'
												width='fit-content'
											>
												{agencyName}
											</Badge>
										</Stack>
									</Flex>

									{/* Actions */}
									<Flex gap={1}>
										{isPayrollPaid && (
											<Badge
												colorScheme='green'
												variant='subtle'
												fontSize='.8em'
												px={4}
												py={2}
												borderRadius='full'
											>
												Payroll Paid
											</Badge>
										)}

										{isEvaluated && (
											<>
												<Tooltip label='View'>
													<IconButton
														size='sm'
														icon={<FiEye />}
														variant='ghost'
														onClick={() => setView({ modal: true, data: user })}
													/>
												</Tooltip>

												{isMenuAllowed && (
													<Menu placement='bottom-end'>
														<Tooltip label='Actions'>
															<MenuButton
																as={IconButton}
																icon={<FiMoreVertical />}
																variant='ghost'
																size='sm'
															/>
														</Tooltip>

														<MenuList minW='100px' bg={colors.bg} borderColor={colors.borderColor}>
															{hasPermission('evaluation', 'edit') && (
																<MenuItem
																	isDisabled={evaluation.payrollProcessed}
																	fontSize='sm'
																	icon={<FiEdit />}
																	color={colors.bodyText}
																	_hover={{ bg: colors.bgDeep, color: colors.accentGold }}
																	onClick={() =>
																		navigate(
																			`/evaluation/edit-user-evaluation/role/${user?.roles?.[0]?._id}/user/${user?._id}?month=${month}&year=${year}`,
																		)
																	}
																>
																	Edit
																</MenuItem>
															)}

															{hasPermission(
																'evaluation',
																'delete_monthly',
															) && (
																<MenuItem
																	fontSize='sm'
																	icon={<FiTrash2 />}
																	color={colors.badgeErrorText}
																	_hover={{ bg: colors.bgDeep, color: colors.badgeErrorText }}
																	onClick={() => {
																		setSelectedUser(user);
																		onOpen();
																	}}
																>
																	Delete
																</MenuItem>
															)}
														</MenuList>
													</Menu>
												)}
											</>
										)}

										{canAddEvaluation && (
											<Tooltip label='Add Evaluation'>
												<IconButton
													size='sm'
													icon={<FaPlus />}
													variant='ghost'
													onClick={() =>
														navigate(
															`/evaluation/user-evaluation/role/${user?.roles?.[0]?._id}/user/${user?._id}?month=${month}&year=${year}`,
														)
													}
												/>
											</Tooltip>
										)}
									</Flex>
								</Flex>

								{/* Stats + Circular Progress */}
								<Flex
									gap={isEvaluated || isPayrollPaid ? '8' : '8'}
									align='center'
									mb={4}
									flexWrap='nowrap'
								>
									<VStack
										spacing={3}
										align='stretch'
										flex='1'
										minW='100px'
										maxW='300px'
									>
										<HStack justify='space-between'>
											<HStack spacing={2}>
												<Icon as={FiUsers} boxSize={4} color={colors.mutedText} />
												<Text fontSize='sm' color={colors.mutedText}>
													Evaluators
												</Text>
											</HStack>
											<Badge
												px={2}
												py={1}
												fontSize='sm'
												rounded='full'
												bg={colors.badgeInfoBg}
												color={colors.badgeInfoText}
											>
												{evaluation.totalEvaluators ?? 0}
											</Badge>
										</HStack>

										<HStack justify='space-between'>
											<HStack spacing={2}>
												<Icon
													as={FiBarChart2}
													boxSize={4}
													color={colors.mutedText}
												/>
												<Text fontSize='sm' color={colors.mutedText}>
													Average
												</Text>
											</HStack>
											<Badge
												px={2}
												py={1}
												fontSize='sm'
												rounded='full'
												bg={colors.badgeInfoBg}
												color={colors.badgeInfoText}
											>
												{evaluation.finalAvg ?? 0}
											</Badge>
										</HStack>

										<Badge
											position='absolute'
											left={3}
											bottom={{ base: 7, lg: 7 }}
											px={{ base: 2, md: 2.5, lg: 3 }}
											py={{ base: 0.5, md: 0.75, lg: 1 }}
											fontSize={{ base: '10px', md: 'sm', lg: 'sm' }}
											rounded='full'
											colorScheme={user?.hasEvaluated ? 'green' : 'yellow'}
											display='inline-flex'
											alignItems='center'
											gap={{ base: 0.5, lg: 1 }}
										>
											{!user?.hasEvaluated ? (
												<>
													<Icon as={FiClock} boxSize={{ base: 3, lg: 4 }} />
													Not Evaluated
												</>
											) : (
												<>
													<Icon as={FiCheck} boxSize={{ base: 3, lg: 4 }} />
													Evaluated
												</>
											)}
										</Badge>
									</VStack>

									<Flex direction='column' align='center' gap={2}>
										<Center>
											<Box position='relative'>
												<CircularProgress
													value={evaluation?.finalPercentage ?? 0}
													color={
														evaluation?.finalPercentage > 70
															? 'green.500'
															: evaluation?.finalPercentage >= 50
																? 'yellow.500'
																: 'red.500'
													}
													size={{ base: '70px', lg: '90px' }}
													thickness='7px'
												/>
												<Center position='absolute' inset={0}>
													<Text fontWeight='bold' color={colors.headingText}>
														{Math.round(evaluation?.finalPercentage ?? 0)}%
													</Text>
												</Center>
											</Box>
										</Center>
										<Flex align='center' gap={2}>
											<Text fontWeight='bold' fontSize='11px' color={colors.mutedText}>
												Performance
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Box>
						);
					})}
				</SimpleGrid>
			)}

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
				<ModalContent bg={colors.bg} borderRadius='xl' boxShadow={colors.modalShadow}>
					<ModalHeader bg={colors.headerBg} color={colors.headerText} borderTopRadius='xl'>
						Delete Evaluation
					</ModalHeader>
					<ModalCloseButton color={colors.headerText} />
					<ModalBody color={colors.bodyText}>
					  <Flex direction='column' align='center' textAlign='center'>
							{/* Warning Icon */}
							<Flex
							  align='center'
							  justify='center'
							  bg='rgba(238, 93, 80, 0.12)'
							  border='2px solid'
							  borderColor='rgba(238, 93, 80, 0.3)'
							  borderRadius='full'
							  w='64px'
							  h='64px'
							  mb={4}
							>
							  <Icon as={FiTrash2} color='red.400' boxSize={7} />
							</Flex>

							{/* Message */}
							<Text fontSize='md' color={colors.bodyText} lineHeight='1.6'>
							  Are you sure you want to delete this user's evaluation for this month?
							</Text>


						  </Flex>
					</ModalBody>
				 <ModalFooter
					  bg={colors.footerBg}
					  borderTop='2px solid'
					  borderColor={colors.headerBg}
					  py={4}
					  px={6}
					  gap={3}
					>
					  <Button
						variant='ghost'
						rounded='md'
						onClick={onClose}
						isDisabled={isLoading}
						color={colors.secondaryBtnText}
						_hover={{
						  bg: colors.secondaryBtnHoverBg,
						  color: colors.secondaryBtnHoverText,
						}}
						leftIcon={<FiX />}
					  >
						Cancel
					  </Button>
					  <Button
						rounded='md'
						isLoading={isLoading}
						isDisabled={isLoading}
						onClick={() =>
						  confirmDelete(selectedUser?._id, month, year, onClose, "USEREVAL")
						}
						bg='red.500'
						color='white'
						fontWeight='bold'
						px={6}
						_hover={{
						  bg: 'red.600',
						  boxShadow: '0 4px 15px rgba(238, 93, 80, 0.4)',
						  transform: 'translateY(-1px)',
						}}
						_active={{
						  bg: 'red.700',
						  transform: 'translateY(0)',
						}}
						_disabled={{
						  opacity: 0.6,
						  cursor: 'not-allowed',
						  transform: 'none',
						  boxShadow: 'none',
						}}
						leftIcon={<FiTrash2 />}
					  >
						Delete
					  </Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default UserEvaluationCards;